import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard/home', pathMatch: 'full'},
  {
    path: '', component: DashboardComponent, children:[
      { path: 'home', loadComponent: () => import('./home/home.component').then(c => c.HomeComponent)},
      { path: 'booking', loadChildren: () => import('./booking/booking.module').then(m => m.BookingModule) },
      { path: 'modify', loadChildren: () => import('./modify/modify.module').then(m => m.ModifyModule) },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
