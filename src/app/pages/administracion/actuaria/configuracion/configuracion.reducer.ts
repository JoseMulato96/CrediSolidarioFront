import { createReducer, on } from '@ngrx/store';
import { ConfiguracionActuariaModel } from '../models/configuracion-actuaria.model';
import * as action from './configuracion.actions';

export const estadoInicial: ConfiguracionActuariaModel = null;

const _configuracionReducer = createReducer(estadoInicial,
  on(action.listarConceptoDistribucion, (state, { datos }) => {
    return {
      ...state,
      conceptoDistribucion: datos
    };
  }),
  on(action.listarCargueMasivo, (state, { datos }) => {
    return {
      ...state,
      cargueMasivoFactores: datos
    };
  }),
  on(action.coberturasCargueMasivo, (state, { datos }) => {
    return {
      ...state,
      coberturasCargueMasivo: datos
    };
  }),
  on(action.factoresCargueMasivo, (state, { datos }) => {
    return {
      ...state,
      factores: datos
    };
  })
);

export function configuracionReducer(state, action) {
  return _configuracionReducer(state, action);
}
