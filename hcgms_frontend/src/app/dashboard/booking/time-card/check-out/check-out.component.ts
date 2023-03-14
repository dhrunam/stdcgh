import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from 'src/app/services/local-storage-service/local-storage.service';
import { TimeCardService } from 'src/app/services/timecard-service/timecard.service';

@Component({
  selector: 'app-check-out',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent {
  send_data: any = [];
  todayDate: string = '';
  bookingId:string = '';
  resv_id: string = '';
  date = new Date();
  checkout_data: any = [];
  rooms:any = [];
  property: string = '';
  showResv: boolean = false;
  constructor(private localStorageService: LocalStorageService, private timeCardService: TimeCardService){
    this.property = localStorageService.getPropertyId();
  }
  ngOnInit():void{
     this.todayDate = `${this.date.getFullYear()}-${this.date.getMonth()< 10 ? '0':''}${this.date.getMonth()+1}-${this.date.getDate()< 10 ? '0':''}${this.date.getDate()}`;
    // this.todayDate = `${this.date.getFullYear()}-${this.date.getMonth()< 10 ? '0':''}${this.date.getMonth()+1}-05`;
    this.getBooking();
  }
  onGetRooms(r_id:string,booking_id:string, data: any){
    this.resv_id = r_id;
    this.bookingId = booking_id;
    this.rooms = data;
  }
  // onCheckout(room_id: number, id:number){
  onCheckout(){
    let fd = new FormData();
    fd.append('rooms', JSON.stringify(this.send_data));
    fd.append('reservation', this.send_data[0]['reservation']);
    this.timeCardService.on_checkout(fd).then((d:any) => {
      this.getBooking();
    });;
  }
  selectAll(event: any){
    this.send_data = [];
    var ele:any = document.getElementsByName('chk');
    if(event.target.checked){
      for (var i = 0; i < ele.length; i++) {
        if (ele[i].type == 'checkbox')
            ele[i].checked = true;
      }
      this.rooms.forEach((data:any) => {
        let details = {
          'property': this.property,
          'reservation': this.resv_id,
          'room': data.related_room.id,
          'checkout_date': this.todayDate,
        }
        this.send_data.push(details);
      })
    }
    else{
      for (var i = 0; i < ele.length; i++) {
        if (ele[i].type == 'checkbox')
            ele[i].checked = false;
      }
      this.send_data = [];
    }
  }
  onChangeEvent(event:any, room_id:number){
    if(event.target.checked){
      let details = {
        'property': this.property,
        'reservation': this.resv_id,
        'room': room_id,
        'checkout_date': this.todayDate,
      }
      this.send_data.push(details);
    }
    else{
      const index = this.send_data.findIndex((obj:any) => obj.room === room_id);
      this.send_data.splice(index,1);
      var ele:any = document.getElementById('selectAll');
      ele.checked = false;
    }
  }
  getBooking(){
    this.timeCardService.get_checkout_reservations(this.todayDate).then((d:any) => {
      this.showResv = d[0] ? true : false;
      this.checkout_data = d;
    });
  }
}
