import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomCategoryService } from '../room-category.service';
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent {
  categories: any = [];
  showLoader: boolean = false;
  constructor(private router: Router, private route: ActivatedRoute, private roomCategoryService: RoomCategoryService){}
  ngOnInit(): void{
    this.getCategories();
  }
  onRouteAddRoomCategory(){
    this.router.navigate(['../add'], { relativeTo: this.route } );
  }
  onRouteEditRoomCategory(id:number){
    this.router.navigate(['../','edit',id], { relativeTo: this.route } );
  }
  onDeleteRoomCategory(id:number){
    this.roomCategoryService.delete_room_category(id).subscribe({
      next: () => {
        this.getCategories();
      }
    });
  }
  getCategories(){
    this.showLoader = true;
    this.roomCategoryService.get_room_categories().subscribe({
      next: data => {
        this.categories = data;
        this.showLoader = false;
      }
    })
  }
}
