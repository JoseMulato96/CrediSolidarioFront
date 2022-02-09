import { Section0Model } from "./section0-model";

export class Section3Part1Model extends Section0Model {
  public consTransaccion?: string;
  public nombreEntidad: string;
  public moneda: number;
  public monto: number;
  public tipoProducto: number;
  public identificacionProducto: string;
  public ciudad: number;
  public consEconomia?: number;
}

export class Section3Part2Model extends Section0Model {
  public consEconomia?: number = 0;
  public cargo: string = "";
  public nombreEmpresa: string = "";
  public ciudadEmpresa: number = 0;
  public telefonoEmpresa: string = "";
  public barrio: string = "";
  public direccion: string = "";
  public ingresosMensuales: number = 0;
  public egresosMensuales: number = 0;
  public otrosIngresos: string = "";
  public valorOtrosIngresos: number;
  public totalActivos: number = 0;
  public operacionesMonedaExtranjera: number = 0;
  public totalPasivos: number = 0;
  public tipoTransaccion: number = 0;
  public consTransaccion: string = "";
  public ocupacion: number = 0;
  public codigoCiiu: number = 0;
  public extensionEmpresa: string = "";
  public pregAportaCarta: number;
  public nombreContador: string = "";
  public cedulaContador: string = "";
  public telefonoContador: string = "";
  public numTarjetaContador: string = "";
  public tipoContrato: number;
}
