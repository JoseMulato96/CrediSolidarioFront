import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NivelesRiesgoCoberturaRoutingModule } from './niveles-riesgo-cobertura-routing.module';
import { NivelesRiesgoCoberturaComponent } from './niveles-riesgo-cobertura.component';
import { ListarNivelesRiesgoCoberturaComponent } from './listar-niveles-riesgo-cobertura/listar-niveles-riesgo-cobertura.component';
import { GuardarNivelesRiesgoCoberturaComponent } from './guardar-niveles-riesgo-cobertura/guardar-niveles-riesgo-cobertura.component';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [NivelesRiesgoCoberturaComponent, ListarNivelesRiesgoCoberturaComponent, GuardarNivelesRiesgoCoberturaComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    NivelesRiesgoCoberturaRoutingModule
  ],
  providers: [
  ]
})
export class NivelesRiesgoCoberturaModule { }
