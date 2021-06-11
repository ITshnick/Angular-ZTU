import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { PreloaderService }                       from '../shared/preloader.service'
import { RequestService }                         from '../shared/request.service'
import { MessagerService }                        from '../shared/messager.service'
import { environment }                            from '../../environments/environment';

import config from '../../assets/config.json'

@Component({
  selector: 'app-change',
  templateUrl: './change.component.html',
  styleUrls: ['./change.component.css']
})
export class ChangeComponent implements OnInit {

  firstPass: string = '';
  secondPass: string = '';

  isError: boolean = false;
  timer: number = 5;


  @Output() onToggle: EventEmitter<any> = new EventEmitter();

  constructor(
    private preloader: PreloaderService,
    private request: RequestService,
    public messager: MessagerService
  ) { }

  apiHost: string = environment.apiHost;

  ngOnInit() {
    var myHash = this.GetUrlParam('hash');
    console.log(myHash);
    this.request.fetchData(config.request.restore.verify, {hash: myHash})
    .then(data => {
      document.cookie = "token=" + data.token + "; max-age=604800";
      console.log(data.token);
      this.preloader.HidePreloader()
    })
    .catch(err => {
      this.isError = true;
      this.messager.ShowMessage('Ошибка!', err.error.errors.error[0], 'danger');

      setInterval(() => {
        this.timer = this.timer - 1;
      }, 1000);
      setTimeout(() => {window.location.replace(this.apiHost)}, 5000)
    })
  }

  SendNewPass(){
    if(this.CheckPassword()){
      this.request.fetchNewPass({password: this.secondPass})
      .then(() => window.location.replace(this.apiHost+'/home'))
    }
  }

  CheckPassword(): boolean{
    if(this.firstPass === this.secondPass){
      if(this.secondPass.match(/^\S+$/) !== null){
          if((8 <= this.secondPass.length) && (this.secondPass.length <= 20)){
              return true;
          } else {
            this.messager.ShowMessage("Ошибька ввода", "Пароль должен иметь от 8 до 20 символов", 'danger');
              return false;
          }
      } else {
          if((this.firstPass != "") && (this.secondPass != "")){
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


  GetUrlParam(variable: string){
    const query = window.location.search.substring(1);
    let pair = query.split('=');
    if(pair[0] === variable){return pair[1]}
    return false;
  }

}
