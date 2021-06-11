import { Component, OnInit } from '@angular/core';
import { RequestService }    from '../shared/request.service';
import { CookieService }     from '../shared/cookie.service';
import { PreloaderService }  from '../shared/preloader.service'
import { environment }       from '../../environments/environment';

import config from '../../assets/config.json';

interface User {
  userName: string
  email: string
  role: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  public currentUser: User = {
    userName: '',
    email: '',
    role: ''
  };

  constructor(
    private request: RequestService,
    private cookie: CookieService,
    private preloader: PreloaderService
  ) { }

  apiHost: string = environment.apiHost;

  ngOnInit() {
    this.request.getCurrentUser()
      .then(data => {
        console.log(data);
        this.currentUser.userName = data.username;
        this.currentUser.email = data.email;
        this.currentUser.role = data.role;

        this.preloader.HidePreloader()
      })
      .catch(() => {
        window.location.replace(this.apiHost)
      });

  }

  LogOut(){
    this.cookie.removeCookie('token');
    window.location.replace(this.apiHost)
  }

  toSettings(){
    window.location.href = this.apiHost + config.routes.settings;
  }

  toAdmin(){
    window.location.href = this.apiHost + config.routes.admin;
  }

  toBuyup(){
    window.location.href = this.apiHost + config.routes.buyup;
  }

  toToken(){
    window.location.href = this.apiHost + config.routes.token;
  }

  toPayment(){
    window.location.href = this.apiHost + config.routes.payment;
  }
}
