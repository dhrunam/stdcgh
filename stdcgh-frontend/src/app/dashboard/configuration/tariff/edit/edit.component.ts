import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { TariffService } from '../tariff.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent {
  private subscription!: Subscription;
  showLoader: boolean = false;
  status: string = '';
  editMode: boolean = false;
  properties: any = [];
  rooms: any = [];
  id:number = 0;
  cost: string = '';
  start_date: string = '';
  end_date: string = '';
  property: string = 'N/A';
  property_name:string = '';
  room_no:string = '';
  room: string = 'N/A';
  constructor(private tariffService: TariffService, private router: Router, private route: ActivatedRoute){}
  ngOnInit():void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.editMode = data['id'] != null;
      if(this.editMode){
        this.showLoader = true;
        this.tariffService.get_room_rate(data['id']).subscribe({
          next: data => {
            this.showLoader = false;
            this.showLoader = false;
            this.cost = data.cost;
            this.start_date = data.start_date;
            this.end_date = data.end_date;
            this.property = data.related_property.id;
            this.room = data.related_room.id;
            this.property_name = data.related_property.name;
            this.room_no = data.related_room.room_no;
          }
        })
      }
    })
    this.tariffService.get_properties().subscribe({
      next: data => this.properties = data,
    })
  }
  onGetRooms(event:any){
    let property_id:number = parseInt(event.target.value);
    this.tariffService.get_rooms(property_id).subscribe({
      next: data => this.rooms = data,
    })
  }
  onSubmit(data: NgForm){
    this.status = '';
    let observable: Observable<any>;
    if(!data.valid){
      data.control.markAllAsTouched();
    }
    else{
      if(this.property === 'N/A' && this.room === 'N/A'){
        alert('Please select a guest house and a room');
      }
      else if(this.property === 'N/A' || this.room === 'N/A'){
        this.property === 'N/A' ? alert('Please select a guest house') : alert('Please select a room');
      }
      else{
        let fd = new FormData();
        fd.append('cost', data.value.c);
        fd.append('start_date', data.value.start);
        fd.append('end_date', data.value.end);
        fd.append('property', this.property);
        fd.append('room', this.room);
        if(this.editMode){
          fd.append('id', this.id.toString());
          observable = this.tariffService.update_room_rate(fd)
        }
        else{
          observable = this.tariffService.add_room_rate(fd)
        }
        this.subscription = observable.subscribe({
          next: data => {
            this.showLoader = false;
            this.status = 'success';
          },
          error: err => {
            this.showLoader = false;
            this.status = err;
          }
        })
      }
    }
  }
  onGoBack(){
    this.editMode ? this.router.navigate(['../../'], {relativeTo: this.route}) : this.router.navigate(['../'], {relativeTo: this.route});
  }
  ngOnDestroy(): void{
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }
}
