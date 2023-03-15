import { NgModule } from '@angular/core';
import { BillingComponent } from './billing/billing.component';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { CheckinComponent } from './checkin/checkin.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { RouterModule, Routes } from '@angular/router';
import { UtilitiesModule } from 'src/app/utilities/utilities.module';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BookingModule } from './booking/booking.module';

const routes: Routes = [
  { path: 'booking', loadChildren: () => import('./booking/booking.module').then(m => m.BookingModule) },
  { path: 'checkin', loadComponent: () => import('./checkin/checkin.component').then(c => c.CheckinComponent) },
  { path: 'checkout', loadComponent: () => import('./checkout/checkout.component').then(c => c.CheckoutComponent) },
  { path: 'billing', loadComponent: () => import('./billing/billing.component').then(c => c.BillingComponent) },
  { path: 'miscellaneous', loadChildren: () => import('./miscellaneous/miscellaneous.module').then(m => m.MiscellaneousModule)},
]

@NgModule({
  imports: [
    BillingComponent,
    CheckinComponent,
    CheckoutComponent,
    UtilitiesModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    DatePipe
  ]
})
export class ReservationsModule { }
