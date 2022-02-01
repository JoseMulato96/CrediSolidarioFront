import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfiguracionCotizadoresRoutingModule } from './configuracion-cotizadores-routing.module';
import { ConfiguracionCotizadoresComponent } from './configuracion-cotizadores.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { ProyectoVidaService } from './services/proyecto-vida.service';
import { OtrosParametrosService } from './services/otros-parametros.service';
import { AportesEstatutariosService } from './services/aportes-estatutarios.service';

@NgModule({
  declarations: [ConfiguracionCotizadoresComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ConfiguracionCotizadoresRoutingModule
  ],
  providers:
  [
    ProyectoVidaService,
    OtrosParametrosService,
    AportesEstatutariosService
  ]
})
export class ConfiguracionCotizadoresModule { }
