import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Transaction } from 'src/app/core/models';
import { AuthService, PackageService, PlayerService, ShopService, errorMessage } from 'src/app/core/services';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnDestroy {
  isLogin: boolean = false;

  transactions: Transaction[] = [];
  redeemCode = '';
  isRedeeming = false;

  private subscriptions = new Subscription();

  constructor(
    private authService: AuthService,
    private shopService: ShopService,
    private packageService: PackageService,
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.authService.getIsLogin().subscribe((isLogin) => {
        this.isLogin = isLogin;
        if (isLogin) this.loadTransactions();
      })
    );
    this.subscriptions.add(this.packageService.purchaseCompleted.subscribe(() => this.loadTransactions()));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadTransactions() {
    this.shopService.transactions('all', 1, 5).subscribe({
      next: (page) => (this.transactions = page.items),
      error: () => (this.transactions = []),
    });
  }

  redeem() {
    const code = this.redeemCode.trim();
    if (!code || this.isRedeeming) return;
    this.isRedeeming = true;
    this.shopService.redeem(code).subscribe({
      next: (result) => {
        this.isRedeeming = false;
        this.redeemCode = '';
        this.playerService.getCurrencyData();
        this.packageService.purchaseCompleted.next();
        Swal.fire({
          icon: 'success',
          title: 'Code redeemed',
          text: result.message,
          confirmButtonText: 'Done',
          confirmButtonColor: '#5460cb',
        });
      },
      error: (err) => {
        this.isRedeeming = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage(err),
          confirmButtonText: 'Done',
          confirmButtonColor: '#AC2028',
        });
      },
    });
  }
}
