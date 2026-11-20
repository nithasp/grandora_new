import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, PlayerService } from 'src/app/core/services';
import Swal from 'sweetalert2';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  isLoading: boolean = false;
  isDemoLoading: boolean = false;
  readonly demoEnabled = environment.autoDemoLogin;
  signInForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private playerService: PlayerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signInFormInit();
  }

  signInFormInit() {
    this.signInForm = this.formBuilder.group({
      email: [
        null,
        [
          Validators.required,
          Validators.pattern(
            /^[A-Za-z0-9]+(?:[.-][A-Za-z0-9]+)*@[A-Za-z0-9]+(?:[.-][A-Za-z0-9]+)*\.[a-z]{2,}$/
          ),
        ],
      ],
      password: [null, [Validators.required]],
    });
  }

  handleSignIn() {
    const body = {
      email: this.signInForm.value['email']?.replace(/\s/g, ''),
      password: this.signInForm.value['password']?.replace(/\s/g, ''),
    };

    if (this.signInForm.valid) {
      this.isLoading = true;
      const errorConditions = ['record', 'incorrect'];

      this.authService.signIn(body).subscribe(
        (res) => {
          if (res.data?.LoginEmail) {
            this.authService.completeSignIn(res.data.LoginEmail);
            this.playerService.getCurrencyData();
          } else if (
            errorConditions.some((item) =>
              res.errors![0].message.includes(item)
            )
          ) {
            console.log(res);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'The email or password is incorrect.',
              confirmButtonText: 'Done',
              confirmButtonColor: '#AC2028',
            });
            this.isLoading = false;
          } else {
            console.log(res);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Something went wrong. Please try again.',
              confirmButtonText: 'Done',
              confirmButtonColor: '#AC2028',
            });
            this.isLoading = false;
          }
        },
        (err) => {
          console.log(err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Something went wrong. Please try again.',
            confirmButtonText: 'Done',
            confirmButtonColor: '#AC2028',
          });
          this.isLoading = false;
        }
      );
    }
    this.signInForm.markAllAsTouched();
  }

  enterDemo() {
    if (this.isLoading || this.isDemoLoading) return;
    this.isDemoLoading = true;
    this.authService
      .enterDemo()
      .then(() => this.playerService.getCurrencyData())
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'The demo is unavailable right now. Please try again later.',
          confirmButtonText: 'Done',
          confirmButtonColor: '#AC2028',
        });
      })
      .finally(() => (this.isDemoLoading = false));
  }

  get email() {
    return this.signInForm.get('email')!;
  }
  get password() {
    return this.signInForm.get('password')!;
  }
}
