import { Injectable } from "@angular/core";
import { HttpService  } from "src/app/services/http/http.service";
@Injectable({providedIn: 'root'})
export class RoomService{
    status:any;
    properties: any = [];
    categories: any = [];
    rooms: any = [];
    room!: { id:number, room_no: string, occupancy: string, property: number, room_category: number, description: string, is_operational:boolean}
    constructor(private http: HttpService) {}
    get_properties(){
        this.http.get_properties().subscribe({
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
    get_room_categories(){
        this.http.get_room_categories().subscribe({
            next: data => { this.categories = data;},
            error: err => console.log(err)
        })
        return new Promise(
            (resolve,reject) => {
                setTimeout(() => {
                    resolve(this.categories);
                },200)
            }
        )
    }
    get_rooms(){
        this.http.get_rooms().subscribe({
            next: data => { this.rooms = data },
            error: err => console.log(err),
        })
        return new Promise(
            (resolve,reject) => {
                setTimeout(() => {
                    resolve(this.rooms);
                },200)
            }
        )
    }
    get_room(id:number){
        this.http.get_room(id).subscribe({
            next: data => { this.room = { id: data.id, room_no: data.room_no, occupancy: data.occupancy, property: data.property, room_category: data.room_category, description: data.description, is_operational: data.is_operational} },
            error: err => console.log(err),
        })
        return new Promise(
            (resolve,reject) => {
                setTimeout(() => {
                    resolve(this.room);
                },200)
            }
        )
    }
    add_room(data:any){
        this.http.add_room(data).subscribe({
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
    update_room(data:any){
        this.http.update_room(data).subscribe({
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
    delete_room(id:number){
        this.http.delete_room(id).subscribe({
            next: data => { this.get_rooms() },
            error: err => console.log(err),
        })
    }
    room_is_operational(fd:any){
        this.http.room_is_operational(fd).subscribe({
            next: data => { this.get_rooms() },
            error: err => console.log(err),
        })
    }
}