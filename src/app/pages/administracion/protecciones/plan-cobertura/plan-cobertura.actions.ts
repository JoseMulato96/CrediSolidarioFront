import { Action } from '@ngrx/store';
import { MimPlanCobertura } from './model/mim-plan-cobertura.model';
import { MimPeriodoCarencia } from './model/mim-periodo-carencia.model';
import { IPage } from '@shared/interfaces/page.interface';
import { MimDeducible } from './model/mim-deducible.model';
import { Estado, GuardarPlanCoberturaOrden } from './model/guardar-plan-cobertura-orden.model';
import { MimValorRescate } from './model/mim-valor-rescate.model';
import { MimExcepcionDiagnostico } from './model/mim-excepcion-diagnostico';
import { MimCondicionPagoAntiguedad } from './model/mim-condicion-pago-antiguedad';
import { MimExclusionPlanCobertura } from './model/mim-exclusion-plan-cobertura.model';
import { MimSubsistentePlanCobertura } from './model/mim-subsistente-plan-cobertura.model';
import { MimAsistenciaPlanCobertura } from './model/mim-asistencia-plan-cobertura.model';
import { MimCondicion } from './model/mim-condicion.model';
import { MimValorAsegurado } from './model/mim-valor-asegurado.model';
import { MimSublimiteCobertura } from './model/mim-sublimite-cobertura.model';
import { MimAdicionalPlanCobertura } from './model/mim-adicional-plan-cobertura.model';
import { MimBeneficioPreexistencia } from './model/mim-beneficio-preexistencia.model';
import { MimEnfermedadGravePlanCobertura } from './model/mim-enfermedad-grave-plan-cobertura.model';
import { MimConceptoFacturacionPlanCobertura } from './model/mim-concepto-facturacion-plan-cobertura.model';
import { MimDesmembracionAccidente } from './model/mim-desmembracion-accidente.model';
import { MimCondicionesVentaPlanCobertura } from './model/mim-condiciones-venta-plan-cobertura.model';
import { MimValorCuota } from './model/valor-cuota-plan-cobertura.model';
import { MimReglasExcepciones } from './model/MimReglasExcepciones.model';
import { MimReconocimientoPorPermanencia } from './model/mim-reconocimiento-por-permanencia.model';
import { MimCondicionesPagarEvento } from './model/mim-condiciones-pagar-evento.model';
export const POST_DATOS_PRINCIPALES = '[PlanCobertura] Guardar datos principales';
export const GET_DATOS_PRINCIPALES = '[PlanCobertura] Obtener datos principales';
export const POST_CONDICIONES = '[PlanCobertura] Guardar condiciones';
export const POST_CONDICIONES_ASISTENCIA = '[PlanCobertura] Guardar condiciones de asistencia';
export const POST_PERIODOS_CARENCIA = '[PlanCobertura] Guardar periodos carencia';
export const POST_REGLAS_EXCEPCIONES = '[PlanCobertura] Guardar reglasExcepciones';
export const POST_DEDUCIBLES = '[PlanCobertura] Guardar deducibles';
export const POST_VALOR_RESCATE = '[PlanCobertura] Guardar valor rescate';
export const POST_DESMEMBRACION_ACCIDENTE = '[PlanCobertura] Guardar desmembración por accidente';
export const POST_VALOR_CUOTA = '[PlanCobertura] Guardar valor cuota';
export const POST_VALOR_ASEGURADO = '[PlanCobertura] Guardar valor asegurado';
export const POST_EXCLUSIONES = '[PlanCobertura] Guardar datos exclusiones';
export const POST_BENEFICIO_PREEXISTENCIA = '[PlanCobertura] Guardar datos beneficio preexistencia';
export const POST_CONCEPTO_FACTURACION = '[PlanCobertura] Guardar datos conceptos de facturacion';
export const POST_ENFERMEDAD_GRAVE = '[PlanCobertura] Guardar datos enfermedades graves';
export const POST_COBERTURA_SUBSISTENTES = '[PlanCobertura] Guardar datos cobertura subsistente';
export const POST_COBERTURA_ADICIONALES = '[PlanCobertura] Guardar datos cobertura adicional';
export const POST_CONDICIONES_VENTA = '[PlanCobertura] Guardar datos condiciones venta';
export const POST_RECONOCIMIENTO_POR_PERMANENCIA = '[PlanCobertura] Guardar datos reconocimientos por permanencia';
export const POST_POSICION_STEP = '[PlanCobertura] Asigna la posición del step';
export const POST_LIMITACION_COBERTURA = '[PlanCobertura] Guardar limitación cobertura';
export const CLEAN = '[PlanCobertura] Limpiar';

export class PostDatosPrincipalesAction implements Action {
  readonly type = POST_DATOS_PRINCIPALES;
  constructor(public object: MimPlanCobertura, public stepec: GuardarPlanCoberturaOrden, public id: string, public estado: Estado) { }
}

export class GetDatosPrincipalesAction implements Action {
  readonly type = GET_DATOS_PRINCIPALES;
}

export class PostCondicionesAction implements Action {
  readonly type = POST_CONDICIONES;
  constructor(public object: IPage<MimCondicion>, public id: string, public estado: Estado) { }
}

export class PostCondicionesAsistencia implements Action {
  readonly type = POST_CONDICIONES_ASISTENCIA;
  constructor(public object: IPage<MimAsistenciaPlanCobertura>, public id: string, public estado: Estado) { }
}

export class PostPeriodosCarenciaAction implements Action {
  readonly type = POST_PERIODOS_CARENCIA;
  constructor(public object: IPage<MimPeriodoCarencia>, public id: string, public estado: Estado) { }
}

export class PostReglasExcepcionesAction implements Action {
  readonly type = POST_REGLAS_EXCEPCIONES;
  constructor(public object: IPage<MimReglasExcepciones>, public id: string, public estado: Estado) { }
}

export class PostDeduciblesAction implements Action {
  readonly type = POST_DEDUCIBLES;
  constructor(public object: IPage<MimDeducible>, public id: string, public estado: Estado) { }
}

export class PostValorRescateAction implements Action {
  readonly type = POST_VALOR_RESCATE;
  constructor(public object: IPage<MimValorRescate>, public id: string, public estado: Estado) { }
}

export class PostDesmembracionAccidenteAction implements Action {
  readonly type = POST_DESMEMBRACION_ACCIDENTE;
  constructor(public object: IPage<MimDesmembracionAccidente>, public id: string, public estado: Estado) { }
}

export class PostValorCuotaAction implements Action {
  readonly type = POST_VALOR_CUOTA;
  constructor(public object: IPage<MimValorCuota>, public id: string, public estado: Estado) { }
}

export class PostValorAseguradoAction implements Action {
  readonly type = POST_VALOR_ASEGURADO;
  constructor(public object: IPage<MimValorAsegurado>, public id: string, public estado: Estado) { }
}

export class PostExclusionesAction implements Action {
  readonly type = POST_EXCLUSIONES;
  constructor(public exclusion: IPage<MimExclusionPlanCobertura>, public id: string, public estado: Estado) { }
}

export class PostBeneficioPreexistenciaAction implements Action {
  readonly type = POST_BENEFICIO_PREEXISTENCIA;
  constructor(public object: IPage<MimBeneficioPreexistencia>, public id: string, public estado: Estado) { }
}

export class PostConceptoFacturacionPlanCoberturaAction implements Action {
  readonly type = POST_CONCEPTO_FACTURACION;
  constructor(public object: IPage<MimConceptoFacturacionPlanCobertura>, public id: string, public estado: Estado) { }
}

export class PostEnfermedadGravePlanCoberturaAction implements Action {
  readonly type = POST_ENFERMEDAD_GRAVE;
  constructor(public object: IPage<MimEnfermedadGravePlanCobertura>, public id: string, public estado: Estado) { }
}

export class PostCoberturaSusbsistenteAction implements Action {
  readonly type = POST_COBERTURA_SUBSISTENTES;
  constructor(public object: IPage<MimSubsistentePlanCobertura>, public id: string, public estado: Estado) { }
}

export class PostCoberturaAdicionalAction implements Action {
  readonly type = POST_COBERTURA_ADICIONALES;
  constructor(public object: IPage<MimAdicionalPlanCobertura>, public id: string, public estado: Estado) { }
}

export class PostLimitacionCoberturaAction implements Action {
  readonly type = POST_LIMITACION_COBERTURA;
  constructor(public maximoDiasPagarEvento: number,
    public object1: IPage<MimExcepcionDiagnostico>,
    public object2: IPage<MimCondicionPagoAntiguedad>,
    public object3: IPage<MimSublimiteCobertura>,
    public object4: IPage<MimCondicionesPagarEvento>, public id: string, public estado: Estado) { }
}

export class PostReconocimientosPorPermanenciaAction implements Action {
  readonly type = POST_RECONOCIMIENTO_POR_PERMANENCIA;
  constructor(public object: IPage<MimReconocimientoPorPermanencia>, public id: string, public estado: Estado) { }
}

export class PostCondicionesVentaPlanCoberturaAction implements Action {
  readonly type = POST_CONDICIONES_VENTA;
  constructor(public object: IPage<MimCondicionesVentaPlanCobertura>, public id: string, public estado: Estado) { }
}

export class PostPosicionStep implements Action {
  readonly type = POST_POSICION_STEP;
  constructor(public posicion: number) { }
}

export class CleanAction implements Action {
  readonly type = CLEAN;
}

export type acciones = PostDatosPrincipalesAction | GetDatosPrincipalesAction | PostCondicionesAction
  | PostCondicionesAsistencia | PostPeriodosCarenciaAction | PostDeduciblesAction
  | PostValorRescateAction | PostDesmembracionAccidenteAction | CleanAction | PostValorAseguradoAction
  | PostExclusionesAction | PostLimitacionCoberturaAction | PostBeneficioPreexistenciaAction
  | PostCoberturaSusbsistenteAction | PostEnfermedadGravePlanCoberturaAction
  | PostCoberturaAdicionalAction | PostConceptoFacturacionPlanCoberturaAction
  | PostPosicionStep | PostCondicionesVentaPlanCoberturaAction | PostValorCuotaAction
  | PostReconocimientosPorPermanenciaAction | PostReglasExcepcionesAction;
