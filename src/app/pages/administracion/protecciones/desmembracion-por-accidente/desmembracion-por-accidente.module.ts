import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DesmembracionPorAccidenteRoutingModule } from './desmembracion-por-accidente-routing.module';
import { ListarDesmembracionPorAccidenteComponent } from './listar-desmembracion-por-accidente/listar-desmembracion-por-accidente.component';
import { GuardarDesmembracionPorAccidenteComponent } from './guardar-desmembracion-por-accidente/guardar-desmembracion-por-accidente.component';
import { DesmembracionPorAccidenteComponent } from './desmembracion-por-accidente.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [DesmembracionPorAccidenteComponent, ListarDesmembracionPorAccidenteComponent, GuardarDesmembracionPorAccidenteComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    DesmembracionPorAccidenteRoutingModule
  ]
})
export class DesmembracionPorAccidenteModule { }
