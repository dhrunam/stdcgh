import { NgModule } from '@angular/core';
import { RoomRoutingModule } from './room-routing.module';
import { RoomComponent } from './room.component';
import { ViewComponent } from './view/view.component';
import { EditComponent } from './edit/edit.component';
import { UtilitiesModule } from 'src/app/utilities/utilities.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    RoomComponent,
    ViewComponent,
    EditComponent
  ],
  imports: [
    UtilitiesModule,
    RoomRoutingModule,
    FormsModule
  ]
})
export class RoomModule { }
