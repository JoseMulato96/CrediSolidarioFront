import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseSection } from "../../../extends/base-section";
import { IFormSection } from "../../../interfaces/form-section";
import { AddressesUrlParams } from "../../../parameters/addresses-url-params";
import { SCheckComponent } from "../../../shared/components/s-check/s-check.component";
import { SInputComponent } from "../../../shared/components/s-input/s-input.component";
import { CheckEnum } from "../../../shared/extends-components/bcheck-component";
import { MainStore } from "../../../store/main-store";
import { PerseverancePlanStore } from "../../../store/perseverance-plan-store";
import { regexType } from "../../../utils/regexDefault";
import { Section4Model } from "../../../shared/models/section4-model";
import { ResponseUiService } from "../../../utils/response-ui.service";
import { IResponseService } from "../../../interfaces/response-service";
import { ResponseEnum } from "../../../enums/ResponseEnum.enum";
import { ViculacionStore } from "../../../store/viculacion-store";
import {
  SAutocompleteComponent,
  AutocompleteModel
} from "../../../shared/components/s-autocomplete/s-autocomplete.component";
import { InputModel, InputEnum } from "../../../shared/extends-components/binput-component";
import { ConfirmeStore } from "../../../store/confirme-store";
import { SAlertComponent } from "../../../shared/components/s-alert/s-alert.component";
import { MesaggeText } from "../../../shared/texts/mesagge-text";
import { FormService } from "../../../services/form.service";
import { RelationshipStoreFa } from "../../../store/relationship-store";
import { TypeDocumentStore } from "../../../store/type-document-store";
import { CatLinkEnum } from "../../../enums/CatLink";
import { CortesStore } from "../../../store/cortes-store";
import { Utils } from "../../../utils/utils";

