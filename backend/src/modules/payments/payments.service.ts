import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { z } from 'zod';
import { AppError, notFound } from '../../common/errors';
import { parse } from '../../common/validation';
import { config } from '../../config/config';
import { DatabaseService } from '../../database/database.service';
import { Package, PackagesRepository } from '../packages/packages.repository';
import { User, UsersRepository } from '../users/users.repository';
import { BalanceChange, formatBaht } from '../wallet/currency';
import { WalletService } from '../wallet/wallet.service';
import { OmiseCharge, OmiseClient, OmiseError, OmiseEvent } from './omise.client';
import { Order, OrdersRepository } from './orders.repository';
import { CheckoutResultModel, OrderModel, PaymentConfigModel, PaymentMethodModel } from './payment.models';
import { MAX_CHARGE_SATANG, MIN_CHARGE_SATANG, MYGG_COINS_METHOD, OMISE_METHODS } from './payment-methods';

const PROMPTPAY_TTL_MS = 15 * 60 * 1000;
const STATUS_CHECK_INTERVAL_SECONDS = 5;
const SWEEP_INTERVAL_MS = 5 * 60 * 1000;
const SWEEP_BATCH = 25;

const checkoutSchema = z.object({
  packageId: z.number().int().positive(),
  method: z.string().trim().min(1).max(40),
  cardToken: z
    .string()
    .trim()
    .regex(/^tokn_\w+$/, 'must be an Omise card token')
    .nullish(),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^0\d{9}$/, 'must be a 10-digit phone number starting with 0')
    .nullish(),
});

type CheckoutData = z.infer<typeof checkoutSchema>;

const orderId = z.uuid('must be an order id');
const isOrderId = (value: string): boolean => orderId.safeParse(value).success;

const iso = (date: Date | null): string | null => (date ? date.toISOString() : null);

const qrCodeOf = (charge: OmiseCharge): string | null =>
  charge.source?.scannable_code?.image?.download_uri ?? null;

function idOf(value: unknown): string | null {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && typeof (value as { id?: unknown }).id === 'string') {
    return (value as { id: string }).id;
  }
  return null;
}

function grantOf(order: Pick<Order, 'grantCurrency' | 'grantAmount' | 'bonusTickets'>): BalanceChange {
  const changes: BalanceChange = { [order.grantCurrency]: order.grantAmount };
  if (order.bonusTickets) changes.TICKET = order.bonusTickets;
  return changes;
}

const negate = (changes: BalanceChange): BalanceChange =>
  Object.fromEntries(Object.entries(changes).map(([currency, amount]) => [currency, -(amount ?? 0)]));

export function toOrderModel(order: Order): OrderModel {
  const pending = order.status === 'pending';
  return {
    id: order.id,
    status: order.status,
    method: order.method,
    packageId: order.packageId,
    packageName: order.packageName,
    amountSatang: order.amountSatang,
    amount: order.amountSatang / 100,
    amountCoins: order.amountCoins,
    currency: order.currency,
    grantCurrency: order.grantCurrency,
    grantAmount: order.grantAmount,
    bonusTickets: order.bonusTickets,
    authorizeUri: pending ? order.authorizeUri : null,
    qrCodeUri: pending ? order.qrCodeUri : null,
    failureCode: order.failureCode,
    failureMessage: order.failureMessage,
    expiresAt: iso(order.expiresAt),
    paidAt: iso(order.paidAt),
    createdAt: order.createdAt.toISOString(),
  };
}

/**
 * Omise moves the money; this service decides what the player receives for it. Currency is only
 * ever credited from a charge fetched from Omise with the secret key (webhook, status poll or the
 * sweeper), never from the browser's redirect back to the website.
 */
