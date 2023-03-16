import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { BookingService } from '../booking.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-houses',
  templateUrl: './houses.component.html',
  styles: [`
    .na{
      color: red;
    }
    .av{
      color: green;
    }
  `]
})
export class HousesComponent {
  @Output('switchDetails') details = new EventEmitter<{status: boolean}>();
  showLoader: boolean = false;
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
  private subscription!: Subscription;
  constructor(private bookingService: BookingService, private cdr: ChangeDetectorRef){}
  ngOnInit(): void{
    this.showLoader = true;
    this.subscription = this.bookingService.results.subscribe({
      next: data => {
        setTimeout(() => {
          this.listRooms = data.data[0] ? true : false;
          this.results = data.data;
          this.checkin_date = data.checkin_date;
          this.checkout_date = data.checkout_date;
          this.property = data.property;
          this.days = data.days;
          this.showLoader = false;
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
      this.showLoader = true;
      this.roomDetails = { property: this.property, checkin_date: this.checkin_date, checkout_date: this.checkout_date, rooms: this.rooms};
      this.bookingService.roomDetails.next(this.roomDetails);
      setTimeout(() => {
        this.showLoader = false;
        this.details.emit({status: true});
      },500)
    }
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
