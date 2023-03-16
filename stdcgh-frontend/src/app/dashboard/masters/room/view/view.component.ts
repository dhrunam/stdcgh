import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from '../room.service';
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent {
  rooms: any = [];
  showLoader: boolean = false;
  constructor(private roomService: RoomService, private router: Router, private route: ActivatedRoute){}
  ngOnInit():void{
    this.getRooms();
  }
  onRouteAddRoom(){
    this.router.navigate(['../add'], { relativeTo: this.route } );
  }
  onRouteEditRoom(id:number){
    this.router.navigate(['../','edit',id], { relativeTo: this.route } );
  }
  isOperational(id:string, status: string){
    let fd = new FormData();
    fd.append('id', id);
    fd.append('is_operational', status);
    this.roomService.room_is_operational(fd).subscribe({
      next: () => { this.getRooms()},
    });
  }
  getRooms(){
    this.showLoader = true;
    this.roomService.get_rooms().subscribe({
      next: data => {
        this.showLoader = false;
        this.rooms = data;
      }
    })
  }
  onDeleteRoom(id:number){
    this.roomService.delete_room(id).subscribe({
      next: () => this.getRooms(),
    });
  }
}
