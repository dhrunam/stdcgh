import { Component, EventEmitter, Output } from '@angular/core';
import { BookingService } from '../booking.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent {
  showLoader: boolean = false;
  private subscription!: Subscription;
  @Output('switchAck') ack = new EventEmitter<{status: boolean}>()
  roomDetails: any = [];
  constructor(private bookingService: BookingService){}
  ngOnInit(): void {
    this.subscription = this.bookingService.roomDetails.subscribe((d:any) => {
      this.roomDetails = d
    });
  }
  onConfirmReservation(data: NgForm){
    if(!data.valid){
      data.control.markAllAsTouched();
    }
    else{
      let fd = new FormData();
      fd.append('property',this.roomDetails.property);
      fd.append('lead_guest_name', data.value.guest_name);
      fd.append('reservation_for', data.value.resv_for);
      fd.append('reservation_from', data.value.resv_from);
      fd.append('address', data.value.address);
      fd.append('contact_no', data.value.contact);
      fd.append('remarks', data.value.remarks);
      fd.append('checkin_date', this.roomDetails.checkin_date);
      fd.append('checkout_date', this.roomDetails.checkout_date);
      fd.append('rooms', JSON.stringify(this.roomDetails.rooms));
      this.showLoader = true;
      setTimeout(() => {
        this.ack.emit({status: true});
        this.bookingService.confirm_reservation(fd).subscribe({
          next: (d:any) => {
            this.bookingService.acknowledgement.next(
              {
                reservation_no: d[0].reservation_no,
                checkin_date: d[0].checkin_date,
                checkout_date: d[0].checkout_date,
                contact_no: d[0].contact_no,
                guest_name: d[0].lead_guest_name,
                created_at: d[0].created_at,
                address: d[0].address,
                property: d[0].related_property.name,
                reservation_room_details: d[0].reservation_room_details,
                totalCost: d[0].total_room_cost,
                days: this.roomDetails.rooms
              }
            );
          }
        })
      }, 500)
    }
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
