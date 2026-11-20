import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingComponent } from './setting.component';
import { ProfileSettingComponent } from './profile-setting/profile-setting.component';
import { PasswordAndPrivacyComponent } from './password-and-privacy/password-and-privacy.component';
import { NotificationComponent } from './notification/notification.component';

const routes: Routes = [
  {
    path: '',
    component: SettingComponent,
    children: [
      {
        path: '',
        redirectTo: "profile-setting",
        pathMatch: 'full'
      },
      {
        path: 'profile-setting',
        component: ProfileSettingComponent,
      },
      {
        path: 'password-and-privacy',
        component: PasswordAndPrivacyComponent,
      },
      {
        path: 'notification',
        component: NotificationComponent,
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingRoutingModule {}
