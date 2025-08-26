import { Component } from '@angular/core';
import { ChatService, SocialService } from 'src/app/core/services';
import { Router } from '@angular/router';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  friend_lists = [
    {
      id: '1',
      image_url: '',
      name: 'Name',
      username: '@username',
      time: '6 h',
    },
    {
      id: '2',
      image_url: '',
      name: 'Name',
      username: '@username',
      time: '12 h',
    },
    {
      id: '3',
      image_url: '',
      name: 'Name',
      username: '@username',
      time: '12 h',
    },
    {
      id: '4',
      image_url: '',
      name: 'Name',
      username: '@username',
      time: '20 h',
    },
    {
      id: '5',
      image_url: '',
      name: 'Name',
      username: '@username',
      time: '6 h',
    },
    {
      id: '6',
      image_url: '',
      name: 'Name',
      username: '@username',
      time: '20 h',
    },
    {
      id: '7',
      image_url: '',
      name: 'Name',
      username: '@username',
      time: '6 h',
    },
    {
      id: '8',
      image_url: '',
      name: 'Name',
      username: '@username',
      time: '6 h',
    },
    {
      id: '9',
      image_url: '',
      name: 'Name',
      username: '@username',
      time: '6 h',
    },
    {
      id: '10',
      image_url: '',
      name: 'Name',
      username: '@username',
      time: '6 h',
    },
    {
      id: '11',
      image_url: '',
      name: 'Name',
      username: '@username',
      time: '2 h',
    },
    {
      id: '12',
      image_url: '',
      name: 'Name',
      username: '@username',
      time: '6 h',
    },
    {
      id: '13',
      image_url: '',
      name: 'Name',
      username: '@username',
      time: '6 h',
    },
    {
      id: '14',
      image_url: '',
      name: 'Name',
      username: '@username',
      time: '4 h',
    },
    {
      id: '15',
      image_url: '',
      name: 'Name',
      username: '@username',
      time: '6 h',
    },
    {
      id: '16',
      image_url: '',
      name: 'Name',
      username: '@username',
      time: '6 h',
    },
    {
      id: '17',
      image_url: '',
      name: 'Name',
      username: '@username',
      time: '3 h',
    },
    {
      id: '18',
      image_url: '',
      name: 'Name',
      username: '@username',
      time: '6 h',
    },
    {
      id: '19',
      image_url: '',
      name: 'Name',
      username: '@username',
      time: '8 h',
    },
    {
      id: '20',
      image_url: '',
      name: 'Name',
      username: '@username',
      time: '6 h',
    },
  ];

  isChatBoxDisplay: boolean = false;
  isDotActive: boolean = false;

  constructor(
    private router: Router,
    private chatService: ChatService,
    private socialService: SocialService
  ) {}

  ngOnInit(): void {
    this.subscribeGlobalVariables();
    this.chatService.handleChatBoxDisplay(false);
  }

  handleFriend() {
    const friends = document.querySelectorAll(
      '.friend .friend-lists-wrapper .item'
    );

    friends.forEach((friend) => {
      friend.addEventListener('click', () => {
        friends.forEach((allFriend) => allFriend.classList.remove('active'));
        friend.classList.add('active');
      });
    });
  }

  subscribeGlobalVariables() {
    this.chatService
      .getIsChatBoxDisplay()
      .subscribe((value) => (this.isChatBoxDisplay = value));
  }

  handleChatBoxDisplay(value: boolean) {
    this.chatService.handleChatBoxDisplay(value);
  }

  handleViewProfile(id: string | undefined) {
    this.router.navigate(['social/friend/', id]);
    this.chatService.handleChatBoxDisplay(false);
    this.socialService.socialFriendId.next(id);
  }
}
