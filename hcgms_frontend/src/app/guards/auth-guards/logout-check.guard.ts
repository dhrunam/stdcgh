import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'src/app/services/local-storage-service/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class LogoutCheckGuard implements CanActivate {
  constructor(private localStorageService: LocalStorageService, private router: Router, private route: ActivatedRoute){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(!this.localStorageService.getToken()){
      return true;
    }
    this.router.navigate(['/dashboard'], { relativeTo: this.route});
    return false;
  }
  
}
