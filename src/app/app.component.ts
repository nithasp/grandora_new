import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isSignUpBetaPage: boolean = false;

  constructor(public router: Router, private location: Location) {}

  ngOnInit(): void {
    this.pathCheck();
  }

  pathCheck() {
    this.router.events.subscribe((event) => {
      if (this.location.path() === '/sign-up-closebeta') {
        this.isSignUpBetaPage = true;
      } else {
        this.isSignUpBetaPage = false;
      }
    });
  }
}
