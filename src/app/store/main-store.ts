import { HttpClient } from "@angular/common/http";
import { ResponseEnum } from "../enums/ResponseEnum.enum";
import { IResponseService } from "../interfaces/response-service";
import { SectionsService } from "../services/sections.service";
import { LockFieldsModel } from "../shared/models/lock-fields-model";
import { LockSectionsModel } from "../shared/models/lock-section-model";
import { MenuModel } from "../shared/models/menu-model";
import { PageModel } from "../shared/models/page-model";
import { SectionFilesModel } from "../shared/models/section-files-model";
import { Section1Model } from "../shared/models/section1-model";
import { Section10Model } from "../shared/models/section10-model";
import { Section2Model } from "../shared/models/section2-model";
import {
  Section3Part1Model,
  Section3Part2Model
} from "../shared/models/section3-model";
import { Section4Model } from "../shared/models/section4-model";
import { Section5Model } from "../shared/models/section5-model";
import { Section6Model } from "../shared/models/section6-model";
import { Section7Model } from "../shared/models/section7-model";
import { Section8Model } from "../shared/models/section8-model";
import { Section9Model } from "../shared/models/section9-model";
import { UserModel } from "../shared/models/user-model";
import { ZeroPaperModel } from "../shared/models/zero-paper-model";
import { resource } from "selenium-webdriver/http";
import { SectionEncModel } from '../shared/models/section-enc-model';
import { SectionVerificaUsuarioModel } from "../shared/models/section-verifica-usuario-model";

export class MainStore {

  public static ORIGIN: number = 1;
  private static instance: MainStore;

  /**
   * r
   * @description metodo por el cual obtiene el unico lugar de almacenamiento de los formulario del cliente
   */
  public static get db() {
    return this.instance || (this.instance = new MainStore());
  }

  private data: ZeroPaperModel;
  private sectionsService: SectionsService = undefined;

  constructor() {
    this.RestData();
  }

  /**
   * 
   * @description Se asigna la instacia de http, para solitar su servicio
   * @param http HttpClient
   */
  public SetHttpClient(http: HttpClient) {
    this.sectionsService = new SectionsService(http);
  }

  /**
   * r
   * @description Limpia todos los valores
   */
  public RestData() {
    this.data = new ZeroPaperModel();
  }

  /**
   * r
   * @description limpia todas las secciones y loquedos de componestes y secciones
   */
  public RestSections() {
    this.data.section1 = undefined;
    this.data.section2 = undefined;
    this.data.section3Part1 = undefined;
    this.data.section3Part2 = undefined;
    this.data.section4 = undefined;
    this.data.section5 = undefined;
    this.data.section6 = undefined;
    this.data.section7 = undefined;
    this.data.section8 = undefined;
    this.data.section9 = undefined;
    this.data.section10 = undefined;
    this.data.sectionenc = undefined;
    this.data.lastPage = undefined;
    this.data.lockFields = {};
    this.data.lockSection = {};
  }

  /**
   * 
   * @description Obtener el usuario que esta logueado
   */
  public GetUser() {
    return this.data.user;
  }



  /**
   * 
   * @description Establese el usuario que va usar la aplicación
   * @param user UserModel
   */
  public SetUser(user: UserModel) {
    this.data.user = user;
  }




  /**
   * @author Jose Wilson Mulato
   * @description Obtener el usuario de evidente
   */
  public GetDataEvidente() {
    return this.data.sectionVerificaUsuario;
  }


  /**
   * @author Jose Wilson Mulato
   * @description Establese el usuario que va usar la aplicación
   * @param user UserModel
   */
  public SetDataEvidente(dataUsuario: SectionVerificaUsuarioModel) {
    this.data.sectionVerificaUsuario = dataUsuario;
  }

  /**
   * 
   * @description Oteniendo el menú agregado
   */
  public GetMenu(): MenuModel[] {
    return this.data.menu;
  }

