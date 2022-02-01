import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '@core/guards';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { GuardarProductosExcluyentesComponent } from './guardar-productos-excluyentes/guardar-productos-excluyentes.component';
import { ListarProductosExcluyentesComponent } from './listar-productos-excluyentes/listar-productos-excluyentes.component';
import { ProductosExcluyentesComponent } from './productos-excluyentes.component';


const routes: Routes = [
  {
    path: '',
    component: ProductosExcluyentesComponent,
    children: [
      {
        path: '',
        component: ListarProductosExcluyentesComponent
      },
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PRODUCTOS_EXCLUYENTES_NUEVO,
        component: GuardarProductosExcluyentesComponent,
        canDeactivate: [CanDeactivateGuard]},
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PRODUCTOS_EXCLUYENTES_CODIGO_PLAN + '/:codigo',
        component: GuardarProductosExcluyentesComponent,
        canDeactivate: [CanDeactivateGuard]}
    ]
  },
  {path: '', redirectTo: '', pathMatch: 'full' },
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductosExcluyentesRoutingModule { }
