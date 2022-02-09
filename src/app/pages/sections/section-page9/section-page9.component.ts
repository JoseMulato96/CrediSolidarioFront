import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseSection } from "../../../extends/base-section";
import { IFormSection } from "../../../interfaces/form-section";
import { IResponseService } from "../../../interfaces/response-service";
import { AddressesUrlParams } from "../../../parameters/addresses-url-params";
import { FormService } from "../../../services/form.service";
import { SectionsService } from "../../../services/sections.service";
import { SAlertComponent } from "../../../shared/components/s-alert/s-alert.component";
import {
  AutocompleteModel,
  SAutocompleteComponent
} from "../../../shared/components/s-autocomplete/s-autocomplete.component";
import { SCheckComponent } from "../../../shared/components/s-check/s-check.component";
import {
  DatePickerModel,
  DatePickerBehaviorEnum,
  SDatepickerComponent
} from "../../../shared/components/s-datepicker/s-datepicker.component";
import { SGridComponent } from "../../../shared/components/s-grid/s-grid.component";
import { SInputComponent } from "../../../shared/components/s-input/s-input.component";
import { ButtonModel } from "../../../shared/extends-components/bbutton-component";
import {
  CheckEnum,
  CheckModel
} from "../../../shared/extends-components/bcheck-component";
import { GridModel } from "../../../shared/extends-components/bgrid-component";
import {
  BinputComponent,
  InputEnum,
  InputModel
} from "../../../shared/extends-components/binput-component";
import { BeneficiaryModel } from "../../../shared/models/beneficiary-model";
import { Section4Model } from "../../../shared/models/section4-model";
import { MesaggeText } from "../../../shared/texts/mesagge-text";
import { BeneficiaryPlanStore } from "../../../store/beneficiary-plan-store";
import { ConfirmeStore } from "../../../store/confirme-store";
import { MainStore } from "../../../store/main-store";
import { RelationshipStore } from "../../../store/relationship-store";
import { TypeBeneficiaryStore } from "../../../store/type-beneficiary-store";
import { TypeDocumentStore } from "../../../store/type-document-store";
import { TypeGenderStore } from "../../../store/type-gender-store";
import { regexType } from "../../../utils/regexDefault";
import { ResponseUiService } from "../../../utils/response-ui.service";
import { Utils } from "../../../utils/utils";

@Component({
  selector: "app-section-page9",
  templateUrl: "./section-page9.component.html",
  styleUrls: ["./section-page9.component.scss"]
})
export class SectionPage9Component extends BaseSection
  implements OnInit, IFormSection {
  _itemSelect: any;
  ngOnInit() { }
  ngAfterContentInit() {
    this.Load();
  }
  constructor(
    public responseUI: ResponseUiService,
    public sectionServ: SectionsService,
    public formServ: FormService
  ) {
    super();
  }

  /**
   * variable que contiene los nombre de las acciones que soporta
   */
  ACTION_DELETE: string = "deleteRow";
  ACTION_EDIT: string = "editRow";
  ACTION_ERROR: string = "errorRow";

  RenuciaAuxFunerario: boolean = false;
  @ViewChild("InputName")
  InputName: SInputComponent;

  @ViewChild("InputLastName")
  InputLastName: SInputComponent;

  @ViewChild("InputBirthdate")
  InputBirthdate: SDatepickerComponent;

  @ViewChild("InputTypeId")
  InputTypeId: SAutocompleteComponent;

  @ViewChild("InputRelationship")
  InputRelationship: SAutocompleteComponent;

  @ViewChild("InputGender")
  InputGender: SAutocompleteComponent;

  @ViewChild("InputPercentage")
  InputPercentage: SInputComponent;
  @ViewChild("InputNumberId")
  InputNumberId: SInputComponent;

  @ViewChild("InputDisability")
  InputDisability: SCheckComponent;

  @ViewChild("InputBeneficiary")
  InputBeneficiary: SCheckComponent;

  @ViewChild("ListBeneficiary")
  ListBeneficiary: SGridComponent;

  private arraySuegros: Array<any> = [];

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description retorna la direccion previo
   */
  async Prev(): Promise<any> {
    return AddressesUrlParams.SECTION_08;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description retorna la direccion siguiente
   */
  async Next(): Promise<any> {
    return AddressesUrlParams.SECTION_ENC;
  }
  async Save(): Promise<any> {
    let valid: boolean = this.ListBeneficiary._PosSums == 100;

    if (!valid) {
      SAlertComponent.AlertWarning(MesaggeText.TEXT_NOT_100_PERCENTAJE);
      return false;
    }

    SAlertComponent.ShowSpinner();
    return new Promise((success, fail) => {
      MainStore.db
        .SetSection9(this.GridBeneficiary.Data)
        .then((response: IResponseService) => {
          this.responseUI.CheckResponseForError(response).then(() => {
            if (response.data == null) {
              return fail(false);
            }
            this.GridBeneficiary.Data = response.data;
            SAlertComponent.CloseSpinner();
            let correct: boolean = true;
            this.GridBeneficiary.Data.forEach(element => {
              if (element["error"] != "OK" && element["error"] != undefined) {
                correct = false;
              }
            });
            if (!correct) {
              SAlertComponent.AlertWarning(
                MesaggeText.TEXT_BENEFICIARIOS_INCORRECT
              );
            }
            success(correct);
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
   * @description retorna true
   */
  async Valid(): Promise<any> {
    return true;
  }
  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description carga la lista de beneficiario
   */
  async Load(): Promise<any> {
    MainStore.db
      .GetSection4()
      .then((section4: Section4Model) => {
        if (!section4) {
          return;
        }
        this.RenuciaAuxFunerario = false;
        if (section4.renunciaAuxFunerario == 0) {
          this.RenuciaAuxFunerario = true;
          this.InputBeneficiary.ItemDisableByValue(
            BeneficiaryPlanStore.FUNERARY
          );
          this.InputBeneficiary.SelectByValue(BeneficiaryPlanStore.BENEFICIARY);
        }

        this.formServ
          .GetListBeneficiary(MainStore.db.GetIdPropect())
          .then(x => {
            this.GridBeneficiary.Data = x;
          })
          .catch(error => {
            this.responseUI.CheckResponseForError(error);
          });
      })
      .catch(error => {
        this.responseUI.CheckResponseForError(error);
      });
    return;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description valida si el boton se habilita o no dependiendo si llega el atributo
   * @param item row de la grid
   */
  ValidityState(item: any): any {
    return (
      item["error"] != "OK" && item["error"] != undefined && item["error"] != ""
    );
  }

  FieldName = {
    Label: "Nombres",
    Placeholder: "Ej. Jose",
    IsRequired: true,
    LenMax: 51,
    Type: InputEnum.Text
  };
  FieldLastName = {
    Label: "Apellidos",
    Placeholder: "Ej. Lopez",
    IsRequired: true,
    LenMax: 51,
    Type: InputEnum.Text
  };
  FieldBirthdate: DatePickerModel = {
    Label: "Fecha De Nacimiento",
    IsRequired: true,
    Behavior: DatePickerBehaviorEnum.DateMaxCurrent,
    ValueMax: BinputComponent.currentDate
  };
  FieldTypeId: AutocompleteModel = {
    Label: "Tipo De Identificación",
    IsRequired: true,
    ItemsByStore: TypeDocumentStore.name,
    SelectValue: TypeDocumentStore.CC
  };
  FieldNumberId: InputModel = {
    Label: "Número De Identificación",
    Placeholder: "Ej. 12345324",
    IsRequired: true,
    Type: InputEnum.Text,
    Pattern: regexType.number,
    LenMax: 20
  };
  FieldRelationship = {
    Label: "Parentesco",
    IsRequired: true,
    ItemsByStore: RelationshipStore.name
  };
  FieldGender = {
    Label: "Género",
    IsRequired: true,
    ItemsByStore: TypeGenderStore.name
  };
  FieldPercentage: InputModel = {
    Label: "Porcentaje",
    Data: "",
    Placeholder: "Ej. 100",
    IsRequired: true,
    ValueMax: 100,
    LenMax: 100,

    Pattern: regexType.percent
  };
  FieldDisability = {
    Label: "¿Tiene alguna discapacidad?",
    Type: CheckEnum.Radio,
    Items: ConfirmeStore.GetCopyDefault(),
    SelectValue: ConfirmeStore.NOT,
    IsRequired: true
  };
  FieldBeneficiary: CheckModel = {
    Type: CheckEnum.Radio,
    Label: "Tipo de Beneficiario",
    ItemsByStore: TypeBeneficiaryStore.name,
    IsRequired: true,
    SelectValue: TypeBeneficiaryStore.BENEFICIARIO
  };

  ButtonAddToList: ButtonModel = {
    Label: "Añadir",
    IconCss: "user-plus"
  };

  ButtonClear: ButtonModel = {
    Label: "Limpiar",
    IconCss: ""
  };

  GridBeneficiary: GridModel = {
    Label: "",
    Data: [],
    IsExportExcel: false,
    PageConfig: {
      IsPages: false,
      PageSize: 20,
      PageCurrent: 1
    },
    IsSearch: true,
    Columns: [
      {
        Label: "Tipo Beneficiario",
        Key: "nombreTipoBeneficiario"
      },
      {
        Label: "Apellidos",
        Key: "primerApellido"
      },
      {
        Label: "Nombres",
        Key: "primerNombre"
      },
      {
        Label: "Parentesco",
        Key: "nombreParentesco"
      },
      {
        Label: "Genero",
        Key: "nombreGenero"
      },
      {
        Label: "Porcentaje",
        Key: "porcentaje",
        IsSum: true,
        ApplyFormatFunc: (text, value, column, index) => {
          return text == "0" || isNaN(text) ? "" : text;
        }
      },
      {
        Label: "Observación",
        Key: "errors",
        Buttons: [
          {
            IconCss: "fas fa-exclamation-circle",
            Action: this.ACTION_ERROR,
            BeferoValid: item => {
              return this.ValidityState(item);
            }
          }
        ]
      },
      {
        Label: "Opciones",
        Key: "undefined",
        Buttons: [
          {
            IconCss: "far fa-trash-alt",
            Action: this.ACTION_DELETE,
            BeferoValid: item => {
              return !(item.automatico == 1);
            }
          },
          {
            IconCss: "far fa-edit",
            Action: this.ACTION_EDIT,
            BeferoValid: item => {
              return true;
              // return !(
              //   item.automatico == 1 &&
              //   item.tipoBeneficiari == BeneficiaryPlanStore.FUNERARY
              // );
            }
          }
        ]
      }
    ]
  };

  _IsSelectTypeBeneficiary: number = 0;
  _SelectBaneficiary: any = undefined;
  _automatic: number = null;
  IsEdit: boolean = false;

  _MAX_YEAR: number = 70;
  _MIN_YEAR: number = 30;

  _father: number = RelationshipStore.FATHER;
  _mother: number = RelationshipStore.MOTHER;
  _childerGrild: number = RelationshipStore.CHILDER_GRILD;
  _childerBoy: number = RelationshipStore.CHILDER_BOY;
  _spouse: number = RelationshipStore.CHILDER_SPOUSE;

  _typeTI: number = TypeDocumentStore.TI;
  _typeCR: number = TypeDocumentStore.CIVIL_REGISTRATION;

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description valida si el tipo de documento es correcto con respecto a la edad
   * @param age edad de la persona que se le asigno
   * @param typeDocument el tipo de documento de la persona que se le asigno
   */
  public ValidAgeVsTypeDocument(
    age: number,
    typeDocument: number,
    labelDocument: string
  ): string {
    let response: string = "";
    let valid: boolean = false;
    /// valida que si la persona es menor de edad pero ha escogido un tipo de documento de mayor de edad o no correcto
    valid =
      age < 18 &&
      (typeDocument != this._typeCR && typeDocument != this._typeTI);

    /// valida que si la persona es mayor de edad pero ha escogido un tipo de documento de menor de edad o no correcto
    valid =
      valid ||
      (age > 18 &&
        (typeDocument == this._typeCR || typeDocument == this._typeTI));

    if (valid) {
      response = MesaggeText.TEXT_INVALID_AGE_VS_TYPE_DOC;
      response = response
        .replace("{0}", age.toString())
        .replace("{1}", labelDocument);
    }
    return response;
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Obtiene los valores del formulario y se lo adiciona a la lista
   */
  OnAddToList() {
    if (!this.ValidData()) {
      return SAlertComponent.AlertWarning(MesaggeText.FIELD_REQUIER);
    }

    let percentage: number = parseFloat(this.InputPercentage.GetData());
    let parentesco = this.InputRelationship.GetData();
    let birthdate = Utils.CalculateAge(this.InputBirthdate.GetData());
    let typebeneficiary = this.InputBeneficiary.GetData();
    let automatic: number = null;
    let checkCreate: boolean = false;
    let disability: boolean =
      this.InputDisability.GetData() == ConfirmeStore.YES;

    if (this.ListBeneficiary._PosSums + percentage > 100 && !this.IsEdit) {
      return SAlertComponent.AlertWarning(MesaggeText.PERCERTAGE_MAYOR);
    }

    let isMsg: string = this.ValidAgeVsTypeDocument(
      birthdate,
      this.InputTypeId.GetData(),
      this.InputTypeId.GetLabel()
    );
    if (isMsg) {
      return SAlertComponent.AlertWarning(isMsg);
    }

    if (
      [this._father, this._mother, this._spouse].find(x => x == parentesco) &&
      (disability || birthdate <= 70) &&
      !this.RenuciaAuxFunerario
    ) {
      if (
        this.IsEdit &&
        this._automatic != null &&
        typebeneficiary != BeneficiaryPlanStore.BENEFICIARY
      ) {
        automatic = this._automatic;
      } else if (typebeneficiary == BeneficiaryPlanStore.BENEFICIARY) {
        automatic = 1;
        checkCreate = true;
      } else {
        automatic = 0;
      }
      // typebeneficiary = BeneficiaryPlanStore.FUNERARY;
    }

    if (
      [this._childerGrild, this._childerBoy].find(x => x == parentesco) &&
      (disability || birthdate <= 30) &&
      !this.RenuciaAuxFunerario
    ) {
      if (
        this.IsEdit &&
        this._automatic != null &&
        typebeneficiary != BeneficiaryPlanStore.BENEFICIARY
      ) {
        automatic = this._automatic;
      } else if (typebeneficiary == BeneficiaryPlanStore.BENEFICIARY) {
        automatic = 1;
        checkCreate = true;
      } else {
        automatic = 0;
      }
    } else if (
      typebeneficiary == BeneficiaryPlanStore.FUNERARY &&
      (automatic == null || automatic == 0)
    ) {
      automatic = 0;
      percentage = 0;
    }

    if (
      !disability &&
      [this._father, this._mother, this._spouse].find(x => x == parentesco) &&
      birthdate > 70 &&
      typebeneficiary == BeneficiaryPlanStore.FUNERARY
    ) {
      return SAlertComponent.AlertWarning("NO POSIBLE");
    }

    if (
      !disability &&
      [this._childerGrild, this._childerBoy].find(x => x == parentesco) &&
      birthdate > 30 &&
      typebeneficiary == BeneficiaryPlanStore.FUNERARY
    ) {
      return SAlertComponent.AlertWarning("NO POSIBLE");
    }

    if (percentage < 1 && typebeneficiary == BeneficiaryPlanStore.BENEFICIARY) {
      return SAlertComponent.AlertWarning(MesaggeText.PERCERTAGE_MINOR);
    }

    let fullName = Utils.RemoveMoreSpace(this.InputName.GetData()).split(" ");
    let fullLastName = Utils.RemoveMoreSpace(this.InputLastName.GetData()).split(" ");
    let data: BeneficiaryModel = this._SelectBaneficiary || new BeneficiaryModel();

    data.automatico = automatic;
    data.idProspecto = MainStore.db.GetIdPropect();
    data.ip = MainStore.db.GetUser().ip;
    data.fechaNacimiento = this.InputBirthdate.GetData();
    data.generoBeneficiario = this.InputGender.GetData();
    data.numeroIdentificacion = this.InputNumberId.GetData();
    data.parentesco = this.InputRelationship.GetData();
    data.porcentaje = percentage;
    data.presentaIncapacidad = this.InputDisability.GetData();
    data.primerNombre = fullName[0];
    data.segundoNombre = fullName[1] || "";
    data.primerApellido = fullLastName[0];
    data.segundoApellido = fullLastName[1] || "";
    data.tipoIdentificacion = this.InputTypeId.GetData();
    data.tipoBeneficiari = typebeneficiary;
    data.grupo = this._SelectBaneficiary
      ? this._SelectBaneficiary.grupo
      : Utils.GeneralNameGroup();

    if (!this._SelectBaneficiary) {
      data.usuarioCreacion = MainStore.db.GetUser().username;
    } else {
      data.usuarioModificacion = MainStore.db.GetUser().username;
      data.idBeneficiario = this._SelectBaneficiary.idBeneficiario;
    }
    let exits = this.GridBeneficiary.Data.find(
      x =>
        x.numeroIdentificacion == data.numeroIdentificacion &&
        data.tipoIdentificacion == x.tipoIdentificacion &&
        x.grupo != data.grupo
    );


    for (let i = 0; i < this.GridBeneficiary.Data.length; i++) {
      if (this.GridBeneficiary.Data[i].parentesco == 5000) {
        if (this.InputRelationship.GetData() == 5000) {
          return SAlertComponent.AlertWarning(MesaggeText.TEXT_PARENTESCO_REPEAT_MOTHER);
        }

      }

      if (this.GridBeneficiary.Data[i].parentesco == 5001) {
        if (this.InputRelationship.GetData() == 5001) {
          return SAlertComponent.AlertWarning(MesaggeText.TEXT_PARENTESCO_REPEAT_FATHER);
        }
      }

      if (this.GridBeneficiary.Data[i].parentesco == 5004) {
        if (this.InputRelationship.GetData() == 5004) {
          return SAlertComponent.AlertWarning(MesaggeText.TEXT_PARENTESCO_REPEAT_SPOUSE);
        }
      }

      if (this.InputRelationship.GetData() == 5017) {
        if (this.GridBeneficiary.Data[i].parentesco == 5017) {
          this.arraySuegros.push(this.GridBeneficiary.Data[i]);
        }
      }

    }    

    if (this.arraySuegros.length >= 2) {
      this.arraySuegros = [];
      return SAlertComponent.AlertWarning(MesaggeText.TEXT_PARENTESCO_VALID_INLAWS);
    }



    let arrayNew = Utils.findArrayGenero(this.GridBeneficiary.Data);

    if (this.InputRelationship.GetData() == 5005) {
      if (this.InputGender.GetData() == 181) { //Valida si es femenino
        if (arrayNew[0].length >= 2) {
          return SAlertComponent.AlertWarning(MesaggeText.TEXT_PARENTESCO_VALID_GRANDMOTHER);
        }
      } else if (this.InputGender.GetData() == 182) { // Valida si es masculino
        if (arrayNew[1].length >= 2) {
          return SAlertComponent.AlertWarning(MesaggeText.TEXT_PARENTESCO_VALID_GRANDFATHER);
        }
      }
    }




    if (
      //(exits && data.idBeneficiario != exits.idBeneficiario) ||
      exits &&
      data.grupo != exits.grupo &&
      data.grupo &&
      exits.grupo
    ) {
      return SAlertComponent.AlertWarning(MesaggeText.TEXT_TYPE_DOC_EXIST);
    }

    this.InputBeneficiary.SelectByValue(typebeneficiary);
    data["nombreTipoBeneficiario"] = this.InputBeneficiary.GetDataLabel();
    data["nombreParentesco"] = this.InputRelationship.GetLabel();
    data["nombreGenero"] = this.InputGender.GetLabel();

    if (!this._SelectBaneficiary) {
      this.ListBeneficiary.AddItem(data);
    }

    /**
     * si el beneficiario es nuevo y el tipo es solidaridad (automatic => true)
     */

    if (automatic && !this._SelectBaneficiary) {
      this.CreateDuplicateDataForFunerary(data);
    } else if (automatic && this._SelectBaneficiary && checkCreate) {
      this.DeleteFuneraryDuplicate(this._SelectBaneficiary);
      this.CreateDuplicateDataForFunerary(data);
    } else if (automatic && this._SelectBaneficiary) {
      // this.DeleteFuneraryDuplicate(this._SelectBaneficiary);
    }

    this.ClearFields();
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Elimina Funerario Duplicado
   * @param data
   */
  DeleteFuneraryDuplicate(data: BeneficiaryModel) {
    let index = this.GridBeneficiary.Data.findIndex(
      x =>
        x.grupo == data.grupo &&
        x.tipoBeneficiari == BeneficiaryPlanStore.FUNERARY
    );
    if (index != -1) {
      this.ListBeneficiary.RemoveAt(index);
    }
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Crea un dublicado del dato y lo agrega en la lista
   * con la condicion de colocarlo aux solidaridad y aporte
   * @param data
   */
  CreateDuplicateDataForFunerary(data: BeneficiaryModel) {
    let beneficiary: BeneficiaryModel = Utils.CopyJson(data);
    beneficiary.tipoBeneficiari = BeneficiaryPlanStore.FUNERARY;
    let itemBeneficiary = this.FieldBeneficiary.Items.find(
      x => x.Value == BeneficiaryPlanStore.FUNERARY
    );
    beneficiary["nombreTipoBeneficiario"] = itemBeneficiary.Label;
    beneficiary["nombreParentesco"] = this.InputRelationship.GetLabel();
    beneficiary.porcentaje = 0;
    beneficiary.grupo = data.grupo;
    this.ListBeneficiary.AddItem(beneficiary);
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Valida que todos los campos contenga datos
   */
  ValidData(): any {
    let valid: boolean = true;
    valid = this.InputName.Valid() && valid;
    valid = this.InputLastName.Valid() && valid;
    valid = this.InputBirthdate.Valid() && valid;
    valid = this.InputTypeId.Valid() && valid;
    valid = this.InputGender.Valid() && valid;
    valid = this.InputNumberId.Valid() && valid;
    valid = this.InputRelationship.Valid() && valid;
    valid = this.InputDisability.Valid() && valid;
    valid = this.InputNumberId.Valid() && valid;
    valid = this.InputPercentage.Valid() && valid;

    return valid;
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Limpiar componentes
   * @param params
   */
  ClearFields(): any {
    this._SelectBaneficiary = undefined;
    this._automatic = null;
    this.IsEdit = false;
    this.InputName.Clear();
    this.InputLastName.Clear();
    this.InputBirthdate.Clear();
    this.InputTypeId.Clear();
    this.InputRelationship.Clear();
    this.InputGender.Clear();
    this.InputPercentage.Clear();
    this.InputNumberId.Clear();
    this.InputBeneficiary.SetDisable(false);
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Escucha el boton de actiones sobre la celda
   * @param params
   */
  OnActionBtn(params) {
    this._SelectBaneficiary = undefined;
    this.IsEdit = false;
    if (params.btn.Action == this.ACTION_DELETE) {
      this.CheckDeleteItem(
        this.GridBeneficiary.Data[params.position],
        params.position
      );
    } else if (params.btn.Action == this.ACTION_EDIT) {
      this.InputBeneficiary.SetDisable(false);
      this.IsEdit = true;
      this._SelectBaneficiary = this.GridBeneficiary.Data[params.position];
      this._automatic = this.GridBeneficiary.Data[params.position][
        "automatico"
      ];
      this.CheckEditItem(this._SelectBaneficiary, params.position);
      //Si el registro se agrego por automatico no puede editar el tipo de beneficiario
      if (this._automatic == 1) {
        this.InputBeneficiary.SetDisable(true);
      }
    } else if (params.btn.Action == this.ACTION_ERROR) {
      this._SelectBaneficiary = this.GridBeneficiary.Data[params.position];
      let text: string =
        this._SelectBaneficiary["error"] == "OK"
          ? "Beneficiario registrado correctamente."
          : this._SelectBaneficiary["error"];
      SAlertComponent.AlertInfo(text);
    }
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description valida si el cliente editar datos
   * @param item
   * @param position
   */
  CheckEditItem(item: any, position: number) {
    let data = (this._itemSelect = item);

    this.InputBirthdate.SetData(data.fechaNacimiento);
    this.InputGender.SelectByValue(data.generoBeneficiario);
    this.InputNumberId.SetData(data.numeroIdentificacion);
    this.InputRelationship.SelectByValue(data.parentesco);
    this.InputPercentage.SetData(data.porcentaje);
    this.InputDisability.SelectByValue(data.presentaIncapacidad);
    this.InputName.SetData(data.primerNombre + " " + data.segundoNombre);
    this.InputLastName.SetData(
      data.primerApellido + " " + data.segundoApellido
    );
    this.InputTypeId.SelectByValue(data.tipoIdentificacion);
    this.InputBeneficiary.SelectByValue(data.tipoBeneficiari);
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Valida si el usuario desea eliminar el item
   * @param item
   */
  CheckDeleteItem(item: any, position: number) {
    SAlertComponent.Confirm(
      MesaggeText.TEXT_DELETE_ITEM,
      false,
      MesaggeText.TITLE_DELETE_ITEM
    ).then(response => {
      response && this.DeleteItem(item, position);
    });
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description solicita eliminar el item desde la base de datos
   * @param item elemento que va eliminar
   */
  DeleteItem(item: any, position: number) {
    if (item["idBeneficiario"]) {
      this.formServ
        .DeleteBeneficiary(item["idBeneficiario"])
        .then(response => {
          this.responseUI.CheckResponseForError(response).then(() => {
            this.ListBeneficiary.RemoveAt(position);
          });
        })
        .catch(error => {
          this.responseUI.CheckResponseForError(error);
        });
    } else {
      this.ListBeneficiary.RemoveAt(position);
    }
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Escucha el esto de tipo de beneficiario
   * @param item
   */
  _OnChangeType(item) {
    let isRequired = item.Value == BeneficiaryPlanStore.BENEFICIARY;
    this.FieldPercentage.IsRequired = isRequired;
    this.InputPercentage.SetDisable(!isRequired);
    !isRequired && this.InputPercentage.SetData(0);
  }
}

export class DataGrid {
  name: string = "";
  nameLast: string = "";
  birthdate: string = "";
  typeDocument: string = "";
}
