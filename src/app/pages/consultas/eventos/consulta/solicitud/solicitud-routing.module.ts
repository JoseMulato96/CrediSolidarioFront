import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SolicitudComponent } from './solicitud.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { NotificarNegacionComponent } from './notificar-negacion/notificar-negacion.component';
import { RegistroComponent } from './registro/registro.component';
import { RadicarComponent } from './radicar/radicar.component';
import { AuditoriaMedicaComponent } from './auditoria-medica/auditoria-medica.component';
import { DefinicionPagoComponent } from './definicion-pago/definicion-pago.component';
import { ConceptoOtrasAreasComponent } from './concepto-otras-areas/concepto-otras-areas.component';
import { DatosEventoComponent } from './datos-evento/datos-evento.component';
import { ActivarComponent } from './activar/activar.component';
import { CanDeactivateGuard } from '@core/guards';
import { BitacoraComponent } from './bitacora/bitacora.component';

const routes: Routes = [
  {
    path: '',
    component: SolicitudComponent,
    children: [
      {
        path: '',
        component: RegistroComponent
      },
      {
        path: `:idProceso`,
        component: RegistroComponent
      },
      {
        path: `:idProceso/${UrlRoute.CONSULTAS_EVENTOS_CONSULTA_SOLICITUD_BITACORA}`,
        component: BitacoraComponent
      },
      {
        path: `:idProceso/${UrlRoute.CONSULTAS_EVENTOS_CONSULTA_SOLICITUD_BITACORA}/:tipoConsulta`,
        component: BitacoraComponent
      },
      {
        path: `:idProceso/${UrlRoute.CONSULTAS_EVENTOS_CONSULTA_SOLICITUD_RADICAR}`,
        component: RadicarComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: `:idProceso/${UrlRoute.CONSULTAS_EVENTOS_CONSULTA_SOLICITUD_AUDITORIA_MEDICA}`,
        component: AuditoriaMedicaComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: `:idProceso/${UrlRoute.CONSULTAS_EVENTOS_CONSULTA_SOLICITUD_NOTIFICAR_NEGACION}`,
        component: NotificarNegacionComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: `:idSubproceso/${UrlRoute.CONSULTAS_EVENTOS_CONSULTA_SOLICITUD_CONCEPTO_OTRAS_AREAS}`,
        component: ConceptoOtrasAreasComponent
      },
      {
        path: `:idProceso/${UrlRoute.CONSULTAS_EVENTOS_CONSULTA_SOLICITUD_DATOS_EVENTO}`,
        component: DatosEventoComponent
      },
      {
        path: `:idProceso/${UrlRoute.CONSULTAS_EVENTOS_CONSULTA_SOLICITUD_ACTIVAR}`,
        component: ActivarComponent
      },
      {
        path: `:idProceso/:rutaFaseFlujo`,
        component: DefinicionPagoComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitudRoutingModule { }
