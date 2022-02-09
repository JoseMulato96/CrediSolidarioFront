import { Section0Model } from "./section0-model";

export class SectionVerificaUsuarioModel extends Section0Model {
  tipIdentificacion?: string = "";
  numIdentificacion: number;  
  fechaExpedicion: number;  
  celular: number;
  tipValidacion: string = "";  
  identificacionEjecutivo: number; 
  estado: string = "";
  primerNombre: string = "";
  segundoNombre: string = "";
  primerApellido: string = "";
  segundoApellido: string = "";
}
