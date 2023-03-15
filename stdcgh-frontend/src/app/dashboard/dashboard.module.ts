import { NgModule } from '@angular/core';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { UtilitiesModule } from '../utilities/utilities.module';
import { HomeComponent } from './home/home.component';


@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent
  ],
  imports: [
    UtilitiesModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
