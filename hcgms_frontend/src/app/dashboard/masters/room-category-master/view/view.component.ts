import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomCategoryService } from '../room-category.service';
declare var bootstrap:any;
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent {
  categories: any = [];
  constructor(private router: Router, private route: ActivatedRoute, private roomCategoryService: RoomCategoryService){}
  ngOnInit(): void{
    this.getCategories();
  }
  ngAfterViewInit(): void{
    // setTimeout(() => {
    //   const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    //   const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    // }, 200)
  }
  onRouteAddRoomCategory(){
    this.router.navigate(['../new'], { relativeTo: this.route } );
  }
  onRouteEditRoomCategory(id:number){
    this.router.navigate(['../',id,'edit'], { relativeTo: this.route } );
  }
  onDeleteRoomCategory(id:number){
    this.roomCategoryService.delete_room_category(id);
    this.getCategories();
  }
  getCategories(){
    this.roomCategoryService.get_room_categories().then(d => this.categories = d);
  }
}