  /**
   * 
   * @description Agregando al menú items
   * @param item
   */
  public AddMenu(...items: MenuModel[]) {
    items.forEach(x => this.data.menu.push(x));
  }

  /**
   * 
   * @description Agregando al menú items
   */
  public ClearMenu() {
    this.data.menu = [];
  }

  /**
   * 
   * @description Valida si existe un cliente guardado
   */
  IsExitClient(): boolean {
    return this.data && this.data.section1 && !!this.data.section1.idProspecto;
  }

  /**
   * 
   * @description Obtener el prospecto actual
   */
  GetIdPropect(): number {
    return this.data.section1.idProspecto;
  }

  /**
   * @author Jose Wilson Mulato Escobar
   * @description Obtener el email del prospecto
   */
  GetEmailProspect(): string {
    return this.data.section1.correoElectronico;
  }


  /**
   * @author Jose Wilson Mulato Escobar
   * @description Obtener la fechaNacimientoProspecto
   */
  GetFecNacimiento(): number {
    return this.data.section1.fechaNacimiento;
  }
  // /**
  // * @author Jose Wilson Mulato
  // * @description Obtener el porcentaje de la solicitud
  // */
  // public GetPercent() {
  //   return this.data.percent;
  // }

  GetNombre1Prospect(): string {
    return this.data.section1.primerNombre;
  }

  GetNombre2Prospect(): string {
    return this.data.section1.segundoNombre;
  }

  GetApellido1Prospect(): string {
    return this.data.section1.primerApellido;
  }

  GetApellido2Prospect(): string {
    return this.data.section1.segundoApellido;
  }

  GetCedulaProspect(): string {
    return this.data.section1.numeroIdentificacion;
  }

  GetCelProspect(): string {
    return this.data.section1.telefonoCelular;
  }

  /**
   * r
   * @description bloquear o desploquear las secciones de momento 1
   * @param value
   */
  SetLockAllSectionM1(value: boolean) {
    this.data.lockSection.section1 = value;
    this.data.lockSection.section2 = value;
    this.data.lockSection.section3 = value;
    this.data.lockSection.section4 = value;
    this.data.lockSection.section5 = value;
    this.data.lockSection.section6 = value;
    this.data.lockSection.sectionFiles = value;
  }

  /**
   * r
   * @description obtener todas las secciones de momento 1
   */
  GetLockAllSectionM1(): LockSectionsModel {
    return this.data.lockSection;
  }
  /**
   * 
   * @description Guarda la primera section 'Datos Personales'
   * @param data
   */
  async SetSection1(data: Section1Model) {
    return new Promise((success, fail) => {
      if (this.data.section1 && this.data.section1.idProspecto) {
        data.idProspecto = this.data.section1.idProspecto;
        data.usuarioModificacion = this.GetUser().username;
      }
      this.SaveSections("SetSection1", data)
        .then((response: IResponseService) => {
          if (response.status == ResponseEnum.OK) {
            this.data.section1 = response.data;
          }
          success(response);
        })
        .catch(error => {
          fail(error);
        });
    });
  }

  /**
   * 
   * @description Guarda la segunda section 'PEP`s'
   * @param data
   */
  async SetSection2(data: Section2Model) {
    return new Promise((success, fail) => {
      if (this.data.section2 && this.data.section2.consInfoPep) {
        data.consInfoPep = this.data.section2.consInfoPep;
        data.usuarioModificacion = this.GetUser().username;
      }
      this.SaveSections("SetSection2", data)
        .then((response: IResponseService) => {
          if (response.status == ResponseEnum.OK) {
            this.data.section2 = response.data;
          }
          success(response);
        })
        .catch(error => {
          fail(error);
        });
    });
  }

