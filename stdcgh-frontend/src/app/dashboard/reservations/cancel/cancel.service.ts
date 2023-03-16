import { Injectable } from "@angular/core";
import { HttpService } from "src/app/services/http/http.service";

@Injectable({providedIn: 'root'})
export class CancelService{
    constructor(private http: HttpService){}
    get_checkin_reservations(checkin_date:string){
        return this.http.get_checkin_reservations(checkin_date)
    }
    on_cancellation(data:any){
        return this.http.on_cancel_booking(data)
    }
}