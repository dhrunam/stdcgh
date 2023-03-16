import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeCardService } from 'src/app/services/time-card/time-card.service';
import { CancelService } from './cancel.service';
@Component({
  selector: 'app-cancel',
  templateUrl: './cancel.component.html',
  styleUrls: ['./cancel.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CancelComponent {
  date: string = '';
  checkin_data: any = [];
  rooms:any = [];
  property: string = '';
  send_data: any = [];
  showCheckIn: boolean = false;
  showData: string = '';
  constructor(private cancelService: CancelService, private timeCardService: TimeCardService){}
  ngOnInit():void{}
  onCancel(r_id:number){
    let fd = new FormData();
    fd.append('id', r_id.toString());
    fd.append('operation', 'cancelled');
    this.cancelService.on_cancellation(fd).subscribe({
      next: () => this.getBooking(),
    });
  }
  getBooking(){
    this.timeCardService.get_checkin_reservations(this.date).subscribe({
      next: data => {
        this.showData = data[0] ? 'true' : 'false';
        this.checkin_data = data;
      }
    })
  }
}
