import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GestionPlanComponent } from './gestion-plan.component';
import { UrlRoute } from '@shared/static/urls/url-route';

const routes: Routes = [
  {
    path: '',
    component: GestionPlanComponent,
    children: [
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLANES,
        loadChildren: () => import('./planes/planes.module').then(m => m.PlanesModule)
      },
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_CANAL_VENTAS_MOVIMIENTO,
        loadChildren: () => import('./canales-venta-movimientos/canales-venta-movimientos.module').then(m => m.CanalesVentaMovimientosModule)
      },
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_MEDIO_FACTURACION_PLAN,
        loadChildren: () => import('./medios-facturacion/medios-facturacion.module').then(m => m.MediosFacturacionModule)
      },
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_FRECUENCIA_FACTURACION_PLAN,
        loadChildren: () => import('./frecuencia-facturacion/frecuencia-facturacion.module').then(m => m.FrecuenciaFacturacionModule)
      },
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_NIVEL_RIESGO_PLAN,
        loadChildren: () => import('./nivel-riesgo-plan/nivel-riesgo-plan.module').then(m => m.NivelRiesgoPlanModule)
      },
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_CONTROL_AREA_TECNICA,
        loadChildren: () => import('./control-area-tecnica/control-area-tecnica.module').then(m => m.ControlAreaTecnicaModule)
      },
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PRODUCTOS_EXCLUYENTES,
        loadChildren: () => import('./productos-excluyentes/productos-excluyentes.module').then(m => m.ProductosExcluyentesModule)
      },
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_FORMULA_PLAN,
        loadChildren: () => import('./formula-plan/formula-plan.module').then(m => m.FormulaPlanModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionPlanRoutingModule { }
