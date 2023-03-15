import { Injectable } from "@angular/core";
import { HttpService } from "src/app/services/http/http.service";
@Injectable({providedIn: 'root'})
export class RoomCategoryService{
    constructor(private http: HttpService){}
    get_room_categories(){
        return this.http.get_room_categories()
    }
    get_room_category(id:number){
        return this.http.get_room_category(id)
    }
    add_room_category(data: FormData){
        return this.http.add_room_category(data)
    }
    update_room_category(data: FormData){
        return this.http.update_room_category(data)
    }
    delete_room_category(id:number){
        return this.http.delete_room_category(id)
    }
}