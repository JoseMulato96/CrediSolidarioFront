import { Component, OnInit, ViewChild, ɵConsole } from "@angular/core";
import { IFormSection } from "../../../interfaces/form-section";
import { BaseSection } from "../../../extends/base-section";
import { AddressesUrlParams } from "../../../parameters/addresses-url-params";
import {
  CheckEnum,
  CheckModel
} from "../../../shared/extends-components/bcheck-component";
import { CIIUStore } from "../../../store/ciiu-store";
import { TypeMoneyStore } from "../../../store/type-money-store";
import { TypeTransactionStore } from "../../../store/type-transaction-store";
import { TypeProductStore } from "../../../store/type-product-store";
import { TerritoryStore } from "../../../store/territory-store";
import { regexType } from '../../../utils/regexDefault';
import { SAutocompleteComponent, AutocompleteModel } from "../../../shared/components/s-autocomplete/s-autocomplete.component";
import { SInputComponent } from "../../../shared/components/s-input/s-input.component";
import { SCheckComponent } from "../../../shared/components/s-check/s-check.component";
import { SAddressComponent } from "../../../shared/components/s-address/s-address.component";
import { MainStore } from "../../../store/main-store";
import { OcupationStore } from "../../../store/ocupation-store";
import { IResponseService } from "../../../interfaces/response-service";
import { ConfirmeStore } from "../../../store/confirme-store";
import {
  Section3Part2Model,
  Section3Part1Model
} from "../../../shared/models/section3-model";
import { ResponseEnum } from "../../../enums/ResponseEnum.enum";
import { ResponseUiService } from "../../../utils/response-ui.service";
import { InputEnum, InputModel } from '../../../shared/extends-components/binput-component';
import { FormService } from "../../../services/form.service";
import { MesaggeText } from "../../../shared/texts/mesagge-text";
import { SAlertComponent } from "../../../shared/components/s-alert/s-alert.component";
import { AportaCartaStore } from "../../../store/aporta-carta-store";
import { TypeContractStore } from "../../../store/type-contract-store";

