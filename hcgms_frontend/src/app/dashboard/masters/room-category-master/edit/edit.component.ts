import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RoomCategoryService } from '../room-category.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent {
  id:number = 0;
  room_category: string = '';
  editMode: boolean = false;
  showSuccess: string = '';
  private subscription!: Subscription;
  constructor(private router: Router, private route: ActivatedRoute, private roomCategoryService: RoomCategoryService){}
  ngOnInit(): void{
    this.subscription = this.route.params.subscribe((data: Params) => {
      this.editMode = data['id'] != null;
      if(this.editMode){
        this.roomCategoryService.get_room_category(data['id']).then((d:any) => {
          this.id = d.id;
          this.room_category = d.name;
        })
      }
    })
  }
  onAddRoomCategory(data: any){
    this.showSuccess = '';
    if(!data.valid){
      data.control.markAllAsTouched();
    }
    else{
      let fd = new FormData();
      fd.append('name', this.room_category);
      this.roomCategoryService.add_room_category(fd).then((d:any) => {
        this.showSuccess = d.error ? this.showSuccess = 'false' : this.showSuccess = 'true';
      });
    }
  }
  onEditRoomCategory(data:any){
    this.showSuccess = ''
    if(!data.valid){
      data.control.markAllAsTouched();
    }
    else{
      let fd = new FormData();
      fd.append('id', this.id.toString());
      fd.append('name', this.room_category);
      this.roomCategoryService.update_room_category(fd).then((d:any) => {
        this.showSuccess = d.error ? this.showSuccess = 'false' : this.showSuccess = 'true';
      });;
    }
  }
  onGoBack(){
    this.editMode ? this.router.navigate(['../../'], {relativeTo: this.route}) : this.router.navigate(['../'], {relativeTo: this.route});
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
