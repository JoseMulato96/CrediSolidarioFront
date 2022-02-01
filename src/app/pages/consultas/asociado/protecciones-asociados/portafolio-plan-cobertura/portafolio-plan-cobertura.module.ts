import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortafolioPlanCoberturaRoutingModule } from './portafolio-plan-cobertura-routing.module';
import { PortafolioPlanCoberturaComponent } from './portafolio-plan-cobertura.component';
import { MovimientosComponent } from './movimientos/movimientos.component';
import { SharedModule } from '@shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { PlanCoberturaComponent } from './plan-cobertura/plan-cobertura.component';
import { CotizacionPlanComponent } from './cotizacion-plan/cotizacion-plan.component';
import { ReactiveFormsModule } from '@angular/forms';
import { StepsModule } from 'primeng/steps';
import { VentaPlanComponent } from './venta-plan/venta-plan.component';
import { MimTransaccionService } from './services/mim-transaccion.service';
import { AuditoriaMedicaVentasComponent } from './auditoria-medica-ventas/auditoria-medica-ventas.component';
import { ResumenCoberturasVentaComponent } from './resumen-coberturas-venta/resumen-coberturas-venta.component';
import { InspektorService } from './services/inspektor.service';
import { GestionListasRestrictivasComponent } from './gestion-listas-restrictivas/gestion-listas-restrictivas.component';
import { DeclaracionSaludVisualComponent } from './declaracion-salud-visual/declaracion-salud-visual.component';
import { ValidacionManualListasRestrictivasComponent } from './validacion-manual-listas-restrictivas/validacion-manual-listas-restrictivas.component';
import { ChartModule } from 'primeng/chart';
import { MessageService } from 'primeng/api';
import { ResumenCoberturaCotizacionComponent } from './resumen-cobertura-cotizacion/resumen-cobertura-cotizacion.component';
import { GestionOperacionesComponent } from './gestion-operaciones/gestion-operaciones.component';
import { GestionAreaTecnicaComponent } from './gestion-area-tecnica/gestion-area-tecnica.component';
import { GestionAuxiliarMedicoComponent } from './gestion-auxiliar-medico/gestion-auxiliar-medico.component';
import { GenerateService } from './services/generate.service';
import { ActivarSolicitudesSuspendidasComponent } from './activar-solicitudes-suspendidas/activar-solicitudes-suspendidas.component';
import { ProyectoVidaService } from 'src/app/pages/administracion/configuracion-cotizadores/services/proyecto-vida.service';

@NgModule({
  declarations: [
    PortafolioPlanCoberturaComponent,
    MovimientosComponent,
    PlanCoberturaComponent,
    CotizacionPlanComponent,
    VentaPlanComponent,
    AuditoriaMedicaVentasComponent,
    GestionAreaTecnicaComponent,
    GestionListasRestrictivasComponent,
    VentaPlanComponent,
    VentaPlanComponent,
    ResumenCoberturasVentaComponent,
    DeclaracionSaludVisualComponent,
    ValidacionManualListasRestrictivasComponent,
    ResumenCoberturaCotizacionComponent,
    GestionOperacionesComponent,
    GestionAuxiliarMedicoComponent,
    ActivarSolicitudesSuspendidasComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    StepsModule,
    TranslateModule,
    PortafolioPlanCoberturaRoutingModule,
    ChartModule
  ],
  providers: [
    MimTransaccionService,
    InspektorService,
    MessageService,
    GenerateService,
    ProyectoVidaService 
  ]
})
export class PortafolioPlanCoberturaModule { }
