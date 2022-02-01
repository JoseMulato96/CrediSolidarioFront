import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientesRoutingModule } from './clientes-routing.module';
import { ClientesComponent } from './clientes.component';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ListarClientesComponent } from './listar-clientes/listar-clientes.component';
import { GuardarClienteComponent } from './guardar-cliente/guardar-cliente.component';

@NgModule({
  declarations: [
    ClientesComponent,
    ListarClientesComponent,
    GuardarClienteComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ClientesRoutingModule
  ]
})
export class ClientesModule { }
