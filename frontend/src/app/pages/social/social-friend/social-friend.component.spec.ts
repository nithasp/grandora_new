import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialFriendComponent } from './social-friend.component';

describe('SocialFriendComponent', () => {
  let component: SocialFriendComponent;
  let fixture: ComponentFixture<SocialFriendComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SocialFriendComponent]
    });
    fixture = TestBed.createComponent(SocialFriendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
