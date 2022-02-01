import * as menuUI from './menu-principal.accions';

export interface State {
    codeMenuPadreActivar: string;
    nombreMenuPadre: string;
    codeMenuPrimerNivel: string;
}

const initState: State = {
    codeMenuPadreActivar: '',
    nombreMenuPadre: '',
    codeMenuPrimerNivel: ''
};

export function menuPrincipalReducer(state = initState, action: menuUI.Acciones): State {
    switch (action.type) {
        case menuUI.SET_MENU:
            return {
                ...state,
                codeMenuPadreActivar: action.codeMenuPadreActivar,
                nombreMenuPadre: action.nombreMenuPadre,
                codeMenuPrimerNivel: action.codeMenuPrimerNivel
            };
        case menuUI.GET_MENU:
            return {
                ...state,
                codeMenuPadreActivar: action.codeMenuPadreActivar,
                nombreMenuPadre: action.nombreMenuPadre,
                codeMenuPrimerNivel: action.codeMenuPrimerNivel
            };
        default:
            return state;
    }
}
