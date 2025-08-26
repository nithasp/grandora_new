import { Component } from '@angular/core';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss']
})
export class DescriptionComponent {
  description = ''

  comments: any = [
    {
      username: "Username",
      date: "2 days ago",
      comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed id tincidunt risus. Aliquam gravida dapibus odio at venenatis. Proin malesuada, elit eget placerat laoreet, ex sem pretium ante, eu sodales metus lacus et tortor."
    },
    {
      username: "Username",
      date: "2 days ago",
      comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed id tincidunt risus. Aliquam gravida dapibus odio at venenatis. Proin malesuada, elit eget placerat laoreet, ex sem pretium ante, eu sodales metus lacus et tortor."
    },
    {
      username: "Username",
      date: "5 days ago",
      comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed id tincidunt risus. Aliquam gravida dapibus odio at venenatis. Proin malesuada, elit eget placerat laoreet, ex sem pretium ante, eu sodales metus lacus et tortor."
    },
    {
      username: "Username",
      date: "7 weeks ago",
      comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed id tincidunt risus. Aliquam gravida dapibus odio at venenatis. Proin malesuada, elit eget placerat laoreet, ex sem pretium ante, eu sodales metus lacus et tortor."
    }
  ]
}
