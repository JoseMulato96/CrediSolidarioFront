import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ProductoDetalleService } from './consultas/asociado/services/producto-detalle.service';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { UiKitComponent } from './ui-kit/ui-kit.component';
import { AsociadosVipService } from './administracion/asociados-vip/services/asociados-vip.service';

@NgModule({
  imports: [
    PagesRoutingModule,
    CommonModule,
    SharedModule
  ],
  declarations: [
    PagesComponent,
    UiKitComponent,
    HomeComponent,
    HeaderComponent,
  ],
  providers: [
    ProductoDetalleService,
    AsociadosVipService
  ]
})
export class PagesModule { }
