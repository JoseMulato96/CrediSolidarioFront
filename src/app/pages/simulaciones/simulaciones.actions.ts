import { Action } from '@ngrx/store';
import { Estado } from './models/Estados';
import { MimSimulaciones } from './models/mimSimulaciones';

export const POST_DATOS_ASOCIADO = '[Simulaciones valor-devolver] cargar datos asociados...';
export const GET_DATOS_ASOCIADO = '[Simulaciones valor-devolver] ver datos asociados...';
export const POST_VALORES_DEVOLVER = '[Simulaciones valores-devolver] cargar valores devolver...';
export const GET_VALORES_DEVOLVER = '[Simulaciones valores-devolver] ver valores devolver...';
export const POST_VALORES_DEVOLVER_CANCELADOS = '[Simulaciones valores-devolver] cargar valores cancelado...';
export const GET_VALORES_DEVOLVER_CANCELADOS = '[Simulaciones valores-devolver] ver valores cancelado...';
export const POST_LIMPIAR_DATOS_CANCELADOS = '[Simulaciones limpiar-valores-devolver] limpiar valores cancelado...';
export const GET_LIMPIAR_DATOS_CANCELADOS = '[Simulaciones limpiar-valores-devolver] ver limpiar valores cancelado...';
export const CLEAN = '[Simulaciones] Limpiar';

export class PostDatosAsociadosAction implements Action {
    readonly type = POST_DATOS_ASOCIADO;
    constructor(public object: MimSimulaciones, public id: string, public estado: Estado) { }
}

export class GetDatosAsociadosAction implements Action {
    readonly type = GET_DATOS_ASOCIADO;
}

export class PostValoresDevolverAction implements Action {
    readonly type = POST_VALORES_DEVOLVER;
    constructor(public object: MimSimulaciones, public id: string, public estado: Estado) { }
}

export class GetValoresDevolverAction implements Action {
    readonly type = GET_VALORES_DEVOLVER;
}

export class PostValoresDevolverCanceladosAction implements Action {
    readonly type = POST_VALORES_DEVOLVER_CANCELADOS;
    constructor(public object: any, public id: string, public estado: Estado) { }
}

export class GetValoresDevolverCanceladosAction implements Action {
    readonly type = GET_VALORES_DEVOLVER_CANCELADOS;
}

export class PostLimpiarTablaAction implements Action {
    readonly type = POST_LIMPIAR_DATOS_CANCELADOS;
    constructor(public object: boolean, public id: string, public estado: Estado) { }
}

export class GetLimpiarTablaAction implements Action {
    readonly type = GET_LIMPIAR_DATOS_CANCELADOS;
}

export class CleanAction implements Action {
    readonly type = CLEAN;
}

export type acciones = PostDatosAsociadosAction |
    GetDatosAsociadosAction | PostValoresDevolverAction |
    GetValoresDevolverAction | PostValoresDevolverCanceladosAction |
    GetValoresDevolverCanceladosAction | PostLimpiarTablaAction | GetLimpiarTablaAction |
    CleanAction;