  /**
   * 
   * @description Guarda la segunda section 'Actividad Economica'
   * @param data
   */
  async SetSection3Part1(data: Section3Part1Model) {
    return new Promise((success, fail) => {
      if (this.data.section3Part1 && this.data.section3Part1.consTransaccion) {
        data.consTransaccion = this.data.section3Part1.consTransaccion;
        data.usuarioModificacion = this.GetUser().username;
      }
      this.SaveSections("SetSection3Part1", data)
        .then((response: IResponseService) => {
          if (response.status == ResponseEnum.OK) {
            this.data.section3Part1 = response.data;
          }
          success(response);
        })
        .catch(error => {
          fail(error);
        });
    });
  }

  /**
   * 
   * @description Guarda la segunda section 'Actividad Economica'
   * @param data
   */
  async SetSection3Part2(data: Section3Part2Model) {
    return new Promise((success, fail) => {
      if (this.data.section3Part2 && this.data.section3Part2.consEconomia) {
        data.consEconomia = this.data.section3Part2.consEconomia;
        data.usuarioModificacion = this.GetUser().username;
      }
      this.SaveSections("SetSection3Part2", data)
        .then((response: IResponseService) => {
          if (response.status == ResponseEnum.OK) {
            this.data.section3Part2 = response.data;
          }
          success(response);
        })
        .catch(error => {
          fail(error);
        });
    });
  }

  /**
   * 
   * @description Guarda la segunda section 'Contribucciones'
   * @param data
   */
  async SetSection4(data: Section4Model) {
    return new Promise((success, fail) => {
      if (this.data.section4 && this.data.section4.consContribucionFondo) {
        data.consContribucionFondo = this.data.section4.consContribucionFondo;
        data.usuarioModificacion = this.GetUser().username;
      }
      this.SaveSections("SetSection4", data)
        .then((response: IResponseService) => {
          if (response.status == ResponseEnum.OK) {
            this.data.section4 = response.data;
          }
          success(response);
        })
        .catch(error => {
          fail(error);
        });
    });
  }

  /**
   * 
   * @description Guarda la segunda section 'Autorizaciones'
   * @param data
   */
  async SetSection5(data: Section5Model) {
    return new Promise((success, fail) => {
      if (this.data.section5 && this.data.section5.consAutorizacion) {
        data.consAutorizacion = this.data.section5.consAutorizacion;
        data.usuarioModificacion = this.GetUser().username;
      }
      this.SaveSections("SetSection5", data)
        .then((response: IResponseService) => {
          if (response.status == ResponseEnum.OK) {
            this.data.section5 = response.data;
          }
          success(response);
        })
        .catch(error => {
          fail(error);
        });
    });
  }

  /**
   * 
   * @description Guarda la primera section 'Campos Adicionales'
   * @param data
   */
  async SetSection6(data: Section6Model) {
    return new Promise((success, fail) => {
      if (this.data.section6 && this.data.section6.consAdicionales) {
        data.consAdicionales = this.data.section6.consAdicionales;
        data.usuarioModificacion = this.GetUser().username;
      }
      this.SaveSections("SetSection6", data).then(
        (response: IResponseService) => {
          if (response.status == ResponseEnum.OK) {
            this.data.section6 = response.data;
          }
          success(response);
        }
      );
    });
  }

  /**
   * 
   * @description Guarda la segunda section 'Información Adicional'
   * @param data
   */
  async SetSection7(data: Section7Model) {
    return new Promise((success, fail) => {
      if (this.data.section7 && this.data.section7.consInfoAdicional) {
        data.consInfoAdicional = this.data.section7.consInfoAdicional;
        data.usuarioModificacion = this.GetUser().username;
      }
      this.SaveSections("SetSection7", data)
        .then((response: IResponseService) => {
          if (response.status == ResponseEnum.OK) {
            this.data.section7 = response.data;
          }
          success(response);
        })
        .catch(error => {
          fail(error);
        });
    });
  }

