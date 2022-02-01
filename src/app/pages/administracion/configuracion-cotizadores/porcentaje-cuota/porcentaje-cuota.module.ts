import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PorcentajeCuotaRoutingModule } from './porcentaje-cuota-routing.module';
import { PorcentajeCuotaComponent } from './porcentaje-cuota.component';
import { ListarPorcentajeCuotasComponent } from './listar-porcentaje-cuotas/listar-porcentaje-cuotas.component';
import { GuardarPorcentajeCuotasComponent } from './guardar-porcentaje-cuotas/guardar-porcentaje-cuotas.component';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [PorcentajeCuotaComponent, ListarPorcentajeCuotasComponent, GuardarPorcentajeCuotasComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    PorcentajeCuotaRoutingModule
  ]
})
export class PorcentajeCuotaModule { }
