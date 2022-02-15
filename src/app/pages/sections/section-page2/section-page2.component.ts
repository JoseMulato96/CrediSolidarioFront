import { Component, OnInit, ViewChild } from "@angular/core";
import { ResponseEnum } from "../../../enums/ResponseEnum.enum";
import { BaseSection } from "../../../extends/base-section";
import { IFormSection } from "../../../interfaces/form-section";
import { IResponseService } from "../../../interfaces/response-service";
import { AddressesUrlParams } from "../../../parameters/addresses-url-params";
import { AutocompleteModel, SAutocompleteComponent } from "../../../shared/components/s-autocomplete/s-autocomplete.component";
import { SCheckComponent } from "../../../shared/components/s-check/s-check.component";
import { DatePickerModel, SDatepickerComponent } from "../../../shared/components/s-datepicker/s-datepicker.component";
import { CheckEnum, CheckModel } from "../../../shared/extends-components/bcheck-component";
import { Section2Model } from "../../../shared/models/section2-model";
import { ChargesPublicStore } from "../../../store/charges-public-store";
import { ConfirmeStore } from "../../../store/confirme-store";
import { MainStore } from "../../../store/main-store";
import { ResponseUiService } from "../../../utils/response-ui.service";

@Component({
  selector: "app-section-page2",
  templateUrl: "./section-page2.component.html",
  styleUrls: ["./section-page2.component.scss"]
})
export class SectionPage2Component extends BaseSection
  implements OnInit, IFormSection {
  @ViewChild("InputOneQuestion")
  InputOneQuestion: SCheckComponent;
  @ViewChild("InputSecondQuestion")
  InputSecondQuestion: SCheckComponent;
  @ViewChild("InputThirdQuestion")
  InputThirdQuestion: SCheckComponent;
  @ViewChild("InputQuarterQuestion")
  InputQuarterQuestion: SCheckComponent;
  @ViewChild("InputWhatPoliticCharge")
  InputWhatPoliticCharge: SAutocompleteComponent;
  @ViewChild("InputDateInit")
  InputDateInit: SDatepickerComponent;
  @ViewChild("InputDateEnd")
  InputDateEnd: SDatepickerComponent;
  @ViewChild("InputCurrent")
  InputCurrent: SCheckComponent;

  FieldWhatPoliticCharge: AutocompleteModel = {
    Label: "¿Cuál cargo público?",
    IsRequired: true,
    Placeholder: "Ej. Presidente",
    LenMax: 10,
    ItemsByStore: ChargesPublicStore.name
  };

  FieldDateInit: DatePickerModel = {
    IsRequired: true,
    Label: "Fecha Inicio",
  };

  FieldDateEnd: DatePickerModel = {
    Label: "Fecha Fin"
  };

  FieldCurrent: CheckModel = {
    Type: CheckEnum.Check,
    Label: "",
    Items: [
      {
        Label: "Actualmente",
        Value: ConfirmeStore.YES
      }
    ]
  };

  FieldOneQuestion = {
    IsRequired: true,
    Question: "Pregunta 1.",
    Label:
      "¿Representa legalmente una organización internacional?",
    SelectValue: ConfirmeStore.NOT,
    Items: ConfirmeStore.GetCopyDefault()
  };

  FieldSecondQuestion = {
    IsRequired: true,
    Question: "Pregunta 2.",
    Label: "¿Desempeña un cargo político?",
    SelectValue: ConfirmeStore.NOT,
    Items: ConfirmeStore.GetCopyDefault()
  };

  FieldThirdQuestion = {
    IsRequired: true,
    Question: "Pregunta 3.",
    Label: "¿La sociedad y/o medios de comunicación lo reconocen como un personaje público?",
    SelectValue: ConfirmeStore.NOT,
    Items: ConfirmeStore.GetCopyDefault()
  };


  FieldQuarterQuestion = {
    IsRequired: true,
    Question: "Pregunta 4.",
    Label: "¿Tiene algún vínculo con una persona de estas características (padres, hijos, cónyuge, abuelos, hermanos, suegros y cuñados)?",
    SelectValue: ConfirmeStore.NOT,
    Items: ConfirmeStore.GetCopyDefault()
  };

  constructor(private responseUI: ResponseUiService) {
    super();
  }

  ngOnInit() { }

  ngAfterContentInit() {
    this.Load().then(x => this.IsLockSection());
  }

  IsLockSection() {
    if (!MainStore.db.GetLockAllSectionM1().section2) {
      return;
    }
    super.IsLockSection([
      this.InputOneQuestion,
      this.InputSecondQuestion,
      this.InputThirdQuestion,
      this.InputQuarterQuestion,
      this.InputWhatPoliticCharge,
      this.InputDateInit,
      this.InputDateEnd,
      this.InputCurrent
    ]);
  }

  _OnChangeCurrent(item) {
    if (item["_Select"]) {
      this.FieldDateEnd.IsRequired = false;
      this.FieldDateEnd.Data = undefined;
      this.InputDateEnd.SetDisable(true);
    } else {
      this.FieldDateEnd.IsRequired = true;
      this.InputDateEnd.SetDisable(false);
    }
  }

  _OnChangeState($event) {
    if (this.InputSecondQuestion.GetData() == ConfirmeStore.YES) {
      this.FieldWhatPoliticCharge.IsRequired = true;
      this.FieldDateInit.IsRequired = true;
      this.InputWhatPoliticCharge.SetDisable(false);
      this.InputDateInit.SetDisable(false);
      this.InputCurrent.SetDisable(false);
      this.InputDateEnd.SetDisable(false);
      this.FieldDateEnd.IsRequired = !(
        this.InputCurrent.GetData() == ConfirmeStore.YES
      );
      this.InputCurrent._Values = [];
    } else {
      this.FieldWhatPoliticCharge.IsRequired = false;
      this.FieldDateInit.IsRequired = false;
      this.FieldDateEnd.IsRequired = false;
      this.InputWhatPoliticCharge.Clear();
      this.InputWhatPoliticCharge.SetDisable(true);
      this.InputDateInit.Clear();
      this.InputDateInit.SetDisable(true);
      this.InputDateEnd.Clear();
      this.InputDateEnd.SetDisable(true);
      this.InputCurrent.SetDisable(true);
    }
  }

  /**
   * r
   * @description retorna la url anterior
   */
  async Prev(): Promise<any> {
    return AddressesUrlParams.SECTION_01;
  }

  /**
   * r
   * @description retorna la url siguiente
   */
  async Next(): Promise<any> {
    return AddressesUrlParams.SECTION_03;
  }

  /**
   * r
   * @description Envia al servidor a guardar
   */
  async Save(): Promise<any> {
    /// el sistema valida que la seccion esta bloqueda no guarde
    if (MainStore.db.GetLockAllSectionM1().section2) {
      return true;
    }
    return new Promise((success, fail) => {
      MainStore.db
        .SetSection2({
          orgInternPregunta1: this.InputOneQuestion.GetData(),
          cargoPoliPregunta2: this.InputSecondQuestion.GetData(),
          orgInternPregunta3: this.InputThirdQuestion.GetData(),
          orgInternPregunta4: this.InputQuarterQuestion.GetData(),
          descCargoPublico: this.InputWhatPoliticCharge.GetData(),
          fechaFin:
            this.InputCurrent.GetData() == ConfirmeStore.YES
              ? undefined
              : this.InputDateEnd.GetData(),
          fechaInicio: this.InputDateInit.GetData(),
          actualmente:
            this.InputCurrent.GetData() == ConfirmeStore.YES
              ? ConfirmeStore.YES
              : ConfirmeStore.NOT
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
   * @description retorna si son valido los campos y completa formulario
   */
  async Valid(): Promise<any> {
    /// el sistema valida que la seccion esta bloqueda no guarde
    if (MainStore.db.GetLockAllSectionM1().section2) {
      return true;
    }
    let isValid = this.ValidFields([
      this.InputOneQuestion,
      this.InputSecondQuestion,
      this.InputThirdQuestion,
      this.InputQuarterQuestion,
      this.InputWhatPoliticCharge,
      this.InputDateInit,
      this.InputDateEnd,
      this.InputCurrent
    ]);
    return isValid;
  }
  async Load(): Promise<any> {
    return new Promise((success, fail) => {
      MainStore.db.GetSection2().then((section2: Section2Model) => {        
        if (!section2) {
          return success();
        }
        this.InputOneQuestion.SelectByValue(section2.orgInternPregunta1);
        this.InputSecondQuestion.SelectByValue(section2.cargoPoliPregunta2);
        this.InputThirdQuestion.SelectByValue(section2.orgInternPregunta3);
        this.InputQuarterQuestion.SelectByValue(section2.orgInternPregunta4);
        this.InputWhatPoliticCharge.SelectByValue(section2.descCargoPublico);
        this.InputDateInit.SetData(section2.fechaInicio);
        this.InputDateEnd.SetData(section2.fechaFin);
        this.InputCurrent.SelectByValue(section2.actualmente);
        return success();
      });
    });
  }
}
