import { Component, OnInit, ViewChild } from "@angular/core";
import { ResponseEnum } from "../../../enums/ResponseEnum.enum";
import { BaseSection } from "../../../extends/base-section";
import { IFormSection } from "../../../interfaces/form-section";
import { IResponseService } from "../../../interfaces/response-service";
import { AddressesUrlParams } from "../../../parameters/addresses-url-params";
import { FormService } from "../../../services/form.service";
import { SAddressComponent } from "../../../shared/components/s-address/s-address.component";
import {
  AutocompleteModel,
  SAutocompleteComponent
} from "../../../shared/components/s-autocomplete/s-autocomplete.component";
import { SInputComponent } from "../../../shared/components/s-input/s-input.component";
import {
  InputEnum,
  InputModel,
  BinputComponent
} from "../../../shared/extends-components/binput-component";
import { LockFieldsModel } from "../../../shared/models/lock-fields-model";
import { MainStore } from "../../../store/main-store";
import { TerritoryStore } from "../../../store/territory-store";
import { TypeDocumentStore } from "../../../store/type-document-store";
import { TypeGenderStore } from "../../../store/type-gender-store";
import { regexType } from "../../../utils/regexDefault";
import { ResponseUiService } from "../../../utils/response-ui.service";
import { Utils } from "../../../utils/utils";
import { MesaggeText } from "../../../shared/texts/mesagge-text";
import {
  SDatepickerComponent,
  DatePickerModel,
  DatePickerBehaviorEnum
} from "../../../shared/components/s-datepicker/s-datepicker.component";
import { SAlertComponent } from "../../../shared/components/s-alert/s-alert.component";

