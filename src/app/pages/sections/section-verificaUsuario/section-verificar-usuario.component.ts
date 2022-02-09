import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Modal } from "ngx-modal";
import { ResponseEnum } from "../../../enums/ResponseEnum.enum";
import { BaseSection } from "../../../extends/base-section";
import { IFormSection } from "../../../interfaces/form-section";
import { IResponseService } from "../../../interfaces/response-service";
import { AddressesUrlParams } from "../../../parameters/addresses-url-params";
import { FormService } from "../../../services/form.service";
import { SAlertComponent } from "../../../shared/components/s-alert/s-alert.component";
import { AutocompleteModel, SAutocompleteComponent } from "../../../shared/components/s-autocomplete/s-autocomplete.component";
import { DatePickerBehaviorEnum, DatePickerModel, SDatepickerComponent } from "../../../shared/components/s-datepicker/s-datepicker.component";
import { SInputComponent } from "../../../shared/components/s-input/s-input.component";
import { ButtonModel } from "../../../shared/extends-components/bbutton-component";
import { InputEnum, InputModel } from "../../../shared/extends-components/binput-component";
import { MesaggeText } from "../../../shared/texts/mesagge-text";
import { ConfirmeStore } from "../../../store/confirme-store";
import { MainStore } from "../../../store/main-store";
import { TypeDocumentStore } from "../../../store/type-document-store";
import { regexType } from "../../../utils/regexDefault";
import { ResponseUiService } from "../../../utils/response-ui.service";
import { Utils } from "../../../utils/utils";

