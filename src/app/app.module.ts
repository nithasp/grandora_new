import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommunityModule } from './components/community/community.module';

import { createApolloFactory } from './graphql.module';
import {
  APOLLO_NAMED_OPTIONS,
  APOLLO_OPTIONS,
  ApolloModule,
  NamedOptions,
} from 'apollo-angular';
import { InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { AppRoutingModule } from './app-routing.module';

// Register swiper library
import { register } from 'swiper/element/bundle';
register();

import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { GrandoraSelectComponent } from './components/grandora-select/grandora-select.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { TermsAndConditionsComponent } from './pages/terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
 
import { NewsComponent } from './pages/news/news.component';
import { CommunityPageComponent } from './pages/community-page/community-page.component';
import { ContactComponent } from './pages/contact/contact.component';

import { AddCoinComponent } from './components/add-coin/add-coin.component';
import { PackageComponent } from './pages/package/package.component';
import { PurchaseMethodComponent } from './components/purchase-method/purchase-method.component';

import {
  NgbPaginationModule,
  NgbAlertModule,
  NgbProgressbarModule,
  NgbDatepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SignUpClosebetaComponent } from './pages/sign-up-closebeta/sign-up-closebeta.component';
import { GrandoraSelectModule } from './components/grandora-select/grandora-select.module';
import { NewsModule } from './pages/news/news.module';
import { InterestModule } from './components/interest/interest.module';
import { LdsRollerComponent } from './components/loading/lds-roller/lds-roller.component';
import { LdsRollerModule } from './components/loading/lds-roller/lds-roller.module';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,

    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    TermsAndConditionsComponent,
    PrivacyPolicyComponent,
    CommunityPageComponent,
    ContactComponent,

    PackageComponent,
    PurchaseMethodComponent,

 
    AddCoinComponent,
    SignUpClosebetaComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ApolloModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CommunityModule,
    GrandoraSelectModule,
    NewsModule,
    InterestModule,

    NgbPaginationModule,
    NgbAlertModule,
    NgbProgressbarModule,
    NgbDatepickerModule,

    MatProgressSpinnerModule,
    LdsRollerModule
  ],
  providers: [
    {
      provide: APOLLO_NAMED_OPTIONS,
      useFactory(httpLink: HttpLink): NamedOptions {
        return {
          default: {
            cache: new InMemoryCache(),
            link: httpLink.create({
              uri: 'http://node52360-grandora-uat.th2.proen.cloud:11509/player-service/graph',
            }),
          },
          grandoraEndPoint: {
            cache: new InMemoryCache(),
            link: httpLink.create({
              uri: 'https://grandora.games/api/v1/graph',
            }),
          },
          packageEndPoint: {
            cache: new InMemoryCache(),
            link: httpLink.create({
              uri: 'http://43.133.96.178:9002',
            }),
          },
        };
      },
      deps: [HttpLink],
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
