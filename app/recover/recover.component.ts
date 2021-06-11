import { Component, OnInit } from '@angular/core';
import { RequestService }    from '../shared/request.service';
import { MessagerService}    from '../shared/messager.service'
import { PreloaderService }  from '../shared/preloader.service'
import { environment }       from '../../environments/environment';

import config from '../../assets/config.json';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.css']
})
export class RecoverComponent implements OnInit {

  email: string = '';

  constructor(
    private request: RequestService,
    public messager: MessagerService,
    public preloader: PreloaderService
  ) { }

  apiHost: string = environment.apiHost;

  ngOnInit() {
    this.preloader.HidePreloader()
  }

  sendEmail(){
    if(this.CheckEmail()){
      this.request.fetchData(config.request.restore.send, {email: this.email})
      .then(data => {
        this.messager.ShowMessage('Успех!', data.message, 'success')
      })
      .catch(err => {
        this.messager.ShowMessage('Ошибка', err.error.errors.error[0], 'danger')
      })
    } else {
      this.messager.ShowMessage('Ошибка ввода', 'Email не корректный', 'danger');
    }
  }


  CheckEmail (): boolean {
    const emailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if(this.email.match(emailformat)){
      console.log(true);
      return true;
    } else {
      console.log(false);
      return false;
    }
  }

  toLogin(){
    window.location.href = this.apiHost
  }
}
