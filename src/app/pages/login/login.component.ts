import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ResponseEnum } from "../../enums/ResponseEnum.enum";
import { RolsEnum } from "../../enums/RolsEnum.enum";
import {
  ILoginActionService,
  ILoginRolService,
  IResponseLoginService
} from "../../interfaces/response-login-service";
import { IResponseOautServer } from "../../interfaces/response-oaut-server";
import { IResponseService } from "../../interfaces/response-service";
import { AddressesUrlParams } from "../../parameters/addresses-url-params";
import { AuthenticationService } from "../../services/authentication.service";
import { BaseService } from "../../services/base.service";
import { NotificationService } from "../../services/notification.service";
import { SAlertComponent } from "../../shared/components/s-alert/s-alert.component";
import { OauthModel, UserModel } from "../../shared/models/user-model";
import { GetIPSevice } from "../../shared/services/getIp.service";
import { NotificationsAppService } from "../../shared/services/notifications-app.service";
import { MesaggeText } from "../../shared/texts/mesagge-text";
import { MainStore } from "../../store/main-store";
import { Utils } from "../../utils/utils";
import { MENU_ITEM } from "../menu";
import { environment } from "../../../environments/environment";
import { AuthRefreshService } from "../../shared/services/auth-refresh.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  /**
   * Variables de la vista
   */
  login: UserModel;
  constructor(
    public authService: AuthenticationService,
    private notyService: NotificationService,
    private notyApp: NotificationsAppService,
    private route: Router,
    public authRefresh: AuthRefreshService,
    private ipService: GetIPSevice
  ) {
    let self = this;

    window["OnExpired"] = function OnExpired() {
      self._OnExpired();
    };

    MainStore.db.RestData();
    MainStore.ORIGIN = 1;
    this.login = MainStore.db.GetUser();
  }

  ngOnInit() {
    let parent = document.getElementById("g-recaptcha");
    parent.innerHTML = `<div
      class="g-recaptcha"
      data-sitekey="${environment.keycaptcha}"
      data-callback="OnExpired"
      ></div>`;
    $(parent).addClass(" recaptcha-login");
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Escucha el evento del click para validar los campos y enviar la autenticación
   */
  OnClickEntry() {
    // if (!this._OnExpired()) {
    //   return SAlertComponent.AlertWarning(MesaggeText.NOT_VALID_NOT_ROBOT);
    // }
    const msg = this.ValidateFields();
    if (!msg) {
      SAlertComponent.ShowSpinner();

      let oauth: OauthModel = new OauthModel();

      oauth.username = this.login.username.toLocaleLowerCase();
      oauth.password = this.login.password;
      this.authService
        .Oauth(oauth)
        .then((response: IResponseOautServer) => {
          if (response.error == "unauthorized") {
            return SAlertComponent.AlertError(response.error_description);
          }
          BaseService.SetToken(response.access_token);
          BaseService.SetRefreshToken(response.refresh_token);
          this.authRefresh.SetTimeRefresh(response.expires_in);
          this.Login();
        })
        .catch((response: IResponseOautServer) => {
          SAlertComponent.AlertError(
            MesaggeText.TITLE_ALERT,
            response.error["error_description"]
          );
        });
    } else {
      SAlertComponent.AlertInfo("Alert", msg);
    }
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description se consume el servicio de autenticacion
   */
  Login() {
    this.authService.Login(this.login).then(
      response => {
        SAlertComponent.CloseSpinner();
        this.CheckResponse(response);
      },
      error => {
        SAlertComponent.AlertError(
          MesaggeText.TITLE_ALERT,
          MesaggeText.ERROR_CONNETION
        );
      }
    );
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Valida la respuesta que envia el servicio
   * @param response
   */
  CheckResponse(response: IResponseService): any {
    if (response.status == ResponseEnum.OK) {
      if (!response.data.applications.length) {
        SAlertComponent.AlertWarning(
          MesaggeText.TITLE_ALERT,
          MesaggeText.NOT_MENU
        );
        return;
      }
      this.LoadData(response.data);
      this.LoadMenu(response.data);
      /// Valida si el usuario de rol de fuerza comercial tiene permiso para
      /// mostrar el boton de continuar
      this.ValidCompleteFormPermitRolCommercialForce();
      if (this.login.rol == RolsEnum.COMMERCIAL_FORCE) {
        return this.route.navigateByUrl(AddressesUrlParams.PathIndex());
      }
      return this.route.navigate([AddressesUrlParams.PAGES_HOME]);
    } else if (response.status == ResponseEnum.FAILURE) {
      SAlertComponent.AlertError(
        MesaggeText.TITLE_ALERT,
        response.messageError
      );
      return;
    }
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Carga el menu en la aplicación
   * @param data
   */
  LoadMenu(data: IResponseLoginService) {
    let role: ILoginRolService = data.applications[0];
    let action: ILoginActionService = role.sections[0];
    MainStore.db.ClearMenu();
    let newList = this.FilterItemMenu(
      Utils.CopyJson(MENU_ITEM),
      action.actions
    );
    newList.forEach(x => MainStore.db.AddMenu(x));
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Filtra las opciones del menú
   * @param objs
   * @param actions
   */
  FilterItemMenu(objs: object, actions: string[]): any[] {
    let newList = [];
    for (const key in objs) {
      let pos: number = actions.findIndex(x => x == key);

      if (pos != -1) {
        let itemmenu = objs[key];
        let children = itemmenu.children;
        itemmenu.children = [];
        if (children) {
          actions.splice(pos, 1);
          itemmenu.children = this.FilterItemMenu(children, actions);
        }
        newList.push(itemmenu);
      }
    }
    return newList;
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Carga los datos basico del usuario que ingresa y el menu
   * @param data
   */
  LoadData(data: IResponseLoginService): any {
    let role: ILoginRolService = data.applications[0];
    this.login.email = data.mail;
    this.login.name = data.name;
    this.login.rol = role.roles[0].name;
    this.login.idPromotor = data.id;
    this.login.ip = window.location.hostname;
    this.login.username = this.login.username.toLocaleLowerCase();
    this.login.numDoc = data.id;
    // this.ipService.getIp(ip => {
    //   this.login.ip = ip || window.location.hostname;
    // });
    MainStore.db.SetUser(this.login);
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Valida los campos que no este vacios
   * @param msg Mensaje del error que existe
   */
  private ValidateFields(): string {
    let msg: string = "";
    if (!this.login.username) {
      msg = MesaggeText.FIELD_EMPTY_USER;
    } else if (!this.login.password) {
      msg = MesaggeText.FIELD_EMPTY_PASSWORD;
    }
    return msg;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Valida por medio de un servicio si debe o no publicar el boton continuar
   */
  private ValidCompleteFormPermitRolCommercialForce() {
    this.notyService
      .CompleteFormPermitRolCommercialForce()
      .then((response: IResponseService) => {
        MainStore.db.SetPCForceForCompleteForm(response.data.valor == 1);
        this.notyApp.ValidateBtnContinue.emit();
      })
      .catch(error => { });
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Habilitar o desahabilitar
   */
  _OnExpired() {
    var response = window["grecaptcha"].getResponse();
    if (response.length == 0) {
      return false;
    }
    return true;
  }
}
