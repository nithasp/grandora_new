import { Component } from '@angular/core';

@Component({
  selector: 'app-sponsored',
  templateUrl: './sponsored.component.html',
  styleUrls: ['./sponsored.component.scss'],
})
export class SponsoredComponent {
  sponsoredItems = [
    {
      image: 'assets/images/mockup/sponsored/Rectangle 9.jpg',
      description: 'New Game, try now before it’s too late',
    },
    {
      image: 'assets/images/mockup/sponsored/Rectangle 9.jpg',
      description: 'New Game, try now before it’s too late',
    },
  ];
}
