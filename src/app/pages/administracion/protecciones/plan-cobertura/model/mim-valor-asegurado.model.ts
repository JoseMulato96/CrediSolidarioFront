import { MimPlanCobertura } from './mim-plan-cobertura.model';
import { MimTipoValorAsegurado } from './mim-tipo-valor-asegurado.model';
import { MimTipoReconocido } from './mim-tipo-reconocido.model';
import { MimTipoValorRestitucion } from './mim-tipo-valor-restitucion.model';
import { MimTipoPeriodicidad } from './mim-tipo-periodicidad.model';
import { MimValorAseguradoTope } from './mim-valor-asegurado-tope.model';
import { MimValorAseguradoPlanCobertura } from './mim-valor-asegurado-plan-cobertura.model';
import { MimPresentacionPortafolio } from './mim-presentacion-portafolio';

export class MimValorAsegurado {

  codigo: number;
  mimPlanCobertura: MimPlanCobertura;
  mimTipoValorAsegurado: MimTipoValorAsegurado;
  esUnRangoDePorcentaje: boolean;
  porcentajeAseguradoInicial: Number;
  porcentajeAseguradoFinal: Number;
  mesesPromedio: Number;
  promedioCobertura: Number;
  observacion: string;
  mimTipoReconocido: MimTipoReconocido;
  valorAsegurado: number;
  tieneValorSublimite: boolean;
  mimTipoValorRestitucion: MimTipoValorRestitucion;
  esUnaRenta: boolean;
  mimTipoPeriodicidad: MimTipoPeriodicidad;
  fechaVigenteInicio: string;
  fechaVigenteFin: string;
  estado: boolean;
  mimValorAseguradoPlanCoberturaList: MimValorAseguradoPlanCobertura[];
  mimValorAseguradoTopeList: MimValorAseguradoTope[];
  fechaInicioRestitucion: string;
  fechaFinRestitucion: string;
  rentaMinimaPagar: number;
  rentaMaximaPagar: number;
  mimPresentacionPortafolio : MimPresentacionPortafolio;

  constructor(obj: IMimValorAsegurado) {
    this.codigo = obj && obj.codigo || null;
    this.mimPlanCobertura = obj && obj.mimPlanCobertura || null;
    this.mimTipoValorAsegurado = obj && obj.mimTipoValorAsegurado || null;
    this.esUnRangoDePorcentaje = obj && obj.esUnRangoDePorcentaje || false;
    this.porcentajeAseguradoInicial = obj && obj.porcentajeAseguradoInicial || null;
    this.porcentajeAseguradoFinal = obj && obj.porcentajeAseguradoFinal || null;
    this.mesesPromedio = obj && obj.mesesPromedio || null;
    this.promedioCobertura = obj && obj.promedioCobertura || null;
    this.observacion = obj && obj.observacion || null;
    this.mimTipoReconocido = obj && obj.mimTipoReconocido || null;
    this.valorAsegurado = obj && obj.valorAsegurado || null;
    this.tieneValorSublimite = obj && obj.tieneValorSublimite || null;
    this.mimTipoValorRestitucion = obj && obj.mimTipoValorRestitucion || null;
    this.esUnaRenta = obj && obj.esUnaRenta || false;
    this.mimTipoPeriodicidad = obj && obj.mimTipoPeriodicidad || null;
    this.fechaVigenteInicio = obj && obj.fechaVigenteInicio || null;
    this.fechaVigenteFin = obj && obj.fechaVigenteFin || null;
    this.estado = obj && obj.estado || false;
    this.mimValorAseguradoPlanCoberturaList = obj && obj.mimValorAseguradoPlanCoberturaList || null;
    this.mimValorAseguradoTopeList = obj && obj.mimValorAseguradoTopeList || null;
  }
}

export class IMimValorAsegurado {
  codigo: number;
  mimPlanCobertura: MimPlanCobertura;
  mimTipoValorAsegurado: MimTipoValorAsegurado;
  esUnRangoDePorcentaje: boolean;
  porcentajeAseguradoInicial: Number;
  porcentajeAseguradoFinal: Number;
  mesesPromedio: Number;
  promedioCobertura: Number;
  observacion: string;
  mimTipoReconocido: MimTipoReconocido;
  valorAsegurado: number;
  tieneValorSublimite: boolean;
  mimTipoValorRestitucion: MimTipoValorRestitucion;
  esUnaRenta: boolean;
  mimTipoPeriodicidad: MimTipoPeriodicidad;
  fechaVigenteInicio: string;
  fechaVigenteFin: string;
  estado: boolean;
  mimValorAseguradoPlanCoberturaList: MimValorAseguradoPlanCobertura[];
  mimValorAseguradoTopeList: MimValorAseguradoTope[];
  fechaInicioRestitucion: string;
  fechaFinRestitucion: string;
  rentaMinimaPagar: number;
  rentaMaximaPagar: number;
  mimPresentacionPortafolio : MimPresentacionPortafolio
}
