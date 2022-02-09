import { Section0Model } from "./section0-model";

export class BeneficiaryModel extends Section0Model {
  public idBeneficiario?: number;
  public tipoIdentificacion: number;
  public numeroIdentificacion: string;
  public fechaNacimiento: number;
  public generoBeneficiario: number;
  public primerNombre: string;
  public segundoNombre: string;
  public primerApellido: string;
  public segundoApellido: string;
  public tipoBeneficiari: number;
  public parentesco: string;
  public presentaIncapacidad: string;
  public porcentaje: number;
  public automatico: number;
  public grupo: string;
}
