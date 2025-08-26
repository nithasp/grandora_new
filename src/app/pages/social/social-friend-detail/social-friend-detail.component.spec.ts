import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialFriendDetailComponent } from './social-friend-detail.component';

describe('SocialFriendDetailComponent', () => {
  let component: SocialFriendDetailComponent;
  let fixture: ComponentFixture<SocialFriendDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SocialFriendDetailComponent]
    });
    fixture = TestBed.createComponent(SocialFriendDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
