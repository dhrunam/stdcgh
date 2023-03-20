import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  name: string = '';
  constructor(private authService: AuthService, private localStorageService: LocalStorageService){}
  ngOnInit(): void{
    this.name = this.localStorageService.getUsername();
  }
  onLogout(){
    this.authService.onLogout().subscribe({
      next: () => window.location.href = '/login',
    });
  }
}
