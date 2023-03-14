import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RoomService } from '../room.service';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent {
  properties: any = [];
  categories: any = [];
  editMode: boolean = false;
  id:number = 0;
  room_no: string = '';
  occupancy: string = '';
  description: string = '';
  property_id: string = 'N/A';
  room_category_id: string = 'N/A';
  room_is_operational: boolean = false;
  showSuccess:string = '';
  private subscription!: Subscription;
  constructor(private roomService: RoomService, private router: Router, private route: ActivatedRoute){}
  ngOnInit():void{
    this.subscription = this.route.params.subscribe((data: Params) => {
      this.editMode = data['id'] != null;
      if(this.editMode){
        this.roomService.get_room(data['id']).then((d:any) => {
          this.id = d.id;
          this.room_no = d.room_no;
          this.occupancy = d.occupancy;
          this.description = d.description;
          this.property_id = d.property;
          this.room_category_id = d.room_category;
        })
      }
    });
    this.roomService.get_properties().then((d:any) => { this.properties = d } );
    this.roomService.get_room_categories().then((d:any) => { this.categories = d } );
  }
  onGoBack(){
    this.editMode ? this.router.navigate(['../../'], {relativeTo: this.route}) : this.router.navigate(['../'], {relativeTo: this.route});
  }
  onAddRoom(data:any){
    if(!data.valid){
      data.control.markAllAsTouched();
    }
    else{
      if(this.property_id === 'N/A' && this.room_category_id === 'N/A'){
        alert('Please select a guest house and a room category');
      }
      else if(this.property_id === 'N/A' || this.room_category_id === 'N/A'){
        if(this.property_id === 'N/A'){
          alert('Please select a guest house');
        }
        else{
          alert('Please select a room category');
        }
      }
      else{
        let fd = new FormData();
        fd.append('room_no', this.room_no);
        fd.append('occupancy', this.occupancy);
        fd.append('description', this.description);
        fd.append('property', this.property_id);
        fd.append('room_category', this.room_category_id);
        fd.append('is_operational', 'true');
        this.roomService.add_room(fd).then((d:any) => {
          this.showSuccess = d.error ? 'false' : 'true';
        });
      }
    }
  }
  onUpdateRoom(data: any){
    if(!data.valid){
      data.control.markAllAsTouched();
    }
    else{
      if(this.property_id === 'N/A' && this.room_category_id === 'N/A'){
        alert('Please select a guest house and a room category');
      }
      else if(this.property_id === 'N/A' || this.room_category_id === 'N/A'){
        if(this.property_id === 'N/A'){
          alert('Please select a guest house');
        }
        else{
          alert('Please select a room category');
        }
      }
      else{
        let fd = new FormData();
        fd.append('id', this.id.toString());
        fd.append('room_no', this.room_no);
        fd.append('occupancy', this.occupancy);
        fd.append('description', this.description);
        fd.append('property', this.property_id);
        fd.append('room_category', this.room_category_id);
        fd.append('is_operational', 'true');
        this.roomService.update_room(fd).then((d:any) => {
          this.showSuccess = d.error ? 'false' : 'true';
        });;
      }
    }
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
