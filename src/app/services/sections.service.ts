import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Section1Model } from "../shared/models/section1-model";
import { Section2Model } from "../shared/models/section2-model";
import {
  Section3Part1Model,
  Section3Part2Model
} from "../shared/models/section3-model";
import { Section4Model } from "../shared/models/section4-model";
import { Section5Model } from "../shared/models/section5-model";
import { Section6Model } from "../shared/models/section6-model";
import { Section7Model } from "../shared/models/section7-model";
import { Section8Model } from "../shared/models/section8-model";
import { Section9Model } from "../shared/models/section9-model";
import { Section10Model } from "../shared/models/section10-model";
import { StateFormModel } from "../shared/models/state-client-model";
import { BeneficiaryModel } from "../shared/models/beneficiary-model";
import { environment } from "../../environments/environment";
import { PageModel } from "../shared/models/page-model";
import { ConfirmaEmailAdobeSignDTO } from "../shared/models/ConfirmaEmailAdobeSignDTO";
import { SectionEncModel } from '../shared/models/section-enc-model';
import { SectionVerificaUsuarioModel } from "../shared/models/section-verifica-usuario-model";

@Injectable()
export class SectionsService extends BaseService {
  constructor(public http: HttpClient) {
    super(http);
  }


  /**
   * 
   * @description El sistema envia los datos para crear la primer session
   * @param data
   */
  public async SetSection1(data: Section1Model) {
    let url: string = `prospect/${data.idPromotor}/${data.origen}`;
    return this.Post(url, data);
  }

  /**
   * 
   * @description El sistema envia los datos para crear la segunda session
   * @param data
   */
  public async SetSection2(data: Section2Model) {
    let url: string = `prospect/${data.idProspecto}/pep`;
    return this.Post(url, data);
  }

  /**
   * 
   * @description El sistema envia los datos para crear la tercera session
   * @param data
   */
  public async SetSection3Part1(data: Section3Part1Model) {
    let url: string = `saveTransaccion/`;
    return this.Post(url, data);
  }

  /**
   * 
   * @description El sistema envia los datos para crear la tercera session
   * @param data
   */
  public async SetSection3Part2(data: Section3Part2Model) {
    let url: string = `saveInfoEconomia/`;
    return this.Post(url, data);
  }

  /**
   * 
   * @description El sistema envia los datos para crear la cuarta session
   * @param data
   */
  public async SetSection4(data: Section4Model) {
    let idCategoria = data.formaVinculacion;
    let url: string = `prospect/${
      data.idProspecto
      }/${idCategoria}/contribution`;
    return this.Post(url, data);
  }

  /**
   * 
   * @description El sistema envia los datos para crear la quita session
   * @param data
   */
  public async SetSection5(data: Section5Model) {
    let url: string = `saveAutorizacion`;
    return this.Post(url, data);
  }

  /**
   * 
   * @description El sistema envia los datos para crear la sexta session
   * @param data
   */
  public async SetSection6(data: Section6Model) {
    let url: string = `prospect/${data.idProspecto}/additionalField`;
    return this.Post(url, data);
  }

  /**
   * 
   * @description El sistema envia los datos para crear la sectima session
   * @param data
   */
  public async SetSection7(data: Section7Model) {
    let url: string = `saveInfoAdicional`;
    return this.Post(url, data);
  }

  /**
   * 
   * @description El sistema envia los datos para crear la octava session
   * @param data
   */
  public async SetSection8(data: Section8Model) {
    let url: string = `saveDeclaracion`;
    return this.Post(url, data);
  }

  /**
   * 
   * @description El sistema envia los datos para crear la novena session
   * @param data
   */
  public async SetSection9(data: Section9Model[], idPromotor) {
    let url: string = `saveBeneficiarios/${idPromotor}`;
    return this.Post(url, data);
  }

  /**
   * 
   * @description El sistema envia los datos para crear la decima session
   * @param data
   */
  public async SetSection10(data: Section10Model) {
    let url: string = `saveOtraInfo`;
    return this.Post(url, data);
  }


  /**
   * 
   * @description El sistema envia los datos para crear la section encuesta
   * @param data
   */
  public async SetSectionEnc(data: Section9Model[]) {
    let url: string = `saveEncuesta`;
    return this.Post(url, data);
  }


  /**
   * 
   * @description El sistema obtiene del backend la primera seccion
   * @param idClient
   */
  public async GetSection1(idClient: string) {
    let url: string = `prospect/${idClient}`;
    return this.Get(url, {});
  }


  /**
   * @author Jose Wilson Mulato
   * @description Consulta porcentaje de solicitud
   * @param data
   */
  public async GetPercent(idClient: string) {
    let url: string = `prospect/percent/${idClient}`;
    return this.Get(url, {});
  }

  /**
   * 
   * @description El sistema obtiene del backend la primera seccion
   * @param idClient
   */
  public async GetSection2(idClient: string) {
    let url: string = `pepByProspect/${idClient}`;
    return this.Get(url, {});
  }

  /**
   * r
   * @description Obtiene el tipo de tranasacion
   * @param idTransacion ID de tranasacion
   */
  GetSection3Part1(idTransacion: any): any {
    let url: string = `transaccion/${idTransacion}`;
    return this.Get(url, {});
  }