  /**
   * 
   * @description Guarda la segunda section 'Declaración de Salud'
   * @param data
   */
  async SetSection8(data: Section8Model) {
    return new Promise((success, fail) => {
      if (this.data.section8 && this.data.section8.consDeclaracionSalud) {
        data.consDeclaracionSalud = this.data.section8.consDeclaracionSalud;
        data.usuarioModificacion = this.GetUser().username;
      }
      this.SaveSections("SetSection8", data)
        .then((response: IResponseService) => {
          if (response.status == ResponseEnum.OK) {
            this.data.section8 = response.data;
          }
          success(response);
        })
        .catch(error => {
          fail(error);
        });
    });
  }

  /**
   * 
   * @description Guarda la segunda section 'Beneficiarios'
   * @param array
   */
  async SetSection9(array: Section9Model[]) {
    array.forEach(data => {
      data.ip = this.data.user.ip;
      if (data.usuarioModificacion) {
        data.usuarioCreacion = undefined;
      } else {
        data.usuarioCreacion = this.data.user.username;
      }
      if (this.data.section1 && this.data.section1.idProspecto) {
        data.idProspecto = this.GetIdPropect();
      }
    });

    return new Promise((success, fail) => {
      this.sectionsService
        .SetSection9(array, this.data.user.idPromotor)
        .then(response => {
          success(response);
        })
        .catch(error => {
          fail(error);
        });
    });
  }

  /**
   * 
   * @description Guarda la segunda section 'Otros Campos'
   * @param data
   */
  async SetSection10(data: Section10Model) {
    return new Promise((success, fail) => {
      if (this.data.section10 && this.data.section10.consOtraInfo) {
        data.consOtraInfo = this.data.section10.consOtraInfo;
        data.usuarioModificacion = this.GetUser().username;
      }
      this.SaveSections("SetSection10", data)
        .then((response: IResponseService) => {
          if (response.status == ResponseEnum.OK) {
            this.data.section10 = response.data;
          }
          success(response);
        })
        .catch(error => {
          fail(error);
        });
    });
  }

  /**
   * r
   * @description subiendo archivos
   * @param formData form de archivo
   */
  async SetSectionFiles(formData: FormData, id = "") {
    return new Promise((success, fail) => {
      this.sectionsService
        .SetSectionFiles(formData, id || this.GetIdPropect())
        .then(response => {
          /// se valida porque no se envia en cabecera del request
          /// tipo JSON y lo response como tipo text
          if (typeof response == "string") {
            response = JSON.parse(response);
          }
          this.data.sectionFiles =
            this.data.sectionFiles || new SectionFilesModel();
          this.data.sectionFiles.saveDocuments = true;
          success(response);
        })
        .catch(fail);
    });
  }

  /**
   * 
   * @description Envia dinamicamente a los servicios correspondientes y adiciona en los atributtos IP, Usuario Creacion,  Usuario Modificación
   * @param funt el servicio que se va a llamar para guardar
   * @param data el dato que se va enviar a guardar
   */
  private async SaveSections(funt: string, data: any) {
    data.ip = this.data.user.ip;
    if (data.usuarioModificacion) {
      data.usuarioCreacion = undefined;
    } else {
      data.usuarioCreacion = this.data.user.username;
      data.correoUsuario = this.data.user.email;
    }
    if (this.data.section1 && this.data.section1.idProspecto) {
      data.idProspecto = this.GetIdPropect();
    }


    return new Promise((success, fail) => {
      this.sectionsService[funt](data)
        .then(response => {
          success(response);
        })
        .catch(error => {
          fail(error);
        });
    });
  }

  /**
   * 
   * @description Obteniendo la primera seccion
   */
  async GetSection1(idProspect?: string) {
    let result = this.GetSection("section1");
    if (result) {
      return result;
    } else if (!idProspect) {
      return undefined;
    } else {
      return new Promise((success, fail) => {
        this.sectionsService
          .GetSection1(idProspect)
          .then((response: IResponseService) => {
            this.data["section1"] = response.data;
            success(response);
          });
      });
    }
  }


