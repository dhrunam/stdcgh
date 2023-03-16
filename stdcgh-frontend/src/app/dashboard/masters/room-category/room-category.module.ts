import { NgModule } from '@angular/core';
import { RoomCategoryRoutingModule } from './room-category-routing.module';
import { RoomCategoryComponent } from './room-category.component';
import { EditComponent } from './edit/edit.component';
import { ViewComponent } from './view/view.component';
import { UtilitiesModule } from 'src/app/utilities/utilities.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    RoomCategoryComponent,
    EditComponent,
    ViewComponent
  ],
  imports: [
    UtilitiesModule,
    RoomCategoryRoutingModule,
    FormsModule,
  ]
})
export class RoomCategoryModule { }
