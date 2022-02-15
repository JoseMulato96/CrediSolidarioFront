import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseSection } from "../../../extends/base-section";
import { IFormSection } from "../../../interfaces/form-section";
import { AddressesUrlParams } from "../../../parameters/addresses-url-params";
import { SInputComponent } from "../../../shared/components/s-input/s-input.component";
import {
  CheckEnum,
  CheckModel
} from "../../../shared/extends-components/bcheck-component";
import { ResponseUiService } from "../../../utils/response-ui.service";
import { SCheckComponent } from "../../../shared/components/s-check/s-check.component";
import { InputModel } from "../../../shared/extends-components/binput-component";
import { Section1Model } from "../../../shared/models/section1-model";
import { MainStore } from "../../../store/main-store";
import { SectionEncModel } from "../../../shared/models/section-enc-model";
import { IResponseService } from "../../../interfaces/response-service";
import { SAlertComponent } from "../../../shared/components/s-alert/s-alert.component";
import { ResponseEnum } from "../../../enums/ResponseEnum.enum";
import { ObjPreguntasModel } from "../../../shared/models/objPreguntas-model";

@Component({
  selector: "app-section-pageenc",
  templateUrl: "./section-pageenc.component.html",
  styleUrls: ["./section-pageenc.component.scss"]
})
export class SectionPageEncComponent extends BaseSection
  implements OnInit, IFormSection {  
  arrayIds: Array<number> = [];
  objEncuesta: SectionEncModel;
  ngOnInit() {
    this.objEncuesta = new SectionEncModel();
    this.objEncuesta.arrayPreguntasResp = [];
  }
  ngAfterContentInit() {
    this.Load();
  }

  constructor(public responseUI: ResponseUiService) {
    super();
  }


  /**
   * r
   * @description retorna la direccion previo
   */
  async Prev(): Promise<any> {
    return AddressesUrlParams.SECTION_09;
  }

  /**
   * r
   * @description retorna la direccion siguiente
   */
  async Next(): Promise<any> {
    return AddressesUrlParams.SECTION_10;
  }

  /**
   * r
   * @description guardar la informacion en el servidor
   */
  async Save(): Promise<any> {
    return new Promise((success, fail) => {
      this.objEncuesta.arrayPreguntasResp.push({ idEncuesta: this.arrayIds[0], pregunta: this.FieldSolucionesFinancierasAhorro.Label, respuesta: this.InputSolucionesFinancierasAhorro.GetData(), otroCual: this.InputOtherSolucionesFinanAhorr.GetData() })
      this.objEncuesta.arrayPreguntasResp.push({ idEncuesta: this.arrayIds[1], pregunta: this.FieldSolucionesFinancierasCredito.Label, respuesta: this.InputSolucionesFinancierasCredito.GetData(), otroCual: this.InputOtherSolucionesFinanCred.GetData() })
      this.objEncuesta.arrayPreguntasResp.push({ idEncuesta: this.arrayIds[2], pregunta: this.FieldSolucionesSalud.Label, respuesta: this.InputSolucionesSalud.GetData(), otroCual: this.InputOtherSolucionesSalud.GetData() })
      this.objEncuesta.arrayPreguntasResp.push({ idEncuesta: this.arrayIds[3], pregunta: this.FieldSolucionesProteccion.Label, respuesta: this.InputSolucionesProteccion.GetData(), otroCual: this.InputOtherSolucionesProteccion.GetData() })
      this.objEncuesta.arrayPreguntasResp.push({ idEncuesta: this.arrayIds[4], pregunta: this.FieldSolucionesEducacion.Label, respuesta: this.InputSolucionesEducacion.GetData(), otroCual: this.InputOtherSolucionesEducacion.GetData() })
      this.objEncuesta.arrayPreguntasResp.push({ idEncuesta: this.arrayIds[5], pregunta: this.FieldSolucionesRecreacionTurismo.Label, respuesta: this.InputSolucionesRecreacionTurismo.GetData(), otroCual: this.InputOtherSolucionesRecreacionTurismo.GetData() })
      this.objEncuesta.arrayPreguntasResp.push({ idEncuesta: this.arrayIds[6], pregunta: this.FieldSolucionesDesarrolloEmpr.Label, respuesta: this.InputSolucionesDesarrolloEmpr.GetData(), otroCual: this.InputOtherSolucionesDesarrolloEmpr.GetData() })
      this.objEncuesta.idProspecto = MainStore.db.GetIdPropect();
      MainStore.db
        .SetSectionEnc(this.objEncuesta)
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
   * r
   * @description valida que los componentes tenga informacion
   */
  async Valid(): Promise<any> {
    let valid: boolean = this.ValidFields([
      this.InputSolucionesEducacion,
      this.InputSolucionesFinancierasAhorro,
      this.InputSolucionesFinancierasCredito,
      this.InputSolucionesProteccion,
      this.InputSolucionesRecreacionTurismo,
      this.InputSolucionesSalud,
      this.InputOtherSolucionesEducacion,
      this.InputOtherSolucionesFinanAhorr,
      this.InputOtherSolucionesFinanCred,
      this.InputOtherSolucionesProteccion,
      this.InputOtherSolucionesRecreacionTurismo,
      this.InputOtherSolucionesSalud
    ]);
    return valid;
  }

  /**
   * r
   * @description carga los componente de la informacion traida el servidor
   */
  async Load(): Promise<any> {
    MainStore.db.GetSectionEnc().then(data => {
      if (data.length == 0 || data.length < 0) {
        return;
      }      
      this.arrayIds[0] = data[0].idEncuesta;
      this.InputSolucionesFinancierasAhorro.SelectByValue(data[0].respuesta);
      this.InputOtherSolucionesFinanAhorr.SetData(data[0].otroCual);


      this.arrayIds[1] = data[1].idEncuesta;
      this.InputSolucionesFinancierasCredito.SelectByValue(data[1].respuesta);
      this.InputOtherSolucionesFinanCred.SetData(data[1].otroCual);


      this.arrayIds[2] = data[2].idEncuesta;
      this.InputSolucionesSalud.SelectByValue(data[2].respuesta);
      this.InputOtherSolucionesSalud.SetData(data[2].otroCual);

      this.arrayIds[3] = data[3].idEncuesta;
      this.InputSolucionesProteccion.SelectByValue(data[3].respuesta);
      this.InputOtherSolucionesProteccion.SetData(data[3].otroCual);

      this.arrayIds[4] = data[4].idEncuesta;
      this.InputSolucionesEducacion.SelectByValue(data[4].respuesta);
      this.InputOtherSolucionesEducacion.SetData(data[4].otroCual);

      this.arrayIds[5] = data[5].idEncuesta;
      this.InputSolucionesRecreacionTurismo.SelectByValue(data[5].respuesta);
      this.InputOtherSolucionesRecreacionTurismo.SetData(data[5].otroCual);

      this.arrayIds[6] = data[6].idEncuesta;
      this.InputSolucionesDesarrolloEmpr.SelectByValue(data[6].respuesta);
      this.InputOtherSolucionesDesarrolloEmpr.SetData(data[6].otroCual);      
    });
  }


  @ViewChild("InputSolucionesFinancierasAhorro")
  InputSolucionesFinancierasAhorro: SCheckComponent;
  @ViewChild("InputOtherSolucionesFinanAhorr")
  InputOtherSolucionesFinanAhorr: SInputComponent;
  @ViewChild("InputSolucionesFinancierasCredito")
  InputSolucionesFinancierasCredito: SCheckComponent;
  @ViewChild("InputOtherSolucionesFinanCred")
  InputOtherSolucionesFinanCred: SInputComponent;
  @ViewChild("InputSolucionesSalud")
  InputSolucionesSalud: SCheckComponent;
  @ViewChild("InputOtherSolucionesSalud")
  InputOtherSolucionesSalud: SInputComponent;
  @ViewChild("InputSolucionesProteccion")
  InputSolucionesProteccion: SCheckComponent;
  @ViewChild("InputOtherSolucionesProteccion")
  InputOtherSolucionesProteccion: SInputComponent;
  @ViewChild("InputSolucionesEducacion")
  InputSolucionesEducacion: SCheckComponent;
  @ViewChild("InputOtherSolucionesEducacion")
  InputOtherSolucionesEducacion: SInputComponent;
  @ViewChild("InputSolucionesRecreacionTurismo")
  InputSolucionesRecreacionTurismo: SCheckComponent;
  @ViewChild("InputOtherSolucionesRecreacionTurismo")
  InputOtherSolucionesRecreacionTurismo: SInputComponent;
  @ViewChild("InputSolucionesDesarrolloEmpr")
  InputSolucionesDesarrolloEmpr: SCheckComponent;
  @ViewChild("InputOtherSolucionesDesarrolloEmpr")
  InputOtherSolucionesDesarrolloEmpr: SInputComponent;




  /**
   * @author Jose Wilson Mulato Escobar
   * @description Escucha cuando a seleccionado la pregunta de ahorro
   */
  OnSelectAhorro() {
    let value = this.InputSolucionesFinancierasAhorro.GetData();
    let isOnlyRead = value != 'otro' ? true : false;
    this.InputOtherSolucionesFinanAhorr.SetReadOnly(isOnlyRead);
    this.InputOtherSolucionesFinanAhorr.ApplyInputRequired;
    let setData = value != 'otro' ? null : this.InputOtherSolucionesFinanAhorr.GetData();
    this.InputOtherSolucionesFinanAhorr.SetData(setData);
    if (!isOnlyRead) {
      this.InputOtherSolucionesFinanAhorr.ApplyInputRequired();
      this.InputOtherSolucionesFinanAhorr.SetRequired(true);
    } else {
      this.InputOtherSolucionesFinanAhorr.InactivityInputRequired();
      this.InputOtherSolucionesFinanAhorr.SetRequired(false);
    }
  }

  /**
   * @author Jose Wilson Mulato Escobar
   * @description Escucha cuando a seleccionado la pregunta de credito
   */
  OnSelectCredito() {
    let value = this.InputSolucionesFinancierasCredito.GetData();
    let isOnlyRead = value != 'otro' ? true : false;
    this.InputOtherSolucionesFinanCred.SetReadOnly(isOnlyRead);
    let setData = value != 'otro' ? null : this.InputOtherSolucionesFinanCred.GetData();
    this.InputOtherSolucionesFinanCred.SetData(setData);
    if (!isOnlyRead) {
      this.InputOtherSolucionesFinanCred.ApplyInputRequired();
      this.InputOtherSolucionesFinanCred.SetRequired(true);
    } else {
      this.InputOtherSolucionesFinanCred.InactivityInputRequired();
      this.InputOtherSolucionesFinanCred.SetRequired(false);
    }
  }

  /**
     * @author Jose Wilson Mulato Escobar
     * @description Escucha cuando a seleccionado la pregunta de salud
     */
  OnSelectSalud() {
    let value = this.InputSolucionesSalud.GetData();
    let isOnlyRead = value != 'otro' ? true : false;
    this.InputOtherSolucionesSalud.SetReadOnly(isOnlyRead);
    let setData = value != 'otro' ? null : this.InputOtherSolucionesSalud.GetData();
    this.InputOtherSolucionesSalud.SetData(setData);
    if (!isOnlyRead) {
      this.InputOtherSolucionesSalud.ApplyInputRequired();
      this.InputOtherSolucionesSalud.SetRequired(true);
    } else {
      this.InputOtherSolucionesSalud.InactivityInputRequired();
      this.InputOtherSolucionesSalud.SetRequired(false);
    }

  }
  /**
     * @author Jose Wilson Mulato Escobar
     * @description Escucha cuando a seleccionado la pregunta de proteccion
     */
  OnSelectProteccion() {
    let value = this.InputSolucionesProteccion.GetData();
    let isOnlyRead = value != 'otro' ? true : false;
    this.InputOtherSolucionesProteccion.SetReadOnly(isOnlyRead);
    let setData = value != 'otro' ? null : this.InputOtherSolucionesProteccion.GetData();
    this.InputOtherSolucionesProteccion.SetData(setData);
    if (!isOnlyRead) {
      this.InputOtherSolucionesProteccion.ApplyInputRequired();
      this.InputOtherSolucionesProteccion.SetRequired(true);
    } else {
      this.InputOtherSolucionesProteccion.InactivityInputRequired();
      this.InputOtherSolucionesProteccion.SetRequired(false);
    }
  }
  /**
     * @author Jose Wilson Mulato Escobar
     * @description Escucha cuando a seleccionado la pregunta de educacion
     */
  OnSelectEducacion() {
    let value = this.InputSolucionesEducacion.GetData();
    let isOnlyRead = value != 'otro' ? true : false;
    this.InputOtherSolucionesEducacion.SetReadOnly(isOnlyRead);
    let setData = value != 'otro' ? null : this.InputOtherSolucionesEducacion.GetData();
    this.InputOtherSolucionesEducacion.SetData(setData);
    if (!isOnlyRead) {
      this.InputOtherSolucionesEducacion.ApplyInputRequired();
      this.InputOtherSolucionesEducacion.SetRequired(true);
    } else {
      this.InputOtherSolucionesEducacion.InactivityInputRequired();
      this.InputOtherSolucionesEducacion.SetRequired(false);
    }
  }
  /**
     * @author Jose Wilson Mulato Escobar
     * @description Escucha cuando a seleccionado la pregunta de recreacion
     */
  OnSelectRecreacion() {
    let value = this.InputSolucionesRecreacionTurismo.GetData();
    let isOnlyRead = value != 'otro' ? true : false;
    this.InputOtherSolucionesRecreacionTurismo.SetReadOnly(isOnlyRead);
    let setData = value != 'otro' ? null : this.InputOtherSolucionesRecreacionTurismo.GetData();
    this.InputOtherSolucionesRecreacionTurismo.SetData(setData);
    if (!isOnlyRead) {
      this.InputOtherSolucionesRecreacionTurismo.ApplyInputRequired();
      this.InputOtherSolucionesRecreacionTurismo.SetRequired(true);
    } else {
      this.InputOtherSolucionesRecreacionTurismo.InactivityInputRequired();
      this.InputOtherSolucionesRecreacionTurismo.SetRequired(false);
    }
  }

  /**
     * @author Jose Wilson Mulato Escobar
     * @description Escucha cuando a seleccionado la pregunta de desarollo
     */
  OnSelectDesarrollo() {
    let value = this.InputSolucionesDesarrolloEmpr.GetData();
    let isOnlyRead = value != 'otro' ? true : false;
    this.InputOtherSolucionesDesarrolloEmpr.SetReadOnly(isOnlyRead);
    let setData = value != 'otro' ? null : this.InputOtherSolucionesDesarrolloEmpr.GetData();
    this.InputOtherSolucionesDesarrolloEmpr.SetData(setData);
    if (!isOnlyRead) {
      this.InputOtherSolucionesDesarrolloEmpr.ApplyInputRequired();
      this.InputOtherSolucionesDesarrolloEmpr.SetRequired(true);
    } else {
      this.InputOtherSolucionesDesarrolloEmpr.InactivityInputRequired();
      this.InputOtherSolucionesDesarrolloEmpr.SetRequired(false);
    }
  }


  //Soluciones Financieras Ahorro
  FieldSolucionesFinancierasAhorro: CheckModel = {
    Type: CheckEnum.Radio,
    IsRequired: true,
    SelectValue: -Infinity,
    Items: [
      {
        Label: "Ahorro A Corto Plazo (PAP)",
        Value: "Ahorro A Corto Plazo (PAP)"
      },
      {
        Label: "Ahorro A Largo Plazo (CDT)",
        Value: "Ahorro A Largo Plazo (CDT)"
      },
      {
        Label: "Ahorro Para Vivienda (AFC)",
        Value: "Ahorro Para Vivienda (AFC)"
      },
      {
        Label: "Cuenta Ahorros/Tarjeta Debito",
        Value: "Cuenta Ahorros/Tarjeta Debito"
      },
      {
        Label: "Otro ¿Cuál?",
        Value: "otro"
      }
    ],
    Label: "Soluciones Financieras De Ahorro"
  };


  FieldOtherSolucionesFinanAhorr: InputModel = {
    Label: "",
    Placeholder: "Otro ¿Cuál?",
    ReadOnly: true,
    LenMax: 50,
    Symbol: " "
  };
  //Fin Soluciones Financieras Ahorro

  //Soluciones Financieras Credito
  FieldSolucionesFinancierasCredito: CheckModel = {
    Type: CheckEnum.Radio,
    IsRequired: true,
    SelectValue: -Infinity,
    Items: [
      {
        Label: "Crédito Libre Inversion",
        Value: "Crédito Libre Inversion"
      },
      {
        Label: "Crédito Vivienda",
        Value: "Crédito Vivienda"
      },
      {
        Label: "Crédito Vehiculo",
        Value: "Crédito Vehiculo"
      },
      {
        Label: "Crédito Educacion",
        Value: "Crédito Educacion"
      },
      {
        Label: "Tarjeta Crédito",
        Value: "Tarjeta Crédito"
      },
      {
        Label: "Otro ¿Cuál?",
        Value: "otro"
      }
    ],
    Label: "Soluciones Financieras De Crédito"
  };


  FieldOtherSolucionesFinanCred: InputModel = {
    Label: "",
    Placeholder: "Otro ¿Cuál?",
    ReadOnly: true,
    LenMax: 50,
    Symbol: " "
  };
  //Fin Soluciones Financieras Credito


  //Soluciones En Salud
  FieldSolucionesSalud: CheckModel = {
    Type: CheckEnum.Radio,
    IsRequired: true,
    SelectValue: -Infinity,
    Items: [
      {
        Label: "Medicina Integral",
        Value: "Medicina Integral"
      },
      {
        Label: "Atencion Medica Domiciliaria(CEM)",
        Value: "Atencion Medica Domiciliaria(CEM)"
      },
      {
        Label: "Salud Oral",
        Value: "Salud Oral"
      },
      {
        Label: "Otro ¿Cuál?",
        Value: "otro"
      }
    ],
    Label: "Soluciones En Salud"
  };


  FielOtherSolucionesSalud: InputModel = {
    Label: "",
    Placeholder: "Otro ¿Cuál?",
    ReadOnly: true,
    LenMax: 50,
    Symbol: " "
  };
  //Fin Soluciones Salud


  //Soluciones En Proteccion
  FieldSolucionesProteccion: CheckModel = {
    Type: CheckEnum.Radio,
    IsRequired: true,
    SelectValue: -Infinity,
    Items: [
      {
        Label: "Seguro Autos",
        Value: "Seguro Autos"
      },
      {
        Label: "SOAT",
        Value: "Soat"
      },
      {
        Label: "Hogar",
        Value: "Hogar"
      },
      {
        Label: "RC Medica",
        Value: "RC Medica"
      },
      {
        Label: "Planes Adicionales ¿Cuales? (Vida,vida clásica,hospitalización,tranquilidad,recuperación,exequial,solvencia,herencia,educativo)",
        Value: "otro"
      }
    ],
    Label: "Soluciones De Protección"
  };


  FieldOtherSolucionesProteccion: InputModel = {
    Label: "",
    Placeholder: "Otro ¿Cuál?",
    ReadOnly: true,
    LenMax: 50,
    Symbol: " "
  };
  //Fin Soluciones En Proteccion 


  //Soluciones De Educacion
  FieldSolucionesEducacion: CheckModel = {
    Type: CheckEnum.Radio,
    IsRequired: true,
    SelectValue: -Infinity,
    Items: [
      {
        Label: "Pregrado",
        Value: "Pregrado"
      },
      {
        Label: "Postgrado",
        Value: "Postgrado"
      },
      {
        Label: "Educación Continua",
        Value: "Educación Continua"
      },
      {
        Label: "Cursos Otros",
        Value: "Cursos Otros"
      },
      {
        Label: "Otro ¿Cuál?",
        Value: "otro"
      }
    ],
    Label: "Soluciones De Educación"
  };


  FieldOtherSolucionesEducacion: InputModel = {
    Label: "",
    Placeholder: "Otro ¿Cuál?",
    ReadOnly: true,
    LenMax: 50,
    Symbol: " "
  };
  //Fin Soluciones De Educacion


  //Soluciones De Recreacion Y Turismo
  FieldSolucionesRecreacionTurismo: CheckModel = {
    Type: CheckEnum.Radio,
    IsRequired: true,
    SelectValue: -Infinity,
    Items: [
      {
        Label: "Viajes",
        Value: "Viajes"
      },
      {
        Label: "Deporte",
        Value: "Deporte"
      },
      {
        Label: "Arte Y Cultura",
        Value: "Arte Y Cultura"
      },
      {
        Label: "Gastronomía",
        Value: "Gastronomia"
      },
      {
        Label: "Actividades En Familia",
        Value: "Actividades En Familia"
      },
      {
        Label: "Solidarias",
        Value: "Solidarias"
      },
      {
        Label: "Vital",
        Value: "Vital"
      },
      {
        Label: "Otro ¿Cuál?",
        Value: "otro"
      }
    ],
    Label: "Soluciones De Recreación Y Turismo"
  };


  FieldOtherSolucionesRecreacionTurismo: InputModel = {
    Label: "",
    Placeholder: "Otro ¿Cuál?",
    ReadOnly: true,
    LenMax: 50,
    Symbol: " "
  };
  //Fin Soluciones De Recreacion Y Turismo


  //Soluciones De Desarrollo Empresarial
  FieldSolucionesDesarrolloEmpr: CheckModel = {
    Type: CheckEnum.Radio,
    IsRequired: true,
    SelectValue: -Infinity,
    Items: [
      {
        Label: "Financiación",
        Value: "Financiacion"
      },
      {
        Label: "Acompañamiento para emprender",
        Value: "Acompañamiento para emprender"
      },
      {
        Label: "Acompañamiento en fortalecimiento empresarial",
        Value: "Acompañamiento en fortalecimiento empresarial"
      },
      {
        Label: "Formacion y Capacitacion",
        Value: "Formacion y Capacitacion"
      },
      {
        Label: "Otro ¿Cuál?",
        Value: "otro"
      }
    ],
    Label: "Soluciones De Desarrollo Empresarial"
  };


  FieldOtherSolucionesDesarrolloEmpr: InputModel = {
    Label: "",
    Placeholder: "Otro ¿Cuál?",
    ReadOnly: true,
    LenMax: 50,
    Symbol: " "
  };
  //Fin Soluciones De Desarrollo Empresarial
}
