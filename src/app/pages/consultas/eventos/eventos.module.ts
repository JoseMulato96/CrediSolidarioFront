import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { StepsModule } from 'primeng/steps';
import { ConsultaEventosComponent } from './consulta/consulta.component';
import { RentasComponent } from './consulta/rentas/rentas.component';
import { DatosEventoService } from './consulta/solicitud/services/datos-evento.service';
import { EventosRoutingModule } from './eventos-routing.module';
import { EventosComponent } from './eventos.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    EventosRoutingModule,
    StepsModule
  ],
  declarations: [
    EventosComponent,
    ConsultaEventosComponent,
    RentasComponent
  ],
  providers: [
    DatosEventoService
  ]
})
export class ReclamacionesModule { }
