import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { Balances, StoreItem, TransactionPage } from '../models';

const TRANSACTIONS = gql`
  query ($type: String, $page: Int, $pageSize: Int) {
    Transactions(type: $type, page: $page, pageSize: $pageSize) {
      total
      page
      pageSize
      items {
        id
        type
        title
        description
        point
        currency
        date
        createdAt
        orderId
        method
      }
    }
  }
`;

const REDEEM = gql`
  mutation ($code: String!) {
    RedeemCode(code: $code) {
      code
      currency
      amount
      message
      balances {
        myggCoins
        grando
        tickets
      }
    }
  }
`;

const STORE_ITEMS = gql`
  query ($category: String) {
    StoreItems(category: $category) {
      id
      code
      name
      description
      category
      image
      priceGrando
      priceMygg
      promoted
      owned
    }
  }
`;

const BUY_STORE_ITEM = gql`
  mutation ($itemId: Int!, $currency: String!) {
    BuyStoreItem(itemId: $itemId, currency: $currency) {
      paidCurrency
      paidAmount
      item {
        id
        name
        owned
      }
      balances {
        myggCoins
        grando
        tickets
      }
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class ShopService {
  constructor(private apollo: Apollo) {}

  transactions(type = 'all', page = 1, pageSize = 12): Observable<TransactionPage> {
    return this.apollo
      .query<any>({ query: TRANSACTIONS, variables: { type, page, pageSize }, fetchPolicy: 'network-only' })
      .pipe(map((res) => res.data.Transactions as TransactionPage));
  }

  redeem(code: string): Observable<{ message: string; balances: Balances }> {
    return this.apollo.mutate<any>({ mutation: REDEEM, variables: { code } }).pipe(map((res) => res.data.RedeemCode));
  }

  storeItems(category?: string): Observable<StoreItem[]> {
    return this.apollo
      .query<any>({ query: STORE_ITEMS, variables: { category: category ?? null }, fetchPolicy: 'network-only' })
      .pipe(map((res) => res.data.StoreItems as StoreItem[]));
  }

  buyStoreItem(itemId: number, currency: 'GRANDO' | 'MYGG'): Observable<{ balances: Balances }> {
    return this.apollo
      .mutate<any>({ mutation: BUY_STORE_ITEM, variables: { itemId, currency } })
      .pipe(map((res) => res.data.BuyStoreItem));
  }
}
