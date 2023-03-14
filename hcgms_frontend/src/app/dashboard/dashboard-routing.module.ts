import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminCheckGuard } from '../guards/role-guards/admin-check.guard';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard/home', pathMatch: 'full'},
  { path: '', component: DashboardComponent, children: [
      { path: 'home', loadComponent: () => import('./home/home.component').then(c => c.HomeComponent)},
      { path: 'users', loadChildren: () => import('./masters/users/users.module').then(m => m.UsersModule), canActivateChild: [AdminCheckGuard]},
      { path: 'property', loadChildren: () => import('./masters/property/property.module').then(m => m.PropertyModule), canActivateChild: [AdminCheckGuard]},
      { path: 'room-category', loadChildren: () => import('./masters/room-category-master/room-category-master.module').then(m => m.RoomCategoryMasterModule), canActivateChild: [AdminCheckGuard] },
      { path: 'room', loadChildren: () => import('./masters/room/room.module').then(m => m.RoomModule), canActivateChild: [AdminCheckGuard]},
      { path: 'room-rate', loadChildren: () => import('./masters/room-rate/room-rate.module').then(m => m.RoomRateModule), canActivateChild: [AdminCheckGuard] },
      { path: 'reservation', loadChildren: () => import('./booking/reservation/reservation.module').then(m => m.ReservationModule), canActivateChild: [AdminCheckGuard] },
      { path: 'check-in', loadComponent: () => import('./booking/time-card/check-in/check-in.component').then(c => c.CheckInComponent ) },
      { path: 'check-out', loadComponent: () => import('./booking/time-card/check-out/check-out.component').then(c => c.CheckOutComponent ) },
      { path: 'bill', loadComponent: () => import('./booking/billing/billing.component').then(c => c.BillingComponent)},
      { path: 'other-service', loadChildren: () => import('./booking/other-services/other-services.module').then(m => m.OtherServicesModule)},

    
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
