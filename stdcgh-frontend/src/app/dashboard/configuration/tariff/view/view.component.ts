import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TariffService } from '../tariff.service';
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent {
  showLoader: boolean = false;
  room_rates: any = [];
  constructor(private tariffService: TariffService, private router: Router, private route: ActivatedRoute){}

  ngOnInit():void{
    this.getRoomRates();
  }
  onRouteAddRoomTariff(){
    this.router.navigate(['../add'], { relativeTo: this.route } );
  }
  onRouteEditRoomTariff(id:number){
    this.router.navigate(['../','edit',id], { relativeTo: this.route } );
  }
  onDeleteRoomTariff(id:number){
    this.tariffService.delete_room_rate(id).subscribe({
      next: () => this.getRoomRates(),
    });
  }
  getRoomRates(){
    this.showLoader = true;
    this.tariffService.get_room_rates().subscribe({
      next: data => {
        this.room_rates = data;
        this.showLoader = false;
      }
    })
  }
}
