import { Injectable } from "@angular/core";
import { HttpService  } from "src/app/services/http/http.service";
@Injectable({providedIn: 'root'})
export class TaxService{
    constructor(private http: HttpService){}
    getTaxs(){
        return this.http.get_tax();
    }
    getTax(id:number){
        return this.http.get_particular_tax(id);
    }
    addTax(fd: FormData){
        return this.http.add_tax(fd);
    }
    updateTax(fd: FormData){
        return this.http.update_tax(fd);
    }
}