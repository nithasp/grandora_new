import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Balances, StoreItem } from 'src/app/core/models';
import {
  AuthService,
  PackageService,
  PlayerService,
  ShopService,
  errorMessage,
} from 'src/app/core/services';

type StoreTab = 'all' | 'avatars' | 'accessories' | 'equipments';

@Component({
  selector: 'app-official-store',
  templateUrl: './official-store.component.html',
  styleUrls: ['./official-store.component.scss'],
})
export class OfficialStoreComponent implements OnDestroy {
  isItemFancyBoxDisplay: boolean = false;

  products: StoreItem[] = [];
  balances: Balances | null = null;
  buyingId: number | null = null;
  loadError = '';

  types: { key: StoreTab; label: string }[] = [
    { key: 'all', label: 'All Products' },
    { key: 'avatars', label: 'Avatars' },
    { key: 'accessories', label: 'Accessories' },
    { key: 'equipments', label: 'Equipments' },
  ];
  type: StoreTab = 'all';

  private subscriptions = new Subscription();

  constructor(
    private router: Router,
    private authService: AuthService,
    private shopService: ShopService,
    private playerService: PlayerService,
    private packageService: PackageService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(this.playerService.getBalances().subscribe((value) => (this.balances = value)));
    this.subscriptions.add(
      this.authService.getIsLogin().subscribe((isLogin) => {
        if (!isLogin) return;
        this.loadProducts();
        this.playerService.getCurrencyData();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadProducts() {
    this.shopService.storeItems().subscribe({
      next: (items) => (this.products = items),
      error: (err) => (this.loadError = errorMessage(err, 'The store could not be loaded.')),
    });
  }

  get promoted(): StoreItem[] {
    return this.products.filter((item) => item.promoted);
  }

  get mainItem(): StoreItem | undefined {
    return this.promoted[0] ?? this.products[0];
  }

  get promoteSub(): StoreItem[] {
    return this.promoted.slice(1, 7);
  }

  byCategory(category: StoreTab, limit?: number): StoreItem[] {
    const items = this.products.filter((item) => item.category === category);
    return limit ? items.slice(0, limit) : items;
  }

  section(category: StoreTab): StoreItem[] {
    return this.byCategory(category, this.type === 'all' ? 6 : undefined);
  }

  selectType(type: StoreTab) {
    this.type = type;
  }

  async handlePackage(item: StoreItem | undefined) {
    if (!item || item.owned || this.buyingId) return;
    if (!this.authService.getAccessToken()) {
      this.router.navigate(['/sign-in']);
      return;
    }

    const grando = this.balances?.grando ?? 0;
    const mygg = this.balances?.myggCoins ?? 0;
    const choice = await Swal.fire({
      title: `Buy ${item.name}?`,
      imageUrl: item.image,
      imageHeight: 150,
      imageAlt: item.name,
      text: `Your balance: ${grando.toLocaleString('en-US')} Grando and ${mygg.toLocaleString('en-US')} MYGG Coins.`,
      showConfirmButton: !!item.priceGrando,
      showDenyButton: !!item.priceMygg,
      showCancelButton: true,
      confirmButtonText: `Pay ${(item.priceGrando ?? 0).toLocaleString('en-US')} Grando`,
      denyButtonText: `Pay ${(item.priceMygg ?? 0).toLocaleString('en-US')} MYGG`,
      confirmButtonColor: '#5460cb',
      denyButtonColor: '#b46fd6',
      customClass: { actions: 'choice-actions' },
    });
    const currency = choice.isConfirmed ? 'GRANDO' : choice.isDenied ? 'MYGG' : null;
    if (!currency) return;

    this.buyingId = item.id;
    this.shopService.buyStoreItem(item.id, currency).subscribe({
      next: (result) => {
        this.buyingId = null;
        // Apollo hands out frozen result objects, so the list is replaced instead of mutated
        this.products = this.products.map((product) =>
          product.id === item.id ? { ...product, owned: true } : product
        );
        this.balances = result.balances;
        this.playerService.getCurrencyData();
        this.packageService.purchaseCompleted.next();
        Swal.fire({
          icon: 'success',
          title: 'Purchased!',
          text: `${item.name} has been added to your inventory.`,
          confirmButtonText: 'Done',
          confirmButtonColor: '#5460cb',
        });
      },
      error: (err) => {
        this.buyingId = null;
        Swal.fire({
          icon: 'error',
          title: 'Purchase failed',
          text: errorMessage(err),
          confirmButtonText: 'Done',
          confirmButtonColor: '#AC2028',
        });
      },
    });
  }

  handleAvatarType(type: StoreTab = 'avatars') {
    this.type = type;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
