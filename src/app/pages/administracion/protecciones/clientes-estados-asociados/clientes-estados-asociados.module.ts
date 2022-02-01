import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientesEstadosAsociadosRoutingModule } from './clientes-estados-asociados-routing.module';
import { ClientesEstadosAsociadosComponent } from './clientes-estados-asociados.component';
import { GuardarClientesEstadosAsociadosComponent } from './guardar-clientes-estados-asociados/guardar-clientes-estados-asociados.component';
import { ListarClientesEstadosAsociadosComponent } from './listar-clientes-estados-asociados/listar-clientes-estados-asociados.component';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ClientesEstadosAsociadosComponent, GuardarClientesEstadosAsociadosComponent, ListarClientesEstadosAsociadosComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ClientesEstadosAsociadosRoutingModule
  ]
})
export class ClientesEstadosAsociadosModule { }
