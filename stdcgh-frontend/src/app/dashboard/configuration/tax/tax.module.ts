import { NgModule } from '@angular/core';
import { TaxRoutingModule } from './tax-routing.module';
import { TaxComponent } from './tax.component';
import { UtilitiesModule } from 'src/app/utilities/utilities.module';


@NgModule({
  declarations: [
    TaxComponent
  ],
  imports: [
    UtilitiesModule,
    TaxRoutingModule
  ]
})
export class TaxModule { }