  /**
   * 
   * @description Obteniendo la primera seccion
   */
  async GetPercent(idProspect?: string) {
    let result = this.GetPercent("percent");
    if (result) {
      return result;
    } else if (!idProspect) {
      return undefined;
    } else {
      return new Promise((success, fail) => {
        this.sectionsService
          .GetPercent(idProspect)
          .then((response: IResponseService) => {
            this.data["percent"] = response.data;
            success(response);
          });
      });
    }
  }

  /**
   * 
   * @description Obteniendo la primera seccion
   */
  async GetSection2() {
    let idProspect = this.GetIdPropect().toString();
    let result = this.GetSection("section2");
    if (result) {
      return result;
    } else if (!idProspect) {
      return undefined;
    } else {
      return new Promise((success, fail) => {
        this.sectionsService
          .GetSection2(idProspect)
          .then((response: IResponseService) => {
            this.data["section2"] = response.data;
            success(this.data["section2"]);
          });
      });
    }
  }

  /**
   * 
   * @description Obteniendo la tercera seccion
   */
  async GetSection3Part1(idTransacion) {
    let result = this.GetSection("section3Part1");
    if (result) {
      return result;
    } else if (!idTransacion) {
      return undefined;
    } else {
      return new Promise((success, fail) => {
        this.sectionsService
          .GetSection3Part1(idTransacion)
          .then((response: IResponseService) => {
            this.data["section3Part1"] = response.data;
            success(this.data["section3Part1"]);
          });
      });
    }
  }

  /**
   * 
   * @description Obteniendo la primera seccion
   */
  async GetSection3Parte2() {
    let idProspect = this.GetIdPropect().toString();
    let result = this.GetSection("section3Part2");
    if (result) {
      return result;
    } else if (!idProspect) {
      return undefined;
    } else {
      return new Promise((success, fail) => {
        this.sectionsService
          .GetSection3Part2(idProspect)
          .then((response: IResponseService) => {
            this.data["section3Part2"] = response.data;
            success(this.data["section3Part2"]);
          });
      });
    }
  }

  /**
   * 
   * @description Obteniendo la primera seccion
   */
  async GetSection4() {
    let idProspect = this.GetIdPropect().toString();
    let result = this.GetSection("section4");
    if (result) {
      return result;
    } else if (!idProspect) {
      return undefined;
    } else {
      return new Promise((success, fail) => {
        this.sectionsService
          .GetSection4(idProspect)
          .then((response: IResponseService) => {
            this.data["section4"] = response.data;
            success(this.data["section4"]);
          });
      });
    }
  }

  /**
   * 
   * @description Obteniendo la primera seccion
   */
  async GetSection5() {
    let idProspect = this.GetIdPropect().toString();
    let result = this.GetSection("section5");
    if (result) {
      return result;
    } else if (!idProspect) {
      return undefined;
    } else {
      return new Promise((success, fail) => {
        this.sectionsService
          .GetSection5(idProspect)
          .then((response: IResponseService) => {
            this.data["section5"] = response.data;
            success(this.data["section5"]);
          });
      });
    }
  }

  /**
   * 
   * @description Obteniendo la primera seccion
   */
  async GetSection6() {
    let idProspect = this.GetIdPropect().toString();
    let result = this.GetSection("section6");
    if (result) {
      return result;
    } else if (!idProspect) {
      return undefined;
    } else {
      return new Promise((success, fail) => {
        this.sectionsService
          .GetSection6(idProspect)
          .then((response: IResponseService) => {
            this.data["section6"] = response.data;
            success(this.data["section6"]);
          });
      });
    }
  }

  /**
   * 
   * @description Obteniendo la primera seccion
   */
  async GetSection7() {
    let idProspect: any = this.GetIdPropect();
    let result = this.GetSection("section7");
    if (result) {
      return result;
    } else if (!idProspect) {
      return undefined;
    } else {
      return new Promise((success, fail) => {
        this.sectionsService
          .GetSection7(idProspect)
          .then((response: IResponseService) => {
            this.data["section7"] = response.data;
            success(this.data["section7"]);
          });
      });
    }
  }

  /**
   * 
   * @description Obteniendo la primera seccion
   */
  async GetSection8() {
    let idProspect = this.GetIdPropect().toString();
    let result = this.GetSection("section8");
    if (result) {
      return result;
    } else if (!idProspect) {
      return undefined;
    } else {
      return new Promise((success, fail) => {
        this.sectionsService
          .GetSection8(this.GetIdPropect().toString())
          .then((response: IResponseService) => {
            this.data["section8"] = response.data;
            success(this.data["section8"]);
          });
      });
    }
  }

  /**
   * 
   * @description Obteniendo la primera seccion
   */
  async GetSection9() {
    let result = this.GetSection("section9");
    let idProspect = this.GetIdPropect().toString();
    if (result) {
      return result;
    } else if (!idProspect) {
      return undefined;
    } else {
      return new Promise((success, fail) => {
        success(undefined);
      });
    }
  }

  /**
   * 
   * @description Obteniendo la primera seccion
   */
  async GetSection10() {
    let result = this.GetSection("section10");
    let idProspect = this.GetIdPropect().toString();
    if (result) {
      return result;
    } else if (!idProspect) {
      return undefined;
    } else {
      return new Promise((success, fail) => {
        this.sectionsService
          .GetSection10(this.GetIdPropect().toString())
          .then((response: IResponseService) => {
            this.data["section10"] = response.data;
            success(this.data["section10"]);
          });
      });
    }
  }

  /**
   * r
   * @description Obtiene el valor si fue subido por primera ves
   */
  async GetSectionFile() {
    let result = this.data.sectionFiles;
    if (result) {
      return result;
    }
    return {};
  }

  /**
   * r
   * @description Obtiene el key de docuware key
   */
  async GetDocuwareKey() {
    let result: SectionFilesModel = this.data.sectionFiles;
    if (result) {
      return result.docuwareKey;
    }
    return new Promise((success, fail) => {
      this.sectionsService
        .GetDocuwareKey(
          this.GetIdPropect(),
          this.data.user.username,

          this.data.user.ip
        )
        .then((response: IResponseService) => {
          this.data.sectionFiles = new SectionFilesModel();
          this.data.sectionFiles.docuwareKey = response.data;
          success(this.data.sectionFiles.docuwareKey);
        });
    });
  }

  /**
   * r
   * @description Obtener el tipo de carga de archivo
   */
  async GetTypeLoadFiles() {
    return new Promise((success, fail) => {
      this.sectionsService
        .GetTypeLoadFiles(this.GetIdPropect())
        .then((response: IResponseService) => {
          success(response);
        });
    });
  }

  /**
   * r
   * @description Se edita al de fuerza comercial ver el boton continuar
   * @param valid boolean
   */
  public SetPCForceForCompleteForm(valid: boolean) {
    this.data.PCForceForCompleteForm = valid;
  }

  /**
   * r
   * @description Se obtiene al rol de fuerza comercial el valor si tiene el permiso de mostrar el boton
   */
  public GetPCForceForCompleteForm() {
    return this.data.PCForceForCompleteForm;
  }

  /**
   * r
   * @description Obtiene los archivos ajuntos que se halla guardado previamente
   */
  async GetFilesAdjunt() {
    return this.sectionsService.GetFilesAdjunt(this.GetIdPropect());
  }

  /**
   * r
   * @description obtiene el nombre de los archivos subidos
   */
  async GetFilesAdjuntNames(id: number = 0) {
    return this.sectionsService.GetFilesAdjuntNames(id || this.GetIdPropect());
  }

  /**
   * r
   * @description Guardar la ruta de pagina en quedo
   * @param url
   */
  async SavePage(url: string) {
    this.data.lastPage = this.data.lastPage || new PageModel();

    return new Promise(success => {
      this.sectionsService
        .SavePage({
          idProspecto: this.GetIdPropect(),
          url,
          consPaginacion: this.data.lastPage.consPaginacion
        })
        .then((resUrl: IResponseService) => {
          this.data.lastPage = resUrl.data;
          success(resUrl.data);
        });
    });
  }

