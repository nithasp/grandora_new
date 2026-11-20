import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelingMembershipComponent } from './canceling-membership.component';

describe('CancelingMembershipComponent', () => {
  let component: CancelingMembershipComponent;
  let fixture: ComponentFixture<CancelingMembershipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CancelingMembershipComponent]
    });
    fixture = TestBed.createComponent(CancelingMembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
