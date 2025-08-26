import { Component } from '@angular/core';

@Component({
  selector: 'app-social-feed',
  templateUrl: './social-feed.component.html',
  styleUrls: ['./social-feed.component.scss'],
})
export class SocialFeedComponent {
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

  messages = [
    { name: 'John Sandiana' },
    { name: 'Sam Rankin' },
    { name: 'Ian Kanbrah' },
    { name: 'Hallen Bass' },
    { name: 'Jack Lloyd' },
  ];

  permission = [
    {
      value: '1',
      name: 'Everyone can see',
    },
    {
      value: '2',
      name: 'My friends',
    },
    {
      value: '3',
      name: 'My close friends',
    },
    {
      value: '4',
      name: 'My best friends',
    },
    {
      value: '5',
      name: 'My members',
    },
    {
      value: '6',
      name: 'My following',
    },
    {
      value: '7',
      name: 'My follower',
    },
    {
      value: '8',
      name: 'My members',
    },
  ];

  description: string = '';
  isPermissionDisplay: boolean = false;
  isAddMediaDisplay: boolean = false;

  handleDisplayPost(value: boolean) {
    if (value) {
      this.isPermissionDisplay = true;
    } else {
      this.isPermissionDisplay = false;
    }
  }

  handleDisplayMedia(value: boolean) {
    if (value) {
      this.isAddMediaDisplay = true;
    } else {
      this.isAddMediaDisplay = false;
    }
  }
}
