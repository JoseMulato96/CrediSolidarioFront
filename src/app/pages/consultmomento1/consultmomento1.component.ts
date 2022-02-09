import { DatePipe } from "@angular/common";
import { Component, OnInit, Pipe, ViewChild, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { Modal } from "ngx-modal";
import { ResponseEnum } from "../../enums/ResponseEnum.enum";
import { BaseConsult } from "../../extends/base-consult";
import { IResponseService } from "../../interfaces/response-service";
import { AddressesUrlParams } from "../../parameters/addresses-url-params";
import { ConsultService } from "../../services/consult.service";
import { SectionsService } from "../../services/sections.service";
import { SAlertComponent } from "../../shared/components/s-alert/s-alert.component";
import { AttachModel, SAttachementComponent } from "../../shared/components/s-attachement/s-attachement.component";
import { DatePickerBehaviorEnum, DatePickerModel, SDatepickerComponent } from "../../shared/components/s-datepicker/s-datepicker.component";
import { SGridComponent } from "../../shared/components/s-grid/s-grid.component";
import { SInputComponent } from "../../shared/components/s-input/s-input.component";
import { ButtonModel } from "../../shared/extends-components/bbutton-component";
import { GridModel, ColumnsGridModel } from "../../shared/extends-components/bgrid-component";
import { InputModel } from "../../shared/extends-components/binput-component";
import { ConsultGeneralModel } from "../../shared/models/consult-general-model";
import { StateFormEnum, StateFormEsEnum } from "../../shared/models/state-client-model";
import { NotificationsAppService } from "../../shared/services/notifications-app.service";
import { MesaggeText } from "../../shared/texts/mesagge-text";
import { MainStore } from "../../store/main-store";
import { ResponseUiService } from "../../utils/response-ui.service";
import { Utils } from "../../utils/utils";
import { Section4Model } from "../../shared/models/section4-model";
import { FormService } from "../../services/form.service";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-consult1",
  templateUrl: "./consultmomento1.component.html",
  styleUrls: ["./consultmomento1.component.scss"]
})
@Pipe({
  name: "ConsultMomento1Component"
})
export class ConsultMomento1Component extends BaseConsult implements OnInit {
  ultimaSection: string = 'section01';
  @ViewChild("InputNamesAndLastName")
  InputNamesAndLastName: SInputComponent;
  @ViewChild("InputDateStartQuery")
  InputDateStartQuery: SDatepickerComponent;
  @ViewChild("InputNumberId")
  InputNumberId: SInputComponent;
  @ViewChild("InputDateEndQuery")
  InputDateEndQuery: SDatepickerComponent;
  @ViewChild("InputState")
  InputState: SInputComponent;
  @ViewChild("GridConsulMoment1")
  GridConsulMoment1: SGridComponent;
  @ViewChild("modelObservation") ModelObservaciones: Modal;
  @ViewChild("modelFileupdate") ModelFileupdate: Modal;

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Escucha el evento click en el boton de filtrado
   * @param e eventos del cursor
   */
  OnClickFilter(e) {
    let filters: any = {
      nombres: this.InputNamesAndLastName.GetData(),
      inicioSolicitud: this.InputDateStartQuery.GetData(),
      finSolicitud: this.InputDateEndQuery.GetData(),
      idNum: this.InputNumberId.GetData(),
      status: this.InputState.GetData()
    };
    this.RequestFilterData(filters, 1, this._PageSize);
  }


