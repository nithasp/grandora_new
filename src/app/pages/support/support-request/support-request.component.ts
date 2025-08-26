import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-support-request',
  templateUrl: './support-request.component.html',
  styleUrls: ['./support-request.component.scss'],
})
export class SupportRequestComponent {
  isLoading: boolean = false;
  supportForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.supportFormInit();
  }

  supportFormInit() {
    this.supportForm = this.formBuilder.group({
      username: [null],
      email: [
        null,
        [
          Validators.required,
          Validators.pattern(
            /^[A-Za-z0-9]+(?:[.-][A-Za-z0-9]+)*@[A-Za-z0-9]+(?:[.-][A-Za-z0-9]+)*\.[a-z]{2,}$/
          ),
        ],
      ],
      description: [null,  Validators.required],
    });
  }

  handleSignIn() {
    const body = {
      email: this.supportForm.value['email']?.replace(/\s/g, ''),
      password: this.supportForm.value['password']?.replace(/\s/g, ''),
    };

    if (this.supportForm.valid) {
      this.isLoading = true;
      const errorConditions = ['record', 'incorrect'];

      this.authService.signIn(body).subscribe(
        (res) => {
          if (res.data?.LoginEmail) {
            localStorage.setItem('accessToken', res.data?.LoginEmail.token);
            this.authService.userInfo.next(res.data?.LoginEmail);
            this.authService.isLogin.next(true);
            this.router.navigate(['/setting']);
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
    this.supportForm.markAllAsTouched();
  }

  get username() {
    return this.supportForm.get('username')!;
  }
  get email() {
    return this.supportForm.get('email')!;
  }
  get description() {
    return this.supportForm.get('description')!;
  }
}
