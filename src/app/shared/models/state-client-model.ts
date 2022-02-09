export class StateFormModel {
  public idProspecto: number;
  public nextStep: string = "";
  public observacion?: string = "";
  public usuarioModificacion: string = "";
}

export enum StateFormEnum {
  CANCEL = "CANCEL",
  FINALIZE = "FINALIZE",
  CONTINUE = "CONTINUE",
  INCONSISTENCY = "INCONSISTENCY",
  TO_SIGN = "BYSIGNING",
  CREATED = "CREATED",
  CLOSED = "CLOSED"
}
/**
 * los valores estan en español o label
 */
export enum StateFormEsEnum {
  CREADO = "CREADO",
  POR_ASIGNAR = "POR ASIGNAR",
  ASIGNADO = "ASIGNADO",
  POR_FIRMAR = "POR FIRMAR",
  CERRADO = "CERRADO",
  INCONSISTENCIA = "INCONSISTENCIA",
  CANCELADO = "CANCELADO"
}
