import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { ParametrosConfiguracionOperacionesComponent } from './parametros-configuracion-operaciones.component';
import { ListarParametrosConfiguracionOperacionesComponent } from './listar-parametros-configuracion-operaciones/listar-parametros-configuracion-operaciones.component';
import { GuardarParametrosConfiguracionOperacionesComponent } from './guardar-parametros-configuracion-operaciones/guardar-parametros-configuracion-operaciones.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { ScopeGuard } from '@core/guards/scope.guard';
import { CodigosMenu } from '@shared/static/urls/codigos-menu';
import { CodigosPermisos } from '@shared/static/urls/codigos-permisos';

const routes: Routes = [
    {
        path: '',
        component: ParametrosConfiguracionOperacionesComponent,
        children: [
            {
                path: '',
                component: ListarParametrosConfiguracionOperacionesComponent,
                canActivate: [ScopeGuard],
                data: {
                    codigos: [
                        CodigosMenu.ADMINISTRACION,
                        CodigosMenu.MM_ADMIN_CONFIG_OPERACIONES], permisos: [CodigosPermisos.CONSULTAR, CodigosPermisos.EDITAR, CodigosPermisos.AGREGAR, CodigosPermisos.ELIMINAR]
                }
            }, {
                path: UrlRoute.GEOLOCALIZACION_PARAMETROS_CONFIGURACION_OPERACIONES,
                component: GuardarParametrosConfiguracionOperacionesComponent,
                canActivate: [ScopeGuard],
                data: {
                    codigos: [
                        CodigosMenu.ADMINISTRACION,
                        CodigosMenu.MM_ADMIN_CONFIG_OPERACIONES], permisos: [CodigosPermisos.CONSULTAR, CodigosPermisos.EDITAR, CodigosPermisos.AGREGAR, CodigosPermisos.ELIMINAR]
                }
            }, {
                path: UrlRoute.GEOLOCALIZACION_PARAMETROS_CONFIGURACION_OPERACIONES + '/:id',
                component: GuardarParametrosConfiguracionOperacionesComponent,
                canActivate: [ScopeGuard],
                data: {
                    codigos: [
                        CodigosMenu.ADMINISTRACION,
                        CodigosMenu.MM_ADMIN_CONFIG_OPERACIONES], permisos: [CodigosPermisos.CONSULTAR, CodigosPermisos.EDITAR, CodigosPermisos.AGREGAR, CodigosPermisos.ELIMINAR]
                }
            }
        ]
    },
    { path: '', redirectTo: '', pathMatch: 'full' },
    { path: '**', component: NotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ParametrosConfiguacionOperacionesRoutingModule { }
