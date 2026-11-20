import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, map, shareReplay, throwError } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';
import { AuthService, authHeaders } from './auth.service';
import { PackageItem, PackageKind, StoreItem } from '../models';

export const GET_PACKAGE = gql`
  query ($kind: String) {
    items(kind: $kind) {
      ok
      message
      data {
        id
        code
        name
        description
        price
        priceSatang
        priceCoins
        currency
        kind
        grantCurrency
        grantAmount
        bonusTickets
        image
        badge
        savePercent
        theme
        game
        featured
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class PackageService {
  isPackageContainerDisplay = new BehaviorSubject<boolean>(false);
  isPackageContentDisplay = new BehaviorSubject<boolean>(false);
  packageInfo = new BehaviorSubject<any>(undefined);

  purchaseCompleted = new Subject<void>();

  packageContainerTimeout: any;

  private packages$?: Observable<PackageItem[]>;

  constructor(private apollo: Apollo, private authService: AuthService) {}

  getPackage(kind?: PackageKind) {
    return this.apollo.use('packageEndPoint').query<any>({
      query: GET_PACKAGE,
      variables: { kind: kind ?? null },
      context: {
        headers: {
          ...authHeaders(this.authService.getAccessToken()),
          'Cache-Control': 'no-cache',
        },
      },
    });
  }

  getPackages(): Observable<PackageItem[]> {
    this.packages$ ??= this.getPackage().pipe(
      map((res) => (res.data?.items?.data ?? []) as PackageItem[]),
      catchError((err) => {
        this.packages$ = undefined;
        return throwError(() => err);
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
    return this.packages$;
  }

  handlePackage(item: PackageItem | StoreItem | any) {
    clearTimeout(this.packageContainerTimeout);

    this.packageInfo.next(item);
    this.isPackageContainerDisplay.next(true);
    this.packageContainerTimeout = setTimeout(() => {
      this.isPackageContentDisplay.next(true);
    }, 100);
  }

  getIsPackageContainertDisplay() {
    return this.isPackageContainerDisplay.asObservable();
  }
  getIsPackageContentDisplay() {
    return this.isPackageContentDisplay.asObservable();
  }
  getPackageInfo() {
    return this.packageInfo.asObservable();
  }
}
