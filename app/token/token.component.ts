import { Component, OnInit } from '@angular/core';
import { PreloaderService }  from '../shared/preloader.service'
import { CookieService }     from '../shared/cookie.service';
import { RequestService }    from '../shared/request.service';
import {MessagerService}     from "../shared/messager.service";
import { environment }       from '../../environments/environment';

import config from '../../assets/config.json';

interface User {
  userName: string
  email: string
  role: string
}

interface Xero {
  name: string,
  value: string
}

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css']
})
export class TokenComponent implements OnInit {
  redirect: any;

  constructor(
    private request: RequestService,
    private cookie: CookieService,
    private preloader: PreloaderService,
    public messager: MessagerService,
  ) { }

  apiHost: string = environment.apiHost;

  public currentUser: User = {
    userName: '',
    email: '',
    role: ''
  };

  public XERO_ACCESS_TOKEN = '';
  public XERO_REFRESH_TOKEN = '';
  public XERO_CLIENT_SECRET = '';
  public XERO_CLIENT_ID = '';

  public xero: Xero[] = [];

  ngOnInit(): void {
    this.request.getCurrentUser().then(data => {
      if (data) {
        this.currentUser.userName = data.username;
        this.currentUser.email = data.email;
        this.currentUser.role = data.role;
        this.request.getXero().subscribe(
          data => {
            this.xero = data;
            this.RenderXero();
            this.preloader.HidePreloader();
          },
          () => {
            window.location.replace(this.apiHost);
          })
      }
    })
    .catch(() => {
      window.location.replace(this.apiHost);
    });
  }

  RenderXero(){
    if (this.xero != undefined) {
      this.XERO_ACCESS_TOKEN = this.xero.filter(item => item.name == 'XERO_ACCESS_TOKEN')[0].value;
      this.XERO_REFRESH_TOKEN = this.xero.filter(item => item.name == 'XERO_REFRESH_TOKEN')[0].value;
      this.XERO_CLIENT_SECRET = this.xero.filter(item => item.name == 'XERO_CLIENT_SECRET')[0].value;
      this.XERO_CLIENT_ID = this.xero.filter(item => item.name == 'XERO_CLIENT_ID')[0].value;
    }
  }

  PatchXero(){
    console.log(this.xero);
    if(this.xero != undefined){

      this.xero.filter(item => item.name == 'XERO_ACCESS_TOKEN')[0].value = this.XERO_ACCESS_TOKEN;
      this.xero.filter(item => item.name == 'XERO_REFRESH_TOKEN')[0].value = this.XERO_REFRESH_TOKEN;
      this.xero.filter(item => item.name == 'XERO_CLIENT_SECRET')[0].value = this.XERO_CLIENT_SECRET;
      this.xero.filter(item => item.name == 'XERO_CLIENT_ID')[0].value = this.XERO_CLIENT_ID;

      this.request.patchXero(this.xero).subscribe(
        data => {
          console.log(data);
          this.messager.ShowMessage('Отлично!', 'Токены успешно сохранены', 'success');
          setTimeout(() => {
            this.messager.HideMessage()
          },10000);
        },
        error => {
        console.log(error);
          this.messager.ShowMessage('Ошибка!', error.error.detail, 'danger');
          setTimeout(() => {
            this.messager.HideMessage()
          }, 10000);
      });
    }
  }

  LogOut(){
    this.cookie.removeCookie('token');
    window.location.replace(this.apiHost)
  }

  toSettings(){
    window.location.href = this.apiHost + config.routes.settings;
  }

  // toHome(){
  //   window.location.href = this.apiHost + config.routes.main;
  // }

}
