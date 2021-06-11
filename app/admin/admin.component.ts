import { Component, OnInit } from '@angular/core';
import { PreloaderService }  from '../shared/preloader.service';
import { RequestService }    from '../shared/request.service';
import { CookieService }     from '../shared/cookie.service';
import { RedirectService }   from '../shared/redirect.service';
import { CheckdataService }  from '../shared/checkdata.service';
import { MessagerService }   from '../shared/messager.service';
import { AdminService }      from "../shared/admin.service";
import { environment }       from '../../environments/environment';

import config from '../../assets/config.json';


interface CurrentUser {
  userName: string
  email:    string
}

interface Users {
  id:           number,
  email:        string,
  username:     string,
  role:         string,
  name_in_xero: string,
  ip_address: [
    {
      address:  string
    }
  ]
  addresses:    string
}

interface selectedUser {
  email:        string,
  username:     string,
  role:         string,
  name_in_xero: string,
  ip_address: [
    {
      address:  string
    }
  ]
}

interface Schemes {
  id:             number
  account_number: number
  name:           string
}

interface Salary {
  id:   string
  name: string
}

interface Time {
  name: string
  value: string
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {

  constructor(
    private preloader: PreloaderService,
    private cookie:    CookieService,
    private request:   RequestService,
    private redirect:  RedirectService,
    private checkdata: CheckdataService,
    public  messager:  MessagerService,
    private adminService: AdminService,
  ) {}

  apiHost: string = environment.apiHost;

  public currentUser: CurrentUser = {
    userName: '',
    email: ''
  };

  message_id!: string;
  user_id:     number | undefined;
  schema_id!:  number;
  addresses!:  string;
  selectedSalaryLocalId: string = '';
  selectedSalaryXeroId: string = '';



  public selectedUser: selectedUser = {
    username: '',
    email: '',
    role: '',
    name_in_xero: '',
    ip_address: [
      {
        address: ''
      }
    ],
  };

  public selectedSchemes: Schemes = {
    id: 0,
    account_number: 0,
    name: ''
  };

  public users:            Users[]   = [];
  public schemes:          Schemes[] = [];
  public salary_xero:      Salary[] = [{
    id: '',
    name: '',
  }];
  public salary_local:     Salary[] = [{
    id: '',
    name: '',
  }];

  public search_salary_xero:  Salary[] = [];
  public search_salary_local: Salary[] = [];

  public START_OF_SHIFT:   Time[] = [{
    name: 'START_OF_SHIFT',
    value: ''
  }];

  ngOnInit() {
    this.request.fetchToken()
      .then(() => {
        this.request.getCurrentUser()
          .then(data => {
            this.currentUser.userName = data.username;
            this.currentUser.email = data.email;
            this.renderUsers();
            this.getAllSchemes();
            this.getStartTime();
            this.getAllSalary();
            let interval = setInterval(()=>{
              if(this.users.length != 0){
                this.preloader.HidePreloader();
                clearInterval(interval)
              }
            },100)
          })
          .catch(() => {
            window.location.replace(this.apiHost)
          });
      })
      .catch(() => {
        window.location.replace(this.apiHost)
      });
    console.log(this.users)
  }

  getUser(id: number){
    this.user_id = id;
  }

  removeUser(id: number | undefined){
    if(id != undefined){
      this.users = this.users.filter(t => t.id !== id)
    }
  }

  renderUsers(){
    this.users = [];
    this.request.getAllUsers().subscribe(data => {
      for(let i = 0; i < data.length; i++){
        this.users[i] = data[i];
        this.users[i].addresses = this.toColumn(this.ipAddressesToString(data[i].id))
      }
    });
    for(let i = 0; i < this.users.length; i++){
    }
    console.log(this.users)
  }



  toColumn(str: string){
    return str.replace(/\s+/g, '\n')
  }


  getEditUser(id: number){
    this.getUser(id);
    let body = this.users.filter(t => t.id == this.user_id)[0];

    this.addresses = this.ipAddressesToString();

    console.log(this.addresses);
    this.selectedUser.name_in_xero = body.name_in_xero;
    this.selectedUser.ip_address[0].address = body.ip_address[0].address;
    this.selectedUser.role = body.role
  }



  checkNewUser(): boolean{
    console.log(this.selectedUser.email);
    return this.checkdata.checkEmail(this.selectedUser.email) &&
           this.selectedUser.username != '' &&
           this.selectedUser.role != '';
  }



  LogOut(){
    this.cookie.removeCookie('token');
    window.location.replace(this.apiHost)
  }

  toSettings(){
    this.redirect.setLocation(this.apiHost, config.routes.settings)
  }

  toHome(){
    this.redirect.setLocation(this.apiHost, config.routes.main)
  }



  CancelSave(){
    let v = document.getElementById("cancelsavediv");
    if(v !== null){
      if (v.style.display === "none") {
        v.style.display = "block";
      } else {
        v.style.display = "none";
      }
    }
  }

  ipAddressesToString(id?: number){
    let body;
    if(id)
      body = this.users.filter(t => t.id == id)[0].ip_address;
    else
      body = this.users.filter(t => t.id == this.user_id)[0].ip_address;

    let addressStr;
    for(let i = 0; i < body.length; i++){
      if(i == 0){
        addressStr = body[i].address;
        continue;
      }
      addressStr += ', ' + body[i].address
    }

    if(addressStr != undefined){
      console.log(addressStr);
      return addressStr
    }

    console.log(addressStr);
    return ''
  }



  clearSelectedUser(){
    this.selectedUser.username = '';
    this.selectedUser.email = '';
    this.selectedUser.role = '';
    this.selectedUser.name_in_xero = '';
    this.selectedUser.ip_address = [
      {
        address: ''
      }
    ]
  }

  ClearMessage(){
    setTimeout(() => {
      this.messager.HideMessage();
      this.message_id = ''
    },5000);
  }


  /**************** USERS ***************** */

  editUser(){
    this.message_id = 'user-edit-message';
    console.log(this.selectedUser);
    let body = this.users.filter(t => t.id == this.user_id)[0];
    let response = {
      username: body.username,
      email: body.email,
      role: this.selectedUser.role,
      name_in_xero: this.selectedUser.name_in_xero,
      ip_address: this.adminService.SplitIpAddress(this.addresses)
    };

    if((this.user_id != undefined) && this.adminService.SplitIpAddress(this.addresses)){
      this.request.updateUser(response, this.user_id).subscribe(() =>{
          this.messager.ShowMessage('Отлично', 'Данные пользователя обновлены', 'success');
          setTimeout(() => this.messager.HideMessage(), 5000);
          this.renderUsers();
        },
        error => {
          console.log(error.error.errors.email[0]);
          this.messager.ShowMessage('Error', error.detail, 'danger');
          this.ClearMessage();
        });
      this.adminService.SplitIpAddress(this.addresses)
    }

  }

  deleteUser(){
    if(this.user_id != undefined){
      let body = this.users.filter(t => t.id == this.user_id);
      this.request.deleteUser(body, this.user_id).subscribe(() => {
        this.messager.ShowMessage('Отлично', 'Пользователь удалён из базы данных', 'success');
        this.ClearMessage();
      });
      this.removeUser(this.user_id)
    }
  }


  addNewUser(){
    console.log(this.selectedUser);
    console.log(this.adminService.SplitIpAddress(this.addresses));
    this.message_id = 'user-message';
    let response = {
      username: this.selectedUser.username,
      email: this.selectedUser.email,
      role: this.selectedUser.role,
      name_in_xero: this.selectedUser.name_in_xero,
      ip_address: this.adminService.SplitIpAddress(this.addresses)
    };

    if(this.checkdata.checkEmail(response.email)) {
      if (this.checkNewUser() && this.adminService.SplitIpAddress(this.addresses)) {
        this.request.createUser(response).subscribe(
          data =>{
            console.log(data);
            this.messager.ShowMessage('Отлично', 'Пользоватеь успешно добавлен', 'success');
            this.ClearMessage();
            this.renderUsers();
          },
          error => {
            console.log(error.error.errors.email[0]);
            this.messager.ShowMessage('Error', error.error.errors.email[0], 'danger');
            setTimeout(() => this.messager.HideMessage(), 5000);
            this.clearSelectedUser()
          });
      }
    } else {
      this.messager.ShowMessage('Ошибка', 'Некоректный e-mail', 'danger')
    }

  }


  /*************** SCHEMES **************** */

  getAllSchemes(){
    this.request.getAllSchemes().subscribe(data => {
      for(let i = 0; i < data.length; i++){
        this.schemes[i] = data[i];
      }
    })
  }

  createSchema() {
    this.message_id = 'schema-message';
    let body = {
      account_number: this.selectedSchemes.account_number,
      name: this.selectedSchemes.name
    };
    this.request.createSchema(body).subscribe(
      () => {
        this.messager.ShowMessage('Отлично', 'Схема успешно создана', 'success');
        setTimeout(() => this.messager.HideMessage(), 5000);
        this.getAllSchemes();
      },
      error => {
        let err = '';
        if(error.error.errors.account_number){
          err += error.error.errors.account_number + "\n";
        }
        if (error.error.errors.name){
          err += error.error.errors.name
        }
        this.messager.ShowMessage('Ошибка!', err, 'danger')
      });
  }

  deleteSchema(){
    this.message_id = 'schema-message';
    this.request.deleteSchema(this.schema_id).subscribe(()=>{
      this.messager.ShowMessage('Отлично', 'Схема успешно удалена', 'success');
      setTimeout(() => this.messager.HideMessage(), 5000);
      this.removeSchema(this.schema_id);
    });
  }

  getIdSchema(id: number){
    this.schema_id = id
  }



  removeSchema(id: number){
    this.schemes = this.schemes.filter(t => t.id !== id)
  }


  /*************** TIME **************** */

  getStartTime(){
    this.request.getStarTime().subscribe(data => {
      this.START_OF_SHIFT[0].value = data[0].value;
      console.debug("Get Start Time: "+data[0]);
    }, error => {console.log(error)})
  }



  setStartTime(){
    this.request.patchStartTime(this.START_OF_SHIFT).subscribe(()=>{
      this.message_id = 'time-message';
      this.messager.ShowMessage('Отлично', 'Время начала смены успешно изменено', 'success');
      this.ClearMessage();
    })
  }


  /*************** CONTACTS **************** */

  getAllSalary() {
    this.message_id = 'xero-message';
    this.request.getAllSalary(config.request.admins.contacts).subscribe(
      data => {
        this.salary_xero = data.xero;
        this.salary_local = data.local;
      },
        error => {
        this.messager.ShowMessage('Ошибка', error.error.detail, 'danger');
      })
  }

  createSalaryContact(){
    this.message_id = 'xero-message';
    let body = this.salary_xero.filter(t=>t.id == this.selectedSalaryXeroId)[0];
    this.request.createSalaryContact(config.request.admins.contacts, body).subscribe(
      data => {
        console.log(data);
        this.addSalaryItem()
      },
      error => {
        this.messager.ShowMessage('Ошибка', error.error.detail, 'danger');
        this.ClearMessage();
      }
    );
  }

  deleteSalaryContact(){
    this.message_id = 'xero-message';
    if(this.selectedSalaryLocalId)
      this.request.deleteSalaryContact(config.request.admins.contacts, this.selectedSalaryLocalId).subscribe(
        data => {
          console.log(data);
          this.removeSalaryItem()
      },
        error => {
          console.log(error);
          this.messager.ShowMessage('Ошибка', error.error.detail, 'danger');
          this.ClearMessage();
        })
  }

  addSalaryItem(){
    let item = this.salary_xero.filter(t=>t.id == this.selectedSalaryXeroId)[0];
    this.salary_xero = this.salary_xero.filter(t=>t.id !== this.selectedSalaryXeroId);
    this.salary_local.push(item)
  }

  removeSalaryItem(){
    let item = this.salary_local.filter(t => t.id == this.selectedSalaryLocalId)[0];
    this.salary_local = this.salary_local.filter(t => t.id !== this.selectedSalaryLocalId);
    this.salary_xero.push(item);
  }

  selectSalaryXero(event: any){
    this.selectedSalaryXeroId = event.target.value;
    if(event.target.value) {
      this.RightButton(false);
      this.LeftButton(true);
    }
  }
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
    AdminComponent.SetStatusButton(element, status)
  }

  LeftButton(status: boolean){
    let element = document.getElementById("toLeft");
    AdminComponent.SetStatusButton(element, status)
  }

  private static SetStatusButton(element: any, status: boolean){
    if (status) {
      element.setAttribute("disabled", "disabled");
    } else {
      element.removeAttribute("disabled")
    }
  }



}
