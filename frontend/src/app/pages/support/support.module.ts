import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SupportComponent } from './support.component';
import { SupportRoutingModule } from './support-routing.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommunityModule } from 'src/app/components/community/community.module';
import { SupportRequestComponent } from './support-request/support-request.component';
import { GrandoraDropzoneComponent } from 'src/app/components/grandora-dropzone/grandora-dropzone.component';
import { GrandoraDropzoneModule } from 'src/app/components/grandora-dropzone/grandora-dropzone.module';

@NgModule({
  declarations: [
    SupportComponent,
    SupportRequestComponent,
  ],
  imports: [
    CommonModule,
    SupportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    CommunityModule,
    GrandoraDropzoneModule
  ],
})
export class SupportModule {}
