import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UrlRoute } from '@shared/static/urls/url-route';
import { CanDeactivateGuard } from '@core/guards';
import { CampanasCoberturaComponent } from './campanas-cobertura.component';
import { ListarCampanasCoberturaComponent } from './listar-campanas-cobertura/listar-campanas-cobertura.component';
import { GuardarCampanasCoberturaComponent } from './guardar-campanas-cobertura/guardar-campanas-cobertura.component';

const routes: Routes = [
  {path: '', component: CampanasCoberturaComponent,children: [
    { path: '', component: ListarCampanasCoberturaComponent },
    { path: UrlRoute.ADMINISTRACION_PROTECCIONES_CAMPANAS_ENDOSO_CAMPANAS_NUEVO, component: GuardarCampanasCoberturaComponent, canDeactivate: [CanDeactivateGuard] },
    { path: ':codigo', component: GuardarCampanasCoberturaComponent, canDeactivate: [CanDeactivateGuard] }
  ]},  
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampanasCoberturaRoutingModule { }
