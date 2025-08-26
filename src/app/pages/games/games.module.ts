import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesComponent } from './games.component';
import { FormsModule } from '@angular/forms';
import { GamesRoutingModule } from './games-routing.module';
import { CommunityModule } from 'src/app/components/community/community.module';
import { GameDetailComponent } from './game-detail/game-detail.component';
import { GameTitleComponent } from './game-title/game-title.component';
import { DescriptionComponent } from './description/description.component';
import { CreatorComponent } from './creator/creator.component';
import { CreatorsWallComponent } from './creators-wall/creators-wall.component';
import { RecommendationComponent } from './recommendation/recommendation.component';
import { OtherGamesComponent } from './other-games/other-games.component';
import { SponsoredModule } from 'src/app/components/sponsored/sponsored.module';
import { FeedModule } from 'src/app/components/feed/feed.module';
import { ChatModule } from 'src/app/components/chat/chat.module';

@NgModule({
  declarations: [
    GamesComponent,
    GameDetailComponent,
    GameTitleComponent,
    DescriptionComponent,
    CreatorComponent,
    CreatorsWallComponent,
    RecommendationComponent,
    OtherGamesComponent,
  ],
  imports: [CommonModule, FormsModule, GamesRoutingModule, CommunityModule, SponsoredModule, FeedModule, ChatModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GamesModule {}
