import { createAction, props } from '@ngrx/store';

export const mostrarMenuConsultas = createAction(
    '[PORTAFOLIO ASOCIADO] Mostrar Ocultar submenu consultas',
    props<{datos: boolean}>()
);

export const mostrarDetalleAsociado = createAction(
    '[PORTAFOLIO ASOCIADO] Mostrar - Ocultar barra superior detalle asociado',
    props<{datos: boolean}>()
);
