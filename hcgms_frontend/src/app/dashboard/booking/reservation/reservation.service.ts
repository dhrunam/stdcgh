import { Injectable } from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { HttpService } from "src/app/services/http-service/http.service";

@Injectable({providedIn: 'root'})
export class ReservationService{
    acknowledgement = new Subject<any>();
    roomDetails = new Subject<{property: number, checkin_date: Date, checkout_date: Date, rooms: any}>();
    results = new Subject<{data: any, checkin_date: Date, checkout_date: Date, property: number, days: number}>();
    properties: any = [];
    searchRooms: any;
    room_detail:any = [];
    ack_details: any = [];
    private subscription!: Subscription;
    constructor(private http: HttpService){}
    getProperties(){
        this.subscription = this.http.get_properties().subscribe({
            next: data => this.properties = data,
            error: err => console.log(err),
        });
        return new Promise(
            (resolve,reject) => {
                setTimeout(() => {
                    resolve(this.properties);
                },200)
            }
        )
    }
    search_rooms(checkin_date: Date, checkout_date: Date, property: number){
        this.subscription = this.http.search_rooms(checkin_date, checkout_date, property)
        .subscribe({
            next: data => { this.searchRooms = data },
            error: err => console.log(err)
        });
        return new Promise(
            (resolve, reject) => {
                setTimeout(() => {
                    resolve(this.searchRooms);
                }, 200);
            }
        )
    }
    confirm_reservation(fd:any){
        this.subscription = this.http.confirm_reservation(fd).subscribe({
            next: data => { this.ack_details = data },
            error: err => console.log(err)
        })
        return new Promise(
            (resolve,reject) => {
                setTimeout(() => {
                    resolve(this.ack_details);
                },200)
            }
        );
    }
    ngOnDestroy(): void{
        this.subscription.unsubscribe();
    }
}