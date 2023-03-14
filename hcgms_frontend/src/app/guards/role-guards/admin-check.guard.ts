import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'src/app/services/local-storage-service/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AdminCheckGuard implements CanActivateChild {
  constructor(private localStorageService: LocalStorageService, private router: Router, private route: ActivatedRoute){}
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.localStorageService.getRoleId() === 1 || this.localStorageService.getRoleId() === 2 || this.localStorageService.getRoleId() === 4){
      return true;
    }
    alert('Restricted Access to this page');
    this.router.navigate(['/dashboard'], { relativeTo: this.route});
    return false;  
  }
}
