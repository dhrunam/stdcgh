import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../property.service';
declare var bootstrap: any;
declare var $:any;
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent{
  properties: any = [];
  constructor(private router: Router, private route: ActivatedRoute, private propertyService: PropertyService){}
  ngOnInit():void {
    this.getProperties();
  }
  onRouteAddProperty(){
    this.router.navigate(['../new'], { relativeTo: this.route});
  }
  onRouteEditProperty(id:number){
    this.router.navigate(['../',id,'edit'], { relativeTo: this.route});
  }
  onDeleteProperty(id:number, status: boolean){
    let fd = new FormData();
    fd.append('id', id.toString());
    fd.append('is_operational', status.toString())
    this.propertyService.delete_property(fd);
  }
  getProperties(){
    this.propertyService.get_properties().then(d => {
      this.properties = d;
    })
  }
}
