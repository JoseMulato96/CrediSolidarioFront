import { BehaviorSubject, Observable } from 'rxjs';

export class BeneficiariosDataService {
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Subject al cual publicar cambios en el detalle del asociado.
   */
  private readonly _beneficiario: BehaviorSubject<
    BeneficiariosWrapper
  > = new BehaviorSubject(undefined);

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description True si esta haciendo una peticion, false sino.
   */
  requesting: boolean;

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Observable al cual subscribirse para cambios en la informacion del asociado.
   */
  public readonly beneficiario: Observable<
    BeneficiariosWrapper
  > = this._beneficiario.asObservable();

  constructor() {
    // do nothing
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Se encarga de publicar cambios en el detalle del beneficiario.
   * @param accion Accion.
   * @param datosBeneficiario Identificador unico del asociado || Datos del asociado a publicar.
   * @param api True si debe pedir los datos a la API, false si solo debe publicarlos.
   */
  accion(accion: string, datosBeneficiario: string | any, api?: boolean) {
    if (!datosBeneficiario) {
      return;
    }

    if (api) {
      // Añade control para no enviar una peticion si ya se estan solicitando los datos.
      if (this.requesting) {
        return;
      }

    } else {
      this._beneficiario.next({
        accion: accion,
        datosBeneficiario: datosBeneficiario
      });
    }
  }
}

/**
 * @author Jorge Luis Caviedes Alvarado
 * @description Wrapper de datos de asociado.
 */
export class BeneficiariosWrapper {
  accion: string;
  datosBeneficiario: any;
}
