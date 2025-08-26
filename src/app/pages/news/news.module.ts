import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsComponent } from './news.component';
import { NewsRoutingModule } from './news-routing.module';

import { NewsDetailComponent } from './news-detail/news-detail.component';
import { LdsRollerModule } from 'src/app/components/loading/lds-roller/lds-roller.module';

// Register swiper library
import { register } from 'swiper/element/bundle';
import { CommunityModule } from 'src/app/components/community/community.module';
register();

@NgModule({
  declarations: [NewsComponent, NewsDetailComponent],
  imports: [CommonModule, NewsRoutingModule, LdsRollerModule, CommunityModule],
  exports: [NewsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NewsModule {}
