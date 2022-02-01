import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GestionCoberturaComponent } from './gestion-cobertura.component';
import { UrlRoute } from '@shared/static/urls/url-route';

const routes: Routes = [
  {
    path: '',
    component: GestionCoberturaComponent,
    children: [
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_COBERTURAS,
        loadChildren: () => import('./coberturas/coberturas.module').then(m => m.CoberturasModule)
      },
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_BENEFICIARIO_PAGO,
        loadChildren: () => import('./beneficiario-pago/beneficiario-pago.module').then(m => m.BeneficiarioPagoModule)
      },
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_REQUISITOS_CONTROL_MEDICO,
        loadChildren: () => import('./requisitos-control-medico/requisitos-control-medico.module').then(m => m.RequisitosControlMedicoModule)
      },
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_NIVELES_RIESGO_COBERTURA,
        loadChildren: () => import('./niveles-riesgo-cobertura/niveles-riesgo-cobertura.module').then(m => m.NivelesRiesgoCoberturaModule)
      },
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_CONCEPTOS_FACTURACION,
        loadChildren: () => import('./concepto-facturacion/concepto-facturacion.module').then(m => m.ConceptoFacturacionModule)
      },
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_EXCLUSIONES_COBERTURA,
        loadChildren: () => import('./exclusiones-cobertura/exclusiones-cobertura.module').then(m => m.ExclusionesCoberturaModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionCoberturaRoutingModule { }
