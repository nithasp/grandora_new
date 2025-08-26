import { Component } from '@angular/core';
import { transactions } from 'src/data/mockup/transactions';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent {
  isLogin: boolean = true;

  transactions: any = [];

  ngOnInit(): void {
    this.transactions = transactions.slice(0,5);
  }
}
