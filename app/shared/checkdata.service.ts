import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckdataService {

  constructor() { }

  checkEmail (email: string): boolean {
    const emailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if(email.match(emailformat)){
      console.log(true);
      return true;
    } else {
      console.log(false);
      return false;
    }
  }

  checkIpAddress(ip_address: string){
    return (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip_address))
  }

}
