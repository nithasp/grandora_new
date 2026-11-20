import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfficialStoreComponent } from './official-store.component';

const routes: Routes = [
  {
    path: '',
    component: OfficialStoreComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfficialStoreRoutingModule {}
