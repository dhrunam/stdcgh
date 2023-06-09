import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard/home', pathMatch: 'full'},
  { path: '', component: DashboardComponent, children: [
      { path: 'home', component: HomeComponent },
      { path: 'masters', loadChildren: () => import('./masters/masters.module').then(m => m.MastersModule) },
      { path: 'configurations', loadChildren: () => import('./configuration/configuration.module').then(m => m.ConfigurationModule) },
      { path: 'reservations', loadChildren: () => import('./reservations/reservations.module').then(m => m.ReservationsModule)},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
