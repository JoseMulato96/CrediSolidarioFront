import { Injectable } from '@angular/core';
import { IDefinicionPagoEvento } from '@shared/models/definicion-pago-evento.model';
import { IRegistraSolicitud } from '@shared/models/registra-solicitud.model';

@Injectable()
export class DatosEventoService {

  private registraSolicitud: IRegistraSolicitud;
  private definicionPago: IDefinicionPagoEvento;

  constructor() {
    // do nothing
  }

  setRegitraSolicitud(registraSolicitud: IRegistraSolicitud) {
    this.registraSolicitud = registraSolicitud;
  }

  setDefinicionPago(definicionPago: IDefinicionPagoEvento) {
    this.definicionPago = definicionPago;
  }

  getRegistraSolicitud() {
    return this.registraSolicitud;
  }

  getDefinicionPago() {
    return this.definicionPago;
  }

}
