import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MiscellaneousRoutingModule } from './miscellaneous-routing.module';
import { MiscellaneousComponent } from './miscellaneous.component';
import { EditComponent } from './edit/edit.component';
import { ViewComponent } from './view/view.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MiscellaneousComponent,
    EditComponent,
    ViewComponent
  ],
  imports: [
    CommonModule,
    MiscellaneousRoutingModule,
    FormsModule
  ]
})
export class MiscellaneousModule { }
