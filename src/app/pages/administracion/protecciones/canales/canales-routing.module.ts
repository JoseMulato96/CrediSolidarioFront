import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UrlRoute } from '@shared/static/urls/url-route';
import { CanDeactivateGuard } from '@core/guards';
import { CanalesComponent } from './canales.component';
import { GuardarCanalesComponent } from './guardar-canales/guardar-canales.component';
import { ListarCanalesComponent } from './listar-canales/listar-canales.component';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';

const routes: Routes = [
    {
      path: '',
      component: CanalesComponent,
      children: [
        {path: '', component: ListarCanalesComponent},
        {path: UrlRoute.ADMINISTRACION_PROTECCIONES_CANAL_NUEVO, component: GuardarCanalesComponent, canDeactivate: [CanDeactivateGuard]},
        {path: `:codigo`, component: GuardarCanalesComponent, canDeactivate: [CanDeactivateGuard]}
      ]
    },
    {path: '', redirectTo: '', pathMatch: 'full' },
    {path: '**', component: NotFoundComponent}
  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class CanalesRoutingModule { }
