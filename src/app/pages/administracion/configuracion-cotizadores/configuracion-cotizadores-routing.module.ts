import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfiguracionCotizadoresComponent } from './configuracion-cotizadores.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';


const routes: Routes = [
  {
    path: '',
    component: ConfiguracionCotizadoresComponent,
    children: [
      {
        path: '',
        redirectTo: UrlRoute.ADMINISTRACION_COTIZADORES_PORCENTAJE_CUOTA,
        pathMatch: 'full'
      },
      {
        path: UrlRoute.ADMINISTRACION_COTIZADORES_PORCENTAJE_CUOTA,
        loadChildren: () => import('./porcentaje-cuota/porcentaje-cuota.module').then(m => m.PorcentajeCuotaModule)
      },
      {
        path: UrlRoute.ADMINISTRACION_COTIZADORES_PROYECTO_VIDA,
        loadChildren: () => import('./proyecto-vida/proyecto-vida.module').then(m => m.ProyectoVidaModule)
      },
      {
        path: UrlRoute.ADMINISTRACION_COTIZADORES_OTROS_PARAMETROS,
        loadChildren: () => import('./otros-parametros/otros-parametros.module').then(m => m.OtrosParametrosModule)
      },
      {
        path: UrlRoute.ADMINISTRACION_COTIZADORES_APORTES_ESTATUTARIOS,
        loadChildren: () => import('./aportes-estatutarios/aportes-estatutarios.module').then(m => m.AportesEstatutariosModule)
      },
      { path: '**', component: NotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracionCotizadoresRoutingModule { }
