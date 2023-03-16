import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BookingService } from '../booking.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  @Output('switchHouses') houses = new EventEmitter<{status: boolean}>();
  todayDate: any;
  property: string = 'N/A';
  properties: any = [];
  constructor(private bookingService: BookingService, private datePipe: DatePipe){
    this.todayDate = this.datePipe.transform(new Date(), 'YYYY-MM-dd');
  }
  ngOnInit(): void{
    this.bookingService.getProperties().subscribe({
      next: data => this.properties = data,
    })
  }
  onSearchRooms(data: NgForm){
    if(!data.valid){
      data.control.markAllAsTouched();
    }
    else{
      if(data.value.start_date > data.value.end_date){
        alert('Invalid Date Range');
      }
      else if(this.property === 'N/A'){
        alert('Please select a guest house')
      }
      else{
        let days:number = this.daysBetween(data.value.start_date, data.value.end_date)
        this.bookingService.search_rooms(data.value.start_date, data.value.end_date, data.value.property_id).subscribe({
          next: d => {
            if(!d[0]){
              this.houses.emit({status: false});
            }
            else{
              this.bookingService.results.next({data: d, checkin_date: data.value.start_date, checkout_date: data.value.end_date, property: data.value.property_id, days: days});
              this.houses.emit({status: true});
            }
          }
        })
      } 
    } 
  }
  daysBetween(startDate: any, endDate: any) {
    const date_1 = new Date(startDate);
    const date_2 = new Date(endDate);
    let difference = date_2.getTime() - date_1.getTime();
    let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
    return TotalDays;
  }
}
