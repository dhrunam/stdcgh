import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../users.service';
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent {
  users: any = [];
  showLoader: boolean = false;
  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute){}
  ngOnInit(): void{
    this.getUser();
  }
  onRouteAddUser(){
    this.router.navigate(['../add'], { relativeTo: this.route } );
  }
  onRouteEditUser(id:number){
    this.router.navigate(['../','edit',id], { relativeTo: this.route } );
  }
  onDeleteUser(id:number){
    this.userService.delete_user(id).subscribe({
      next: () => this.getUser(),
    })
  }
  getUser(){
    this.showLoader = true;
    this.userService.get_users().subscribe({
      next: data => {
        this.showLoader = false;
        this.users = data;
      }
    })
  }
}
