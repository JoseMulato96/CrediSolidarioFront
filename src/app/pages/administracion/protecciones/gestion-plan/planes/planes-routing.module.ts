import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanesComponent } from './planes.component';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { ListarPlanesComponent } from './listar-planes/listar-planes.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { GuardarPlanesComponent } from './guardar-planes/guardar-planes.component';
import { CanDeactivateGuard } from '@core/guards';

const routes: Routes = [
  {
    path: '',
    component: PlanesComponent,
    children: [
      {path: '', component: ListarPlanesComponent},
      {path: UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLANES_NUEVO, component: GuardarPlanesComponent, canDeactivate: [CanDeactivateGuard]},
      {path: `:codigoPlan`, component: GuardarPlanesComponent, canDeactivate: [CanDeactivateGuard]},
      {
        path: ':codigoPlan/:solicitud',
        component: GuardarPlanesComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: `:codigoPlan/${UrlRoute.SOLICITUD_ELIMINACION}/${UrlRoute.PROCESO}/:processInstanceId/${UrlRoute.TAREA}/:taskId`,
        component: GuardarPlanesComponent,
        canDeactivate: [CanDeactivateGuard]
      }
    ]
  },
  {path: '', redirectTo: '', pathMatch: 'full' },
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanesRoutingModule { }
