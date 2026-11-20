import { Component } from '@angular/core';
import { transactions } from 'src/data/mockup/transactions';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss'],
})
export class TransactionDetailComponent {
  page = 1;
  pageSize = 12;
  collectionSize = 1;
  maxSize = 3;

  transactions: any = [];
  filterTransactions: any = [];

  constructor(private breakpointObserver: BreakpointObserver) {
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
    this.transactions = transactions;
    this.collectionSize = transactions.length;
    this.refreshFilterTransactions();
  }

  ngAfterViewInit(): void {
    this.typeActive();
  }

  typeActive() {
    const types = document.querySelectorAll('.type');
    types.forEach((type) => {
      type.addEventListener('click', () => {
        types.forEach((allType) => allType.classList.remove('active'));
        type.classList.add('active');
      });
    });
  }

  refreshFilterTransactions() {
    this.filterTransactions = this.transactions.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
  }
}
