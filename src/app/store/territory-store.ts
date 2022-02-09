import { BaseStore } from "../extends/base-store";
import { IlocationContent } from "../interfaces/ilocation-content";
import { FormService } from "../services/form.service";

export class TerritoryStore extends BaseStore {
  private locations: FormService;

  DataCountries: any = [];
  DataDepartament: any = [];
  DataCities: any = [];

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Obtener localizacion de ciudades, departamento, paises y guardarla en cache
   */
  async GetService() {
    this.locations = new FormService(this.http);
    let elements: IlocationContent[] = await this.locations.GetLocation(1);
    this.MappingData(elements).forEach(x => this.Data.push(x));
    return;
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Obtener los paises del servicio
   */
  async GetServiceContries() {
    if (this.DataCountries.length) {
      return this.DataCountries;
    }
    this.locations = new FormService(this.http);
    let elements: IlocationContent[] = await this.locations.GetLocationsCountries(
      1
    );
    this.DataCountries = [];
    this.MappingData(elements).forEach(x => this.DataCountries.push(x));
    return this.DataCountries;
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Obtener las ciudades del pais
   */
  async GetServiceCities(value: string, options: any) {
    this.locations = new FormService(this.http);
    let elements: IlocationContent[] = await this.locations.GetLocationsCities(
      options.country,
      value
    );
    this.DataCities = [];
    this.MappingData(elements).forEach(x => this.DataCities.push(x));
    return this.DataCities;
  }  
  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description realiza el mopping de los atributos del servicio con los atributos que se requiere
   */
  private MappingData(list = []): any[] {
    let l: any = [];
    list.forEach((x: IlocationContent) => {
      l.push({
        Label: x.descLocalizacion,
        Value: x.consLocalizacion,
        Chields:
          x.chields && x.chields.length ? this.MappingData(x.chields) : []
      });
    });
    return l;
  }
}
