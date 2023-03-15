import { NgModule } from '@angular/core';
import { BillingComponent } from './billing/billing.component';
import { BookingComponent } from './booking/booking.component';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { CheckinComponent } from './checkin/checkin.component';
import { CheckoutComponent } from './checkout/checkout.component';
@NgModule({
  imports: [
    MiscellaneousModule,
    BillingComponent,
    BookingComponent,
    CheckinComponent,
    CheckoutComponent
  ],
})
export class ReservationsModule { }
