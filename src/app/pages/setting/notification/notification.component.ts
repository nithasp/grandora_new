import { Component } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent {
  conversation = [
    {
      title: 'Message',
      isToggle: true,
    },
    {
      title: 'Post',
      isToggle: true,
    },
    {
      title: 'Comment',
      isToggle: true,
    },
  ];

  news = [
    {
      title: 'New post from your friends',
      isToggle: true,
    },
    {
      title: 'New friends publish new game',
      isToggle: true,
    },
    {
      title: 'Friends request',
      isToggle: true,
    },
    {
      title: 'Event from Grandora',
      isToggle: true,
    },
  ];
}
