import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

export const GET_PACKAGE = gql`
  query {
    items {
      ok
      message
      data {
        id
        name
        description
        price
        image
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

  packageContainerTimeout: any;

  constructor(private apollo: Apollo, private authService: AuthService) {}

  getPackage() {
    return this.apollo.use('packageEndPoint').query<any>({
      query: GET_PACKAGE,
      context: {
        headers: {
          Authorization: this.authService.getAccessToken(),
          'Cache-Control': 'no-cache',
        },
      },
    });
  }

  handlePackage(item: any) {
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
