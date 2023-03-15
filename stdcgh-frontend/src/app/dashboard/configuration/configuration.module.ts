import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TariffModule } from "./tariff/tariff.module";
import { TaxModule } from "./tax/tax.module";

const routes: Routes = [
    { path: 'tax', loadChildren: () => import('./tax/tax.module').then(m => m.TaxModule)},
    { path: 'tariff', loadChildren: () => import('./tariff/tariff.module').then(m => m.TariffModule) },
]

@NgModule({
    imports: [
        TariffModule,
        TaxModule,
        RouterModule.forChild(routes)
    ]
})
export class ConfigurationModule{}