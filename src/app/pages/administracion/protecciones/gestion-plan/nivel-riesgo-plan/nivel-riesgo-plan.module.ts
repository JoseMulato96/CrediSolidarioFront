import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NivelRiesgoPlanComponent } from './nivel-riesgo-plan.component';
import { NivelRiesgoPlanRoutingModule } from './nivel-riesgo-plan-routing.module';
import { ListarNivelRiesgoPlanComponent } from './listar-nivel-riesgo-plan/listar-nivel-riesgo-plan.component';
import { GuardarNivelRiesgoPlanComponent } from './guardar-nivel-riesgo-plan/guardar-nivel-riesgo-plan.component';

@NgModule({
  declarations: [
    NivelRiesgoPlanComponent,
    ListarNivelRiesgoPlanComponent,
    GuardarNivelRiesgoPlanComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    NivelRiesgoPlanRoutingModule
  ],
  providers: []
})
export class NivelRiesgoPlanModule { }
