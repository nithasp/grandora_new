import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-up-closebeta',
  templateUrl: './sign-up-closebeta.component.html',
  styleUrls: ['./sign-up-closebeta.component.scss'],
})
export class SignUpClosebetaComponent {
  isLoading: boolean = false;
  signUpCloseBetaForm!: FormGroup;
  regions: any = [
    {
      value: 'Asia',
      name: 'Asia',
    },
    {
      value: 'North America',
      name: 'North America',
    },
    {
      value: 'South America',
      name: 'South America',
    },
    {
      value: 'Australia',
      name: 'Australia',
    },
    {
      value: 'Europe',
      name: 'Europe',
    },
    {
      value: 'Africa',
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

  lang: any = [
    {
      value: '0',
      name: 'EN',
    },
    {
      value: '1',
      name: 'TH',
    },
  ];

  selectRegionTimeout: any;
  isSelectRegionDisplay: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signUpCloseBetaFormInit();
  }

  signUpCloseBetaFormInit() {
    this.signUpCloseBetaForm = this.formBuilder.group({
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
    const body = {
      first_name: this.signUpCloseBetaForm.value['firstname']?.replace(
        /\s/g,
        ''
      ),
      last_name: this.signUpCloseBetaForm.value['lastname']?.replace(/\s/g, ''),
      age: this.signUpCloseBetaForm.value['age'],
      email: this.signUpCloseBetaForm.value['email']?.replace(/\s/g, ''),
      region: this.signUpCloseBetaForm.value['region']?.replace(/\s/g, ''),
      favorite_game: this.signUpCloseBetaForm.value[
        'most_favorite_game'
      ]?.replace(/\s/g, ''),
      channel_name: this.signUpCloseBetaForm.value['channel']?.replace(
        /\s/g,
        ''
      ),
      favorite_game_genre: this.signUpCloseBetaForm.value['genre'],
      event_name: 'creator_cbt',
    };

    if (this.signUpCloseBetaForm.valid) {
      this.isLoading = true;
      this.authService.signUpCloseBeta(body).subscribe(
        (res) => {
          console.log(res);
          if (res.data?.Register.success) {
            Swal.fire({
              title: '<h1 class="title success">SUCCESS</h1>',
              iconHtml: '<img src="/assets/images/icon/success-icon.png" />',
              confirmButtonText: `
              <span class="success">Confirm</span>
            `,
            }).then((result) => {
              if (result.isConfirmed) {
                this.resetForm();
              }
            });
          } else {
            Swal.fire({
              title: '<h1 class="title error">ERROR!</h1>',
              iconHtml: '<img src="/assets/images/icon/error-icon.png" />',
              html: `
              <div class="content">
              <p>Something went wrong, Please try again</p>
            </div>
              `,
              confirmButtonText: `
                <span class="error">Close</span>
              `,
            });
          }

          this.isLoading = false;
        },
        (err) => {
          console.log(err);
          Swal.fire({
            title: '<h1 class="title error">ERROR!</h1>',
            iconHtml: '<img src="/assets/images/icon/error-icon.png" />',
            html: `
            <div class="content">
            <p>Something went wrong, Please try again</p>
          </div>
            `,
            confirmButtonText: `
              <span class="error">Close</span>
            `,
          });
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
        }
      );
    }

    this.signUpCloseBetaForm.markAllAsTouched();

    console.log(this.signUpCloseBetaForm);
    console.log(body);
  }

  // handleSubmit2() {
  //   Swal.fire({
  //     title: '<h1 class="title success">SUCCESS</h1>',
  //     iconHtml: '<img src="/assets/images/icon/success-icon.png" />',
  //     confirmButtonText: `
  //       <span class="success">Confirm</span>
  //     `,
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       console.log('Saved!', '', 'success');
  //     }
  //   });

  //   // Swal.fire({
  //   //   title: '<h1 class="title error">ERROR!</h1>',
  //   //   iconHtml: '<img src="/assets/images/icon/error-icon.png" />',
  //   //   html: `
  //   //   <div class="content">
  //   //   <p>Something went wrong, Please try again</p>
  //   // </div>
  //   //   `,
  //   //   confirmButtonText: `
  //   //     <span class="error">Try Again</span>
  //   //   `,
  //   // }).then((result) => {
  //   //   if (result.isConfirmed) {
  //   //     console.log('Saved!', '', 'success');
  //   //   }
  //   // });
  // }

  // handleSubmit3() {
  //   this.signUpCloseBetaForm.markAllAsTouched();

  //   // const body = {
  //   //   favorite_game: 'favorite_game1',
  //   //   last_name: 'last_name1',
  //   //   favorite_game_genre: '[test1,test2]',
  //   //   first_name: 'test',
  //   //   region: 'test',
  //   //   channel_name: 'test',
  //   //   event_name: 'kol_cbt',
  //   //   age: 20,
  //   //   email: 'test@hotmail.com',
  //   // };

  //   const body = {
  //     first_name: this.signUpCloseBetaForm.value['firstname']?.replace(
  //       /\s/g,
  //       ''
  //     ),
  //     last_name: this.signUpCloseBetaForm.value['lastname']?.replace(/\s/g, ''),
  //     age: this.signUpCloseBetaForm.value['age'],
  //     email: this.signUpCloseBetaForm.value['email']?.replace(/\s/g, ''),
  //     region: this.signUpCloseBetaForm.value['region']?.replace(/\s/g, ''),
  //     favorite_game: this.signUpCloseBetaForm.value[
  //       'most_favorite_game'
  //     ]?.replace(/\s/g, ''),
  //     channel_name: this.signUpCloseBetaForm.value['channel']?.replace(
  //       /\s/g,
  //       ''
  //     ),
  //     favorite_game_genre: this.signUpCloseBetaForm.value['genre'],
  //     event_name: 'creator_cbt',
  //   };

  //   console.log(body);

  //   this.authService.signUpCloseBeta(body).subscribe((value) => {
  //     console.log(value);
  //   });
  // }

  resetForm() {
    this.signUpCloseBetaForm.reset();
    this.gameGenreList = this.gameGenreList.map((item: any) => {
      return {
        ...item,
        isChecked: false,
      };
    });

    // Rerender and Reset Select Region
    this.isSelectRegionDisplay = false;
    clearTimeout(this.selectRegionTimeout);
    this.selectRegionTimeout = setTimeout(() => {
      this.isSelectRegionDisplay = true;
    }, 1);
  }

  handleRegionValue(value: string) {
    this.region.setValue(value);
  }

  changeSelection(item: any) {
    item.isChecked = !item.isChecked;
    const checkedItem = this.gameGenreList
      .filter((item: any) => item.isChecked)
      .map((item: any) => item.label);

    this.genre.setValue(checkedItem);

    console.log(this.genre.value);
  }

  get firstname() {
    return this.signUpCloseBetaForm.get('firstname')!;
  }
  get lastname() {
    return this.signUpCloseBetaForm.get('lastname')!;
  }
  get age() {
    return this.signUpCloseBetaForm.get('age')!;
  }
  get email() {
    return this.signUpCloseBetaForm.get('email')!;
  }
  get region() {
    return this.signUpCloseBetaForm.get('region')!;
  }
  get genre() {
    return this.signUpCloseBetaForm.get('genre')!;
  }
  get most_favorite_game() {
    return this.signUpCloseBetaForm.get('most_favorite_game')!;
  }
  get channel() {
    return this.signUpCloseBetaForm.get('channel')!;
  }
  get policy() {
    return this.signUpCloseBetaForm.get('policy')!;
  }
}
