import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";
import { HttpService } from "src/app/services/http-service/http.service";
@Injectable({providedIn: 'root'})
export class RoomCategoryService{
    status: any;
    categories: any = [];
    category!: { id:number, name:string};
    private subscription!: Subscription;
    constructor(private http: HttpService){}
    get_room_categories(){
        this.subscription = this.http.get_room_categories().subscribe({
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
    get_room_category(id:number){
        this.subscription = this.http.get_room_category(id).subscribe({
            next: data => { this.category = { id: data.id, name: data.name } },
            error: err => console.log(err)
        })
        return new Promise(
            (resolve,reject) => {
                setTimeout(() => {
                    resolve(this.category);
                },200)
            }
        )
    }
    add_room_category(data: any){
        this.subscription = this.http.add_room_category(data).subscribe({
            next: data => { this.status = data },
            error: err => { this.status = err}
        })
        return new Promise(
            (resolve,reject) => {
                setTimeout(() => {
                    resolve(this.status);
                },200)
            }
        )
    }
    update_room_category(data: any){
        this.subscription = this.http.update_room_category(data).subscribe({
            next: data => { this.status = data },
            error: err => { this.status = err}
        });
        return new Promise(
            (resolve,reject) => {
                setTimeout(() => {
                    resolve(this.status);
                },200)
            }
        )
    }
    delete_room_category(id:number){
        this.subscription = this.http.delete_room_category(id).subscribe({
            next: data => { this.get_room_categories() },
            error: err => console.log(err)
        })
    }
    ngOnDestroy(){
        this.subscription.unsubscribe();
    }
}