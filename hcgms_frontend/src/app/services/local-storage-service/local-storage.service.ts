import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { KEY } from 'src/environment/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  public saveToken(token:string){
    if(window.localStorage.getItem('token')){
      window.localStorage.removeItem('token');
    }
    window.localStorage.setItem('token', token);
  }
  public saveData(data: any){
    if(window.localStorage.getItem('details')){
      window.localStorage.removeItem('details');
    }
    window.localStorage.setItem('details', CryptoJS.AES.encrypt(data, KEY).toString());
  }
  public getToken(){
    return window.localStorage.getItem('token');
  }
  public getUserName(){
    let data: any = window.localStorage.getItem('details');
    let res_data: any = JSON.parse(CryptoJS.AES.decrypt(data,KEY).toString(CryptoJS.enc.Utf8));
    return res_data.username;
  }
  public getPropertyId(){
    let data: any = window.localStorage.getItem('details');
    let res_data: any = JSON.parse(CryptoJS.AES.decrypt(data,KEY).toString(CryptoJS.enc.Utf8));
    return res_data.related_profile[0].property;
  }
  public getRoleId(){
    let data: any = window.localStorage.getItem('details');
    let res_data: any = JSON.parse(CryptoJS.AES.decrypt(data,KEY).toString(CryptoJS.enc.Utf8));
    return res_data.related_groups[0].id;
  }
  public clearSession(){
    window.localStorage.clear();
  }
}
