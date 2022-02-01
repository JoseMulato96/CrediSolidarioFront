export const ESTADO_ASOCIADO = 'estadoAsociado';
export const SIP_ASOCIADOS_VALIDAR_ESTADO_INACTIVO = 'sipAsociadosValidarEstadoInactivo';
export const SIP_ASOCIADOS_VALIDAR_ESTADO_ACTIVO = 'sipAsociadosValidarEstadoActivo';
export const SIP_ASOCIADOS_VALIDAR_ESTADO_ACTIVO_NORMAL = 'sipAsociadosValidarEstadoActivoNormal';

export class ValidacionesParametrosFactory {

  static parametrosSipAsociadosValidarEstadoInactivo(estadoAsociado: any) {
    const parametrosSipAsociadosValidarEstadoInactivo = {};

    parametrosSipAsociadosValidarEstadoInactivo[ESTADO_ASOCIADO] = estadoAsociado;
    return parametrosSipAsociadosValidarEstadoInactivo;
  }

  static parametrosSipAsociadosValidarEstadoActivo(estadoAsociado: any) {
    const parametrosSipAsociadosValidarEstadoActivo = {};
    parametrosSipAsociadosValidarEstadoActivo[ESTADO_ASOCIADO] = estadoAsociado;
    return parametrosSipAsociadosValidarEstadoActivo;
  }

  static parametrosSipAsociadosValidarEstadoActivoNormal(estadoAsociado: any) {
    const parametrosSipAsociadosValidarEstadoActivoNormal = {};
    parametrosSipAsociadosValidarEstadoActivoNormal[ESTADO_ASOCIADO] = estadoAsociado;
    return parametrosSipAsociadosValidarEstadoActivoNormal;
  }

}
