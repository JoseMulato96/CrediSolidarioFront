import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ImasterContent } from "../interfaces/imaster-content";
import { IResponseService } from "../interfaces/response-service";
import { BaseService } from "./base.service";
import { MainStore } from "../store/main-store";

@Injectable()
export class FormService extends BaseService {
  private PARAMS_REQUEST = {
    TYPE_GENDER: 102,
    LEVEL_ACADEMY: 167,
    TYPE_DOCUMENT: 64,
    TYPE_OCUPATION: 281,
    COIN_EXTERN: 701,
    TRANSACTION: 481,
    RELATIONSHIP: 101,
    TYPE_CONTRACT: 15,
    WORK_ACTIVITY: 281,
    TYPE_BENEFICIARY: 3040,
    ADDRESS_TYPE_ROAD: 3035,
    ADDRESS_TYPE_ZONE: 3036,
    ADDRESS_TYPE_INMUEBLES: 3037,
    ADDRESS_TYPE_INSIDE: 3038,
    TYPE_ACCOUNT: 68,
    TYPE_PRODUCT: 3028,
    TYPE_CHANNEL: 3039,
    CHANGE_PUBLIC: 3042,
    SOCIAL_NETWORK: 3043,
    RELATIONSHIP_FA: 3034,
    FECORTES: 166,
  };

  constructor(public http: HttpClient) {
    super(http);
  }
  /**
   * 
   * @description Obteniendo las diferentes actividades laborales
   */
  async GetWorkActivity() {
    let response: any = await super.Get(
      this.ConstParameterType(this.PARAMS_REQUEST.WORK_ACTIVITY),
      {}
    );
    return this.GetResponseDataService(response);
  }

  async GetRelationShipFa() {
    let response: any = await super.Get(
      this.ConstParameterType(this.PARAMS_REQUEST.RELATIONSHIP_FA),
      {}
    );
    return this.GetResponseDataService(response);
  }

  /**
   * r
   * @description Obtener los cargos polliticos
   */
  async GetChargesPublic() {
    let response: any = await super.Get(
      this.ConstParameterType(this.PARAMS_REQUEST.CHANGE_PUBLIC),
      {}
    );
    return this.GetResponseDataService(response);
  }

  /**
   * @author Edwar Ferney Murillo
   * @description Obtener las redes sociales
   */
  async GetSocialNetwork() {
    let response: any = await super.Get(
      this.ConstParameterType(this.PARAMS_REQUEST.SOCIAL_NETWORK),
      {}
    );
    return this.GetResponseDataService(response);
  }

  /**
   * r
   * @description Obteniendo los diferentes tipo de vinculación
   */
  async GetViculado() {
    let response: any = await super.Get("category", {});
    return this.GetResponseDataService(response);
  }

  /**
   * @author Edwar Ferney Murillo Arboleda
   * @description Obteniendo los porcentajes del tipo de vinculacion seleccionado
   */
  async GetPorcentajeViculado(id: number) {
    let response: any = await super.Get(`categoryPorcentaje/${id}`, {});
    return response;
  }

  /**
   * @author Edwar Ferney Murillo Arboleda
   * @description Obteniendo la fecha actual del sistema
   */
  async GetDateCurrent() {
    let response: any = await super.Get("getDateCurrent", {});
    return response;
  }

  /**
   * r
   * @description Obtener los agentes
   */
  async GetAgents() {
    let response: any = await super.Get("agents", {});
    return this.GetResponseDataService(response);
  }

  /**
   * 
   * @description Obteniendo las diferentes productos
   */
  async GetTypeTransaction() {
    let response: any = await super.Get(
      this.ConstParameterType(this.PARAMS_REQUEST.TRANSACTION),
      {}
    );
    return this.GetResponseDataService(response);
  }

  /**
   * 
   * @description Obteniendo las diferentes productos
   */
  async GetTypeProduct() {
    let response: any = await super.Get(
      this.ConstParameterType(this.PARAMS_REQUEST.TYPE_PRODUCT),
      {}
    );
    return this.GetResponseDataService(response);
  }

  /**
   * 
   * @description Obteniendo las diferentes monedas
   */
  async GetTypeMoneda() {
    let response: any = await super.Get(
      this.ConstParameterType(this.PARAMS_REQUEST.COIN_EXTERN),
      {}
    );
    return this.GetResponseDataService(response);
  }

