import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CookieService {

  constructor() { }

  getCookie(){
    return Object.values(document.cookie.split(';')
            .map(cookie => cookie
            .split('='))
            .reduce((accumulator, [name, value]) => 
            ({...accumulator, [name.trim()]: decodeURIComponent(value) }), 
        {}))[0]
  }

  removeCookie(name: string){
    document.cookie = name + '=; Max-Age=-1; domain=' + this.getDomen()
  }

  getDomen(){
    var host = window.location.host;
    if(host.match(/\:/) !== null){
        return host.split(':')[0]   
    } else {
        return host;
    }
  }
}