@Component({
  selector: "app-section-page3",
  templateUrl: "./section-page3.component.html",
  styleUrls: ["./section-page3.component.scss"]
})
export class SectionPage3Component extends BaseSection
  implements OnInit, IFormSection {
  @ViewChild("InputOcupation")
  InputOcupation: SAutocompleteComponent;

  @ViewChild("InputCIIU")
  InputCIIU: SInputComponent;

  @ViewChild("InputExtension")
  InputExtension: SInputComponent;


  @ViewChild("InputdActividadEconomica")
  InputdActividadEconomica: SAutocompleteComponent;

  @ViewChild("InputCompany")
  InputCompany: SInputComponent;

  @ViewChild("InputCharge")
  InputCharge: SInputComponent;

  @ViewChild("InputLocation")
  InputLocation: SAutocompleteComponent;

  @ViewChild("InputPhoneCompany")
  InputPhoneCompany: SInputComponent;

  @ViewChild("InputAddresCompany")
  InputAddresCompany: SAddressComponent;

  @ViewChild("InputMonthlyIncome")
  InputMonthlyIncome: SInputComponent;

  @ViewChild("InputMonthlyDischarge")
  InputMonthlyDischarge: SInputComponent;

  @ViewChild("InputOtherIncome")
  InputOtherIncome: SInputComponent;

  @ViewChild("InputOtherDetail")
  InputOtherDetail: SInputComponent;

  @ViewChild("InputTotalActive")
  InputTotalActive: SInputComponent;

  @ViewChild("InputTotalPassive")
  InputTotalPassive: SInputComponent;

  @ViewChild("InputTypeTransation")
  InputTypeTransation: SCheckComponent;

  // Campos Para Informacion contador by: Jose Mulato
  @ViewChild("InputAportaContadorQuestion")
  InputAportaContadorQuestion: SCheckComponent;

  @ViewChild("InputNameContador")
  InputNameContador: SInputComponent;

  @ViewChild("InputCedulaContador")
  InputCedulaContador: SInputComponent;

  @ViewChild("InputTelefonoContador")
  InputTelefonoContador: SInputComponent;

  @ViewChild("InputNumTarjetaContador")
  InputNumTarjetaContador: SInputComponent;

  @ViewChild("InputTypeContract")
  InputTypeContract: SCheckComponent;

  // Fin Campos Para Informacion contador by: Jose Mulato


  @ViewChild("InputNameEntity")
  InputNameEntity: SInputComponent;

  @ViewChild("InputTypeProduct")
  InputTypeProduct: SAutocompleteComponent;

  @ViewChild("InputIdProduct")
  InputIdProduct: SInputComponent;

  @ViewChild("InputAmount")
  InputAmount: SInputComponent;

  @ViewChild("InputCoin")
  InputCoin: SAutocompleteComponent;

  @ViewChild("InputCountryCoin")
  InputCountryCoin: SAutocompleteComponent;

  @ViewChild("InputCieyCoin")
  InputCityCoin: SAutocompleteComponent;



  FieldOcupation = {
    Label: "Ocupación Por La Cual Obtiene Sus Recursos",
    IsRequired: true,
    Placeholder: "Ej. Negocio propio",
    ItemsByStore: OcupationStore.name
  };

  dataFieldActividad: any;
  ArrayFieldActividad: Array<any>;
  comodin: boolean = false;

  FieldCIIU = {
    Type: InputEnum.Text,
    Label: "Código CIIU",
    IsRequired: true
  };

  FieldActividadEconomica = {
    Label: "Actividad Económica",
    IsRequired: true,
    ItemsByStore: CIIUStore.name
  };

  FieldCompany = {
    Label: "Nombre De La Empresa O Negocio",
    IsRequired: true,
    Type: InputEnum.Text,
    Placeholder: "Ej. Coomeva",
    LenMax: 100
  };

  FieldExtension = {
    Label: "Extensión  Empresa",
    IsRequired: false,
    Pattern: regexType.number,
    Placeholder: "Ej. 1234567",
    LenMax: 20
  };

  FieldCharge = {
    Label: "Cargo Que Ocupa",
    IsRequired: true,
    Type: InputEnum.Text,
    Placeholder: "Ej. Presidente",
    LenMax: 150
  };

  FieldLocation = {
    Label: "Departamento/Ciudad",
    IsRequired: true,
    ItemsByStore: TerritoryStore.name,
    FunctionStore: "GetServiceCities",
    MinChars: 3,
    IsActionWrittenStore: true,
    DefaultOptionParamterStore: { country: 2 },
    Tooltip: {
      Label: MesaggeText.TOOLTIP_TYPING_SEARCH
    }
  };

  FieldPhoneCompany = {
    Label: "Teléfono Empresa",
    IsRequired: true,
    Placeholder: "Ej. 1234567",
    Pattern: regexType.phone,
    LenMax: 7
  };

  FieldAddresCompany = {
    Label: "Dirección de Empresa",
    IsRequired: true,
    Placeholder: "Barrio: Ej Peñon",
    Placeholder2: "Av 1 con calle 100",
    LenMaxValue: 50,
    AddressLenMax: 200
  };

  FieldMonthlyIncome = {
    Label: "Ingresos Mensuales",
    IsRequired: true,
    LenMax: 18,
    Placeholder: "Ej. $500.000.000,00",
    Pattern: regexType.currency,
    IsCurrency: true
  };

  FieldMonthlyDischarge = {
    Label: "Egresos Mensuales",
    IsRequired: true,
    LenMax: 18,
    Placeholder: "Ej. $500.000.000,00",
    Pattern: regexType.currency,
    IsCurrency: true
  };

  FieldOtherIncome = {
    Label: "Otros Ingresos",
    //IsRequired: true,
    LenMax: 10,
    Placeholder: "Ej. $500.000,00",
    Pattern: regexType.currency,
    IsCurrency: true
  };

  FieldOtherDetail = {
    Label: "Detalle de Otros Ingresos",
    // IsRequired: false,
    Placeholder: "Ej. Arriendo",
    LenMax: 200
  };

  FieldTotalActive = {
    Label: "Total Activos",
    IsRequired: true,
    LenMax: 18,
    Placeholder: "Ej. $500.000.000,00",
    Pattern: regexType.currency,
    IsCurrency: true
  };

  FieldTotalPassive = {
    Label: "Total Pasivos",
    IsRequired: true,
    LenMax: 18,
    Placeholder: "Ej. $500.000.000,00",
    Pattern: regexType.currency,
    IsCurrency: true
  };

  FieldTypeTransation: CheckModel = {
    Label:
      "¿Realiza operaciones en moneda extranjera? ¿Qué tipo de transacciones?",
    IsRequired: false,
    Type: CheckEnum.Radio,
    ItemsByStore: TypeTransactionStore.name,
    VisibleOptionNone: true,
    LabelOptionNone: "NINGUNO",
    ValueOptionNone: -Infinity,
    SelectValue: -Infinity
  };

  FieldAportaContadorQuestion: CheckModel = {
    Label:
      "¿Aporta carta de contador como soporte?",
    IsRequired: false,
    Type: CheckEnum.Radio,
    ItemsByStore: AportaCartaStore.name,
    VisibleOptionNone: false,
    LabelOptionNone: "No Seleccionado",
    ValueOptionNone: -Infinity,
    SelectValue: -Infinity
  };

  FieldNameContador = {
    Label: "Nombre Contador",
    Placeholder: "Ej. Juan Pablo",
    Type: InputEnum.Text,
    ReadOnly: true,
    LenMax: 50
  };

  FieldCedulaContador = {
    Label: "Cedula Contador",
    Placeholder: "Ej. 123456789",
    LenMax: 10,
    ReadOnly: true,
    Pattern: regexType.number
  };

  FieldTelefonoContador = {
    Label: "Teléfono Contador",
    Placeholder: "Ej. 1234567",
    LenMax: 10,
    ReadOnly: true,
    Pattern: regexType.number
  };


  FieldNumTarjetaContador = {
    Label: "Número De Tarjeta Profesional Contador",
    Placeholder: "Ej. 1234567-T",
    ReadOnly: true,
    LenMax: 50
  };


  FieldTypeContract: AutocompleteModel = {
    Label: "Tipo de Contrato",
    IsRequired: true,
    ItemsByStore: TypeContractStore.name
  };


  // Fin Campos Informacion Contador by: Jose Mulato

  FieldNameEntity = {
    Label: "Nombre de la Entidad",
    IsRequired: false,
    Placeholder: "Ej. Coomeva",
    ReadOnly: true,
    LenMax: 50
  };

  FieldIdProduct = {
    Label: "Identificación del Producto",
    IsRequired: false,
    Placeholder: "Ej. 219741916249",
    ReadOnly: true,
    LenMax: 10,
    Pattern: regexType.number
  };

  FieldTypeProduct = {
    Label: "Tipo de Producto",
    IsRequired: false,
    ReadOnly: true,
    ItemsByStore: TypeProductStore.name
  };

  FieldAmount = {
    Label: "Monto",
    IsRequired: false,
    ReadOnly: true,
    LenMax: 8,
    Placeholder: "Ej. $50.000,00",
    Pattern: regexType.currency,
    IsCurrency: true
  };

  FieldCoin = {
    Label: "Moneda",
    IsRequired: false,
    ReadOnly: true,
    ItemsByStore: TypeMoneyStore.name,
    Placeholder: "Ej. Pesos"
  };

  FieldCountryCoin = {
    Label: "País",
    IsRequired: false,
    ReadOnly: true,
    Placeholder: "Ej. Colombia",
    ItemsByStore: TerritoryStore.name,
    FunctionStore: "GetServiceContries"
  };

  FieldCityCoin = {
    Label: "Ciudad",
    IsRequired: false,
    ReadOnly: true,
    Placeholder: "Ej. Cali",
    ItemsByStore: TerritoryStore.name,
    FunctionStore: "GetServiceCities",
    MinChars: 3,
    IsActionWrittenStore: true,
    Tooltip: {
      Label: MesaggeText.TOOLTIP_TYPING_SEARCH
    }
  };

  OnSelectCountry(e) {
    this.InputCityCoin.Clear();
    this.InputCityCoin.OptionParamterStore({
      country: this.InputCountryCoin.GetData()
    });
  }

  /**
   * r
   * @description retorna la url anterior
   */
  async Prev(): Promise<any> {
    return AddressesUrlParams.SECTION_02;
  }

  /**
   * r
   * @description retorna la url siguiente
   */
  async Next(): Promise<any> {
    return AddressesUrlParams.SECTION_04;
  }
  /**
   * 
   * @description Guardar en dos casos:
   * 1. si no ha escogido un tipo de transación se guarda solo info economia
   * 2. si ha escogido un tipo de transación se guarda primero transación y luego info economia
   */
  async Save(): Promise<any> {
    return new Promise((success, fail) => {
      if (this.InputTypeTransation.GetData() == -Infinity) {
        this.SaveInfEconomic(undefined)
          .then((response: IResponseService) => {
            this.responseUI.CheckResponseForError(response).then(() => {
              success(response.status == ResponseEnum.OK);
            });
          })
          .catch(error => {
            this.responseUI.CheckResponseForError(error);
            success(false);
          });
      } else {
        this.SaveTransaction().then((transReponse: IResponseService) => {
          this.SaveInfEconomic(transReponse.data["consTransaccion"])
            .then((response: IResponseService) => {
              this.responseUI.CheckResponseForError(response).then(() => {
                success(response.status == ResponseEnum.OK);
              });
            })
            .catch(error => {
              this.responseUI.CheckResponseForError(error);
              success(false);
            });
        });
      }
    });
  }

  /**
   * r
   * @description enviar a guardar la transaccion
   */
  async SaveTransaction() {
    return MainStore.db.SetSection3Part1({
      ciudad: this.InputCityCoin.GetData(),
      moneda: this.InputCoin.GetData(),
      nombreEntidad: this.InputNameEntity.GetData(),
      identificacionProducto: this.InputIdProduct.GetData(),
      monto: this.InputAmount.GetData(),
      tipoProducto: this.InputTypeProduct.GetData()
    });
  }

  /**
   * r
   * @description enviar a guardar la informacion economica
   */
  async SaveInfEconomic(idTrasantion) {
    return MainStore.db.SetSection3Part2({
      operacionesMonedaExtranjera:
        this.InputTypeTransation.GetData() != -Infinity
          ? ConfirmeStore.YES
          : ConfirmeStore.NOT,
      tipoTransaccion:
        this.InputTypeTransation.GetData() == -Infinity
          ? undefined
          : this.InputTypeTransation.GetData(),
      consTransaccion: idTrasantion,
      ocupacion: this.InputOcupation.GetData(),
      codigoCiiu: this.InputCIIU.GetData(),
      extensionEmpresa: this.InputExtension.GetData(),
      pregAportaCarta: this.InputAportaContadorQuestion.GetData(),
      nombreContador: this.InputNameContador.GetData(),
      cedulaContador: this.InputCedulaContador.GetData(),
      telefonoContador: this.InputTelefonoContador.GetData(),
      numTarjetaContador: this.InputNumTarjetaContador.GetData(),
      cargo: this.InputCharge.GetData(),
      ciudadEmpresa: this.InputLocation.GetData(),
      nombreEmpresa: this.InputCompany.GetData(),
      telefonoEmpresa: this.InputPhoneCompany.GetData(),
      otrosIngresos: this.InputOtherDetail.GetData(),
      direccion: this.InputAddresCompany.GetDataAddress(),
      egresosMensuales: this.InputMonthlyDischarge.GetData(),
      ingresosMensuales: this.InputMonthlyIncome.GetData(),
      valorOtrosIngresos: this.InputOtherIncome.GetData(),
      barrio: this.InputAddresCompany.GetDataNeighborhood(),
      totalActivos: this.InputTotalActive.GetData(),
      totalPasivos: this.InputTotalPassive.GetData(),
      tipoContrato: this.InputTypeContract.GetData()
    });
  }

  /**
   * 
   * @description Escucha cuando a selecionado el tipo de transación
   */
  OnSelectTypeTransation() {
    let value = this.InputTypeTransation.GetData();

    let isOnlyRead = value == -Infinity ? true : false;

    this.InputNameEntity.SetReadOnly(isOnlyRead);
    this.InputTypeProduct.SetReadOnly(isOnlyRead);
    this.InputIdProduct.SetReadOnly(isOnlyRead);
    this.InputAmount.SetReadOnly(isOnlyRead);
    this.InputCoin.SetReadOnly(isOnlyRead);
    this.InputCountryCoin.SetReadOnly(isOnlyRead);
    this.InputCityCoin.SetReadOnly(isOnlyRead);

    this.InputNameEntity.Skeleton.IsRequired = !isOnlyRead;
    this.InputTypeProduct.Skeleton.IsRequired = !isOnlyRead;
    this.InputIdProduct.Skeleton.IsRequired = !isOnlyRead;
    this.InputAmount.Skeleton.IsRequired = !isOnlyRead;
    this.InputCoin.Skeleton.IsRequired = !isOnlyRead;
    this.InputCountryCoin.Skeleton.IsRequired = !isOnlyRead;
    this.InputCityCoin.Skeleton.IsRequired = !isOnlyRead;

    this.InputNameEntity.Valid();
    this.InputTypeProduct.Valid();
    this.InputIdProduct.Valid();
    this.InputAmount.Valid();
    this.InputCoin.Valid();
    this.InputCountryCoin.Valid();
    this.InputCityCoin.Valid();

    this.InputNameEntity.Clear();
    this.InputTypeProduct.Clear();
    this.InputIdProduct.Clear();
    this.InputAmount.Clear();
    this.InputCoin.Clear();
    this.InputCountryCoin.Clear();
    this.InputCityCoin.Clear();
  }

  /**
   * r
   * @description valida los campos este llenos o cumpla con el dato
   */
  async Valid(): Promise<any> {
    let isValid = this.ValidFields([
      this.InputOcupation,
      this.InputCIIU,
      this.InputdActividadEconomica,
      this.InputCompany,
      this.InputCharge,
      //this.InputLocation,
      this.InputPhoneCompany,
      this.InputAddresCompany,
      this.InputMonthlyIncome,
      this.InputMonthlyDischarge,
      this.InputOtherIncome,
      this.InputOtherDetail,
      this.InputTotalActive,
      this.InputTotalPassive,
      this.InputTypeTransation,
      this.InputAportaContadorQuestion,
      this.InputNameContador,
      this.InputCedulaContador,
      this.InputTelefonoContador,
      this.InputNumTarjetaContador,
      this.InputTypeContract
    ]);

    let isValidOther = true;
    if (!!this.InputTypeTransation.GetData()) {
      isValidOther = this.ValidFields([
        this.InputNameEntity,
        this.InputTypeProduct,
        this.InputIdProduct,
        this.InputAmount,
        this.InputCoin,
        this.InputCountryCoin,
        this.InputCityCoin
      ]);
    }

    return isValid && isValidOther;
  }

  /**
   * r
   * @description carga los valores previos y exite
   */
  async Load(): Promise<any> {
    return new Promise((success, fail) => {
      MainStore.db
        .GetSection3Parte2()
        .then((section3Part2: Section3Part2Model) => {
          if (!section3Part2) {
            return success();
          }


          this.InputTypeTransation.SelectByValue(section3Part2.tipoTransaccion);
          this.InputOcupation.SelectByValue(section3Part2.ocupacion);
          section3Part2.ocupacion != 362 ? this.InputAportaContadorQuestion._Disable = true : this.InputAportaContadorQuestion._Disable = false;
          this.InputCIIU.SetData(section3Part2.codigoCiiu["codigoCiiu"]);
          this.InputExtension.SetData(section3Part2.extensionEmpresa);
          this.InputdActividadEconomica.SelectByValue(section3Part2.codigoCiiu["codigoCiiu"]);
          this.InputNameContador.SetData(section3Part2.nombreContador);
          this.InputCedulaContador.SetData(section3Part2.cedulaContador);
          this.InputTelefonoContador.SetData(section3Part2.telefonoContador);
          this.InputNumTarjetaContador.SetData(section3Part2.numTarjetaContador);
          this.InputAportaContadorQuestion.SelectByValue(section3Part2.pregAportaCarta);
          this.InputTypeContract.SelectByValue(section3Part2.tipoContrato);
          this.InputCharge.SetData(section3Part2.cargo);
          this.formServ
            .GetParentPlace(
              typeof section3Part2.ciudadEmpresa == "object"
                ? section3Part2.ciudadEmpresa["consLocalizacion"]
                : section3Part2.ciudadEmpresa
            )
            .then(response => {
              let list = response;
              if (!list) {
                return;
              }
              this.InputLocation.SelectByValue(list["consPais"]);
              let data = {
                Label: list["descripcionCiudad"],
                Value: list["consCiudad"]
              };
              this.InputLocation.AddItem(data);
              this.InputLocation.SelectByValue(data.Value);
              this.InputLocation.Valid();
            });

          this.InputCompany.SetData(section3Part2.nombreEmpresa);
          this.InputPhoneCompany.SetData(section3Part2.telefonoEmpresa);
          this.InputOtherDetail.SetData(section3Part2.otrosIngresos);
          this.InputAddresCompany.SetDataAddress(section3Part2.direccion);
          this.InputMonthlyDischarge.SetData(section3Part2.egresosMensuales);
          this.InputMonthlyIncome.SetData(section3Part2.ingresosMensuales);
          this.InputOtherIncome.SetData(section3Part2.valorOtrosIngresos);
          this.InputAddresCompany.SetDataNeighborhood(section3Part2.barrio);
          this.InputTotalActive.SetData(section3Part2.totalActivos);
          this.InputTotalPassive.SetData(section3Part2.totalPasivos);

          if (!section3Part2.consTransaccion) {
            return success();
          }

          MainStore.db
            .GetSection3Part1(section3Part2.consTransaccion["consTransaccion"])
            .then((section3Part1: Section3Part1Model) => {
              if (!section3Part1) {
                return success();
              }

              this.formServ
                .GetParentPlace(section3Part1.ciudad["consLocalizacion"])
                .then(response => {
                  let list = response;
                  if (!list) {
                    return;
                  }
                  this.InputCountryCoin.SelectByValue(list["consPais"]);
                  let data = {
                    Label: list["descripcionCiudad"],
                    Value: list["consCiudad"]
                  };
                  this.InputCityCoin.AddItem(data);
                  this.InputCityCoin.SelectByValue(data.Value);
                  this.InputCityCoin.Valid();
                  this.InputCountryCoin.Valid();
                });

              this.InputCoin.SelectByValue(section3Part1.moneda);
              this.InputNameEntity.SetData(section3Part1.nombreEntidad);
              this.InputIdProduct.SetData(section3Part1.identificacionProducto);
              this.InputAmount.SetData(section3Part1.monto);
              this.InputTypeProduct.SelectByValue(section3Part1.tipoProducto);

              this.InputCoin.Valid();
              this.InputNameEntity.Valid();
              this.InputIdProduct.Valid();
              this.InputAmount.Valid();
              this.InputTypeProduct.Valid();
              return success();
            });
        });
    });
  }

  constructor(
    private responseUI: ResponseUiService,
    public formServ: FormService
  ) {
    super();
  }

  ngOnInit() {

  }



  ngAfterContentInit() {
    this.Load().then(() => this.IsLockSection());
    // OnBlur Valor Otros Ingresos
    this.InputOtherIncome.OnBlur = () => {
      if (this.InputOtherIncome.GetData() != null) {
        if (String(this.InputOtherIncome.GetData()) == "0") {
          this.InputOtherDetail.SetDisable(true);
          this.InputOtherIncome.SetData(null);
          this.InputOtherDetail.SetData(null);
          this.InputOtherDetail.InactivityInputRequired();
          this.InputOtherDetail.SetRequired(false);
          SAlertComponent.AlertWarning("El valor no puede ser 0, si no tiene otros ingresos no escriba nada en este campo");
        } else {
          this.InputOtherDetail.SetDisable(false);
          this.InputOtherDetail.ApplyInputRequired();
          this.InputOtherDetail.SetRequired(true);
        }

      } else {
        if (this.InputOtherDetail.GetData() != null) {
          this.InputOtherIncome.SetRequired(true);
          this.InputOtherIncome.ApplyInputRequired();
        } else {
          this.InputOtherIncome.SetRequired(false);
          this.InputOtherIncome.InactivityInputRequired();
          this.InputOtherDetail.InactivityInputRequired();
          this.InputOtherDetail.SetRequired(false);
          this.InputOtherDetail.SetDisable(true);
        }

      }


    };


    this.InputCIIU.OnBlur = () => {
      this.comodin = false;
      this.dataFieldActividad = this.FieldActividadEconomica;
      this.ArrayFieldActividad = this.dataFieldActividad.Items;
      for (let i = 0; i < this.ArrayFieldActividad.length; i++) {
        if (this.ArrayFieldActividad[i]["Value"] == this.InputCIIU.GetData()) {
          this.comodin = true;
          break;
        }
      }
      if (!this.comodin) {
        this.InputdActividadEconomica.SetData(null);
        SAlertComponent.AlertInfo(MesaggeText.NOT_FOUNC_CODIGO_CIIU);
        return;
      } else {
        this.InputdActividadEconomica.SelectByValue(this.InputCIIU.GetData());
      }

    }


    this.InputdActividadEconomica.OnBlur = () => {
      this.InputCIIU.SetData(this.InputdActividadEconomica.GetData());
    }

    this.InputOcupation.GetData() != 362 ? this.InputAportaContadorQuestion._Disable = true : this.InputAportaContadorQuestion._Disable = false;
    this.InputOcupation.OnBlur = () => {      
      if (this.InputOcupation.GetData() == 362) {
        this.InputAportaContadorQuestion._Disable = false;
        this.InputNameContador._Disable = false;
        this.InputCedulaContador._Disable = false;
        this.InputTelefonoContador._Disable = false;
        this.InputNumTarjetaContador._Disable = false;
      } else {
        this.InputAportaContadorQuestion._Disable = true;
        this.InputAportaContadorQuestion.Clear();
        this.InputNameContador._Disable = true;
        this.InputCedulaContador._Disable = true;
        this.InputTelefonoContador._Disable = true;
        this.InputNumTarjetaContador._Disable = true;
        this.InputNameContador.SetData(null);
        this.InputCedulaContador.SetData(null);
        this.InputTelefonoContador.SetData(null);
        this.InputNumTarjetaContador.SetData(null);
        this.InputNameContador.InactivityInputRequired();
        this.InputCedulaContador.InactivityInputRequired();
        this.InputTelefonoContador.InactivityInputRequired();
        this.InputNumTarjetaContador.InactivityInputRequired();

        this.InputNameContador.Skeleton.IsRequired = false;
        this.InputCedulaContador.Skeleton.IsRequired = false;
        this.InputTelefonoContador.Skeleton.IsRequired = false;
        this.InputNumTarjetaContador.Skeleton.IsRequired = false;

        this.InputNameContador._PatternMessage = null;
        this.InputCedulaContador._PatternMessage = null;
        this.InputTelefonoContador._PatternMessage = null;
        this.InputNumTarjetaContador._PatternMessage = null;
      }
    }
  }


  /**
   * @author Jose Wilson Mulato Escobar
   * @description Escucha cuando a seleccionado la pregunta Aporta carta de contador como soporte
   */
  OnSelectAportaContador() {
    let value = this.InputAportaContadorQuestion.GetData();
    let isOnlyRead = value == -Infinity ? true : false;

    this.InputNameContador.SetReadOnly(isOnlyRead);
    this.InputCedulaContador.SetReadOnly(isOnlyRead);
    this.InputTelefonoContador.SetReadOnly(isOnlyRead);
    this.InputNumTarjetaContador.SetReadOnly(isOnlyRead);

    if (value == 25) {
      this.InputNameContador.Skeleton.IsRequired = isOnlyRead;
      this.InputCedulaContador.Skeleton.IsRequired = isOnlyRead;
      this.InputTelefonoContador.Skeleton.IsRequired = isOnlyRead;
      this.InputNumTarjetaContador.Skeleton.IsRequired = isOnlyRead;
    } else if (value == 24) {
      this.InputNameContador.Skeleton.IsRequired = !isOnlyRead;
      this.InputCedulaContador.Skeleton.IsRequired = !isOnlyRead;
      this.InputTelefonoContador.Skeleton.IsRequired = !isOnlyRead;
      this.InputNumTarjetaContador.Skeleton.IsRequired = !isOnlyRead;

      this.InputNameContador.Valid();
      this.InputCedulaContador.Valid();
      this.InputTelefonoContador.Valid();
      this.InputNumTarjetaContador.Valid();
    } else {
      this.InputNameContador.Skeleton.IsRequired = !isOnlyRead;
      this.InputCedulaContador.Skeleton.IsRequired = !isOnlyRead;
      this.InputTelefonoContador.Skeleton.IsRequired = !isOnlyRead;
      this.InputNumTarjetaContador.Skeleton.IsRequired = !isOnlyRead;

      this.InputNameContador.Clear();
      this.InputCedulaContador.Clear();
      this.InputTelefonoContador.Clear();
      this.InputNumTarjetaContador.Clear();
    }
  }

  /**
   * r
   * @description bloquea los campos de la seccion
   */
  IsLockSection() {
    if (!MainStore.db.GetLockAllSectionM1().section3) {
      return;
    }
    super.IsLockSection([
      this.InputMonthlyIncome,
      this.InputMonthlyDischarge,
      this.InputOtherIncome,
      this.InputOtherDetail,
      this.InputTotalActive,
      this.InputTotalPassive,
      this.InputTypeTransation,
      this.InputNameEntity,
      this.InputTypeProduct,
      this.InputIdProduct,
      this.InputAmount,
      this.InputCoin,
      this.InputCountryCoin,
      this.InputCityCoin
    ]);
  }
}
