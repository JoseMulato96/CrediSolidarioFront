import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AsignacionGestionDiariaBetaRoutingModule } from './asignacion-gestion-diaria-beta-routing.module';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AsignacionGestionDiariaBetaComponent } from './asignacion-gestion-diaria-beta.component';
import { ListarAsignacionGestionDiariaBetaComponent } from './listar-asignacion-gestion-diaria-beta/listar-asignacion-gestion-diaria-beta.component';

@NgModule({
  declarations: [AsignacionGestionDiariaBetaComponent, ListarAsignacionGestionDiariaBetaComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    AsignacionGestionDiariaBetaRoutingModule
  ]
})
export class AsignacionGestionDiariaBetaModule { }
