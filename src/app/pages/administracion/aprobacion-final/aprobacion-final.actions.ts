import { Action } from '@ngrx/store';
export const DATOS_PLAN = '[AprobacionFinal] Listar datos plan';
export const CONDICIONES = '[AprobacionFinal] Listar condiciones';
export const DEDUCIBLES = '[AprobacionFinal] Listar deducibles';
export const PERIODOS_CARENCIA = '[AprobacionFinal] Listar periodos carencia';
export const EXCLUSIONES = '[AprobacionFinal] Listar datos exclusiones';
export const COBERTURAS_SUBSISTENTES = '[AprobacionFinal] Listar datos cobertura subsistente';
export const COBERTURAS_ADICIONALES = '[AprobacionFinal] Listar datos cobertura adicional';
export const VALORES_RESCATE = '[AprobacionFinal] Listar valor rescate';
export const DESMEMBRACION_ACCIDENTE = '[AprobacionFinal] Listar desmembración accidente';
export const VALORES_ASEGURADOS = '[AprobacionFinal] Listar valor asegurado';
export const LIMITACIONES_COBERTURA = '[AprobacionFinal] Listar limitación cobertura';
export const ENFERMEDADES_GRAVES = '[AprobacionFinal] Listar datos enfermedades graves';
export const BENEFICIOS_PREEXISTENCIA = '[AprobacionFinal] Listar datos beneficio preexistencia';
export const CONDICIONES_ASISTENCIA = '[AprobacionFinal] Listar condiciones de asistencia';
export const CARGUE_FACTORES = '[AprobacionFinal] Listar cargue factores';
export const CONCEPTOS_FACTURACION = '[AprobacionFinal] Listar conceptos de facturación';
export const CONCEPTOS_DISTRIBUCION_CUENTA = '[AprobacionFinal] Listar relación conceptos de distribución y cuenta';

export class DatosPlanAction implements Action {
  readonly type = DATOS_PLAN;
  constructor(public datos: any) { }
}

export class CondicionesAction implements Action {
  readonly type = CONDICIONES;
  constructor(public datos: any) { }
}

export class DeduciblesAction implements Action {
  readonly type = DEDUCIBLES;
  constructor(public datos: any) { }
}

export class PeriodosCarenciaAction implements Action {
  readonly type = PERIODOS_CARENCIA;
  constructor(public datos: any) { }
}

export class ExclusionesAction implements Action {
  readonly type = EXCLUSIONES;
  constructor(public datos: any) { }
}

export class CoberturasSubsistentesAction implements Action {
  readonly type = COBERTURAS_SUBSISTENTES;
  constructor(public datos: any) { }
}

export class CoberturasAdicionalesAction implements Action {
  readonly type = COBERTURAS_ADICIONALES;
  constructor(public datos: any) { }
}

export class ValoresRescateAction implements Action {
  readonly type = VALORES_RESCATE;
  constructor(public datos: any) { }
}

export class DesmembracionAccidenteAction implements Action {
  readonly type = DESMEMBRACION_ACCIDENTE;
  constructor(public datos: any) { }
}

export class ValoresAseguradosAction implements Action {
  readonly type = VALORES_ASEGURADOS;
  constructor(public datos: any) { }
}

export class LimitacionesCoberturaAction implements Action {
  readonly type = LIMITACIONES_COBERTURA;
  constructor(public datos: any) { }
}

export class EnfermedadesGravesAction implements Action {
  readonly type = ENFERMEDADES_GRAVES;
  constructor(public datos: any) { }
}

export class BeneficiosPreexistenciaAction implements Action {
  readonly type = BENEFICIOS_PREEXISTENCIA;
  constructor(public datos: any) { }
}

export class CondicionesAsistenciaAction implements Action {
  readonly type = CONDICIONES_ASISTENCIA;
  constructor(public datos: any) { }
}

export class CargueFactoresAction implements Action {
  readonly type = CARGUE_FACTORES;
  constructor(public datos: any) { }
}

export class ConceptosFacturacionAction implements Action {
  readonly type = CONCEPTOS_FACTURACION;
  constructor(public datos: any) { }
}

export class ConceptosDistribucionCuentaAction implements Action {
  readonly type = CONCEPTOS_DISTRIBUCION_CUENTA;
  constructor(public datos: any) { }
}

export type acciones = DatosPlanAction | CondicionesAction | DeduciblesAction | PeriodosCarenciaAction |
ExclusionesAction | CoberturasSubsistentesAction | CoberturasAdicionalesAction | ValoresRescateAction | DesmembracionAccidenteAction |
ValoresAseguradosAction | LimitacionesCoberturaAction | EnfermedadesGravesAction | BeneficiosPreexistenciaAction |
CondicionesAsistenciaAction | CargueFactoresAction | ConceptosFacturacionAction | ConceptosDistribucionCuentaAction;

