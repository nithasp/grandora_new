import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PackageComponent } from './package.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { CancelingMembershipComponent } from './canceling-membership/canceling-membership.component';
import { PackageInformationComponent } from './package-information/package-information.component';
import { TransactionDetailComponent } from './transaction-detail/transaction-detail.component';

const routes: Routes = [
  {
    path: '',
    component: PackageComponent,
    children: [
      {
        path: '',
        redirectTo: "package-information",
        pathMatch: 'full'
      },
      {
        path: 'package-information',
        component: PackageInformationComponent,
      },
      {
        path: 'transaction-detail',
        component: TransactionDetailComponent,
      },
      {
        path: 'canceling-membership',
        component: CancelingMembershipComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PackageRoutingModule {}
