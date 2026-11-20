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

import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  isLoading: boolean = false;
  signUpForm!: FormGroup;
  days: any = [];
  months: any = [
    {
      value: '01',
      name: 'January',
    },
    {
      value: '02',
      name: 'February',
    },
    {
      value: '03',
      name: 'March',
    },
    {
      value: '04',
      name: 'April',
    },
    {
      value: '05',
      name: 'May',
    },
    {
      value: '06',
      name: 'June',
    },
    {
      value: '07',
      name: 'July',
    },
    {
      value: '08',
      name: 'August',
    },
    {
      value: '09',
      name: 'September',
    },
    {
      value: '10',
      name: 'October',
    },
    {
      value: '11',
      name: 'November',
    },
    {
      value: '12',
      name: 'January',
    },
  ];
  years: any = [];

  genders: any = [
    {
      value: '0',
      name: 'Male',
    },
    {
      value: '1',
      name: 'Female',
    },
    {
      value: '2',
      name: 'Rather not to say',
    },
  ];

  dateValue: string = '';
  prevMonth: any = '01';

  day!: string;
  month!: string;
  year: any;

  minYears: number = 1900;
  maxYears: number = moment().year();
  age!: number;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signUpFormInit();
    this.dayFilter('01');
    this.getYears();
  }

  signUpFormInit() {
    this.signUpForm = this.formBuilder.group(
      {
        // username: [
        //   null,
        //   [
        //     Validators.required,
        //     Validators.minLength(3),
        //     Validators.maxLength(60),
        //     Validators.pattern(/^(?![0-9]+$)[a-zA-Z0-9]+$/),
        //   ],
        // ],
        email: [
          null,
          [
            Validators.required,
            Validators.pattern(
              /^[A-Za-z0-9]+(?:[.-][A-Za-z0-9]+)*@[A-Za-z0-9]+(?:[.-][A-Za-z0-9]+)*\.[a-z]{2,}$/
            ),
          ],
        ],
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
        gender: [null, Validators.required],
        date_of_birth: [null, Validators.required],
        policy: [false, Validators.requiredTrue],
      },
      {
        validators: [this.passwordMustMatch],
      }
    );
  }

  handleSignUp() {
    const body = {
      email: this.signUpForm.value['email']?.replace(/\s/g, ''),
      password: this.signUpForm.value['password']?.replace(/\s/g, ''),
    };

    if (this.signUpForm.valid) {
      this.isLoading = true;
      this.authService.signUp(body).subscribe(
        (res) => {
          if (res.data?.RegisterEmail) {
            this.authService.signIn(body).subscribe((res) => {
              if (res.data?.LoginEmail) {
                localStorage.setItem('accessToken', res.data?.LoginEmail.token);
                this.authService.userInfo.next(res.data?.LoginEmail);
                this.authService.isLogin.next(true);
                this.router.navigate(['/setting']);
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
            });
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
          console.log(res);
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
        },
        () => {
          this.isLoading = false;
        }
      );
    }
    this.signUpForm.markAllAsTouched();
  }

  handleGenderValue(value: string) {
    this.gender.setValue(value);
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

  get username() {
    return this.signUpForm.get('username')!;
  }
  get email() {
    return this.signUpForm.get('email')!;
  }
  get password() {
    return this.signUpForm.get('password')!;
  }
  get confirm_password() {
    return this.signUpForm.get('confirm_password')!;
  }
  get gender() {
    return this.signUpForm.get('gender')!;
  }
  get date_of_birth() {
    return this.signUpForm.get('date_of_birth')!;
  }
  get policy() {
    return this.signUpForm.get('policy')!;
  }

  dayFilter(month: any) {
    this.days = [];
    let num = 0;

    if (
      month === '01' ||
      month === '03' ||
      month === '05' ||
      month === '07' ||
      month === '08' ||
      month === '10' ||
      month === '12'
    ) {
      num = 31;
    } else if (
      month === '04' ||
      month === '06' ||
      month === '09' ||
      month === '11'
    ) {
      num = 30;
    } else {
      num = 28;
    }

    for (let i = 1; i <= num; i++) {
      this.days.push({
        value: i < 10 ? `0${i}` : `${i}`,
        name: i < 10 ? `0${i}` : `${i}`,
      });
    }
  }

  getYears() {
    for (let i = this.minYears; i <= this.maxYears; i++) {
      this.years.push({
        value: i,
        name: i,
      });
    }
  }

  selectDate(value: string, type: string) {
    let joinedDate;

    if (type === 'day') {
      this.day = value;
    } else if (type === 'month') {
      this.month = value;
    } else {
      this.year = value;
    }

    console.log('prevMonth', this.prevMonth);
    console.log('currentMonth', this.month);

    if (this.prevMonth === this.month) {
      joinedDate = `${this.day}-${this.month}-${this.year}`;
    } else {
      joinedDate = `01-${value}-${this.year}`;
      this.day = '01';
    }

    const dateValue = joinedDate.split('-').reverse().join('');
    const dateFormat = moment(dateValue).format('DD-MM-YYYY');
    this.dateValue = dateFormat;
    this.dayFilter(this.month);

    if (this.day && this.month && this.year) {
      this.date_of_birth.setValue(dateFormat);
      console.log(dateFormat);
    }

    this.age = this.maxYears - parseInt(this.year);
    this.prevMonth = this.month;

    console.log(this.dateValue);
    console.log('age', this.age);
  }
}
