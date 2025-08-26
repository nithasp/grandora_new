import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpOpenbetaComponent } from './sign-up-openbeta.component';

describe('SignUpOpenbetaComponent', () => {
  let component: SignUpOpenbetaComponent;
  let fixture: ComponentFixture<SignUpOpenbetaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignUpOpenbetaComponent]
    });
    fixture = TestBed.createComponent(SignUpOpenbetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
