import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL } from 'src/environment/environment.prod';
import { AuthResponse } from '../auth-service/auth.service';
import { Property } from 'src/app/dashboard/masters/property/property.service';
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient) { }
  login(fd: FormData){
    return this.http.post<AuthResponse>(`${URL}/api/auth/login/`, fd);
  }
  logout(){
    return this.http.post(`${URL}/api/auth/logout/`,{});
  }
  get_roles(){
    return this.http.get<Property>(`${URL}/api/user/group`);
  }
  get_properties(){
    return this.http.get<any>(`${URL}/api/property`);
  }
  get_property(id:number){
    return this.http.get<any>(`${URL}/api/property/${id}`);
  }
  add_property(fd: FormData){
    return this.http.post(`${URL}/api/property`, fd);
  }
  update_property(fd: FormData){
    return this.http.patch(`${URL}/api/property/${fd.get('id')}`, fd);
  }
  delete_property(fd: FormData){
    return this.http.patch(`${URL}/api/property/${fd.get('id')}`, fd);
  }
  get_room_categories(){
    return this.http.get<any>(`${URL}/api/room/category`);
  }
  get_room_category(id:number){
    return this.http.get<any>(`${URL}/api/room/category/${id}`);
  }
  add_room_category(fd: FormData){
    return this.http.post(`${URL}/api/room/category`, fd);
  }
  update_room_category(fd: FormData){
    return this.http.put(`${URL}/api/room/category/${fd.get('id')}`, fd);
  }
  delete_room_category(id:number){
    return this.http.delete(`${URL}/api/room/category/${id}`);
  }
  get_rooms(){
    return this.http.get<any>(`${URL}/api/room`);
  }
  get_room(id:number){
    return this.http.get<any>(`${URL}/api/room/${id}`);
  }
  get_property_room(property_id:number){
    return this.http.get<any>(`${URL}/api/room?property=${property_id}`);
  }
  add_room(fd: FormData){
    return this.http.post(`${URL}/api/room`, fd);
  }
  update_room(fd: FormData){
    return this.http.patch(`${URL}/api/room/${fd.get('id')}`, fd);
  }
  delete_room(id:number){
    return this.http.delete(`${URL}/api/room/${id}`);
  }
  room_is_operational(fd: FormData){
    return this.http.patch(`${URL}/api/room/${fd.get('id')}`, fd);
  }
  get_room_rates(){
    return this.http.get<any>(`${URL}/api/room/rate`);
  }
  get_room_rate(id:number){
    return this.http.get<any>(`${URL}/api/room/rate/${id}`);
  }
  add_room_rate(fd: FormData){
    return this.http.post(`${URL}/api/room/rate`, fd);
  }
  update_room_rate(fd: FormData){
    return this.http.put(`${URL}/api/room/rate/${fd.get('id')}`, fd);
  }
  delete_room_rate(id:number){
    return this.http.delete(`${URL}/api/room/rate/${id}`);
  }
  get_users(){
    return this.http.get<any>(`${URL}/api/user/reg`);
  }
  get_user(id:number){
    return this.http.get<any>(`${URL}/api/user/reg/${id}`);
  }
  add_user(fd: FormData){
    return this.http.post(`${URL}/api/user/reg`, fd);
  }
  update_user(fd: FormData){
    return this.http.patch(`${URL}/api/user/reg/${fd.get('id')}`, fd);
  }
  delete_user(id:number){
    return this.http.delete(`${URL}/api/user/reg/${id}`);
  }
  change_user_password(fd: FormData){
    return this.http.put(`${URL}/api/user/update/password/${fd.get('id')}`, fd);
  }
  search_rooms(checkin_date: Date, checkout_date: Date, property: number){
    return this.http.get<any>(`${URL}/api/room/search/v2?checkin_date=${checkin_date}&checkout_date=${checkout_date}&property=${property}`);
  }
  confirm_reservation(fd: FormData){
    return this.http.post(`${URL}/api/reservation`, fd);
  }
  get_checkin_reservations(checkin_date:string){
    return this.http.get<any>(`${URL}/api/reservation?checkin_date=${checkin_date}`);
  }
  on_checkin(fd: FormData){
    return this.http.post(`${URL}/api/room/checkin`, fd);
  }
  get_checkout_reservations(checkout_date: string){
    return this.http.get<any>(`${URL}/api/reservation?checkout_date=${checkout_date}`);
  }
  on_checkout(fd: FormData){
    return this.http.post(`${URL}/api/room/checkout`, fd);
  }
  on_generate_bill(fd: FormData){
    return this.http.post(`${URL}/api/reservation/bill`, fd);
  }
  on_get_billing_reservation(room_no:string){
    return this.http.get<any>(`${URL}/api/reservation?room_no=${room_no}`);
  }

  get_other_services_reservations(){
    return this.http.get<any>(`${URL}/api/reservation?operation=other_service`);
  }
  get_misscellaneous_services_of_reservation(id:number){
    return this.http.get(`${URL}/api/reservation/miscellaneous/charge?reservation=${id}`);
  }

  on_misscellaneous_service_save(fd: FormData){
    return this.http.post(`${URL}/api/reservation/miscellaneous/charge`, fd);
  }
  on_misscellaneous_service_update(fd: FormData){
    return this.http.post(`${URL}/api/reservation/miscellaneous/charge/${fd.get('id')}`, fd);
  }
  on_cancel_booking(fd: FormData){
    return this.http.patch(`${URL}/api/reservation/${fd.get('id')}`, fd)
  }
  get_report(checkin_date: string, checkout_date: string){
    return this.http.get<any>(`${URL}/api/reservation/report?start_date=${checkin_date}&end_date=${checkout_date}`);
  }
}
