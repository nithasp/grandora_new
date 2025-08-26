import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent {
  @Input() posts: any = [];
  @Input() feedHeight: any = '1500px';

  description: string = '';

  constructor() {}

}
