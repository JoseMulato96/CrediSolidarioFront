import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AjusteFacturacionComponent } from './ajuste-facturacion/ajuste-facturacion.component';
import { AjustefacturacionDetalleComponent } from './ajuste-facturacion-detalle/ajuste-facturacion-detalle.component';
import { CapitalPagadoFacturacionAsociadosComponent } from './capital-pagado-facturacion-asociados/capital-pagado-facturacion-asociados.component';
import { FacturacionAsociadosComponent } from './facturacion-asociados.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { RecaudosFacturacionAsociadosComponent } from './recaudos-facturacion-asociados/recaudos-facturacion-asociados.component';
import { MultiactivaFacturacionComponent } from './multiactiva-facturacion/multiactiva-facturacion.component';
import { SolidadaridadFacturacionComponent } from './solidaridad-facturacion/solidaridad-facturacion.component';
import { CuentasContablesFacturacionComponent } from './cuentas-contables-facturacion/cuentas-contables-facturacion.component';
import { CuentasContablesFacturacionDetalleComponent } from './cuentas-contables-facturacion/cuentas-contables-facturacion-detalle/cuentas-contables-facturacion-detalle';
import { ScopeGuard } from '@core/guards/scope.guard';
import { CodigosMenu } from '@shared/static/urls/codigos-menu';
import { CodigosPermisos } from '@shared/static/urls/codigos-permisos';

const routes: Routes = [
  {
    path: '',
    component: FacturacionAsociadosComponent,
    canActivate: [ScopeGuard],
    data: {
      codigos: [CodigosMenu.CONSULTAS,
      CodigosMenu.CONSULTAS_ASOCIADOS,
      CodigosMenu.CONSULTAS_ASOCIADOS_FACTURACION], permisos: [CodigosPermisos.CONSULTAR]
    },
    children: [
      {
        path: 'ajuste-facturacion',
        component: AjusteFacturacionComponent
      },
      {
        path: 'ajuste-facturacion-detalle/:id',
        component: AjustefacturacionDetalleComponent
      },
      {
        path: UrlRoute.FACTURACION_ASOCIADOS_CAPITAL_PAGADO,
        component: CapitalPagadoFacturacionAsociadosComponent,
        canActivate: [ScopeGuard],
        data: {
          codigos: [CodigosMenu.CONSULTAS,
          CodigosMenu.CONSULTAS_ASOCIADOS,
          CodigosMenu.CONSULTAS_ASOCIADOS_FACTURACION,
          CodigosMenu.CONSULTAS_ASOCIADOS_FACTURACION_CAPITAL_PAGADO], permisos: [CodigosPermisos.CONSULTAR]
        }
      },
      {
        path: UrlRoute.FACTURACION_ASOCIADOS_RECAUDOS,
        component: RecaudosFacturacionAsociadosComponent,
        canActivate: [ScopeGuard],
        data: {
          codigos: [CodigosMenu.CONSULTAS,
          CodigosMenu.CONSULTAS_ASOCIADOS,
          CodigosMenu.CONSULTAS_ASOCIADOS_FACTURACION,
          CodigosMenu.CONSULTAS_ASOCIADOS_FACTURACION_RECAUDOS], permisos: [CodigosPermisos.CONSULTAR]
        }
      },
      {
        path: UrlRoute.FACTURACION_ASOCIADOS_MULTIATIVA,
        component: MultiactivaFacturacionComponent,
        canActivate: [ScopeGuard],
        data: {
          codigos: [CodigosMenu.CONSULTAS,
          CodigosMenu.CONSULTAS_ASOCIADOS,
          CodigosMenu.CONSULTAS_ASOCIADOS_FACTURACION,
          CodigosMenu.CONSULTAS_ASOCIADOS_FACTURACION_MULTIACTIVA], permisos: [CodigosPermisos.CONSULTAR]
        }
      },
      {
        path: UrlRoute.FACTURACION_ASOCIADOS_SOLIDARIDAD,
        component: SolidadaridadFacturacionComponent,
        canActivate: [ScopeGuard],
        data: {
          codigos: [CodigosMenu.CONSULTAS,
          CodigosMenu.CONSULTAS_ASOCIADOS,
          CodigosMenu.CONSULTAS_ASOCIADOS_FACTURACION,
          CodigosMenu.CONSULTAS_ASOCIADOS_FACTURACION_SOLIDARIDAD], permisos: [CodigosPermisos.CONSULTAR]
        }
      },
      {
        path: UrlRoute.FACTURACION_ASOCIADOS_CUENTAS_CONTABLES,
        component: CuentasContablesFacturacionComponent,
        canActivate: [ScopeGuard],
        data: {
          codigos: [CodigosMenu.CONSULTAS,
          CodigosMenu.CONSULTAS_ASOCIADOS,
          CodigosMenu.CONSULTAS_ASOCIADOS_FACTURACION,
          CodigosMenu.CONSULTAS_ASOCIADOS_FACTURACION_CUENTAS_CONTABLES], permisos: [CodigosPermisos.CONSULTAR]
        }
      }
      ,
      {
        path: UrlRoute.FACTURACION_ASOCIADOS_CUENTAS_CONTABLES_DETALLE,
        component: CuentasContablesFacturacionDetalleComponent,
        canActivate: [ScopeGuard],
        data: {
          codigos: [CodigosMenu.CONSULTAS,
          CodigosMenu.CONSULTAS_ASOCIADOS,
          CodigosMenu.CONSULTAS_ASOCIADOS_FACTURACION,
          CodigosMenu.CONSULTAS_ASOCIADOS_FACTURACION_CUENTAS_CONTABLES], permisos: [CodigosPermisos.CONSULTAR]
        }
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacturacionAsociadosRoutingModule { }
