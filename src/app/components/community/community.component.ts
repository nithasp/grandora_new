import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss'],
})
export class CommunityComponent {
  @ViewChild('swiperRef') swiperRef: ElementRef | undefined;

  communitySwiperConfig = {
    slidesPerView: 1,
    spaceBetween: 0,

    navigation: {
      prevEl: '#community-component .slidePrev-btn',
      nextEl: '#community-component .slideNext-btn',
    },
  };

  ngAfterViewInit(): void {
    const communitySwiper = this.swiperRef?.nativeElement;
    if (communitySwiper) {
      Object.assign(communitySwiper, this.communitySwiperConfig);
    }
    communitySwiper.initialize();
  }
}
