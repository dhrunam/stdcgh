import { NgModule } from '@angular/core';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { ViewComponent } from './view/view.component';
import { EditComponent } from './edit/edit.component';
import { FormsModule } from '@angular/forms';
import { UtilitiesModule } from 'src/app/utilities/utilities.module';


@NgModule({
  declarations: [
    UsersComponent,
    ViewComponent,
    EditComponent
  ],
  imports: [
    UtilitiesModule,
    UsersRoutingModule,
    FormsModule
  ]
})
export class UsersModule { }
