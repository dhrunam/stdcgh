import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../users.service';
declare var bootstrap: any;
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent {
  users: any = [];
  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute){}
  ngOnInit(): void{
    this.getUser();
  }
  ngAfterViewInit(): void{
    // setTimeout(() => {
    //   const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    //   const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    // }, 200)
  }
  onRouteAddUser(){
    this.router.navigate(['../new'], { relativeTo: this.route } );
  }
  onRouteEditUser(id:number){
    this.router.navigate(['../',id,'edit'], { relativeTo: this.route } );
  }
  onDeleteUser(id:number){
    this.userService.delete_user(id)
    this.getUser();
  }
  getUser(){
    this.userService.get_users().then((d:any) => {
      this.users = d;
    })
  }
}
