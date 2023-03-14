import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoomCategoryMasterRoutingModule } from './room-category-master-routing.module';
import { RoomCategoryMasterComponent } from './room-category-master.component';
import { ViewComponent } from './view/view.component';
import { EditComponent } from './edit/edit.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    RoomCategoryMasterComponent,
    ViewComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    RoomCategoryMasterRoutingModule,
    FormsModule
  ]
})
export class RoomCategoryMasterModule { }
