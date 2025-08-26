import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageRoutingModule } from './package-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TransactionsComponent } from './transactions/transactions.component';
import { CancelingMembershipComponent } from './canceling-membership/canceling-membership.component';
import { PackageInformationComponent } from './package-information/package-information.component';
import { TransactionDetailComponent } from './transaction-detail/transaction-detail.component';

import { CommunityModule } from 'src/app/components/community/community.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [
    TransactionsComponent,
    CancelingMembershipComponent,
    PackageInformationComponent,
    TransactionDetailComponent,
     
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PackageRoutingModule,
    NgbPaginationModule,
    CommunityModule
  ],
})
export class PackageModule {}
