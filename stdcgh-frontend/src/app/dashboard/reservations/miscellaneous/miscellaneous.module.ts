import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MiscellaneousRoutingModule } from './miscellaneous-routing.module';
import { MiscellaneousComponent } from './miscellaneous.component';


@NgModule({
  declarations: [
    MiscellaneousComponent
  ],
  imports: [
    CommonModule,
    MiscellaneousRoutingModule
  ]
})
export class MiscellaneousModule { }
