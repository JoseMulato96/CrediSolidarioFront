import { BaseStore } from "../extends/base-store";
import { ImasterContent } from "../interfaces/imaster-content";
import { FormService } from "../services/form.service";

export class AddressTypeRoadStore extends BaseStore {
  private academicLevel: FormService;

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Obtener direcciones calles y guardarla en cache
   */
  protected async GetService() {
    this.academicLevel = new FormService(this.http);
    let elements: ImasterContent[] = await this.academicLevel.GetAddressTypeRoad();
    elements.forEach(x =>
      this.Data.push({ Label: x.descParametro, Value: x.valor })
    );
    return;
  }
}

/**
 * @author Jorge Luis Caviedes Alvarador
 * @description Obtener direcciones de zona y guardarla en cache
 */
export class AddressTypeZoneStore extends BaseStore {
  private academicLevel: FormService;
  protected async GetService() {
    this.academicLevel = new FormService(this.http);
    let elements: ImasterContent[] = await this.academicLevel.GetAddressTypeZone();
    elements.forEach(x =>
      this.Data.push({ Label: x.descParametro, Value: x.valor })
    );
    return;
  }
}

/**
 * @author Jorge Luis Caviedes Alvarador
 * @description Obtener direcciones tipo de imueble y guardarla en cache
 */
export class AddressTypeInmueblesStore extends BaseStore {
  private academicLevel: FormService;
  protected async GetService() {
    this.academicLevel = new FormService(this.http);
    let elements: ImasterContent[] = await this.academicLevel.GetAddressTypeInmuebles();
    elements.forEach(x =>
      this.Data.push({ Label: x.descParametro, Value: x.valor })
    );
    return;
  }
}

/**
 * @author Jorge Luis Caviedes Alvarador
 * @description Obtener direcciones tipo internos y guardarla en cache
 */
export class AddressTypeInsideStore extends BaseStore {
  private academicLevel: FormService;
  protected async GetService() {
    this.academicLevel = new FormService(this.http);
    let elements: ImasterContent[] = await this.academicLevel.GetAddressTypeInside();
    elements.forEach(x =>
      this.Data.push({ Label: x.descParametro, Value: x.valor })
    );
    return;
  }
}
