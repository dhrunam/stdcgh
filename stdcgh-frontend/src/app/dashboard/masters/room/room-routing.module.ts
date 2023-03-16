import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditComponent } from './edit/edit.component';
import { RoomComponent } from './room.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard/masters/room/view', pathMatch: 'full'},
    { path: '', component: RoomComponent, children: [
        { path: 'view', component: ViewComponent},
        { path: 'add', component: EditComponent},
        { path: 'edit/:id', component: EditComponent}
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomRoutingModule { }
