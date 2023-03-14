import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service/auth-service';
import { LocalStorageService } from 'src/app/services/local-storage-service/local-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  username:string = '';
  constructor(private authService: AuthService, private localStorageService: LocalStorageService){
    this.username = this.localStorageService.getUserName();
  }

  onLogout(){
    this.authService.logout();
  }
}
