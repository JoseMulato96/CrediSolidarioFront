import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionPromocionesRoutingModule } from './gestion-promociones-routing.module';
import { GestionPromocionesComponent } from './gestion-promociones.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [GestionPromocionesComponent],
  imports: [
    CommonModule,
    TableModule,
    SharedModule,
    ReactiveFormsModule,
    GestionPromocionesRoutingModule
  ]
})
export class GestionPromocionesModule { }
