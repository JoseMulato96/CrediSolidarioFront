
import { MimTipoConcepto } from './mim-tipo-concepto.model';
import { SipConceptoFacturacion } from './sip-concepto-facturacion.model';
import { SipProducto } from './sip-producto.model';

export class MimConceptoFacturacionPlanCobertura {

  sipProducto: SipProducto;
  sipConceptoFacturacion: SipConceptoFacturacion;
  mimTipoConcepto: MimTipoConcepto;

  constructor(objeto: IMimConceptoFacturacionPlanCobertura) {
    this.sipProducto = objeto && objeto.sipProducto || null;
    this.sipConceptoFacturacion = objeto && objeto.sipConceptoFacturacion || null;
    this.mimTipoConcepto = objeto && objeto.mimTipoConcepto || null;
  }
}

export interface IMimConceptoFacturacionPlanCobertura {
  sipProducto: SipProducto;
  sipConceptoFacturacion: SipConceptoFacturacion;
  mimTipoConcepto: MimTipoConcepto;
}
