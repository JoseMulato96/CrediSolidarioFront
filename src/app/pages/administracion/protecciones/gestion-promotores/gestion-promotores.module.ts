import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionPromotoresRoutingModule } from './gestion-promotores-routing.module';
import { GestionPromotoresComponent } from './gestion-promotores.component';
import { ListarPromotoresComponent } from './listar-promotores/listar-promotores.component';
import { GuardarPromotoresComponent } from './guardar-promotores/guardar-promotores.component';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [GestionPromotoresComponent, ListarPromotoresComponent, GuardarPromotoresComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    GestionPromotoresRoutingModule
  ]
})
export class GestionPromotoresModule { }
