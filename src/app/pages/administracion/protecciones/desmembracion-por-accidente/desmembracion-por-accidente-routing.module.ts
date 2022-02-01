import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '@core/guards';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { DesmembracionPorAccidenteComponent } from './desmembracion-por-accidente.component';
import { GuardarDesmembracionPorAccidenteComponent } from './guardar-desmembracion-por-accidente/guardar-desmembracion-por-accidente.component';
import { ListarDesmembracionPorAccidenteComponent } from './listar-desmembracion-por-accidente/listar-desmembracion-por-accidente.component';


const routes: Routes = [
  {
    path: '',
    component: DesmembracionPorAccidenteComponent,
    children: [
      {path: '', component: ListarDesmembracionPorAccidenteComponent},
      {path: UrlRoute.ADMINISTRACION_PROTECCIONES_DESMEMBRACION_ACCIDENTE_NUEVO, component: GuardarDesmembracionPorAccidenteComponent, canDeactivate: [CanDeactivateGuard]},
      {path: ':codigo', component: GuardarDesmembracionPorAccidenteComponent, canDeactivate: [CanDeactivateGuard]}
    ]
  },
  {path: '', redirectTo: '', pathMatch: 'full' },
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DesmembracionPorAccidenteRoutingModule { }
