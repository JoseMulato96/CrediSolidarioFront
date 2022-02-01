import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionCoberturaRoutingModule } from './gestion-cobertura-routing.module';
import { GestionCoberturaComponent } from './gestion-cobertura.component';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [GestionCoberturaComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    GestionCoberturaRoutingModule
  ]
})
export class GestionCoberturaModule { }
