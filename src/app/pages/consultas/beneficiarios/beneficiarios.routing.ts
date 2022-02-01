import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards';
import { UrlRoute } from '@shared/static/urls/url-route';

import { BeneficiarioInformacionComponent } from './beneficiario-informacion/beneficiario-informacion.component';
import { BeneficiariosFallecidosComponent } from './beneficiarios-fallecidos/beneficiarios-fallecidos.component';
import { BeneficiariosRepetidosComponent } from './beneficiarios-repetidos/beneficiarios-repetidos.component';
import { BeneficiariosComponent } from './beneficiarios.component';
import { BeneficiariosAsociadosRelacionadosComponent } from './beneficiario-informacion/asociados-relacionados/beneficiarios-asociados-relacionados.component';
import { BeneficiariosNovedadesHistoricoComponent } from './beneficiario-informacion/novedades-historico/beneficiarios-novedades-historico.component';
import { BeneficiarioListarFechaNacimientoComponent } from './beneficiario-fecha-nacimiento/beneficiario-lista-fecha-nacimiento.component';
import { BeneficiarioActualizarFechaNacimientoComponent } from './beneficiario-fecha-nacimiento/beneficiario-actualizar-fecha-nacimiento/beneficiario-actualizar-fecha-nacimiento.component';

const routes: Routes = [
  {
    path: '',
    component: BeneficiariosComponent,
    children: [
      {
        path: UrlRoute.BENEFICIARIOS + '/' + UrlRoute.BENEFICIARIOS_REPETIDOS,
        component: BeneficiariosRepetidosComponent
      },
      {
        path: UrlRoute.BENEFICIARIOS + '/' + UrlRoute.BENEFICIARIOS_FALLECIDOS,
        component: BeneficiariosFallecidosComponent
      },
      {
        path: UrlRoute.BENEFICIARIOS_FECHA_NACIMIENTO,
        component: BeneficiarioListarFechaNacimientoComponent
      },
      {
        path: UrlRoute.BENEFICIARIOS_FECHA_NACIMIENTO + '/:codBeneficiario',
        component: BeneficiarioActualizarFechaNacimientoComponent
      },
      {
        path: UrlRoute.BENEFICIARIOS_INFORMACION,
        component: BeneficiarioInformacionComponent
      },
      {
        path: '',
        redirectTo: UrlRoute.BENEFICIARIOS_INFORMACION,
        pathMatch: 'full'
      }
    ],
    canActivate: [AuthGuard]
  },
  {
    path: UrlRoute.BENEFICIARIOS_INFORMACION + '/:codBeneficiario',
    component: BeneficiariosComponent,
    children: [
      {
        path: UrlRoute.BENEFICIARIOS_ASOCIADO_RELACIONADOS,
        component: BeneficiariosAsociadosRelacionadosComponent
      },
      {
        path:
          UrlRoute.BENEFICIARIOS_ASOCIADO_RELACIONADOS +
          '/:cliNumIdent/' +
          UrlRoute.BENEFICIARIOS_NOVEDANDES_HISTORICO,
        component: BeneficiariosNovedadesHistoricoComponent
      },
      {
        path: '',
        redirectTo: UrlRoute.BENEFICIARIOS_REPETIDOS,
        pathMatch: 'full'
      }
    ],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class BeneficiariosRoutingModule { }
