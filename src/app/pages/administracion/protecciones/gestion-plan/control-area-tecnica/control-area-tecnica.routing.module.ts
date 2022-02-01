import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '@core/guards';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { ControlAreaTecnicaComponent } from './control-area-tecnica.component';
import { ListarControlAreaTecnicaComponent } from './listar-control-area-tecnica/listar-control-area-tecnica.component';
import { GuardarControlAreaTecnicaComponent } from './guardar-control-area-tecnica/guardar-control-area-tecnica.component';
import { UrlRoute } from '@shared/static/urls/url-route';


const routes: Routes = [
  {
    path: '',
    component: ControlAreaTecnicaComponent,
    children: [
      {path: '', component: ListarControlAreaTecnicaComponent},
      {path: UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_CONTROL_AREA_TECNICA_NUEVO, component: GuardarControlAreaTecnicaComponent, canDeactivate: [CanDeactivateGuard]},
      {path: ':codigo', component: GuardarControlAreaTecnicaComponent, canDeactivate: [CanDeactivateGuard]}
    ]
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ControlAreaTecnicaRoutingModule { }

