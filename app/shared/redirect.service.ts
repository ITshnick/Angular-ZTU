import { Injectable } from '@angular/core';
import { PreloaderService } from './preloader.service'

@Injectable({providedIn: 'root'})

export class RedirectService {

  constructor(
    private preloader: PreloaderService
  ) { }

  setLocation(domen: string, href: string){
    this.preloader.ShowPreloader();
    window.location.href = domen+href;
  }

  setReplace(domen: string, href: string){
    this.preloader.ShowPreloader();
    window.location.replace(domen+href)
  }

}
