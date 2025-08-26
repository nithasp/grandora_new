import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';
import { PlayerItem } from '../models';

export const GET_FIRST_LOGIN_PLAYERS = gql`
  query {
    GetSelf {
      inventory {
        currency {
          item_id
          category
          amount
        }
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

  getCurrencyItem() {
    return this.currencyItem.asObservable();
  }

  getCurrencyApi() {
    return this.apollo.query<any>({
      query: GET_FIRST_LOGIN_PLAYERS,
      context: {
        headers: {
          Authorization: this.authService.getAccessToken(),
        },
      },
    });
  }

  getCurrencyData() {
    if (this.authService.getAccessToken()) {
      this.getCurrencyApi().subscribe((value) => {
        const currencyItemData = value.data?.GetSelf.inventory.currency.map(
          (item: PlayerItem) => {
            return {
              name: item.item_id,
              value: item.amount,
            };
          }
        );
        this.currencyItem.next(currencyItemData);
      });
    }
    return;
  }
}
