import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { AppError, notFound } from '../../common/errors';
import { parse } from '../../common/validation';
import { DatabaseService } from '../../database/database.service';
import { UsersRepository } from '../users/users.repository';
import { CURRENCY_INFO } from '../wallet/currency';
import { toBalancesModel, WalletService } from '../wallet/wallet.service';
import { StoreItemModel, StorePurchaseResultModel } from './store.models';
import { StoreCategory, StoreRepository } from './store.repository';

const listSchema = z.enum(['avatars', 'accessories', 'equipments']).nullish();

const buySchema = z.object({
  itemId: z.number().int().positive(),
  currency: z.enum(['GRANDO', 'MYGG']),
});

const DEMO_ITEMS_KEPT = 5;

@Injectable()
export class StoreService {
  constructor(
    private readonly store: StoreRepository,
    private readonly users: UsersRepository,
    private readonly wallet: WalletService,
    private readonly db: DatabaseService,
  ) {}

  async list(userId: number, category: unknown): Promise<StoreItemModel[]> {
    const parsed = parse(listSchema, category) ?? null;
    return this.store.list(userId, parsed as StoreCategory | null);
  }

  async buy(userId: number, input: unknown): Promise<StorePurchaseResultModel> {
    const { itemId, currency } = parse(buySchema, input);

    const user = await this.users.findById(userId);
    if (!user) throw notFound('User');
    if (user.isFrozen)
      throw new AppError('This account is frozen. Please contact support.', 403, 'account_frozen');

    const item = await this.store.findActive(itemId);
    if (!item) throw notFound('Item');
    const price = currency === 'GRANDO' ? item.priceGrando : item.priceMygg;
    if (!price) {
      throw new AppError(
        `${item.name} cannot be bought with ${CURRENCY_INFO[currency].name}`,
        400,
        'invalid_request',
      );
    }

    const balances = await this.db.transaction(async (tx) => {
      if (user.isDemo) await this.store.trimOwnership(user.id, DEMO_ITEMS_KEPT - 1, tx);
      if (!(await this.store.addOwnership(user.id, item.id, currency, price, tx))) {
        throw new AppError('You already own this item', 409, 'conflict');
      }
      return this.wallet.move(tx, {
        userId: user.id,
        changes: { [currency]: -price },
        reason: 'store_purchase',
        description: item.name,
        requireFunds: true,
      });
    });

    return {
      item: { ...item, owned: true },
      paidCurrency: currency,
      paidAmount: price,
      balances: toBalancesModel(balances),
    };
  }
}
