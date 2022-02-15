import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { ResponseEnum } from "../enums/ResponseEnum.enum";
import { IResponseService } from "../interfaces/response-service";
import { SAlertComponent } from "../shared/components/s-alert/s-alert.component";
import { MesaggeText } from "../shared/texts/mesagge-text";
import { MainStore } from "../store/main-store";

@Injectable()
export class BaseService {
  private _http: HttpClient;
  // Token para enviar a los servicio que lo requieran
  static TOKEN: string; static REFRESH_TOKEN: string;

  constructor(public http: HttpClient) {
    this._http = http;
  }

  /**
   * 
   * @description Se establese el token para enviar en las demas peticiones
   */
  static SetToken(token: string): any {
    this.TOKEN = token;
  }

  /**
  * 
  * @description Se establese el refresh token para refrescar el token
  */
  static SetRefreshToken(refresh: string) {
    this.REFRESH_TOKEN = refresh;
  }

  /**
   * r
   * @description Se obtiene el token
   */
  static GetToken() {
    return this.TOKEN;
  }

  /**
  * 
  * @description Se obtiene el refresh token
  */
  static GetRefreshToken(): string {
    return this.REFRESH_TOKEN;
  }

  /**
   * r
   * @description servicio por medio POST
   * @param urlService
   * @param data
   * @param _isToken
   * @param _isFile
   */
  public async Post(
    urlService: string,
    data: any,
    _isToken: boolean = true,
    _isFile: boolean = false
  ): Promise<any> {
    let jsonHeaders = {};
    !_isFile && (jsonHeaders = { "Content-Type": "application/json" });

    // El sistema valida si hay que enviar el token
    if (_isToken) {
      jsonHeaders["Authorization"] = `Bearer ${BaseService.TOKEN}`;
    }

    let httpOptions = {
      headers: new HttpHeaders(jsonHeaders)
    };
    if (_isFile) {
      httpOptions["reportProgress"] = true;
      httpOptions["responseType"] = "text";
    }

    let url: string = `${environment.backend}${urlService}`;
    return new Promise((success, fail) => {
      this.http
        .post(url, data, httpOptions)
        .toPromise()
        .catch(x => {
          this.ValidExpiredToken(x)
            .then(fail)
            .then(fail);
        })
        .then(success);
    });
  }

  /**
   * r
   * @description servicio por GET
   * @param urlService
   * @param data
   * @param _isToken
   */
  public async Get(urlService: string, data: any, _isToken: boolean = true) {
    let jsonHeaders = {};

    // El sistema valida si hay que enviar el token
    if (_isToken) {
      jsonHeaders["Authorization"] = `Bearer ${BaseService.TOKEN}`;
    }

    const httpOptions = {
      headers: new HttpHeaders(jsonHeaders)
    };
    let url: string = `${environment.backend}${urlService}`;
    return new Promise((success, fail) => {
      this.http
        .get(url, httpOptions)
        .toPromise()
        .catch(x => {
          this.ValidExpiredToken(x)
            .then(fail)
            .then(fail);
        })
        .then(success);
    });
  }

  /**
   * r
   * @description enviar por put
   * @param urlService
   * @param data
   * @param _isToken
   */
  public async Put(urlService: string, data: any, _isToken: boolean = true) {
    let jsonHeaders = {};

    // El sistema valida si hay que enviar el token
    if (_isToken) {
      jsonHeaders["Authorization"] = `Bearer ${BaseService.TOKEN}`;
    }

    const httpOptions = {
      headers: new HttpHeaders(jsonHeaders)
    };
    let url: string = `${environment.backend}${urlService}`;
    return new Promise((success, fail) => {
      this.http
        .put(url, data, httpOptions)
        .toPromise()
        .catch(x => {
          this.ValidExpiredToken(x)
            .then(fail)
            .then(fail);
        })
        .then(success);
    });
  }

  /**
   * r
   * @description valida que el usuario se le halla acabado el token para redirecionar al login
   * @param responseGeneral
   */
  public async ValidExpiredToken(responseGeneral) {
    return new Promise((success, fail) => {
      if (
        responseGeneral["status"] == ResponseEnum.ERROR_401 &&
        responseGeneral["error"]["error"] == "invalid_token"
      ) {
        let responseFail: IResponseService = {};
        SAlertComponent.AlertExit(MesaggeText.TEXT_EXPIRE_TOKEN).then(
          response => {
            console.clear();
            /* window.location.href =
              window.location.origin + environment.ceropapel; */
              window.location.href = MainStore.ORIGIN == 1 ? 
                                      window.location.origin + environment.ceropapel:
                                      environment.redirect;
            return fail(responseFail);
          }
        );
      }
      return success(responseGeneral);
    });
  }
}
