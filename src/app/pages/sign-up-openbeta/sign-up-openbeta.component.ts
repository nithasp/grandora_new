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
  selector: 'app-sign-up-openbeta',
  templateUrl: './sign-up-openbeta.component.html',
  styleUrls: ['./sign-up-openbeta.component.scss'],
})
export class SignUpOpenbetaComponent {
  isLoading: boolean = false;
  signUpOpenBetaForm!: FormGroup;
  regions: any = [
    {
      value: '0',
      name: 'Asia',
    },
    {
      value: '1',
      name: ' North America',
    },
    {
      value: '2',
      name: 'South America',
    },
    {
      value: '3',
      name: 'Australia',
    },
    {
      value: '4',
      name: 'Europe',
    },
    {
      value: '5',
      name: 'Africa',
    },
  ];
  gameGenreList: any = [
    {
      id: '1',
      label: 'Action',
      isChecked: false,
    },
    {
      id: '2',
      label: 'Adventure',
      isChecked: false,
    },
    {
      id: '3',
      label: 'Casual',
      isChecked: false,
    },
    {
      id: '4',
      label: 'Simulation',
      isChecked: false,
    },
    {
      id: '5',
      label: 'Strategy',
      isChecked: false,
    },
    {
      id: '6',
      label: 'RPG',
      isChecked: false,
    },
    {
      id: '7',
      label: 'Sports',
      isChecked: false,
    },
    {
      id: '8',
      label: 'Racing',
      isChecked: false,
    },
    {
      id: '9',
      label: 'MMO',
      isChecked: false,
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signUpOpenBetaFormInit();
  }

  signUpOpenBetaFormInit() {
    this.signUpOpenBetaForm = this.formBuilder.group({
      firstname: [null, Validators.required],
      lastname: [null, Validators.required],
      age: [null, [Validators.required, Validators.max(100)]],
      email: [
        null,
        [
          Validators.required,
          Validators.pattern(
            /^[A-Za-z0-9]+(?:[.-][A-Za-z0-9]+)*@[A-Za-z0-9]+(?:[.-][A-Za-z0-9]+)*\.[a-z]{2,}$/
          ),
        ],
      ],
      region: [null, Validators.required],
      most_favorite_game: [null, Validators.required],
      channel: [null],
      genre: [null, Validators.required],
      policy: [false, Validators.requiredTrue],
    });
  }

  handleSubmit() {
    // const body = {
    //   email: this.signUpOpenBetaForm.value['email']?.replace(/\s/g, ''),
    //   password: this.signUpOpenBetaForm.value['password']?.replace(/\s/g, ''),
    // };

    // if (this.signUpOpenBetaForm.valid) {
    //   this.isLoading = true;
    //   this.authService.signUp(body).subscribe(
    //     (res) => {
    //       if (res.data?.RegisterEmail) {
    //         this.authService.signIn(body).subscribe((res) => {
    //           if (res.data?.LoginEmail) {
    //             localStorage.setItem('accessToken', res.data?.LoginEmail.token);
    //             this.authService.userInfo.next(res.data?.LoginEmail);
    //             this.authService.isLogin.next(true);
    //             this.router.navigate(['/setting']);
    //           } else {
    //             console.log(res);
    //             Swal.fire({
    //               icon: 'error',
    //               title: 'Error',
    //               text: 'Something went wrong. Please try again.',
    //               confirmButtonText: 'Done',
    //               confirmButtonColor: '#AC2028',
    //             });
    //             this.isLoading = false;
    //           }
    //         });
    //       } else {
    //         console.log(res);
    //         Swal.fire({
    //           icon: 'error',
    //           title: 'Error',
    //           text: 'Something went wrong. Please try again.',
    //           confirmButtonText: 'Done',
    //           confirmButtonColor: '#AC2028',
    //         });
    //         this.isLoading = false;
    //       }
    //       console.log(res);
    //     },
    //     (err) => {
    //       console.log(err);
    //       Swal.fire({
    //         icon: 'error',
    //         title: 'Error',
    //         text: 'Something went wrong. Please try again.',
    //         confirmButtonText: 'Done',
    //         confirmButtonColor: '#AC2028',
    //       });
    //       this.isLoading = false;
    //     },
    //     () => {
    //       this.isLoading = false;
    //     }
    //   );
    // }
    this.signUpOpenBetaForm.markAllAsTouched();

    console.log(this.signUpOpenBetaForm)
  }

  handleRegionValue(value: string) {
    this.region.setValue(value);

    console.log(value);
  }

  changeSelection(item: any) {
    item.isChecked = !item.isChecked;
    const checkedItem = this.gameGenreList
      .filter((item: any) => item.isChecked)
      .map((item: any) => item.label)
      .join(', ');

    this.genre.setValue(checkedItem);

    console.log(this.genre.value);
  }

  get firstname() {
    return this.signUpOpenBetaForm.get('firstname')!;
  }
  get lastname() {
    return this.signUpOpenBetaForm.get('lastname')!;
  }
  get age() {
    return this.signUpOpenBetaForm.get('age')!;
  }
  get email() {
    return this.signUpOpenBetaForm.get('email')!;
  }
  get region() {
    return this.signUpOpenBetaForm.get('region')!;
  }
  get genre() {
    return this.signUpOpenBetaForm.get('genre')!;
  }
  get most_favorite_game() {
    return this.signUpOpenBetaForm.get('most_favorite_game')!;
  }
  get channel() {
    return this.signUpOpenBetaForm.get('channel')!;
  }
  get policy() {
    return this.signUpOpenBetaForm.get('policy')!;
  }
}
