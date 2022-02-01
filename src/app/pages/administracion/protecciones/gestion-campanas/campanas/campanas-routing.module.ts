import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UrlRoute } from '@shared/static/urls/url-route';
import { CanDeactivateGuard } from '@core/guards';
import { ListarCampanasComponent } from './listar-campanas/listar-campanas.component';
import { GuardarCampanasComponent } from './guardar-campanas/guardar-campanas.component';
import { CampanasComponent } from './campanas.component';

const routes: Routes = [
  {path: '', component: CampanasComponent,children: [
    { path: '', component: ListarCampanasComponent },
    { path: UrlRoute.ADMINISTRACION_PROTECCIONES_CAMPANAS_ENDOSO_CAMPANAS_NUEVO, component: GuardarCampanasComponent, canDeactivate: [CanDeactivateGuard] },
    { path: ':codigo', component: GuardarCampanasComponent, canDeactivate: [CanDeactivateGuard] }
  ]},  
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampanasRoutingModule { }
