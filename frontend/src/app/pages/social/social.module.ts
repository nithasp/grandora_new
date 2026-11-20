import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocialFeedComponent } from './social-feed/social-feed.component';
import { SocialRoutingModule } from './social-routing.module';
import { FeedModule } from 'src/app/components/feed/feed.module';
import { SponsoredModule } from 'src/app/components/sponsored/sponsored.module';
import { SocialProfileComponent } from './social-profile/social-profile.component';
import { SocialFriendComponent } from './social-friend/social-friend.component';
import { SocialFriendDetailComponent } from './social-friend-detail/social-friend-detail.component';
import { ChatModule } from 'src/app/components/chat/chat.module';
import { GrandoraDropzoneModule } from 'src/app/components/grandora-dropzone/grandora-dropzone.module';

@NgModule({
  declarations: [
    SocialFeedComponent,
    SocialProfileComponent,
    SocialFriendComponent,
    SocialFriendDetailComponent,
  ],
  imports: [
    CommonModule,
    SocialRoutingModule,
    FeedModule,
    SponsoredModule,
    FormsModule,
    ChatModule,
    GrandoraDropzoneModule,
  ],
})
export class SocialModule {}
