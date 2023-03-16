import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewComponent } from './view/view.component';
import { EditComponent } from './edit/edit.component';
import { TaxComponent } from './tax.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard/configurations/tax/view', pathMatch: 'full'},
  { path: '', component: TaxComponent, children: [
      { path: 'view', component: ViewComponent},
      { path: 'add', component: EditComponent},
      { path: 'edit/:id', component: EditComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxRoutingModule { }
