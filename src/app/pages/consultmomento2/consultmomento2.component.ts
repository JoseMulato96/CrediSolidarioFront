import { DatePipe } from "@angular/common";
import {
  Component,
  OnInit,
  Pipe,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import { Router } from "@angular/router";
import { ResponseEnum } from "../../enums/ResponseEnum.enum";
import { BaseConsult } from "../../extends/base-consult";
import { IResponseService } from "../../interfaces/response-service";
import { AddressesUrlParams } from "../../parameters/addresses-url-params";
import { ConsultService } from "../../services/consult.service";
import { SectionsService } from "../../services/sections.service";
import { SAlertComponent } from "../../shared/components/s-alert/s-alert.component";
import { SGridComponent } from "../../shared/components/s-grid/s-grid.component";
import { SInputComponent } from "../../shared/components/s-input/s-input.component";
import { ButtonModel } from "../../shared/extends-components/bbutton-component";
import { GridModel } from "../../shared/extends-components/bgrid-component";
import {
  InputEnum,
  InputModel
} from "../../shared/extends-components/binput-component";
import { ConsultGeneralModel } from "../../shared/models/consult-general-model";
import {
  StateFormEnum,
  StateFormEsEnum
} from "../../shared/models/state-client-model";
import { NotificationsAppService } from "../../shared/services/notifications-app.service";
import { MesaggeText } from "../../shared/texts/mesagge-text";
import { MainStore } from "../../store/main-store";
import { ResponseUiService } from "../../utils/response-ui.service";
import { DatePickerModel, DatePickerBehaviorEnum, SDatepickerComponent } from "../../shared/components/s-datepicker/s-datepicker.component";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-consult2",
  templateUrl: "./consultmomento2.component.html",
  styleUrls: ["./consultmomento2.component.scss"]
})
@Pipe({
  name: "ConsultMomento2Component"
})
export class ConsultMomento2Component extends BaseConsult implements OnInit {
  @ViewChild("InputNamesAndLastName")
  InputNamesAndLastName: SInputComponent;
  @ViewChild("InputDateStartQuery")
  InputDateStartQuery: SDatepickerComponent;
  @ViewChild("InputNumberId")
  InputNumberId: SInputComponent;
  // @ViewChild("InputState")
  // InputState: SInputComponent;
  @ViewChild("GridConsulMoment2")
  GridConsulMoment2: SGridComponent;

