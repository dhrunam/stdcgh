import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { ReservationService } from '../reservation.service';

@Component({
  selector: 'app-houses',
  templateUrl: './houses.component.html',
  styleUrls: ['./houses.component.css']
})
export class HousesComponent {
  @Output('switchDetails') details = new EventEmitter<{status: boolean}>();
  results: any = [];
  rooms: any = [];
  checkin_date!: Date;
  checkout_date!: Date;
  buffer: number = 0;
  totalCost: number = 0;
  property: number = 0;
  listRooms: boolean = false;
  days:number = 0;
  roomDetails !: {property: number, checkin_date: Date, checkout_date: Date, rooms: Array<any>};
  constructor(private reservationService: ReservationService, private cdr: ChangeDetectorRef){}
  ngOnInit(): void{
    this.reservationService.results.subscribe({
      next: data => {
        setTimeout(() => {
          this.listRooms = data.data[0] ? true : false;
          this.results = data.data;
          this.checkin_date = data.checkin_date;
          this.checkout_date = data.checkout_date;
          this.property = data.property;
          this.days = data.days;
        },500);
      },
      error: err => console.log(err), 
    })
  }
  ngAfterViewChecked(){
    this.totalCost += this.buffer;
    this.cdr.detectChanges();
  }
  onStatusCheck(event: any, room_id:number, id:number, rate: number){
    if(event.target.checked){
      const data = {
        'room': room_id,
        'room_rate': rate,
        'days': this.days
      }
      this.rooms.push(data);
    }
    else{
      this.rooms.splice(this.rooms.indexOf(id),1);
    }
  }
  onEnterBookingDetails(){
    if(!this.rooms[0]){
      alert('Please select room(s) to continue');
    }
    else{
      this.roomDetails = { property: this.property, checkin_date: this.checkin_date, checkout_date: this.checkout_date, rooms: this.rooms};
      this.reservationService.roomDetails.next(this.roomDetails);
      this.details.emit({status: true});
    }
  }
}
