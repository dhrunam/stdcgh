import { NgModule } from '@angular/core';
import { SearchComponent } from './search/search.component';
import { HousesComponent } from './houses/houses.component';
import { DetailsComponent } from './details/details.component';
import { AcknowledgementComponent } from './acknowledgement/acknowledgement.component';
import { UtilitiesModule } from 'src/app/utilities/utilities.module';
import { BookingComponent } from './booking.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    BookingComponent,
    SearchComponent,
    HousesComponent,
    DetailsComponent,
    AcknowledgementComponent,
  ],
  imports: [
    UtilitiesModule,
    FormsModule,
    RouterModule.forChild([{path: '', component: BookingComponent}])
  ],
})
export class BookingModule { }