  /**
   * 
   * @description Obtner el genero femenino y masculino
   */
  async GetTypeGender() {
    let response: any = await super.Get(
      this.ConstParameterType(this.PARAMS_REQUEST.TYPE_GENDER),
      {}
    );
    return this.GetResponseDataService(response);
  }

  /**
   * 
   * @description Obtener los tipos de documento por el servicio
   */
  async GetTypeDocument() {
    let response: any = await super.Get(
      this.ConstParameterType(this.PARAMS_REQUEST.TYPE_DOCUMENT),
      {}
    );
    return this.GetResponseDataService(response);
  }

  /**
   * 
   * @description Obtener los tipos de vias
   */
  async GetAddressTypeRoad() {
    let response: any = await super.Get(
      this.ConstParameterType(this.PARAMS_REQUEST.ADDRESS_TYPE_ROAD),
      {}
    );
    return this.GetResponseDataService(response);
  }

  /**
   * 
   * @description Obtener los tipos de vias
   */
  async GetAddressTypeZone() {
    let response: any = await super.Get(
      this.ConstParameterType(this.PARAMS_REQUEST.ADDRESS_TYPE_ZONE),
      {}
    );
    return this.GetResponseDataService(response);
  }

  /**
   * 
   * @description Obtener los tipos de vias
   */
  async GetAddressTypeInside() {
    let response: any = await super.Get(
      this.ConstParameterType(this.PARAMS_REQUEST.ADDRESS_TYPE_INSIDE),
      {}
    );
    return this.GetResponseDataService(response);
  }

  /**
   * r
   * @description Obtener las oficinas
   */
  async GetOfficesByName(name: string) {
    let url = `office?name=${name}`;
    let response: any = await super.Get(url, {});
    return this.GetResponseDataService(response);
  }

  /**
   * r
   * @description obtener los cargos de la oficinas de coomeva
   * @param nivel
   */
  async GetOfficesByNivel(nivel: any) {
    let url = `office?nivel=${nivel}`;
    let response: any = await super.Get(url, {});
    return this.GetResponseDataService(response);
  }

  /**
   * r
   * @description Obtener las oficinas
   */
  async GetOfficesById(id: string) {
    let url = `office/${id}`;
    let response: any = await super.Get(url, {});
    return this.GetResponseDataService(response);
  }

  /**
   * 
   * @description Obtener los tipos de vias
   */
  async GetAddressTypeInmuebles() {
    let response: any = await super.Get(
      this.ConstParameterType(this.PARAMS_REQUEST.ADDRESS_TYPE_INMUEBLES),
      {}
    );
    return this.GetResponseDataService(response);
  }

  /**
   * r
   * @description Obtener el tipo de beneficiario
   */
  async TypeBeneficiary() {
    let response: any = await super.Get(
      this.ConstParameterType(this.PARAMS_REQUEST.TYPE_BENEFICIARY),
      {}
    );
    return this.GetResponseDataService(response);
  }

  /**
   * 
   * @description Obtener la localización
   */
  async GetLocation(idContry: number) {
    let response: any = await super.Get(`localization/${idContry}`, {});
    return response && response.data
      ? Array.isArray(response.data)
        ? response.data
        : [response.data]
      : [];
  }

  /**
   * 
   * @description Obtener las localizaciones
   */
  async GetLocationsCountries(idContry: number) {
    let response: any = await super.Get(
      `localization/${idContry}/localizations`,
      {}
    );
    return response && response.data
      ? Array.isArray(response.data)
        ? response.data
        : [response.data]
      : [];
  }
  /**
   * 
   * @description Obtener las localizaciones del padre, ciudades
   */
  async GetLocationsCities(idContry: number, name = "") {
    let url = `localization/${idContry}/cities`;
    if (name) {
      url += `?name=${name}`;
    }
    let response: any = await super.Get(url, {});
    return response && response.data
      ? Array.isArray(response.data)
        ? response.data
        : [response.data]
      : [];
  }


  /**
   * @author Jose Wilson Mulato
   * @description Obtener la localizacion del padre, ciudad
   */
  async GetLocationCity(idLocalizacion) {
    let url = `localizationBancoOAsociado/${idLocalizacion}`;
    let response: any = await super.Get(url, {});
    return response;
  }