  /**
   * r
   * @description Obtener la url de prospecto donde quedo
   */
  async GetPage(idProspect: number) {
    return new Promise(success => {
      this.sectionsService
        .GetPage(idProspect)
        .then((response: IResponseService) => {
          this.data.lastPage = response.data;
          success(response);
        });
    });
  }

  /**
   * r
   * @description Obtiene el valor de las secciones
   * @param section
   */
  private GetSection(section) {
    if (this.data[section]) {
      return this.data[section];
    }
    return undefined;
  }

  /**
   * r
   * @description Obtiene y estables los campos a bloquear
   */
  GetLockFields() {
    return this.data.lockFields;
  }
  /**
   * r
   * @description Obtiene y estables los campos a bloquear
   */
  SetLockFields(lockFields: LockFieldsModel) {
    return (this.data.lockFields = lockFields);
  }



  /**
   * @author Jose Wilson Mulato
   * @description Obtener el usuario que esta logueado
   */
  public GetPorcentaje() {
    return this.data.percent;
  }



  /**
   * @author Jose Wilson Mulato
   * @description Establese el usuario que va usar la aplicación
   * @param user UserModel
   */
  public SetPorcentaje(percent: string) {
    this.data.percent = percent;
  }


  /**
   * @author Jose Wilson Mulato
   * @description Obtiene la section nueva de encuesta
   */
  async GetSectionEnc() {
    let result = this.GetSection("sectionenc");
    let idProspect = this.GetIdPropect().toString();
    if (result) {
      return result;
    } else if (!idProspect) {
      return undefined;
    } else {
      return new Promise((success, fail) => {
        this.sectionsService
          .GetSectionEnc(this.GetIdPropect().toString())
          .then((response: IResponseService) => {
            this.data["sectionenc"] = response.data;
            success(this.data["sectionenc"]);
          });
      });
    }
  }


  /**
   * @author Jose Wilson Mulato
   * @description Guarda la section 'Necesidades y expectativas'
   * @param data
   */

  async SetSectionEnc(data: SectionEncModel) {
    return new Promise((success, fail) => {
      if (this.data.sectionenc && this.data.sectionenc.idProspecto) {
        data.idProspecto = this.data.sectionenc.idProspecto;
        data.usuarioModificacion = this.GetUser().username;
      }
      this.SaveSections("SetSectionEnc", data)
        .then((response: IResponseService) => {
          if (response.status == ResponseEnum.OK) {
            this.data.sectionenc = response.data;
          }
          success(response);
        })
        .catch(error => {
          fail(error);
        });
    });
  }


  /**
   * @author Jose Wilson Mulato
   * @description Guarda la section 'Necesidades y expectativas'
   * @param data
   */

  async enviarValidar(data: SectionVerificaUsuarioModel) {
    return new Promise((success, fail) => {
      data.usuarioModificacion = this.GetUser().username;
      this.SaveSections("enviarValidar", data)
        .then((response: IResponseService) => {
          if (response.status == ResponseEnum.OK) {
            this.data.sectionVerificaUsuario = response.data;
          }
          success(response);
        })
        .catch(error => {
          fail(error);
        });
    });
  }



  // async SetSectionEnc(array: Section9Model[]) {
  //   array.forEach(data => {
  //     data.ip = this.data.user.ip;
  //     if (data.usuarioModificacion) {
  //       data.usuarioCreacion = undefined;
  //     } else {
  //       data.usuarioCreacion = this.data.user.username;
  //     }
  //     if (this.data.section1 && this.data.section1.idProspecto) {
  //       data.idProspecto = this.GetIdPropect();
  //     }
  //   });

  //   return new Promise((success, fail) => {
  //     this.sectionsService
  //       .SetSectionEnc(array)
  //       .then(response => {
  //         success(response);
  //       })
  //       .catch(error => {
  //         fail(error);
  //       });
  //   });
  // }
}
