import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
})
export class GamesComponent {
  mainSlideItems = [
    {
      title: 'Game title',
      liked: 98,
      image: '/assets/images/mockup/game/wallpaper/fantasy-3049543_1280.jpg',
    },
    {
      title: 'Game title',
      liked: 18,
      image: '/assets/images/mockup/game/wallpaper/fantasy-2750995_1280.jpg',
    },

    {
      title: 'Game title',
      liked: 23,
      image: '/assets/images/mockup/game/wallpaper/balloon-5255326_1280.jpg',
    },
    {
      title: 'Game title',
      liked: 41,
      image: '/assets/images/mockup/game/wallpaper/fantasy-57073_1280.webp',
    },
    {
      title: 'Game title',
      liked: 7,
      image: '/assets/images/mockup/game/wallpaper/fantasy-782001_1280.jpg',
    },
  ];

  subSlideItems = [
    {
      title: 'Game title',
      liked: 98,
      image: '/assets/images/mockup/game/wallpaper/fantasy-3049543_1280.jpg',
    },
    {
      title: 'Game title',
      liked: 18,
      image: '/assets/images/mockup/game/wallpaper/fantasy-2750995_1280.jpg',
    },

    {
      title: 'Game title',
      liked: 23,
      image: '/assets/images/mockup/game/wallpaper/balloon-5255326_1280.jpg',
    },
    {
      title: 'Game title',
      liked: 41,
      image: '/assets/images/mockup/game/wallpaper/fantasy-57073_1280.webp',
    },
    {
      title: 'Game title',
      liked: 7,
      image: '/assets/images/mockup/game/wallpaper/fantasy-782001_1280.jpg',
    },

    {
      title: 'Game title',
      liked: 98,
      image: '/assets/images/mockup/game/wallpaper/hell-735995_1280.webp',
    },
    {
      title: 'Game title',
      liked: 18,
      image: '/assets/images/mockup/game/wallpaper/horse-3395135_1280.jpg',
    },

    {
      title: 'Game title',
      liked: 23,
      image: '/assets/images/mockup/game/wallpaper/ireland-1971997_1280.jpg',
    },
    {
      title: 'Game title',
      liked: 41,
      image: '/assets/images/mockup/game/wallpaper/mystical-4854108_1280.jpg',
    },
    {
      title: 'Game title',
      liked: 7,
      image: '/assets/images/mockup/game/wallpaper/trees-5350721_1280.jpg',
    },
    {
      title: 'Game title',
      liked: 98,
      image: '/assets/images/mockup/game/wallpaper/fantasy-3049543_1280.jpg',
    },
    {
      title: 'Game title',
      liked: 18,
      image: '/assets/images/mockup/game/wallpaper/fantasy-2750995_1280.jpg',
    },
  ];

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

  @ViewChild('mainSlide') mainSlide: ElementRef | undefined;
  @ViewChild('subSlide') subSlide: ElementRef | undefined;

  mainSwiperConfig = {
    slidesPerView: 1,
    spaceBetween: 0,

    navigation: {
      prevEl: '.main-slide .slidePrev-btn',
      nextEl: '.main-slide .slideNext-btn',
    },

    pagination: {
      clickable: true,
    },

    injectStyles: [
      `

    .swiper-pagination-bullet {
      width: 12px;
      height: 12px;
      background: #D9D9D9;
      opacity: 0.7;
    }
    .swiper-pagination-bullet-active {
      background: #F9F8FD;
      opacity: 1 !important;
  }
    `,
    ],
  };
  subSwiperConfig = {
    slidesPerView: '1',
    spaceBetween: 20,

    navigation: {
      prevEl: '.sub-slide .slidePrev-btn',
      nextEl: '.sub-slide .slideNext-btn',
    },

    breakpoints: {
      450: {
        slidesPerView: '2',
      },
      576: {
        slidesPerView: '3',
      },
      768: {
        slidesPerView: '4',
      },

      1200: {
        slidesPerView: 'auto',
      },
    },
  };

  ngAfterViewInit(): void {
    const mainSwiper = this.mainSlide?.nativeElement;
    const subSwiper = this.subSlide?.nativeElement;

    if (mainSwiper) {
      Object.assign(mainSwiper, this.mainSwiperConfig);
    }
    if (subSwiper) {
      Object.assign(subSwiper, this.subSwiperConfig);
    }

    mainSwiper.initialize();
    subSwiper.initialize();
  }
}