  ACTION_DELETE: string = "DELETE";
  ACTION_EDIT: string = "EDIT";
  ACTION_CLOSE: string = "CLOSE";
  ACTION_CANCEL: string = "CANCEL";

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description realiza la solicitud y filtra los datos
   * @param filter
   * @param pageCurrent
   * @param pageSize
   */
  RequestFilterData(filter: any, pageCurrent: number, pageSize: number) {
    this._PageSize = pageSize;
    this._PageCurrent = pageCurrent;
    filter.pageCurrent = pageCurrent;
    filter.pageSize = pageSize;
    filter.userId = MainStore.db.GetUser().username;

    this.GetFilterDataAgent(filter).then((response: IResponseService) => {
      this.responseUI.CheckResponseForError(response);
      if (response.status == ResponseEnum.OK) {
        let data: ConsultGeneralModel = response.data;
        // this.FilterGrid.Data = data.items;
        this.FilterGrid.PageConfig.PageCurrent = data.pageCurrent;
        this.FilterGrid.PageConfig.PageSize = data.pageSize;
        this.GridConsulMoment2.SetNumberPages(data.numberPages);
        this.GridConsulMoment2.LoadItems(data.items);
      }
    });
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Obtener la informacion de los filtros de locomponentes
   */
  GetFiltersComponents() {
    let filters: any = {
      nombres: this.InputNamesAndLastName.GetData(),
      fechaInicio: this.InputDateStartQuery.GetData(),
      idNum: this.InputNumberId.GetData()
      // status: this.InputState.GetData()
    };
    return filters;
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Escucha el boton de actiones sobre la celda
   * @param params
   */
  OnActionBtn(params) {
    let element = this.FilterGrid.Data[params.position];
    if (params.btn.Action == this.ACTION_DELETE) {
      this.CheckDeleteItem(element, params.position);
    } else if (params.btn.Action == this.ACTION_EDIT) {
      this.CheckEditItem(element, params.position);
    } else if (params.btn.Action == this.ACTION_CLOSE) {
      this.CheckCloseItem(element, params.position);
    } else if (params.btn.Action == this.ACTION_CANCEL) {
      this.CheckCancelItem(element, params.position);
    }
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
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
   * @author Jorge Luis Caviedes Alvarador
   * @description Cerrar la solicitud
   * @param item
   * @param position
   */
  CheckCancelItem(item: any, position: any): any {
    SAlertComponent.Confirm(
      MesaggeText.TEXT_CANCEL_SOLICITUDE,
      true,
      MesaggeText.TITLE_CANCEL_SOLICITUDE
    ).then(isdelete => {
      isdelete &&
        this.stateClientServ
          .SetStateClient({
            idProspecto: item["idProspecto"],
            nextStep: StateFormEnum.CANCEL,
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
   * @author Jorge Luis Caviedes Alvarador
   * @description Se direje a la ultima vista en que quedo
   * @param item
   * @param position
   */
  CheckEditItem(item: any, position: any): any {
    SAlertComponent.Confirm(
      MesaggeText.TEXT_EDIT_SOLICITUDE,
      true,
      MesaggeText.TITLE_EDIT_SOLICITUDE
    ).then(iselect => {
      if (iselect) {
        this.EstablishProspect(item["idProspecto"]).then(() => {
          MainStore.db.SetLockFields({
            FieldIdDocument: true,
            FieldTypeDocument: true
          });
          let url =
            // resUrl.status == ResponseEnum.FAILURE?
            AddressesUrlParams.PathSectionForm(
              AddressesUrlParams.SECTION_07,
              AddressesUrlParams.PAGES_FORM
            );
          // : resUrl.data.url;
          this.route.navigateByUrl(url).then(() => {
            this.notyApp.ensablePage.emit(url);
          });
        });
      }
    });
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Solicita al usuario si desea eliminar el usuario
   * @param item
   * @param position
   */
  CheckDeleteItem(item: any, position: any): any {
    SAlertComponent.Confirm(
      MesaggeText.TEXT_DELETE_SOLICITUDE,
      true,
      MesaggeText.TITLE_DELETE_SOLICITUDE
    ).then(isdelete => {
      isdelete &&
        this.stateClientServ
          .DeleteClient({
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
   * @author Jorge Luis Caviedes Alvarador
   * @description Mostrar u ocultar los botones
   * @param item
   * @param stateValue
   */
  IsHiddenIconsGrid(item: any, stateValue: string) {
    if (item["estado"] == StateFormEsEnum.CREADO) {
      if (stateValue == this.ACTION_CLOSE) {
        return true;
      } else if (stateValue == this.ACTION_DELETE) {
        return false;
      } else if (stateValue == this.ACTION_EDIT) {
        return false;
      } else if (stateValue == this.ACTION_CANCEL) {
        return true;
      }
    }

    if (item["estado"] == StateFormEsEnum.CANCELADO) {
      if (stateValue == this.ACTION_CLOSE) {
        return false;
      } else if (stateValue == this.ACTION_DELETE) {
        return false;
      } else if (stateValue == this.ACTION_EDIT) {
        return false;
      }
    }

    if (item["estado"] == StateFormEsEnum.CERRADO) {
      if (stateValue == this.ACTION_CLOSE) {
        return false;
      } else if (stateValue == this.ACTION_DELETE) {
        return false;
      } else if (stateValue == this.ACTION_EDIT) {
        return false;
      }
    }

    /// finalizar es la representacion de por asignar
    if (item["estado"] == StateFormEsEnum.POR_ASIGNAR) {
      if (stateValue == this.ACTION_CLOSE) {
        return false;
      } else if (stateValue == this.ACTION_DELETE) {
        return false;
      } else if (stateValue == this.ACTION_EDIT) {
        return false;
      }
    }

    /// finalizar es la representacion es asignado
    if (item["estado"] == StateFormEsEnum.ASIGNADO) {
      if (stateValue == this.ACTION_CLOSE) {
        return false;
      } else if (stateValue == this.ACTION_DELETE) {
        return false;
      } else if (stateValue == this.ACTION_EDIT) {
        return true;
      } else if (stateValue == this.ACTION_CANCEL) {
        return true;
      }
    }

    if (item["estado"] == StateFormEsEnum.INCONSISTENCIA) {
      if (stateValue == this.ACTION_CLOSE) {
        return false;
      } else if (stateValue == this.ACTION_DELETE) {
        return false;
      } else if (stateValue == this.ACTION_EDIT) {
        return false;
      } else if (stateValue == this.ACTION_CANCEL) {
        return false;
      }
    }

    return true;
  }
  constructor(
    public consulService: ConsultService,
    public responseUI: ResponseUiService,
    public stateClientServ: SectionsService,
    private notyApp: NotificationsAppService,
    public route: Router
  ) {
    super(consulService, responseUI, stateClientServ);
  }

  ngOnInit() {
    this.OnClickFilter(null);
  }

  FilterNamesAndLastName: InputModel = {
    Label: "Nombre y/o Apellido"
  };

  FilterDateStartQuery: DatePickerModel = {
    Label: "Fecha Inicio Solicitud",
    Behavior: DatePickerBehaviorEnum.DateMaxCurrent
  };

  FilterNumberId: InputModel = {
    Label: "No. de Identificación"
  };

  FilterGrid: GridModel = {
    IsExportExcel: true,
    PageConfig: {
      IsPages: true,
      PageCurrent: this._PageCurrent,
      PageSize: this._PageSize
    },
    Columns: [
      {
        Label: "Fecha de Inicio M2",
        Key: "fechaCreacion",
        ApplyFormatFunc: value => {
          let data = new Date(value);
          var datePipe = new DatePipe("en-US");
          return value ? datePipe.transform(data, "dd-MM-yyyy") : "";
        }
      },
      { Label: "Número de la Solicitud", Key: "idsolicitud" },
      { Label: "Número del Id Prospecto", Key: "idProspecto" },
      { Label: "Estado", Key: "estado" },
      {
        Label: "Opciones",
        Key: "",
        Buttons: [
          {
            IconCss: "fas fa-user-lock",
            Action: this.ACTION_CANCEL,
            Title: "Cancelar",
            BeferoValid: item => {
              return this.IsHiddenIconsGrid(item, this.ACTION_CANCEL);
            }
          },

          {
            IconCss: "fas fa-sign-in-alt",
            Action: this.ACTION_EDIT,
            Title: "Editar",
            BeferoValid: item => {
              return this.IsHiddenIconsGrid(item, this.ACTION_EDIT);
            }
          }
        ]
      }
    ],
    Label: "",
    Data: []
  };
  ButtonImportDoc: ButtonModel = {
    Label: "Exportar",
    IconCss: "fa fa-file-excel"
  };

  ButtonFilter: ButtonModel = {
    Label: "Buscar",
    IconCss: "fas fa-search"
  };
}
