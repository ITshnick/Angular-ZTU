import { Component, OnInit } from '@angular/core';
import {RequestService}      from "../shared/request.service";
import {RedirectService}     from "../shared/redirect.service";
import {PreloaderService}    from "../shared/preloader.service";
import {CookieService}       from "../shared/cookie.service";
import {MessagerService}     from "../shared/messager.service";
import { environment }       from '../../environments/environment';

import config from "../../assets/config.json";

interface Salary {
  id:   string
  name: string
}

@Component({
  selector: 'app-buyupservice',
  templateUrl: './buyupservice.component.html',
  styleUrls: ['./buyupservice.component.css']
})
export class BuyupserviceComponent implements OnInit {

  constructor(
    private request:   RequestService,
    private redirect:  RedirectService,
    private preloader: PreloaderService,
    private cookie:    CookieService,
    public  messager:  MessagerService,
  ) { }

  apiHost: string = environment.apiHost;

  public currentUser = {
    userName: '',
    email: ''
  };

  selectedSalaryLocalId: string = '';
  selectedSalaryXeroId: string = '';
  search_xero: string = '';
  search_local: string = '';

  public salary_xero:         Salary[] = [];
  public salary_local:        Salary[] = [];
  public search_salary_xero:  Salary[] = [];
  public search_salary_local: Salary[] = [];

  ngOnInit() {
    this.request.getCurrentUser()
      .then(data => {
        this.currentUser.userName = data.username;
        this.currentUser.email = data.email;
        this.getAllSalary();
        let interval = setInterval(() => {
          console.log(this.salary_local.length);
          if (this.salary_local.length != null || this.salary_local.length != undefined) {
            this.preloader.HidePreloader();
            clearInterval(interval)
          }
        }, 100)
      })
      .catch(() => {
        this.redirect.setReplace(this.apiHost, config.routes.login)
      });
  }


  LogOut(){
    this.cookie.removeCookie('token');
    this.redirect.setReplace(this.apiHost, config.routes.login)
  }

  toSettings(){
    this.redirect.setLocation(this.apiHost, config.routes.settings)
  }

  // toHome(){
  //   this.redirect.setLocation(this.apiHost, config.routes.main)
  // }



  getAllSalary(){
    this.request.getAllSalary(config.request.byuService).subscribe(
      data => {
        console.log(data);
        this.salary_xero = data.xero;
        this.salary_local = data.local;
    }, error => {
        this.messager.ShowMessage('Ошибка', error.error.detail, 'danger');
    })
  }

  createSalaryContact(){
    let body = this.salary_xero.filter(t=>t.id == this.selectedSalaryXeroId)[0];
    this.request.createSalaryContact(config.request.byuService, body).subscribe(
      data => {
        console.log(data);
        this.messager.ShowMessage('Отлично!', 'Токены успешно сохранены', 'success');
        this.addSalaryItem()
    },
      error => {
        console.log(error);
        this.messager.ShowMessage('Ошибка', error.error.detail, 'danger');
      });
  }

  deleteSalaryContact(){
    if(this.selectedSalaryLocalId)
      this.request.deleteSalaryContact(config.request.byuService, this.selectedSalaryLocalId).subscribe(
        data => {
          console.log(data);
          this.removeSalaryItem()
      },
        error => {
          this.messager.ShowMessage('Ошибка', error.error.detail, 'danger');
        })
  }

  // Перенос элемента масива из левого блока в правый
  addSalaryItem(){
    let item = this.salary_xero.filter(t=>t.id == this.selectedSalaryXeroId)[0];
    this.salary_xero = this.salary_xero.filter(t=>t.id !== this.selectedSalaryXeroId);
    this.salary_local.push(item)
  }

  // Перенос эемента масива из правого блока в левый
  removeSalaryItem(){
    let item = this.salary_local.filter(t => t.id == this.selectedSalaryLocalId)[0];
    this.salary_local = this.salary_local.filter(t => t.id !== this.selectedSalaryLocalId);
    this.salary_xero.push(item);
  }

  // Выбрать элемент из левого блока
  selectSalaryXero(event: any){
    this.selectedSalaryXeroId = event.target.value;
    if(event.target.value) {
      this.RightButton(false);
      this.LeftButton(true);
    }
  }

  // Вибрать элемент из правого блока
  selectSalaryLocal(event: any){
    this.selectedSalaryLocalId = event.target.value;
    if(event.target.value) {
      this.RightButton(true);
      this.LeftButton(false);
    }
  }

  // Отключения кнопок для переноса инстантов
  RightButton(status: boolean){
    let element = document.getElementById("toRight");
    BuyupserviceComponent.SetStatusButton(element, status)
  }

  LeftButton(status: boolean){
    let element = document.getElementById("toLeft");
    BuyupserviceComponent.SetStatusButton(element, status)
  }

  private static SetStatusButton(element: any, status: boolean){
    if (status) {
      element.setAttribute("disabled", "disabled");
    } else {
      element.removeAttribute("disabled")
    }
  }

  // *** Поиск ***
  //

  searchLeft(){
    console.log("searchLeft");
    if(this.search_xero){
      console.log(true);
      let regex = new RegExp('/'+this.search_xero+'\\b', 'g')

    }
    else{
      console.log(false);

    }
  }

  searchRight(){
    console.log("searchRight");
    if(this.search_local){
      console.log(true);

    }
    else{
      console.log(false);

    }
  }

}
