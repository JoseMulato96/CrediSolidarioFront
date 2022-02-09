import { Section0Model } from "./section0-model";

export class Section5Model extends Section0Model {
  public consAutorizacion?: number = 0;
  public tipoCuenta: number = 0;
  public numeroCuenta: number = 0;
  public origenBien: string = "";
  public fechaDiligenciamiento: number = 0;
  public consBanco: number;
  public autorizaAch?: number = 0;
}
