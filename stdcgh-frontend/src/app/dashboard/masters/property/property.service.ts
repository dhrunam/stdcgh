import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { HttpService } from "src/app/services/http/http.service";
export interface Property{
    id?:number,
    name:string,
    short_name: string,
    address: string,
    description:string,
    code: string
}
@Injectable({providedIn: 'root'})
export class PropertyService{
    constructor(private http: HttpService){}
    get_properties(){
        return this.http.get_properties();
    }
    get_property(id:number){
        return this.http.get_property(id);
    }
    add_property(data:FormData){
        return this.http.add_property(data).pipe(catchError(this.handleError));
    }
    update_property(data:FormData){
        return this.http.update_property(data).pipe(catchError(this.handleError));
    }
    delete_property(data:FormData){
        return this.http.delete_property(data);
    }
    private handleError(errorResponse: HttpErrorResponse){
        console.log(errorResponse);
        let errMessage: string;
        if(errorResponse.error.code[0]){
            errMessage = 'Error !! Property already exists';
        }
        return throwError(() => errMessage)
    }
}