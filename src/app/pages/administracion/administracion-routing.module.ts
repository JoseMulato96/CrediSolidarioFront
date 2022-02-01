import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuard } from '@core/guards';
import { ScopeGuard } from '@core/guards/scope.guard';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { CodigosMenu } from '@shared/static/urls/codigos-menu';
import { CodigosPermisos } from '@shared/static/urls/codigos-permisos';
import { UrlRoute } from '@shared/static/urls/url-route';
import { AdministracionComponent } from './administracion.component';
import { AsignacionPermisosComponent } from './asignacion-permisos-especiales/asignacion-permisos-especiales.component';
import { AsociadosVIPComponent } from './asociados-vip/asociados-vip.component';
import { CargueMasivoComponent } from './cargue-masivo/cargue-masivo.component';
import { ConfiguracionAsignacionGestionDiariaAutomaticaComponent } from './configuracion-asignacion-gestion-diaria-automatica/configuracion-asignacion-gestion-diaria-automatica.component';
import { ConfiguracionAsignacionGestionDiariaComponent } from './configuracion-asignacion-gestion-diaria/configuracion-asignacion-gestion-diaria.component';
import { AuditoriaEntidadComponent } from './configuracion-seguridad/auditoria-entidad/auditoria-entidad.component';
import { ConfiguracionSeguridadComponent } from './configuracion-seguridad/configuracion-seguridad.component';
import { LogNovedadesComponent } from './configuracion-seguridad/log-novedades/log-novedades.component';
import { ReasignacionOrdenesComponent } from './reasignacion-ordenes/reasignacion-ordenes.component';

