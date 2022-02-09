import { DatePipe } from "@angular/common";
import {
  Component,
  OnInit,
  Pipe,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import { Modal } from "ngx-modal";
import { ResponseEnum } from "../../enums/ResponseEnum.enum";
import { BaseConsult } from "../../extends/base-consult";
import { IResponseService } from "../../interfaces/response-service";
import { ConsultService } from "../../services/consult.service";
import { SectionsService } from "../../services/sections.service";
import { SAlertComponent } from "../../shared/components/s-alert/s-alert.component";
import { AreaTextModel } from "../../shared/components/s-area-text/s-area-text.component";
import {
  AutocompleteModel,
  SAutocompleteComponent
} from "../../shared/components/s-autocomplete/s-autocomplete.component";
import { SGridComponent } from "../../shared/components/s-grid/s-grid.component";
import { SInputComponent } from "../../shared/components/s-input/s-input.component";
import { ButtonModel } from "../../shared/extends-components/bbutton-component";
import {
  ColumnsGridModel,
  GridModel
} from "../../shared/extends-components/bgrid-component";
import {
  InputEnum,
  InputModel
} from "../../shared/extends-components/binput-component";
import { ConsultGeneralModel } from "../../shared/models/consult-general-model";
import { FilterConsultModel } from "../../shared/models/filter-consult-model";
import {
  StateFormEnum,
  StateFormEsEnum
} from "../../shared/models/state-client-model";
import { MesaggeText } from "../../shared/texts/mesagge-text";
import { MainStore } from "../../store/main-store";
import { OfficesStore } from "../../store/offices-store";
import { TerritoryStore } from "../../store/territory-store";
import { ResponseUiService } from "../../utils/response-ui.service";
import { DatePickerBehaviorEnum, DatePickerModel } from "../../shared/components/s-datepicker/s-datepicker.component";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-consultaux",
  templateUrl: "./consultaux.component.html",
  styleUrls: ["./consultaux.component.scss"]
})
@Pipe({
  name: "ConsultAuxComponent"
})
export class ConsultAuxComponent extends BaseConsult implements OnInit {
  @ViewChild("InputZona")
  InputZona: SAutocompleteComponent;
  @ViewChild("InputDateStartQuery")
  InputDateStartQuery: SInputComponent;
  @ViewChild("InputDateEndQuery")
  InputDateEndQuery: SInputComponent;
  @ViewChild("InputState")
  InputState: SInputComponent;
  @ViewChild("InputCity")
  InputCity: SAutocompleteComponent;
  @ViewChild("InputProspect")
  InputProspect: SAutocompleteComponent;
  @ViewChild("InputIdFuerza")
  InputIdFuerza: SInputComponent;
  @ViewChild("InputRegional")
  InputRegional: SAutocompleteComponent;
  @ViewChild("GridConsulMoment2")
  GridConsulMoment2: SGridComponent;
  @ViewChild(Modal) ModelIncidente: Modal;

  _SelectItem: any;

  GetFiltersComponents() {
    let filters: FilterConsultModel = {
      zona: this.InputZona.GetData(),
      fechaInicio: this.InputDateStartQuery.GetData(),
      fechaFin: this.InputDateEndQuery.GetData(),
      idCiudad: this.InputCity.GetData(),
      idFuerza: this.InputIdFuerza.GetData(),
      identProspecto: this.InputProspect.GetData(),
      idLocalizacionCoomeva: this.InputRegional.GetData(),
      status: this.InputState.GetData()
    };

    return filters;
  }

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