@Component({
  selector: "app-section-verificar-usuario",
  templateUrl: "./section-verificar-usuario.component.html",
  styleUrls: ["./section-verificar-usuario.component.scss"]
})
export class SectionVerificarUsuario extends BaseSection
  implements OnInit, IFormSection {

  estadoUsuario: any;

  @ViewChild("modelOtp") modelOtp: Modal;


  @ViewChild("modelCuestionario") modelCuestionario: Modal;


  /**
   * Obtener el components
   */


  @ViewChild("InputTypeId")
  AutoTypeId: SAutocompleteComponent;

  @ViewChild("InputNumberId")
  InputNumberId: SInputComponent;

  @ViewChild("InputLastNames")
  InputLastNames: SInputComponent;

  @ViewChild("InputNames")
  InputNames: SInputComponent;

  @ViewChild("InputFechaExpedicion")
  InputFechaExpedicion: SDatepickerComponent;

  @ViewChild("InputNumberCelular")
  InputNumberCelular: SInputComponent;


  TitlePage: "Formulario de Viculación Electronico";


  FieldTypeId: AutocompleteModel = {
    Label: "Tipo De Identificación",
    IsRequired: true,
    ItemsByStore: TypeDocumentStore.name,
    ItemsFilterByValue: [
      TypeDocumentStore.TI,
      TypeDocumentStore.CIVIL_REGISTRATION
    ],
    SelectValue: TypeDocumentStore.CC
  };

  FieldNumberId: InputModel = {
    Label: "Número De Identificación",
    IsRequired: true,
    Type: InputEnum.Text,
    Placeholder: "Ej. 123456789",
    Pattern: regexType.number,
    LenMax: 20
  };

  FieldLastNames = {
    Label: "Apellidos",
    IsRequired: true,
    Type: InputEnum.Text,
    Placeholder: "Ej. Cardenas",
    LenMax: 51
  };

  FieldNames: InputModel = {
    Label: "Nombres",
    IsRequired: true,
    Type: InputEnum.Text,
    Placeholder: "Ej. Juan pablo",
    LenMax: 51
  };

  FieldFechaExpedic: DatePickerModel = {
    Label: "Fecha de expedición",
    IsRequired: true,
    Behavior: DatePickerBehaviorEnum.DateMinOld
  };

  FieldNumberCelular: InputModel = {
    Label: "Celular",
    IsRequired: true,
    Type: InputEnum.Text,
    Placeholder: "Ej. 123456789",
    Pattern: regexType.number,
    LenMax: 10
  };

  // FieldOTP = {
  //   IsRequired: true,
  //   Label: "Tipo de validación",
  //   SelectValue: ConfirmeStore.OTP,
  //   Items: ConfirmeStore.GetTipValidacion()
  // };

  btnValidar: ButtonModel = {
    Label: "Enviar a validar",
    Hidden: false
  };

  constructor(
    public responseUI: ResponseUiService,
    public formServ: FormService,
    public route: Router
  ) {
    super();
  }

  ngOnInit() { }

  ngAfterContentInit() {
  }

  OnClickValidaUsuario() {
    let isValid = this.ValidFields([
      this.AutoTypeId,
      this.InputNumberId,
      this.InputLastNames,
      this.InputNames,
      this.InputNumberCelular,
      this.InputFechaExpedicion
    ]);
    if (!isValid) {
      SAlertComponent.AlertError("Algunos campos son obligatorios");
      return;
    }


    SAlertComponent.alertEnvioLiderRegional(
      MesaggeText.TEXT_INFO_ENVIO_LIDER,
      true,
      "",
      ["Cancelar", "Enviar a validar"]
    ).then(ischange => {
      ischange && SAlertComponent.ShowSpinner();
      if (ischange) {
        this.Save();
      }
    });
  }

  Prev(): Promise<any> {
    return;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description retorna la url siguiente
   */
  async Next(): Promise<any> {
    return AddressesUrlParams.SECTION_01;
  }


  /**
   * @author Jose Wison Mulato
   * @description enviar informacion al lider
   */
  async Save(): Promise<any> {
    console.log("objeto -> ", MainStore.db.GetUser());
    let fullName = Utils.RemoveMoreSpace(this.InputNames.GetData()).split(" ");
    let fullLastName = Utils.RemoveMoreSpace(
      this.InputLastNames.GetData()
    ).split(" ");
    return new Promise((success, fail) => {
      MainStore.db
        .enviarValidar({
          tipIdentificacion: this.AutoTypeId.GetData(),
          numIdentificacion: this.InputNumberId.GetData(),
          fechaExpedicion: this.InputFechaExpedicion.GetData(),
          celular: this.InputNumberCelular.GetData(),
          tipValidacion: ConfirmeStore.OTP,
          identificacionEjecutivo: MainStore.db.GetUser().idPromotor,
          estado: 'Por aprobar',
          primerNombre: fullName[0],
          segundoNombre: fullName.length >= 2 ? fullName[1] || "" : "",
          primerApellido: fullLastName[0],
          segundoApellido:
            fullLastName.length >= 2 ? fullLastName[1] || "" : "",
        })
        .then((response: IResponseService) => {
          this.responseUI.CheckResponseForError(response).then(() => {
            console.log("valor de response ->", response.status);
            if (response.status == ResponseEnum.OK) {
              SAlertComponent.CloseSpinner();
              if (response.data.tipoValidacion == ConfirmeStore.OTP) {
                this.modelOtp.open();
              } else {
                this.modelCuestionario.open();
                //Setear datos para preguntas
              }

              // this.GoSection(AddressesUrlParams.SECTION_01);
            }
            // success(response.status == ResponseEnum.OK);
          });
        })
        .catch(error => {
          this.responseUI.CheckResponseForError(error);
          success(false);
        });
    });
  }

  Valid(): Promise<any> {
    throw new Error("Method not implemented.");
  }
  Load(): Promise<any> {
    throw new Error("Method not implemented.");
  }


  GoSection(sectionUrl: string) {
    let url = AddressesUrlParams.PathSectionForm(
      sectionUrl,
      AddressesUrlParams.PAGES_FORM
    );
    this.route.navigateByUrl(url);
    return url;
  }


  // eventos OTP
  ClickCancelOTP(e) {
    this.modelOtp.close();
    console.log("para cancelar");
  }


  ClickReenviarOTP() {
    console.log("para reenviar codigo");
  }


  ClickComfirmOTP() {
    this.modelOtp.close();
    console.log("para enviar a confirmar");
  }


  // eventos cuestionario

  ClickCancelCuestionario(e) {
    this.modelCuestionario.close();
  }


  ClickComfirmCuestionario() {
    this.modelCuestionario.close();
    SAlertComponent.ShowSpinner();
    console.log("para enviar a confirmar cuestionario");
  }

}
