import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpClosebetaComponent } from './sign-up-closebeta.component';

describe('SignUpClosebetaComponent', () => {
  let component: SignUpClosebetaComponent;
  let fixture: ComponentFixture<SignUpClosebetaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignUpClosebetaComponent]
    });
    fixture = TestBed.createComponent(SignUpClosebetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