  OnClickFilterSearch(e) {
    if (this.FilterDateStartQuery.Data == undefined || this.FilterDateEndQuery.Data == undefined || this.InputState.GetData() == undefined) {
      return SAlertComponent.AlertWarning("Los filtros fecha inicio solicitud,fecha fin solicitud y estado son obligatorios para realizar la busqueda");
    }
    let filters: any = {
      nombres: this.InputNamesAndLastName.GetData(),
      inicioSolicitud: this.InputDateStartQuery.GetData(),
      finSolicitud: this.InputDateEndQuery.GetData(),
      idNum: this.InputNumberId.GetData(),
      status: this.InputState.GetData()
    };
    this.RequestFilterData(filters, 1, this._PageSize);
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
    this.GetFilterDataCommercialForce(filter).then(
      (response: IResponseService) => {
        this.responseUI.CheckResponseForError(response);
        if (response.status == ResponseEnum.OK) {
          let data: ConsultGeneralModel = response.data;
          this.FilterGrid.PageConfig.PageCurrent = data.pageCurrent;
          this.FilterGrid.PageConfig.PageSize = data.pageSize;
          this.GridConsulMoment1.SetNumberPages(data.numberPages);
          this.GridConsulMoment1.LoadItems(data.items);
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
    let element = this.FilterGrid.Data[params.position];
    this._SelectRow = element;

    if (params.btn.Action == this.ACTION_DELETE) {
      this.CheckDeleteItem(element, params.position);
    } else if (params.btn.Action == this.ACTION_EDIT) {
      this.CheckEditItem(element, params.position);
    } else if (params.btn.Action == this.ACTION_CLOSE) {
      this.CheckCloseItem(element, params.position);
    } else if (params.btn.Action == this.ACTION_OBSERVATION) {
      this.OpenObservation(element, params.position);
    } else if (params.btn.Action == this.ACTION_CANCEL) {
      this.CheckCancelItem(element, params.position);
    } else if (params.btn.Action == this.ACTION_FILEUPDATE) {
      this.CheckUpdateItem(element, params.position);
    }
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description escucha cuando cambia el tamaño de la pagina
   */
  OnSelectPageSize(value) {
    let filters: any = {
      nombres: this.InputNamesAndLastName.GetData(),
      inicioSolicitud: this.InputDateStartQuery.GetData(),
      finSolicitud: this.InputDateEndQuery.GetData(),
      idNum: this.InputNumberId.GetData(),
      status: this.InputState.GetData()
    };
    this.RequestFilterData(filters, this._PageCurrent, value);
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Solo para cerrar el modal
   */
  ClickAcept() {
    this.ModelObservaciones.close();
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
   * @description Abre el modal con las observaciones
   * @param element item del row
   */
  OpenObservation(element: any, position: any): any {
    this.FieldObservation["Data"] = element.observacion;
    this.ModelObservaciones.open();
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description escucha el evento cuando cambia de pagina
   * @param page
   */
  OnSelectPage(page) {
    let filters: any = {
      nombres: this.InputNamesAndLastName.GetData(),
      inicioSolicitud: this.InputDateStartQuery.GetData(),
      finSolicitud: this.InputDateEndQuery.GetData(),
      idNum: this.InputNumberId.GetData(),
      status: this.InputState.GetData()
    };
    this.RequestFilterData(filters, page, this._PageSize);
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Cerrar la solicitud
   * @param item
   * @param position
   */
  CheckCloseItem(item: any, position: any): any {
    SAlertComponent.Confirm(
      MesaggeText.TEXT_CLOSE_SOLICITUDE,
      true,
      MesaggeText.TITLE_CLOSE_SOLICITUDE
    ).then(isclose => {
      isclose && SAlertComponent.ShowSpinner();
      isclose &&
        this.stateClientServ
          .SetStateClient({
            idProspecto: item["idProspecto"],
            nextStep: StateFormEnum.CLOSED,
            observacion: "",
            usuarioModificacion: MainStore.db.GetUser().username
          })
          .then((response: IResponseService) => {
            SAlertComponent.CloseSpinner();
            this.responseUI.CheckResponseForError(response).then(() => {
              if (response.status == ResponseEnum.OK) {
                SAlertComponent.AlertOk(
                  MesaggeText.TEXT_CONFIRM_CLOSE_SOLICITUDE
                );
                this.OnClickFilter(null);
              }
            });
          })
          .catch(error => {
            SAlertComponent.CloseSpinner();
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
        SAlertComponent.ShowSpinner();
        this.EstablishProspect(item["idProspecto"]).then(() => {
          SAlertComponent.CloseSpinner();
          MainStore.db.SetLockFields({
            FieldIdDocument: true,
            FieldTypeDocument: true
          });
          let url = "";

          this.formServ
            .GetPercentSolicitud(item["idProspecto"])
            .then(response => {
              SAlertComponent.ShowSpinner();
              let list = response;
              if (!list) {
                return;
              }
              this.ultimaSection = list[0]["ultimaSection"];
            });

          setTimeout(() => {
            if (this.ultimaSection == null) {
              this.ultimaSection = 'section01'
            }
            url = AddressesUrlParams.PathSectionForm(
              this.ultimaSection,
              AddressesUrlParams.PAGES_FORM
            );
            SAlertComponent.CloseSpinner();
            this.route.navigateByUrl(url).then(() => {
              this.notyApp.ensablePage.emit(url);
            });
          }, 2000);


          // if (item["estado"] === StateFormEsEnum.ASIGNADO) {
          //   url = AddressesUrlParams.PathSectionForm(
          //     AddressesUrlParams.SECTION_07,
          //     AddressesUrlParams.PAGES_FORM
          //   );
          // } else {
          //   url = AddressesUrlParams.PathSectionForm(
          //     AddressesUrlParams.SECTION_01,
          //     AddressesUrlParams.PAGES_FORM
          //   );
          // }          
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
   * @description Mostrar u ocultar los botones
   * @param item
   * @param stateValue
   */
  IsHiddenIconsGrid(item: any, stateValue: string) {
    if (item["estado"] == StateFormEsEnum.CREADO) {
      if (stateValue == this.ACTION_CLOSE) {
        return false;
      } else if (stateValue == this.ACTION_DELETE) {
        return true;
      } else if (stateValue == this.ACTION_EDIT) {
        return true;
      } else if (stateValue == this.ACTION_OBSERVATION) {
        return false;
      } else if (stateValue == this.ACTION_CANCEL) {
        return false;
      } else if (
        stateValue == this.ACTION_FILEUPDATE &&
        (item["tipoCargueArch"] == 1 || item["tipoCargueArch"] == null)
      ) {
        /// si el tipo de carga de archivo se ha selecionado docuwer
        return false;
      }
    }

    if (item["estado"] == StateFormEsEnum.CANCELADO) {
      if (stateValue == this.ACTION_CLOSE) {
        return false;
      } else if (stateValue == this.ACTION_DELETE) {
        return false;
      } else if (stateValue == this.ACTION_EDIT) {
        return false;
      } else if (stateValue == this.ACTION_OBSERVATION) {
        return false;
      } else if (stateValue == this.ACTION_CANCEL) {
        return false;
      } else if (stateValue == this.ACTION_FILEUPDATE) {
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
      } else if (stateValue == this.ACTION_OBSERVATION) {
        return false;
      } else if (stateValue == this.ACTION_CANCEL) {
        return false;
      } else if (stateValue == this.ACTION_FILEUPDATE) {
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
      } else if (stateValue == this.ACTION_OBSERVATION) {
        return false;
      } else if (stateValue == this.ACTION_CANCEL) {
        return false;
      } else if (
        stateValue == this.ACTION_FILEUPDATE &&
        item["tipoCargueArch"] == 1
      ) {
        /// si el tipo de carga de archivo se ha selecionado docuwer
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
        return MainStore.db.GetPCForceForCompleteForm();
      } else if (stateValue == this.ACTION_OBSERVATION) {
        return false;
      } else if (stateValue == this.ACTION_CANCEL) {
        return false;
      } else if (
        stateValue == this.ACTION_FILEUPDATE &&
        item["tipoCargueArch"] == 1
      ) {
        /// si el tipo de carga de archivo se ha selecionado docuwer
        return false;
      }
    }

    if (item["estado"] == StateFormEsEnum.INCONSISTENCIA) {
      if (stateValue == this.ACTION_CLOSE) {
        return false;
      } else if (stateValue == this.ACTION_OBSERVATION) {
        return true;
      } else if (stateValue == this.ACTION_DELETE) {
        return true;
      } else if (stateValue == this.ACTION_EDIT) {
        return true;
      } else if (stateValue == this.ACTION_CANCEL) {
        return false;
      } else if (
        stateValue == this.ACTION_FILEUPDATE &&
        item["tipoCargueArch"] == 1
      ) {
        /// si el tipo de carga de archivo se ha selecionado docuwer
        return false;
      }
    }

    if (item["estado"] == StateFormEsEnum.POR_FIRMAR) {
      if (stateValue == this.ACTION_CLOSE) {
        return true;
      } else if (stateValue == this.ACTION_OBSERVATION) {
        return false;
      } else if (stateValue == this.ACTION_DELETE) {
        return false;
      } else if (stateValue == this.ACTION_EDIT) {
        return false;
      } else if (stateValue == this.ACTION_CANCEL) {
        return false;
      } else if (
        stateValue == this.ACTION_FILEUPDATE &&
        item["tipoCargueArch"] == 1
      ) {
        /// si el tipo de carga de archivo se ha selecionado docuwer
        return false;
      }
    }



    return true;
  }

  _SelectRow: any;
  listFiles: any = {};
  DOC_ID: string = "{0} - Cedula";
  DOC_STUDY: string = "{0} - Sop Estudios";
  DOC_INGRESO: string = "{0} - Sop Ingresos";
  DOC_FORMULE: string = "{0} - Formulario";
  DOC_ACCOUNT: string = "{0} - Contador";
  DOC_OTHER_DOC: string = "{0} - Sop Otros Documentos";

  @ViewChild("InputDocument")
  InputDocument: SAttachementComponent;
  @ViewChild("InputSoportIngress")
  InputSoportIngress: SAttachementComponent;
  @ViewChild("InputSoInputSoportStudyortIngress")
  InputSoportStudy: SAttachementComponent;
  @ViewChild("InputVinculacion")
  InputVinculacion: SAttachementComponent;
  @ViewChild("InputOtherDocument")
  InputOtherDocument: SAttachementComponent;


  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description abre una ventana emergente para subir archivos
   * @param element
   * @param position
   */
  CheckUpdateItem(element: any, position: any): any {
    this.listFiles = {};
    this.FieldDocument.Data = undefined;
    this.FieldSoportIngress.Data = undefined;
    this.FieldSoportStudy.Data = undefined;
    this.FieldVinculacion.Data = undefined;
    this.FieldOtherDocument.Data = undefined;

    let idprospect = this._SelectRow["identificacionProspecto"];
    MainStore.db
      .GetFilesAdjuntNames(this._SelectRow["idProspecto"])
      .then((response: IResponseService) => {
        this.responseUI.CheckResponseForError(response).then(() => {
          if (response.status == ResponseEnum.OK) {
            let list: string[] = response.data;

            if (list && list.length) {
              this.FieldDocument.Name =
                list.find(x =>
                  x.startsWith(this.DOC_ID.replace("{0}", idprospect))
                ) || "";
              this.FieldSoportIngress.Name =
                list.find(x =>
                  x.startsWith(this.DOC_INGRESO.replace("{0}", idprospect))
                ) || "";
              this.FieldSoportStudy.Name =
                list.find(x =>
                  x.startsWith(this.DOC_STUDY.replace("{0}", idprospect))
                ) || "";
              this.FieldVinculacion.Name =
                list.find(x =>
                  x.startsWith(this.DOC_FORMULE.replace("{0}", idprospect))
                ) || "";
              this.FieldAccount.Name =
                list.find(x =>
                  x.startsWith(this.DOC_ACCOUNT.replace("{0}", idprospect))
                ) || "";
              this.FieldOtherDocument.Name =
                list.find(x =>
                  x.startsWith(this.DOC_OTHER_DOC.replace("{0}", idprospect))
                ) || "";
            }
          }
        });
      });
    this.ModelFileupdate.open();
    this.FieldDocument.Name = "";
    this.FieldSoportIngress.Name = "";
    this.FieldSoportStudy.Name = "";
    this.FieldVinculacion.Name = "";
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description adicionar archivo
   */
  async OnSelectFileDocument(file: File) {
    this.listFiles["document"] = {
      file: file,
      name:
        this.DOC_ID.replace("{0}", this._SelectRow["identificacionProspecto"]) +
        "." +
        Utils.ExtracExtFile(file.name)
    };
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description adicionar archivo
   */
  async OnSelectFileSoportIngress(file: File) {
    this.listFiles["soport"] = {
      file: file,
      name:
        this.DOC_INGRESO.replace(
          "{0}",
          this._SelectRow["identificacionProspecto"]
        ) +
        "." +
        Utils.ExtracExtFile(file.name)
    };
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description adicionar archivo
   */
  async OnSelectFileSoportStudy(file: File) {
    this.listFiles["study"] = {
      file: file,
      name:
        this.DOC_STUDY.replace(
          "{0}",
          this._SelectRow["identificacionProspecto"]
        ) +
        "." +
        Utils.ExtracExtFile(file.name)
    };
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description adicionar archivo
   */
  async OnSelectFileViculacion(file: File) {
    this.listFiles["viculacion"] = {
      file: file,
      name:
        this.DOC_FORMULE.replace(
          "{0}",
          this._SelectRow["identificacionProspecto"]
        ) +
        "." +
        Utils.ExtracExtFile(file.name)
    };
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description adicionar archivo
   */
  async OnSelectFileAccount(file: File) {
    this.listFiles["account"] = {
      file: file,
      name:
        this.DOC_ACCOUNT.replace(
          "{0}",
          this._SelectRow["identificacionProspecto"]
        ) +
        "." +
        Utils.ExtracExtFile(file.name)
    };
  }

  /**
   * @author Jose Wilson Mulato Escobar
   * @description adicionar archivo otros documentos
   */
  async OnSelectFileOtherDocument(file: File) {
    this.listFiles["other_document"] = {
      file: file,
      name:
        this.DOC_OTHER_DOC.replace(
          "{0}",
          this._SelectRow["identificacionProspecto"]
        ) +
        "." +
        Utils.ExtracExtFile(file.name)
    };
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description subida de archivo
   */
  OnClickUpload() {
    if (
      !this.listFiles["document"] &&
      !this.listFiles["soport"] &&
      !this.listFiles["study"] &&
      !this.listFiles["account"] &&
      !this.listFiles["viculacion"] &&
      !this.listFiles["other_document"]
    ) {
      return SAlertComponent.AlertError(MesaggeText.TEXT_NOT_FILES);
    }

    let formData = new FormData();

    for (const key in this.listFiles) {
      const element = this.listFiles[key];
      !!element && formData.append("files", element.file, element.name);
    }

    formData.append("user", MainStore.db.GetUser().username);
    formData.append("ip", MainStore.db.GetUser().ip);
    SAlertComponent.ShowSpinner();
    MainStore.db
      .SetSectionFiles(formData, this._SelectRow["idProspecto"])
      .then((response: IResponseService) => {
        this.responseUI.CheckResponseForError(response);
        if (response.status == ResponseEnum.OK) {
          this.ModelFileupdate.close();
          SAlertComponent.AlertOk(response.message);
        }
      })
      .catch(error => {
        this.responseUI.CheckResponseForError(error);
      });
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description cierra la ventana emergente
   */
  OnClickUploadCancel() {
    this.ModelFileupdate.close();
  }

  ///
  constructor(
    public consulService: ConsultService,
    public responseUI: ResponseUiService,
    public stateClientServ: SectionsService,
    public route: Router,
    private notyApp: NotificationsAppService,
    public formServ: FormService
  ) {
    super(consulService, responseUI, stateClientServ);
  }

  ngOnInit() {
    this.OnClickFilter(null);
  }

  FilterNamesAndLastName: InputModel = {
    Label: "Nombre y/o Apellido",
    Placeholder: "Luis Rodriguez"
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
    Label: "No. de Identificación",
    Placeholder: "68734902862"
  };

  FilterGrid: GridModel = {
    IsExportExcel: true,
    FunctionExportExcel: () => {
      this.ExportExcelFuerzaComercial();
    },
    PageConfig: {
      IsPages: true,
      PageCurrent: this._PageCurrent,
      PageSize: this._PageSize
    },
    Columns: [
      { Label: "# Solicitud", Key: "idsolicitud" },
      { Label: "Nombre y Apellido", Key: "nombres" },
      { Label: "Cédula Prospecto", Key: "cedulaprospecto" },
      { Label: "Correo Prospecto", Key: "correoprospecto" },
      { Label: "Celular", Key: "celular" },
      {
        Label: "Fecha de Creación",
        Key: "fechacreacion",
        ApplyFormatFunc: value => {
          let data = new Date(value);
          var datePipe = new DatePipe("en-US");
          return datePipe.transform(data, "dd-MM-yyyy");
        }
      },
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
            IconCss: "fas fa-user-lock",
            Action: this.ACTION_CLOSE,
            Title: "Cerrar",
            BeferoValid: item => {
              return this.IsHiddenIconsGrid(item, this.ACTION_CLOSE);
            }
          },
          {
            IconCss: "fas fa-user-times",
            Action: this.ACTION_DELETE,
            Title: "Eliminar",
            BeferoValid: item => {
              return this.IsHiddenIconsGrid(item, this.ACTION_DELETE);
            }
          },
          {
            IconCss: "fas fa-sign-in-alt",
            Action: this.ACTION_EDIT,
            Title: "Editar",
            BeferoValid: item => {
              return this.IsHiddenIconsGrid(item, this.ACTION_EDIT);
            }
          },
          {
            IconCss: "far fa-eye",
            Action: this.ACTION_OBSERVATION,
            Title: "Ver incosistencia",
            BeferoValid: item => {
              return this.IsHiddenIconsGrid(item, this.ACTION_OBSERVATION);
            }
          },
          {
            IconCss: "fas fa-file-upload",
            Action: this.ACTION_FILEUPDATE,
            Title: "Adjuntar",
            BeferoValid: item => {
              return this.IsHiddenIconsGrid(item, this.ACTION_FILEUPDATE);
            }
          }
        ]
      }
    ],
    Label: "",
    Data: []
  };


  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description realizar el servicio y exportar el excel el datto obtenido
   */
  ExportExcelFuerzaComercial() {
    if (this.FilterDateStartQuery.Data == undefined || this.FilterDateEndQuery.Data == undefined || this.InputState.GetData() == undefined) {
      return SAlertComponent.AlertWarning("Los filtros fecha inicio solicitud,fecha fin solicitud y estado son obligatorios para realizar la busqueda");
    }
    let filters: any = {
      nombres: this.InputNamesAndLastName.GetData(),
      inicioSolicitud: this.InputDateStartQuery.GetData(),
      finSolicitud: this.InputDateEndQuery.GetData(),
      idNum: this.InputNumberId.GetData(),
      status: this.InputState.GetData(),
      userId: MainStore.db.GetUser().username
    };
    this.GetFilterDataCommercialForceExport(filters).then((response: IResponseService) => {
      this.responseUI.CheckResponseForError(response).then(() => {
        if (response.status == ResponseEnum.OK) {
          let data = response.data.items;

          let columns = [
            { Label: "# Solicitud", Key: "idsolicitud" },
            { Label: "Nombre y Apellido", Key: "nombres" },
            { Label: "Cédula Prospecto", Key: "cedulaprospecto" },
            { Label: "Correo Prospecto", Key: "correoprospecto" },
            { Label: "Celular", Key: "celular" },
            {
              Label: "Fecha de Creación",
              Key: "fechacreacion",
              ApplyFormatFunc: value => {
                let data = new Date(value);
                var datePipe = new DatePipe("en-US");
                return datePipe.transform(data, "dd-MM-yyyy");
              }
            },
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
                this.GridConsulMoment1._FormatterValue(value, col, rowIndex)
              );
            }
            dataexport.push(row);
          }

          this.GridConsulMoment1.ExportFileExcelData(dataexport);
        }
      });
    });
  }

  ButtonFilter: ButtonModel = {
    Label: "Buscar",
    IconCss: "fas fa-search"
  };

  ButtonImportDoc: ButtonModel = {
    Label: "Exportar",
    IconCss: "fa fa-file-excel"
  };

  FieldObservation = {
    Label: "Observaciones"
  };

  filterfile: string = "image/png, .jpeg, .jpg, image/gif, .pdf";
  filterMaxSize: number = 4;

  FieldDocument: AttachModel = {
    Label: "Documento de identidad",
    Placeholder: "Ej. file.png",
    FilesAccept: this.filterfile,
    MaxSizeFile: this.filterMaxSize
    // Disable: true
  };
  FieldSoportIngress: AttachModel = {
    Label: "Soporte de Ingresos",
    Placeholder: "Ej. file.png",
    FilesAccept: this.filterfile,
    MaxSizeFile: this.filterMaxSize
    // Disable: true
  };
  FieldSoportStudy: AttachModel = {
    Label: "Soporte de estudios",
    Placeholder: "Ej. file.png",
    FilesAccept: this.filterfile,
    MaxSizeFile: this.filterMaxSize
    // Disable: true
  };
  FieldVinculacion: AttachModel = {
    Label: "Formulario",
    Placeholder: "Ej. file.png",
    FilesAccept: this.filterfile,
    MaxSizeFile: this.filterMaxSize
  };

  FieldAccount: AttachModel = {
    Label: "Tarjeta Profesional contador",
    Placeholder: "Ej. file.png",
    FilesAccept: this.filterfile,
    MaxSizeFile: this.filterMaxSize
  };

  FieldOtherDocument: AttachModel = {
    Label: "Otros Documentos",
    Placeholder: "Ej. file.png",
    FilesAccept: this.filterfile,
    MaxSizeFile: this.filterMaxSize
  };
}
