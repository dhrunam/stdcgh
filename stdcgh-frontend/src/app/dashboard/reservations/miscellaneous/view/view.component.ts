import { Component ,OnInit} from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { MiscellaneousService } from '../miscellaneous.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  property: string= '';
  todayDate: string = '';
  date = new Date();
  showData:boolean = false;
  reservation_data: any = [];
  constructor(private localStorageService: LocalStorageService, private miscellaneousService: MiscellaneousService){
    this.property = localStorageService.getPropertyId();
  }
  ngOnInit():void{
    this.todayDate = `${this.date.getFullYear()}-${this.date.getMonth()< 10 ? '0':''}${this.date.getMonth()+1}-${this.date.getDate()< 10 ? '0':''}${this.date.getDate()}`;
   // this.todayDate = `${this.date.getFullYear()}-${this.date.getMonth()< 10 ? '0':''}${this.date.getMonth()+1}-05`;
    this.miscellaneousService.get_other_services_reservations().subscribe({
      next: data => {
        this.showData = data[0] ? true : false;
        this.reservation_data = data;
      }
    })
 }
}
