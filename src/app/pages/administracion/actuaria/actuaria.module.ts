import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActuariaRoutingModule } from './actuaria-routing.module';
import { ActuariaComponent } from './actuaria.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ConceptosDistribucionComponent } from './configuracion/conceptos-distribucion/conceptos-distribucion.component';
import { CargueMasivoFactoresComponent } from './configuracion/cargue-masivo-factores/cargue-masivo-factores.component';
import { RelacionFactoresCoberturaComponent } from './configuracion/relacion-factores-cobertura/relacion-factores-cobertura.component';
import { DetalleCargueMasivoComponent } from './configuracion/detalle-cargue-masivo/detalle-cargue-masivo.component';
import {TableModule} from 'primeng/table';


@NgModule({
  declarations: [
    ActuariaComponent,
    ConfiguracionComponent,
    ConceptosDistribucionComponent,
    CargueMasivoFactoresComponent,
    RelacionFactoresCoberturaComponent,
    DetalleCargueMasivoComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    SharedModule,
    ReactiveFormsModule,
    ActuariaRoutingModule
  ]
})
export class ActuariaModule { }
