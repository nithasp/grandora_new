import { Component } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-profile-setting',
  templateUrl: './profile-setting.component.html',
  styleUrls: ['./profile-setting.component.scss'],
})
export class ProfileSettingComponent {
  country = [
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
  ];
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

  dateValue: string = '';
  prevMonth: any = '01';

  day!: string;
  month!: string;
  year: any;

  minYears: number = 1900;
  maxYears: number = moment().year();
  age!: number;

  ngOnInit(): void {
    this.dayFilter('01');
    this.getYears();
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

    this.age = this.maxYears - parseInt(this.year);
    this.prevMonth = this.month;

    console.log(this.dateValue);
    console.log('age', this.age);
  }
}
