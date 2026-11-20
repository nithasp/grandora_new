import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocialService } from 'src/app/core/services';
@Component({
  selector: 'app-social-friend-detail',
  templateUrl: './social-friend-detail.component.html',
  styleUrls: ['./social-friend-detail.component.scss'],
})
export class SocialFriendDetailComponent {
  posts = [
    {
      image: undefined,
      profile_icon: 'assets/images/mockup/feed/Group 28491.png',
      name: 'Katherine Janney',
      date: 'January 22, 2023',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation',
      like: '16',
      comment: [
        {
          image: 'assets/images/mockup/feed/Group 28491.png',
          name: 'John Sandiana',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation',
          like: '259',
          date: 'January 25, 2023',
          sub_comment: undefined,
        },
        {
          image: 'assets/images/mockup/feed/Group 28548.png',
          name: 'Sam Yong',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          like: '13',
          date: 'January 25, 2023',
          sub_comment: undefined,
        },
      ],
    },

    {
      image: [],
      profile_icon: 'assets/images/mockup/feed/Group 28491.png',
      name: 'Katherine Janney',
      date: 'January 25, 2023',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation',
      like: '259',
      comment: [
        {
          image: 'assets/images/mockup/feed/Group 28491.png',
          name: 'John Sandiana',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation',
          like: '259',
          date: 'January 25, 2023',
          sub_comment: [
            {
              image: 'assets/images/mockup/feed/Group 28548.png',
              name: 'Yong Sam',
              description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
              like: '13',
              date: 'January 25, 2023',
            },
          ],
        },
        {
          image: 'assets/images/mockup/feed/Group 28548.png',
          name: 'Sam Yong',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          like: '13',
          date: 'January 25, 2023',
          sub_comment: undefined,
        },
      ],
    },

    {
      image: undefined,
      profile_icon: 'assets/images/mockup/feed/Group 28491.png',
      name: 'Smith John',
      date: 'January 11, 2023',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation',
      like: '78',
      comment: [
        {
          image: 'assets/images/mockup/feed/Group 28491.png',
          name: 'John Sandiana',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation',
          like: '259',
          date: 'January 25, 2023',
          sub_comment: undefined,
        },
        {
          image: 'assets/images/mockup/feed/Group 28548.png',
          name: 'Sam Yong',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          like: '13',
          date: 'January 25, 2023',
          sub_comment: undefined,
        },
      ],
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

  description: string = '';

  id!: string;

  isPermissionDisplay: boolean = false;
  isAddMediaDisplay: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private socialService: SocialService
  ) {}

  ngOnInit() {
    this.subscribeGlobalVariables();

    this.socialService.socialFriendId.next(
      this.route.snapshot.paramMap.get('id')!
    );
  }

  subscribeGlobalVariables() {
    this.socialService
      .getSocialFriendId()
      .subscribe((value: any) => (this.id = value));
  }

  handleDisplayMedia(value: boolean) {
    if (value) {
      this.isAddMediaDisplay = true;
    } else {
      this.isAddMediaDisplay = false;
    }
  }

  handleDisplayPost(value: boolean) {
    if (value) {
      this.isPermissionDisplay = true;
    } else {
      this.isPermissionDisplay = false;
    }
  }
}
