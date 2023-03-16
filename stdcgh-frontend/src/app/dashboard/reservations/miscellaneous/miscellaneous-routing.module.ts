import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditComponent } from './edit/edit.component';
import { MiscellaneousComponent } from './miscellaneous.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard/reservations/miscellaneous/view', pathMatch: 'full'},
  { path: '', component: MiscellaneousComponent, children: [
      { path: 'view', component: ViewComponent},
      { path: 'view/:id', component: EditComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MiscellaneousRoutingModule { }
