import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UrlRoute } from '@shared/static/urls/url-route';
import { CanDeactivateGuard } from '@core/guards';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { ExclusionesComponent } from './exclusiones.component';
import { ListarExclusionesComponent } from './listar-exclusiones/listar-exclusiones.component';
import { GuardarExclusionesComponent } from './guardar-exclusiones/guardar-exclusiones.component';

const routes: Routes = [
  {
    path: '',
    component: ExclusionesComponent,
    children: [
      {path: '', component: ListarExclusionesComponent},
      {path: UrlRoute.ADMINISTRACION_PROTECCIONES_ESCLUSIONES_NUEVO, component: GuardarExclusionesComponent, canDeactivate: [CanDeactivateGuard]},
      {path: ':codigo', component: GuardarExclusionesComponent, canDeactivate: [CanDeactivateGuard]}
    ]
  },
  {path: '', redirectTo: '', pathMatch: 'full' },
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExclusionesRoutingModule { }
