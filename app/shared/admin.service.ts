import { Injectable } from '@angular/core';
import { RequestService }    from './request.service';
import { CheckdataService } from "./checkdata.service";
import {MessagerService} from "./messager.service";
import {PreloaderService} from "./preloader.service";
import {RedirectService} from "./redirect.service";

import config from "../../assets/config.json";

@Injectable({
  providedIn: 'root'
})

export class AdminService {

  constructor(
    private preloader: PreloaderService,
    private redirect:  RedirectService,
    private request: RequestService,
    private checkdata: CheckdataService,
    private messager: MessagerService,
  ) { }


  SplitIpAddress(address:string){
    let addressArray = address.replace(/\s+/g, '').split(',');
    let addresses = [];
    for(let i = 0; i < addressArray.length; i++){
      if(!this.checkdata.checkIpAddress(addressArray[i])){
        this.messager.ShowMessage('Ошибка ввода', 'IP-адрес введён неправельно', 'danger');
        return false
      } else {
        addresses.push({ address: addressArray[i] })
      }
    }
    this.messager.HideMessage();
    console.log(addresses[0].address);
    return addresses
  }



}