@Component({
  selector: "app-section-page1",
  templateUrl: "./section-page1.component.html",
  styleUrls: ["./section-page1.component.scss"]
})
export class SectionPage1Component extends BaseSection
  implements OnInit, IFormSection {
  objDatosBanco: any;
  objDatosAsociado: any;
  /**
   * Obtener el components
   */

  @ViewChild("InputNames")
  InputNames: SInputComponent;

  @ViewChild("InputLastNames")
  InputLastNames: SInputComponent;

  @ViewChild("InputTypeId")
  AutoTypeId: SAutocompleteComponent;

  @ViewChild("InputSex")
  AutoSex: SAutocompleteComponent;

  @ViewChild("InputNumberId")
  InputNumberId: SInputComponent;

  @ViewChild("InputLocation")
  AutoLocation: SAutocompleteComponent;

  @ViewChild("InputLocationExpedition")
  InputLocationExpedition: SAutocompleteComponent;

  @ViewChild("InputBirdate")
  InputBirdate: SDatepickerComponent;

  @ViewChild("InputPhone")
  InputPhone: SInputComponent;

  @ViewChild("InputPhoneMobil")
  InputPhoneMobil: SInputComponent;

  @ViewChild("InputEmail")
  InputEmail: SInputComponent;

  @ViewChild("InputAddress")
  InputAddress: SAddressComponent;

  @ViewChild("InputCountry")
  InputCountry: SAutocompleteComponent;

  @ViewChild("InputCity")
  InputCity: SAutocompleteComponent;

  @ViewChild("InputDateExpedition")
  InputDateExpedition: SInputComponent;

  TitlePage: "Formulario de Viculación Electronico";

  FieldNames: InputModel = {
    Label: "Nombres",
    IsRequired: true,
    Type: InputEnum.Text,
    Placeholder: "Ej. Juan pablo",
    LenMax: 51
  };

  FieldLastNames = {
    Label: "Apellidos",
    IsRequired: true,
    Type: InputEnum.Text,
    Placeholder: "Ej. Cardenas",
    LenMax: 51
  };

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

  FieldSex: AutocompleteModel = {
    Label: "Género",
    IsRequired: true,
    ItemsByStore: TypeGenderStore.name,
    ModeDropDown: true
  };

  FieldLocation: AutocompleteModel = {
    Label: "Lugar De Nacimiento",
    IsRequired: true,
    ItemsByStore: TerritoryStore.name,
    FunctionStore: "GetServiceCities",
    MinChars: 3,
    IsActionWrittenStore: true,
    DefaultOptionParamterStore: { country: 3 },

    Tooltip: {
      Label: MesaggeText.TOOLTIP_TYPING_SEARCH
    }
  };

  FieldBirdate: DatePickerModel = {
    Label: "Fecha De Nacimiento",
    IsRequired: true,
    Behavior: DatePickerBehaviorEnum.DateMinOld
  };

  FieldLocationExpedition = {
    Label: "Lugar De Expedición",
    IsRequired: true,
    IsVisibleCountry: true,
    IsVisibleDepartament: false,
    IsVisibleCity: false,
    ItemsByStore: TerritoryStore.name,
    FunctionStore: "GetServiceCities",
    MinChars: 3,
    IsActionWrittenStore: true,
    DefaultOptionParamterStore: { country: 2 },
    Tooltip: {
      Label: MesaggeText.TOOLTIP_TYPING_SEARCH
    }
  };

  FieldDateExpedition: DatePickerModel = {
    Label: "Fecha De Expedición",
    IsRequired: true,
    Behavior: DatePickerBehaviorEnum.DateMaxCurrent
  };

  FieldPhone = {
    Label: "Teléfono Fijo",
    Type: InputEnum.Phone,
    Placeholder: "Ej. 00000000",
    Pattern: regexType.phone,
    LenMax: 7
  };

  FieldPhoneMobil = {
    IsRequired: true,
    Label: "Teléfono Celular",
    Type: InputEnum.Phone,
    Placeholder: "Ej. 00000000",
    Pattern: regexType.phoneMobil
  };

  FieldEmail = {
    IsRequired: true,
    Label: "Correo Electrónico",
    Placeholder: "example@example.com",
    Type: InputEnum.Email,
    Pattern: regexType.email,
    LenMax: 100
  };

  FieldAddress = {
    Label: "Dirección de Residencia",
    IsRequired: true,
    Placeholder: "Barrio: Ej Peñon",
    Placeholder2: "Av 1 con calle 100",
    LenMaxValue: 50,
    AddressLenMax: 200
  };

  FieldCountry = {
    Label: "País",
    // IsRequired: true,
    Type: InputEnum.Text,
    Placeholder: "Colombia",
    // ItemsByStore: TerritoryStore.name,
    // FunctionStore: "GetServiceContries",
    ReadOnly: true
  };

  FieldCity: AutocompleteModel = {
    Label: "Ciudad",
    IsRequired: true,
    Type: InputEnum.Text,
    ItemsByStore: TerritoryStore.name,
    FunctionStore: "GetServiceCities",
    MinChars: 3,
    IsActionWrittenStore: true,
    DefaultOptionParamterStore: { country: 2 },
    Tooltip: {
      Label: MesaggeText.TOOLTIP_TYPING_SEARCH
    }
  };

  constructor(
    public responseUI: ResponseUiService,
    public formServ: FormService
  ) {
    super();
  }

  ngOnInit() { }

  ngAfterContentInit() {
    console.log("valores de data evidente",MainStore.db.GetDataEvidente());
    this.LockFiels();
    this.Load().then(() => this.IsLockSection());

    /* this.AutoTypeId.OnBlur = () => {
      this.AutoLocation.OptionParamterStore({country: (this.AutoTypeId.GetData()==81)?3:2})
    }; */

    this.InputNumberId.OnBlur = () => {
      if (this.AutoTypeId.GetData() == null || this.AutoTypeId.GetData() == undefined || this.AutoTypeId.GetData() == '') {
        return SAlertComponent.AlertWarning("Es necesario primero completar el campo Tipo De Identificación");
      }
      if (this.InputNumberId.GetData() != null && this.InputNumberId.GetData() != undefined && this.InputNumberId.GetData() != '') {
        this.formServ
          .GetDatosClienteBanco(this.AutoTypeId.GetData(), this.InputNumberId.GetData())
          .then(response => {
            this.objDatosBanco = response;
            if (this.objDatosBanco.codRetorno == 1) {
              this.InputNames.SetData(this.objDatosBanco.informacionPersonal.primerNombre.trim() + " " + this.objDatosBanco.informacionPersonal.segundoNombre.trim());
              this.InputLastNames.SetData(this.objDatosBanco.informacionPersonal.primerApellido.trim() + " " + this.objDatosBanco.informacionPersonal.segundoApellido.trim());
              this.InputBirdate.SetData(this.objDatosBanco.informacionPersonal.fechaNacimiento);
              this.InputDateExpedition.SetData(this.objDatosBanco.informacionPersonal.fechaExpedicion);
              this.AutoSex.SelectByValue(this.objDatosBanco.informacionPersonal.sexo == "1" ? 182 : 181);
              this.formServ
                .GetLocationCity(this.objDatosBanco.informacionPersonal.lugarExpedicion.trim())
                .then(response => {
                  let list = response;
                  if (!list) {
                    return;
                  }
                  let data = {
                    Label: list.data.descLocalizacion,
                    Value: list.data.consLocalizacion
                  };
                  this.InputLocationExpedition.AddItem(data);
                  this.InputLocationExpedition.SelectByValue(data.Value);
                  this.InputLocationExpedition.Valid();
                });
              //Parte de informacion contacto
              this.InputPhoneMobil.SetData(this.objDatosBanco.informacionPersonal.telCelular.trim());
              this.InputEmail.SetData(this.objDatosBanco.informacionPersonal.email.trim());
              this.FieldEmail.Pattern = regexType.emailCargado;
              this.InputAddress.SetDataNeighborhood(this.objDatosBanco.informacionPersonal.barrioResidencial.trim());
              this.InputAddress.SetDataAddress(this.objDatosBanco.informacionPersonal.direccionResActual.trim());
            } else {
              this.formServ.GetDatosAsociadoCoop(this.AutoTypeId.GetData(), this.InputNumberId.GetData())
                .then(response => {
                  this.objDatosAsociado = response;
                  this.objDatosAsociado = JSON.parse(this.objDatosAsociado);
                  if (this.objDatosAsociado.codAsociado.content != 0) {
                    this.InputNames.SetData(this.objDatosAsociado.nombre1.content.trim() + " " + this.objDatosAsociado.nombre2.content.trim());
                    this.InputLastNames.SetData(this.objDatosAsociado.primerApellido.content.trim() + " " + this.objDatosAsociado.segundoApellido.content.trim());
                    this.InputBirdate.SetData(this.objDatosAsociado.fecNacimiento.content);
                    this.InputDateExpedition.SetData(this.objDatosAsociado.fecExpDocumento.content);
                    this.AutoSex.SelectByValue(this.objDatosAsociado.codSexo.content == "1" ? 182 : 181);
                    this.formServ
                      .GetLocationCity(this.objDatosAsociado.codLugExpDocumento.content.trim())
                      .then(response => {
                        let list = response;
                        if (!list) {
                          return;
                        }
                        let data = {
                          Label: list.data.descLocalizacion,
                          Value: list.data.consLocalizacion
                        };
                        this.InputLocationExpedition.AddItem(data);
                        this.InputLocationExpedition.SelectByValue(data.Value);
                        this.InputLocationExpedition.Valid();
                      });
                    //Parte de informacion contacto
                    this.InputPhoneMobil.SetData(this.objDatosAsociado.celular.content.trim());
                    this.InputEmail.SetData(this.objDatosAsociado.email.content.trim());
                    this.FieldEmail.Pattern = regexType.emailCargado;
                    this.InputAddress.SetDataNeighborhood(this.objDatosAsociado.barResidencia.content.trim());
                    this.InputAddress.SetDataAddress(this.objDatosAsociado.dirResidencia.content.trim());
                  }
                });
            }
          });
      }
    }

    this.InputEmail.OnBlur = () => {
      this.FieldEmail.Pattern = regexType.email;      
    }
  }

  Prev(): Promise<any> {
    return;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description retorna la url siguiente
   */
  async Next(): Promise<any> {
    return AddressesUrlParams.SECTION_02;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Mandar a guardar el dato al servicio
   */
  async Save(): Promise<any> {
    let fullName = Utils.RemoveMoreSpace(this.InputNames.GetData()).split(" ");
    let fullLastName = Utils.RemoveMoreSpace(
      this.InputLastNames.GetData()
    ).split(" ");
    return new Promise((success, fail) => {
      if (this.InputPhone.GetData() != null && this.InputPhone.GetData() != '') {
        if (!regexType.phone.exp.test(this.InputPhone.GetData())) {
          success(false);
          return SAlertComponent.AlertWarning(MesaggeText.VALID_PHONE_LENGTH);
        }
      }
      MainStore.db
        .SetSection1({
          primerNombre: fullName[0],
          segundoNombre: fullName.length >= 2 ? fullName[1] || "" : "",
          primerApellido: fullLastName[0],
          segundoApellido:
            fullLastName.length >= 2 ? fullLastName[1] || "" : "",
          genero: this.AutoSex.GetData(),
          tipoIdentificacion: this.AutoTypeId.GetData(),
          numeroIdentificacion: this.InputNumberId.GetData(),
          lugarNacimiento: this.AutoLocation.GetData(),
          fechaNacimiento: this.InputBirdate.GetData(),
          fechaExpedicion: this.InputDateExpedition.GetData(),
          lugarExpedicion: this.InputLocationExpedition.GetData(),
          correoElectronico: this.InputEmail.GetData(),
          barrioResidencia: this.InputAddress.GetDataNeighborhood(),
          ciudadResidencia: this.InputCity.GetData(),
          direccionResidencia: this.InputAddress.GetDataAddress(),
          telefonoCelular: this.InputPhoneMobil.GetData(),
          telefonoFijo: this.InputPhone.GetData(),
          idPromotor: MainStore.db.GetUser().idPromotor,
          origen: MainStore.ORIGIN
        })
        .then((response: IResponseService) => {
          this.responseUI.CheckResponseForError(response).then(result => {
            success(response.status == ResponseEnum.OK);
          });
        })
        .catch(error => {
          this.responseUI.CheckResponseForError(error);
          success(false);
        });
    });
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description valida si hay que bloquear campos
   */
  async LockFiels() {
    let locks: LockFieldsModel = MainStore.db.GetLockFields();
    if (locks.FieldIdDocument) {
      this.InputNumberId._Disable = true;
    }

    if (locks.FieldTypeDocument) {
      this.FieldTypeId.ReadOnly = true;
      this.FieldTypeId.Lock = true;
      this.InputNumberId && this.InputNumberId.SetDisable(true);
    }
    return true;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Valida los campos este correctos
   */
  async Valid(): Promise<any> {
    let isValid = this.ValidFields([
      this.InputNames,
      this.InputLastNames,
      this.AutoTypeId,
      this.InputNumberId,
      this.AutoSex,
      this.InputLocationExpedition,
      this.AutoLocation,
      this.InputBirdate,
      this.InputPhone,
      this.InputPhoneMobil,
      this.InputEmail,
      this.InputDateExpedition,
      this.InputCity,
      this.InputAddress
    ]);
    return isValid;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Carga los datos
   */
  Load(): Promise<any> {
    return new Promise((success, fail) => {
      MainStore.db.GetSection1().then(section1 => {
        if (!section1) {
          return success();
        }
        this.InputNames.SetData(
          `${section1.primerNombre}  ${section1.segundoNombre || ""}`
        );
        this.InputLastNames.SetData(
          `${section1.primerApellido}  ${section1.segundoApellido || ""}`
        );
        this.AutoSex.SelectByValue(section1.genero);
        this.AutoTypeId.SelectByValue(section1.tipoIdentificacion);
        this.InputNumberId.SetData(section1.numeroIdentificacion);

        this.InputBirdate.SetData(section1.fechaNacimiento);
        this.InputDateExpedition.SetData(section1.fechaExpedicion);

        this.InputEmail.SetData(section1.correoElectronico);
        this.InputAddress.SetDataNeighborhood(section1.barrioResidencia);

        this.formServ
          .GetParentPlace(section1.lugarNacimiento["consLocalizacion"])
          .then(response => {
            let list = response;
            if (!list) {
              return;
            }
            this.AutoLocation.SelectByValue(list["consPais"]);
            let data = {
              Label: list["descripcionCiudad"],
              Value: list["consCiudad"]
            };
            this.AutoLocation.AddItem(data);
            this.AutoLocation.SelectByValue(data.Value);
            this.AutoLocation.Valid();
          });
        this.formServ
          .GetParentPlace(section1.lugarExpedicion["consLocalizacion"])
          .then(response => {
            let list = response;
            if (!list) {
              return;
            }
            this.InputLocationExpedition.SelectByValue(list["consPais"]);
            let data = {
              Label: list["descripcionCiudad"],
              Value: list["consCiudad"]
            };
            this.InputLocationExpedition.AddItem(data);
            this.InputLocationExpedition.SelectByValue(data.Value);
            this.InputLocationExpedition.Valid();
          });

        this.formServ
          .GetParentPlace(section1.ciudadResidencia["consLocalizacion"])
          .then(response => {
            let list = response;
            if (!list) {
              return;
            }
            this.InputCity.SelectByValue(list["consPais"]);
            let data = {
              Label: list["descripcionCiudad"],
              Value: list["consCiudad"]
            };
            this.InputCity.AddItem(data);
            this.InputCity.SelectByValue(data.Value);
            this.InputCity.Valid();
          });
        this.InputAddress.SetDataAddress(section1.direccionResidencia);
        this.InputPhone.SetData(section1.telefonoFijo);
        this.InputPhoneMobil.SetData(section1.telefonoCelular);
        return success();
      });
    });
  }


  /**
   * @author Edwar Ferney Murillo Arboleda
   * @description Valida la fecha de nacimiento si es valida para  algunos tipos de identificación
   * @param e
   */
  onKeyBirtDate(e) {
    let typeParameter = this.AutoTypeId.GetData();
    let date = Date.parse(e);

    let dateBirth = new Date(date);
    dateBirth.setHours(0);
    dateBirth.setMilliseconds(0);
    dateBirth.setMinutes(0);
    dateBirth.setSeconds(0);

    let dateCurrent = new Date();
    dateCurrent.setHours(0);
    dateCurrent.setMilliseconds(0);
    dateCurrent.setMinutes(0);
    dateCurrent.setSeconds(0);

    //console.log(dateBirth.getTime() < dateCurrent.getTime());
    switch (typeParameter) {
      case 1:
        // Cedula
        dateBirth.setFullYear(dateBirth.getFullYear() + 18);
        if (dateBirth.getTime() > dateCurrent.getTime()) {
          this.InputBirdate._PatternMessage =
            MesaggeText.TEXT_MESSAGE_SERNIODATE;
          this.InputBirdate.ApplyInputRequired();
        }
        break;
      case 5156:
        // Registro Civil
        break;
      default:
      // code block
    }
    console.log();
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description bloquea los campos de la seccion
   */
  IsLockSection() {
    if (!MainStore.db.GetLockAllSectionM1().section1) {
      return;
    }
    super.IsLockSection([
      // this.InputNames,
      // this.InputLastNames,
      this.AutoTypeId,
      // this.AutoSex,
      this.InputNumberId,
      // this.AutoLocation,
      this.InputLocationExpedition,
      // this.InputBirdate,
      // this.InputPhone,
      // this.InputPhoneMobil,
      // this.InputEmail,
      // this.InputAddress,
      this.InputCountry,
      // this.InputCity,
      this.InputDateExpedition
    ]);
  }
}
