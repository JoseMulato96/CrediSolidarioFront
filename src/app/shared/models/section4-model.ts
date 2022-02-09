import { Section0Model } from "./section0-model";

export class Section4Model extends Section0Model {
  public consContribucionFondo?: number = 0;
  public formaVinculacion: number;
  public plan: any = {};
  public fechaCorte:number;
  public valorPlan: number = 0;
  public valorProteccion: number = 0;
  public perseverancia: number = 0;
  public incapacidadTemporal: number = 0;
  public idPromotor: number = 0;
  public aportes: number = 0;
  public renunciaAuxFunerario: number = 0;

  // public parentescoPrincipal: string = "";
  // public numeroIdentificacion: string = "";
  // public tipoIdentificacion: number = 0;
  public numIdentificatcionAsociadoFamiliar: string = "";
  public tipoIdentificacionAsociadoFamiliar: number = 0;
  public parentescoAsociadoFamiliar: string = '';
  /* public numIdentificationMemberFamily: string = "";
  public IdentificationType: number = 0;
  public familyRelationShip: string = ''; */
}
