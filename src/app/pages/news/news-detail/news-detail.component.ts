import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss'],
})
export class NewsDetailComponent {
  item: any;

  blogs: any = [
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

  id!: string;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.findMatchedBlog();
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

  findMatchedBlog() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.item = this.blogs.find((item: any) => {
      return item.id === this.id;
    });
    this.blogs = this.blogs.slice(0, 3);
  }

  getRecommendedListItem(id: string) {
    this.item = this.blogs.find((item: any) => {
      return item.id === id;
    });
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
