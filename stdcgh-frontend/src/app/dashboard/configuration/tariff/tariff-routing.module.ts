import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TariffComponent } from './tariff.component';

const routes: Routes = [{ path: '', component: TariffComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TariffRoutingModule { }
