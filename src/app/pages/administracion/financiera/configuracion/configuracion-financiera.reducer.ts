import { createReducer, on } from '@ngrx/store';
import * as action from './configuracion.actions';
import { ConfiguracionFinancieraModel } from '../models/configuracion-financiera.model';

export const estadoInicial: ConfiguracionFinancieraModel = null;

const _configuracionFinancieraReducer = createReducer(estadoInicial,
  on(action.listarMaestroCuentas, (state, {datos}) => {
    return {
      ...state,
      maestroCuentas: datos
    };
  }),
  on(action.listarMaestroUsoLocal, (state, {datos}) => {
    return {
      ...state,
      maestroUsoLocal: datos
    };
  }),
  on(action.listarRelacionConceptosDistribuciónCuenta, (state, {datos}) => {
    return {
      ...state,
      relacionConceptosDeDistribucionCuenta: datos
    };
  })
);

export function configuracionFinancieraReducer(state, action) {
  return _configuracionFinancieraReducer(state, action);
}
