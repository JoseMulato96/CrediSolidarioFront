/**
 * @class numero-caso-filtro
 * @date 26/04/2019
 * @description modelo de filtro de numero de caso
 * Copyright: Informática & Tecnología Stefanini S.A. All rights reserved
 */
export interface IPulldownAccionFiltro {
  nombre: string;
  sipParametrosPK: {};
  valor: number;
}

export interface IPulldownCorteFiltro {
  nombre: string;
  sipParametrosPK: {};
  valor: number;
  label: string;
}

export interface IPulldownAuxilioFiltro {
  codigoAuxilioXtremo: number;
  tipDescripcion: string;
  tipEstado: string;
  tipIdTipoAuxilio: number;
}

export interface IPulldownSolicitudFiltro {
  tipCodigo: number;
  tipNombre: string;
  tipDescripcion: string;
}
