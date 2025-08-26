import { Component } from '@angular/core';

@Component({
  selector: 'app-creators-wall',
  templateUrl: './creators-wall.component.html',
  styleUrls: ['./creators-wall.component.scss']
})
export class CreatorsWallComponent {
  posts = [
    {
      image: undefined,
      profile_icon: 'assets/images/mockup/feed/Group 28491.png',
      name: 'Sarah Smith',
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
      name: 'John Smith',
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
}
