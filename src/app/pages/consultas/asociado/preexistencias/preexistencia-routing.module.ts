import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PreexistenciasComponent } from './preexistencias.component';
import { ActualizarPreexistenciaComponent } from './actualizar-preexistencia/actualizar-preexistencia.component';
import { HistoricoPreexistenciaComponent } from './historico-preexistencia/historico-preexistencia.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { ScopeGuard } from '@core/guards/scope.guard';
import { CodigosMenu } from '@shared/static/urls/codigos-menu';
import { CodigosPermisos } from '@shared/static/urls/codigos-permisos';

const routes: Routes = [
  {
    path: '',
    component: PreexistenciasComponent,
    canActivate: [ScopeGuard],
    data: {
      codigos: [CodigosMenu.CONSULTAS,
      CodigosMenu.CONSULTAS_ASOCIADOS,
      CodigosMenu.CONSULTAS_ASOCIADOS_PREEXISTENCIAS], permisos: [CodigosPermisos.CONSULTAR]
    }
  },
  {
    path: ':preCod',
    component: ActualizarPreexistenciaComponent,
    canActivate: [ScopeGuard],
    data: {
      codigos: [CodigosMenu.CONSULTAS,
      CodigosMenu.CONSULTAS_ASOCIADOS,
      CodigosMenu.CONSULTAS_ASOCIADOS_PREEXISTENCIAS], permisos: [CodigosPermisos.EDITAR]
    }
  },
  {
    path: ':preCod/' + UrlRoute.PREEXISTENCIAS_HISTORICO,
    component: HistoricoPreexistenciaComponent,
    canActivate: [ScopeGuard],
    data: {
      codigos: [CodigosMenu.CONSULTAS,
      CodigosMenu.CONSULTAS_ASOCIADOS,
      CodigosMenu.CONSULTAS_ASOCIADOS_PREEXISTENCIAS], permisos: [CodigosPermisos.CONSULTAR]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreexistenciasRoutingModule { }
