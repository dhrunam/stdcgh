import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { TimeCardService } from 'src/app/services/time-card/time-card.service';
@Component({
  selector: 'app-check-in',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.css']
})
export class CheckinComponent {
  todayDate: string = '';
  bookingId:string = '';
  resv_id: string = '';
  date = new Date();
  checkin_data: any = [];
  rooms:any = [];
  property: string = '';
  send_data: any = [];
  showCheckIn: boolean = false;
  showData:boolean = false;
  constructor(private localStorageService: LocalStorageService, private timeCardService: TimeCardService){
    this.property = localStorageService.getPropertyId();
  }
  ngOnInit():void{
    // this.todayDate = `${this.date.getFullYear()}-${this.date.getMonth()< 10 ? '0':''}${this.date.getMonth()+1}-${this.date.getDate()< 10 ? '0':''}${this.date.getDate()}`;
    this.todayDate = `${this.date.getFullYear()}-${this.date.getMonth()< 10 ? '0':''}${this.date.getMonth()+1}-${this.date.getDate() < 10 ? '0':''}${this.date.getDate()}`;
    this.getBooking();
  }
  onGetRooms(r_id:string,booking_id:string, data: any){
    var ele:any = document.getElementById('selectAll');
    ele.checked = false;
    this.resv_id = r_id;
    this.bookingId = booking_id;
    this.rooms = data;
  }
  onCheckin(){
    let fd = new FormData();
    fd.append('rooms', JSON.stringify(this.send_data));
    this.timeCardService.on_checkin(fd).subscribe({
      next: () => this.getBooking(),
    })
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
          'checkin_date': this.todayDate,
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
    var ele:any = document.getElementById('selectAll');
    ele.checked = false;
    if(event.target.checked){
      let details = {
        'property': this.property,
        'reservation': this.resv_id,
        'room': room_id,
        'checkin_date': this.todayDate,
      }
      this.send_data.push(details);
    }
    else{
      const index = this.send_data.findIndex((obj:any) => obj.room === room_id);
      this.send_data.splice(index,1);
    }
  }
  getBooking(){
    this.timeCardService.get_checkin_reservations(this.todayDate).subscribe({
      next: data => {
        this.showData = data[0] ? true : false;
        this.checkin_data = data;
      },
    })
  }
}