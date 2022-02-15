import { Modal } from "ngx-modal";
import { ResponseEnum } from "../enums/ResponseEnum.enum";
import { IResponseService } from "../interfaces/response-service";
import { ConsultService } from "../services/consult.service";
import { SectionsService } from "../services/sections.service";
import { SAlertComponent } from "../shared/components/s-alert/s-alert.component";
import { InputModel } from "../shared/extends-components/binput-component";
import { FilterConsultModel } from "../shared/models/filter-consult-model";
import { MesaggeText } from "../shared/texts/mesagge-text";
import { MainStore } from "../store/main-store";
import { ResponseUiService } from "../utils/response-ui.service";

export class BaseConsult {
  constructor(
    public consulService: ConsultService,
    public responseUI: ResponseUiService,
    public stateClientServ: SectionsService
  ) { }

  /**
   * r
   * @description Obtiene los dato con base a los filtros
   * @param filterConsult
   */
  GetFilterDataCommercialForce(filterConsult: FilterConsultModel) {
    return this.consulService.GetConsultFilterCommercialForce(filterConsult);
  }





  /**
   * @author Jose Wilson Mulato
   * @description Obtiene los dato con base a los filtros
   * @param filterConsult
   */
  GetConsultFilterLiderNacional(filterConsult: FilterConsultModel) {
    return this.consulService.GetConsultFilterLiderNacional(filterConsult);
  }

  /**
   * @author Jose Wilson Mulato
   * @description Obtiene los dato con base a los filtros
   * @param filterConsult
   */
  GetConsultFilterLiderRegional(filterConsult: FilterConsultModel) {
    return this.consulService.GetConsultFilterLiderRegional(filterConsult);
  }



  /**
   * @author Jose Wilson Mulato
   * @description Obtiene los dato con base a los filtros para evidente
   * @param filterConsult
   */
  GetConsultFilterLiderRegionalEvidente(filterConsult: FilterConsultModel) {
    return this.consulService.GetConsultFilterLiderRegionalEvidente(filterConsult);
  }

  /**
   * r
   * @description Obtiene los dato con base a los filtros
   * @param filterConsult
   */
  GetFilterDataAgent(filterConsult: FilterConsultModel) {
    return this.consulService.GetConsultFilterAgent(filterConsult);
  }

  /**
   * r
   * @description Obtiene los dato con base a los filtros
   * @param filterConsult
   */
  GetFilterDataSupervisor(filterConsult: FilterConsultModel) {
    return this.consulService.GetConsultFilterSupervisor(filterConsult);
  }

  /**
   * r
   * @description Obtiene los dato con base a los filtros
   * @param filterConsult
   */
  GetFilterDataAuxSupervisor(filterConsult: FilterConsultModel) {
    return this.consulService.GetConsultFilterAuxSupervisor(filterConsult);
  }

  /**
   * r
   * @description Cierra el modal
   */
  OnClickCancel(modal: Modal) {
    modal.close();
  }

  /**
   * r
   * @description Exporta en excel los datos enviados
   * @param data datos para export
   */
  ExportExcelData(ids: number[], pageSize: number, pageCurrent: number) {
    return this.consulService.ExportExcelAux(pageSize, pageCurrent, ids);
  }


  /**
   * @author Jose Wilson Mulato Escobar
   * @description Obtiene los dato con base a los filtros para exportar
   * @param filterConsult
   */
  GetFilterDataCommercialForceExport(filterConsult: FilterConsultModel) {
    return this.consulService.ExportExcelConsultFilterFuerza(filterConsult);
  }


  /**
     * @author Jose Wilson Mulato Escobar
     * @description Obtiene los dato con base a los filtros para exportar
     * @param filterConsult
     */
  GetFilterDataLiderNacionalExport(filterConsult: FilterConsultModel) {
    return this.consulService.ExportExcelConsultFilterLiderNacional(filterConsult);
  }


  /**
   * @author Jose Wilson Mulato Escobar
   * @description Obtiene los dato con base a los filtros para exportar
   * @param filterConsult
   */
  GetFilterDataLiderRegionalExport(filterConsult: FilterConsultModel) {
    return this.consulService.ExportExcelConsultFilterLiderRegional(filterConsult);
  }

  /**
   * r
   * @description Escucha el evento click en el boton de filtrado
   * @param e eventos del cursor
   */
  OnClickFilter(e) {
    let filters: any = this.GetFiltersComponents();
    this.RequestFilterData(filters, 1, this._PageSize);
  }

  /**
   * r
   * @description cuando a selecionado el tamaño de la pagina
   * @param value
   */
  OnSelectPageSize(value) {
    let filters: any = this.GetFiltersComponents();
    this.RequestFilterData(filters, this._PageCurrent, value);
  }

  /**
   * r
   * @description escucha el evento cuando cambia de pagina
   * @param page
   */
  OnSelectPage(page) {
    let filters: any = this.GetFiltersComponents();
    this.RequestFilterData(filters, page, this._PageSize);
  }

  /**
   * r
   * @description Cerrar la solicitud
   * @param item
   * @param position
   */
  CheckCloseItem(item: any, position: any): any {
    SAlertComponent.Confirm(
      MesaggeText.TEXT_CANCEL_SOLICITUDE,
      true,
      MesaggeText.TITLE_CANCEL_SOLICITUDE
    ).then(isdelete => {
      isdelete &&
        this.stateClientServ
          .SetStateClient({
            idProspecto: item["idProspecto"],
            nextStep: "",
            observacion: "",
            usuarioModificacion: MainStore.db.GetUser().username
          })
          .then((response: IResponseService) => {
            this.responseUI.CheckResponseForError(response).then(() => {
              if (response.status == ResponseEnum.OK) {
                this.OnClickFilter(null);
              }
            });
          })
          .catch(error => {
            this.responseUI.CheckResponseForError(error);
          });
    });
  }

  /**
   * r
   * @description Realiza el filtro con el servicio a la base de datos
   * @param filters
   * @param _PageCurrent
   * @param value
   */
  RequestFilterData(filters: any, pageCurrent: number, pageSize: any): any {
    throw new Error("Method not implemented.");
  }

  /**
   * r
   * @description Obtener la informacion de los filtros de locomponentes
   * @throws hay que implementar en la class que se hereda
   */
  GetFiltersComponents(): any {
    throw new Error("Method not implemented.");
  }

  /**
   * r
   * @description limpia el cache y establese el prospecto
   */
  async EstablishProspect(idProspecto) {
    MainStore.db.RestSections();
    return MainStore.db.GetSection1(idProspecto);
  }

  /**
   * r
   * @description Acciones de los botones
   */
  ACTION_DELETE: string = "DELETE";
  ACTION_EDIT: string = "EDIT";
  ACTION_CLOSE: string = "CLOSE";
  ACTION_INCIDENT: string = "INCIDENTE";
  ACTION_OBSERVATION: string = "OBSERVACION";
  ACTION_CANCEL: string = "CANCEL";
  ACTION_FILEUPDATE: string = "FILEUPDATE";
  ACTION_REOPEN: string = "REOPEN";

  /**
   * r
   * @description Tipo de filtro
   */
  FilterState: InputModel = {
    Label: "Estado",
    Placeholder: "Eligir el estado",
    Items: [
      { Value: 4115, Label: "CREADO" },
      // { Value: 4116, Label: "POR ASIGNAR" },
      // { Value: 4117, Label: "ASIGNADO" },
      { Value: 4118, Label: "POR FIRMAR" },
      { Value: 4119, Label: "CERRADO" },
      { Value: 4120, Label: "INCONSISTENCIA" }
    ]
  };

  /**
   * r
   * @description Pagina actual
   */
  _PageCurrent: number = 1;
  /**
   * r
   * @description Cantidad de paginas permitidas por pagina
   */
  _PageSize: number = 10;
}