  /**
   * 
   * @description El sistema obtiene del backend la primera seccion
   * @param idClient
   */
  public async GetSection3Part2(idClient: string) {
    let url: string = `prospect/${idClient}/InfoEconomia`;
    return this.Get(url, {});
  }

  /**
   * 
   * @description El sistema obtiene del backend la primera seccion
   * @param idClient
   */
  public async GetSection4(idClient: string) {
    let url: string = `prospect/${idClient}/contribution`;
    return this.Get(url, {});
  }

  /**
   * 
   * @description El sistema obtiene del backend la quita seccion
   * @param idClient
   */
  public async GetSection5(idClient: string) {
    let url: string = `getAutorizacion/${idClient}`;
    return this.Get(url, {});
  }

  /**
   * 
   * @description El sistema obtiene del backend la sexta seccion
   * @param idClient
   */
  public async GetSection6(idClient: string) {
    let url: string = `prospect/${idClient}/additionalField`;
    return this.Get(url, {});
  }

  /**
   * 
   * @description El sistema obtiene del backend la sectima seccion
   * @param idClient
   */
  public async GetSection7(idClient: string) {
    let url: string = `getInfoAdicional/${idClient}`;
    return this.Get(url, {});
  }

  /**
   * 
   * @description El sistema obtiene del backend la octava seccion
   * @param idClient
   */
  public async GetSection8(idClient: string) {
    let url: string = `prospect/${idClient}/declaracion`;
    return this.Get(url, {});
  }

  /**
   * 
   * @description El sistema obtiene del backend la novena seccion
   * @param idClient
   */
  public async GetSection9(idClient: string) {
    let url: string = `getOtraInfo/${idClient}`;
    return this.Get(url, {});
  }

  /**
   * 
   * @description El sistema obtiene del backend la decima seccion
   * @param idClient
   */
  public async GetSection10(idClient: string) {
    let url: string = `getOtraInfo/${idClient}`;
    return this.Post(url, {});
  }

  /**
   * r
   * @description sube los archivos ajuntos
   * @param formData Form de archivos
   */
  public async SetSectionFiles(formData: FormData, idProspecto) {
    let url: string = `uploadMultiple/${idProspecto}`;
    return this.Post(url, formData, true, true);
  }

  /**
   * r
   * @description obtiene el Key que genera desde el backend
   * @param idProspecto
   */
  async GetDocuwareKey(idProspecto: number, usuarioCreacion, ip) {
    let url: string = `docuwareKey/${idProspecto}`;
    return this.Post(url, { usuarioCreacion, ip }, true);
  }

  /**
   * r
   * @description Obtiene los documentos adjuntos
   */
  async GetFilesAdjunt(id: number) {
    let url: string = `${environment.backend}downloadZip/${id}`;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/zip",
        Authorization: BaseService.TOKEN
      }),
      responseType: "blob" as "json"
    };

    return this.http.get<Blob>(url, httpOptions).toPromise();
  }

  /**
   * r
   * @description obtener los nombre que se juntaron
   * @param idProspecto
   */
  GetFilesAdjuntNames(idProspecto: number): any {
    let url: string = `getNameFiles/${idProspecto}`;
    return this.Get(url, {});
  }

  /**
   * r
   * @description cambia el estado del cliente que esta inscribiendo
   * @param data
   */
  public async SetStateClient(data: StateFormModel) {
    let url: string = "updateStateSolicitud";
    return this.Post(url, data);
  }

  /**
   * r
   * @description Obtener el tipo de cargar de archivo
   * @param idProspect
   */
  public async GetTypeLoadFiles(idProspect) {
    let response: any = await super.Get(`getIdAdjuntos/${idProspect}`, {});
    return response;
  }

  /**
   * r
   * @description eliminar el cliente o la solicitud
   * @param data
   */
  public async DeleteClient(data: StateFormModel) {
    let url: string = "deleteSolicitud";
    return this.Post(url, data);
  }

  /**
   * r
   * @description Guarda un beneficiario
   * @param data
   */
  async SaveBeneficiary(data: BeneficiaryModel) {
    let url: string = "saveBeneficiario";
    return this.Post(url, data);
  }

  /**
   * r
   * @description Guarda la pagina donde quedo el usuario
   * @param data
   */
  async SavePage(data: PageModel) {
    let url = `savePaginacion`;
    return await super.Post(url, data);
  }

  /**
   * r
   * @description Obtener la pagina del prospecto donde se guardo
   * @param idProspecto
   */
  async GetPage(idProspecto: number) {
    let url = `getPaginacion/${idProspecto}`;
    return await super.Post(url, {});
  }

  /**
   * r
   * @description Envia al servisio si es para firmar
   */
  async SendAdobeSign(data: ConfirmaEmailAdobeSignDTO) {
    let url = "sendAdobeSign/";
    return await super.Post(url, data);
  }

  /**
   * @author Jose Wilson Mulato
   * @description obtiene la section encuesta
   * @param idClient
   */
  public async GetSectionEnc(idClient: string) {
    let url: string = `getEncuesta/${idClient}`;
    return this.Post(url, {});
  }


   /**
   * @author Jose Wilson Mulato
   * @description El sistema envia los datos al lider regional
   * @param data
   */
  public async enviarValidar(data: SectionVerificaUsuarioModel) {
    let url: string = `enviarValidar`;
    return this.Post(url, data);
  }
}
