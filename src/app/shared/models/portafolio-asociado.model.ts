import { PlanAsociado } from './plan-asociado.model';

export class PortafolioAsociado {
  codigo: number;
  asoNumInt: number;
  vinCuotaAcumulada: number;
  vinDesc = '';
  vinTipoCambio: null;
  vinCumpleRangos = '';
  vinAuxilioFunerario = '';
  vinEstado = '';
  fechaRegistro = '';
  usuario = '';
  vinFechaVinculacion = '';
  vinFechaRenuncia: null;
  vinFechaCambio: null;
  fechaMigracion = '';
  vinIncrementoAnual = '';
  cc: number;
  vinProteccionAcumuladaTotal: number;
  /**
   * @author: Jorge Luis Caviedes Alvarado
   * @description Protección Acumulada Vida
   */
  vinProteccionAcumulada: number;
  /**
   * @author: Jorge Luis Caviedes Alvarado
   * @description Protección Acumulada Perseverancia
   */
  vinPerseveranciaAcumulada: number;
  /**
   * @author: Jorge Luis Caviedes Alvarado
   * @description Protección Acumulada Renta Diaria
   */
  vinRentaAcumulada: number;
  vinAltoCostoAcumulado: number;
  vinIndFechaNacimiento: number;
  vinSolvenciasAcumulado: number;
  vinIncrementoUga: number;
  sipVinculacionesClasificacion: {};
  colCod: number;
  categoriasPlanes: Map<string, PlanAsociado[]>[];
}
