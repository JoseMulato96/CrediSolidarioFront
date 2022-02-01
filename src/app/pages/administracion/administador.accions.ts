import { Action } from '@ngrx/store';

export const ACTIVAR_PANEL = '[Administracion Panel] Abrir panel...';
export const DESACTIVAR_PANEL = '[Administracion Panel] Cerrar panel...';
export const CONSULTAR_ENTIDAD = '[Administracion GetEntidad] consultar entidad...';
export const CONSULTAR_CAMPOS_ENTIDAD = '[Administracion GetCampoEntidad] consultar campos entidad...';
export const CONSULTAR_NOVEDADES = '[Administracion GetNovedades] consultar novedades...';
export const AGREGAR_NOVEDAD = '[Administracion AddNovedad] Agregando novedad...';
export const AGREGAR_ENTIDAD = '[Administracion AddFieldTable] Agregando entidad...';
export const ELIMINAR_ENTIDAD = '[Administracion deleteFieldTable] Eliminando entidad...';

export class ActivarPanelAction implements Action {
  readonly type = ACTIVAR_PANEL;
}
export class DesativarPanelAction implements Action {
  readonly type = DESACTIVAR_PANEL;
}

export class ConsultarEntidadAction implements Action {
  readonly type = CONSULTAR_ENTIDAD;
  constructor(public entidades: any) { }
}
export class ConsultarCamposEntidadAction implements Action {
  readonly type = CONSULTAR_CAMPOS_ENTIDAD;
  constructor(public entidad: string, camposEntidades: any) { }
}
export class ConsultarNovedadesAction implements Action {
  readonly type = CONSULTAR_NOVEDADES;
}
export class AgregarNovedadAction implements Action {
  readonly type = AGREGAR_NOVEDAD;
}

export class AgregarEntidadAction implements Action {
  readonly type = AGREGAR_ENTIDAD;
}
export class EliminarEntidadAction implements Action {
  readonly type = ELIMINAR_ENTIDAD;
}

export type Acciones = ActivarPanelAction
  | DesativarPanelAction
  | ConsultarEntidadAction
  | ConsultarCamposEntidadAction
  | ConsultarNovedadesAction
  | AgregarNovedadAction
  | AgregarEntidadAction
  | EliminarEntidadAction;
