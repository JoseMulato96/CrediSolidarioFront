import { createAction, props } from '@ngrx/store';

export const listarMaestroCuentas = createAction(
    '[FINANCIERA] listar Maestro de cuentas',
    props<{datos: any}>()
);
export const listarMaestroUsoLocal = createAction(
    '[FINANCIERA] listar Maestro de uso local',
    props<{datos: any}>()
);
export const listarRelacionConceptosDistribuciónCuenta = createAction(
        '[FINANCIERA] listar relación concepto de distribución y cuenta',
        props<{datos: any}>()
    );
