import { Component, OnInit, ViewChild } from "@angular/core";
import { Modal } from "ngx-modal";
import { ResponseEnum } from "../../enums/ResponseEnum.enum";
import { BaseConsult } from "../../extends/base-consult";
import { IResponseService } from "../../interfaces/response-service";
import { ConsultService } from "../../services/consult.service";
import { SectionsService } from "../../services/sections.service";
import { SAlertComponent } from "../../shared/components/s-alert/s-alert.component";
import { AutocompleteModel } from "../../shared/components/s-autocomplete/s-autocomplete.component";
import { SGridComponent } from "../../shared/components/s-grid/s-grid.component";
import { SInputComponent } from "../../shared/components/s-input/s-input.component";
import { ButtonModel } from "../../shared/extends-components/bbutton-component";
import { GridModel } from "../../shared/extends-components/bgrid-component";
import {
  InputEnum,
  InputModel
} from "../../shared/extends-components/binput-component";
import { ConsultGeneralModel } from "../../shared/models/consult-general-model";
import { StateFormEsEnum } from "../../shared/models/state-client-model";
import { MesaggeText } from "../../shared/texts/mesagge-text";
import { AgentsStore } from "../../store/agents-store";
import { MainStore } from "../../store/main-store";
import { ResponseUiService } from "../../utils/response-ui.service";

@Component({
  selector: "app-assign",
  templateUrl: "./assign.component.html",
  styleUrls: ["./assign.component.scss"]
})
export class AssignComponent extends BaseConsult implements OnInit {
  @ViewChild("InputFilterAgent")
  InputFilterAgent: SInputComponent;

  @ViewChild("InputNumberId")
  InputNumberId: SInputComponent;

  @ViewChild("InputState")
  InputState: SInputComponent;

  @ViewChild("InputIdProspect")
  InputIdProspect: SInputComponent;

  @ViewChild("GridFilter")
  GridFilter: SGridComponent;

  @ViewChild(Modal) ModelAssign: Modal;

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Obtener la informacion de los filtros de locomponentes
   */
  GetFiltersComponents() {
    let filters: any = {
      idAgente: this.InputFilterAgent.GetData(),
      idSolicitud: this.InputNumberId.GetData(),
      status: this.InputState.GetData(),
      idProspecto: this.InputIdProspect.GetData()
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

    this.GetFilterDataSupervisor(filter).then((response: IResponseService) => {
      this.responseUI.CheckResponseForError(response);
      if (response.status == ResponseEnum.OK) {
        let data: ConsultGeneralModel = response.data;
        this.GridFilter.SetPageConfig({
          PageCurrent: data.pageCurrent,
          PageSize: data.pageSize
        });
        this.GridFilter.SetNumberPages(data.numberPages);
        this.GridFilter.LoadItems(data.items);
      }
    });
  }

  _BtnAssignDisable: boolean = true;

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description escuchar cuando dar cancelar
   */
  OnClickCancel(e) {
    this.ModelAssign.close();
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description escuchar cuando seleciona un row
   */
  OnSelectRow(item) {
    if (!item) {
      this._BtnAssignDisable = true;
    } else {
      this._BtnAssignDisable = false;
    }
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
    } else if (params.btn.Action == this.ACTION_CLOSE) {
      this.CheckCloseItem(element, params.position);
    }
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   */
  _OnClickAssign() {
    if (!this.FilterGrid.Data) {
      return SAlertComponent.AlertWarning(MesaggeText.TEXT_NOT_SELECT_ASSIGN);
    }
    this.ModelAssign.open();
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description escucha cuando reasigna
   */
  _OnClickReAssign() {
    this._OnClickAssign();
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description solo se permite
   */
  FilterState: InputModel = {
    Label: "Estado",
    Placeholder: "Eligir el estado",
    Items: [
      { Value: 4116, Label: "POR ASIGNAR" },
      { Value: 4117, Label: "ASIGNADO" }
    ]
  };

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
   * @description Obteniendo
   */
  ClickComfirm() {
    if (!this.FieldSelectAgent.Data) {
      return SAlertComponent.AlertWarning("El campo es obligatorio");
    }
    let selects: any[] = this.FilterGrid.Data.filter(x => x._Select);
    selects.forEach((f, index) => {
      this.consulService.GetAssign(
        f["idsolicitud"],
        this.FieldSelectAgent.Data["Value"],
        this.FieldSelectAgent.Data["Tag"]
      );

      if (index == selects.length - 1) {
        this.consulService
          .GetAssign(
            f["idsolicitud"],
            this.FieldSelectAgent.Data["Value"],
            this.FieldSelectAgent.Data["Tag"]
          )
          .then(() => {
            this.OnClickFilter(null);
          });
      } else {
        this.consulService.GetAssign(
          f["idsolicitud"],
          this.FieldSelectAgent.Data["Value"],
          this.FieldSelectAgent.Data["Label"]
        );
      }
    });
    this.ModelAssign.close();
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
        return false;
      }
      if (stateValue == this.ACTION_DELETE) {
        return true;
      }
      if (stateValue == this.ACTION_EDIT) {
        return true;
      }
    }

    if (item["estado"] == StateFormEsEnum.CANCELADO) {
      if (stateValue == this.ACTION_CLOSE) {
        return false;
      } else if (stateValue == this.ACTION_DELETE) {
        return false;
      } else if (stateValue == this.ACTION_EDIT) {
        return true;
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
        return true;
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
      }
    }

    if (item["estado"] == StateFormEsEnum.INCONSISTENCIA) {
      if (stateValue == this.ACTION_CLOSE) {
        return false;
      } else if (stateValue == this.ACTION_DELETE) {
        return true;
      } else if (stateValue == this.ACTION_EDIT) {
        return true;
      }
    }

    return true;
  }

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

  FilterAgent: InputModel = {
    Label: "Agente",
    ItemsByStore: AgentsStore.name
  };

  FilterNumberId: InputModel = {
    Label: "No. de Solicitud"
  };

  FilterIdProspect: InputModel = {
    Label: "Cedula del Prospecto",
    Type: InputEnum.Text
  };

  ButtonImportDoc: ButtonModel = {
    Label: "Exportar",
    IconCss: "fa fa-file-excel"
  };

  FieldSelectAgent: AutocompleteModel = {
    Label: "Agente",
    ItemsByStore: AgentsStore.name,
    IsRequired: true
  };

  FilterGrid: GridModel = {
    IsExportExcel: true,

    PageConfig: {
      IsPages: true,
      PageCurrent: this._PageCurrent,
      PageSize: this._PageSize
    },
    Columns: [
      { Label: "Agente", Key: "agente" },
      { Label: "Número de la Solicitud", Key: "idsolicitud" },
      { Label: "Número ID prospecto", Key: "identificacionProspecto" },
      { Label: "Número ID Fuerza Comercial", Key: "idFuerzaComercial" },
      { Label: "Estado", Key: "estado" },
      {
        Label: "Opciones",
        Key: "",
        IsCheckboxs: true
      }
    ],
    Label: "",
    Data: []
  };

  ButtonFilter: ButtonModel = {
    Label: "Buscar",
    IconCss: "fas fa-search"
  };
}
