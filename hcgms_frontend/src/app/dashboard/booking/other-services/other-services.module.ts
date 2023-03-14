import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { OtherServicesComponent } from './other-services.component';
import { ViewComponent } from './view/view.component';
import { EditComponent } from './edit/edit.component';

import { OtherServicesRoutingModule } from './other-services-routing.module';

@NgModule({
  declarations: [
    OtherServicesComponent,
    ViewComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    OtherServicesRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class OtherServicesModule { }
