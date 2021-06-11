import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PreloaderService {

  constructor() {

  }

  ShowPreloader(){
    let hellopreloader = document.getElementById("hellopreloader_preload");
    this.SetPreloader(hellopreloader, false)
  }

  HidePreloader() {
    let hellopreloader = document.getElementById("hellopreloader_preload");
    this.SetPreloader(hellopreloader, true)
  }

  SetPreloader(el: any, status: boolean){
    if(status){
      el.style.opacity = 1;
      var interhellopreloader = setInterval(function(){
        el.style.opacity = el.style.opacity - 0.05;
        if (el.style.opacity <= 0.05){
          console.log('Hide preloader');
          clearInterval(interhellopreloader);
          el.style.display = "none";
        }},16);
    }
    else {
      var n = 0;
      el.style.opacity = 0;
      el.style.display = "block";
      var interhellopreloader = setInterval(function(){
        //el.style.opacity = window.getComputedStyle(el).opacity + 0.05;

        n += 0.1;
        el.style.opacity = n;
        el.style.filter = 'alpha(opacity=' + 100 * n + ')';

        if (el.style.opacity >= 0.95){
          console.log('Show preloader');
          clearInterval(interhellopreloader);
        }},16);
    }
  }
}
