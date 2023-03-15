import { Component } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';

@Component({
  selector: 'app-header-nav',
  templateUrl: './header-nav.component.html',
  styleUrls: ['./header-nav.component.css']
})
export class HeaderNavComponent {
  name:string = '';
  role: number = 0;
  constructor(private localStorageService: LocalStorageService){}
  ngOnInit():void{
    this.name = this.localStorageService.getUsername();
    this.role = this.localStorageService.getRole();
  }
}