@Component({
  selector: "app-section-page4",
  templateUrl: "./section-page4.component.html",
  styleUrls: ["./section-page4.component.scss"]
})
export class SectionPage4Component extends BaseSection
  implements OnInit, IFormSection {
  private validateCheck = false;
  _isValidIdRelationship: boolean = true;
  _validMenor64: boolean = true;

  @ViewChild("InputPlane")
  InputPlane: SCheckComponent;

  @ViewChild("InputFechaCorte")
  InputFechaCorte: SCheckComponent;

  @ViewChild("InputPlaneBasicSpecial")
  InputPlaneBasicSpecial: SInputComponent;

  @ViewChild("InputValueProtetion")
  InputValueProtetion: SInputComponent;

  @ViewChild("InputPerseverance")
  InputPerseverance: SInputComponent;

  @ViewChild("InputTemporaryDisability")
  InputTemporaryDisability: SInputComponent;

  @ViewChild("InputLinkeCoomeva")
  InputLinkeCoomeva: SAutocompleteComponent;

  @ViewChild("InputResignationFuneral")
  InputResignationFuneral: SCheckComponent;

  @ViewChild("InputContributionsPercentage")
  InputContributionsPercentage: SInputComponent;

  @ViewChild("InputIdRelationship")
  InputIdRelationship: SAutocompleteComponent;

  @ViewChild("InputNumberId")
  InputNumberId: SInputComponent;

  @ViewChild("InputTypeId")
  AutoTypeId: SAutocompleteComponent;


  FieldPlane = {
    IsRequired: true,
    Label: "Plan",
    Type: CheckEnum.Radio,
    ItemsByStore: PerseverancePlanStore.name
  };
  FieldFechaCorte = {
    IsRequired: true,
    Label: "Fecha Corte",
    Type: CheckEnum.Radio,
    ItemsByStore: CortesStore.name
  };
  FieldPlaneBasicSpecial: InputModel = {
    IsRequired: true,
    Label: "Valor Plan Básico Especial",
    Placeholder: "Ej. $500.000.000,00",
    LenMax: 15,
    Pattern: regexType.currency,
    IsCurrency: true
  };
  FieldValueProtetion: InputModel = {
    IsRequired: true,
    Label:
      "Valor Protección Muerte Natural, Accidental, Incapacidades Permanentes, Gasto Funerarios Asociado ",
    Placeholder: "Ej. $500.000.000,00",
    LenMax: 15,
    Pattern: regexType.currency,
    IsCurrency: true
  };
  FieldPerseverance: InputModel = {
    IsRequired: true,
    Label: "Perseverancia",
    Placeholder: "Ej. $500.000.000,00",
    LenMax: 15,
    Pattern: regexType.currency,
    IsCurrency: true
  };
  FieldTemporaryDisability: InputModel = {
    IsRequired: true,
    Label: "Incapacidad Temporal Por Día (a partir del día 11)",
    Placeholder: "Ej. $500.000.000,00",
    LenMax: 15,
    Pattern: regexType.currency,
    IsCurrency: true
  };

  FieldLinkeCoomeva: AutocompleteModel = {
    Label: "Forma De Vinculación a Coomeva",
    IsRequired: true,
    ItemsByStore: ViculacionStore.name,
    Tooltip: {
      Label: MesaggeText.TOOLTIP_TYPING_SEARCH
    }
  };

  FieldResignationFuneral: InputModel = {
    Type: CheckEnum.Check,
    Label: "",
    Items: [
      {
        Label: "¿Renunciar a Auxilio Funerario?",
        Value: ConfirmeStore.YES
      }
    ]
  };

  FieldContributionsPercentage: InputModel = {
    IsRequired: true,
    Label: "Aportes %",
    Placeholder: "1.4",
    Pattern: regexType.percent,
    ValueMax: 100
  };

  FieldIdRelationship: InputModel = {
    Label: "Parentesco Con El Familiar Asociado",
    LenMax: 20,
    IsRequired: false,
    //Pattern: regexType.number,
    Symbol: " ",
    ItemsByStore: RelationshipStoreFa.name
  };

  FieldTypeId: AutocompleteModel = {
    Label: "Tipo De Identificación",
    IsRequired: false,
    Placeholder: "Cedula",
    ItemsByStore: TypeDocumentStore.name,
    /* ItemsFilterByValue: [
      TypeDocumentStore.TI,
      TypeDocumentStore.CIVIL_REGISTRATION
    ] */
    //SelectValue: TypeDocumentStore.CC
  };

  FieldNumberId: InputModel = {
    Label: "Número De Identificación Del Familiar Asociado",
    IsRequired: false,
    Type: InputEnum.Text,
    Placeholder: "Ej. 123456789",
    Pattern: regexType.number,
    LenMax: 20
  };

  /**
   * r
   * @description retorna la url previo
   */
  async Prev(): Promise<any> {
    return AddressesUrlParams.SECTION_03;
  }
  /**
   * r
   * @description retorna la url siguiente
   */
  async Next(): Promise<any> {
    return AddressesUrlParams.SECTION_05;
  }
  /**
   * 
   * @description Guarda el contenido del formulario
   */
  async Save(): Promise<any> {
    /// el sistema valida que la seccion esta bloqueda no guarde
    if (MainStore.db.GetLockAllSectionM1().section4) {
      return true;
    }
    return new Promise((success, fail) => {
      MainStore.db
        .SetSection4({
          formaVinculacion: this.InputLinkeCoomeva.GetData(),
          aportes: this.InputContributionsPercentage.GetData(),
          renunciaAuxFunerario:
            this.InputResignationFuneral.GetData() == ConfirmeStore.YES ? 0 : 1,
          plan: { prodCodigo: this.InputPlane.GetData() },
          fechaCorte: this.InputFechaCorte.GetData(),
          valorPlan: this.InputPlaneBasicSpecial.GetData(),
          valorProteccion: this.InputValueProtetion.GetData(),
          perseverancia: this.InputPerseverance.GetData(),
          incapacidadTemporal: this.InputTemporaryDisability.GetData(),
          idPromotor: MainStore.db.GetUser().idPromotor,
          numIdentificatcionAsociadoFamiliar: this.InputNumberId.GetData(),
          tipoIdentificacionAsociadoFamiliar: this.AutoTypeId.GetData(),
          parentescoAsociadoFamiliar: this.InputIdRelationship.GetData()
          /* numIdentificationMemberFamily: this.InputNumberId.GetData(),
          IdentificationType: this.AutoTypeId.GetData(),
          familyRelationShip: this.InputIdRelationship.GetData() */
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
   * r
   * @description valida los componente este correctos
   */
  async Valid(): Promise<any> {
    /// el sistema valida que la seccion esta bloqueda no guarde     
    if (this.InputFechaCorte.GetData() == "" || this.InputFechaCorte.GetData() == undefined) {
      return;
    }
    
    if (this._validMenor64) {
      if (this.InputPlane.GetData() == "" || this.InputPlane.GetData() == undefined) {
        return;
      }
    }
    if (MainStore.db.GetLockAllSectionM1().section4) {

      return true;
    }
    let valid: boolean = this.ValidFields(this.GetDefaultInputLock())
      && (
        this.IsInputLinkeCoomevaFA() ?
          this.ValidFields(this.GetInputsFA())
          : true
      );
    return valid;
  }

  /**
   * r
   * @description carga los datos previos
   */
  async Load(): Promise<any> {
    this.blockedCampos();
    return new Promise(success => {
      MainStore.db.GetSection4().then((section4: Section4Model) => {
        if (!section4) {
          return success();
        }
        this.InputLinkeCoomeva.SelectByValue(
          section4.formaVinculacion["consCategoria"]
        );
        this.InputPlane.SelectByValue(section4.plan.prodCodigo);
        this.InputFechaCorte.SelectByValue(section4.fechaCorte);
        this.InputPlaneBasicSpecial.SetData(section4.valorPlan);
        if (section4.renunciaAuxFunerario == 0) {
          this.validateCheck = true;
        }
        this.InputResignationFuneral.SelectByValue(
          section4.renunciaAuxFunerario == 0
            ? ConfirmeStore.YES
            : ConfirmeStore.NOT
        );
        this.InputContributionsPercentage.SetData(section4.aportes);
        this.InputValueProtetion.SetData(section4.valorProteccion);
        this.InputPerseverance.SetData(section4.perseverancia);
        this.InputTemporaryDisability.SetData(section4.incapacidadTemporal);

        this.InputNumberId.SetData(section4.numIdentificatcionAsociadoFamiliar);
        this.InputIdRelationship.SelectByValue(section4.parentescoAsociadoFamiliar);
        this.AutoTypeId.SelectByValue(section4.tipoIdentificacionAsociadoFamiliar);
        /* this.InputIdRelationship.SetData(section4.familyRelationShip);
        this.InputNumberId.SetData(section4.numIdentificationMemberFamily);
        this.AutoTypeId.SetData(section4.IdentificationType); */
        this.blockedCampos();
        return success();
      });
    });
  }

  /**
   * r
   * @description muestra una alerta si renuncia al auxilio funerario
   * @param e
   */
  OnResignationFuneral(e) {
    if (
      this.InputResignationFuneral.GetData() == ConfirmeStore.YES &&
      !this.validateCheck
    ) {
      SAlertComponent.AlertWarning(MesaggeText.TEXT_RESIGNATION_FUNERAL);
    }
    this.validateCheck = false;
  }

  constructor(
    private responseUI: ResponseUiService,
    private param: FormService
  ) {
    super();
  }

  ngOnInit() { }

  ngAfterContentInit() {
    this.Load().then(() => { this.IsLockSection(); this.LockUnLockGroupFA() });

  }

  blockedCampos() {
    if (MainStore.db.GetFecNacimiento() != null) {
      let edad = Utils.CalculateAge(new Date(MainStore.db.GetFecNacimiento()));
      if (edad > 64) {
        //Campo Renuncia auxilio
        this.FieldResignationFuneral.IsRequired = false;
        this.InputResignationFuneral.SetDisable(true);
        this.FieldResignationFuneral.IsRequired = false;

        //Campo  plan         
        this._validMenor64 = false;
        this.FieldPlane.IsRequired = false;
        this.InputPlane.SetDisable(true);
        this.FieldPlane.IsRequired = false;

        //Campo Valor plan básico especial
        this.InputPlaneBasicSpecial.SetData(null);
        this.InputPlaneBasicSpecial.InactivityInputRequired();
        this.InputPlaneBasicSpecial.SetRequired(false);
        this.InputPlaneBasicSpecial.SetDisable(true);
        this.FieldPlaneBasicSpecial.Disable = true;
        this.FieldPlaneBasicSpecial.IsRequired = false;

        //Campo Valor protección muerte natural, accidental, incapacidades permanentes, gasto funerarios asociado

        this.InputValueProtetion.SetData(null);
        this.InputValueProtetion.InactivityInputRequired();
        this.InputValueProtetion.SetRequired(false);
        this.InputValueProtetion.SetDisable(true);
        this.FieldValueProtetion.Disable = true;
        this.FieldValueProtetion.IsRequired = false;

        //Campo Perseverancia
        this.InputPerseverance.SetData(null);
        this.InputPerseverance.InactivityInputRequired();
        this.InputPerseverance.SetRequired(false);
        this.InputPerseverance.SetDisable(true);
        this.FieldPerseverance.Disable = true;
        this.FieldPerseverance.IsRequired = false;
        

        //Campo Incapacidad temporal por día (a partir del dia 11)
        this.InputTemporaryDisability.SetData(null);
        this.InputTemporaryDisability.InactivityInputRequired();
        this.InputTemporaryDisability.SetRequired(false);
        this.InputTemporaryDisability.SetDisable(true);
        this.FieldTemporaryDisability.Disable = true;
        this.FieldTemporaryDisability.IsRequired = false;
      }
    }
  }

  /**
   * r
   * @description bloquea los componentes de la seccion
   */
  IsLockSection() {
    super.IsLockSection(this.GetInputsFA());
    if (!MainStore.db.GetLockAllSectionM1().section4) {
      return;
    }
    super.IsLockSection(this.GetDefaultInputLock());
  }

  GetValueMin() {
    if (this.InputLinkeCoomeva.GetData() !== undefined) {
      console.log(this.InputLinkeCoomeva.GetData());
      this.LockUnLockGroupFA();
      this.param
        .GetPorcentajeViculado(this.InputLinkeCoomeva.GetData())
        .then((result: IResponseService) => {
          this.InputContributionsPercentage.SetData(
            result.data["porcentajeMin"]
          );
        });
    } else {
      this.InputContributionsPercentage.SetData(undefined);
    }
  }

  /**
  * @author John Nelson Rodríguez.
  * @description regresa los campos que deben se bloqueados
  */
  GetDefaultInputLock() {
    return [
      this.InputPlane,
      this.InputFechaCorte,
      this.InputPlaneBasicSpecial,
      this.InputValueProtetion,
      this.InputPerseverance,
      this.InputTemporaryDisability,
      this.InputLinkeCoomeva,
      this.InputResignationFuneral,
      this.InputContributionsPercentage
    ]
  }

  /**
  * @author John Nelson Rodríguez.
  * @description regresa los campos que deben ser desbloqueados en caso de que 
  * categoria de vinculación == 'FAMILIAR ASOCIADO' (126)
  */
  GetInputsFA() {
    return [
      this.InputIdRelationship,
      this.InputNumberId,
      this.AutoTypeId
    ]
  }

  /**
 * @author John Nelson Rodríguez.
 * @description Si InputLinkeCoomeva.value == 'FAMILIAR ASOCIADO' (126) o 'FAMILIAR ASOCIADO FALLECIDO' (888)
 */
  IsInputLinkeCoomevaFA(): boolean {

    return (this.InputLinkeCoomeva.GetData() === CatLinkEnum.FAMILIAR_ASOCIADO
      || this.InputLinkeCoomeva.GetData() === CatLinkEnum.FAMILIAR_ASOCIADO_FALLECIDO);
  }

  /**
 * @author John Nelson Rodríguez.
 * @description Bloquea o desbloqueA el grupo de campos asociados al valoR 'FAMILIAR ASOCIADO' del campo InputLinkeCoomeva
 */
  LockUnLockGroupFA() {

    if (this.IsInputLinkeCoomevaFA()) {
      super.UnLockSection(this.GetInputsFA());
      this.FieldIdRelationship.IsRequired =
        this.FieldTypeId.IsRequired =
        this.FieldNumberId.IsRequired = true;
    }
    else {
      super.IsLockSection(this.GetInputsFA());
      this.FieldIdRelationship.IsRequired =
        this.FieldTypeId.IsRequired =
        this.FieldNumberId.IsRequired = false;
      this.InputIdRelationship.Clear();
      this.InputNumberId.Clear();
      this.AutoTypeId.Clear();
    }

  }
}