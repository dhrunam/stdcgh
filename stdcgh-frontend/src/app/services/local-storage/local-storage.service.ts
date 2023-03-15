import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { SECRET_KEY } from 'src/environment/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() { }

  public saveUserDetails(token: string, expiry: string, users: Array<any>){
    if(localStorage.getItem('token') || localStorage.getItem('expiry') || localStorage.getItem('userDetails')){
      localStorage.clear();
    }
    localStorage.setItem('token', token);
    localStorage.setItem('expiry', expiry);
    localStorage.setItem('userDetails', CryptoJS.AES.encrypt(JSON.stringify(users), SECRET_KEY).toString());
  }
  public getToken(){
    return localStorage.getItem('token');
  }
  public getRole(){
    let data:any = localStorage.getItem('userDetails');
    let role = JSON.parse(CryptoJS.AES.decrypt(data, SECRET_KEY).toString(CryptoJS.enc.Utf8));
    return role.related_groups[0].id;
  }
  public getUsername(){
    let data:any = localStorage.getItem('userDetails');
    let username = JSON.parse(CryptoJS.AES.decrypt(data, SECRET_KEY).toString(CryptoJS.enc.Utf8));
    return username.username;
  }
  public clearSession(){
    localStorage.clear();
  }
}
