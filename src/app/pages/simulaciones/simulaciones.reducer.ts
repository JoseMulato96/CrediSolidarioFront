import * as fromSimulacionesUI from './simulaciones.actions';
import { MimSimulaciones, IMimSimulaciones } from './models/mimSimulaciones';


let estadoInicial: MimSimulaciones;

export function SimulacionesReducer(state = estadoInicial, action: fromSimulacionesUI.acciones): IMimSimulaciones {

    switch (action.type) {
        case fromSimulacionesUI.POST_DATOS_ASOCIADO:
            return {
                ...state,
                mimDatosAsociados: action.object
            };
        case fromSimulacionesUI.GET_DATOS_ASOCIADO:
            return state;
        case fromSimulacionesUI.POST_VALORES_DEVOLVER:
            return {
                ...state,
                mimValoresDevolver: action.object
            };
        case fromSimulacionesUI.GET_VALORES_DEVOLVER:
            return state;
        case fromSimulacionesUI.POST_VALORES_DEVOLVER_CANCELADOS:
            return {
                ...state,
                mimValoresDevolverCancelacion: action.object
            };
        case fromSimulacionesUI.GET_VALORES_DEVOLVER_CANCELADOS:
            return state;
        case fromSimulacionesUI.POST_LIMPIAR_DATOS_CANCELADOS:
            return {
                ...state,
                limpiar: action.object
            };
        case fromSimulacionesUI.GET_LIMPIAR_DATOS_CANCELADOS:
            return state;
        default:
            return state;
    }
}
