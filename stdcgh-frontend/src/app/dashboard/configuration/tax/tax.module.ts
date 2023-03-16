import { NgModule } from '@angular/core';
import { TaxRoutingModule } from './tax-routing.module';
import { TaxComponent } from './tax.component';
import { UtilitiesModule } from 'src/app/utilities/utilities.module';
import { EditComponent } from './edit/edit.component';
import { ViewComponent } from './view/view.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TaxComponent,
    EditComponent,
    ViewComponent
  ],
  imports: [
    UtilitiesModule,
    TaxRoutingModule,
    FormsModule,
  ]
})
export class TaxModule { }
