import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";
import { HttpService } from "src/app/services/http-service/http.service";

@Injectable({providedIn: 'root'})
export class BillingService{
    rooms: any = [];
    reservations: any = [];
    private subscription!: Subscription;
    constructor(private http: HttpService){}
    get_rooms(property_id:number){
        this.subscription = this.http.get_property_room(property_id).subscribe({
            next: data => { this.rooms = data},
            error: err => console.log(err),
        });
        return new Promise(
            (resolve,reject) => {
                setTimeout(() => {
                    resolve(this.rooms);
                }, 200);
            }
        )
    }
    get_reservations(room_no:string){
        this.subscription = this.http.on_get_billing_reservation(room_no).subscribe({
            next: data => { this.reservations = data },
            error: err => console.log(err)
        })
        return new Promise(
            (resolve, reject) => {
                setTimeout(() => {
                    resolve(this.reservations)
                }, 200);
            }
        )
    }
    ngOnDestroy(){
        this.subscription.unsubscribe();
    }
}