import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { HeaderNavComponent } from './header-nav/header-nav.component';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from './loader/loader.component';



@NgModule({
  declarations: [
    SidebarComponent,
    HeaderComponent,
    HeaderNavComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    SidebarComponent,
    HeaderComponent,
    HeaderNavComponent,
    LoaderComponent
  ]
})
export class UtilitiesModule { }
