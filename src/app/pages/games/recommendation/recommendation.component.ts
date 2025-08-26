import { Component } from '@angular/core';

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.scss'],
})
export class RecommendationComponent {
  games = [
    {
      title: 'Game title',
      liked: 56,
      image: '/assets/images/mockup/game/icon/image 2.png',
    },
    {
      title: 'Game title',
      liked: 18,
      image: '/assets/images/mockup/game/icon/Rectangle 1.png',
    },
    {
      title: 'Game title',
      liked: 98,
      image: '/assets/images/mockup/game/icon/Rectangle 1 (1).png',
    },
    {
      title: 'Game title',
      liked: 18,
      image: '/assets/images/mockup/game/icon/Rectangle 1 (2).png',
    },

    {
      title: 'Game title',
      liked: 23,
      image: '/assets/images/mockup/game/icon/Rectangle 1 (3).png',
    },
    {
      title: 'Game title',
      liked: 41,
      image: '/assets/images/mockup/game/icon/Rectangle 1 (4).png',
    },
    {
      title: 'Game title',
      liked: 7,
      image: '/assets/images/mockup/game/icon/Rectangle 1 (5).png',
    },

    {
      title: 'Game title',
      liked: 98,
      image: '/assets/images/mockup/game/icon/Rectangle 1 (6).png',
    },
    {
      title: 'Game title',
      liked: 18,
      image: '/assets/images/mockup/game/icon/Rectangle 1 (7).png',
    },

    {
      title: 'Game title',
      liked: 23,
      image: '/assets/images/mockup/game/icon/Rectangle 1 (8).png',
    },
    {
      title: 'Game title',
      liked: 41,
      image: '/assets/images/mockup/game/icon/Rectangle 1 (9).png',
    },
    {
      title: 'Game title',
      liked: 7,
      image: '/assets/images/mockup/game/icon/Rectangle 1 (10).png',
    },
    {
      title: 'Game title',
      liked: 98,
      image: '/assets/images/mockup/game/icon/Rectangle 1 (11).png',
    },
  ];
}
