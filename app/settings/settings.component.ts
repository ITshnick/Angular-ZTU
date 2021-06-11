import { Component, OnInit } from '@angular/core';
import { RequestService }    from '../shared/request.service';
import { PreloaderService }  from '../shared/preloader.service';
import { CookieService }     from '../shared/cookie.service';
import { MessagerService }   from '../shared/messager.service'
import { environment }       from '../../environments/environment';

import config from '../../assets/config.json';

interface User {
  userName: string
  email: string
  telegram_id: string
  firstPass: string
  secondPass: string
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  public currentUser: User = {
    userName: '',
    email: '',
    telegram_id: '',
    firstPass: '',
    secondPass: ''
  };

  name: string = '';

  constructor(
    private request: RequestService,
    private preloader: PreloaderService,
    private cookie: CookieService,
    public messager: MessagerService,
  ) { }

  apiHost: string = environment.apiHost;

  ngOnInit() {
    this.request.getCurrentUser()
      .then(data => {
        this.currentUser.userName = data.username;
        this.currentUser.email = data.email;
        this.currentUser.telegram_id = data.telegram_id;

        this.preloader.HidePreloader()
      })
      .catch(() => {
        window.location.replace(this.apiHost)
      });
  }

  SendPatch(){
    var data = this.Constructor();
    if(data){
      this.request.fetchPatch(data)
      .then((data) => {
        this.currentUser.userName = data.data.username;
        this.messager.ShowMessage('Отлично!', data.message, 'success');
        console.log(data);
        if(data.detail){
          window.location.replace(this.apiHost)
        }
      })
    }
  }


  LogOut(){
    this.cookie.removeCookie('token');
    window.location.replace(this.apiHost)
  }

  Constructor() {
    var username = this.name;
    var password = this.currentUser.secondPass;
    var telegramId = this.currentUser.telegram_id;

    if(this.CheckTelegramId() && this.CheckPassword()){
      if(password && username && telegramId){
        return {
          password: password,
          username: username,
          telegram_id: telegramId
        }
      } else if(username && telegramId){
        return {
          username: username,
          telegram_id: telegramId
        }
      } else if (password && telegramId){
        return {
          password: password,
          telegram_id: telegramId
        }
      } else if(password && username) {
        return {
          password: password,
          username: username
        }
      } else if (username) {
        return {
          username: username
        }
      } else if (password) {
        return {
          password: password
        }
      } else if(telegramId) {
        return {
          telegram_id: telegramId
        }
      } else {
        this.messager.ShowMessage('Ошибка!', 'Нет данных для изменений', 'danger');
        return false
      }
    }
    return false
  }

  CheckPassword(): boolean {
    if((!this.currentUser.firstPass) && (!this.currentUser.secondPass)){
      return true;
    }
    if(this.currentUser.firstPass === this.currentUser.secondPass){
      if(this.currentUser.secondPass.match(/^\S+$/) !== null){
          if((8 <= this.currentUser.secondPass.length) && (this.currentUser.secondPass.length <= 20)){
              return true;
          } else {
            this.messager.ShowMessage("Ошибька ввода", "Пароль должен иметь от 8 до 20 символов", 'danger');
              return false;
          }
      } else {
          if((this.currentUser.firstPass != "") && (this.currentUser.secondPass != "")){
            this.messager.ShowMessage("Ошибка ввода", "Пароль не должен содержать пробелов", 'danger');
              return false;
          }
      }
    } else {
      this.messager.ShowMessage("Ошибька ввода", "Пароли не совпадают", 'danger');
      return false;
    }
    return false;
  }

  CheckTelegramId(){
    if((this.currentUser.telegram_id.match(/^[0-9]*$/) !== null) || (this.currentUser.telegram_id == "")){
      return true;
    } else {
      this.messager.ShowMessage('Ошибка', 'Telegram ID не должен содержать буквы иле другие символы', 'danger');
      return false
    }
  }
}
