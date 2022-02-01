/**
 * @description Modelo de facturacion de protecciones del asociado.
 *
 * @date 3/05/2019
 */
export class FacturacionProteccion {
  consecutivo: number;
  asoNumInt: number;
  periodoOr: number;
  periodo: string;
  estado: number;
  valorGenerado: number;
  valorPagado: number;
  tipo: number;
  valorFacturado: number;
  tipoNombreCorto: string;
  estadoNombreCorto: string;
  tipoNombre: string;
  estadoEstado: string;
  tipoEstado: string;
  estadoNombre: string;
  valorCuota: number;
  fechaPago: Date;
  prodCodigo: number;
  valorMora: number;
  pagoMora: number;
  saldoMora: number;
  observacion: string;
  usuario: string;
  fechaAjuste: string;
  saldoValorFacturado: number;
  valorDescapitalizado: number;
  prodDescripcion?: string;
  valorProteccion?: number;
  usuarioEmpleado: any;
  _usuarioEmpleado: any;
  concepto: string;
}
