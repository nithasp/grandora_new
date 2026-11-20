import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { AuthService, authHeaders } from './auth.service';
import { BehaviorSubject } from 'rxjs';
import { Balances, PlayerItem } from '../models';

export const GET_FIRST_LOGIN_PLAYERS = gql`
  query {
    GetSelf {
      inventory {
        currency {
          item_id
          category
          amount
          name
        }
      }
      balances {
        myggCoins
        grando
        tickets
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  constructor(private apollo: Apollo, private authService: AuthService) {}

  currencyItem = new BehaviorSubject<any>([]);
  balances = new BehaviorSubject<Balances | null>(null);

  getCurrencyItem() {
    return this.currencyItem.asObservable();
  }

  getBalances() {
    return this.balances.asObservable();
  }

  getCurrencyApi() {
    return this.apollo.query<any>({
      query: GET_FIRST_LOGIN_PLAYERS,
      // Balances change with every purchase, so they are always read from the server
      fetchPolicy: 'network-only',
      context: {
        headers: authHeaders(this.authService.getAccessToken()),
      },
    });
  }

  getCurrencyData() {
    if (this.authService.getAccessToken()) {
      this.getCurrencyApi().subscribe({
        next: (value) => {
          const self = value.data?.GetSelf;
          if (!self) return;
          const currencyItemData = self.inventory.currency.map((item: PlayerItem) => {
            return {
              name: item.name ?? item.item_id,
              value: item.amount,
              id: item.item_id,
            };
          });
          this.currencyItem.next(currencyItemData);
          this.balances.next(self.balances);
        },
        error: () => undefined,
      });
    }
    return;
  }
}
