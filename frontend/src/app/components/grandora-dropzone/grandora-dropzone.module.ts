import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrandoraDropzoneComponent } from './grandora-dropzone.component';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: 'https://httpbin.org/post',
  maxFilesize: 50,
  acceptedFiles: 'image/*',
};

@NgModule({
  declarations: [GrandoraDropzoneComponent],
  imports: [CommonModule, DropzoneModule],
  exports: [GrandoraDropzoneComponent],
  providers: [
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG,
    },
  ],
})
export class GrandoraDropzoneModule {}
