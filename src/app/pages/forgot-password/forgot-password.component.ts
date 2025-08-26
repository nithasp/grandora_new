import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/core/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  forgotPasswordForm!: FormGroup;
  resetPasswordForm!: FormGroup;
  step: number = 1;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.forgotPasswordFormInit();
    this.resetPasswordFormInit();
  }

  forgotPasswordFormInit() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: [
        null,
        [
          Validators.required,
          Validators.pattern(
            /^[A-Za-z0-9]+(?:[.-][A-Za-z0-9]+)*@[A-Za-z0-9]+(?:[.-][A-Za-z0-9]+)*\.[a-z]{2,}$/
          ),
        ],
      ],
    });
  }

  resetPasswordFormInit() {
    this.resetPasswordForm = this.formBuilder.group(
      {
        password: [
          null,
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(16),
            Validators.pattern(
              /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{1,}$/
            ),
          ],
        ],
        confirm_password: [null, Validators.required],
      },
      {
        validators: [this.passwordMustMatch],
      }
    );
  }

  passwordMustMatch: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | any => {
    const password = control.get('password')!;
    const confirm_password = control.get('confirm_password')!;
    if (confirm_password.errors && !confirm_password.errors?.['MustMatch']) {
      return null;
    }
    if (password.value !== confirm_password.value) {
      confirm_password.setErrors({ MustMatch: true });
    } else {
      confirm_password.setErrors(null);
    }
  };

  handleForgotPassword() {
    if (this.forgotPasswordForm?.valid) {
      this.step++;
    }
    this.forgotPasswordForm.markAllAsTouched();
  }

  handleResetPassword() {
    if (this.resetPasswordForm?.valid) {
       
    }
    this.resetPasswordForm.markAllAsTouched();
  }

  get email() {
    return this.forgotPasswordForm.get('email')!;
  }
  get password() {
    return this.resetPasswordForm.get('password')!;
  }
  get confirm_password() {
    return this.resetPasswordForm.get('confirm_password')!;
  }
}
