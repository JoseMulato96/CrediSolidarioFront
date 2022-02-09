import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { BaseSection } from "../../../extends/base-section";
import { IFormSection } from "../../../interfaces/form-section";
import { AddressesUrlParams } from "../../../parameters/addresses-url-params";
import { SInputComponent } from "../../../shared/components/s-input/s-input.component";
import {
  CheckEnum,
  CheckModel
} from "../../../shared/extends-components/bcheck-component";
import {
  InputEnum,
  InputModel
} from "../../../shared/extends-components/binput-component";
import { Section8Model } from "../../../shared/models/section8-model";
import { ConfirmeStore } from "../../../store/confirme-store";
import { MainStore } from "../../../store/main-store";
import { ResponseUiService } from "../../../utils/response-ui.service";
import { IResponseService } from "../../../interfaces/response-service";
import { ResponseEnum } from "../../../enums/ResponseEnum.enum";
import { regexType } from "../../../utils/regexDefault";
import { SCheckComponent } from "../../../shared/components/s-check/s-check.component";
import {
  DatePickerModel,
  SDatepickerComponent,
  DatePickerBehaviorEnum
} from "../../../shared/components/s-datepicker/s-datepicker.component";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-section-page8",
  templateUrl: "./section-page8.component.html",
  styleUrls: ["./section-page8.component.scss"]
})
export class SectionPage8Component extends BaseSection
  implements OnInit, IFormSection {
  constructor(public responseUI: ResponseUiService) {
    super();
  }
  ngOnInit() { }
  ngAfterContentInit() {
    this.Load();
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description escucha el componenten si es afirmativo cuando fuma para habilitar o desabilitar la opciones
   */
  _OnChamgeSmokes() {
    let valid: boolean = this.InputSmokes.GetData() == ConfirmeStore.YES;

    this.InputSmokesTime.Clear();

    this.FieldSmokesHowMuch.ReadOnly = !valid;
    this.InputSmokesTime.SetDisable(!valid);
    this.FieldSinceWhen.ReadOnly = !valid;

    this.FieldSmokesHowMuch.Data = "";
    this.FieldSinceWhen.Data = "";

    this.FieldSmokesHowMuch.IsRequired = valid;
    this.FieldSmokesTime.IsRequired = valid;
    this.FieldSinceWhen.IsRequired = valid;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description escucha el componente si una de las respuesta es afirmativa se habilita los componente diagnostico, fecha y secuelas
   */
  _OnChamgeState() {
    let valid: boolean = this._ValidateByDiagnostico();
    if (valid) {
      this.FieldDiagnostico["Data"] = this.FieldDiagnostico.Data;
      this.FieldDiagnostico.ReadOnly = false;
      this.FieldDiagnostico.IsRequired = true;

      this.FieldDateDiagnostico["Data"] = this.FieldDateDiagnostico.Data;
      this.FieldDateDiagnostico.ReadOnly = false;
      this.FieldDateDiagnostico.IsRequired = true;
      this.InputDateDiagnostico.SetDisable(false);

      this.FieldAftermath["Data"] = this.FieldAftermath.Data;
      this.FieldAftermath.ReadOnly = false;
      this.FieldAftermath.IsRequired = true;
    } else {
      this.FieldDiagnostico.Data = "";
      this.FieldDiagnostico.ReadOnly = true;
      this.FieldDiagnostico.IsRequired = false;

      this.FieldDateDiagnostico.Data = "";
      this.FieldDateDiagnostico.ReadOnly = true;
      this.FieldDateDiagnostico.IsRequired = false;
      this.InputDateDiagnostico.SetDisable(true);

      this.FieldAftermath.Data = "";
      this.FieldAftermath.ReadOnly = true;
      this.FieldAftermath.IsRequired = false;
    }
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Valida si el diagnostico es afirmativo o negativo las preguntas
   */
  _ValidateByDiagnostico(): boolean {
    let valid: boolean = false;
    valid = valid || this.InputDisease.GetData() == ConfirmeStore.YES;
    valid = valid || this.InputDiseaseSurgery.GetData() == ConfirmeStore.YES;
    valid = valid || this.InputPregnancy.GetData() == ConfirmeStore.YES;
    valid = valid || this.InputAbortion.GetData() == ConfirmeStore.YES;
    return valid;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description retorna la direccion previo
   */
  async Prev(): Promise<any> {
    return AddressesUrlParams.SECTION_07;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description retorna la direccion siguiente
   */
  async Next(): Promise<any> {
    return AddressesUrlParams.SECTION_09;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description enviar a guardar la informacion de los componentes
   */
  async Save(): Promise<any> {
    let valid = this._ValidateByDiagnostico();
    return new Promise((success, fail) => {
      MainStore.db
        .SetSection8({
          nombreEps: this.InputNameEPS.GetData(),
          estatura: this.InputHeight.GetData(),
          peso: this.InputWeight.GetData(),
          enfermedadesPregunta1: this.InputDisease.GetData(),
          enfermedadesPregunta2: this.InputDiseaseSurgery.GetData(),
          embarazoPregunta3: this.InputPregnancy.GetData(),
          partosCesareaPregunta4: this.InputAbortion.GetData(),
          diagnostico: valid ? this.InputDiagnostico.GetData() : "",
          fechaDiagnostico: valid ? this.InputDateDiagnostico.GetData() : null,
          secuela: valid ? this.InputAftermath.GetData() : "",
          fumaPregunta5: this.InputSmokes.GetData(),
          frecuencia: this.InputSmokesTime.GetData(),
          cuantos: this.InputSmokesHowMuch.GetData(),
          desdeCuando: this.InputSinceWhen.GetData(),
          bebidasPregunta6: this.InputAlcoholic.GetData()
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
   * @description Valida el contido de la informacion del componente
   */
  async Valid(): Promise<any> {
    let valid: boolean = this.ValidFields([
      this.InputNameEPS,
      this.InputHeight,
      this.InputWeight,
      this.InputDisease,
      this.InputDiseaseSurgery,
      this.InputPregnancy,
      this.InputAbortion,
      this.InputDiagnostico,
      this.InputDateDiagnostico,
      this.InputAftermath,
      this.InputSmokes,
      this.InputSmokesTime,
      this.InputSmokesHowMuch,
      this.InputSinceWhen,
      this.InputAlcoholic
    ]);

    return valid;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description carga la informaicon de los componentes
   */
  async Load(): Promise<any> {
    MainStore.db.GetSection8().then((section8: Section8Model) => {
      if (!section8) {
        return;
      }
      this.InputNameEPS.SetData(section8.nombreEps);
      this.InputHeight.SetData(section8.estatura);
      this.InputWeight.SetData(section8.peso);
      this.InputDisease.SelectByValue(section8.enfermedadesPregunta1);
      this.InputDiseaseSurgery.SelectByValue(section8.enfermedadesPregunta2);
      this.InputPregnancy.SelectByValue(section8.embarazoPregunta3);
      this.InputAbortion.SelectByValue(section8.partosCesareaPregunta4);
      this.InputDiagnostico.SetData(section8.diagnostico);
      this.InputDateDiagnostico.SetData(section8.fechaDiagnostico);
      this.InputAftermath.SetData(section8.secuela);
      this.InputSmokes.SelectByValue(section8.fumaPregunta5);
      this._OnChamgeSmokes();
      this.InputSmokesTime.SelectByValue(section8.frecuencia);
      this.InputSmokesHowMuch.SetData(section8.cuantos);
      this.InputSinceWhen.SetData(section8.desdeCuando);
      this.InputAlcoholic.SelectByValue(section8.bebidasPregunta6);
    });
  }

  @ViewChild("InputNameEPS")
  InputNameEPS: SInputComponent;
  @ViewChild("InputHeight")
  InputHeight: SInputComponent;
  @ViewChild("InputWeight")
  InputWeight: SInputComponent;
  @ViewChild("InputDisease")
  InputDisease: SCheckComponent;
  @ViewChild("InputDiseaseSurgery")
  InputDiseaseSurgery: SCheckComponent;
  @ViewChild("InputPregnancy")
  InputPregnancy: SCheckComponent;
  @ViewChild("InputAbortion")
  InputAbortion: SCheckComponent;
  @ViewChild("InputDiagnostico")
  InputDiagnostico: SInputComponent;
  @ViewChild("InputDateDiagnostico")
  InputDateDiagnostico: SDatepickerComponent;
  @ViewChild("InputAftermath")
  InputAftermath: SInputComponent;
  @ViewChild("InputSmokes")
  InputSmokes: SCheckComponent;
  @ViewChild("InputSmokesTime")
  InputSmokesTime: SCheckComponent;
  @ViewChild("InputSmokesHowMuch")
  InputSmokesHowMuch: SInputComponent;
  @ViewChild("InputSinceWhen")
  InputSinceWhen: SInputComponent;
  @ViewChild("InputAlcoholic")
  InputAlcoholic: SCheckComponent;

  FieldNameEPS: InputModel = {
    Label: "Nombre De La EPS",
    Placeholder: "Ej. Coomeva",
    LenMax: 100,
    IsRequired: true
  };

  FieldHeight: InputModel = {
    Label: "Estatura m",
    Placeholder: "Ej. 1,60",
    IsRequired: true,
    LenMax: 4,
    ValueMin: 1,
    Pattern: regexType.heightperson
  };

  FieldWeight: InputModel = {
    Label: "Peso",
    Placeholder: "Ej. 65",
    IsRequired: true,
    LenMax: 6,
    ValueMin: 1,
    Pattern: regexType.weightperson
  };

  FieldDisease = {
    Question: "Pregunta 1",
    Type: CheckEnum.Radio,
    Items: ConfirmeStore.GetCopyDefault(),
    SelectValue: ConfirmeStore.NOT,
    Label: `¿Tiene, ha tenido, le han diagnosticado o ha sido intervenido por:
    Enfermedades Cardiovasculares, Hipertensión Arterial, Infarto de Miocardio, Arritmias, Colesterol o Triglicéridos Altos (Tratados o no con Medicamentos), Enfermedades Neurológicas: Derrames, Isquemias o Trombosis Cerebral, Mareos o Desmayos, Convulsiones, Parálisis; Enfermedades de los Órganos: Ceguera o Sordera Total y/o Parcial;    Enfermedades del Sistema Endocrino: La Glándula Tiroides, Diabetes; Enfermedades Respiratorias: Enfisema Pulmonar, Bronquitis Crónica; Enfermedades Osteomuscular: Artritis o Lesiones Musculares; Enfermedades del Sistema Digestivo: Gastritis, Úlcera, Hepatitis B o C; Cirrosis; Enfermedades del Sistema Circulatorio: Várices, Enfermedades Genitourinarias (Ovarios, Útero, Próstata, Testículos, Deformidades Corporales, Tumores Quistes); Enfermedades: Trastornos Psicológicos o Psiquiátricos; Insuficiencia Renal, Cáncer, Leucemia; Lupus, Sida o VIH Positivo u otras enfermedades no mencionadas anteriormente?`
  };

  FieldDiseaseSurgery = {
    Question: "Pregunta 2",
    Type: CheckEnum.Radio,
    Items: ConfirmeStore.GetCopyDefault(),
    SelectValue: ConfirmeStore.NOT,
    Label:
      "¿Ha tenido enfermedades diferentes a las enunciadas en el numeral anterior, piensa someterse o tiene pendiente algún tratamiento médico o tiene programada una intervención quirúrgica en los próximos seis (6) meses?"
  };

  FieldPregnancy = {
    Question: "Pregunta 3",
    Type: CheckEnum.Radio,
    Items: ConfirmeStore.GetCopyDefault(),
    SelectValue: ConfirmeStore.NOT,
    Label: "¿Si ha tenido embarazo, ha presentado complicaciones?"
  };

  FieldAbortion = {
    Question: "Pregunta 4",
    Type: CheckEnum.Radio,
    Items: ConfirmeStore.GetCopyDefault(),
    SelectValue: ConfirmeStore.NOT,
    Label: "¿Ha tenido partos por cesárea?"
  };

  FieldDiagnostico: InputModel = { Label: "Diagnóstico", LenMax: 250 };
  FieldDateDiagnostico: DatePickerModel = {
    Label: "Fecha de Diagnóstico",
    Behavior: DatePickerBehaviorEnum.DateMaxCurrent
  };
  FieldAftermath: InputModel = { Label: "Secuelas", LenMax: 250 };
  FieldSmokes = {
    Question: "Pregunta 5",
    Label: "¿Fuma?",
    Type: CheckEnum.Radio,
    Items: ConfirmeStore.GetCopyDefault(),
    SelectValue: ConfirmeStore.NOT
  };
  FieldSmokesTime: CheckModel = {
    Label: "Frecuencia",
    Type: CheckEnum.Radio,
    Items: [
      { Label: "Semana", Value: "semana" },
      { Label: "Ocasional", Value: "ocasional" },
      { Label: "Diaria", Value: "diaria" }
    ]
  };
  FieldSmokesHowMuch: InputModel = {
    Label: "Cuanto",
    Placeholder: "Ej. 3",
    LenMax: 2,
    Pattern: regexType.number
  };
  FieldSinceWhen: InputModel = {
    Label: "Desde Cuando",
    Placeholder: "Ej. 1992",
    LenMax: 4,
    Pattern: regexType.number
  };
  FieldAlcoholic: CheckModel = {
    Question: "Pregunta 6",
    Type: CheckEnum.Radio,
    Items: ConfirmeStore.GetCopyDefault(),
    SelectValue: ConfirmeStore.NOT,
    Label: "¿Consumen bebidas embriagantes diariamente?"
  };
}
