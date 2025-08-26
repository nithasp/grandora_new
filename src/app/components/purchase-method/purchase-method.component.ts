import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PackageService } from 'src/app/core/services/package.service';

@Component({
  selector: 'app-purchase-method',
  templateUrl: './purchase-method.component.html',
  styleUrls: ['./purchase-method.component.scss'],
})
export class PurchaseMethodComponent {
  isPackageContainerDisplay: boolean = false;
  isPackageContentDisplay: boolean = false;
  packageInfo: any;
  packageContainerTimeout: any;

  cardForm!: FormGroup;

  step: number = 1;

  constructor(
    private formBuilder: FormBuilder,
    private packageService: PackageService
  ) {}

  ngOnInit(): void {
    this.cardFormInit();
    this.subscribePackageService();
  }

  subscribePackageService() {
    this.packageService
      .getPackageInfo()
      .subscribe((value) => (this.packageInfo = value));

    this.packageService
      .getIsPackageContainertDisplay()
      .subscribe((value) => (this.isPackageContainerDisplay = value));

    this.packageService
      .getIsPackageContentDisplay()
      .subscribe((value) => (this.isPackageContentDisplay = value));
  }

  cardFormInit() {
    this.cardForm = this.formBuilder.group({
      firstname: [null],
      lastname: [null],
      country: [null],
      card_number: [null],
      expiry_date: [null],
      year: [null],
      cvv: [null],
    });
  }

  handleSubmit() {}

  handleClose() {
    clearTimeout(this.packageContainerTimeout);
    this.packageService.isPackageContentDisplay.next(false);
    this.packageContainerTimeout = setTimeout(() => {
      this.packageService.isPackageContainerDisplay.next(false);
      this.step = 1;
    }, 300);
  }
}
