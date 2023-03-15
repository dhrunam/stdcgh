import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditComponent } from './edit/edit.component';
import { RoomCategoryComponent } from './room-category.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard/masters/category/view', pathMatch: 'full'},
  { path: '', component: RoomCategoryComponent, children: [
      { path: 'add', component: EditComponent },
      { path: 'view', component: ViewComponent },
      { path: 'edit/:id', component: EditComponent},
    ] 
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomCategoryRoutingModule { }
