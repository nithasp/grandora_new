import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-game-title',
  templateUrl: './game-title.component.html',
  styleUrls: ['./game-title.component.scss'],
})
export class GameTitleComponent {
  mainSlideItems = [
    {
      title: 'Game title',
      liked: 98,
      image: '/assets/images/mockup/game/game-title/Rectangle 9.jpg',
    },
    {
      title: 'Game title',
      liked: 18,
      image: '/assets/images/mockup/game/wallpaper/ireland-1971997_1280.jpg',
    },

    {
      title: 'Game title',
      liked: 23,
      image: '/assets/images/mockup/game/game-title/Rectangle 9.jpg',
    },
    {
      title: 'Game title',
      liked: 41,
      image: '/assets/images/mockup/game/wallpaper/balloon-5255326_1280.jpg',
    },
    {
      title: 'Game title',
      liked: 7,
      image: '/assets/images/mockup/game/wallpaper/fantasy-782001_1280.jpg',
    },
  ];
  mainImage: string = '';

  @ViewChild('mainSlide') mainSlide: ElementRef | undefined;

  mainSwiperConfig = {
    direction: 'vertical',
    slidesPerView: 'auto',
    spaceBetween: 8,

    navigation: {
      prevEl: '.main-slide .slidePrev-btn',
      nextEl: '.main-slide .slideNext-btn',
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

  ngOnInit() {
    this.mainImage = this.mainSlideItems[0].image;
  }

  ngAfterViewInit(): void {
    const mainSwiper = this.mainSlide?.nativeElement;

    if (mainSwiper) {
      Object.assign(mainSwiper, this.mainSwiperConfig);
    }

    mainSwiper.initialize();

    this.firstSlideActive();
    this.handleSlideActive();
  }

  handleChangeMainImage(item: any) {
    this.mainImage = item.image;
  }

  firstSlideActive() {
    const items = document.querySelectorAll('swiper-slide .item');
    items[0].classList.add('active');
    console.log(items[0])
  }

  handleSlideActive() {
    const items = document.querySelectorAll('swiper-slide .item');
    items.forEach((item) => {
      item.addEventListener('click', () => {
        items.forEach((allItem) => allItem.classList.remove('active'));
        item.classList.add('active');
      });
    });
  }
}
