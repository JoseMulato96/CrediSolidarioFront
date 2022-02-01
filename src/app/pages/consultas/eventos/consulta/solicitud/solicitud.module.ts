import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SolicitudRoutingModule } from './solicitud-routing.module';
import { AuditoriaMedicaComponent } from './auditoria-medica/auditoria-medica.component';
import { NotificarNegacionComponent } from './notificar-negacion/notificar-negacion.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { RegistroComponent } from './registro/registro.component';
import { RadicarComponent } from './radicar/radicar.component';
import { SolicitudComponent } from './solicitud.component';
import { RegistraSolicitudComponent } from './registro/registra-solicitud/registra-solicitud.component';
import { ValidaDocumentosComponent } from './registro/valida-documentos/valida-documentos.component';
import { StepsModule } from 'primeng/steps';
import { DefinicionPagoComponent } from './definicion-pago/definicion-pago.component';
import { CoberturaComponent } from './definicion-pago/cobertura/cobertura.component';
import { ValorPagarComponent } from './definicion-pago/valor-pagar/valor-pagar.component';
import { LiquidarComponent } from './definicion-pago/liquidar/liquidar.component';
import { DatosEventoService } from './services/datos-evento.service';
import { ConceptoOtrasAreasComponent } from './concepto-otras-areas/concepto-otras-areas.component';
import { ActivarComponent } from './activar/activar.component';
import { DatosEventoComponent } from './datos-evento/datos-evento.component';
import { BitacoraComponent } from './bitacora/bitacora.component';

@NgModule({
  declarations: [
    SolicitudComponent,
    RegistroComponent,
    BitacoraComponent,
    RegistraSolicitudComponent,
    ValidaDocumentosComponent,
    RadicarComponent,
    AuditoriaMedicaComponent,
    NotificarNegacionComponent,
    DefinicionPagoComponent,
    CoberturaComponent,
    ValorPagarComponent,
    LiquidarComponent,
    ConceptoOtrasAreasComponent,
    ActivarComponent,
    DatosEventoComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    SolicitudRoutingModule,
    StepsModule
  ],
  providers: [
    DatosEventoService
  ]
})
export class SolicitudModule { }
