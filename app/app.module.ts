import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router'
import { CookieService } from 'ngx-cookie-service'
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http'
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { AdminComponent } from './admin/admin.component';
import { FormsModule } from '@angular/forms';
import { RecoverComponent } from './recover/recover.component';
import { ChangeComponent } from './change/change.component';
import { BuyupserviceComponent } from './buyupservice/buyupservice.component';
import { TokenComponent } from './token/token.component';
import { PaymentServiceComponent } from './payment-service/payment-service.component';

const appRoutes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'settings', component: SettingsComponent},
  {path: 'admin', component: AdminComponent},
  {path: 'recover', component: RecoverComponent},
  {path: 'change', component: ChangeComponent},
  {path: 'buyup', component: BuyupserviceComponent},
  {path: 'token', component: TokenComponent},
  {path: 'payment', component: PaymentServiceComponent},
  {path: '**', redirectTo: '/', pathMatch: 'full'},
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SettingsComponent,
    AdminComponent,
    RecoverComponent,
    ChangeComponent,
    BuyupserviceComponent,
    TokenComponent,
    PaymentServiceComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    FormsModule
  ],
  providers: [
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