@Injectable()
export class PaymentsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PaymentsService.name);
  private sweepTimer: NodeJS.Timeout | null = null;
  private sweeping = false;

  constructor(
    private readonly db: DatabaseService,
    private readonly orders: OrdersRepository,
    private readonly packages: PackagesRepository,
    private readonly users: UsersRepository,
    private readonly wallet: WalletService,
    private readonly omise: OmiseClient,
  ) {}

  onModuleInit(): void {
    if (!config.omise.enabled || config.isTest) return;
    // Omise does not promise to retry a failed webhook, so pending charges are re-checked on a timer
    this.sweepTimer = setInterval(() => void this.reconcilePending(), SWEEP_INTERVAL_MS);
    this.sweepTimer.unref();
  }

  onModuleDestroy(): void {
    if (this.sweepTimer) clearInterval(this.sweepTimer);
  }

  paymentConfig(): PaymentConfigModel {
    const methods: PaymentMethodModel[] = [
      {
        type: MYGG_COINS_METHOD,
        label: 'MYGG Coins',
        group: 'coins',
        online: false,
        mobileOnly: false,
        requiresPhone: false,
        maxAmountSatang: null,
      },
    ];
    if (config.omise.enabled) {
      for (const type of config.omise.methods) {
        const info = OMISE_METHODS[type];
        if (!info) continue;
        methods.push({
          type,
          label: info.label,
          group: info.group,
          online: true,
          mobileOnly: Boolean(info.mobileOnly),
          requiresPhone: Boolean(info.requiresPhone),
          maxAmountSatang: info.maxSatang ?? MAX_CHARGE_SATANG,
        });
      }
    }
    return {
      enabled: config.omise.enabled,
      testMode: config.omise.testMode,
      publicKey: config.omise.enabled ? (config.omise.publicKey ?? null) : null,
      currency: 'THB',
      minAmountSatang: MIN_CHARGE_SATANG,
      methods,
    };
  }

  async checkout(userId: number, input: unknown): Promise<CheckoutResultModel> {
    const data = parse(checkoutSchema, input);

    const user = await this.users.findById(userId);
    if (!user) throw notFound('User');
    if (user.isFrozen)
      throw new AppError('This account is frozen. Please contact support.', 403, 'account_frozen');

    const pkg = await this.packages.findActive(data.packageId);
    if (!pkg) throw notFound('Package');

    return data.method === MYGG_COINS_METHOD
      ? this.payWithCoins(user, pkg)
      : this.payWithOmise(user, pkg, data);
  }

  private async payWithCoins(user: User, pkg: Package): Promise<CheckoutResultModel> {
    const priceCoins = pkg.priceCoins;
    if (pkg.grantCurrency !== 'GRANDO' || !priceCoins) {
      throw new AppError('This package cannot be bought with MYGG Coins', 400, 'invalid_request');
    }

    const order = await this.db.transaction(async (tx) => {
      const created = await this.orders.create(
        {
          userId: user.id,
          packageId: pkg.id,
          method: MYGG_COINS_METHOD,
          amountSatang: 0,
          amountCoins: priceCoins,
          grantCurrency: 'GRANDO',
          grantAmount: pkg.grantAmount,
          bonusTickets: pkg.bonusTickets,
          status: 'paid',
        },
        tx,
      );
      await this.wallet.move(tx, {
        userId: user.id,
        changes: { MYGG: -priceCoins, ...grantOf(created) },
        reason: 'package',
        description: pkg.name,
        orderId: created.id,
        requireFunds: true,
      });
      return created;
    });

    return this.checkoutResult(order);
  }

  private async payWithOmise(user: User, pkg: Package, data: CheckoutData): Promise<CheckoutResultModel> {
    if (!config.omise.enabled) {
      throw new AppError(
        'Online payment is not set up yet. Pay with MYGG Coins instead.',
        503,
        'service_unavailable',
      );
    }
    const method = OMISE_METHODS[data.method];
    if (!method || !config.omise.methods.includes(data.method)) {
      throw new AppError('This payment method is not available', 400, 'invalid_request');
    }
    // On live keys the shared demo account would spend real money of whoever happened to open the site
    if (user.isDemo && !config.omise.testMode) {
      throw new AppError(
        'The demo account cannot make real payments. Sign up for your own account to top up.',
        403,
        'forbidden',
      );
    }
    if (data.method === 'card' && !data.cardToken) {
      throw new AppError('cardToken is required for card payments', 400, 'invalid_request');
    }
    if (method.requiresPhone && !data.phoneNumber) {
      throw new AppError('phoneNumber is required for this payment method', 400, 'invalid_request');
    }
    const max = method.maxSatang ?? MAX_CHARGE_SATANG;
    if (pkg.priceSatang < MIN_CHARGE_SATANG || pkg.priceSatang > max) {
      throw new AppError(
        `${method.label} accepts ${formatBaht(MIN_CHARGE_SATANG)} to ${formatBaht(max)} per payment`,
        400,
        'invalid_request',
      );
    }

    // The amount comes from the package row; the browser only ever sends a package id and a method
    const order = await this.orders.create({
      userId: user.id,
      packageId: pkg.id,
      method: data.method,
      amountSatang: pkg.priceSatang,
      amountCoins: 0,
      grantCurrency: pkg.grantCurrency,
      grantAmount: pkg.grantAmount,
      bonusTickets: pkg.bonusTickets,
      status: 'pending',
    });

    const params: Record<string, string> = {
      amount: String(order.amountSatang),
      currency: 'THB',
      description: `Grandora ${pkg.name} - order ${order.id}`,
      return_uri: `${config.frontendUrl}/package/payment-result?orderId=${order.id}`,
      'metadata[order_id]': order.id,
      'metadata[user_id]': String(user.id),
      'metadata[package]': pkg.code,
    };
    if (data.method === 'card') {
      params.card = data.cardToken!;
    } else {
      params['source[type]'] = data.method;
      if (method.requiresPhone) params['source[phone_number]'] = data.phoneNumber!;
    }
    if (data.method === 'promptpay') {
      params.expires_at = new Date(Date.now() + PROMPTPAY_TTL_MS).toISOString();
    }

    let charge: OmiseCharge;
    try {
      charge = await this.omise.createCharge(params);
    } catch (err) {
      const failure =
        err instanceof OmiseError ? err : new OmiseError((err as Error).message, 500, 'omise_error');
      await this.orders.close(order.id, 'failed', failure.code, failure.message);
      this.logger.warn({ err, orderId: order.id }, 'Omise refused the charge');
      throw new AppError(`Payment failed: ${failure.message}`, 402, 'payment_failed');
    }

    await this.orders.attachCharge(order.id, {
      chargeId: charge.id,
      authorizeUri: charge.authorize_uri ?? null,
      qrCodeUri: qrCodeOf(charge),
      expiresAt: charge.expires_at ?? null,
    });

    // A card charge without 3-D Secure is final already, and Omise sends no charge.complete for it
    const latest = (await this.applyCharge(charge)) ?? (await this.orders.findById(order.id));
    return this.checkoutResult(latest!);
  }

  private checkoutResult(order: Order): CheckoutResultModel {
    const model = toOrderModel(order);
    let nextAction = 'none';
    if (order.status === 'pending') {
      nextAction = model.qrCodeUri ? 'qr' : model.authorizeUri ? 'redirect' : 'wait';
    }
    return { order: model, nextAction, authorizeUri: model.authorizeUri, qrCodeUri: model.qrCodeUri };
  }

  /**
   * Brings an order in line with a charge fetched from Omise. The row lock and the pending-only
   * status change make a repeated webhook, poll or sweep a no-op instead of a second credit.
   */
  async applyCharge(charge: OmiseCharge): Promise<Order | null> {
    const metadataOrderId = typeof charge.metadata?.order_id === 'string' ? charge.metadata.order_id : null;

    return this.db.transaction(async (tx) => {
      const order =
        (metadataOrderId && isOrderId(metadataOrderId)
          ? await this.orders.lock(metadataOrderId, tx)
          : null) ?? (await this.orders.lockByChargeId(charge.id, tx));
      if (!order) {
        this.logger.warn({ chargeId: charge.id }, 'Omise charge does not match any order');
        return null;
      }
      if (order.omiseChargeId && order.omiseChargeId !== charge.id) {
        this.logger.warn({ orderId: order.id, chargeId: charge.id }, 'charge belongs to a different order');
        return order;
      }
      if (order.status !== 'pending') return order;

      if (charge.status === 'successful' && charge.paid) {
        if (charge.amount !== order.amountSatang || charge.currency.toUpperCase() !== order.currency) {
          this.logger.error(
            { orderId: order.id, chargeId: charge.id, amount: charge.amount, currency: charge.currency },
            'paid amount does not match the order',
          );
          return this.orders.close(
            order.id,
            'failed',
            'amount_mismatch',
            'The paid amount does not match the order',
            tx,
          );
        }

        const paid = await this.orders.markPaid(order.id, charge.id, tx);
        if (!paid) return order;
        await this.wallet.move(tx, {
          userId: order.userId,
          changes: grantOf(order),
          reason: order.grantCurrency === 'MYGG' ? 'topup' : 'package',
          description: order.packageName,
          orderId: order.id,
        });
        this.logger.log({ orderId: order.id, chargeId: charge.id }, 'order paid');
        return paid;
      }

      if (charge.status === 'failed' || charge.status === 'reversed') {
        return this.orders.close(
          order.id,
          'failed',
          charge.failure_code,
          charge.failure_message ?? 'The payment was not completed',
          tx,
        );
      }
      if (charge.status === 'expired') {
        return this.orders.close(
          order.id,
          'expired',
          charge.failure_code,
          charge.failure_message ?? 'The payment expired',
          tx,
        );
      }
      return order;
    });
  }

  async reconcileCharge(chargeId: string): Promise<Order | null> {
    return this.applyCharge(await this.omise.retrieveCharge(chargeId));
  }

  async getOrder(userId: number, id: string): Promise<OrderModel> {
    if (!isOrderId(id)) throw notFound('Order');
    let order = await this.orders.findForUser(id, userId);
    if (!order) throw notFound('Order');

    if (
      order.status === 'pending' &&
      order.omiseChargeId &&
      config.omise.enabled &&
      (await this.orders.claimStatusCheck(order.id, STATUS_CHECK_INTERVAL_SECONDS))
    ) {
      try {
        order = (await this.reconcileCharge(order.omiseChargeId)) ?? order;
      } catch (err) {
        this.logger.warn({ err, orderId: order.id }, 'could not check the charge with Omise');
      }
    }
    return toOrderModel(order);
  }

  async myOrders(userId: number): Promise<OrderModel[]> {
    return (await this.orders.listForUser(userId, 20)).map(toOrderModel);
  }

  async simulate(userId: number, id: string, result: 'paid' | 'failed'): Promise<OrderModel> {
    if (!config.omise.enabled || !config.omise.testMode) {
      throw new AppError('Payments can only be simulated with Omise test keys', 403, 'forbidden');
    }
    if (!isOrderId(id)) throw notFound('Order');
    const order = await this.orders.findForUser(id, userId);
    if (!order) throw notFound('Order');
    if (order.status !== 'pending' || !order.omiseChargeId) {
      throw new AppError('Only a pending online payment can be simulated', 400, 'invalid_request');
    }

    try {
      await this.omise.markCharge(order.omiseChargeId, result);
    } catch (err) {
      throw new AppError(
        `Omise could not simulate this payment: ${(err as Error).message}`,
        400,
        'payment_failed',
      );
    }
    return toOrderModel((await this.reconcileCharge(order.omiseChargeId)) ?? order);
  }

  async handleEvent(event: OmiseEvent): Promise<void> {
    const { key, data } = event;

    if (key.startsWith('charge.')) {
      if (data.object === 'charge' && typeof data.id === 'string') await this.reconcileCharge(data.id);
      return;
    }

    if (key === 'refund.create') {
      const chargeId = idOf(data.charge);
      if (!chargeId) return;
      const charge = await this.omise.retrieveCharge(chargeId);
      if ((charge.refunded_amount ?? 0) > 0) await this.reverse(charge.id, 'refunded');
      return;
    }

    if (key === 'dispute.create' && typeof data.id === 'string') {
      const dispute = await this.omise.retrieveDispute(data.id);
      const chargeId = idOf(dispute.charge);
      if (chargeId) await this.reverse(chargeId, 'disputed');
    }
  }

  /**
   * A refund or chargeback takes the currency back even if it has been spent. A balance below zero,
   * or any chargeback, freezes the account until support has looked at it.
   */
  private async reverse(chargeId: string, status: 'refunded' | 'disputed'): Promise<void> {
    await this.db.transaction(async (tx) => {
      const order = await this.orders.lockByChargeId(chargeId, tx);
      if (!order) return;
      const reversed = await this.orders.markReversed(order.id, status, tx);
      if (!reversed) return;

      const balances = await this.wallet.move(tx, {
        userId: order.userId,
        changes: negate(grantOf(order)),
        reason: status === 'refunded' ? 'refund' : 'chargeback',
        description: order.packageName,
        orderId: order.id,
      });
      if (status === 'disputed' || Object.values(balances).some((balance) => balance < 0)) {
        await this.users.setFrozen(order.userId, true, tx);
      }
      this.logger.warn({ orderId: order.id, chargeId, status }, 'order reversed');
    });
  }

  async reconcilePending(): Promise<void> {
    if (this.sweeping) return;
    this.sweeping = true;
    try {
      for (const { id, omiseChargeId } of await this.orders.listStalePending(SWEEP_BATCH)) {
        try {
          if (await this.orders.claimStatusCheck(id, 60)) await this.reconcileCharge(omiseChargeId);
        } catch (err) {
          this.logger.warn({ err, orderId: id }, 'pending order check failed');
        }
      }
    } catch (err) {
      this.logger.error({ err }, 'pending order sweep failed');
    } finally {
      this.sweeping = false;
    }
  }
}
