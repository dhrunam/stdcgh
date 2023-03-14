import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from 'src/app/services/local-storage-service/local-storage.service';
import { TimeCardService } from 'src/app/services/timecard-service/timecard.service';
@Component({
  selector: 'app-check-in',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.css']
})
export class CheckInComponent {
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
    this.resv_id = r_id;
    this.bookingId = booking_id;
    this.rooms = data;
  }
  onCheckin(){
    let fd = new FormData();
    fd.append('rooms', JSON.stringify(this.send_data));
    this.timeCardService.on_checkin(fd).then((d:any) => {
      this.getBooking();
    });
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
      var ele:any = document.getElementById('selectAll');
      ele.checked = false;
    }
  }
  getBooking(){
    this.timeCardService.get_checkin_reservations(this.todayDate).then((d:any) => {
      this.showData = d[0] ? true : false;
      this.checkin_data = d;
    });
  }
}
