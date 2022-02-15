import { BaseStore } from "../extends/base-store";
import { FormService } from "../services/form.service";

export class ConfirmeStore extends BaseStore {
  private confirmeStore: FormService;

  /**
   * r
   * @description Se establese una copia del valor si o no
   */
  protected async GetService() {
    this.confirmeStore = new FormService(this.http);
    this.Data = ConfirmeStore.GetCopyDefault();
    return;
  }

  /**
   * Obtiene el valor por defecto de si
   */
  public static YES: number = 24;
  public static NOT: number = 25;


    /**
   * Obtiene el valor por defecto de si
   */
  public static OTP: string = 'OTP';
  public static CUESTIONARIO: string = 'CUESTIONARIO';

  static GetCopyDefault() {
    return [
      {
        Label: "Sí",
        Value: ConfirmeStore.YES
      },
      {
        Label: "No",
        Value: ConfirmeStore.NOT
      }
    ];
  }


  static GetTipValidacion() {
    return [
      {
        Label: "OTP",
        Value: ConfirmeStore.OTP
      },
      {
        Label: "CUESTIONARIO",
        Value: ConfirmeStore.CUESTIONARIO
      }
    ];
  }

  // static GetCopyDefaultContador() {
  //   return [
  //     {
  //       Label: "Sí",
  //       Value: ConfirmeStore.YES
  //     },
  //     {
  //       Label: "No, Otro Documento",
  //       Value: ConfirmeStore.NOT
  //     }
  //   ];
  // }
}
