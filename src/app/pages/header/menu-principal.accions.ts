import {Action} from '@ngrx/store';

export const SET_MENU = '[Menu Principal set] set menu padre...';
export const GET_MENU = '[Menu Principal get] get menu padre...';

export class SetMenuPadre implements Action {
    readonly type = SET_MENU;
    constructor( public codeMenuPadreActivar: string, public nombreMenuPadre: string, public codeMenuPrimerNivel: string ) { }
}

export class GetMenuPadre implements Action {
    readonly type = GET_MENU;
    constructor( public codeMenuPadreActivar: string, public nombreMenuPadre: string, public codeMenuPrimerNivel: string ) { }
}

export type Acciones = SetMenuPadre |
                     GetMenuPadre;
