import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ReportesRoutingModule } from './reportes-routing.module';
import { ReportesComponent } from './reportes.component';
import { GestionDiariaComponent } from './gestion-diaria/gestion-diaria.component';
import { AutomaticoPagosComponent } from './automatico-pagos/automatico-pagos.component';
import { NotificacionCierreComponent } from './notificacion-cierre/notificacion-cierre.component';
import { ProcesosAutomaticosComponent } from './procesos-automaticos/procesos-automaticos.component';
import { AmparosPagadosComponent } from './amparos-pagados/amparos-pagados.component';

@NgModule({
  declarations: [
    ReportesComponent,
    GestionDiariaComponent,
    AutomaticoPagosComponent,
    NotificacionCierreComponent,
    ProcesosAutomaticosComponent,
    AmparosPagadosComponent
  ],
  exports: [
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ReportesRoutingModule
  ]
})
export class ReportesModule { }
