import { Component } from '@angular/core';

@Component({
  selector: 'app-password-and-privacy',
  templateUrl: './password-and-privacy.component.html',
  styleUrls: ['./password-and-privacy.component.scss'],
})
export class PasswordAndPrivacyComponent {
  whoCanSendMessage = [
    {
      title: 'My friends',
      isToggle: true,
    },
    {
      title: 'My close friends',
      isToggle: true,
    },
    {
      title: 'My best friends',
      isToggle: true,
    },
    {
      title: 'Friends of friends',
      isToggle: false,
    },
    {
      title: 'My members',
      isToggle: true,
    },
    {
      title: 'My following',
      isToggle: true,
    },
    {
      title: 'My follower',
      isToggle: true,
    },
    {
      title: 'My members',
      isToggle: true,
    },
  ];

  whatInfo = [
    {
      title: 'List and number of My friends',
      isToggle: true,
    },
    {
      title: 'List and number of My Follower',
      isToggle: true,
    },
    {
      title: 'List and number of My following',
      isToggle: true,
    },
  ];

  whoCanSeeYourProfile = [
    {
      title: 'My friends',
      isToggle: true,
    },
    {
      title: 'My close friends',
      isToggle: true,
    },
    {
      title: 'My best friends',
      isToggle: true,
    },
    {
      title: 'Friends of friends',
      isToggle: false,
    },
    {
      title: 'My members',
      isToggle: true,
    },
    {
      title: 'My following',
      isToggle: true,
    },
    {
      title: 'My follower',
      isToggle: true,
    },
    {
      title: 'My members',
      isToggle: true,
    },
  ];

  blocked_users = [
    {
      image: '/assets/images/mockup/profile/Group 28491.png',
      name: 'Name Lastname',
      username: '@username',
    },
    {
      image: '/assets/images/mockup/profile/Group 28491.png',
      name: 'Name Lastname',
      username: '@username',
    },
    {
      image: '/assets/images/mockup/profile/Group 28491.png',
      name: 'Name Lastname',
      username: '@username',
    },
  ];

  isBlockListDisplay: boolean = false;
  name: string = '';

  ngOnInit() {
    this.slideToggleInit();
  }

  slideToggleInit() {
    const slideToggle = document.querySelectorAll('.slide-toggle-grandora');
    slideToggle.forEach((item) => {
      item.addEventListener('click', () => {
        item.classList.toggle('active');
      });
    });
  }
}
