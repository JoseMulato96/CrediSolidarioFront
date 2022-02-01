import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsociadoComponent } from './asociado.component';
import { BeneficiariosAsociadosComponent } from './beneficiarios-asociados/beneficiarios-asociados.component';
import { NuevoBeneficiarioComponent } from './beneficiarios-asociados/nuevo-beneficiario/nuevo-beneficiario.component';
import { DatosAsociadoDetalleComponent } from './datos-asociados/datos-asociado-detalle/datos-asociado-detalle.component';
import { DatosAsociadosComponent } from './datos-asociados/datos-asociados.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { ScopeGuard } from '@core/guards/scope.guard';
import { CodigosMenu } from '@shared/static/urls/codigos-menu';
import { CodigosPermisos } from '@shared/static/urls/codigos-permisos';
import { ResponsablePagoComponent } from './responsable-pago/responsable-pago.component';

const routes: Routes = [
  { path: '', redirectTo: UrlRoute.CONSULTAS_ASOCIADO_DATOS_ASOCIADO, pathMatch: 'full' },
  {
    path: '',
    component: AsociadoComponent,
    children: [
      {
        path: UrlRoute.CONSULTAS_ASOCIADO_DATOS_ASOCIADO,
        component: DatosAsociadosComponent,
        canActivate: [ScopeGuard],
        data: {
          codigos: [CodigosMenu.CONSULTAS,
          CodigosMenu.CONSULTAS_ASOCIADOS,
          CodigosMenu.CONSULTAS_ASOCIADOS_DATOS_BASICOS], permisos: [CodigosPermisos.CONSULTAR]
        }
      },
      {
        path: UrlRoute.CONSULTAS_ASOCIADO_DATOS_DE_ASOCIADO_DETALLE,
        component: DatosAsociadoDetalleComponent
      },
      /* {
        path: UrlRoute.BENEFICIARIOS_ASOCIADO,
        loadChildren: './beneficiarios-asociados/beneficiarios-asociados.module#BeneficiariosAsociadosModule'
      }, */
      {
        path: UrlRoute.BENEFICIARIOS_ASOCIADO,
        component: BeneficiariosAsociadosComponent,
        canActivate: [ScopeGuard],
        data: {
          codigos: [CodigosMenu.CONSULTAS,
          CodigosMenu.CONSULTAS_ASOCIADOS,
          CodigosMenu.CONSULTAS_ASOCIADOS_BENEFICIARIOS], permisos: [CodigosPermisos.CONSULTAR]
        }
      },

      {
        path: UrlRoute.BENEFICIARIOS_ASOCIADO + '/' + UrlRoute.NUEVO_BENEFICIARIO,
        component: NuevoBeneficiarioComponent,
        canActivate: [ScopeGuard],
        data: {
          codigos: [CodigosMenu.CONSULTAS,
          CodigosMenu.CONSULTAS_ASOCIADOS,
          CodigosMenu.CONSULTAS_ASOCIADOS_BENEFICIARIOS], permisos: [CodigosPermisos.AGREGAR]
        }
      },
      {
        path: UrlRoute.BENEFICIARIOS_ASOCIADO + '/:idBeneficiario' + '/:tipoCod',
        component: NuevoBeneficiarioComponent,
        canActivate: [ScopeGuard],
        data: {
          codigos: [CodigosMenu.CONSULTAS,
          CodigosMenu.CONSULTAS_ASOCIADOS,
          CodigosMenu.CONSULTAS_ASOCIADOS_BENEFICIARIOS], permisos: [CodigosPermisos.EDITAR]
        }
      },
      {
        path: UrlRoute.PREEXISTENCIAS,
        loadChildren:
          () => import('./preexistencias/preexistencias.module').then(m => m.PreexistenciasModule),
        canActivate: [ScopeGuard],
        data: {
          codigos: [CodigosMenu.CONSULTAS,
          CodigosMenu.CONSULTAS_ASOCIADOS,
          CodigosMenu.CONSULTAS_ASOCIADOS_PREEXISTENCIAS], permisos: [CodigosPermisos.CONSULTAR]
        }
      },
      {
        path: UrlRoute.PROTECCIONES,
        loadChildren: () => import('./protecciones-asociados/protecciones-asociados.module').then(m => m.ProteccionesAsociadosModule),
        canActivate: [ScopeGuard],
        data: {
          preload: true,
          codigos: [CodigosMenu.CONSULTAS,
          CodigosMenu.CONSULTAS_ASOCIADOS,
          CodigosMenu.CONSULTAS_ASOCIADOS_PROTECCIONES], permisos: [CodigosPermisos.CONSULTAR]
        }
      },
      {
        path: UrlRoute.PROTECCIONES + '/:proCod',
        loadChildren: () => import('./protecciones-asociados/protecciones-asociados.module').then(m => m.ProteccionesAsociadosModule),
        canActivate: [ScopeGuard],
        data: {
          preload: true,
          codigos: [CodigosMenu.CONSULTAS,
          CodigosMenu.CONSULTAS_ASOCIADOS,
          CodigosMenu.CONSULTAS_ASOCIADOS_PROTECCIONES], permisos: [CodigosPermisos.CONSULTAR]
        }
      },
      {
        path: UrlRoute.FACTURACION_ASOCIADOS,
        loadChildren:
          () => import('./facturacion-asociados/facturacion-asociados.module').then(m => m.FacturacionAsociadosModule),
        canActivate: [ScopeGuard],
        data: {
          preload: true,
          codigos: [CodigosMenu.CONSULTAS,
          CodigosMenu.CONSULTAS_ASOCIADOS,
          CodigosMenu.CONSULTAS_ASOCIADOS_FACTURACION], permisos: [CodigosPermisos.CONSULTAR]
        }
      },
      {
        path: UrlRoute.GENERAL,
        loadChildren: () => import('./general/general.module').then(m => m.GeneralModule),
        canActivate: [ScopeGuard],
        data: {
          codigos: [CodigosMenu.CONSULTAS,
          CodigosMenu.CONSULTAS_ASOCIADOS,
          CodigosMenu.CONSULTAS_ASOCIADOS_GENERAL], permisos: [CodigosPermisos.CONSULTAR]
        }
      },
      {
        path: UrlRoute.RESPONSABLE_PAGO,
        component: ResponsablePagoComponent, canActivate: [ScopeGuard],
        data: {
          codigos: [CodigosMenu.CONSULTAS,
          CodigosMenu.CONSULTAS_ASOCIADOS,
          CodigosMenu.CONSULTAS_ASOCIADOS_GENERAL], permisos: [CodigosPermisos.CONSULTAR]
        }
      },
      {
        path: UrlRoute.ASEGURADO,
        component: ResponsablePagoComponent, canActivate: [ScopeGuard],
        data: {
          codigos: [CodigosMenu.CONSULTAS,
          CodigosMenu.CONSULTAS_ASOCIADOS,
          CodigosMenu.CONSULTAS_ASOCIADOS_GENERAL], permisos: [CodigosPermisos.CONSULTAR]
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsociadoRoutingModule { }
