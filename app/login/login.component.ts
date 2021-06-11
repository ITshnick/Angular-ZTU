import { Component, OnInit, } from '@angular/core';
import { RequestService }     from '../shared/request.service';
import { MessagerService }    from '../shared/messager.service';
import { PreloaderService }   from '../shared/preloader.service'
import { CheckdataService }   from '../shared/checkdata.service'
import { CookieService }      from 'ngx-cookie-service'
import { environment }        from '../../environments/environment';

import config from '../../assets/config.json'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  email: string = '';
  pass: string = '';
  token: string | unknown;

  constructor(
    private request: RequestService,
    public messager: MessagerService,
    private preloader: PreloaderService,
    private checkdata: CheckdataService,
    private cookieService: CookieService
  ) {}

  apiHost: string = environment.apiHost;

  ngOnInit() {
    this.request.fetchToken()
    .then(() => {
      window.location.href = this.apiHost + "/home"
    })
    .catch(err => {
      console.log(err.error);
    });
    this.preloader.HidePreloader()
  }

  SendData(){
    if (this.checkdata.checkEmail(this.email)) {
      if (this.pass != '') {
        this.SendLogin()
      } else {
        this.messager.ShowMessage('Ошибка ввода', 'Пароль не введен', 'danger')
      }
    } else {
      this.messager.ShowMessage('Ошибка ввода', 'E-mail не коректный', 'danger')
    }
  }

  SendLogin(){
    this.request.fetchData(config.request.login, {email: this.email, password: this.pass})
      .then(data => {
        console.log(data);
        document.cookie = "token=" + data.token + "; max-age=604800";
        let interval = setInterval(() => {
          if (this.cookieService.get('token')) {
            console.log(this.cookieService.get('token'));
            clearInterval(interval);
            this.SendToken();
          }
        }, 100);
      })
      .catch(error => {
        this.messager.ShowMessage('Ошибка!', error.error.errors.error[0], 'danger')
      })
  }

  SendToken(){
    this.request.fetchToken()
      .then(() => {
        window.location.href = this.apiHost + '/home';
        this.messager.HideMessage();
      })
      .catch(err => {
        console.log(err.error);
        this.messager.ShowMessage('Error', err.error.detail, 'danger')
      });
  }

  toRecover(){
    window.location.href = this.apiHost+'/recover'
  }

}
