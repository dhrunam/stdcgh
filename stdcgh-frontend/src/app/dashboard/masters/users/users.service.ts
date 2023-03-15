import { Injectable } from "@angular/core";
import { HttpService } from "src/app/services/http/http.service";
@Injectable({providedIn: 'root'})
export class UserService{
    constructor(private http: HttpService){}
    get_roles(){
        return this.http.get_roles()
    }
    get_properties(){
        return this.http.get_properties()
    }
    get_users(){
        return this.http.get_users()
    }
    get_user(id: number){
        return this.http.get_user(id)
    }
    add_user(data: FormData){
        return this.http.add_user(data)
    }
    update_user(data: FormData){
        return this.http.update_user(data)
    }
    delete_user(id:number){
        return this.http.delete_user(id)
    }
    change_user_password(data: FormData){
        return this.http.change_user_password(data)
    }
}