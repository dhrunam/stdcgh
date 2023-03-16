import { NgModule } from '@angular/core';
import { TariffRoutingModule } from './tariff-routing.module';
import { TariffComponent } from './tariff.component';
import { EditComponent } from './edit/edit.component';
import { ViewComponent } from './view/view.component';
import { UtilitiesModule } from 'src/app/utilities/utilities.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TariffComponent,
    EditComponent,
    ViewComponent
  ],
  imports: [
    UtilitiesModule,
    FormsModule,
    TariffRoutingModule
  ]
})
export class TariffModule { }
