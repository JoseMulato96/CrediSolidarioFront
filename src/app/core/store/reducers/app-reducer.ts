// tslint:disable-next-line: max-line-length
import {
  ACTION_CONSULTA_STATE_ASOCIADO, ACTION_GET_DATA_ASOCIADO, ACTION_SET_DATA_ASOCIADO
} from '../actions/app-action';

export interface State {
  asociadoDato: {};
  asociadoDatoState: string;
}

const initialState: State = {
  asociadoDato: {},
  asociadoDatoState: ''
};

export function AppReducer(state = initialState, action): State {
  switch (action.type) {

    case ACTION_GET_DATA_ASOCIADO:
      return {
        ...state,
        asociadoDatoState: action.type
      };

    case ACTION_CONSULTA_STATE_ASOCIADO:
      return {
        ...state,
        asociadoDatoState: action.type
      };

    case ACTION_SET_DATA_ASOCIADO:
      return {
        ...state,
        asociadoDato: action.payload,
        asociadoDatoState: action.type
      };
    default:
      return state;
  }
}
