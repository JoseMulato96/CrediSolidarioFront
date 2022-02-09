import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { NavigationStart, Router } from "@angular/router";
import { Modal } from "ngx-modal";
import { ResponseEnum } from "../../enums/ResponseEnum.enum";
import { BaseForm } from "../../extends/base-form";
import { IFormSection } from "../../interfaces/form-section";
import { IResponseService } from "../../interfaces/response-service";
import { AddressesUrlParams } from "../../parameters/addresses-url-params";
import { NotificationService } from "../../services/notification.service";
import { SectionsService } from "../../services/sections.service";
import { SAlertComponent } from "../../shared/components/s-alert/s-alert.component";
import {
  AreaTextModel,
  SAreaTextComponent
} from "../../shared/components/s-area-text/s-area-text.component";
import {
  ComboboxModel,
  SComboboxComponent
} from "../../shared/components/s-combobox/s-combobox.component";
import { ItemSubMenu } from "../../shared/components/s-submenu/s-submenu.component";
import { StateFormEnum } from "../../shared/models/state-client-model";
import { NotificationsAppService } from "../../shared/services/notifications-app.service";
import { ButtonModel } from "../../shared/extends-components/bbutton-component";
import { LockSectionsModel } from "../../shared/models/lock-section-model";
import { InputModel } from "../../shared/extends-components/binput-component";
import { MesaggeText } from "../../shared/texts/mesagge-text";
import { MainStore } from "../../store/main-store";
import { ResponseUiService } from "../../utils/response-ui.service";
import { RolsEnum } from "../../enums/RolsEnum.enum";
import { SInputComponent } from "../../shared/components/s-input/s-input.component";
import { regexType } from "../../utils/regexDefault";
import { ConfirmaEmailAdobeSignDTO } from "../../shared/models/ConfirmaEmailAdobeSignDTO";
import { FormService } from "../../services/form.service";
import { ImasterContent } from "../../interfaces/imaster-content";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-form1",
  templateUrl: "./form1.component.html",
  styleUrls: ["./form1.component.scss"]
})
export class Form1Component extends BaseForm implements OnInit {
  percent: string = "0";
  lstSections: ImasterContent[];
  /// obtener los componentes
  @ViewChild(Modal) ModelState: Modal;
  @ViewChild('modalConfirmEmail') modalConfirmEmail: Modal;
  @ViewChild('modalListaSection') modalListaSection: Modal;
  @ViewChild("ComboboxState") ComboboxState: SComboboxComponent;
  @ViewChild("AreaTextObservation") AreaTextObservation: SAreaTextComponent;

  //Obtiene inputs de segundo modal   
  @ViewChild('InputNombre1Act') InputNombre1Act: SInputComponent;
  @ViewChild('InputNombre2Act') InputNombre2Act: SInputComponent;
  @ViewChild('InputApellido1Act') InputApellido1Act: SInputComponent;
  @ViewChild('InputApellido2Act') InputApellido2Act: SInputComponent;
  @ViewChild('InputCedulaAct') InputCedulaAct: SInputComponent;
  @ViewChild('InputCelularlAct') InputCelularlAct: SInputComponent;

  @ViewChild('InputEmailAct') InputEmailAct: SInputComponent;
  // @ViewChild("InputEmailConfirm") InputEmailConfirm: SInputComponent;
  dtoConfirmEmailAdobe: ConfirmaEmailAdobeSignDTO;
  constructor(
    public router: Router,
    public stateClientServ: SectionsService,
    public emailServ: NotificationService,
    public notyApp: NotificationsAppService,
    private responseUI: ResponseUiService,
    public formServ: FormService
  ) {
    super(router, notyApp);
    this.router.events.subscribe(val => {
      if (val instanceof NavigationStart) {
        this.WatcherUrl(val.url.slice(1));
      }
    });

    this.notyApp.UpdateFiles.subscribe(x => this.ValidaDisableBtns());
    this.notyApp.ValidateBtnContinue.subscribe(x => this.ValidaBtnContinue());
  }

  ngOnInit() {
    if (MainStore.db.GetIdPropect() != undefined) {
      this.loadPercentg(MainStore.db.GetIdPropect());
    }

    !MainStore.db.IsExitClient() &&
      this.GoSection(AddressesUrlParams.SECTION_01);
  }

  OnClickItem(item: ItemSubMenu) { }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description El sistema en ruta la url para ir a la session enviada
   * @param sectionUrl
   */
  GoSection(sectionUrl: string) {
    let url = AddressesUrlParams.PathSectionForm(
      sectionUrl,
      AddressesUrlParams.PAGES_FORM
    );
    this.route.navigateByUrl(url);

    return url;
  }

  ViewCurrent: IFormSection;

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Escucha la vista (Section) actual que agrego al body al formulario
   * @param view Vista Actual
   */
  OnRouterOutletActivate(view) {
    this.ViewCurrent = view as IFormSection;
    this.CheckeButtonFinsh(this.route.url.slice(1));
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Escucha el evento del boton Anterior
   */
  async OnClickPrev($event) {
    if (!this.ViewCurrent) {
      return false;
    }

    let nextSection = await this.ViewCurrent.Prev();
    MainStore.db.SavePage(this.GoSection(nextSection));
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Escucha el evento del boton guardar
   */
  async OnClickSave($event) {
    if (!this.ViewCurrent) {
      return false;
    }
    let isValid = await this.ViewCurrent.Valid();
    if (isValid) {
      let isSaved = await this.ViewCurrent.Save();
      this.loadPercentg(MainStore.db.GetIdPropect());
      return isSaved;
    } else {
      SAlertComponent.AlertWarning(MesaggeText.FIELD_REQUIER);
    }
    return false;
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Escucha el evento del boton finalizar
   */
  /**
   * @author Jose Wilson Mulato
   * @description Escucha el evento del boton finalizar y habre la ventan de Confirmar cambio de estado
   */
  async OnClickFinsh($event) {
    this.setComponentes();
    if (!this.ViewCurrent) {
      return false;
    }
    this.FieldSelecState.Data = "";
    this.FieldAreaText.Data = "";
    this.FieldAreaText.Disable = true;
    this.FieldAreaText.IsRequired = false;
    this.AreaTextObservation.InactivityInputRequired();
    this.ComboboxState.Clear();
    this.ModelState.open();
  }



  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Escucha el evento del boton cancelar
   * @param $event
   */
  async OnClickCancel($event) {
    if (!this.ViewCurrent) {
      return true;
    }
    SAlertComponent.Confirm(
      MesaggeText.TEXT_CANCEL_CLIENT,
      false,
      MesaggeText.TITLE_CANCEL_CLIENT
    ).then(response => {
      response &&
        this.stateClientServ
          .SetStateClient({
            idProspecto: MainStore.db.GetIdPropect(),
            usuarioModificacion: MainStore.db.GetUser().username,
            nextStep: StateFormEnum.CANCEL
          })
          .then(x => {
            this.route.navigateByUrl(AddressesUrlParams.PathIndex());
          });
    });
  }
  /**
   * @author Jose Wilson Mulato
   * @description Carga Percent
   */

  loadPercentg(idProspecto: number) {
    //Llamado para obtener porcentaje
    this.formServ
      .GetPercentSolicitud(idProspecto)
      .then(response => {
        let list = response;
        if (!list) {
          return;
        }
        this.percent = list[0]["porcentaje"];
      });
  }


  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Escucha el evento del boton siguiente
   */
  async OnClickNext($event) {

    this.ViewCurrent.Next().then(nextSection => {
      if (nextSection == 'section01') {
        if (MainStore.db.GetDataEvidente() == null) {
          SAlertComponent.AlertInfo("Esta acccion no se puede ejecutar hasta que el usuario no termine el proceso de verificacion");
          return;
        }
      }

    });

    if (!this.ViewCurrent) {
      return false;
    }

    SAlertComponent.ShowSpinner();
    let isSaved = await this.OnClickSave(null);
    if (isSaved) {
      this.loadPercentg(MainStore.db.GetIdPropect());
      this.ViewCurrent.Next().then(nextSection => {
        MainStore.db.SavePage(this.GoSection(nextSection));
        setTimeout(() => {
          SAlertComponent.CloseSpinner();
        }, 1000);
      });
    }

    SAlertComponent.CloseSpinner();
  }


  /**
  * @author Jose Wilson Mulato
  * @description Escucha el evento del boton saltar
  */
  async OnClickSkip($event) {
    if (!this.ViewCurrent) {
      return false;
    }
    SAlertComponent.ShowSpinner();
    this.ViewCurrent.Next().then(nextSection => {
      MainStore.db.SavePage(this.GoSection(nextSection));
      setTimeout(() => {
        SAlertComponent.CloseSpinner();
      }, 1000);
    });
  }


  /**
   * @author Jorge Luis Caviedes Alvarador
   * @param value
   */
  ValidLockSection(value: string): boolean {
    let valid: boolean = true;
    let sections: LockSectionsModel = MainStore.db.GetLockAllSectionM1();

    this.btnFinsh.Hidden = true;
    this.btnContinue.Hidden = true;
    this.btnSave.Hidden = true;
    this.btnNext.Hidden = false;

    let sectionsValid = [
      { url: AddressesUrlParams.SECTION_01, section: "section1" },
      { url: AddressesUrlParams.SECTION_02, section: "section2" },
      { url: AddressesUrlParams.SECTION_03, section: "section3" },
      { url: AddressesUrlParams.SECTION_04, section: "section4" },
      { url: AddressesUrlParams.SECTION_05, section: "section5" },
      { url: AddressesUrlParams.SECTION_06, section: "section6" },
      { url: AddressesUrlParams.SECTION_UPLOAD_FILES, section: "sectionFiles" }
    ];

    if (value.includes(AddressesUrlParams.SECTION_01) && sections["section1"]) {
      this.btnNext.Hidden = false;
      // this.btnSkip.Hidden = true;
      this.btnPrev.Hidden = true;
      valid = false;
    } else if (
      value.includes(AddressesUrlParams.SECTION_UPLOAD_FILES) &&
      sections["sectionFiles"]
    ) {
      this.btnPrev.Hidden = false;
      this.btnContinue.Hidden = false;
      this.btnNext.Hidden = true;
      // this.btnSkip.Hidden = true;
      valid = false;
    } else if (
      sectionsValid.find(x => value.includes(x.url) && sections[x.section])
    ) {
      this.btnPrev.Hidden = false;
      this.btnNext.Hidden = false;
      // this.btnSkip.Hidden = false;
      valid = false;
    }

    if (!valid) {
      // this.ItemsMenu.forEach(m => (m.Disable = false));
    }

    return valid;
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Valida si esta en la ultima pagina para mostrar u ocultar el boton finalizar
   * @param value
   */
  CheckeButtonFinsh(value: string) {
    if (MainStore.db.GetUser().rol == RolsEnum.AGENT_CALL_CENTER) {
      this.btnGoM1.Hidden = false;
    }

    if (value.includes(AddressesUrlParams.SECTION_10)) {
      this.btnFinsh.Hidden = false;
      this.btnFinsh.Disable = false;
      this.btnSave.Hidden = false;
      this.btnNext.Hidden = true;
      this.btnSkip.Hidden = true;
    } else {
      this.btnFinsh.Hidden = true;
      this.btnSave.Hidden = true;
      this.btnNext.Hidden = false;
      this.btnSkip.Hidden = false;
    }

    if (value.includes(AddressesUrlParams.SECTION_07)) {
      this.btnPrev.Hidden = true;
    } else {
      this.btnPrev.Hidden = false;
    }


    if (value.includes(AddressesUrlParams.SECTION_01) || value.includes(AddressesUrlParams.SECTION_VERIFIC_USUARIO)) {
      this.btnSkip.Hidden = true;
      this.btnPrev.Hidden = true;
    }

    if (MainStore.db.IsExitClient()) {
      this.btnCancel.Hidden = false;
    } else {
      this.btnCancel.Hidden = true;
    }

    if (value.includes(AddressesUrlParams.SECTION_07)) {
      this.btnPrev.Hidden = false;
      this.btnCancel.Hidden = true;
    }
  }


  ngAfterContentInit() {
    this.InputCedulaAct._Disable = true;
    this.CheckeButtonFinsh(this.route.url.slice(1));
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Valida si debe o no mostrar los botones disables
   */
  async ValidaDisableBtns() {
    let valid = MainStore.db.GetPCForceForCompleteForm();
    this.btnFinsh.Disable = valid;
    this.btnContinue.Disable = !valid;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Valida si debe o no mostrar el boton continuar
   */
  ValidaBtnContinue(): any {
    if (MainStore.db.GetLockAllSectionM1().sectionFiles) {
      return;
    }
    let valid = MainStore.db.GetPCForceForCompleteForm();
    this.btnContinue.Hidden = !valid;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description visualiza la url
   */
  WatcherUrl(url: string) {
    let itemMenu = this.ItemsMenu.find(x => x.Link == url);
    if (itemMenu) {
      // itemMenu.Disable = false;
    }
  }

  btnPrev: ButtonModel = {
    Label: "Atras",
    Hidden: true,
    IconCss: "arrow-left"
  };
  btnSave: ButtonModel = {
    Label: "Guardar",
    Hidden: true,
    IconCss: "save"
  };
  btnFinsh: ButtonModel = {
    Label: "Finalizar",
    Hidden: true,
    IconCss: "arrow-right"
  };
  btnNext: ButtonModel = {
    Label: "Siguiente",
    Hidden: true,
    IconCss: "arrow-right"
  };

  //Nuevo Boton de saltar
  btnSkip: ButtonModel = {
    Label: "Saltar",
    Hidden: true
  };


  btnCancel: ButtonModel = {
    Label: "Cancelar",
    Hidden: true,
    IconCss: "times"
  };

  btnContinue: ButtonModel = {
    Label: "Continuar M2",
    Hidden: true,
    IconCss: "arrow-right"
  };

  ItemsMenu: ItemSubMenu[] = [
    {
      Label: "Verificar Usuario",
      Disable: false,
      Link: AddressesUrlParams.PathSectionForm(
        AddressesUrlParams.SECTION_VERIFIC_USUARIO,
        AddressesUrlParams.PAGES_FORM
      ),
      IconCls: "fa-address-card"
    },
    {
      Label: "Datos Personales",
      Disable: this.BlockBtn,
      Link: AddressesUrlParams.PathSectionForm(
        AddressesUrlParams.SECTION_01,
        AddressesUrlParams.PAGES_FORM
      ),
      IconCls: "fa-user-tie"
    },
    {
      Label: "PEP's",
      Disable: this.BlockBtn,
      Link: AddressesUrlParams.PathSectionForm(
        AddressesUrlParams.SECTION_02,
        AddressesUrlParams.PAGES_FORM
      ),
      IconCls: "fa-user-secret"
    },
    {
      Label: "Actividad Económica",
      Disable: this.BlockBtn,
      Link: AddressesUrlParams.PathSectionForm(
        AddressesUrlParams.SECTION_03,
        AddressesUrlParams.PAGES_FORM
      ),
      IconCls: "fa-hand-holding-usd"
    },
    {
      Label: "Contribuciones",
      Disable: this.BlockBtn,
      Link: AddressesUrlParams.PathSectionForm(
        AddressesUrlParams.SECTION_04,
        AddressesUrlParams.PAGES_FORM
      ),
      IconCls: "fa-hands-helping"
    },
    {
      Label: "Autorizaciones",
      Disable: this.BlockBtn,
      Link: AddressesUrlParams.PathSectionForm(
        AddressesUrlParams.SECTION_05,
        AddressesUrlParams.PAGES_FORM
      ),
      IconCls: "fa-key"
    },
    {
      Label: "Campos Adicionales",
      Disable: this.BlockBtn,
      Link: AddressesUrlParams.PathSectionForm(
        AddressesUrlParams.SECTION_06,
        AddressesUrlParams.PAGES_FORM
      ),
      IconCls: "fa-folder-plus"
    },
    // {
    //   Label: "Adjuntos",
    //   Disable: this.BlockBtn,
    //   Link: AddressesUrlParams.PathSectionForm(
    //     AddressesUrlParams.SECTION_UPLOAD_FILES,
    //     AddressesUrlParams.PAGES_FORM
    //   ),
    //   IconCls: "fa-file-upload"
    // },
    {
      Label: "Información Adicional",
      Disable: this.BlockBtn,
      Link: AddressesUrlParams.PathSectionForm(
        AddressesUrlParams.SECTION_07,
        AddressesUrlParams.PAGES_FORM
      ),
      IconCls: "fa-file-invoice"
    },
    {
      Label: "Declaración De Salud",
      Disable: this.BlockBtn,
      Link: AddressesUrlParams.PathSectionForm(
        AddressesUrlParams.SECTION_08,
        AddressesUrlParams.PAGES_FORM
      ),
      IconCls: "fa-medkit"
    },
    {
      Label: "Beneficiarios",
      Disable: this.BlockBtn,
      Link: AddressesUrlParams.PathSectionForm(
        AddressesUrlParams.SECTION_09,
        AddressesUrlParams.PAGES_FORM
      ),
      IconCls: "fa-users"
    },
    {
      Label: "Necesidades Y Expectativas",
      Disable: this.BlockBtn,
      Link: AddressesUrlParams.PathSectionForm(
        AddressesUrlParams.SECTION_ENC,
        AddressesUrlParams.PAGES_FORM
      ),
      IconCls: "fa-bar-chart"
    },
    {
      Label: "Otros Campos",
      Disable: this.BlockBtn,
      Link: AddressesUrlParams.PathSectionForm(
        AddressesUrlParams.SECTION_10,
        AddressesUrlParams.PAGES_FORM
      ),
      IconCls: "fa-list-alt"
    },
    // {
    //   Label: "Ver adjunto",
    //   Disable: this.BlockBtn,
    //   Link: AddressesUrlParams.PathSectionForm(
    //     AddressesUrlParams.SECTION_UPLOAD_FILES,
    //     AddressesUrlParams.PAGES_FORM
    //   ),
    //   IconCls: "fa-file-upload"
    // }
  ];

  /**
   * @author Jose Wilson Mulato
   * @description Escucha el evento cuando seleciona
   * @param item
   */
  OnSelectState(item) {
    if (!item) {
      return;
    }
    if (item["Value"] == StateFormEnum.INCONSISTENCY) {
      this.FieldAreaText.Disable = false;
      this.FieldAreaText.IsRequired = false; //LFP OLD true
    } else {
      this.FieldAreaText.Data = "";
      this.FieldAreaText.Disable = true;
      this.FieldAreaText.IsRequired = false;
    }
  }

  /**
   * @author Jose Wilson Mulato
   * @description envia adobe sign y cambiar el estado.
   */
  SendAdobeSign() {
    const observacion = this.AreaTextObservation.GetData();
    const nextStep = this.FieldSelecState.Data["Value"];
    this.dtoConfirmEmailAdobe = new ConfirmaEmailAdobeSignDTO();

    this.dtoConfirmEmailAdobe.nombre1 = this.InputNombre1Act.GetData();
    this.dtoConfirmEmailAdobe.nombre2 = this.InputNombre2Act.GetData();
    this.dtoConfirmEmailAdobe.apellido1 = this.InputApellido1Act.GetData();
    this.dtoConfirmEmailAdobe.apellido2 = this.InputApellido2Act.GetData();
    this.dtoConfirmEmailAdobe.numIdent = this.InputCedulaAct.GetData();
    this.dtoConfirmEmailAdobe.celular = this.InputCelularlAct.GetData();
    this.dtoConfirmEmailAdobe.email = this.InputEmailAct.GetData();
    this.dtoConfirmEmailAdobe.idProspecto = MainStore.db.GetIdPropect();

    SAlertComponent.ShowSpinner();
    this.stateClientServ
      .SendAdobeSign(this.dtoConfirmEmailAdobe)
      .then(response => {
        this.responseUI
          .CheckResponseForError(response)
          .then(() => {
            if (response["status"] == ResponseEnum.OK) {
              this.stateClientServ
                .SetStateClient({
                  idProspecto: MainStore.db.GetIdPropect(),
                  usuarioModificacion: MainStore.db.GetUser().username,
                  nextStep,
                  observacion
                })
                .then((respState: IResponseService) => {
                  this.responseUI.CheckResponseForError(respState);
                  if (respState.status == ResponseEnum.OK) {
                    SAlertComponent.AlertOk(MesaggeText.TEXT_OK_SEND);
                    this.route.navigateByUrl(AddressesUrlParams.PathIndex());
                  }
                })
                .catch(error => this.responseUI.CheckResponseForError(error));
            }
          })
          .catch(error => this.responseUI.CheckResponseForError(error));
      });
  }

  /**
   * @author Jose Wilson Mulato
   * @description envia la incosistencia
   */
  SendInconsistency() {
    const observacion = this.AreaTextObservation.GetData();
    const nextStep = this.FieldSelecState.Data["Value"];
    SAlertComponent.ShowSpinner();
    this.stateClientServ
      .SetStateClient({
        idProspecto: MainStore.db.GetIdPropect(),
        usuarioModificacion: MainStore.db.GetUser().username,
        nextStep,
        observacion
      })
      .then(() => {
        let url = AddressesUrlParams.PathSectionForm(
          AddressesUrlParams.SECTION_01,
          AddressesUrlParams.PAGES_FORM
        );
        SAlertComponent.AlertOk(MesaggeText.TEXT_OK_SEND);
        this.ModelState.close();
        this.route.navigateByUrl(url).then(() => {
          this.notyApp.ensablePage.emit(url);
        });
        // this.route.navigateByUrl(AddressesUrlParams.PathIndex());
      })
      .catch(error => this.responseUI.CheckResponseForError(error));
  }

  /**
  * @author Jose Wilson Mulato
  * @description Obtiene el valor de cambio de estado
  * y envia el cambio de estado
  */
  ClickComfirm() {
    if (!this.AreaTextObservation.Valid()) {
      return;
    }

    if (this.FieldSelecState.Data == undefined || this.FieldSelecState.Data == null) {
      SAlertComponent.AlertWarning(MesaggeText.TEXT_SELECT_FINALIZAR);
      return;
    }

    let titleState: string = MesaggeText.TITLE_INCONSISTENCY;
    let textState: string = MesaggeText.TEXT_SEND_INCONSISTENCY;

    if (this.FieldSelecState.Data["Value"] === StateFormEnum.TO_SIGN) {
      if (this.percent != "100") {
        this.formServ
          .GetListSectionPend(MainStore.db.GetIdPropect())
          .then(response => {
            this.lstSections = response;
            if (!this.lstSections) {
              return;
            }
          });
      }
      this.modalConfirmEmail.open();
    } else {
      SAlertComponent.Confirm(textState, false, titleState).then(response => {
        if (
          response &&
          this.FieldSelecState.Data["Value"] === StateFormEnum.INCONSISTENCY
        ) {
          this.SendInconsistency();
        }
      });
    }


  }

  ClickComfirmEmail() {

    if (!this.FieldNombre1Act.Data || !this.FieldApellido1Act.Data || !this.FieldCelularAct.Data || !this.FieldEmailAct.Data) {
      return SAlertComponent.AlertWarning("todos los campos marcados con * son obligatorios");
    }


    if (parseInt(this.percent) < parseInt("100")) {
      return this.modalListaSection.open();
      // return SAlertComponent.AlertWarning("Atención es necesario completar las siguientes secciones " + this.lstSections.toString());
    }

    let titleState: string = MesaggeText.TEXT_SEND_TO_SIGN;
    let textState: string = MesaggeText.TITLE_TO_SIGN;

    SAlertComponent.Confirm(textState, false, titleState).then(response => {
      if (
        response &&
        this.FieldSelecState.Data["Value"] === StateFormEnum.TO_SIGN
      ) {
        // if (this.InputEmailAct.GetData() != this.InputEmailConfirm.GetData()) {
        //   return SAlertComponent.AlertWarning("Los dos emails deben ser iguales");
        // }
        this.SendAdobeSign();
      }
    });
  }

  redirijeSection(urlSection: string) {
    let url = AddressesUrlParams.PathSectionForm(
      urlSection,
      AddressesUrlParams.PAGES_FORM
    );
    this.ModelState.close();
    this.modalConfirmEmail.close();
    this.modalListaSection.close();
    this.route.navigateByUrl(url).then(() => {
      this.notyApp.ensablePage.emit(url);
    });
  }


  primeraSection() {
    let url = AddressesUrlParams.PathSectionForm(
      AddressesUrlParams.SECTION_01,
      AddressesUrlParams.PAGES_FORM
    );
    this.ModelState.close();
    this.modalConfirmEmail.close();
    this.modalListaSection.close();
    this.route.navigateByUrl(url).then(() => {
      this.notyApp.ensablePage.emit(url);
    });
  }

  FieldSelecState: ComboboxModel = {
    Label: "Estado",
    Items: [
      {
        Label: "Revisar Información", //LFP OLD Inconsistencia //NEW 
        Value: StateFormEnum.INCONSISTENCY
      },
      {
        Label: "Por Firmar",
        Value: StateFormEnum.TO_SIGN
      }
    ]
  };

  FieldAreaText: AreaTextModel = {
    Label: "Observación",
    Placeholder: "Observación de la incosistencia",
    Hidden: true
  };

  FieldEmailAct: InputModel = {
    IsRequired: true,
    Label: "Email Actual",
    LenMax: 30
  };

  FieldNombre1Act: InputModel = {
    IsRequired: true,
    Label: "Primer Nombre"
  };

  FieldNombre2Act: InputModel = {
    Label: "Segundo Nombre"
  };

  FieldApellido1Act: InputModel = {
    IsRequired: true,
    Label: "Primer Apellido"
  };

  FieldApellido2Act: InputModel = {
    Label: "Segundo Apellido"
  };


  FieldCedulaAct: InputModel = {
    IsRequired: true,
    Label: "Número Identificación"
  };

  FieldCelularAct: InputModel = {
    IsRequired: true,
    Label: "Telefono Celular",
    Pattern: regexType.phoneMobil
  };

  // FieldEmailConfirm: InputModel = {
  //   Label: "Confirmar Email",
  //   Placeholder: "Confirmar Email",
  //   IsRequired: true,
  //   Pattern: regexType.email,
  // };

  setComponentes() {
    this.FieldEmailAct = {
      Data: MainStore.db.GetEmailProspect(),
      Label: "Email Actual",
      Placeholder: "Email Actual",
      IsRequired: true,
      Pattern: regexType.email,
    };

    this.FieldNombre1Act = {
      Label: "Primer Nombre",
      IsRequired: true,
      Data: MainStore.db.GetNombre1Prospect().replace("null", "").replace(" null", "")
    };

    this.FieldNombre2Act = {
      Label: "Segundo Nombre",
      Data: MainStore.db.GetNombre2Prospect()
    };

    this.FieldApellido1Act = {
      Label: "Primer Apellido",
      IsRequired: true,
      Data: MainStore.db.GetApellido1Prospect().replace("null", "").replace(" null", "")
    };

    this.FieldApellido2Act = {
      Label: "Segundo Apellido",
      Data: MainStore.db.GetApellido2Prospect()
    };

    this.FieldCedulaAct = {
      Label: "Número Identificación",
      Data: MainStore.db.GetCedulaProspect()
    };

    this.FieldCelularAct = {
      IsRequired: true,
      Label: "Telefono Celular",
      Pattern: regexType.phoneMobil,
      Data: MainStore.db.GetCelProspect()
    };
  }
}
