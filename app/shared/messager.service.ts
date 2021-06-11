import { Injectable } from '@angular/core';

export interface MessageConstructor {
  status: string
  title: string
  text: string
  type: string
}

@Injectable({providedIn: 'root'})

export class MessagerService {

  public message: MessageConstructor = {
    status: 'd-none',
    title: '',
    text: '',
    type: 'danger',
  };

  constructor() { }

  ShowMessage(title: string, text: string, type: string, id?: string){
    if(id){

    }
    if (type == 'success') {
      this.message.type = 'alert-success'
    } else if (type == 'danger') {
      this.message.type = 'alert-danger'
    }
    this.message.status = 'show';
    this.message.title = title;
    this.message.text = text;
  }

  HideMessage(){
    this.message.status = 'd-none'
  }

}
