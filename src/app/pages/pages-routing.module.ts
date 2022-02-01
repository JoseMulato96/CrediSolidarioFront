import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { HomeComponent } from './home/home.component';
import { PagesComponent } from './pages.component';
import { UiKitComponent } from './ui-kit/ui-kit.component';
import { ScopeGuard } from '@core/guards/scope.guard';
import { CodigosMenu } from '@shared/static/urls/codigos-menu';
import { CodigosPermisos } from '@shared/static/urls/codigos-permisos';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: 'ui-kit', component: UiKitComponent },
      {
        path: UrlRoute.CONSULTAS,
        loadChildren: () => import('./consultas/consultas.module').then(m => m.ConsultasModule),
        canActivate: [ScopeGuard],
        data: {
          preload: true,
          codigos: [CodigosMenu.CONSULTAS],
          permisos: [CodigosPermisos.CONSULTAR]
        }
      },
      { path: UrlRoute.HOME, component: HomeComponent },
      {
        path: UrlRoute.ADMINISTRACION,
        loadChildren: () => import('./administracion/administracion.module').then(m => m.AdministracionModule),
        canActivate: [ScopeGuard],
        data: {
          codigos: [CodigosMenu.ADMINISTRACION], permisos: [CodigosPermisos.CONSULTAR]
        }
      },
      {
        path: UrlRoute.REPORTES,
        loadChildren: () => import('./reportes/reportes.module').then(m => m.ReportesModule),
      },
      {
        path: UrlRoute.SIMULACIONES,
        loadChildren: () => import('./simulaciones/simulaciones.module').then(m => m.SimulacionesModule),
        canActivate: [ScopeGuard],
        data: {
          codigos: [CodigosMenu.SIMULACIONES], permisos: [CodigosPermisos.CONSULTAR]
        }
      },
      {
        path: '',
        redirectTo: UrlRoute.HOME,
        pathMatch: 'full'
      },
      {
        path: '**',
        component: NotFoundComponent
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
export class PagesRoutingModule { }
