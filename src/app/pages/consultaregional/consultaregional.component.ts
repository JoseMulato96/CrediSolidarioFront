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
  InputModel
} from "../../shared/extends-components/binput-component";
import { ConsultGeneralModel } from "../../shared/models/consult-general-model";
import { FilterConsultModel } from "../../shared/models/filter-consult-model";
import { MesaggeText } from "../../shared/texts/mesagge-text";
import { MainStore } from "../../store/main-store";
import { OfficesStore } from "../../store/offices-store";
import { TerritoryStore } from "../../store/territory-store";
import { ResponseUiService } from "../../utils/response-ui.service";
import { DatePickerBehaviorEnum, DatePickerModel } from "../../shared/components/s-datepicker/s-datepicker.component";
import { SAlertComponent } from "../../shared/components/s-alert/s-alert.component";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-consultaregional",
  templateUrl: "./consultaregional.component.html",
  styleUrls: ["./consultaregional.component.scss"]
})
@Pipe({
  name: "ConsultRegionalComponent"
})
export class ConsultRegionalComponent extends BaseConsult implements OnInit {
  @ViewChild("InputZona")
  InputZona: SAutocompleteComponent;
  @ViewChild("InputDateStartQuery")
  InputDateStartQuery: SInputComponent;
  @ViewChild("InputDateEndQuery")
  InputDateEndQuery: SInputComponent;
  @ViewChild("InputState")
  InputState: SInputComponent;
  @ViewChild("InputAsoc")
  InputAsoc: SAutocompleteComponent;
  @ViewChild("InputAsoc")
  InputEjec: SAutocompleteComponent;
  @ViewChild("InputRegional")
  InputRegional: SAutocompleteComponent;
  @ViewChild("GridConsulRegional")
  GridConsulRegional: SGridComponent;
  @ViewChild(Modal) ModelIncidente: Modal;

  _SelectItem: any;

  GetFiltersComponents() {
    let filters: FilterConsultModel = {
      regional: this.InputRegional.GetData(),
      zona: this.InputZona.GetData(),
      status: this.InputState.GetData(),
      cedulaAsociado: this.InputAsoc.GetData(),
      cedulaEjecutivo: this.InputEjec.GetData(),
      fechaInicio: this.InputDateStartQuery.GetData(),
      fechaFin: this.InputDateEndQuery.GetData(),
      numDoc: MainStore.db.GetUser().numDoc
    };
    return filters;
  }

