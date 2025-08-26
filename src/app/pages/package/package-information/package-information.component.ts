import { Component } from '@angular/core';
import { packageData } from 'src/data/mockup/package-data';
import { PlayerService, PackageService } from 'src/app/core/services';
@Component({
  selector: 'app-package-information',
  templateUrl: './package-information.component.html',
  styleUrls: ['./package-information.component.scss'],
})
export class PackageInformationComponent {
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

  package: any = [];

  currency: any = [];

  constructor(
    private playerService: PlayerService,
    private packageService: PackageService
  ) {}

  ngOnInit(): void {
    this.package = packageData;
    this.getCurrency();
  }
  handlePackage(item: any) {
    this.packageService.handlePackage(item);
  }
  getCurrency() {
    this.playerService
      .getCurrencyApi()
      .subscribe(
        (value) => (this.currency = value.data.GetSelf.inventory.currency)
      );
  }
}
