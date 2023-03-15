import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditComponent } from './edit/edit.component';
import { PropertyComponent } from './property.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  {path: '', redirectTo: '/dashboard/masters/property/view', pathMatch: 'full'},
  { path: '', component: PropertyComponent,children: [
      { path: 'add', component: EditComponent},
      { path: 'view', component: ViewComponent },
      { path: 'edit/:id', component: EditComponent},
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PropertyRoutingModule { }
