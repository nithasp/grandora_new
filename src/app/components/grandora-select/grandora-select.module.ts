import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrandoraSelectComponent } from './grandora-select.component';

@NgModule({
  declarations: [GrandoraSelectComponent],
  imports: [CommonModule],
  exports: [GrandoraSelectComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GrandoraSelectModule {}
