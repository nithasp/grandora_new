import { Component } from '@angular/core';

@Component({
  selector: 'app-interest',
  templateUrl: './interest.component.html',
  styleUrls: ['./interest.component.scss'],
})
export class InterestComponent {
  interestItemMockup = [
    {
      title: 'Action',
      isChecked: false,
    },
    {
      title: 'Platformer',
      isChecked: false,
    },
    {
      title: 'Real World Roleplay',
      isChecked: false,
    },
    {
      title: 'Simulation',
      isChecked: false,
    },
    {
      title: 'Survival mini game',
      isChecked: false,
    },
    {
      title: 'Action',
      isChecked: false,
    },
    {
      title: 'Platformer',
      isChecked: false,
    },
    {
      title: 'Real World Roleplay',
      isChecked: false,
    },
    {
      title: 'Simulation',
      isChecked: false,
    },
    {
      title: 'Survival mini game',
      isChecked: false,
    },
  ];

  isInterestDisplay: boolean = false;
}
