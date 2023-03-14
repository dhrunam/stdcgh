import { Component, EventEmitter, Output } from '@angular/core';
import { ReservationService } from '../reservation.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  @Output('switchHouses') houses = new EventEmitter<{status: boolean}>();
  property: string = 'N/A';
  properties: any = [];
  constructor(private reservationService: ReservationService){}
  ngOnInit(): void{
    this.reservationService.getProperties().then((d:any) => this.properties = d);
  }
  onSearchRooms(data: any){
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
        this.reservationService.search_rooms(data.value.start_date, data.value.end_date, data.value.property_id).then((d:any) => {
          if(!d[0]){
            this.houses.emit({status: false});
          }
          else{
            this.reservationService.results.next({data: d, checkin_date: data.value.start_date, checkout_date: data.value.end_date, property: data.value.property_id, days: days});
            this.houses.emit({status: true});
          }
        });
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
