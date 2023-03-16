import { Injectable } from "@angular/core";
import { Subject, tap } from "rxjs";
import { HttpService } from "src/app/services/http/http.service";

@Injectable({providedIn: 'root'})
export class BookingService{
    acknowledgement = new Subject<any>();
    roomDetails = new Subject<{property: number, checkin_date: Date, checkout_date: Date, rooms: any}>();
    results = new Subject<{data: any, checkin_date: Date, checkout_date: Date, property: number, days: number}>();
    properties: any = [];
    searchRooms: any;
    room_detail:any = [];
    ack_details: any = [];
    constructor(private http: HttpService){}
    getProperties(){
        return this.http.get_properties()
    }
    search_rooms(checkin_date: Date, checkout_date: Date, property: number){
        return this.http.search_rooms(checkin_date, checkout_date, property);
    }
    confirm_reservation(fd:FormData){
        return this.http.confirm_reservation(fd)
    }
}