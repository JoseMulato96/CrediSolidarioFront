import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PortafolioAsociadosDetalleComponent } from './portafolio-asociados-detalle.component';
import { DetallePortafolioComponent } from './detalle-portafolio/detalle-portafolio.component';
import { FacturacionPortafolioComponent } from './facturacion-portafolio/facturacion-portafolio.component';
import { HistoricoPortafolioComponent } from './historico-portafolio/historico-portafolio.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { InactividadPortafolioComponent } from './inactividad-portafolio/inactividad-portafolio.component';

const routes: Routes = [
  {
    path: '',
    component: PortafolioAsociadosDetalleComponent,
    children: [
      {
        path: '',
        redirectTo: UrlRoute.DETALLE,
        pathMatch: 'full'
      },
      {
        path: UrlRoute.DETALLE,
        component: DetallePortafolioComponent
      },
      {
        path: UrlRoute.FACTURACION,
        component: FacturacionPortafolioComponent
      },
      {
        path: UrlRoute.INACTIVIDADES,
        component: InactividadPortafolioComponent
      },
      {
        path: UrlRoute.HISTORICO,
        component: HistoricoPortafolioComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortafolioAsociadosDetalleRoutingModule {}
