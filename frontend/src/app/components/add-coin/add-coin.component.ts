import {
  Component,
  ViewChild,
  Output,
  EventEmitter,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService, PackageService, PlayerService } from 'src/app/core/services';
import { Balances, PackageItem, PackageKind } from 'src/app/core/models';

@Component({
  selector: 'app-add-coin',
  templateUrl: './add-coin.component.html',
  styleUrls: ['./add-coin.component.scss'],
})
export class AddCoinComponent implements OnDestroy {
  @ViewChild('selectElem') selectElem!: ElementRef;
  @Output() closeAddCoin = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    private authService: AuthService,
    private packageService: PackageService,
    private playerService: PlayerService
  ) {}

  currencyItem: any = [];
  currencyOptions = [
    { name: 'MYGG Coins', value: 'coins' },
    { name: 'Grando', value: 'grando' },
  ];

  kind: PackageKind = 'coins';
  allPackages: PackageItem[] = [];
  balances: Balances | null = null;
  isLogin = false;
  loadError = '';

  private subscriptions = new Subscription();

  get package(): PackageItem[] {
    return this.allPackages.filter((item) => item.kind === this.kind);
  }

  ngOnInit(): void {
    this.subscribeGlobalVariables();
    this.playerService.getCurrencyData();
    this.handleCloseSearchInit();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  subscribeGlobalVariables() {
    this.subscriptions.add(
      this.playerService
        .getCurrencyItem()
        .subscribe((value) => (this.currencyItem = value))
    );
    this.subscriptions.add(
      this.playerService.getBalances().subscribe((value) => (this.balances = value))
    );
    this.subscriptions.add(
      this.authService.getIsLogin().subscribe((isLogin) => {
        this.isLogin = isLogin;
        if (isLogin) this.loadPackages();
      })
    );
  }

  loadPackages() {
    this.loadError = '';
    this.packageService.getPackages().subscribe({
      next: (items) => (this.allPackages = items),
      error: () => (this.loadError = 'Packages could not be loaded. Please try again later.'),
    });
  }

  handleCurrency(value: string) {
    this.kind = value === 'grando' ? 'grando' : 'coins';
  }

  handleClose() {
    this.closeAddCoin.emit(false);
  }

  handleCloseSearchInit() {
    document.addEventListener('mousedown', (event: any) => {
      const elem = this.selectElem?.nativeElement;
      // Clicks inside the checkout dialog that this panel opened must not close anything
      const inDialog = event.target?.closest?.('.purchase-method, .swal2-container');
      if (elem && !elem.contains(event.target) && !inDialog) {
        this.handleClose();
      }
    });
  }

  handlePageChange() {
    this.router.navigate(['package']);
    this.handleClose();
  }

  handleSignIn() {
    this.router.navigate(['sign-in']);
    this.handleClose();
  }

  handlePackage(item: PackageItem) {
    this.packageService.handlePackage(item);
    this.handleClose();
  }
}
