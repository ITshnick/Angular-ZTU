import { Component, OnInit } from '@angular/core';
import {RequestService}      from "../shared/request.service";
import {PreloaderService}    from "../shared/preloader.service";
import {RedirectService}     from "../shared/redirect.service";
import { CookieService }     from '../shared/cookie.service';
import config from "../../assets/config.json";
import { environment }       from '../../environments/environment';

@Component({
  selector: 'app-payment-service',
  templateUrl: './payment-service.component.html',
  styleUrls: ['./payment-service.component.css']
})
export class PaymentServiceComponent implements OnInit {

  constructor(
    private request:   RequestService,
    private preloader: PreloaderService,
    private redirect:  RedirectService,
    private cookie: CookieService,
  ) { }

  apiHost: string = environment.apiHost;

  public currentUser = {
    userName: '',
    email: ''
  };

  ngOnInit(): void {
    this.request.getCurrentUser()
      .then(data => {
        this.currentUser.userName = data.username;
        this.currentUser.email = data.email;
        this.preloader.HidePreloader()
      })
      .catch(() => {
        this.redirect.setReplace(this.apiHost, config.routes.login)
      });
  }

  LogOut(){
    this.cookie.removeCookie('token');
    window.location.replace(this.apiHost)
  }

  toSettings(){
    window.location.href = this.apiHost + config.routes.settings;
  }

  GetWebmoney(){
    // SetRequest
  }

  GetBitcoin_1(){
    // SetRequest
  }

  GetBitcoin_2(){
    // SetRequest
  }

}
