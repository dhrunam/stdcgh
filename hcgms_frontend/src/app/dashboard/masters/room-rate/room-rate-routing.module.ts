import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditComponent } from './edit/edit.component';
import { RoomRateComponent } from './room-rate.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard/room-rate/view', pathMatch: 'full'},
  { path: '', component: RoomRateComponent, children: [
      { path: 'view', component: ViewComponent},
      { path: 'new', component: EditComponent},
      { path: ':id/edit', component: EditComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomRateRoutingModule { }
