import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UrlRoute } from '@shared/static/urls/url-route';
import { ProteccionesComponent } from './protecciones.component';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { ConsultaRelacionMaestrosComponent } from './plan-cobertura/consulta-relacion-maestros/consulta-relacion-maestros.component';

const routes: Routes = [
  {
    path: '',
    component: ProteccionesComponent,
    children: [
      {
        path: '',
        redirectTo: UrlRoute.ADMINISTRACION_PROTECCIONES_CLIENTES,
        pathMatch: 'full'
      },
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_CLIENTES,
        loadChildren: () => import('./clientes/clientes.module').then(m => m.ClientesModule)
      },
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_CATEGORIAS_ASOCIADO,
        loadChildren: () => import('./categorias-asociado/categorias-asociado.module').then(m => m.CategoriasAsociadoModule)
      },
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_CATEGORIAS_ASOCIADO_HOMOLOGACION,
        loadChildren: () => import('./categorias-asociado-homologacion/categorias-asociado-homologacion.module').then(m => m.CategoriasAsociadoHomologacionModule)
      },
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_FONDOS,
        loadChildren: () => import('./fondos/fondos.module').then(m => m.FondosModule)
      },
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_CANALES,
        loadChildren: () => import('./canales/canales.module').then(m => m.CanalesModule)
      },
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_EXCLUSIONES,
        loadChildren: () => import('./exclusiones/exclusiones.module').then(m => m.ExclusionesModule)
      },
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_DESMEMBRACION_ACCIDENTE,
        loadChildren: () => import('./desmembracion-por-accidente/desmembracion-por-accidente.module').then(m => m.DesmembracionPorAccidenteModule)
      },
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_ENFERMEDADES_GRAVES,
        loadChildren: () => import('./enfermedades-graves/enfermedades-graves.module').then(m => m.EnfermedadesGravesModule)
      },
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA,
        loadChildren: () => import('./gestion-cobertura/gestion-cobertura.module').then(m => m.GestionCoberturaModule)
      },
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_CLIENTE_ESTADO_ASOCIADO,
        loadChildren: () => import('./clientes-estados-asociados/clientes-estados-asociados.module').then(m => m.ClientesEstadosAsociadosModule)
      },
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_CUMULOS,
        loadChildren: () => import('./gestion-cumulos/gestion-cumulos.module').then(m => m.GestionCumulosModule)
      },
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN,
        loadChildren: () => import('./gestion-plan/gestion-plan.module').then(m => m.GestionPlanModule)
      },
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_PLAN_COBERTURA,
        loadChildren: () => import('./plan-cobertura/plan-cobertura.module').then(m => m.PlanCoberturaModule)
      },
      {
        path: UrlRoute.ADMINISTRACION_COTIZADORES_GESTION_NOTAS,
        loadChildren: () => import('./gestion-notas/gestion-notas.module').then(m => m.GestionNotasModule)
      },

      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_PROMOTORES,
        loadChildren: () => import('./gestion-promotores/gestion-promotores.module').then(m => m.GestionPromotoresModule)
      },
      {
        path: UrlRoute.ADMINISTRACION_PROTECCIONES_CAMPANAS_ENDOSO,
        loadChildren: () => import('./gestion-campanas/gestion-campanas.module').then(m => m.GestionCampanasModule)
      },
      // Consulta maestros
      {
        path: `${UrlRoute.CONSULTA_RELACION_MAESTROS}`,
        component: ConsultaRelacionMaestrosComponent
      },
      {
        path: '',
        redirectTo: UrlRoute.ADMINISTRACION_PROTECCIONES_CLIENTES,
        pathMatch: 'full'
      },
      { path: '**', component: NotFoundComponent }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProteccionesRoutingModule { }
