import { Component, ViewChild, ElementRef } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent {
  @ViewChild('subBlogRef') subBlogRef: ElementRef | undefined;

  tagSwiperConfig = {
    slidesPerView: 'auto',
    spaceBetween: 12,

    navigation: {
      prevEl: '.news-section3 .slidePrev-btn',
      nextEl: '.news-section3 .slideNext-btn',
    },
    injectStyles: [
      `
      .swiper-wrapper{
        align-items: center;
        text-align: center;
     }
      `,
    ],
    breakpoints: {
      992: {
        slidesPerView: 'auto',
      },
    },
  };
  newsSwiperConfig = {
    slidesPerView: 3,
    spaceBetween: 24,
    slidesPerGroup: 3,
    navigation: {
      prevEl: '.news-section2 .slidePrev-btn',
      nextEl: '.news-section2 .slideNext-btn',
    },
    breakpoints: {
      992: {
        spaceBetween: 30,
      },
    },
  };
  tags = [
    {
      id: '0',
      name: 'All',
    },
    {
      id: '1',
      name: 'EA FC 24',
    },
    {
      id: '2',
      name: 'Promo News',
    },
    {
      id: '3',
      name: 'Player Reviews',
    },
    {
      id: '4',
      name: 'Promo Squad Predictions',
    },
    {
      id: '5',
      name: 'Tactics & Tutorials',
    },
    {
      id: '6',
      name: 'Cop or Flop',
    },
    {
      id: '0',
      name: 'All',
    },
    {
      id: '1',
      name: 'EA FC 24',
    },
    {
      id: '2',
      name: 'Promo News',
    },
    {
      id: '3',
      name: 'Player Reviews',
    },
    {
      id: '4',
      name: 'Promo Squad Predictions',
    },
    {
      id: '5',
      name: 'Tactics & Tutorials',
    },
    {
      id: '6',
      name: 'Cop or Flop',
    },
  ];
  blogs = [
    {
      id: '1',
      author: 'Dan',
      title: 'The Best Centurions Sharpshooter Evol…',
      content:
        'The Pomeranian, also known as the Pomeranian (Pom dog), is always in the top of the cutest pets. Not only that, the small, lovely, smart, friendly, and skillful circus dog breed.',
      date: '2023-11-01 15:50:00.000 +0700',
      image: '/assets/images/mockup/blog/blog1.jpg',
      comment: '13',
      avg_read_time: '5',
      game: 'Dragon Strike: Puzzle RPG',
      tags: ['EA FC 24'],
    },
    {
      id: '2',
      author: 'Dan',
      title: 'FC 24 89 Centurions Grace Geyoro Player Review',
      content:
        'The Pomeranian, also known as the Pomeranian (Pom dog), is always in the top of the cutest pets. Not only that, the small, lovely, smart, friendly, and skillful circus dog breed.',
      date: '2023-11-01 15:50:00.000 +0700',
      image: '/assets/images/mockup/blog/blog2.jpg',
      comment: '13',
      avg_read_time: '5',
      game: 'Dragon Strike: Puzzle RPG',
      tags: ['EA FC 24', 'Player Reviews'],
    },
    {
      id: '3',
      author: 'Dan',
      title: 'The Best Centurions Box to Box Evolutions',
      content:
        'The Pomeranian, also known as the Pomeranian (Pom dog), is always in the top of the cutest pets. Not only that, the small, lovely, smart, friendly, and skillful circus dog breed.',
      date: '2023-11-01 15:50:00.000 +0700',
      image: '/assets/images/mockup/blog/blog3.jpg',
      comment: '13',
      avg_read_time: '5',
      game: 'Dragon Strike: Puzzle RPG',
      tags: ['EA FC 24'],
    },
    {
      id: '4',
      author: 'Dan',
      title: 'Legacy Litepaper: Shape Your Business Destiny',
      content:
        'The Pomeranian, also known as the Pomeranian (Pom dog), is always in the top of the cutest pets. Not only that, the small, lovely, smart, friendly, and skillful circus dog breed.',
      date: '2023-10-18 12:00:00.000 +0700',
      image: '/assets/images/mockup/blog/blog4.jpg',
      comment: '13',
      avg_read_time: '5',
      game: 'Dragon Strike: Puzzle RPG',
      tags: ['EA FC 24', 'Promo News'],
    },
    {
      id: '5',
      author: 'Dan',
      title: 'New Dragon Slayer Reveal: Ignarok',
      content:
        'The Pomeranian, also known as the Pomeranian (Pom dog), is always in the top of the cutest pets. Not only that, the small, lovely, smart, friendly, and skillful circus dog breed.',
      date: '2023-10-18 12:00:00.000 +0700',
      image: '/assets/images/mockup/blog/blog5.jpg',
      comment: '13',
      avg_read_time: '5',
      game: 'Dragon Strike: Puzzle RPG',
      tags: ['EA FC 24', 'Promo Squad Predictions'],
    },
    {
      id: '6',
      author: 'Dan',
      title: 'Spider Tanks Showcase: Movement Abilities',
      content:
        'The Pomeranian, also known as the Pomeranian (Pom dog), is always in the top of the cutest pets. Not only that, the small, lovely, smart, friendly, and skillful circus dog breed.',
      date: '2023-10-18 12:00:00.000 +0700',
      image: '/assets/images/mockup/blog/blog6.jpg',
      comment: '13',
      avg_read_time: '5',
      game: 'Dragon Strike: Puzzle RPG',
      tags: ['EA FC 24'],
    },
    {
      id: '7',
      author: 'Dan',
      title: 'Legacy Litepaper: Shape Your Business Destiny',
      content:
        'The Pomeranian, also known as the Pomeranian (Pom dog), is always in the top of the cutest pets. Not only that, the small, lovely, smart, friendly, and skillful circus dog breed.',
      date: '2023-10-18 12:00:00.000 +0700',
      image: '/assets/images/mockup/blog/blog7.jpg',
      comment: '13',
      avg_read_time: '5',
      game: 'Dragon Strike: Puzzle RPG',
      tags: ['EA FC 24', 'Promo News'],
    },
    {
      id: '8',
      author: 'Dan',
      title: 'New Dragon Slayer Reveal: Ignarok',
      content:
        'The Pomeranian, also known as the Pomeranian (Pom dog), is always in the top of the cutest pets. Not only that, the small, lovely, smart, friendly, and skillful circus dog breed.',
      date: '2023-10-18 12:00:00.000 +0700',
      image: '/assets/images/mockup/blog/blog8.jpg',
      comment: '13',
      avg_read_time: '5',
      game: 'Dragon Strike: Puzzle RPG',
      tags: ['Tactics & Tutorials'],
    },
    {
      id: '9',
      author: 'Dan',
      title: 'Spider Tanks Showcase: Movement Abilities',
      content:
        'The Pomeranian, also known as the Pomeranian (Pom dog), is always in the top of the cutest pets. Not only that, the small, lovely, smart, friendly, and skillful circus dog breed.',
      date: '2023-10-18 12:00:00.000 +0700',
      image: '/assets/images/mockup/blog/blog9.jpg',
      comment: '13',
      avg_read_time: '5',
      game: 'Dragon Strike: Puzzle RPG',
      tags: ['Cop or Flop'],
    },
    {
      id: '10',
      author: 'Dan',
      title: 'Sit-N-Go Action Added | PokerGO Play',
      content:
        'The Pomeranian, also known as the Pomeranian (Pom dog), is always in the top of the cutest pets. Not only that, the small, lovely, smart, friendly, and skillful circus dog breed.',
      date: '2023-10-18 12:00:00.000 +0700',
      image: '/assets/images/mockup/blog/blog10.jpg',
      comment: '13',
      avg_read_time: '5',
      game: 'Dragon Strike: Puzzle RPG',
      tags: ['EA FC 24'],
    },
    {
      id: '11',
      author: 'Dan',
      title: 'What is a Pomeranian? How to Identify Pomeranian Dogs',
      content:
        'The Pomeranian, also known as the Pomeranian (Pom dog), is always in the top of the cutest pets. Not only that, the small, lovely, smart, friendly, and skillful circus dog breed.',
      date: '2023-10-18 12:00:00.000 +0700',
      image: '/assets/images/mockup/blog/blog11.jpg',
      comment: '13',
      avg_read_time: '5',
      game: 'Dragon Strike: Puzzle RPG',
      tags: ['EA FC 24', 'Cop or Flop'],
    },
    {
      id: '12',
      author: 'Dan',
      title: 'Legacy Litepaper: Shape Your Business Destiny',
      content:
        'The Pomeranian, also known as the Pomeranian (Pom dog), is always in the top of the cutest pets. Not only that, the small, lovely, smart, friendly, and skillful circus dog breed.',
      date: '2023-10-18 12:00:00.000 +0700',
      image: '/assets/images/mockup/blog/blog12.jpg',
      comment: '13',
      avg_read_time: '5',
      game: 'Dragon Strike: Puzzle RPG',
      tags: ['EA FC 24', 'Cop or Flop'],
    },
    {
      id: '13',
      author: 'Dan',
      title: 'The Best Centurions Sharpshooter Evol…',
      content:
        'The Pomeranian, also known as the Pomeranian (Pom dog), is always in the top of the cutest pets. Not only that, the small, lovely, smart, friendly, and skillful circus dog breed.',
      date: '2023-11-01 15:50:00.000 +0700',
      image: '/assets/images/mockup/blog/blog1.jpg',
      comment: '13',
      avg_read_time: '5',
      game: 'Dragon Strike: Puzzle RPG',
      tags: ['EA FC 24', 'Cop or Flop'],
    },
    {
      id: '14',
      author: 'Dan',
      title: 'FC 24 89 Centurions Grace Geyoro Player Review',
      content:
        'The Pomeranian, also known as the Pomeranian (Pom dog), is always in the top of the cutest pets. Not only that, the small, lovely, smart, friendly, and skillful circus dog breed.',
      date: '2023-11-01 15:50:00.000 +0700',
      image: '/assets/images/mockup/blog/blog2.jpg',
      comment: '13',
      avg_read_time: '5',
      game: 'Dragon Strike: Puzzle RPG',
      tags: ['EA FC 24', 'Player Reviews', 'Cop or Flop'],
    },
    {
      id: '15',
      author: 'Dan',
      title: 'The Best Centurions Box to Box Evolutions',
      content:
        'The Pomeranian, also known as the Pomeranian (Pom dog), is always in the top of the cutest pets. Not only that, the small, lovely, smart, friendly, and skillful circus dog breed.',
      date: '2023-11-01 15:50:00.000 +0700',
      image: '/assets/images/mockup/blog/blog3.jpg',
      comment: '13',
      avg_read_time: '5',
      game: 'Dragon Strike: Puzzle RPG',
      tags: ['EA FC 24', 'Cop or Flop'],
    },
    {
      id: '16',
      author: 'Dan',
      title: 'Legacy Litepaper: Shape Your Business Destiny',
      content:
        'The Pomeranian, also known as the Pomeranian (Pom dog), is always in the top of the cutest pets. Not only that, the small, lovely, smart, friendly, and skillful circus dog breed.',
      date: '2023-10-18 12:00:00.000 +0700',
      image: '/assets/images/mockup/blog/blog4.jpg',
      comment: '13',
      avg_read_time: '5',
      game: 'Dragon Strike: Puzzle RPG',
      tags: ['EA FC 24', 'Promo News', 'Cop or Flop'],
    },
    {
      id: '17',
      author: 'Dan',
      title: 'New Dragon Slayer Reveal: Ignarok',
      content:
        'The Pomeranian, also known as the Pomeranian (Pom dog), is always in the top of the cutest pets. Not only that, the small, lovely, smart, friendly, and skillful circus dog breed.',
      date: '2023-10-18 12:00:00.000 +0700',
      image: '/assets/images/mockup/blog/blog5.jpg',
      comment: '13',
      avg_read_time: '5',
      game: 'Dragon Strike: Puzzle RPG',
      tags: ['EA FC 24', 'Promo Squad Predictions', 'Cop or Flop'],
    },
    {
      id: '18',
      author: 'Dan',
      title: 'Spider Tanks Showcase: Movement Abilities',
      content:
        'The Pomeranian, also known as the Pomeranian (Pom dog), is always in the top of the cutest pets. Not only that, the small, lovely, smart, friendly, and skillful circus dog breed.',
      date: '2023-10-18 12:00:00.000 +0700',
      image: '/assets/images/mockup/blog/blog6.jpg',
      comment: '13',
      avg_read_time: '5',
      game: 'Dragon Strike: Puzzle RPG',
      tags: ['EA FC 24', 'Cop or Flop'],
    },
    {
      id: '19',
      author: 'Dan',
      title: 'Legacy Litepaper: Shape Your Business Destiny',
      content:
        'The Pomeranian, also known as the Pomeranian (Pom dog), is always in the top of the cutest pets. Not only that, the small, lovely, smart, friendly, and skillful circus dog breed.',
      date: '2023-10-18 12:00:00.000 +0700',
      image: '/assets/images/mockup/blog/blog7.jpg',
      comment: '13',
      avg_read_time: '5',
      game: 'Dragon Strike: Puzzle RPG',
      tags: ['EA FC 24', 'Promo News', 'Cop or Flop'],
    },
    {
      id: '20',
      author: 'Dan',
      title: 'New Dragon Slayer Reveal: Ignarok',
      content:
        'The Pomeranian, also known as the Pomeranian (Pom dog), is always in the top of the cutest pets. Not only that, the small, lovely, smart, friendly, and skillful circus dog breed.',
      date: '2023-10-18 12:00:00.000 +0700',
      image: '/assets/images/mockup/blog/blog8.jpg',
      comment: '13',
      avg_read_time: '5',
      game: 'Dragon Strike: Puzzle RPG',
      tags: ['Tactics & Tutorials', 'Cop or Flop'],
    },
    {
      id: '21',
      author: 'Dan',
      title: 'Spider Tanks Showcase: Movement Abilities',
      content:
        'The Pomeranian, also known as the Pomeranian (Pom dog), is always in the top of the cutest pets. Not only that, the small, lovely, smart, friendly, and skillful circus dog breed.',
      date: '2023-10-18 12:00:00.000 +0700',
      image: '/assets/images/mockup/blog/blog9.jpg',
      comment: '13',
      avg_read_time: '5',
      game: 'Dragon Strike: Puzzle RPG',
      tags: ['Cop or Flop', 'Cop or Flop'],
    },
    {
      id: '22',
      author: 'Dan',
      title: 'Sit-N-Go Action Added | PokerGO Play',
      content:
        'The Pomeranian, also known as the Pomeranian (Pom dog), is always in the top of the cutest pets. Not only that, the small, lovely, smart, friendly, and skillful circus dog breed.',
      date: '2023-10-18 12:00:00.000 +0700',
      image: '/assets/images/mockup/blog/blog10.jpg',
      comment: '13',
      avg_read_time: '5',
      game: 'Dragon Strike: Puzzle RPG',
      tags: ['EA FC 24', 'Cop or Flop'],
    },
    {
      id: '23',
      author: 'Dan',
      title: 'What is a Pomeranian? How to Identify Pomeranian Dogs',
      content:
        'The Pomeranian, also known as the Pomeranian (Pom dog), is always in the top of the cutest pets. Not only that, the small, lovely, smart, friendly, and skillful circus dog breed.',
      date: '2023-10-18 12:00:00.000 +0700',
      image: '/assets/images/mockup/blog/blog11.jpg',
      comment: '13',
      avg_read_time: '5',
      game: 'Dragon Strike: Puzzle RPG',
      tags: ['EA FC 24', 'Cop or Flop'],
    },
    {
      id: '24',
      author: 'Dan',
      title: 'Legacy Litepaper: Shape Your Business Destiny',
      content:
        'The Pomeranian, also known as the Pomeranian (Pom dog), is always in the top of the cutest pets. Not only that, the small, lovely, smart, friendly, and skillful circus dog breed.',
      date: '2023-10-18 12:00:00.000 +0700',
      image: '/assets/images/mockup/blog/blog12.jpg',
      comment: '13',
      avg_read_time: '5',
      game: 'Dragon Strike: Puzzle RPG',
      tags: ['EA FC 24', 'Cop or Flop'],
    },
  ];

  tag: string = 'All';

  recommendedLists: any = [
    {
      name: 'Name1',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing Ac aliquam ac volutpat, viverra magna risus aliquam massa. Ac aliquam ac volutpat, viverra magna risus. ',
      footer: 'Experienced team',
    },
    {
      name: 'Lorem ipsum dolor sit amet2',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
      footer: 'Experienced team',
    },
    {
      name: 'Name3',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing Ac aliquam ac volutpat. ',
      footer: 'Experienced team',
    },
    {
      name: 'Name4',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing Ac aliquam ac volutpat, viverra magna risus aliquam massa. Ac aliquam ac volutpat, viverra magna risus. ',
      footer: 'Experienced team',
    },
    {
      name: 'Lorem ipsum dolor sit amet5',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
      footer: 'Experienced team',
    },
    {
      name: 'Name6',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing Ac aliquam ac volutpat. ',
      footer: 'Experienced team',
    },
    {
      name: 'Name7',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing Ac aliquam ac volutpat, viverra magna risus aliquam massa. Ac aliquam ac volutpat, viverra magna risus. ',
      footer: 'Experienced team',
    },
    {
      name: 'Lorem ipsum dolor sit amet8',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
      footer: 'Experienced team',
    },
    {
      name: 'Name9',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing Ac aliquam ac volutpat. ',
      footer: 'Experienced team',
    },
    {
      name: 'Name10',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing Ac aliquam ac volutpat, viverra magna risus aliquam massa. Ac aliquam ac volutpat, viverra magna risus. ',
      footer: 'Experienced team',
    },
    {
      name: 'Lorem ipsum dolor sit amet11',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
      footer: 'Experienced team',
    },
    {
      name: 'Name12',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing Ac aliquam ac volutpat. ',
      footer: 'Experienced team',
    },
  ];
  filterRecommendedLists: any = [];

  filterBlogs: any = [];
  mainBlog: any = [];
  subBlog: any = [];

  isMainBlogDisplay: boolean = true;
  isBlogLoading: boolean = false;

  mainBlogTimeOut: any;

  ngOnInit(): void {
    this.filterBlogs = this.blogs;
    this.filterRecommendedLists = this.recommendedLists;

    this.getTags();
    this.getFilterRecommendedLists();
    this.getFilterBlog();
  }

  ngAfterViewInit(): void {
    const recommendedListsSwiper: any = document.querySelector(
      'swiper-container.recommended-lists-carousel'
    );
    if (recommendedListsSwiper) {
      Object.assign(recommendedListsSwiper, this.newsSwiperConfig);
    }
    recommendedListsSwiper.initialize();

    const tagsSwiper: any = document.querySelector(
      'swiper-container.tags-carousel'
    );
    if (tagsSwiper) {
      Object.assign(tagsSwiper, this.tagSwiperConfig);
    }
    tagsSwiper.initialize();
  }

  getTags() {
    let tagList = this.blogs
      .map((i) => i.tags)
      .flat()
      .reduce((total: any, item: any) => {
        if (item) {
          if (!total[item]) {
            total[item] = {
              item,
            };
          }
        }
        return total;
      }, {});

    tagList = Object.values(tagList).map((i: any, index) => {
      return {
        id: index,
        name: i.item,
      };
    });

    this.tags = tagList;
  }

  getFilterBlog() {
    clearTimeout(this.mainBlogTimeOut);
    this.isMainBlogDisplay = false;

    const mainBlog = this.filterBlogs.slice(0, 3);
    const subBlog = this.filterBlogs.slice(3, 12);

    this.mainBlog = mainBlog;
    this.subBlog = subBlog;

    this.mainBlogTimeOut = setTimeout(() => {
      this.isMainBlogDisplay = true;
    }, 10);
  }

  getFilterRecommendedLists() {
    const filterRecommendedLists = this.recommendedLists.reverse().slice(0, 3);
    this.filterRecommendedLists = filterRecommendedLists;
  }

  addRecommendedLists() {
    const selectedRecommendedLists = this.recommendedLists.slice(
      this.filterRecommendedLists.length,
      this.filterRecommendedLists.length + 3
    );
    this.filterRecommendedLists.push(...selectedRecommendedLists);
  }

  addBlogs() {
    this.isBlogLoading = true;

    setTimeout(() => {
      const selectedSubBlogs = this.filterBlogs.slice(
        this.subBlog.length + 3,
        this.subBlog.length + 9
      );

      this.subBlog.push(...selectedSubBlogs);

      var subBlogWrapper: any = this.subBlogRef?.nativeElement;
      var observer = new MutationObserver(() => {
        const elem =
          subBlogWrapper.children[subBlogWrapper.children.length - 6];
        const elemTop = elem.offsetTop;
        const elemBottom = elemTop + elem.offsetHeight;
        window.scrollTo({
          top: elemTop - 80,
          behavior: 'smooth',
        });
        this.isBlogLoading = false;
      });
      observer.observe(subBlogWrapper, {
        attributes: false,
        childList: true,
        subtree: true,
      });
    }, 800);
  }

  getDateFormat(date: string, type: string) {
    if (date) {
      if (type === 'mainBlog') {
        return moment(date).format('DD-MMM-YY HH:mm');
      } else {
        return moment(date).format('MMM DD');
      }
    }
    return;
  }

  tabActive(tagName: string) {
    const tabBtn = document.querySelectorAll(
      '.news-section3 .tags .tag-container .tag'
    );
    tabBtn.forEach((item) => {
      item.addEventListener('click', () => {
        tabBtn.forEach((allItem) => allItem.classList.remove('active'));
        item.classList.add('active');
      });
    });

    let filterBlog = this.blogs.filter((i) => {
      return tagName === 'All' ? i : i.tags.includes(tagName);
    });
    this.filterBlogs = filterBlog;
    this.getFilterBlog();
  }

  handleNewsDetail(item: any) {
    console.log(item)
  }
}
