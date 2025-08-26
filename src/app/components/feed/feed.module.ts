import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedComponent } from './feed.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    FeedComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    FeedComponent
  ]
})
export class FeedModule { }