    this.GetFilterDataAuxSupervisor(filter).then(
      (response: IResponseService) => {
        this.responseUI.CheckResponseForError(response);
        if (response.status == ResponseEnum.OK) {
          let data: ConsultGeneralModel = response.data;
          // this.FilterGrid.Data = data.items;
          this.FilterGrid.PageConfig.PageCurrent = data.pageCurrent;
          this.FilterGrid.PageConfig.PageSize = data.pageSize;
          this.GridConsulMoment2.SetNumberPages(data.numberPages);
          this.GridConsulMoment2.LoadItems(data.items);
        }
      }
    );
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Escucha el boton de actiones sobre la celda
   * @param params
   */
  OnActionBtn(params) {
    this._SelectItem = undefined;
    let element = this.FilterGrid.Data[params.position];
    if (params.btn.Action == this.ACTION_INCIDENT) {
      this.CheckIncidentItem(element, params.position);
    } else if (params.btn.Action == this.ACTION_CLOSE) {
      this.CheckCloseItem(element, params.position);
    } else if (params.btn.Action == this.ACTION_REOPEN) {
      this.CheckReopenItem(element, params.position);
    }
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description abre el window emergente de los incidente
   * @param element
   * @param position
   */
  CheckIncidentItem(element: any, position: any): any {
    this._SelectItem = element;
    this.ModelIncidente.open();
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description escucha al confirmar el click del window emergente
   */
  ClickComfirm() {
    if (!this.FieldObservation.Data) {
      return SAlertComponent.AlertWarning(MesaggeText.TEXT_OBESERVATION);
    }
    this.ModelIncidente.close();
    this.stateClientServ
      .SetStateClient({
        idProspecto: this._SelectItem["idProspecto"],
        nextStep: StateFormEnum.INCONSISTENCY,
        observacion: this.FieldObservation.Data,
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
    ).then(isclose => {
      isclose && SAlertComponent.ShowSpinner();
      isclose &&
        this.stateClientServ
          .SetStateClient({
            idProspecto: item["idProspecto"],
            nextStep: "",
            observacion: "",
            usuarioModificacion: MainStore.db.GetUser().username
          })
          .then((response: IResponseService) => {
            SAlertComponent.CloseSpinner();
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
   * @author Cesar Augusto Millan
   * @description Solicita al usuario si desea Reabrir la solicitud
   * @param item
   * @param position
   */
  CheckReopenItem(item: any, position: any): any {
    SAlertComponent.Confirm2(
      MesaggeText.TEXT_REOPEN_SOLICITUDE,
      true,
      MesaggeText.TITLE_REOPEN_SOLICITUDE,
      ["No", "SI"]
    ).then(ischange => {
      ischange && SAlertComponent.ShowSpinner();
      ischange &&
        this.stateClientServ
          .SetStateClient({
            idProspecto: item["idProspecto"],
            nextStep: "REOPEN",
            observacion: "",
            usuarioModificacion: MainStore.db.GetUser().username
          })
          .then((response: IResponseService) => {
            SAlertComponent.CloseSpinner();
            this.responseUI.CheckResponseForError(response).then(() => {
              if (response.status == ResponseEnum.OK) {
                SAlertComponent.AlertOk(response.message);
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
    ).then(isdelete => { });
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
      isdelete && SAlertComponent.ShowSpinner();
      isdelete &&
        this.stateClientServ
          .DeleteClient({
            idProspecto: item["idProspecto"],
            nextStep: "",
            observacion: "",
            usuarioModificacion: MainStore.db.GetUser().username
          })
          .then((response: IResponseService) => {
            SAlertComponent.CloseSpinner();
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
   * @description realizar el servicio y exportar el excel el datto obtenido
   */
  ExportExcelAux() {
    if (this.FilterDateStartQuery.Data == undefined || this.FilterDateEndQuery.Data == undefined || this.InputState.GetData() == undefined) {
      return SAlertComponent.AlertWarning("Los filtros fecha inicio solicitud,fecha fin solicitud y estado son obligatorios para realizar la busqueda");
    }
    let ids: number[] = [];        
    this.FilterGrid.Data.forEach((item: any) => {      
      ids.push(parseInt(item["idSolicitud"]));
    });
    this.ExportExcelData(ids, 1000, 1).then((response: IResponseService) => {
      this.responseUI.CheckResponseForError(response).then(() => {
        if (response.status == ResponseEnum.OK) {
          let data = response.data.items;

          // Número de solicitud
          // , Estado inicial
          // , Estado final
          // , Fecha de cambio
          // , Hora del cambio
          // , Usuario de modificación.
          let columns = [
            { Label: "Número de solicitud", Key: "idSolicitud" },
            { Label: "Estado Inicial", Key: "estadoInicial" },
            { Label: "Estado Final", Key: "estadoFinal" },
            {
              Label: "Fecha de cambio",
              Key: "fechaCambio",
              ApplyFormatFunc: value => {
                let data = new Date(value);
                var datePipe = new DatePipe("en-US");
                return value ? datePipe.transform(data, "dd-MM-yyyy") : "";
              }
            },
            {
              Label: "Hora del cambio",
              Key: "fechaCambio",
              ApplyFormatFunc: value => {
                let data = new Date(value);
                var datePipe = new DatePipe("en-US");
                return value ? datePipe.transform(data, "HH:mm:ss") : "";
              }
            },
            { Label: "Usuario de modificacion", Key: "usuarioModificacion" }
            //  , { Label: "Id Prospecto", Key: "idProspecto" },
            //   { Label: "Observacion", Key: "observacion" },
          ];

          let dataexport: Array<Array<string>> = [];
          let rowCol: string[] = [];
          for (let index = 0; index < columns.length; index++) {
            rowCol.push(columns[index].Label);
          }

          dataexport.push(rowCol);

          let row: string[] = [];
          for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
            let value = data[rowIndex];
            row = [];
            for (let index = 0; index < columns.length; index++) {
              let col: ColumnsGridModel = columns[index];

              row.push(
                this.GridConsulMoment2._FormatterValue(value, col, rowIndex)
              );
            }
            dataexport.push(row);
          }

          this.GridConsulMoment2.ExportFileExcelData(dataexport);
        }
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
      if (stateValue == this.ACTION_INCIDENT) {
        return false;
      } else if (stateValue == this.ACTION_REOPEN) {
        return false;
      }
    }

    if (item["estado"] == StateFormEsEnum.CANCELADO) {
      if (stateValue == this.ACTION_INCIDENT) {
        return false;
      } else if (stateValue == this.ACTION_REOPEN) {
        return true;
      }
    }

    if (item["estado"] == StateFormEsEnum.CERRADO) {
      if (stateValue == this.ACTION_INCIDENT) {
        return true;
      } else if (stateValue == this.ACTION_REOPEN) {
        return false;
      }
    }

    /// finalizar es la representacion de por asignar
    if (item["estado"] == StateFormEsEnum.POR_ASIGNAR) {
      if (stateValue == this.ACTION_INCIDENT) {
        return false;
      } else if (stateValue == this.ACTION_REOPEN) {
        return false;
      }
    }

    /// finalizar es la representacion es asignado
    if (item["estado"] == StateFormEsEnum.ASIGNADO) {
      if (stateValue == this.ACTION_INCIDENT) {
        return false;
      } else if (stateValue == this.ACTION_REOPEN) {
        return true;
      }
    }

    if (item["estado"] == StateFormEsEnum.INCONSISTENCIA) {
      if (stateValue == this.ACTION_INCIDENT) {
        return false;
      } else if (stateValue == this.ACTION_REOPEN) {
        return false;
      }
    }

    if (item["estado"] == StateFormEsEnum.POR_FIRMAR) {
      if (stateValue == this.ACTION_INCIDENT) {
        return false;
      } else if (stateValue == this.ACTION_REOPEN) {
        return true;
      }
    }
    return false;
  }
  ///
  constructor(
    public consulService: ConsultService,
    public responseUI: ResponseUiService,
    public stateClientServ: SectionsService
  ) {
    super(consulService, responseUI, stateClientServ);
  }

  ngOnInit() {
    this.OnClickFilter(null);
  }


  OnClickFilterSearch(e) {
    if (this.FilterDateStartQuery.Data == undefined || this.FilterDateEndQuery.Data == undefined || this.InputState.GetData() == undefined) {
      return SAlertComponent.AlertWarning("Los filtros fecha inicio solicitud,fecha fin solicitud y estado son obligatorios para realizar la busqueda");
    }
    this.OnClickFilter(null);
  }

  FilterZona: AutocompleteModel = {
    Label: "Zona",
    ItemsByStore: OfficesStore.name,
    FunctionStore: "GetOfficeZona"
  };

  FilterIdProspect: InputModel = {
    Label: "No. Cédula Prospecto"
  };

  FilterCity: AutocompleteModel = {
    Label: "Ciudad",
    ItemsByStore: TerritoryStore.name,
    FunctionStore: "GetServiceCities",
    MinChars: 3,
    IsActionWrittenStore: true,
    DefaultOptionParamterStore: { country: 2 },
    Tooltip: {
      Label: MesaggeText.TOOLTIP_TYPING_SEARCH
    }
  };

  FilterDateStartQuery: DatePickerModel = {
    Label: "Fecha Inicio Solicitud",
    Behavior: DatePickerBehaviorEnum.DateMaxCurrent
  };

  FilterDateEndQuery: DatePickerModel = {
    Label: "Fecha Fin Solicitud",
    Behavior: DatePickerBehaviorEnum.DateMaxCurrent
  };

  FilterNumberId: InputModel = {
    Label: "Numero de Identificación Fuerza Comercial"
  };

  FilterGrid: GridModel = {
    IsExportExcel: true,
    FunctionExportExcel: () => {
      this.ExportExcelAux();
    },
    PageConfig: {
      IsPages: true,
      PageCurrent: this._PageCurrent,
      PageSize: this._PageSize
    },
    Columns: [
      { Label: "Número del Solicitud  ", Key: "idSolicitud" },
      // { Label: "Número del Id Prospecto", Key: "idProspecto" },
      { Label: "Cédula Prospecto", Key: "numIdent" },
      { Label: "Correo Prospecto", Key: "correoProspecto" },
      { Label: "Cargo", Key: "cargo" },
      { Label: "Regional Ciudad", Key: "regional" },
      { Label: "Zona", Key: "zona" },
      { Label: "Número ID Fuerza Comercial", Key: "idFuerza" },
      {
        Label: "Fecha de Creacion",
        Key: "fechaCreacion",
        ApplyFormatFunc: value => {
          let data = new Date(value);
          var datePipe = new DatePipe("en-US");
          return value ? datePipe.transform(data, "dd-MM-yyyy") : "";
        }
      },
      { Label: "Estado", Key: "estado" },
      {
        Label: "Opciones",
        Key: "",
        Buttons: [
          {
            IconCss: "fas fa-exclamation-triangle",
            Action: this.ACTION_INCIDENT,
            Title: "Incidente",
            BeferoValid: item => {
              return this.IsHiddenIconsGrid(item, this.ACTION_INCIDENT);
            }
          }
          , {
            IconCss: "fas fa-folder-open",
            Action: this.ACTION_REOPEN,
            Title: "Reabrir",
            BeferoValid: item => {
              return this.IsHiddenIconsGrid(item, this.ACTION_REOPEN);
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

  FieldObservation: AreaTextModel = {
    Label: "Observacion",
    IsRequired: true
  };

  FilterRegional: AutocompleteModel = {
    Label: "Regional",
    ItemsByStore: OfficesStore.name,
    FunctionStore: "GetOffice",
    DefaultOptionParamterStore: {
      nivel: 2
    }
  };
}
