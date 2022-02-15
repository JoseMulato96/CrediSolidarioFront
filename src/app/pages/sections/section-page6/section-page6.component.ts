import { Component, OnInit, ViewChild } from "@angular/core";
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
import { SInputComponent } from "../../../shared/components/s-input/s-input.component";
import {
  CheckEnum,
  CheckModel
} from "../../../shared/extends-components/bcheck-component";
import { InputModel } from "../../../shared/extends-components/binput-component";
import { Section6Model } from "../../../shared/models/section6-model";
import { ConfirmeStore } from "../../../store/confirme-store";
import { MainStore } from "../../../store/main-store";
import { OfficesStore } from "../../../store/offices-store";
import { TypeChannelStore } from "../../../store/type-channel-store";
import { regexType } from "../../../utils/regexDefault";
import { ResponseUiService } from "../../../utils/response-ui.service";
import { MesaggeText } from "../../../shared/texts/mesagge-text";
import { SCheckComponent } from "../../../shared/components/s-check/s-check.component";
import { SAlertComponent } from "../../../shared/components/s-alert/s-alert.component";

@Component({
  selector: "app-section-page6",
  templateUrl: "./section-page6.component.html",
  styleUrls: ["./section-page6.component.scss"]
})
export class SectionPage6Component extends BaseSection
  implements OnInit, IFormSection {
  @ViewChild("InputAuthorizationSave")
  InputAuthorizationSave: SAutocompleteComponent;

  @ViewChild("InputAuthorizationCredit")
  InputAuthorizationCredit: SAutocompleteComponent;

  // @ViewChild("InputTypeLoad")
  // InputTypeLoad: SCheckComponent;

  @ViewChild("InputChargeInterviewer")
  InputChargeInterviewer: SInputComponent;

  @ViewChild("InputOfficeInterviewer")
  InputOfficeInterviewer: SAutocompleteComponent;

  @ViewChild("InputNameInterviewer")
  InputNameInterviewer: SInputComponent;  

  @ViewChild("InputNameAndLastNameRef")
  InputNameAndLastNameRef: SInputComponent;

  @ViewChild("InputIdRef")
  InputIdRef: SInputComponent;

  @ViewChild("InputTypeCanal")
  InputTypeCanal: SAutocompleteComponent;

  FieldNameAndLastNameRef: InputModel = {
    Label: "Apellido(s) y Nombre(s) Del Referente",
    Placeholder: "Cardenas Pedro",
    IsRequired: false,
    LenMax: 100
  };
  FieldIdRef: InputModel = {
    Label: "Cédula De Referente",
    Placeholder: "123456789",
    IsRequired: true,
    Symbol: " ",
    Pattern: regexType.number,
    LenMax: 15
  };
  FieldTypeCanal: InputModel = {
    Label: "Tipo De Canal",
    Placeholder: "",
    IsRequired: true,
    ItemsByStore: TypeChannelStore.name
  };

  FieldAuthorizationSave = {
    Label: "Autorizan La Apertura y Activación De La Cuenta De Ahorros",
    IsRequired: true,
    Type: CheckEnum.Radio,
    SelectValue: ConfirmeStore.YES,
    Items: ConfirmeStore.GetCopyDefault()
  };
  FieldAuthorizationCredit = {
    Label: "Autorizo La activación Del Cupo De Crédito",
    IsRequired: true,
    Type: CheckEnum.Radio,
    SelectValue: ConfirmeStore.YES,
    Items: ConfirmeStore.GetCopyDefault()
  };

  FieldChargeInterviewer = {
    Label: "Cargo Del Entrevistador",
    IsRequired: true,
    Placeholder: "Ej. Fuerza de Venta",
    //Data: "Asociado Cooperador",
    LenMax: 100
  };
  FieldOfficeInterviewer: AutocompleteModel = {
    Label: "Oficina Quien Vincula",
    IsRequired: true,
    ItemsByStore: OfficesStore.name,
    FunctionStore: "GetOfficesByName",
    IsActionWrittenStore: true,
    Tooltip: {
      Label: MesaggeText.TOOLTIP_TYPING_SEARCH
    }
  };
  FieldNameInterviewer = {
    Label: "Nombre Del Entrevistador",
    IsRequired: true,
    Placeholder: "Ej. Pedro",
    LenMax: 100
  };  

  FieldTypeLoad: CheckModel = {
    Label: "Seleccione El Método Para El Cargue De Los Documentos",
    IsRequired: false,
    Type: CheckEnum.Radio,
    SelectIndex: 0,
    Items: [
      {
        Label: "Adjuntar Archivos",
        Value: 0
      }
      // ,{
      //   Label: "Digitalizar archivos",
      //   Value: 1
      // }
    ]
  };

  /**
   * r
   * @description retorna la direccion previo
   */
  async Prev(): Promise<any> {
    return AddressesUrlParams.SECTION_05;
  }

  /**
   * r
   * @description retorna la direccion siguiente
   */
  async Next(): Promise<any> {
    return AddressesUrlParams.SECTION_07;
  }

  /**
   * r
   * @description envia a guardar la informacion
   */
  async Save(): Promise<any> {
    /// el sistema valida que la seccion esta bloqueda no guarde
    if (MainStore.db.GetLockAllSectionM1().section6) {
      return true;
    }
    return new Promise((success, fail) => {
      MainStore.db
        .SetSection6({
          activaCupoCredito: this.InputAuthorizationCredit.GetData(),
          activaCupoCuenta: this.InputAuthorizationSave.GetData(),
          cargoEntrevistador: this.InputChargeInterviewer.GetData(),
          nombreEntrevistador: this.InputNameInterviewer.GetData(),          
          oficinaVinculador: this.InputOfficeInterviewer.GetData(),
          cedulaReferente: this.InputIdRef.GetData(),
          nombreReferente: this.InputNameAndLastNameRef.GetData(),
          tipoCanal: this.InputTypeCanal.GetData(),
          tipoCargueArch: null
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
   * @description valida la informacion de los componentes
   */
  async Valid(): Promise<any> {
    /// el sistema valida que la seccion esta bloqueda no guarde
    if (MainStore.db.GetLockAllSectionM1().section6) {
      return true;
    }
    let valid: boolean = this.ValidFields([
      this.InputNameAndLastNameRef,
      //this.InputIdRef,
      this.InputTypeCanal,
      this.InputAuthorizationSave,
      this.InputAuthorizationCredit,
      this.InputChargeInterviewer,
      this.InputOfficeInterviewer,
      this.InputNameInterviewer     
      // this.InputTypeLoad
    ]);

    if (this.InputIdRef.GetData()) {
      valid = valid && this.InputIdRef.Valid();
    }
    return valid;
  }

  /**
   * r
   * @description carga los componentes de la informacion del servicio
   */
  async Load(): Promise<any> {
    //this.InputChargeInterviewer.SetDisable(true);
    // this.InputTypeLoad.SelectByValue(0);

    this.InputChargeInterviewer.SetDisable(true);
    this.InputOfficeInterviewer.SetDisable(true);
    this.InputNameInterviewer.SetDisable(true);

    return new Promise(success => {
      MainStore.db.GetSection6()
      .then((section6: Section6Model) => {
        if (!section6 || !section6.consAdicionales) {
          this.setOffice();
          return success();
        }
        this.InputAuthorizationSave.SelectByValue(section6.activaCupoCuenta);
        this.InputAuthorizationCredit.SelectByValue(section6.activaCupoCredito);

        this.InputNameAndLastNameRef.SetData(section6.nombreReferente);
        this.InputIdRef.SetData(section6.cedulaReferente);
        this.InputTypeCanal.SelectByValue(section6.tipoCanal);
        //this.InputChargeInterviewer.SetData(section6.cargoEntrevistador);

        // this.InputTypeLoad.SelectByValue(section6.tipoCargueArch);
        this.setOffice();
        this.InputNameInterviewer.SetData(section6.nombreEntrevistador);        
      });
      success();
    });
  }

  constructor(
    private responseUI: ResponseUiService,
    private formServ: FormService
  ) {
    super();
  }

  ngOnInit() {}

  ngAfterContentInit() {
    this.Load().then(() => this.IsLockSection());
  }

  /**
   * @author Cesar Millan
   * @description Metodo para la consulta y el llenado de oficina
   */
  setOffice(){    
    if(MainStore.ORIGIN == 1){
      this.formServ
      .GetOfficesLico(MainStore.db.GetUser().idPromotor)
      .then((response: IResponseService) => {
        if (
          response.status == ResponseEnum.OK &&
          response.data != undefined
        ) {
          let data = {
            Label: response.data["descLocalizacion"],
            Value: response.data["consLocalizacion"]
          };
          this.InputOfficeInterviewer.AddItem(data);
          this.InputOfficeInterviewer.SelectByValue(data.Value);
          this.InputOfficeInterviewer.Valid();

          this.InputNameInterviewer.SetData(response.data["namePromotor"]);
          this.InputChargeInterviewer.SetData(response.data["cargo"]);                 

        }else{
          SAlertComponent.AlertInfo(response.messageError);
        }
      });
    }
    else{
      this.formServ
            .GetOfficesById(MainStore.db.GetUser().codOffice)
            .then(response => {
              let data = {
                Label: response["descLocalizacion"],
                Value: response["consLocalizacion"]
              };
              this.InputOfficeInterviewer.AddItem(data);
              this.InputOfficeInterviewer.SelectByValue(data.Value);
              this.InputOfficeInterviewer.Valid();              
            });

          this.InputNameInterviewer.SetData(MainStore.db.GetUser().name);
          this.InputChargeInterviewer.SetData("Asociado Cooperador");
    }    
  }

  /**
   * r
   * @description bloquea la seccion
   */
  IsLockSection() {
    if (!MainStore.db.GetLockAllSectionM1().section6) {
      return;
    }
    super.IsLockSection([
      this.InputAuthorizationSave,
      this.InputAuthorizationCredit,
      this.InputChargeInterviewer,
      this.InputOfficeInterviewer,
      this.InputNameInterviewer,      
      this.InputNameAndLastNameRef,
      this.InputIdRef,
      this.InputTypeCanal
    ]);
  }
  onValidReferent() {
    if (!this.InputIdRef.GetData()) {
      this.InputIdRef.InactivityInputRequired();
    }
  }
}
