import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortafolioAsociadosDetalleRoutingModule } from './portafolio-asociados-detalle-routing.module';
import { DetallePortafolioComponent } from './detalle-portafolio/detalle-portafolio.component';
import { FacturacionPortafolioComponent } from './facturacion-portafolio/facturacion-portafolio.component';
import { PortafolioAsociadosDetalleComponent } from './portafolio-asociados-detalle.component';
import { HistoricoPortafolioComponent } from './historico-portafolio/historico-portafolio.component';
import { SharedModule } from '@shared/shared.module';
import { InactividadPortafolioComponent } from './inactividad-portafolio/inactividad-portafolio.component';

@NgModule({
  declarations: [
    PortafolioAsociadosDetalleComponent,
    DetallePortafolioComponent,
    FacturacionPortafolioComponent,
    InactividadPortafolioComponent,
    HistoricoPortafolioComponent
  ],
  imports: [
    CommonModule,
    PortafolioAsociadosDetalleRoutingModule,
    SharedModule
  ]
})
export class PortafolioAsociadosDetalleModule {}
