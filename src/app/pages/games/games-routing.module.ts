import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamesComponent } from './games.component';
import { GameDetailComponent } from './game-detail/game-detail.component';
import { DescriptionComponent } from './description/description.component';
import { CreatorComponent } from './creator/creator.component';
import { CreatorsWallComponent } from './creators-wall/creators-wall.component';

const routes: Routes = [
  {
    path: '',
    component: GamesComponent,
  },
  {
    path: 'detail',
    component: GameDetailComponent,

    children: [
      {
        path: '',
        redirectTo: 'description',
        pathMatch: 'full',
      },
      {
        path: 'description',
        component: DescriptionComponent,
      },
      {
        path: 'creator',
        component: CreatorComponent,
      },
      {
        path: 'creators-wall',
        component: CreatorsWallComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GamesRoutingModule {}