const routes: Routes = [
  {
    path: '',
    component: AdministracionComponent,
    children: [
      {
        path: UrlRoute.ADMINSTRACION_PROTECCIONES,
        loadChildren: () => import('./protecciones/protecciones.module').then(m => m.ProteccionesModule)
      }
    ]
  },
  {
    path: UrlRoute.ADMINISTRACION_PARAMETRIZAR_CARTAS,
    loadChildren: () => import('./parametrizar-cartas/cartas.module').then(m => m.CartasModule)
  },
  {
    path: UrlRoute.ADMINISTRACION_PROCESOS_AUTOMATICOS,
    loadChildren: () => import('./procesos-automaticos/procesos-automaticos.module').then(m => m.ProcesosAutomaticosModule)
  },
  {
    path: UrlRoute.PARAMETROS_CONFIGURACION_OPERACIONES,
    loadChildren: () => import('./parametros-configuracion-operaciones/parametros-configuracion-operaciones.module').then(m => m.ParametrosConfiguracionOperacionesModule)
  },
  {
    path: UrlRoute.ADMINISTRACION_ASIGNACION_GESTION_DIARIA,
    loadChildren: () => import('./asignacion-gestion-diaria/asignacion-gestion-diaria.module').then(m => m.AsignacionGestionDiariaModule)
  },
  {
    path: UrlRoute.ADMINISTRACION_ASIGNACION_GESTION_DIARIA_BETA,
    loadChildren: () => import('./asignacion-gestion-diaria-beta/asignacion-gestion-diaria-beta.module').then(m => m.AsignacionGestionDiariaBetaModule)
  },
  {
    path: UrlRoute.ADMINISTRACION_GESTION_SOLICITUD_SUSPENDIDA,
    loadChildren: () => import('./gestion-solicitud-suspendida/gestion-solicitud-suspendida.module').then(m => m.GestionSolicitudSuspendidaModule)
  },
  {
    path: UrlRoute.ADMINISTRACION_ACTUARIA,
    loadChildren: () => import('./actuaria/actuaria.module').then(m => m.ActuariaModule)
  },
  {
    path: UrlRoute.ADMINISTRACION_FINANCIERA,
    loadChildren: () => import('./financiera/financiera.module').then(m => m.FinancieraModule)
  },
  {
    path: UrlRoute.ADMINSTRACION_COTIZADORES,
    loadChildren: () => import('./configuracion-cotizadores/configuracion-cotizadores.module').then(m => m.ConfiguracionCotizadoresModule)
  },
  {
    path: UrlRoute.ADMINISTRACION_APROBACION_FINAL,
    loadChildren: () => import('./aprobacion-final/aprobacion-final.module').then(m => m.AprobacionFinalModule)
  },
  {
    path: UrlRoute.ADMINISTRACION_GESTION_PROMOCIONES,
    loadChildren: () => import('./gestion-promociones/gestion-promociones.module').then(m => m.GestionPromocionesModule)
  },
  {
    path: UrlRoute.ADMINISTRACION_CONFIGURACION_ASIGNACION_GESTION_DIARIA,
    component: ConfiguracionAsignacionGestionDiariaComponent,
    canActivate: [ScopeGuard],
    data: {
      codigos: [
        CodigosMenu.ADMINISTRACION,
        CodigosMenu.MM_ADMIN_CONFIG_ASIGDIARIA], permisos: [
          CodigosPermisos.CONSULTAR,
          CodigosPermisos.EDITAR,
          CodigosPermisos.ELIMINAR,
          CodigosPermisos.AGREGAR
        ]
    }
  },
  {
    path: UrlRoute.ADMINISTRACION_CONFIGURACION_ASIGNACION_GESTION_DIARIA_AUTOMATICA,
    component: ConfiguracionAsignacionGestionDiariaAutomaticaComponent,
    canDeactivate: [CanDeactivateGuard],
    canActivate: [ScopeGuard],
    data: {
      codigos: [
        CodigosMenu.ADMINISTRACION,
        CodigosMenu.MM_ADMIN_CONFIG_ASIGDIARIA], permisos: [
          CodigosPermisos.CONSULTAR,
          CodigosPermisos.EDITAR,
          CodigosPermisos.ELIMINAR,
          CodigosPermisos.AGREGAR
        ]
    }
  },
  {
    path: UrlRoute.ADMINISTRACION_ASIGNACION_PERMISOS_ESPECIALES,
    component: AsignacionPermisosComponent
  },
  {
    path: UrlRoute.ASOCIADOS_VIP,
    component: AsociadosVIPComponent,
    canActivate: [ScopeGuard],
    data: {
      codigos: [
        CodigosMenu.ADMINISTRACION,
        CodigosMenu.ADMINISTRACION_ASOCIADOS_VIP], permisos: [CodigosPermisos.CONSULTAR]
    }
  },
  {
    path: UrlRoute.ADMINISTRACION_CARGUE_MASIVO,
    component: CargueMasivoComponent
  },
  {
    path: UrlRoute.ADMINISTRACION_CARGUES_MASIVOS_CALL_CENTER,
    loadChildren: () => import('./cargues-masivos-call-center/cargues-masivos-call-center.module').then(m => m.CarguesMasivosCallCenterModule)
  },
  {
    path: UrlRoute.ADMINISTRACION_REASIGNACION_ORDENES,
    component: ReasignacionOrdenesComponent
  },
  {
    path: UrlRoute.ADMINISTRACION_CONFIGURACION_SEGURIDAD, component: ConfiguracionSeguridadComponent,
    canActivate: [ScopeGuard],
    data: {
      codigos: [
        CodigosMenu.ADMINISTRACION,
        CodigosMenu.ADMINISTRACION_SEGURIDAD], permisos: [CodigosPermisos.CONSULTAR]
    },
    children: [
      {
        path: UrlRoute.ADMINISTRACION_CONFIGURACION_SEGURIDAD_LOG_NOVEDADES,
        component: LogNovedadesComponent
      },
      {
        path: UrlRoute.ADMINISTRACION_CONFIGURACION_SEGURIDAD_AUDITORIA,
        component: AuditoriaEntidadComponent
      },
      {
        path: '',
        redirectTo: UrlRoute.ADMINISTRACION_CONFIGURACION_SEGURIDAD_LOG_NOVEDADES,
        pathMatch: 'full'
      },
      {
        path: '**',
        component: NotFoundComponent
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionRoutingModule { }
