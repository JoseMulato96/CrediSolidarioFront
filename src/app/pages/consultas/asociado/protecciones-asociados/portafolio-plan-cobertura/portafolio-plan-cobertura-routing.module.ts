import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UrlRoute } from '@shared/static/urls/url-route';
import { PortafolioPlanCoberturaComponent } from './portafolio-plan-cobertura.component';
import { ScopeGuard } from '@core/guards/scope.guard';
import { CodigosMenu } from '@shared/static/urls/codigos-menu';
import { CodigosPermisos } from '@shared/static/urls/codigos-permisos';
import { MovimientosComponent } from './movimientos/movimientos.component';
import { PlanCoberturaComponent } from './plan-cobertura/plan-cobertura.component';
import { CotizacionPlanComponent } from './cotizacion-plan/cotizacion-plan.component';
import { GestionListasRestrictivasComponent } from './gestion-listas-restrictivas/gestion-listas-restrictivas.component';
import { VentaPlanComponent } from './venta-plan/venta-plan.component';
import { AuditoriaMedicaVentasComponent } from './auditoria-medica-ventas/auditoria-medica-ventas.component';
import { ResumenCoberturasVentaComponent } from './resumen-coberturas-venta/resumen-coberturas-venta.component';
import { DeclaracionSaludVisualComponent } from './declaracion-salud-visual/declaracion-salud-visual.component';
import { ValidacionManualListasRestrictivasComponent } from './validacion-manual-listas-restrictivas/validacion-manual-listas-restrictivas.component';
import { ResumenCoberturaCotizacionComponent } from './resumen-cobertura-cotizacion/resumen-cobertura-cotizacion.component';
import { GestionOperacionesComponent } from './gestion-operaciones/gestion-operaciones.component';
import { CanDeactivateGuard } from '@core/guards';
import { GestionAreaTecnicaComponent } from './gestion-area-tecnica/gestion-area-tecnica.component';
import { GestionAuxiliarMedicoComponent } from './gestion-auxiliar-medico/gestion-auxiliar-medico.component';
import { ActivarSolicitudesSuspendidasComponent } from './activar-solicitudes-suspendidas/activar-solicitudes-suspendidas.component';


const routes: Routes = [
  {
    path: '',
    component: PortafolioPlanCoberturaComponent,
    children: [
      {
        path: '',
        redirectTo: UrlRoute.PORTAFOLIO_BETA,
        pathMatch: 'full',
        canActivate: [ScopeGuard],
        data: {
          codigos: [CodigosMenu.CONSULTAS,
          CodigosMenu.CONSULTAS_ASOCIADOS,
          CodigosMenu.CONSULTAS_ASOCIADOS_PROTECCIONES,
          CodigosMenu.CONSULTAS_ASOCIADOS_PROTECCIONES_PORTAFOLIO],
          permisos: [CodigosPermisos.CONSULTAR]
        },
      },
      {
        path: '',
        component: PlanCoberturaComponent
      },
      {
        path: `${UrlRoute.AUDITORIA_MEDICA}/${UrlRoute.PROCESO}/:processInstanceId/${UrlRoute.TAREA}/:taskId`,
        component: AuditoriaMedicaVentasComponent
      },
      {
        path: `${UrlRoute.GESTION_AUXILIAR_MEDICO}/${UrlRoute.PROCESO}/:processInstanceId/${UrlRoute.TAREA}/:taskId`,
        component: GestionAuxiliarMedicoComponent
      },
      {
        path: `${UrlRoute.PORTAFOLIO_PLAN_COBERTURA_ACTIVAR_SOLICITUDES_SUSPENDIDAS}/${UrlRoute.PROCESO}/:processInstanceId`,
        component: ActivarSolicitudesSuspendidasComponent,
        canDeactivate: [CanDeactivateGuard]
      },

      {
        path: UrlRoute.PORTAFOLIO_PLAN_COBERTURA_MOVIMIENTOS,
        component: MovimientosComponent
      },
      {
        path: UrlRoute.PORTAFOLIO_PLAN_COBERTURA_COTIZACION_PLAN,
        component: CotizacionPlanComponent
      },
      {
        path: `${UrlRoute.PORTAFOLIO_PLAN_COBERTURA_COTIZACION_PLAN}/:codigo`,
        component: CotizacionPlanComponent
      },
      {
        path: `${UrlRoute.PORTAFOLIO_GESTION_LISTAS_RESTRICTIVAS}/${UrlRoute.PROCESO}/:processInstanceId/${UrlRoute.TAREA}/:taskId`,
        component: GestionListasRestrictivasComponent
      },
      {
        path: UrlRoute.PORTAFOLIO_PLAN_COBERTURA_VENTA_PLAN,
        component: VentaPlanComponent
      },
      {
        path: `${UrlRoute.PORTAFOLIO_PLAN_COBERTURA_VENTA_PLAN}/:codigo`,
        component: VentaPlanComponent
      },
      {
        path: `${UrlRoute.PORTAFOLIO_PLAN_COBERTURA_VENTA_PLAN}/${UrlRoute.PROCESO}/:processInstanceId/${UrlRoute.TAREA}/:taskId`,
        component: VentaPlanComponent
      },
      {
        path: `${UrlRoute.PORTAFOLIO_PLAN_COBERTURA_RESUMEN_VENTA_COBERTURAS}/:codigo`,
        component: ResumenCoberturasVentaComponent
      },
      {
        path: `${UrlRoute.PORTAFOLIO_PLAN_COBERTURA_RESUMEN_COTIZACION_COBERTURAS}/:codigo`,
        component: ResumenCoberturaCotizacionComponent
      },
      {
        path: `${UrlRoute.PORTAFOLIO_PLAN_COBERTURA_DECLARACION_SALUD_VISTA}/:codigo`,
        component: DeclaracionSaludVisualComponent
      },
      {
        path: `${UrlRoute.PORTAFOLIO_PLAN_COBERTURA_VALIDACION_MANUAL_LISTAS_RESTRICTIVAS}/${UrlRoute.PROCESO}/:processInstanceId/${UrlRoute.TAREA}/:taskId`,
        component: ValidacionManualListasRestrictivasComponent
      },
      {
        path: `${UrlRoute.GESTION_OPERACIONES}/${UrlRoute.PROCESO}/:processInstanceId/${UrlRoute.TAREA}/:taskId`,
        component: GestionOperacionesComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: `${UrlRoute.PORTAFOLIO_PLAN_COBERTURA_GESTION_AREA_TECNICA}/${UrlRoute.PROCESO}/:processInstanceId/${UrlRoute.TAREA}/:taskId`,
        component: GestionAreaTecnicaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortafolioPlanCoberturaRoutingModule { }
