import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanCoberturaRoutingModule } from './plan-cobertura-routing.module';
import { PlanCoberturaComponent } from './plan-cobertura.component';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ListarPlanCoberturaComponent } from './listar-plan-cobertura/listar-plan-cobertura.component';
import { GuardarPlanCoberturaComponent } from './guardar-plan-cobertura/guardar-plan-cobertura.component';
import { StepsModule } from 'primeng/steps';
import { MessageService } from 'primeng/api';
import { DatosPrincipalesComponent } from './guardar-plan-cobertura/caracteristicas-basicas/datos-principales/datos-principales.component';
import { DeduciblesComponent } from './guardar-plan-cobertura/otras-caracteristicas/deducibles/deducibles.component';
import { CondicionesComponent } from './guardar-plan-cobertura/caracteristicas-basicas/condiciones/condiciones.component';
import { PeriodosCarenciaComponent } from './guardar-plan-cobertura/otras-caracteristicas/periodos-carencia/periodos-carencia.component';
import { ExclusionesComponent } from './guardar-plan-cobertura/otras-caracteristicas/exclusiones/exclusiones.component';
import { ValorRescateComponent } from './guardar-plan-cobertura/otras-caracteristicas/valor-rescate/valor-rescate.component';
import { CoberturasSubsistentesComponent } from './guardar-plan-cobertura/otras-caracteristicas/coberturas-subsistentes-parent/coberturas-subsistentes/coberturas-subsistentes.component';
import { CondicionesAsistenciaComponent } from './guardar-plan-cobertura/caracteristicas-basicas/condiciones-asistencia/condiciones-asistencia.component';
import { ValorAseguradoComponent } from './guardar-plan-cobertura/otras-caracteristicas/valor-asegurado/valor-asegurado.component';
import { LimitacionCoberturaComponent } from './guardar-plan-cobertura/otras-caracteristicas/limitaciones-cobertura/limitacion-cobertura.component';
import { ExcepcionDiagnosticoComponent } from './guardar-plan-cobertura/otras-caracteristicas/limitaciones-cobertura/excepcion-diagnostico/excepcion-diagnostico.component';
import { CondicionPagoAntiguedadComponent } from './guardar-plan-cobertura/otras-caracteristicas/limitaciones-cobertura/condicion-pago-antiguedad/condicion-pago-antiguedad.component';
import { ListarPlanComponent } from './listar-plan-cobertura/listar-plan.component';
import { SublimiteOtraCoberturaComponent } from './guardar-plan-cobertura/otras-caracteristicas/limitaciones-cobertura/sublimite-otra-cobertura/sublimite-otra-cobertura.component';
import { CoberturasAdicionalesComponent } from './guardar-plan-cobertura/otras-caracteristicas/coberturas-subsistentes-parent/coberturas-adicionales/coberturas-adicionales.component';
import { EnfermedadesGravesComponent } from './guardar-plan-cobertura/otras-caracteristicas/enfermedades-graves/enfermedades-graves.component';
import { ConceptosFacturacionComponent } from './guardar-plan-cobertura/otras-caracteristicas/conceptos-facturacion/conceptos-facturacion.component';
import { DesmembracionAccidenteComponent } from './guardar-plan-cobertura/otras-caracteristicas/desmembracion-accidente/desmembracion-accidente.component';
import { CondicionesVentaComponent } from './guardar-plan-cobertura/otras-caracteristicas/condiciones-venta/condiciones-venta.component';
import { ValorCuotaComponent } from './guardar-plan-cobertura/otras-caracteristicas/valor-cuota/valor-cuota.component';
import { TableModule } from 'primeng/table';
import { ReconocimientoPorPermanenciaComponent } from './guardar-plan-cobertura/otras-caracteristicas/reconocimientos-por-permanencia/reconocimientos-por-permanencia.component';
import { CoberturrasSubsistentesParentComponent } from './guardar-plan-cobertura/otras-caracteristicas/coberturas-subsistentes-parent/coberturas-subsistentes-parent.component';
import { ReglasExcepcionesComponent } from './guardar-plan-cobertura/otras-caracteristicas/reglas-excepciones/reglas-excepciones.component';
import { ValorRescatePreexistenciaComponent } from './guardar-plan-cobertura/otras-caracteristicas/valor-rescate-preexistencia/valor-rescate-preexistencia.component';
import { CondicionesPagarEventoComponent } from './guardar-plan-cobertura/otras-caracteristicas/limitaciones-cobertura/condiciones-pagar-por-evento/condiciones-pagar-por-evento.component';


@NgModule({
  declarations: [
    PlanCoberturaComponent,
    ListarPlanCoberturaComponent,
    GuardarPlanCoberturaComponent,
    DatosPrincipalesComponent,
    DeduciblesComponent,
    CondicionesComponent,
    CondicionesAsistenciaComponent,
    PeriodosCarenciaComponent,
    ExclusionesComponent,
    ValorRescateComponent,
    CoberturasSubsistentesComponent,
    ValorAseguradoComponent,
    LimitacionCoberturaComponent,
    ExcepcionDiagnosticoComponent,
    SublimiteOtraCoberturaComponent,
    CondicionPagoAntiguedadComponent,
    ListarPlanComponent,
    SublimiteOtraCoberturaComponent,
    CondicionesPagarEventoComponent,
    ValorRescatePreexistenciaComponent,
    CoberturasAdicionalesComponent,
    EnfermedadesGravesComponent,
    ConceptosFacturacionComponent,
    DesmembracionAccidenteComponent,
    CondicionesVentaComponent,
    ValorCuotaComponent,
    ReconocimientoPorPermanenciaComponent,
    CoberturrasSubsistentesParentComponent,
    ReglasExcepcionesComponent
    ],
  imports: [
    CommonModule,
    TableModule,
    SharedModule,
    ReactiveFormsModule,
    PlanCoberturaRoutingModule,
    StepsModule
  ],
  providers: [
    MessageService
  ]
})
export class PlanCoberturaModule { }
