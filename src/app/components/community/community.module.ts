import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunityComponent } from './community.component';
 
@NgModule({
  declarations: [CommunityComponent],
  imports: [CommonModule],
  exports: [CommunityComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CommunityModule {}
