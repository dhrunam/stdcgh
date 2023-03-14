import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";
import { HttpService } from "src/app/services/http-service/http.service";
@Injectable({providedIn: 'root'})
export class UserService{
    status: any;
    properties: any = [];
    roles: any = [];
    users: any = [];
    user!: { id:number, first_name: string, last_name: string, username: string, contact:string, property: string , role: string}
    private subscription!: Subscription;
    constructor(private http: HttpService){}
    get_roles(){
        this.subscription = this.http.get_roles().subscribe({
            next: data => { this.roles = data },
            error: err => console.log(err)
        });
        return new Promise(
            (resolve, reject) => {
                setTimeout(() => {
                    resolve(this.roles);
                }, 200);
            }
        )
    }
    get_properties(){
        this.subscription = this.http.get_properties().subscribe({
            next: data => { this.properties = data },
            error: err => console.log(err),
        });
        return new Promise(
            (resolve, reject) => {
                setTimeout(() => {
                    resolve(this.properties);
                }, 200);
            }
        )
    }
    get_users(){
        this.subscription = this.http.get_users().subscribe({
            next: data => { this.users = data; },
            error: err => console.log(err),
        });
        return new Promise(
            (resolve, reject) => {
                setTimeout(() => {
                    resolve(this.users);
                }, 200);
            }
        )
    }
    get_user(id: number){
        this.subscription = this.http.get_user(id).subscribe({
            next: data => { this.user = { id: data.id, first_name: data.first_name, last_name: data.last_name, username: data.username, contact: data.related_profile[0].contact_number, property: data.related_profile[0].related_property.id, role: data.related_groups[0].id} },
            error: err => console.log(err)
        });
        return new Promise(
            (resolve, reject) => {
                setTimeout(() => {
                    resolve(this.user);
                }, 200);
            }
        )
    }
    add_user(data: any){
        this.subscription = this.http.add_user(data).subscribe({
            next: data => { this.status = data },
            error: err => { this.status = err },
        });
        return new Promise(
            (resolve,reject) => {
                setTimeout(() => {
                    resolve(this.status);
                }, 200)
            }
        )
    }
    update_user(data: any){
        this.subscription = this.http.update_user(data).subscribe({
            next: data => { this.status = data },
            error: err => { this.status = err },
        });
        return new Promise(
            (resolve,reject) => {
                setTimeout(() => {
                    resolve(this.status);
                }, 200)
            }
        )
    }
    delete_user(id:number){
        this.subscription = this.http.delete_user(id).subscribe({
            next: data => { this.get_users() },
            error: err => console.log(err),
        });
    }
    change_user_password(data: any){
        this.subscription = this.http.change_user_password(data).subscribe({
            next: data => { this.status = data },
            error: err => { this.status = err },
        });
        return new Promise(
            (resolve,reject) => {
                setTimeout(() => {
                    resolve(this.status);
                }, 200)
            }
        )
    }
    ngOnDestroy(){
        this.subscription.unsubscribe();
    }
}