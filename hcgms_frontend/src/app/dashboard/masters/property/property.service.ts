import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";
import { HttpService } from "src/app/services/http-service/http.service";
@Injectable({providedIn: 'root'})
export class PropertyService{
    status: any = [];
    properties: any = [];
    details!: { id:number, name:string, short_name: string, address: string, description:string, code: string};
    private subscription!: Subscription;
    constructor(private http: HttpService){}
    get_properties(){
        this.subscription = this.http.get_properties().subscribe({
            next: data => { this.properties = data; },
            error: err => console.log(err)
        })
        return new Promise(
            (resolve, reject) => {
                setTimeout(() => {
                    resolve(this.properties);
                }, 200)
            }
        )
    }
    get_property(id:number){
        this.subscription = this.http.get_property(id).subscribe({
            next: data => { this.details = { id: data.id, name: data.name, short_name: data.short_name, address: data.address, description: data.description, code: data.code}; },
            error: err => console.log(err) 
        })
        return new Promise(
            (resolve, reject) => {
                setTimeout(() => {
                    resolve(this.details);
                }, 200)
            }
        )
    }
    add_property(data:any){
        this.subscription = this.http.add_property(data).subscribe({
            next: data => { this.status = data; },
            error: err => { this.status = err }
        });
        return new Promise(
            (resolve,reject) => {
                setTimeout(() => {
                    resolve(this.status);
                },200)
            }
        )
    }
    update_property(data:any){
        this.subscription = this.http.update_property(data).subscribe({
            next: data => { this.status = data },
            error: err => { this.status = err }
        });
        return new Promise(
            (resolve,reject) => {
                setTimeout(() => {
                    resolve(this.status);
                },200)
            }
        )
    }
    delete_property(data:any){
        this.subscription = this.http.delete_property(data).subscribe({
            next: data => { this.get_properties() },
            error: err => console.log(err)
        })
    }
    ngOnDestory(){
        this.subscription.unsubscribe();
    }
}