import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomRateService } from '../room-rate.service';
declare var bootstrap: any;
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent {
  room_rates: any = [];
  constructor(private roomRateService: RoomRateService, private router: Router, private route: ActivatedRoute){}

  ngOnInit():void{
    this.getRoomRates();
  }
  ngAfterViewInit(): void{
    // setTimeout(() => {
    //   const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    //   const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    // }, 200)
  }
  onRouteAddRoomTariff(){
    this.router.navigate(['../new'], { relativeTo: this.route } );
  }
  onRouteEditRoomTariff(id:number){
    this.router.navigate(['../',id,'edit'], { relativeTo: this.route } );
  }
  onDeleteRoomTariff(id:number){
    this.roomRateService.delete_room_rate(id);
    this.getRoomRates();
  }
  getRoomRates(){
    this.roomRateService.get_room_rates().then((d:any) => {
      this.room_rates = d;
    })
  }
}
