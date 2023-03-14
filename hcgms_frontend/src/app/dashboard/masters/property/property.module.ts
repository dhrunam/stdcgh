import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PropertyRoutingModule } from './property-routing.module';
import { PropertyComponent } from './property.component';
import { ViewComponent } from './view/view.component';
import { EditComponent } from './edit/edit.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PropertyComponent,
    ViewComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    PropertyRoutingModule,
    FormsModule
  ]
})
export class PropertyModule { }
