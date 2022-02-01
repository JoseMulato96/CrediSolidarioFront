import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '@core/guards';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { GestionPromotoresComponent } from './gestion-promotores.component';
import { GuardarPromotoresComponent } from './guardar-promotores/guardar-promotores.component';
import { ListarPromotoresComponent } from './listar-promotores/listar-promotores.component';


const routes: Routes = [
  {
    path: '',
    component: GestionPromotoresComponent,
    children: [
      {
        path: '',
        component: ListarPromotoresComponent
      },
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_PROMOTORES_NUEVO,
        component: GuardarPromotoresComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: ':numeroIdentificacion',
        component: GuardarPromotoresComponent,
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
export class GestionPromotoresRoutingModule { }
