import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/core/services';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @ViewChild('menuList') menuList!: ElementRef;

  isMenuDisplay: boolean = false;
  isPackageDisplay: boolean = false;
  isHamburgerMenuActive: boolean = false;
  isPurchaseMethodDisplay: boolean = false;
  isLogin: boolean = false;

  navbarMenu = [
    { name: 'Home', link: 'home' },
    { name: 'Games', link: 'games' },
    { name: 'Social', link: 'social/feed' },
    { name: 'News', link: 'news' },
    { name: 'Official Store', link: 'official-store' },
    { name: 'Support', link: 'support' },
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.subscribeGlobalService();
    this.initFunction();
  }

  subscribeGlobalService() {
    this.authService.getIsLogin().subscribe((value) => {
      this.isLogin = value;
    });
  }

  signOut() {
    this.authService.signOut();
  }

  handleClose(value: boolean) {
    this.isPackageDisplay = value;
  }

  initFunction() {
    // Close Menu List
    document.addEventListener('mousedown', (event: any) => {
      const elem = this.menuList?.nativeElement;
      if (elem && !elem.contains(event.target)) {
        this.isMenuDisplay = false;
      }
    });

    // Detect Screen Size
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 992) {
        this.isHamburgerMenuActive = false;
      }
    });
  }
}
