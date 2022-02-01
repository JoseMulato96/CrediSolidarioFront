import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { ParametrosConfiguacionOperacionesRoutingModule } from './parametros-configuracion-operaciones-routing.module';
import { ParametrosConfiguracionOperacionesComponent } from './parametros-configuracion-operaciones.component';
import { ListarParametrosConfiguracionOperacionesComponent } from './listar-parametros-configuracion-operaciones/listar-parametros-configuracion-operaciones.component';
import { GuardarParametrosConfiguracionOperacionesComponent } from './guardar-parametros-configuracion-operaciones/guardar-parametros-configuracion-operaciones.component';

@NgModule({
    declarations: [
        ParametrosConfiguracionOperacionesComponent,
        ListarParametrosConfiguracionOperacionesComponent,
        GuardarParametrosConfiguracionOperacionesComponent],
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        ParametrosConfiguacionOperacionesRoutingModule
    ]
})
export class ParametrosConfiguracionOperacionesModule { }
