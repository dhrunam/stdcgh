import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModifyRoutingModule } from './modify-routing.module';
import { ModifyComponent } from './modify.component';


@NgModule({
  declarations: [
    ModifyComponent
  ],
  imports: [
    CommonModule,
    ModifyRoutingModule
  ]
})
export class ModifyModule { }
