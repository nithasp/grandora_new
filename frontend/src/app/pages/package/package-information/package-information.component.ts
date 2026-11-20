import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PlayerService, PackageService, AuthService } from 'src/app/core/services';
import { PackageItem, PlayerItem } from 'src/app/core/models';
@Component({
  selector: 'app-package-information',
  templateUrl: './package-information.component.html',
  styleUrls: ['./package-information.component.scss'],
})
export class PackageInformationComponent implements OnDestroy {
  subscription: any = [
    {
      package_name: 'Free Package',
      description:
        '<ul> <li>1 Project</li> <li>Play other player games</li> <li>Creative Mode</li> <li>Unlock Default Assets</li> <li>Unlock Premium Assets</li> </ul>',
      sub_button: true,
      text_button: 'Free',
      recommended: false,
      permanently: false,
      renew_date: '',
      isSubscribed: false,
    },
    {
      package_name: 'Advance Package',
      description:
        '<ul> <li>1 Project</li> <li>Play other player games</li> <li>Creative Mode</li> <li>Unlock Default Assets</li> <li>Unlock Premium Assets</li> </ul>',
      sub_button: false,
      text_button: 'Cancel Package',
      recommended: false,
      permanently: true,
      renew_date: 'Renew date 24/01/2023',
      isSubscribed: true,
    },
    {
      package_name: 'Premium Package',
      description:
        '<ul> <li>1 Project</li> <li>Play other player games</li> <li>Creative Mode</li> <li>Unlock Default Assets</li> <li>Unlock Premium Assets</li> </ul>',
      text_button:
        "<span>$12.99&nbsp;</span> <span class='light-text'>a month</span>",
      sub_button: false,
      recommended: true,
      permanently: true,
      renew_date: '',
      isSubscribed: false,
    },
  ];

  package: PackageItem[] = [];
  coinPackages: PackageItem[] = [];
  packageError = '';

  currency: PlayerItem[] = [];

  private subscriptions = new Subscription();

  constructor(
    private playerService: PlayerService,
    private packageService: PackageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.authService.getIsLogin().subscribe((isLogin) => {
        if (!isLogin) return;
        this.loadPackages();
        this.getCurrency();
      })
    );
    this.subscriptions.add(this.packageService.purchaseCompleted.subscribe(() => this.getCurrency()));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadPackages() {
    this.packageService.getPackages().subscribe({
      next: (items) => {
        this.package = items.filter((item) => item.kind === 'grando');
        this.coinPackages = items.filter((item) => item.kind === 'coins');
      },
      error: () => (this.packageError = 'Packages could not be loaded. Please try again later.'),
    });
  }

  handlePackage(item: PackageItem) {
    this.packageService.handlePackage(item);
  }

  getCurrency() {
    if (!this.authService.getAccessToken()) return;
    this.playerService.getCurrencyApi().subscribe({
      next: (value) => (this.currency = value.data?.GetSelf?.inventory?.currency ?? []),
      error: () => (this.currency = []),
    });
  }
}
