import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'src/app/services/local-storage-service/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class LoginCheckGuard implements CanActivate {
  constructor(private localStroageService: LocalStorageService, private router: Router, private route: ActivatedRoute){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.localStroageService.getToken()){
      return true;
    }
    alert('Please login to continue');
    this.router.navigate(['/'], { relativeTo: this.route } )
    return false;
  }
  
}
