import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap, throwError } from "rxjs";
import { HttpService } from "../http/http.service";
import { LocalStorageService } from "../local-storage/local-storage.service";

export interface AuthResponse{
    token: string, 
    expiry: string,
    user: Array<any>
}
@Injectable({ providedIn: 'root'})
export class AuthService{
    constructor(private http: HttpService, private localStorageService: LocalStorageService){}
    onLogin(data:any){
        return this.http.login(data).pipe(
            catchError(this.handleError),
            tap(response => {
                this.localStorageService.saveUserDetails(response.token, response.expiry, response.user)
            })
        );
    }
    onLogout(){
        return this.http.logout().pipe(
            tap(() => this.localStorageService.clearSession())
        )
    }
    private handleError(errorResponse: HttpErrorResponse){
        let errMessage: string;
        if(errorResponse.error.non_field_errors[0]){
            errMessage = 'Invalid Credentials';
        }
        return throwError(() => errMessage)
    }
}