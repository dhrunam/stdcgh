import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginCheckGuard } from './guards/auth-guards/login-check.guard';
import { LogoutCheckGuard } from './guards/auth-guards/logout-check.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [LoginCheckGuard] },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule), canActivate: [LogoutCheckGuard] },
  { path: '**', loadComponent: () => import('./page-not-found/page-not-found.component').then(c => c.PageNotFoundComponent)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
