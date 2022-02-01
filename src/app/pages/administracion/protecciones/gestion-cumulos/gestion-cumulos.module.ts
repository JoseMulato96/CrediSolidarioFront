import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionCumulosRoutingModule } from './gestion-cumulos-routing.module';
import { GestionCumulosComponent } from './gestion-cumulos.component';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [GestionCumulosComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    GestionCumulosRoutingModule
  ]
})
export class GestionCumulosModule { }
