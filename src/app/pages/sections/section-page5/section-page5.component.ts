import { Component, OnInit, ViewChild } from "@angular/core";
import { ResponseEnum } from "../../../enums/ResponseEnum.enum";
import { BaseSection } from "../../../extends/base-section";
import { IFormSection } from "../../../interfaces/form-section";
import { IResponseService } from "../../../interfaces/response-service";
import { AddressesUrlParams } from "../../../parameters/addresses-url-params";
import { SAutocompleteComponent } from "../../../shared/components/s-autocomplete/s-autocomplete.component";
import { SInputComponent } from "../../../shared/components/s-input/s-input.component";
import {
  InputEnum,
  InputModel
} from "../../../shared/extends-components/binput-component";
import { ConfirmeStore } from "../../../store/confirme-store";
import { Section5Model } from "../../../shared/models/section5-model";
import { EntityBankStore } from "../../../store/entity-bank-store";
import { MainStore } from "../../../store/main-store";
import { TypeAccountStore } from "../../../store/type-account-store";
import { regexType } from "../../../utils/regexDefault";
import { ResponseUiService } from "../../../utils/response-ui.service";
import { Form } from "@angular/forms";
import {
  CheckEnum,
  CheckModel
} from "../../../shared/extends-components/bcheck-component";
import { FormService } from "../../../services/form.service";
import { DatePickerModel, SDatepickerComponent } from "../../../shared/components/s-datepicker/s-datepicker.component";
import { SCheckComponent } from '../../../shared/components/s-check/s-check.component';

