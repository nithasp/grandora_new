import { Component } from '@angular/core';

@Component({
  selector: 'app-social-friend',
  templateUrl: './social-friend.component.html',
  styleUrls: ['./social-friend.component.scss'],
})
export class SocialFriendComponent {
  friend_lists = [
    { id: '1', image_url: '', name: 'Name', username: '@username' },
    { id: '2', image_url: '', name: 'Name', username: '@username' },
    { id: '3', image_url: '', name: 'Name', username: '@username' },
    { id: '4', image_url: '', name: 'Name', username: '@username' },
    { id: '5', image_url: '', name: 'Name', username: '@username' },
    { id: '6', image_url: '', name: 'Name', username: '@username' },
    { id: '7', image_url: '', name: 'Name', username: '@username' },
    { id: '8', image_url: '', name: 'Name', username: '@username' },
    { id: '9', image_url: '', name: 'Name', username: '@username' },
    { id: '10', image_url: '', name: 'Name', username: '@username' },
    { id: '11', image_url: '', name: 'Name', username: '@username' },
    { id: '12', image_url: '', name: 'Name', username: '@username' },
    { id: '13', image_url: '', name: 'Name', username: '@username' },
    { id: '14', image_url: '', name: 'Name', username: '@username' },
    { id: '15', image_url: '', name: 'Name', username: '@username' },
    { id: '16', image_url: '', name: 'Name', username: '@username' },
    { id: '17', image_url: '', name: 'Name', username: '@username' },
    { id: '18', image_url: '', name: 'Name', username: '@username' },
    { id: '19', image_url: '', name: 'Name', username: '@username' },
    { id: '20', image_url: '', name: 'Name', username: '@username' },
  ];

  messages = [
    {
      id: '1',
      name: 'Name',
      image: 'assets/images/mockup/social/friend/Group 49.png',
      text: 'Hi. Sam',
    },
    {
      id: '2',
      name: 'Name',
      image: 'assets/images/mockup/social/friend/Group 28505.png',
      text: 'Michael. Good to meet you!',
    },
    {
      id: '3',
      name: 'Name',
      image: 'assets/images/mockup/social/friend/Group 49.png',
      text: 'Did you just arrive here?',
    },
    {
      id: '4',
      name: 'Name',
      image: 'assets/images/mockup/social/friend/Group 28505.png',
      text: 'Yeah, We arrived last week.',
    },
    {
      id: '5',
      name: 'Name',
      image: 'assets/images/mockup/social/friend/Group 49.png',
      text: 'How do you like it?',
    },
    {
      id: '6',
      name: 'Name',
      image: 'assets/images/mockup/social/friend/Group 28505.png',
      text: 'It’s exciting! ',
    },
    {
      id: '7',
      name: 'Name',
      image: 'assets/images/mockup/social/friend/Group 49.png',
      text: 'It really is very busy. I moved here from Tokyo 5 years ago and I still have trouble sometimes. Did you move here with your wife?',
    },
    {
      id: '8',
      name: 'Name',
      image: 'assets/images/mockup/social/friend/Group 28505.png',
      text: 'Actually, I’m not married. I moved here with my dog, Charles. We are very close.',
    },
    {
      id: '9',
      name: 'Name',
      image: 'assets/images/mockup/social/friend/Group 49.png',
      text: 'It really is very busy. I moved here from Tokyo 5 years ago and I still have trouble sometimes. Did you move here with your wife?',
    },
    {
      id: '10',
      name: 'Name',
      image: 'assets/images/mockup/social/friend/Group 28505.png',
      text: 'Actually, I’m not married. I moved here with my dog, Charles. We are very close.',
    },
  ];

  isChatStarted: boolean = false;
  chatName: string = '0';

  ngOnInit(): void {
    this.typeActive();
  }

  typeActive() {
    const types = document.querySelectorAll('.type');
    types.forEach((type) => {
      type.addEventListener('click', () => {
        types.forEach((allType) => allType.classList.remove('active'));
        type.classList.add('active');
      });
    });
  }

  handleFriend(index: any) {
    this.isChatStarted = true;
    this.chatName = index;
    const friends = document.querySelectorAll(
      '.friend-lists .friend-lists-wrapper .item'
    );

    friends.forEach((friend) => {
      friend.addEventListener('click', () => {
        friends.forEach((allFriend) => allFriend.classList.remove('active'));
        friend.classList.add('active');
      });
    });
  }
}
