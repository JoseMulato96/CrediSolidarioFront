import { createAction, props } from '@ngrx/store';

export const listarConceptoDistribucion = createAction(
    '[ACTUARIA] listar concepto distribución',
    props<{ datos: any }>()
);
export const listarCargueMasivo = createAction(
    '[ACTUARIA] listar Cargue masivo',
    props<{ datos: any }>()
);
export const coberturasCargueMasivo = createAction(
    '[ACTUARIA] coberturas en Cargue masivo',
    props<{ datos: any }>()
);
export const factoresCargueMasivo = createAction(
    '[ACTUARIA] factores en cargue masivo',
    props<{ datos: any }>()
);
export const crearConceptoDistribucion = createAction(
    '[ACTUARIA] crear concepto distribución',
    props<{ datos: any }>()
);