@Component({
  selector: "app-section-page5",
  templateUrl: "./section-page5.component.html",
  styleUrls: ["./section-page5.component.scss"]
})
export class SectionPage5Component extends BaseSection
  implements OnInit, IFormSection {
  @ViewChild("InputTypeAccount")
  InputTypeAccount: SAutocompleteComponent;
  @ViewChild("InputListBank")
  InputListBank: SAutocompleteComponent;
  @ViewChild("InputNumAccount")
  InputNumAccount: SInputComponent;
  @ViewChild("InputDateDiligence")
  InputDateDiligence: SDatepickerComponent;
  @ViewChild("InputOrigin")
  InputOrigin: SInputComponent;
  @ViewChild("InputAuthorizationSave")
  InputAuthorizationSave: SCheckComponent;


  FieldTypeAccount = {
    Label: "Tipo de Cuenta",
    IsRequired: true,
    ItemsByStore: TypeAccountStore.name
  };
  FieldAuthorizationSaveACH = {
    Label: "Registro ACH",
    IsRequired: true,
    Type: CheckEnum.Radio,
    SelectValue: ConfirmeStore.YES,
    Items: ConfirmeStore.GetCopyDefault()
  };
  FieldNumAccount: InputModel = {
    Label: "No. de Cuenta",
    Placeholder: "Ej. 918273645",
    IsRequired: true,
    LenMax: 20,
    Pattern: regexType.number
  };
  FieldListBank = {
    Label: "Lista De Bancos",
    IsRequired: true,
    ItemsByStore: EntityBankStore.name
  };
  FieldOrigin: InputModel = {
    Label: "Declaración De Origen De Los Bienes",
    IsRequired: true,
    Placeholder: "Ej. Salario",
    LenMax: 50
  };
  FieldDateDiligence: DatePickerModel = {
    Label: "Fecha Diligenciamiento",
    IsRequired: false,
    ReadOnly: true
  };

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description retorna la direccion previo
   */
  async Prev(): Promise<any> {
    return AddressesUrlParams.SECTION_04;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description retorna la direccion siguiente
   */
  async Next(): Promise<any> {
    return AddressesUrlParams.SECTION_06;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description envia a guardar los servicio los datos
   */
  async Save(): Promise<any> {
    /// el sistema valida que la seccion esta bloqueda no guarde
    if (MainStore.db.GetLockAllSectionM1().section5) {
      return true;
    }
    return new Promise((success, fail) => {
      MainStore.db
        .SetSection5({
          numeroCuenta: this.InputNumAccount.GetData(),
          tipoCuenta: this.InputTypeAccount.GetData(),
          autorizaAch: this.InputAuthorizationSave.GetData(),
          origenBien: this.InputOrigin.GetData(),
          fechaDiligenciamiento: this.InputDateDiligence.GetData(),
          consBanco: this.InputListBank.GetData()
        })
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

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description valida los campos si es correcto la informacion o es requeridad
   */
  async Valid(): Promise<any> {
    /// el sistema valida que la seccion esta bloqueda no guarde
    if (MainStore.db.GetLockAllSectionM1().section5) {
      return true;
    }
    let valid = this.ValidFields([
      this.InputTypeAccount,
      this.InputListBank,
      this.InputNumAccount,
      this.InputDateDiligence,
      this.InputOrigin,
      this.InputAuthorizationSave
    ]);
    return valid;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description carga la informacion de los campos
   */
  async Load(): Promise<any> {
    return new Promise(success => {
      MainStore.db.GetSection5().then((section5: Section5Model) => {
        if (!section5) {
          return success();
        }
        this.InputNumAccount.SetData(section5.numeroCuenta);
        this.InputAuthorizationSave.SelectByValue(section5.autorizaAch);
        this.InputTypeAccount.SelectByValue(section5.tipoCuenta);
        this.InputOrigin.SetData(section5.origenBien);
        if (section5.fechaDiligenciamiento) {
          this.InputDateDiligence.SetData(section5.fechaDiligenciamiento);
        } else {
          this.formService.GetDateCurrent().then((result: IResponseService) => {
            this.InputDateDiligence.SetDataCurrent(result.data);
          });
        }

        this.InputDateDiligence.SetDisable(true);
        if (section5.consBanco != null) {
          this.InputListBank.SelectByValue(
            typeof section5.consBanco == "object"
              ? section5.consBanco["consEntidadFinanciera"]
              : section5.consBanco
          );
        }

        return success();
      });
    });
  }

  constructor(
    private responseUI: ResponseUiService,
    public formService: FormService
  ) {
    super();
  }

  ngOnInit() {
    this.formService.GetDateCurrent().then((result: IResponseService) => {
      this.InputDateDiligence.SetDataCurrent(result.data);
    });
  }

  ngAfterContentInit() {
    this.Load().then(() => this.IsLockSection());
  }

  OnSelectAutorizacionAch() {
    let value = this.InputAuthorizationSave.GetData();
    if (value == 25) {

      this.InputTypeAccount.Skeleton.IsRequired = false;
      this.InputListBank.Skeleton.IsRequired = false;
      this.InputNumAccount.Skeleton.IsRequired = false;
      this.InputDateDiligence.Skeleton.IsRequired = false;
      // this.InputOrigin.Skeleton.IsRequired = false;

      this.InputTypeAccount._Disable = true;
      this.InputListBank._Disable = true;
      this.InputNumAccount._Disable = true;
      this.InputDateDiligence._Disable = true;
      // this.InputOrigin._Disable = true;

      this.InputTypeAccount.Clear();
      this.InputListBank.Clear();
      this.InputNumAccount.Clear();
      this.InputDateDiligence.Clear();
      // this.InputOrigin.Clear();
    } else {
      this.InputTypeAccount.Skeleton.IsRequired = true;
      this.InputListBank.Skeleton.IsRequired = true;
      this.InputNumAccount.Skeleton.IsRequired = true;
      this.InputDateDiligence.Skeleton.IsRequired = true;
      // this.InputOrigin.Skeleton.IsRequired = true;

      this.InputTypeAccount._Disable = false;
      this.InputListBank._Disable = false;
      this.InputNumAccount._Disable = false;
      this.InputDateDiligence._Disable = false;
      // this.InputOrigin._Disable = false;
    }
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description bloquea los componentes de la seccion
   */
  IsLockSection() {
    if (!MainStore.db.GetLockAllSectionM1().section5) {
      return;
    }
    super.IsLockSection([
      this.InputTypeAccount,
      this.InputListBank,
      this.InputNumAccount,
      this.InputDateDiligence,
      this.InputOrigin
    ]);
  }
}