  /**
   * @author Jose Wilson Mulato
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

    this.GetConsultFilterLiderRegional(filter).then(
      (response: IResponseService) => {
        this.responseUI.CheckResponseForError(response);
        if (response.status == ResponseEnum.OK) {          
          let data: ConsultGeneralModel = response.data;
          this.FilterGrid.PageConfig.PageCurrent = data.pageCurrent;
          this.FilterGrid.PageConfig.PageSize = data.pageSize;
          this.GridConsulRegional.SetNumberPages(data.numberPages);
          for (let i = 0; i < data.items.length; i++) {
            this.GridConsulRegional.PushItems(data.items[i]);
          }
          // this.GridConsulRegional.LoadItems(data.items);
        }
      }
    );


    this.GetConsultFilterLiderRegionalEvidente(filter).then(
      (response: IResponseService) => {
        this.responseUI.CheckResponseForError(response);
        if (response.status == ResponseEnum.OK) {
          let data: ConsultGeneralModel = response.data;
          this.FilterGrid.PageConfig.PageCurrent = data.pageCurrent;
          this.FilterGrid.PageConfig.PageSize = data.pageSize;
          for (let i = 0; i < data.items.length; i++) {
            this.GridConsulRegional.PushItems(data.items[i]);
          }
        }
      }
    );
  }

  constructor(
    public consulService: ConsultService,
    public responseUI: ResponseUiService,
    public stateClientServ: SectionsService
  ) {
    super(consulService, responseUI, stateClientServ);
  }

  ngOnInit() {
    this.FilterRegional.Disable = true;
    this.InputRegional.SetDisable(true);
    this.OnClickFilter(null);
  }


  OnClickFilterSearch(e) {
    if (this.FilterDateStartQuery.Data == undefined || this.FilterDateEndQuery.Data == undefined || this.InputState.GetData() == undefined) {
      return SAlertComponent.AlertWarning("Los filtros fecha inicio solicitud,fecha fin solicitud y estado son obligatorios para realizar la busqueda");
    }
    let filters: any = {
      regional: this.InputRegional.GetData(),
      zona: this.InputZona.GetData(),
      status: this.InputState.GetData(),
      cedulaAsociado: this.InputAsoc.GetData(),
      cedulaEjecutivo: this.InputEjec.GetData(),
      fechaInicio: this.InputDateStartQuery.GetData(),
      fechaFin: this.InputDateEndQuery.GetData(),
      numDoc: MainStore.db.GetUser().numDoc
    };

    this.RequestFilterData(filters, 1, this._PageSize);
  }



  /**
   * @author Jose Wilson Mulato
   * @description realizar el servicio y exportar el excel el datto obtenido
   */
  ExportExcelLiderRegional() {
    if (this.FilterDateStartQuery.Data == undefined || this.FilterDateEndQuery.Data == undefined || this.InputState.GetData() == undefined) {
      return SAlertComponent.AlertWarning("Los filtros fecha inicio solicitud,fecha fin solicitud y estado son obligatorios para realizar la busqueda");
    }
    let filters: any = {
      regional: this.InputRegional.GetData(),
      zona: this.InputZona.GetData(),
      status: this.InputState.GetData(),
      cedulaAsociado: this.InputAsoc.GetData(),
      cedulaEjecutivo: this.InputEjec.GetData(),
      fechaInicio: this.InputDateStartQuery.GetData(),
      fechaFin: this.InputDateEndQuery.GetData(),
      numDoc: MainStore.db.GetUser().numDoc,
      userId: MainStore.db.GetUser().username
    };
    this.GetFilterDataLiderRegionalExport(filters).then((response: IResponseService) => {
      this.responseUI.CheckResponseForError(response).then(() => {
        if (response.status == ResponseEnum.OK) {
          let data = response.data.items;

          let columns = [
            { Label: "# Solicitud  ", Key: "idsolicitud" },
            { Label: "Regional", Key: "regional" },
            { Label: "Zona", Key: "zona" },
            {
              Label: "Fecha de Creacion",
              Key: "fechaCreacion",
              ApplyFormatFunc: value => {
                let data = new Date(value);
                var datePipe = new DatePipe("en-US");
                return value ? datePipe.transform(data, "dd-MM-yyyy") : "";
              }
            },
            { Label: "Cedula Ejecutivo", Key: "cedulaEjecutivo" },
            { Label: "Cargo", Key: "cargo" },
            { Label: "Cedula Asociado", Key: "cedulaAsociado" },
            { Label: "Correo Asociado", Key: "correoAsociado" },
            { Label: "Estado", Key: "estado" }
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
                this.GridConsulRegional._FormatterValue(value, col, rowIndex)
              );
            }
            dataexport.push(row);
          }

          this.GridConsulRegional.ExportFileExcelData(dataexport);
        }
      });
    });
  }

  FilterZona: AutocompleteModel = {
    Label: "Zona",
    ItemsByStore: OfficesStore.name,
    FunctionStore: "GetOfficeZona"
  };

  FilterIdAsoc: InputModel = {
    Label: "No. Cédula Asociado",
    Placeholder: "68734902862"
  };

  FilterIdEjec: InputModel = {
    Label: "No. Cédula Ejecutivo",
    Placeholder: "68734902862"
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
      this.ExportExcelLiderRegional();
    },
    PageConfig: {
      IsPages: true,
      PageCurrent: this._PageCurrent,
      PageSize: this._PageSize
    },
    Columns: [
      { Label: "# Solicitud  ", Key: "idsolicitud" },
      { Label: "Regional", Key: "regional" },
      { Label: "Zona", Key: "zona" },
      {
        Label: "Fecha de Creacion",
        Key: "fechaCreacion",
        ApplyFormatFunc: value => {
          let data = new Date(value);
          var datePipe = new DatePipe("en-US");
          return value ? datePipe.transform(data, "dd-MM-yyyy") : "";
        }
      },
      { Label: "Cedula Ejecutivo", Key: "cedulaEjecutivo" },
      { Label: "Cargo", Key: "cargo" },
      { Label: "Cedula Asociado", Key: "cedulaAsociado" },
      { Label: "Correo Asociado", Key: "correoAsociado" },
      { Label: "Estado", Key: "estado" }
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
    Disable: true,
    ItemsByStore: OfficesStore.name,
    FunctionStore: "GetOffice",
    DefaultOptionParamterStore: {
      nivel: 2
    }
  };
}
