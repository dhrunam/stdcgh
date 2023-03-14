import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";
import { HttpService } from "src/app/services/http-service/http.service";
@Injectable({providedIn: 'root'})
export class TimeCardService{
    status: any;
    checkin_list: any = [];
    private subscription!: Subscription;
    constructor(private http: HttpService){}
    get_checkin_reservations(checkin_date:string){
        this.subscription = this.http.get_checkin_reservations(checkin_date).subscribe({
            next: data => { this.checkin_list = data },
            error: err => console.log(err),
        })
        return new Promise(
            (resolve, reject) => {
                setTimeout(() => {
                    resolve(this.checkin_list);
                },200)
            }
        )
    }
    get_checkout_reservations(checkout_date:string){
        this.subscription = this.http.get_checkout_reservations(checkout_date).subscribe({
            next: data => { this.checkin_list = data },
            error: err => console.log(err),
        })
        return new Promise(
            (resolve, reject) => {
                setTimeout(() => {
                    resolve(this.checkin_list);
                },200)
            }
        )
    }
    on_checkin(fd:any){
        this.subscription = this.http.on_checkin(fd).subscribe({
            next: data => { this.status = data },
            error: err => { this.status = err }
        })
        return new Promise(
            (resolve, reject) => {
                setTimeout(() => {
                    resolve(this.status);
                },200)
            }
        )
    }
    on_checkout(fd:any){
        this.subscription = this.http.on_checkout(fd).subscribe({
            next: data => { this.status = data },
            error: err => { this.status = err}
        });
        this.onGenerateBill(fd);
        return new Promise(
            (resolve, reject) => {
                setTimeout(() => {
                    resolve(this.status);
                },200)
            }
        )
    }
    onGenerateBill(fd:any){
        this.http.on_generate_bill(fd).subscribe({
            next: data => { return true },
            error: err => { return false }
        })
    }
    ngOnDestroy(): void{
        this.subscription.unsubscribe();
    }
}