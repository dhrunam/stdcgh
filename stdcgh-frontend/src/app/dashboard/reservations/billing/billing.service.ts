import { Injectable } from "@angular/core";
import { HttpService } from "src/app/services/http/http.service";

@Injectable({providedIn: 'root'})
export class BillingService{
    rooms: any = [];
    reservations: any = [];
    constructor(private http: HttpService){}
    get_rooms(property_id:number){
        return this.http.get_property_room(property_id)
    }
    get_reservations(room_no:string){
        return this.http.on_get_billing_reservation(room_no)
    }
}