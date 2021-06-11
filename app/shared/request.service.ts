import { Injectable } from '@angular/core';
import { HttpClient} from "@angular/common/http"
import { CookieService } from 'ngx-cookie-service'

import config from '../../assets/config.json';

@Injectable({providedIn: 'root'})

export class RequestService {

  token: string | unknown;
  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.token = this.cookieService.get('token');
  }


  fetchData (url: string, body: object) {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<any>(url, JSON.stringify(body), { headers }).toPromise()
  }



  fetchToken(){
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.cookieService.get('token')
    };
    var body = "";
    return this.http.post<any>(config.request.token, body, { headers } ).toPromise();
  }


  fetchNewPass(body: object, ) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
    };
    return this.http.patch<any>(config.request.user, JSON.stringify(body), { headers }).toPromise()
  }


  getCurrentUser() {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
    };
    return this.http.get<any>(config.request.user, { headers }).toPromise();
  }

  fetchPatch(body: object){
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
    };
    return this.http.patch<any>(config.request.user, JSON.stringify(body), { headers }).toPromise();
  }

  getAllUsers(){
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
    };
    return this.http.get<any>(config.request.admins.users, { headers })
  }

  createUser(body: object){
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
    };
    return this.http.post<any>(config.request.admins.users, JSON.stringify(body), {headers})
  }

  updateUser(body: object, id:number){
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
    };
    return this.http.patch<any>(config.request.admins.users+id, JSON.stringify(body), {headers})
  }

  deleteUser(body: object, id:number){
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
      },
      body: body,
    };

    return this.http.delete<any>(config.request.admins.users+id, options)
  }
  getUser(id:number){
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
    };
    return this.http.get<any>(config.request.admins.users+id, { headers }).toPromise()
  }


  getAllSchemes(){
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
    };
    return this.http.get<any>(config.request.admins.schemes, { headers })
  }

  createSchema(body: object){
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
    };
    return this.http.post<any>(config.request.admins.schemes, JSON.stringify(body), {headers})
  }

  deleteSchema(id: number){
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
      }
    };
    return this.http.delete<any>(config.request.admins.schemes+id, options)
  }

  getStarTime(){
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
    };
    return this.http.get<any>(config.request.admins.settings.time, { headers })
  }

  patchStartTime(body: object[]){
    console.log(body);
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
    };
    return this.http.patch<any>(config.request.admins.settings.time, body, { headers })
  }

  getAllSalary(url: string){
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
    };
    return this.http.get<any>(url, {headers})
  }

  createSalaryContact(url: string, body: object){
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
    };

    return this.http.post<any>(url, body, {headers})
  }

  deleteSalaryContact(url: string, id:string){
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
    };

    return this.http.delete<any>(url+id,{headers})
  }

  getXero(){
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
    };
    return this.http.get<any>(config.request.xero, {headers})
  }

  patchXero(body: object[]){
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
    };
    console.log(body);
    return this.http.patch<any>(config.request.xero, JSON.stringify(body), {headers})
  }

}
