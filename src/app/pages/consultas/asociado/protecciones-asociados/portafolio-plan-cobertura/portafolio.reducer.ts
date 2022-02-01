import { createReducer, on } from '@ngrx/store';
import * as acciones from './portafolio.actions';
import { PortafolioAsociadoModel } from './model/portafolio-asociado.model';

export const estadoInicial: PortafolioAsociadoModel = null;

const _portafolioReducer = createReducer(estadoInicial,
  on(acciones.mostrarMenuConsultas, (state, {datos}) => ({...state, mostrarSubMenuConsultas: datos})),
  on(acciones.mostrarDetalleAsociado, (state, {datos}) => ({...state, mostrarDetalleAsociado: datos}))
);

export function portafolioReducer(state, action) {
  return _portafolioReducer(state, action);
}
