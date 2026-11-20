import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SocialFeedComponent } from './social-feed/social-feed.component';
import { SocialProfileComponent } from './social-profile/social-profile.component';
import { SocialFriendComponent } from './social-friend/social-friend.component';
import { SocialFriendDetailComponent } from './social-friend-detail/social-friend-detail.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'feed',
    pathMatch: 'full',
  },
  {
    path: 'feed',
    component: SocialFeedComponent,
  },
  {
    path: 'profile',
    component: SocialProfileComponent,
  },
  {
    path: 'friend',
    component: SocialFriendComponent,
  },
  {
    path: 'friend/:id',
    component: SocialFriendDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SocialRoutingModule {}
