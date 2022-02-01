import { Action } from '@ngrx/store';
import { ParametrosConfiguracionOperaciones, Estado } from './model/parametros-configuracion-operaciones';

export const POST_PARAMETROS_CONFIGURACION = '[PostParametrosConfiguracion] Guardar los datos de parametros configuracion';
export const GET_PARAMETROS_CONFIGURACION = '[GetParametrosConfiguracion] Consultar los datos de parametros configuracion';

export class PostParametrosConfiguracion implements Action {
    readonly type = POST_PARAMETROS_CONFIGURACION;
    constructor(public object: ParametrosConfiguracionOperaciones, public id: string, public estado: Estado) { }
}

export class GetParametrosConfiguracionAction implements Action {
    readonly type = GET_PARAMETROS_CONFIGURACION;
}

export type acciones = PostParametrosConfiguracion | GetParametrosConfiguracionAction;
