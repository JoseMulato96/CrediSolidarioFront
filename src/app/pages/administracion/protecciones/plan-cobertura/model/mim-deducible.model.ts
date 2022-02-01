import { MimPlanCobertura, IMimPlanCobertura } from './mim-plan-cobertura.model';
import { MimTipoDeducible, IMimTipoDeducible } from './mim-tipo-deducible.model';
import { MimTipoPago, IMimTipoPago } from './mim-tipo-pago.model';
import { IMimTipoRestitucionDeducible, MimTipoRestitucionDeducible } from './mim-tipo-restitucion-deducible.model';

export class MimDeducible {

  codigo: string;
  mimPlanCobertura: MimPlanCobertura;
  mimTipoDeducible: MimTipoDeducible;
  mimTipoPago: MimTipoPago;
  mimTipoRestitucionDeducible: MimTipoRestitucionDeducible;
  cantidad: number;
  aplicaProrroga: boolean;
  discontinuidadCalendario: number;
  fechaInicio: string;
  fechaFin: string;
  estado: boolean;

  constructor(objeto: IMimDeducible) {
    this.codigo = objeto && objeto.codigo || null;
    this.mimPlanCobertura = objeto && objeto.mimPlanCobertura || null;
    this.mimTipoDeducible = objeto && objeto.mimTipoDeducible || null;
    this.mimTipoPago = objeto && objeto.mimTipoPago || null;
    this.mimTipoRestitucionDeducible = objeto && objeto.mimTipoRestitucionDeducible || null;
    this.cantidad = objeto && objeto.cantidad || 0;
    this.discontinuidadCalendario = objeto && objeto.discontinuidadCalendario || null;
    this.aplicaProrroga = objeto && objeto.aplicaProrroga || false;
    this.fechaInicio = objeto && objeto.fechaInicio || null;
    this.fechaFin = objeto && objeto.fechaFin || null;
    this.estado = objeto && objeto.estado || false;
  }
}

export interface IMimDeducible {
  codigo: string;
  mimPlanCobertura: IMimPlanCobertura;
  mimTipoDeducible: IMimTipoDeducible;
  mimTipoPago: IMimTipoPago;
  mimTipoRestitucionDeducible: IMimTipoRestitucionDeducible;
  cantidad: number;
  aplicaProrroga: boolean;
  discontinuidadCalendario: number;
  fechaInicio: string;
  fechaFin: string;
  estado: boolean;
}
