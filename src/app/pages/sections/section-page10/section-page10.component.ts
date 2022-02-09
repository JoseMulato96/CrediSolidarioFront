import { Component, OnInit, ViewChild } from "@angular/core";
import { ResponseEnum } from "../../../enums/ResponseEnum.enum";
import { BaseSection } from "../../../extends/base-section";
import { IFormSection } from "../../../interfaces/form-section";
import { IResponseService } from "../../../interfaces/response-service";
import { AddressesUrlParams } from "../../../parameters/addresses-url-params";
import { SInputComponent } from "../../../shared/components/s-input/s-input.component";
import {
  CheckEnum,
  CheckModel
} from "../../../shared/extends-components/bcheck-component";
import { Section10Model } from "../../../shared/models/section10-model";
import { ConfirmeStore } from "../../../store/confirme-store";
import { MainStore } from "../../../store/main-store";
import { ResponseUiService } from "../../../utils/response-ui.service";
import {
  SAutocompleteComponent,
  AutocompleteModel
} from "../../../shared/components/s-autocomplete/s-autocomplete.component";
import { SCheckComponent } from "../../../shared/components/s-check/s-check.component";
import { InputModel } from "../../../shared/extends-components/binput-component";
import { AreaTextModel } from "../../../shared/components/s-area-text/s-area-text.component";
import { regexType } from "../../../utils/regexDefault";
import { SocialNetworkStore } from "../../../store/social-network-store";
import { RelationshipStoreFa } from "../../../store/relationship-store";
import { TypeDocumentStore } from "../../../store/type-document-store";
import { Section1Model } from "../../../shared/models/section1-model";
import { SAlertComponent } from "../../../shared/components/s-alert/s-alert.component";

