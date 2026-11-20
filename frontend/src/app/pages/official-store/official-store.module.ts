import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfficialStoreComponent } from './official-store.component';
import { OfficialStoreRoutingModule } from './official-store-routing.module';
import { CommunityModule } from 'src/app/components/community/community.module';
import { ChatModule } from 'src/app/components/chat/chat.module';
@NgModule({
  declarations: [OfficialStoreComponent],
  imports: [CommonModule, OfficialStoreRoutingModule, CommunityModule, ChatModule],
  exports: [OfficialStoreComponent],
})
export class OfficialStoreModule {}
