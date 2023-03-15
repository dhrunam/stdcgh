import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MiscellaneousComponent } from './miscellaneous.component';

const routes: Routes = [{ path: '', component: MiscellaneousComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MiscellaneousRoutingModule { }
