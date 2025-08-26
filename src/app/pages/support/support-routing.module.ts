import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupportComponent } from './support.component';
import { SupportRequestComponent } from './support-request/support-request.component';
const routes: Routes = [
  {
    path: '',
    component: SupportComponent
  },
  {
    path: 'request',
    component: SupportRequestComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupportRoutingModule {}
