import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UrlRoute } from '@shared/static/urls/url-route';
import { CanDeactivateGuard } from '@core/guards';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { EnfermedadesGravesComponent } from './enfermedades-graves.component';
import { ListarEnfermedadesGravesComponent } from './listar-enfermedades-graves/listar-enfermedades-graves.component';
import { GuardarEnfermedadesGravesComponent } from './guardar-enfermedades-graves/guardar-enfermedades-graves.component';

const routes: Routes = [
  {
    path: '',
    component: EnfermedadesGravesComponent,
    children: [
      {path: '', component: ListarEnfermedadesGravesComponent},
      {path: UrlRoute.ADMINISTRACION_PROTECCIONES_ENFERMEDADES_GRAVES_NUEVO, component: GuardarEnfermedadesGravesComponent, canDeactivate: [CanDeactivateGuard]},
      {path: ':codigo', component: GuardarEnfermedadesGravesComponent, canDeactivate: [CanDeactivateGuard]}
    ]
  },
  {path: '', redirectTo: '', pathMatch: 'full' },
  {path: '**', component: NotFoundComponent}
  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class EnfermedadesGravesRoutingModule { }
