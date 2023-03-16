import { Injectable } from "@angular/core";
import { HttpService } from "src/app/services/http/http.service";
@Injectable({
  providedIn: 'root'
})
export class MiscellaneousService {
    constructor(private http: HttpService){}
    get_other_services_reservations(){
        return this.http.get_other_services_reservations()
    }
    get_miscellaneous_service_of_reservation(id:number){
        return this.http.get_misscellaneous_services_of_reservation(id)
    }
    on_miscellaneous_service_save(fd:FormData){
        return this.http.on_misscellaneous_service_save(fd)
    }
    on_miscellaneous_service_update(fd:FormData){
        return this.http.on_misscellaneous_service_update(fd)
    }
}
