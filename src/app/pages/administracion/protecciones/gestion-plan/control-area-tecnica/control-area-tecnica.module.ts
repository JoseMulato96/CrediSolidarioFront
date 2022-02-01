import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ControlAreaTecnicaComponent } from './control-area-tecnica.component';
import { GuardarControlAreaTecnicaComponent } from './guardar-control-area-tecnica/guardar-control-area-tecnica.component';
import { ListarControlAreaTecnicaComponent } from './listar-control-area-tecnica/listar-control-area-tecnica.component';
import { ControlAreaTecnicaRoutingModule } from './control-area-tecnica.routing.module';

@NgModule({
  declarations: [
    ControlAreaTecnicaComponent,
    GuardarControlAreaTecnicaComponent,
    ListarControlAreaTecnicaComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ControlAreaTecnicaRoutingModule
  ],
  providers: []
})
export class ControlAreaTecnicaModule { }
