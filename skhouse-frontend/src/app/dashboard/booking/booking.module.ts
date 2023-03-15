import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingRoutingModule } from './booking-routing.module';
import { BookingComponent } from './booking.component';
import { SelectRoomsComponent } from './select-rooms/select-rooms.component';


@NgModule({
  declarations: [
    BookingComponent,
    SelectRoomsComponent
  ],
  imports: [
    CommonModule,
    BookingRoutingModule
  ]
})
export class BookingModule { }
