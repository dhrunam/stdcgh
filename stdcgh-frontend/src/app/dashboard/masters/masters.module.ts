import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PropertyModule } from "./property/property.module";
import { RoomCategoryModule } from "./room-category/room-category.module";
import { RoomModule } from "./room/room.module";
import { UsersModule } from "./users/users.module";

const routes: Routes = [
    { path: 'property', loadChildren: () => import('./property/property.module').then(m => m.PropertyModule)},
    { path: 'room', loadChildren: () => import('./room/room.module').then(m => m.RoomModule) },
    { path: 'category', loadChildren: () => import('./room-category/room-category.module').then(m => m.RoomCategoryModule) },
    { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
]

@NgModule({
    imports: [
        PropertyModule,
        RoomModule,
        RoomCategoryModule,
        UsersModule,
        RouterModule.forChild(routes)
    ]
})
export class MastersModule{}