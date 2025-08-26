import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordAndPrivacyComponent } from './password-and-privacy.component';

describe('PasswordAndPrivacyComponent', () => {
  let component: PasswordAndPrivacyComponent;
  let fixture: ComponentFixture<PasswordAndPrivacyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PasswordAndPrivacyComponent]
    });
    fixture = TestBed.createComponent(PasswordAndPrivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
