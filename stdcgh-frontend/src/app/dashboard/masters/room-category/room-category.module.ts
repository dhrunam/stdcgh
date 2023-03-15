import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoomCategoryRoutingModule } from './room-category-routing.module';
import { RoomCategoryComponent } from './room-category.component';


@NgModule({
  declarations: [
    RoomCategoryComponent
  ],
  imports: [
    CommonModule,
    RoomCategoryRoutingModule
  ]
})
export class RoomCategoryModule { }
