import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpHeaders
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private localStorageService: LocalStorageService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let auth = request;
    const token = this.localStorageService.getToken();
    if(token !=null){
      auth = request.clone({ headers: new HttpHeaders(`Authorization: Token ${token}` )})
    }
    return next.handle(auth).pipe(catchError((err:any)=>{
      if(err.error.detail == 'Invalid token.' || err.error.detail == 'The given token has expired.'){
        alert('Session Expired !! Please login again');
        window.location.href = '/';
        this.localStorageService.clearSession();
      }
      return throwError(() => err);
    }));
  }
}

export const tokenInterceptor = [{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}];
