import { Injectable } from "@angular/core";
import { HttpService  } from "src/app/services/http/http.service";
@Injectable({providedIn: 'root'})
export class RoomService{
    constructor(private http: HttpService) {}
    get_properties(){
        return this.http.get_properties()
    }
    get_room_categories(){
        return this.http.get_room_categories()
    }
    get_rooms(){
        return this.http.get_rooms()
    }
    get_room(id:number){
        return this.http.get_room(id)
    }
    add_room(data:FormData){
        return this.http.add_room(data)
    }
    update_room(data:FormData){
        return this.http.update_room(data)
    }
    delete_room(id:number){
        return this.http.delete_room(id)
    }
    room_is_operational(fd:FormData){
        return this.http.room_is_operational(fd)
    }
}