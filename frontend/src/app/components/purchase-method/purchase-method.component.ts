import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, interval, startWith, switchMap, takeWhile } from 'rxjs';
import {
  Balances,
  CheckoutResult,
  Order,
  PackageItem,
  PaymentConfig,
  PaymentMethod,
} from 'src/app/core/models';
import { AuthService } from 'src/app/core/services/auth.service';
import { PackageService } from 'src/app/core/services/package.service';
import { PaymentService, errorMessage } from 'src/app/core/services/payment.service';
import { PlayerService } from 'src/app/core/services/player.service';

type Step = 'choose' | 'qr' | 'result';

export const PENDING_ORDER_KEY = 'pendingOrderId';
const POLL_INTERVAL_MS = 3000;

@Component({
  selector: 'app-purchase-method',
  templateUrl: './purchase-method.component.html',
  styleUrls: ['./purchase-method.component.scss'],
})
export class PurchaseMethodComponent implements OnDestroy {
  isPackageContainerDisplay: boolean = false;
  isPackageContentDisplay: boolean = false;
  packageInfo: PackageItem | undefined;
  packageContainerTimeout: any;

  cardForm!: FormGroup;
  phoneNumber = '';

  step: Step = 'choose';
  config: PaymentConfig | null = null;
  balances: Balances | null = null;
  isDemo = false;
  selected = '';
  isProcessing = false;
  errorMessage = '';
  order: Order | null = null;
  qrCodeUri: string | null = null;
  today = new Date();

