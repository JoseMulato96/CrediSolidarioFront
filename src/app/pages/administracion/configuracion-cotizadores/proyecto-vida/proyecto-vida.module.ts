import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProyectoVidaRoutingModule } from './proyecto-vida-routing.module';
import { ProyectoVidaComponent } from './proyecto-vida.component';
import { ListarProyectoVidaComponent } from './listar-proyecto-vida/listar-proyecto-vida.component';
import { GuardarProyectoVidaComponent } from './guardar-proyecto-vida/guardar-proyecto-vida.component';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ProyectoVidaComponent, ListarProyectoVidaComponent, GuardarProyectoVidaComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ProyectoVidaRoutingModule
  ]
})
export class ProyectoVidaModule { }
