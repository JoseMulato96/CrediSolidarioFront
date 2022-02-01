import { AprobacionFinalModel, IAprobacionFinalModel } from './model/aprobacion-final.model';
import * as action from './aprobacion-final.actions';

export const estadoInicial: AprobacionFinalModel = null;

export function aprobacionFinalReducer(estado = estadoInicial, accion: action.acciones): IAprobacionFinalModel {
  switch (accion.type) {
    case action.DATOS_PLAN:
      return {
        ...estado,
        plan: accion.datos
      };
    case action.CONDICIONES:
      return {
        ...estado,
        condiciones: accion.datos
      };
    case action.DEDUCIBLES:
      return {
        ...estado,
        deducibles: accion.datos
      };
    case action.PERIODOS_CARENCIA:
      return {
        ...estado,
        periodosCarencia: accion.datos
      };
    case action.EXCLUSIONES:
      return {
        ...estado,
        exclusiones: accion.datos
      };
    case action.COBERTURAS_SUBSISTENTES:
      return {
        ...estado,
        coberturasSubsistentes: accion.datos
      };
    case action.COBERTURAS_ADICIONALES:
      return {
        ...estado,
        coberturasAdicionales: accion.datos
      };
    case action.VALORES_RESCATE:
      return {
        ...estado,
        valoresRescate: accion.datos
      };
    case action.VALORES_ASEGURADOS:
      return {
        ...estado,
        valoresAsegurados: accion.datos
      };
    case action.LIMITACIONES_COBERTURA:
      return {
        ...estado,
        limitacionesCobertura: accion.datos
      };
    case action.ENFERMEDADES_GRAVES:
      return {
        ...estado,
        enfermedadesGraves: accion.datos
      };
    case action.BENEFICIOS_PREEXISTENCIA:
      return {
        ...estado,
        beneficiosPreexistencia: accion.datos
      };
    case action.CONDICIONES_ASISTENCIA:
      return {
        ...estado,
        condicionesAsistencia: accion.datos
      };
    case action.CARGUE_FACTORES:
      return {
        ...estado,
        cargueFactores: accion.datos
      };
    case action.CONCEPTOS_FACTURACION:
        return {
          ...estado,
          conceptosFacturacion: accion.datos
        };
    case action.CONCEPTOS_DISTRIBUCION_CUENTA:
      return {
        ...estado,
        conceptosDistribucionCuenta: accion.datos
      };
    default:
      return estado;
  }
}
