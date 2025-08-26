import {
  Component,
  ViewChild,
  Output,
  EventEmitter,
  ElementRef,
} from '@angular/core';
import { packageData } from 'src/data/mockup/package-data';
import { Router } from '@angular/router';
import { PackageService, PlayerService } from 'src/app/core/services';
import { PlayerItem } from 'src/app/core/models';

@Component({
  selector: 'app-add-coin',
  templateUrl: './add-coin.component.html',
  styleUrls: ['./add-coin.component.scss'],
})
export class AddCoinComponent {
  @ViewChild('selectElem') selectElem!: ElementRef;
  @Output() closeAddCoin = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    private packageService: PackageService,
    private playerService: PlayerService
  ) {}

  currencyItem: any = [];
  currencyMockup: any = [
    {
      name: 'Grando',
      value: 'grando',
    },
    {
      name: 'Grando2',
      value: 'grando2',
    },
    {
      name: 'Grando3',
      value: 'grando3',
    },
  ];

  package: any = [];

  ngOnInit(): void {
    this.subscribeGlobalVariables();
    this.playerService.getCurrencyData();
    this.handleCloseSearchInit();
    this.package = packageData;
  }

  subscribeGlobalVariables() {
    this.playerService
      .getCurrencyItem()
      .subscribe((value) => (this.currencyItem = value));
  }

  handleCurrency(value: string) {
    console.log(value);
  }

  handleClose() {
    this.closeAddCoin.emit(false);
  }

  handleCloseSearchInit() {
    document.addEventListener('mousedown', (event: any) => {
      const elem = this.selectElem?.nativeElement;
      if (elem && !elem.contains(event.target)) {
        this.handleClose();
      }
    });
  }

  handlePageChange() {
    this.router.navigate(['package']);
    this.handleClose();
  }

  handlePackage(item: any) {
    this.packageService.handlePackage(item);
    this.handleClose();
  }
}
