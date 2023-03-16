import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class TimeCardService {
  constructor(private http: HttpService) { }
  get_checkin_reservations(checkin_date:string){
    return this.http.get_checkin_reservations(checkin_date)
  }
  get_checkout_reservations(checkout_date:string){
    return this.http.get_checkout_reservations(checkout_date)
  }
  on_checkin(fd:FormData){
    return this.http.on_checkin(fd)
  }
  on_checkout(fd:FormData){
    return this.http.on_checkout(fd)
  }
  on_no_show(data:FormData){
    return this.http.on_cancel_booking(data)
  }
}
