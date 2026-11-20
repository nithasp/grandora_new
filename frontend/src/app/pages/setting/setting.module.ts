import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingComponent } from './setting.component';
import { SettingRoutingModule } from './setting-routing.module';
import { ProfileSettingComponent } from './profile-setting/profile-setting.component';
import { PasswordAndPrivacyComponent } from './password-and-privacy/password-and-privacy.component';
import { GrandoraSelectModule } from 'src/app/components/grandora-select/grandora-select.module';
import { NotificationComponent } from './notification/notification.component';
import { ChatModule } from 'src/app/components/chat/chat.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SettingComponent,
    ProfileSettingComponent,
    PasswordAndPrivacyComponent,
    NotificationComponent,
  ],
  imports: [
    CommonModule,
    SettingRoutingModule,
    GrandoraSelectModule,
    ChatModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class SettingModule {}
