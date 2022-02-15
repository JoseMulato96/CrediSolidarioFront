import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserModel, OauthModel } from "../shared/models/user-model";
import { BaseService } from "./base.service";
import { environment } from "../../environments/environment";

@Injectable()
export class AuthenticationService extends BaseService {
  constructor(
    public http: HttpClient //  public local: Location
  ) {
    super(http);
  }
  /**
   * El Sistema solicita el logeo
   * https://api.ipify.org?format=json para obtener la IP
   */
  public Login(data: UserModel) {
    let value = {
      username: data.username.toLocaleLowerCase(),
      password: data.password,
      ip: "127.0.0.0"
    };
    // let IP: string = this.local.hostname;
    // value.ip = IP;
    return this.Post("login", value, false);
  }

  /**
   * r
   * @description servicio que se conecta oauth y obtener el token
   * @param data
   */
  public Oauth(data: OauthModel) {
    let jsonHeaders = {};

    jsonHeaders = {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic Y29vbWV2YS1jbGllbnQ6Y29vbWV2YS1zZWNyZXQ="
    };

    let httpOptions = {
      headers: new HttpHeaders(jsonHeaders)
    };

    let url: string = `${environment.backend}oauth/token?password=${
      data.password
      }&username=${data.username}&grant_type=password`;
    return this.http.post(url, data, httpOptions).toPromise();
  }

  public RefreshToken() {
    let jsonHeaders = {};

    jsonHeaders = {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic Y2Vyb3BhcGVscmRhLWNsaWVudDpjZXJvcGFwZWxyZGEtc2VjcmV0"
      
    };
    //Authorization: "Basic Y29vbWV2YS1jbGllbnQ6Y29vbWV2YS1zZWNyZXQ="

    let httpOptions = {
      headers: new HttpHeaders(jsonHeaders)
    };
    let url: string = `${environment.backend}oauth/token?grant_type=refresh_token&refresh_token=${BaseService.GetRefreshToken()}`;
    return this.http.post(url, {}, httpOptions).toPromise();

  }
}
