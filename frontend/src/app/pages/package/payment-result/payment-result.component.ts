import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, interval, startWith, switchMap, take, takeWhile } from 'rxjs';
import { PENDING_ORDER_KEY } from 'src/app/components/purchase-method/purchase-method.component';
import { Order } from 'src/app/core/models';
import { PackageService, PaymentService, PlayerService, errorMessage } from 'src/app/core/services';

const POLL_INTERVAL_MS = 3000;
const MAX_POLLS = 100;

/**
 * Where Omise sends the player back after 3-D Secure or a wallet/bank app. Arriving here proves
 * nothing, so the page asks the API for the order until the server has confirmed it with Omise.
 */
@Component({
  selector: 'app-payment-result',
  templateUrl: './payment-result.component.html',
  styleUrls: ['./payment-result.component.scss'],
})
export class PaymentResultComponent implements OnInit, OnDestroy {
  order: Order | null = null;
  errorMessage = '';
  timedOut = false;

  private polling?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private playerService: PlayerService,
    private packageService: PackageService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('orderId') ?? sessionStorage.getItem(PENDING_ORDER_KEY);
    if (!id) {
      this.errorMessage = 'There is no payment to show.';
      return;
    }

    this.polling = interval(POLL_INTERVAL_MS)
      .pipe(
        startWith(0),
        take(MAX_POLLS),
        switchMap(() => this.paymentService.getOrder(id)),
        takeWhile((order) => order.status === 'pending', true)
      )
      .subscribe({
        next: (order) => {
          this.order = order;
          if (order.status === 'pending') return;
          sessionStorage.removeItem(PENDING_ORDER_KEY);
          if (order.status === 'paid') {
            this.playerService.getCurrencyData();
            this.packageService.purchaseCompleted.next();
          }
        },
        error: (err) => (this.errorMessage = errorMessage(err, 'The payment could not be found.')),
        complete: () => (this.timedOut = this.order?.status === 'pending'),
      });
  }

  ngOnDestroy(): void {
    this.polling?.unsubscribe();
  }

  get grantLabel(): string {
    if (!this.order) return '';
    const unit = this.order.grantCurrency === 'MYGG' ? 'MYGG Coins' : 'Grando';
    const tickets = this.order.bonusTickets ? ` & ${this.order.bonusTickets} Ticket` : '';
    return `${this.order.grantAmount.toLocaleString('en-US')} ${unit}${tickets}`;
  }

  get paidLabel(): string {
    if (!this.order) return '';
    if (this.order.amountCoins) return `${this.order.amountCoins.toLocaleString('en-US')} MYGG`;
    return `THB ${this.order.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }
}
