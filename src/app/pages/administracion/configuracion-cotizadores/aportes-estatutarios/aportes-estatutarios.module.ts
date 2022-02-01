import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AportesEstatutariosRoutingModule } from './aportes-estatutarios-routing.module';
import { AportesEstatutariosComponent } from './aportes-estatutarios.component';
import { GuardarAportesEstatutariosComponent } from './guardar-aportes-estaturarios/guardar-aportes-estatutarios.component';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ListarAportesEstatutariosComponent } from './listar-aportes-estatutarios/listar-aportes-estatutarios.component';


@NgModule({
  declarations: [AportesEstatutariosComponent, ListarAportesEstatutariosComponent, GuardarAportesEstatutariosComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    AportesEstatutariosRoutingModule
  ]
})
export class AportesEstatutariosModule { }
