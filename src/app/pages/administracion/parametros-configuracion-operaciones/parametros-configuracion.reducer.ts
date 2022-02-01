import * as fromParametrosConfiguracion from './parametros-configuracion.actions';
import { IparametrosConfiguracionOperaciones, ParametrosConfiguracionOperaciones } from './model/parametros-configuracion-operaciones';

let estadoInicial: ParametrosConfiguracionOperaciones;
export let State: IparametrosConfiguracionOperaciones;

export function parametrosConfiguracionReducer(state = estadoInicial, action: fromParametrosConfiguracion.acciones): IparametrosConfiguracionOperaciones {
    switch (action.type) {
        case fromParametrosConfiguracion.POST_PARAMETROS_CONFIGURACION:
            const parametrosConfiguracion = new ParametrosConfiguracionOperaciones(action.object);
            return {
                ...state,
                dataConfiguracionOperaciones: parametrosConfiguracion
            };
        case fromParametrosConfiguracion.GET_PARAMETROS_CONFIGURACION:
            return state;
    }
}

