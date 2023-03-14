import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { LocalStorageService } from 'src/app/services/local-storage-service/local-storage.service';
import {catchError} from "rxjs/operators";
import { ActivatedRoute, Router } from '@angular/router';
const TOKEN_HEADER_KEY = 'Authorization';
@Injectable()
export class TokenInterceptorInterceptor implements HttpInterceptor {

  constructor(private local_storage: LocalStorageService, private router: Router, private route: ActivatedRoute) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    let authReq = request;
    const token = this.local_storage.getToken();
    if (token != null) {
      authReq = request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Token ' + token) });
    }
    return next.handle(authReq).pipe(catchError((err:any)=>{
      if(err.error.detail == 'Invalid token.' || err.error.detail == 'The given token has expired.'){
        alert('Session Expired !! Please login again');
        window.location.href = '/';
        this.local_storage.clearSession();
      }
      return throwError(() => err);
    }));
  }
}
export const tokenInterceptor = [
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorInterceptor, multi: true }
];
