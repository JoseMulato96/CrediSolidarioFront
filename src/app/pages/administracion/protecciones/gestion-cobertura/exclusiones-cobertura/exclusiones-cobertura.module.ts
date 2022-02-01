import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ExclusionesCoberturaComponent } from './exclusiones-cobertura.component';
import { ListarExclusionesCoberturaComponent } from './listar-exclusiones-cobertura/listar-exclusiones-cobertura.component';
import { GuardarExclusionesCoberturaComponent } from './guardar-exclusiones-cobertura/guardar-exclusiones-cobertura.component';
import { ExclusionesCoberturaRoutingModule } from './exclusiones-cobertura-routing.module';

@NgModule({
  declarations: [
    ExclusionesCoberturaComponent,
    ListarExclusionesCoberturaComponent,
    GuardarExclusionesCoberturaComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ExclusionesCoberturaRoutingModule
  ],
  providers: []
})
export class ExclusionesCoberturaModule { }
