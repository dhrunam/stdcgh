import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TariffRoutingModule } from './tariff-routing.module';
import { TariffComponent } from './tariff.component';


@NgModule({
  declarations: [
    TariffComponent
  ],
  imports: [
    CommonModule,
    TariffRoutingModule
  ]
})
export class TariffModule { }
