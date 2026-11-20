import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { Profile } from 'src/app/core/models';
import { ImageSlot, ProfileService, apiErrorMessage } from 'src/app/core/services';

const CITIES: Record<string, string[]> = {
  Thailand: ['Bangkok', 'Chiang Mai', 'Phuket', 'Khon Kaen', 'Pattaya', 'Hat Yai'],
  Singapore: ['Singapore'],
  Malaysia: ['Kuala Lumpur', 'Penang', 'Johor Bahru'],
  Vietnam: ['Ho Chi Minh City', 'Hanoi', 'Da Nang'],
  Indonesia: ['Jakarta', 'Bali', 'Surabaya'],
  Philippines: ['Manila', 'Cebu', 'Davao'],
  Japan: ['Tokyo', 'Osaka', 'Kyoto', 'Fukuoka'],
  'South Korea': ['Seoul', 'Busan', 'Incheon'],
  'United States': ['New York', 'Los Angeles', 'San Francisco', 'Seattle'],
  'United Kingdom': ['London', 'Manchester', 'Edinburgh'],
};

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_IMAGE_MB = 5;

@Component({
  selector: 'app-profile-setting',
  templateUrl: './profile-setting.component.html',
  styleUrls: ['./profile-setting.component.scss'],
})
export class ProfileSettingComponent {
  country = Object.keys(CITIES).map((name) => ({ value: name, name }));
  days: any = [];
  months: any = [
    { value: '01', name: 'January' },
    { value: '02', name: 'February' },
    { value: '03', name: 'March' },
    { value: '04', name: 'April' },
    { value: '05', name: 'May' },
    { value: '06', name: 'June' },
    { value: '07', name: 'July' },
    { value: '08', name: 'August' },
    { value: '09', name: 'September' },
    { value: '10', name: 'October' },
    { value: '11', name: 'November' },
    { value: '12', name: 'December' },
  ];
  years: any = [];

  day: string | undefined;
  month: string | undefined;
  year: string | undefined;

  minYears: number = 1900;
  maxYears: number = moment().year();
  age: number | null = null;

  profileForm!: FormGroup;
  profile: Profile | null = null;
  isLoading = true;
  isSaving = false;
  uploading: ImageSlot | null = null;

  readonly defaultCover = '/assets/images/mockup/setting/Screenshot 2022-12-30 at 18.50 1.jpg';

  constructor(
    private formBuilder: FormBuilder,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.profileForm = this.formBuilder.group({
      username: [''],
      firstName: [''],
      lastName: [''],
      country: [''],
      city: [''],
      facebook: [''],
      twitter: [''],
      instagram: [''],
    });
    this.dayFilter('01');
    this.getYears();
    this.loadProfile();
  }

  get cities() {
    const list = CITIES[this.profileForm?.value.country] ?? [];
    return list.map((name) => ({ value: name, name }));
  }

  get monthName(): string | undefined {
    return this.months.find((item: any) => item.value === this.month)?.name;
  }

  loadProfile() {
    this.isLoading = true;
    this.profileService.getProfile().subscribe({
      next: (profile) => this.applyProfile(profile),
      error: (err) => {
        this.isLoading = false;
        this.showError(apiErrorMessage(err, 'Your profile could not be loaded.'));
      },
    });
  }

  private applyProfile(profile: Profile) {
    this.profile = profile;
    this.isLoading = false;
    this.profileForm.reset({
      username: profile.username ?? '',
      firstName: profile.firstName ?? '',
      lastName: profile.lastName ?? '',
      country: profile.country ?? '',
      city: profile.city ?? '',
      facebook: profile.facebook ?? '',
      twitter: profile.twitter ?? '',
      instagram: profile.instagram ?? '',
    });
    const [year, month, day] = (profile.dateOfBirth ?? '').split('-');
    this.year = year || undefined;
    this.month = month || undefined;
    this.day = day || undefined;
    if (this.month) this.dayFilter(this.month);
    this.age = profile.age;
  }

  handleCountry(value: string) {
    this.profileForm.patchValue({ country: value, city: '' });
  }

  handleCity(value: string) {
    this.profileForm.patchValue({ city: value });
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
      num = 29;
    }

    for (let i = 1; i <= num; i++) {
      this.days.push({
        value: i < 10 ? `0${i}` : `${i}`,
        name: i < 10 ? `0${i}` : `${i}`,
      });
    }
  }

  getYears() {
    for (let i = this.maxYears; i >= this.minYears; i--) {
      this.years.push({
        value: `${i}`,
        name: `${i}`,
      });
    }
  }

  selectDate(value: string, type: string) {
    if (type === 'day') this.day = value;
    else if (type === 'month') {
      this.month = value;
      this.dayFilter(value);
      if (this.day && Number(this.day) > this.days.length) this.day = undefined;
    } else this.year = value;

    const birthday = this.dateOfBirth;
    this.age = birthday ? moment().diff(moment(birthday, 'YYYY-MM-DD'), 'years') : null;
  }

  get dateOfBirth(): string | null {
    if (!this.day || !this.month || !this.year) return null;
    const date = moment(`${this.year}-${this.month}-${this.day}`, 'YYYY-MM-DD', true);
    return date.isValid() ? date.format('YYYY-MM-DD') : null;
  }

  handleSave() {
    if (this.isSaving) return;
    this.isSaving = true;
    const value = this.profileForm.value;
    this.profileService
      .updateProfile({
        username: value.username,
        firstName: value.firstName,
        lastName: value.lastName,
        country: value.country,
        city: value.city,
        facebook: value.facebook,
        twitter: value.twitter,
        instagram: value.instagram,
        ...(this.dateOfBirth ? { dateOfBirth: this.dateOfBirth } : {}),
      })
      .subscribe({
        next: (profile) => {
          this.isSaving = false;
          this.applyProfile(profile);
          Swal.fire({
            icon: 'success',
            title: 'Saved',
            text: 'Your profile has been updated.',
            confirmButtonText: 'Done',
            confirmButtonColor: '#5460cb',
          });
        },
        error: (err) => {
          this.isSaving = false;
          this.showError(apiErrorMessage(err));
        },
      });
  }

  handleCancel() {
    if (this.profile) this.applyProfile(this.profile);
  }

  handleImage(slot: ImageSlot, event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    if (!IMAGE_TYPES.includes(file.type)) {
      this.showError('Please choose a JPEG, PNG, WebP or GIF image.');
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      this.showError(`Please choose an image smaller than ${MAX_IMAGE_MB} MB.`);
      return;
    }

    this.uploading = slot;
    this.profileService.uploadImage(slot, file).subscribe({
      next: (profile) => {
        this.uploading = null;
        this.profile = profile;
      },
      error: (err) => {
        this.uploading = null;
        this.showError(apiErrorMessage(err, 'The image could not be uploaded.'));
      },
    });
  }

  removeImage(slot: ImageSlot) {
    this.uploading = slot;
    this.profileService.removeImage(slot).subscribe({
      next: (profile) => {
        this.uploading = null;
        this.profile = profile;
      },
      error: (err) => {
        this.uploading = null;
        this.showError(apiErrorMessage(err, 'The image could not be removed.'));
      },
    });
  }

  private showError(text: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text,
      confirmButtonText: 'Done',
      confirmButtonColor: '#AC2028',
    });
  }
}
