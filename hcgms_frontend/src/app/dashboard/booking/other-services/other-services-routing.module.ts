import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditComponent } from './edit/edit.component';
import { ViewComponent } from './view/view.component';
import { OtherServicesComponent } from './other-services.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard/other-service/view', pathMatch: 'full'},
  { path: '', component: OtherServicesComponent, children: [
      { path: 'view', component: ViewComponent},
      { path: 'new', component: EditComponent},
      { path: ':id/edit', component: EditComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtherServicesRoutingModule { }
