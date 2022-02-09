import { Section0Model } from "./section0-model";

export class Section1Model extends Section0Model {
  public idProspecto?: number = 0;
  public barrioResidencia: string = "";
  public ciudadResidencia: number = 0;
  public correoElectronico: string = "";
  public direccionResidencia: string = "";
  public fechaNacimiento: number = 0;
  public genero: number = 0;
  public lugarNacimiento: number = 0;
  public numeroIdentificacion: string = "";
  public primerApellido: string = "";
  public segundoApellido: string = "";
  public primerNombre: string = "";
  public segundoNombre: string = "";
  public telefonoCelular: string = "";
  public telefonoFijo: string = "";
  public tipoIdentificacion: number = 0;
  public fechaExpedicion: number = 0;
  public lugarExpedicion: number = 0;
  public idPromotor: number = 0;
  public origen: number = 0;  
}
