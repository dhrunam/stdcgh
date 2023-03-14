import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoomRateRoutingModule } from './room-rate-routing.module';
import { RoomRateComponent } from './room-rate.component';
import { EditComponent } from './edit/edit.component';
import { ViewComponent } from './view/view.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    RoomRateComponent,
    EditComponent,
    ViewComponent
  ],
  imports: [
    CommonModule,
    RoomRateRoutingModule,
    FormsModule
  ]
})
export class RoomRateModule { }
