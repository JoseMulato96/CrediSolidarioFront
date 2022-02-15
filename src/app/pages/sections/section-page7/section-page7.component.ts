import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ResponseEnum } from "../../../enums/ResponseEnum.enum";
import { BaseSection } from "../../../extends/base-section";
import { IFormSection } from "../../../interfaces/form-section";
import { IResponseService } from "../../../interfaces/response-service";
import { AddressesUrlParams } from "../../../parameters/addresses-url-params";
import { FormService } from "../../../services/form.service";
import {
  AutocompleteModel,
  SAutocompleteComponent
} from "../../../shared/components/s-autocomplete/s-autocomplete.component";
import { SCheckComponent } from "../../../shared/components/s-check/s-check.component";
import { SInputComponent } from "../../../shared/components/s-input/s-input.component";
import { CheckEnum } from "../../../shared/extends-components/bcheck-component";
import {
  InputEnum,
  InputModel
} from "../../../shared/extends-components/binput-component";
import { Section7Model } from "../../../shared/models/section7-model";
import { AcademicLevelStore } from "../../../store/academic-level-store";
import { ConfirmeStore } from "../../../store/confirme-store";
import { InstitutionsStore } from "../../../store/institutions-store";
import { MainStore } from "../../../store/main-store";
import { TitlesStore } from "../../../store/titles-store";
import { TypeContractStore } from "../../../store/type-contract-store";
import { regexType } from "../../../utils/regexDefault";
import { ResponseUiService } from "../../../utils/response-ui.service";
import { MesaggeText } from "../../../shared/texts/mesagge-text";
import { DatePickerModel } from "../../../shared/components/s-datepicker/s-datepicker.component";
import { ZeroPaperModel } from "../../../shared/models/zero-paper-model";
import { CatLinkEnum } from "../../../enums/CatLink";
import { LevelAcademicEnum } from "../../../enums/LevelAcademicLink";
import { Section4Model } from "../../../shared/models/section4-model";
import { SAlertComponent } from "../../../shared/components/s-alert/s-alert.component";
import { NotificationService } from "../../../services/notification.service";
import { ListOfStore } from "../../../store/list-of-store";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-section-page7",
  templateUrl: "./section-page7.component.html",
  styleUrls: ["./section-page7.component.scss"]
})
export class SectionPage7Component extends BaseSection
  implements OnInit, IFormSection {

  maxRangeDate: number;
  minRangeDate: number;
  dataSection4: Section4Model;

  constructor(
    public responseUI: ResponseUiService,
    public formServ: FormService,
    private notyService: NotificationService
  ) {
    super();
  }

  ngOnInit() {
    this.getRageDate();
  }

  ngAfterContentInit() {
    MainStore.db.GetSection4().then((section4: Section4Model) => {
      this.dataSection4 = section4;      
      this.AutoCompleteFieldNameInstituteRequired();
      this.Load();
      this.InputDateDegreeRequired();      
      this.FieldLevelAcademin.IsRequired=true;      
    });
    setTimeout(() => {         
      this.ModifyElementsLevelAcademic(this.dataSection4.formaVinculacion['consCategoria']);
    }, 2000);
  }

  /**
   * r
   * @description retorna la direccion previo
   */
  async Prev(): Promise<any> {
    return AddressesUrlParams.SECTION_06;
  }

  /**
   * r
   * @description retorna la direccion siguiente
   */
  async Next(): Promise<any> {
    return AddressesUrlParams.SECTION_08;
  }

  /**
   * r
   * @description enviar informacion de los componente a al seridor
   */
  async Save(): Promise<any> {
    return new Promise((success, fail) => {
      MainStore.db
        .SetSection7({
          ninosACargo: this.InputDependentsChildren.GetData(),
          adultosACargo: this.InputDependentsOld.GetData(),
          nivelAcademico: this.InputLevelAcademin.GetData(),
          titulo: this.InputDegree.GetData(),
          institucion: this.SetNingunoInstitutionAcademi(this.InputNameInstitute.GetData()),
          fechaGrado: this.InputDateDegree.GetData(),
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
   * @description valida informacion de los componentes
   */
  async Valid(): Promise<any> {
    let valid: boolean = this.ValidFields([
      this.InputDependentsChildren,
      this.InputDependentsOld,
      this.InputLevelAcademin,
      this.InputDegree,
      this.InputNameInstitute,
      this.InputDateDegree,
      this.InputCurrent
    ]);
    return valid;
  }

  /**
   * r
   * @description carga en los componente con la informacion pre guardaba
   */
  async Load(): Promise<any> {
    MainStore.db.GetSection7().then((section7: Section7Model) => {
      if (!section7 || !section7.consInfoAdicional) {
        setTimeout(() => {         
          this.ModifyElementsLevelAcademic(this.dataSection4.formaVinculacion['consCategoria']);
        }, 2000);
        return;
      }
      this.formServ
        .GetInstitutionsByValue(
          typeof section7.institucion == "object"
            ? section7.institucion["consInstacademica"]
            : section7.institucion
        )
        .then(response => {
          let list = response;
          if (!list) {
            return;
          }
          if (list["descripcion"] != "NINGUNO") {
            this.InputNameInstitute.SelectByValue(list["consInstacademica"]);
            let data = {
              Value: list["consInstacademica"],
              Label: list["descripcion"]
            };
            this.InputNameInstitute.AddItem(data);
            this.InputNameInstitute.SelectByValue(data.Value);
            this.InputNameInstitute.Valid();
          }
        });

      if (section7.titulo == 0 || (typeof section7.titulo == "object"
        ? section7.titulo["consTituloacademico"]
        : section7.titulo) == 100) {
        this.InputDegree.Clear();
      } else {
        this.formServ
          .GetTitleByValue(
            typeof section7.titulo == "object"
              ? section7.titulo["consTituloacademico"]
              : section7.titulo
          )
          .then(response => {
            let list = response;
            if (!list) {
              return;
            }
            this.InputDegree.SelectByValue(list["consTituloacademico"]);
            let data = {
              Value: list["consTituloacademico"],
              Label: list["descripcion"]
            };
            this.InputDegree.AddItem(data);
            this.InputDegree.SelectByValue(data.Value);
            this.InputDegree.Valid();
          });
      }
      ///      
      this.InputDependentsChildren.SetData(section7.ninosACargo);
      this.InputDependentsOld.SetData(section7.adultosACargo);
      this.InputLevelAcademin.SelectByValue(section7.nivelAcademico);
      this.InputDateDegree.SetData(section7.fechaGrado);
      this.InputCurrent.SelectByValue(section7.actualmente);      
    });
  }

  AutoCompleteFieldNameInstituteRequired() {
    if ((this.dataSection4.formaVinculacion['consCategoria'] != undefined) &&
      (this.dataSection4.formaVinculacion['consCategoria'] === CatLinkEnum.FAMILIAR_ASOCIADO ||
        this.dataSection4.formaVinculacion['consCategoria'] === CatLinkEnum.FAMILIAR_ASOCIADO_FALLECIDO ||
        this.dataSection4.formaVinculacion['consCategoria'] === CatLinkEnum.EMPLEADO_NO_PROFESIONAL ||
        this.dataSection4.formaVinculacion['consCategoria'] === CatLinkEnum.ASESOR_COMERCIAL)) {
      this.FieldNameInstitute.IsRequired = false;
      this.InputLevelAcademin.SetRequired(false);
    }
    else {
      this.FieldNameInstitute.IsRequired = true;
      this.InputLevelAcademin.SetRequired(true);
    }
  }

  InputDateDegreeRequired() {
    this.InputDateDegree.SetRequired((this.dataSection4 != undefined &&
      (this.dataSection4.formaVinculacion['consCategoria'] === CatLinkEnum.EGRESADO_RECIEN_GRADUADO ||
        this.dataSection4.formaVinculacion['consCategoria'] === CatLinkEnum.ESTUDIANTE)) ? true : false);
    this.InputDegree.SetRequired((this.dataSection4 != undefined &&
      (this.dataSection4.formaVinculacion['consCategoria'] === CatLinkEnum.PROFESIONAL ||
        this.dataSection4.formaVinculacion['consCategoria'] === CatLinkEnum.TECNICO_Y_TECNOLOGOS ||
        this.dataSection4.formaVinculacion['consCategoria'] === CatLinkEnum.MAYORES_DE_60_ANIOS ||
        this.dataSection4.formaVinculacion['consCategoria'] === CatLinkEnum.EGRESADO_RECIEN_GRADUADO ||
        this.dataSection4.formaVinculacion['consCategoria'] === CatLinkEnum.ESTUDIANTE)))
  }

  onChangeValue(event) {
    MainStore.db.GetSection4().then((section4: Section4Model) => {
      if (this.dataSection4 != undefined &&
        (this.dataSection4.formaVinculacion['consCategoria'] === CatLinkEnum.EGRESADO_RECIEN_GRADUADO ||
          this.dataSection4.formaVinculacion['consCategoria'] === CatLinkEnum.ESTUDIANTE)) {
        let DateMax = new Date();
        let DateMin = new Date();
        DateMax.setFullYear(DateMax.getFullYear() + this.maxRangeDate);
        DateMin.setFullYear(DateMin.getFullYear() - this.minRangeDate);
        DateMax.setHours(0, 0, 0, 0);
        DateMin.setHours(0, 0, 0, 0);
        let dm = new Date(DateMin);
        let df = new Date(DateMax);
        let di = new Date(event.value);
        if (!(DateMin <= event.value && DateMax > event.value)) {
          SAlertComponent.AlertInfo("La fecha no cumple con los requisitos para el tipo de categoría seleccionado");
          this.InputDateDegree.Clear();
          this.InputDateDegree.ApplyInputRequired();
          this.InputDateDegree.set("Fecha invalida")
        }
      }
    })
  }

  SetNingunoInstitutionAcademi(instituted: number) {
    if ((!this.FieldNameInstitute.IsRequired) && (instituted == undefined || instituted == 0)) {
      return 10;
    }
    else {
      return instituted;
    }
  }

  GetNingunoInstitutionAcademi(instituted: number) {
    if ((!this.FieldNameInstitute.IsRequired) && (instituted == undefined || instituted == 0)) {
      return null;
    }
    else {
      return instituted;
    }
  }

  getRageDate() {
    this.notyService.GetRangeGraduateDate().then((response: IResponseService) => {
      this.maxRangeDate = Number(response.data.valor.split(",")[0]);
      this.minRangeDate = Number(response.data.valor.split(",")[1]);
    })
      .catch(error => { });
  }

  ModifyElementsLevelAcademic(categoriaVinculacion: number) {

    switch (categoriaVinculacion) {
      case CatLinkEnum.PROFESIONAL: {
        this.InputLevelAcademin.FilterByItems([LevelAcademicEnum.PROFESIONAL]);
        this.InputLevelAcademin.SelectByValue(LevelAcademicEnum.PROFESIONAL);
        break;
      }
      case CatLinkEnum.TECNICO_Y_TECNOLOGOS: {
        this.InputLevelAcademin.FilterByItems([LevelAcademicEnum.TECNICO,LevelAcademicEnum.TECNOLOGO]);                
        break;
      }
      case CatLinkEnum.ESTUDIANTE: {
        this.InputLevelAcademin.FilterByItems([LevelAcademicEnum.PROFESIONAL,LevelAcademicEnum.TECNICO,LevelAcademicEnum.TECNOLOGO]);        
        break;
      }
      case CatLinkEnum.EGRESADO_RECIEN_GRADUADO: {
        this.InputLevelAcademin.FilterByItems([LevelAcademicEnum.PROFESIONAL,LevelAcademicEnum.TECNICO,LevelAcademicEnum.TECNOLOGO]);                
        break;
      }
      case CatLinkEnum.MAYORES_DE_60_ANIOS: {
        this.InputLevelAcademin.FilterByItems([LevelAcademicEnum.PROFESIONAL,LevelAcademicEnum.TECNICO,LevelAcademicEnum.TECNOLOGO]);        
        break;
      }
      case CatLinkEnum.EMPLEADO_NO_PROFESIONAL: {
        this.InputLevelAcademin.FilterByItems([LevelAcademicEnum.NINGUNO]);
        this.InputLevelAcademin.SelectByValue(LevelAcademicEnum.NINGUNO);
        break;
      }
      case CatLinkEnum.ASESOR_COMERCIAL: {
        this.InputLevelAcademin.FilterByItems([LevelAcademicEnum.NINGUNO]);                
        this.InputLevelAcademin.SelectByValue(LevelAcademicEnum.NINGUNO);
        break;
      }
      case CatLinkEnum.FAMILIAR_ASOCIADO: {        
        this.InputLevelAcademin.FilterByItems([LevelAcademicEnum.NINGUNO]);
        this.InputLevelAcademin.SelectByValue(LevelAcademicEnum.NINGUNO);
        break;
      }
      case CatLinkEnum.FAMILIAR_ASOCIADO_FALLECIDO: {
        this.InputLevelAcademin.FilterByItems([LevelAcademicEnum.NINGUNO]);
        this.InputLevelAcademin.SelectByValue(LevelAcademicEnum.NINGUNO);
        break;
      }
      default: { break; }      
    }
  }

  @ViewChild("InputDependentsChildren")
  InputDependentsChildren: SInputComponent;
  @ViewChild("InputDependentsOld")
  InputDependentsOld: SInputComponent;
  @ViewChild("InputLevelAcademin")
  InputLevelAcademin: SAutocompleteComponent;
  @ViewChild("InputDegree")
  InputDegree: SAutocompleteComponent;
  @ViewChild("InputNameInstitute")
  InputNameInstitute: SAutocompleteComponent;
  @ViewChild("InputDateDegree")
  InputDateDegree: SInputComponent;
  @ViewChild("InputCurrent")
  InputCurrent: SCheckComponent;
  


  FieldDependentsChildren: InputModel = {
    Placeholder: "Ej. 1",
    Label: "Menores 18",
    Type: InputEnum.Text,
    Pattern: regexType.number,
    IsRequired: true,
    LenMin: 0,
    LenMax: 99,
    LenMaxValue: 2,
    Symbol: " "
  };

  FieldDependentsOld: InputModel = {
    Label: "Adultos",
    Placeholder: "Ej. 1",
    Type: InputEnum.Text,
    Pattern: regexType.number,
    IsRequired: true,
    LenMin: 0,
    LenMax: 99,
    LenMaxValue: 2,
    Symbol: " "
  };

  FieldDegree: AutocompleteModel = {
    Label: "Título",
    IsRequired: false,
    Type: InputEnum.Text,
    Placeholder: "Ej. Cirujano",
    ItemsByStore: TitlesStore.name,
    FunctionStore: "GetTitles",
    IsActionWrittenStore: true,
    DefaultOptionParamterStore: {},
    Tooltip: {
      Label: MesaggeText.TOOLTIP_TYPING_SEARCH
    }
  };

  FieldLevelAcademin: AutocompleteModel = {
    Label: "Nivel Académico",
    Placeholder: "Ej. Pregrado",
    IsRequired: true,
    ItemsByStore: AcademicLevelStore.name
  };

  FieldNameInstitute: AutocompleteModel = {
    Label: "Nombre De Institución",
    IsRequired: true,
    ItemsByStore: InstitutionsStore.name,
    FunctionStore: "GetInstitucionesByName",
    IsActionWrittenStore: true,
    DefaultOptionParamterStore: {},
    Tooltip: {
      Label: MesaggeText.TOOLTIP_TYPING_SEARCH
    }
  };

  FieldTypeContract: AutocompleteModel = {
    Label: "Tipo De Contrato",
    IsRequired: true,
    ItemsByStore: TypeContractStore.name
  };

  FieldDateDegree: DatePickerModel = {
    Label: "Fecha De Grado",
    IsRequired: false
  };

  FieldCurrent = {
    Type: CheckEnum.Check,
    Items: [{ Label: "Actualmente", Value: ConfirmeStore.YES }]
  };
}
