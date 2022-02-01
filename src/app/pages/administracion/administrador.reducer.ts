import * as fromUI from './administador.accions';

export interface State {
  activarPanel: boolean;
  novedad: any;
  entidades: any;
}

const initState: State = {
  activarPanel: false,
  novedad: {},
  entidades: {}
};

export function adminReducer(state = initState, action: fromUI.Acciones): State {

  switch (action.type) {
    case fromUI.ACTIVAR_PANEL:
      return {
        ...state,
        activarPanel: true
      };
    case fromUI.DESACTIVAR_PANEL:
      return {
        ...state,
        activarPanel: false
      };
    case fromUI.CONSULTAR_ENTIDAD:
      return {
        ...state,
        entidades: action.entidades
      };
    case fromUI.CONSULTAR_CAMPOS_ENTIDAD:
      return state;
    case fromUI.CONSULTAR_NOVEDADES:
      return state;
    case fromUI.AGREGAR_NOVEDAD:
      return state;
    case fromUI.AGREGAR_ENTIDAD:
      return state;
    case fromUI.ELIMINAR_ENTIDAD:
      return state;
    default:
      return state;
  }
}
