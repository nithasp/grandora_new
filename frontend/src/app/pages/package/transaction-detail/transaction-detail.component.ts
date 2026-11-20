import { Component } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Transaction } from 'src/app/core/models';
import { ShopService } from 'src/app/core/services';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss'],
})
export class TransactionDetailComponent {
  page = 1;
  pageSize = 12;
  collectionSize = 0;
  maxSize = 3;

  types = [
    { key: 'all', label: 'All', className: 'all' },
    { key: 'subscription', label: 'Subscription History', className: 'subscription-history' },
    { key: 'package', label: 'Package History', className: 'package-history' },
    { key: 'redeem', label: 'Redeem History', className: 'redeem-history' },
  ];
  activeType = 'all';
  isLoading = false;

  filterTransactions: Transaction[] = [];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private shopService: ShopService
  ) {
    // detect screen size changes
    this.breakpointObserver
      .observe(['(max-width: 450px)'])
      .subscribe((result: BreakpointState) => {
        if (result.matches) {
          // hide stuff
          this.maxSize = 2;
        } else {
          // show stuff
          this.maxSize = 3;
        }
      });
  }

  ngOnInit(): void {
    this.refreshFilterTransactions();
  }

  selectType(key: string) {
    if (key === this.activeType) return;
    this.activeType = key;
    this.page = 1;
    this.refreshFilterTransactions();
  }

  refreshFilterTransactions() {
    this.isLoading = true;
    this.shopService.transactions(this.activeType, this.page, this.pageSize).subscribe({
      next: (page) => {
        this.filterTransactions = page.items;
        this.collectionSize = page.total;
        this.isLoading = false;
      },
      error: () => {
        this.filterTransactions = [];
        this.collectionSize = 0;
        this.isLoading = false;
      },
    });
  }
}
