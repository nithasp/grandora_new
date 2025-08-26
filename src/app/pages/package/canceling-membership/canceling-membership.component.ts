import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-canceling-membership',
  templateUrl: './canceling-membership.component.html',
  styleUrls: ['./canceling-membership.component.scss'],
})
export class CancelingMembershipComponent {
  cancelForm!: FormGroup;

  cancelList = [
    {
      title: 'I am switching to a different Grandora Premium package',
      value: '1',
    },
    { title: 'Financial reasons', value: '2' },
    { title: 'I had a bad interaction with the streamer', value: '3' },
    {
      title:
        "The streamer's schedule changed or theyre not streaming as much anymore",
      value: '4',
    },
    { title: 'I only wanted to subscribe for one month', value: '5' },
    {
      title: "My schedule changed and I can't keep up with the stream anymore",
      value: '6',
    },
    { title: 'I prefer to manually renew my Subscriptions', value: '7' },
    { title: 'Other', value: '8' },
  ];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.cancelFormInit();
  }

  cancelFormInit() {
    this.cancelForm = this.formBuilder.group({
      cancel: [null, Validators.required],
      reason: [null, Validators.required],
    });
  }

  handleSubmit() {
    console.log(this.cancel.value);
  }

  get cancel() {
    return this.cancelForm.get('cancel')!;
  }
}
