import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '@core/guards';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { ConceptoFacturacionComponent } from './concepto-facturacion.component';
import { ListarConceptosFacturacionComponent } from './listar-conceptos-facturacion/listar-conceptos-facturacion.component';
import { GuardarConceptosFacturacionComponent } from './guardar-conceptos-facturacion/guardar-conceptos-facturacion.component';
import { UrlRoute } from '@shared/static/urls/url-route';


const routes: Routes = [
  {
    path: '',
    component: ConceptoFacturacionComponent,
    children: [
      {path: '', component: ListarConceptosFacturacionComponent},
      {path: UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_CONCEPTOS_FACTURACION_NUEVO, component: GuardarConceptosFacturacionComponent, canDeactivate: [CanDeactivateGuard]},
      {path: ':codigo', component: GuardarConceptosFacturacionComponent, canDeactivate: [CanDeactivateGuard]}
    ]
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ConceptoFacturacionRoutingModule { }