@Component({
  selector: "app-section-page10",
  templateUrl: "./section-page10.component.html",
  styleUrls: ["./section-page10.component.scss"]
})
export class SectionPage10Component extends BaseSection
  implements OnInit, IFormSection {
  _isValidIdRelationship: boolean = true;
  _isValidObservation: boolean = true;
  _isValidAutoTypeId: boolean = true;
  dataSection1: Section1Model;
  ngOnInit() { }
  ngAfterContentInit() {
    this.Load();


    this.InputIdRelationship.OnBlur = () => {
      this.InputIdRelationship.InactivityInputRequired();
      this._isValidIdRelationship =
        this.InputIdRelationship.GetData() && this.InputIdRelationship.Valid();

      //this.LockUnLockGroupFA(); 
      this.validTypeDocument();
      this.validNumberDocument();
    };
    this.InputObservation.OnBlur = () => {
      this.InputObservation.InactivityInputRequired();
      this._isValidObservation =
        this.InputObservation.GetData() && this.InputObservation.Valid();
    };

    this.AutoTypeId.OnBlur = () => {
      this.AutoTypeId.InactivityInputRequired();
      this._isValidAutoTypeId =
        this.AutoTypeId.GetData() && this.AutoTypeId.Valid();

      this.validTypeDocument();
      this.LockUnLockGroupFA();
    };
  }

  constructor(public responseUI: ResponseUiService) {
    super();
  }

  /**
   * @author JCesar Augusto Millan
   * @description retorna la informacion de la sectio 1
   */
  LoadSection01() {
    MainStore.db.GetSection1().then((section1: Section1Model) => {
      this.dataSection1 = section1;
      this.validNumberDocument();
      this.validTypeDocument();
    })
  }

  OnChangeGroupFamily(e) {
    if (this.InputGroupFamily.GetData() === ConfirmeStore.NOT) {
      this.InputPulldownRelationship.Clear();
      this.InputIdRelationship.Clear();
      // this.InputSocialNetwork.Clear();
      // this.InputUserSocialNetwork.Clear();
      this.AutoTypeId.Clear();

      this.InputPulldownRelationship.SetDisable(true);
      this.InputIdRelationship.SetDisable(true);
      // this.InputSocialNetwork.SetDisable(true);
      // this.InputUserSocialNetwork.SetDisable(true);
      this.AutoTypeId.SetDisable(true);

    } else {
      this.InputPulldownRelationship.SetDisable(false);
      this.InputIdRelationship.SetDisable(false);
      // this.InputSocialNetwork.SetDisable(false);
      // this.InputUserSocialNetwork.SetDisable(false);
      this.AutoTypeId.SetDisable(false);
    }
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description retorna la direccion previo
   */
  async Prev(): Promise<any> {
    return AddressesUrlParams.SECTION_ENC;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description retorna la direccion siguiente
   */
  async Next(): Promise<any> {
    return AddressesUrlParams.SECTION_UPLOAD_FILES;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description guardar la informacion en el servidor
   */
  async Save(): Promise<any> {    
    return new Promise((success, fail) => {
      MainStore.db
        .SetSection10({
          induccionCorporativa: this.InputCorporateIntroduction.GetData(),
          grupoFamiliar: this.InputGroupFamily.GetData(),
          parentescoPrincipal: this.InputIdRelationship.GetData() == null ? this.InputIdRelationship.GetData() : this.InputIdRelationship.GetData().trim(),
          observaciones: this.InputObservation.GetData(),
          consRedSocial: this.InputSocialNetwork.GetData(),
          userRedSocial: this.InputUserSocialNetwork.GetData()
          , parentesco: this.InputPulldownRelationship.GetData()
          , tipoIdentificacionPrincipal: this.AutoTypeId.GetData()
        })
        .then((response: IResponseService) => {
          this.responseUI.CheckResponseForError(response).then(() => {
            if (response.messageError != null && response.messageError != "") {
              SAlertComponent.AlertInfo(response.messageError);
            }
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
* @author John Nelson Rodríguez.
* @description Bloquea o desbloqueA el grupo de campos asociados al valoR 'FAMILIAR ASOCIADO' del campo InputLinkeCoomeva
*/
  LockUnLockGroupFA() {
    if (this.dataSection1 != undefined &&
      this.InputIdRelationship.GetData() === this.dataSection1.numeroIdentificacion &&
      this.AutoTypeId.GetData() === this.dataSection1.tipoIdentificacion) {
      this.InputPulldownRelationship.Clear();
      //this.AutoTypeId.Clear();
      super.IsLockSection(this.GetInputsFA());
    }
    else {
      super.UnLockSection(this.GetInputsFA());
    }
  }

  /**
    * @author John Nelson Rodríguez.
    * @description regresa los campos que deben ser desbloqueados en caso de que 
    * categoria de vinculación == 'FAMILIAR ASOCIADO' (126)
    */
  GetInputsFA() {
    return [
      this.InputPulldownRelationship
      //, this.AutoTypeId
    ]
  }
  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description valida que los componentes tenga informacion
   */
  async Valid(): Promise<any> {
    this.validNumberDocument();
    this.validTypeDocument();
    let valid: boolean = this.ValidFields([
      this.InputCorporateIntroduction,
      this.InputGroupFamily,
      this.AutoTypeId,
      this.InputIdRelationship
    ]);
    if (
      !this._isValidObservation &&
      String(this.InputObservation.GetData() || "").length != 0
    ) {
      valid = false;
    }

    if (
      !this._isValidIdRelationship &&
      String(this.InputIdRelationship.GetData() || "").length != 0
    ) {
      valid = false;
    }

    if (
      !this._isValidAutoTypeId &&
      String(this.AutoTypeId.GetData() || "").length != 0
    ) {
      valid = false;
    }

    return valid;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description carga los componente de la informacion traida el servidor
   */
  async Load(): Promise<any> {
    MainStore.db.GetSection10().then((section10: Section10Model) => {
      if (!section10) {
        this.LoadSection01();
        return;
      }
      this.InputCorporateIntroduction.SelectByValue(
        section10.induccionCorporativa
      );
      this.InputGroupFamily.SelectByValue(section10.grupoFamiliar);
      if (section10.grupoFamiliar == '25') {
        setTimeout(() => {
          this.InputPulldownRelationship.SetDisable(true);
        }, 100);
      }
      this.InputIdRelationship.SetData(section10.parentescoPrincipal);
      this.InputObservation.SetData(section10.observaciones);
      this.InputSocialNetwork.SelectByValue(section10.consRedSocial);
      this.InputUserSocialNetwork.SetData(section10.userRedSocial);
      this.AutoTypeId.SelectByValue(section10.tipoIdentificacionPrincipal);
      this.InputPulldownRelationship.SelectByValue(section10.parentesco);
      this.LoadSection01();
    });
  }

  validNumberDocument() {
    if (String(this.InputIdRelationship.GetData() || "").length != 0
      && String(this.AutoTypeId.GetData() || "").length <= 0) {
      this.AutoTypeId.SetRequired(true);
      this.AutoTypeId.Valid();
    }
    else {
      this.AutoTypeId.SetRequired(false);
    }
    this.LockUnLockGroupFA();
  }

  validTypeDocument() {
    if (String(this.InputIdRelationship.GetData() || "").length == 0
      && String(this.AutoTypeId.GetData() || "").length > 0) {
      this.InputIdRelationship.SetRequired(true);
      this.InputIdRelationship.Valid();
    }
    else {
      this.InputIdRelationship.SetRequired(false);
      this.InputIdRelationship.Valid();
    }
  }

  @ViewChild("InputCorporateIntroduction")
  InputCorporateIntroduction: SAutocompleteComponent;
  @ViewChild("InputGroupFamily")
  InputGroupFamily: SCheckComponent;
  @ViewChild("InputIdRelationship")
  InputIdRelationship: SInputComponent;
  @ViewChild("InputObservation")
  InputObservation: SInputComponent;
  @ViewChild("InputSocialNetwork")
  InputSocialNetwork: SAutocompleteComponent;
  @ViewChild("InputUserSocialNetwork")
  InputUserSocialNetwork: SInputComponent;

  @ViewChild("InputPulldownRelationship")
  InputPulldownRelationship: SAutocompleteComponent;
  @ViewChild("InputTypeId")
  AutoTypeId: SAutocompleteComponent;

  FieldCorporateIntroduction: CheckModel = {
    Type: CheckEnum.Radio,
    SelectValue: "VIRTUAL",
    Items: [
      {
        Label: "Presencial",
        Value: "PRESENCIAL"
      },
      {
        Label: "Virtual",
        Value: "VIRTUAL"
      }
    ],
    Label: "¿Cómo Desea Realizar La Inducción Corporativa?"
  };
  FieldGroupFamily = {
    Label: "¿Desea Pertenecer a Un Grupo Familiar?",
    Type: CheckEnum.Radio,
    Items: ConfirmeStore.GetCopyDefault(),
    SelectValue: ConfirmeStore.YES
  };
  FieldIdRelationship: InputModel = {
    Label: "Cédula Del Parentesco Principal",
    LenMax: 20,
    IsRequired: true,
    Pattern: regexType.number,
    Symbol: " "
  };
  FieldPulldownRelationship: AutocompleteModel = {
    Label: "Parentesco",
    Placeholder: "Padre",
    IsRequired: false,
    Symbol: " ",
    ItemsByStore: RelationshipStoreFa.name,
  };
  FieldTypeId: AutocompleteModel = {
    Label: "Tipo De Identificación",
    Placeholder: "Cedula",
    IsRequired: false,
    ItemsByStore: TypeDocumentStore.name,
    /* ItemsFilterByValue: [
      TypeDocumentStore.TI,
      TypeDocumentStore.CIVIL_REGISTRATION
    ] */
    //, SelectValue: TypeDocumentStore.CC
  };

  FieldObservation: AreaTextModel = {
    Label: "Observaciones",
    LenMax: 200,
    IsRequired: true,
    Symbol: " "
  };
  FieldSocialNetwork: AutocompleteModel = {
    Label: "Red Social",
    Placeholder: "Ej: twitter",
    IsRequired: false,
    ItemsByStore: SocialNetworkStore.name
  };
  FieldUserSocialNetwork: InputModel = {
    Label: "Usuario Red Social",
    Placeholder: "@Carlos",
    LenMax: 50,
    IsRequired: false,
    Symbol: " "
  };
}