  async GetTypeAccount() {
    let response: any = await super.Get(
      this.ConstParameterType(this.PARAMS_REQUEST.TYPE_ACCOUNT),
      {}
    );
    return this.GetResponseDataService(response);
  }

  /**
   * r
   * @description obtener los tipos de contrato
   */
  async GetTypeContract() {
    let response: any = await super.Get(
      this.ConstParameterType(this.PARAMS_REQUEST.TYPE_CONTRACT),
      {}
    );
    return this.GetResponseDataService(response);
  }

  /**
   * 
   * @description Obtener las diferencia relaciones familiares que existe ej. conyuge, primo,..
   */
  async GetRelationship() {
    let response: any = await super.Get(
      this.ConstParameterType(this.PARAMS_REQUEST.RELATIONSHIP),
      {}
    );
    return this.GetResponseDataService(response);
  }

  /**
    * 
    * @description Obtener las diferencia relaciones familiares que existe ej. conyuge, primo,..
    */
  async  GetRelationshipTwo() {
    let response: any = await super.Get(
      this.ConstParameterType(this.PARAMS_REQUEST.RELATIONSHIP_FA),
      {}
    );
    return this.GetResponseDataService(response);
  }

  /**
   * 
   * @description Obtener el plan de perseveransa
   */
  async GetPerseverancePlan() {
    let response: any = await super.Get("product", {});
    return this.GetResponseDataService(response);
  }

  /**
   * r
   * @description Obtener los titulos
   */
  async GetTitles(name: string) {
    let response: any = await super.Get(
      `getAllTituloAcademico?name=${name}`,
      {}
    );
    return this.GetResponseDataService(response);
  }

  /**
   * r
   * @description Obtener instituciones
   */
  async GetInstitutions(name: string) {
    if (!name) {
      return;
    }
    let response: any = await super.Get(`getInstitucion?name=${name}`, {});
    return this.GetResponseDataService(response);
  }

  /**
   * 
   * @description Obtener las diferencia ocupaciones
   */
  async GetOcupationService() {
    let response: any = await super.Get(
      this.ConstParameterType(this.PARAMS_REQUEST.TYPE_OCUPATION),
      {}
    );
    return this.GetResponseDataService(response);
  }

  /**
   * 
   * @description Obtener la lista de bancos
   */
  async GetBanks() {
    let response: any = await super.Get("getAllEntidadFinanciera", {});
    return this.GetResponseDataService(response);
  }

  /**
   * 
   * @description Obtener las diferencia codigos de las actividades economicas
   */
  async GetCIIU() {
    let response: any = await super.Get("getAllActividadEconomica", {});
    return this.GetResponseDataService(response);
  }

  /**
   * r
   * @description obtener el tipo de canal
   */
  async GetTypeChannel() {
    let response: any = await super.Get(
      this.ConstParameterType(this.PARAMS_REQUEST.TYPE_CHANNEL),
      {}
    );
    return this.GetResponseDataService(response);
  }

  /**
   * r
   * @description Otener el plan de beneficiario
   */
  async GetBeneficiaryPlan() {
    //  let response:IResponseService = await super.Post("GetTypeDocument", {});
    let response: IResponseService;
    return this.GetResponseDataService(response);
  }

  /**
   * r
   * @description Obtener los niveles academicos
   */
  async GetAcademicLevel() {
    let response: any = await super.Get(
      this.ConstParameterType(this.PARAMS_REQUEST.LEVEL_ACADEMY),
      {}
    );
    return this.GetResponseDataService(response);
  }

  /**
   * r
   * @description Obtiene el padre de la ciudad como el departamento y el pais
   * @param idPlace
   */
  async GetParentPlace(idPlace: number) {
    let response: any = await super.Get(`getDepartamentPais/${idPlace}`, {});
    return this.GetResponseDataService(response);
  }


  /**
   * @author Jose Wilson Mulato
   * @description Obtiene el porcentaje de la solicitud
   * @param idPlace
   */
  async GetPercentSolicitud(idProspect: number) {
    let response: any = await super.Get(`solicitud/${idProspect}`, {});
    return this.GetResponseDataService(response);
  }

  /**
   * r
   * @description Obtener titulo con el valor
   * @param idValue
   */
  async GetTitleByValue(idValue: number) {
    let response: any = await super.Get(
      `getTituloAcademicoById/${idValue}`,
      {}
    );
    return this.GetResponseDataService(response);
  }

  /**
   * r
   * @description Obtener los titulos
   * @param idPromotor
   */
  async GetCharges(idPromotor) {
    let response: any = await super.Get(
      `getTituloAcademicoById/${idPromotor}`,
      {}
    );
    return this.GetResponseDataService(response);
  }

  /**
   * r
   * @description Obtiene la institucion por valor
   * @param idValue
   */
  async GetInstitutionsByValue(idValue: number) {
    let response: any = await super.Get(`getInstitucionById/${idValue}`, {});
    return this.GetResponseDataService(response);
  }

  /**
   * r
   * @description Obtiene la lista de los beneficiario
   * @param idProspect
   */
  async GetListBeneficiary(idProspect: number) {
    let response: any = await super.Get(
      `getAllBeneficiarios/${idProspect}`,
      {}
    );
    return this.GetResponseDataService(response);
  }

  /**
   * r
   * @description obtiene el contenido del servicio para retornarlo a las class store que lo usen
   * @param response
   */
  GetResponseDataService(response: IResponseService): ImasterContent[] {
    return response && response.data ? (response.data as ImasterContent[]) : [];
  }

  /**
   * rs
   * @description Obtener los datos del usuario
   * @param idPromotor
   */
  async GetChargesCoomeva(idPromotor: number) {
    return await super.Get(
      `getCargos?idPromotor=${idPromotor}`,
      // `getCargos?idPromotor=3229922`,
      {}
    );
  }

  /**
   * r
   * @description Obtener la oficina de LICO
   */
  async GetOfficesLico(idPromotor: number) {
    let url = `getComercial/${idPromotor}`;
    return await super.Get(url, {});
  }

  /**
   * r
   * @description Eliminar el beneficiario
   * @param Id id del cliente
   */
  async DeleteBeneficiary(Id: any) {
    let response: any = await super.Get(`deleteBeneficiario/${Id}`, {});
    return response;
  }

  /**
   * 
   * @description Construye la base de url para solicitar el tipo de parametro
   * @param param
   */
  private ConstParameterType(param: any): string {
    return `parameterType/${param}/parameters`;
  }


  /**
   * @author Jose Wilson Mulato
   * @description Construye la base de url para solicitar el tipo de parametro y envia el idProspecto
   * @param param
   */
  private ConstParameterTypeIdProspect(param: any, idProspect: any): string {
    return `parameterType/${param}/${idProspect}/parameters`;
  }

  /**
   * @author Jose Wilson Mulato - Kalettre
   * @description Obtener fecha corte
   */
  async GetFechaCortes() {
    let dataResp: any = await super.Get(
      this.ConstParameterTypeIdProspect(this.PARAMS_REQUEST.FECORTES, MainStore.db.GetIdPropect()),
      {}
    );
    dataResp.data.splice(6);
    return this.GetResponseDataService(dataResp);
  }


  /**
   * @author Jose Wilson Mulato
   * @description Obtiene la lista de secciones que faltan por diligenciar
   * @param idPlace
   */
  async GetListSectionPend(idProspect: number) {
    let response: any = await super.Get(`getSectionPendientes/${idProspect}`, {});
    return this.GetResponseDataService(response);
  }


  /**
  * @author Jose Wilson Mulato
  * @description Obtiene datos de cliente banco si lo es
  * @param idPlace
  */
  async GetDatosClienteBanco(tipIdentificacion: number, numIdentificacion: number) {
    let response: any = await super.Get(`getDatosBanco/${tipIdentificacion}/${numIdentificacion}`, {});
    return this.GetResponseDataService(response);
  }

  /**
    * @author Jose Wilson Mulato
    * @description Obtiene datos de asociado cooperativa si lo es
    * @param idPlace
    */
  async GetDatosAsociadoCoop(tipIdentificacion: number, numIdentificacion: number) {
    let response: any = await super.Get(`getDatosAsociado/${tipIdentificacion}/${numIdentificacion}`, {});
    return this.GetResponseDataService(response);
  }


}