  private readonly isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  private polling?: Subscription;
  private subscriptions = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private packageService: PackageService,
    private paymentService: PaymentService,
    private playerService: PlayerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cardFormInit();
    this.subscribePackageService();
  }

  ngOnDestroy(): void {
    this.stopPolling();
    this.subscriptions.unsubscribe();
  }

  subscribePackageService() {
    this.subscriptions.add(
      this.packageService.getPackageInfo().subscribe((value) => {
        this.packageInfo = value;
        if (value) this.open();
      })
    );
    this.subscriptions.add(
      this.packageService
        .getIsPackageContainertDisplay()
        .subscribe((value) => (this.isPackageContainerDisplay = value))
    );
    this.subscriptions.add(
      this.packageService
        .getIsPackageContentDisplay()
        .subscribe((value) => (this.isPackageContentDisplay = value))
    );
    this.subscriptions.add(
      this.playerService.getBalances().subscribe((value) => (this.balances = value))
    );
    this.subscriptions.add(this.authService.isDemo.subscribe((value) => (this.isDemo = value)));
  }

  cardFormInit() {
    this.cardForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.maxLength(80)]],
      card_number: [null, [Validators.required, Validators.pattern(/^[0-9 ]{12,23}$/)]],
      expiry_date: [null, [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\s*\/\s*\d{2}$/)]],
      cvv: [null, [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
    });
  }

  private open() {
    this.step = 'choose';
    this.order = null;
    this.qrCodeUri = null;
    this.errorMessage = '';
    this.isProcessing = false;
    this.cardForm?.reset();
    this.playerService.getCurrencyData();
    this.paymentService.getConfig().subscribe({
      next: (config) => {
        this.config = config;
        this.selected = this.defaultMethod();
      },
      error: (err) => (this.errorMessage = errorMessage(err, 'Payment methods could not be loaded.')),
    });
  }

  get item(): PackageItem | undefined {
    return this.packageInfo?.grantAmount ? this.packageInfo : undefined;
  }

  get grantLabel(): string {
    const item = this.item;
    if (!item) return '';
    const unit = item.grantCurrency === 'MYGG' ? 'MYGG Coins' : 'Grando';
    const tickets = item.bonusTickets ? ` & ${item.bonusTickets} Ticket` : '';
    return `${item.grantAmount.toLocaleString('en-US')} ${unit}${tickets}`;
  }

  get priceLabel(): string {
    if (!this.item) return '';
    if (this.selected === 'mygg_coins') return `${(this.item.priceCoins ?? 0).toLocaleString('en-US')} MYGG`;
    return `THB ${(this.item.priceSatang / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }

  get methods(): PaymentMethod[] {
    return this.config?.methods ?? [];
  }

  get selectedMethod(): PaymentMethod | undefined {
    return this.methods.find((method) => method.type === this.selected);
  }

  get onlineBlockedForDemo(): boolean {
    return this.isDemo && !!this.config?.enabled && !this.config.testMode;
  }

  isAvailable(method: PaymentMethod): boolean {
    const item = this.item;
    if (!item) return false;
    if (method.type === 'mygg_coins') {
      return item.kind === 'grando' && !!item.priceCoins && (this.balances?.myggCoins ?? 0) >= item.priceCoins;
    }
    if (!this.config?.enabled || this.onlineBlockedForDemo) return false;
    if (method.mobileOnly && !this.isMobile) return false;
    return !method.maxAmountSatang || item.priceSatang <= method.maxAmountSatang;
  }

  methodHint(method: PaymentMethod): string {
    const item = this.item;
    if (method.type === 'mygg_coins') {
      if (item?.kind !== 'grando') return 'Cannot buy MYGG Coins';
      const balance = this.balances?.myggCoins ?? 0;
      return balance >= (item?.priceCoins ?? 0)
        ? `Balance ${balance.toLocaleString('en-US')} MYGG`
        : `Not enough (${balance.toLocaleString('en-US')} MYGG)`;
    }
    if (!this.config?.enabled) return 'Not configured yet';
    if (this.onlineBlockedForDemo) return 'Sign up to pay';
    if (method.mobileOnly && !this.isMobile) return 'Mobile only';
    if (item && method.maxAmountSatang && item.priceSatang > method.maxAmountSatang) return 'Amount too high';
    switch (method.group) {
      case 'card':
        return 'Visa · Mastercard · JCB';
      case 'qr':
        return 'Scan a QR code';
      case 'banking':
        return 'Opens your bank app';
      default:
        return 'Pay in the app';
    }
  }

  private defaultMethod(): string {
    const available = this.methods.filter((method) => this.isAvailable(method));
    return (available.find((method) => method.type === 'mygg_coins') ?? available[0])?.type ?? '';
  }

  select(method: PaymentMethod) {
    if (!this.isAvailable(method)) return;
    this.selected = method.type;
    this.errorMessage = '';
  }

  async handleSubmit() {
    const item = this.item;
    if (!item || !this.selected || this.isProcessing) return;
    this.errorMessage = '';

    if (this.selected === 'card' && this.cardForm.invalid) {
      this.cardForm.markAllAsTouched();
      this.errorMessage = 'Please enter valid card details in the highlighted fields and try again.';
      return;
    }
    if (this.selectedMethod?.requiresPhone && !/^0\d{9}$/.test(this.phoneNumber.trim())) {
      this.errorMessage = 'Enter the 10-digit phone number of your wallet, starting with 0.';
      return;
    }

    this.isProcessing = true;
    try {
      let cardToken: string | null = null;
      if (this.selected === 'card') {
        const { name, card_number, expiry_date, cvv } = this.cardForm.value;
        const [month, year] = String(expiry_date).split('/').map((part: string) => Number(part.trim()));
        cardToken = await this.paymentService.createCardToken(this.config!.publicKey!, {
          name,
          number: card_number,
          expirationMonth: month,
          expirationYear: 2000 + year,
          securityCode: cvv,
        });
      }

      this.paymentService
        .checkout({
          packageId: item.id,
          method: this.selected,
          cardToken,
          phoneNumber: this.selectedMethod?.requiresPhone ? this.phoneNumber.trim() : null,
        })
        .subscribe({
          next: (result) => this.handleResult(result),
          error: (err) => {
            this.isProcessing = false;
            this.errorMessage = errorMessage(err);
          },
        });
    } catch (err) {
      this.isProcessing = false;
      this.errorMessage = (err as Error).message;
    }
  }

  private handleResult(result: CheckoutResult) {
    this.order = result.order;
    if (result.nextAction === 'redirect' && result.authorizeUri) {
      sessionStorage.setItem(PENDING_ORDER_KEY, result.order.id);
      window.location.href = result.authorizeUri;
      return;
    }
    this.isProcessing = false;
    if (result.nextAction === 'qr' || result.nextAction === 'wait') {
      this.qrCodeUri = result.qrCodeUri;
      this.step = 'qr';
      this.pollOrder(result.order.id);
      return;
    }
    this.finish(result.order);
  }

  private pollOrder(id: string) {
    this.stopPolling();
    this.polling = interval(POLL_INTERVAL_MS)
      .pipe(
        startWith(0),
        switchMap(() => this.paymentService.getOrder(id)),
        takeWhile((order) => order.status === 'pending', true)
      )
      .subscribe({
        next: (order) => {
          this.order = order;
          if (order.status !== 'pending') this.finish(order);
        },
        error: () => undefined,
      });
  }

  simulate(result: 'paid' | 'failed' = 'paid') {
    if (!this.order) return;
    this.paymentService.simulate(this.order.id, result).subscribe({
      next: (order) => this.finish(order),
      error: (err) => (this.errorMessage = errorMessage(err)),
    });
  }

  private finish(order: Order) {
    this.stopPolling();
    this.order = order;
    this.step = 'result';
    if (order.status === 'paid') {
      this.playerService.getCurrencyData();
      this.packageService.purchaseCompleted.next();
    }
  }

  private stopPolling() {
    this.polling?.unsubscribe();
    this.polling = undefined;
  }

  get methodLabel(): string {
    if (!this.order) return '';
    return this.methods.find((method) => method.type === this.order!.method)?.label ?? this.order.method;
  }

  get paidLabel(): string {
    if (!this.order) return '';
    if (this.order.amountCoins) return `${this.order.amountCoins.toLocaleString('en-US')} MYGG`;
    return `THB ${this.order.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }

  handleClose() {
    this.stopPolling();
    clearTimeout(this.packageContainerTimeout);
    this.packageService.isPackageContentDisplay.next(false);
    this.packageContainerTimeout = setTimeout(() => {
      this.packageService.isPackageContainerDisplay.next(false);
      this.step = 'choose';
    }, 300);
  }
}
