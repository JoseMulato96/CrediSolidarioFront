import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserModel } from '../../shared/models/user-model';
import { environment } from '../../../environments/environment';
import { AddressesUrlParams } from '../../parameters/addresses-url-params';
import { BaseService } from '../../services/base.service';
import { IResponseOautServer } from '../../interfaces/response-oaut-server';
import { AuthenticationService } from '../../services/authentication.service';
import { AuthRefreshService } from '../../shared/services/auth-refresh.service';
import { CooperadorService } from '../../services/cooperador.service';
import { IResponseService } from '../../interfaces/response-service';
import { ResponseEnum } from '../../enums/ResponseEnum.enum';
import { NotificationService } from '../../services/notification.service';
import { NotificationsAppService } from '../../shared/services/notifications-app.service';
import { MainStore } from '../../store/main-store';
import { IResponseLoginService, IResponseCooperadorService } from '../../interfaces/response-login-service';
import { Utils } from '../../utils/utils';
import { MENU_ITEM } from '../menu';
import { MENURED_ITEM } from '../menured';

@Component({
  selector: 'app-auto-login',
  templateUrl: './auto-login.component.html',
  styleUrls: ['./auto-login.component.scss']
})
export class AutoLoginComponent implements OnInit {
  private token: string;
  private refresh: string;
  private userid: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private route: Router,
    public authService: AuthenticationService,
    public authRefresh: AuthRefreshService,
    public coopServi: CooperadorService,
    private notyService: NotificationService,
    private notyApp: NotificationsAppService
    ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.token = params["token"];
      this.refresh = params["refresh"];
      this.userid = params["userId"];
      if (this.token && this.refresh && this.userid) {
        this.AutoAuthentication();
      } else {
        return this.RealoadIndex();
      }
    });
  }

  RealoadIndex() {
    window.location.href = environment.redirect;
    return;
  }

  private login: UserModel = new UserModel();

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Generar la autenticación automaticamente
   */  
  AutoAuthentication() {
    this.RefreshToken().then(() => {
      this.ValidateRedCooperador().then(() => {
        return this.route.navigateByUrl(AddressesUrlParams.GetPathFormStart());
      });
    });
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Refresca el token
   */
  async RefreshToken() {
    return new Promise(success => {
      BaseService.SetToken(this.token);
      BaseService.SetRefreshToken(this.refresh);

      this.authService
        .RefreshToken()
        .then((response: IResponseOautServer) => {
          BaseService.SetToken(response.access_token);
          BaseService.SetRefreshToken(response.refresh_token);
          this.authRefresh.SetTimeRefresh(response.expires_in);
          success();
        })
        .catch(() => {
          this.RealoadIndex();
        });
    });
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Validar en red cooperamos
   */
  async ValidateRedCooperador() {
    return new Promise((success, fail) => {
      this.coopServi
        .GetDataCooperador(this.userid)
        .then((response: IResponseService) => {
          if (response.status == ResponseEnum.OK) {
            this.CheckResponse(response);
            success();
            return;
          } else {
            this.RealoadIndex();
          }
        })
        .catch(() => {
          this.RealoadIndex();
        });
    });
  }

  /**
  * @author Jorge Luis Caviedes Alvarado
  * @description Valida la respuesta que envia el servicio
  * @param response
  */
  CheckResponse(response: IResponseService): any {
    MainStore.ORIGIN = 0
    this.LoadData(response.data);
    this.LoadMenu(response.data);
    /// Valida si el usuario de rol de fuerza comercial tiene permiso para
    /// mostrar el boton de continuar
    this.ValidCompleteFormPermitRolCommercialForce();
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
   * @author Jorge Luis Caviedes Alvarado
   * @description Carga el menu en la aplicación
   * @param data
   */
  LoadMenu(data: IResponseLoginService) {
    MainStore.db.ClearMenu();
    let newList = this.FilterItemMenu(
      Utils.CopyJson(MENURED_ITEM),
      ["*"]
      // ["Consultar Solicitud"
      //   , "Crear Solicitud"
      //   , "Gestion de solicitud"
      //   , "Gestion Agente"
      //   , "Continuar Solicitud"
      //   , "Gestion Agente"
      //   , "Gestion Incidencias"
      //   , "Asignar Solicitud"]
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

      let pos: number = actions.findIndex(x => x == key || x == "*");
      if (pos != -1) {
        let itemmenu = objs[key];
        let children = itemmenu.children;
        itemmenu.children = [];
        if (children) {
          actions[pos] !== "*" && actions.splice(pos, 1);
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
  LoadData(data: IResponseCooperadorService) {
    // let role: ILoginRolService = data.applications[0];
    this.login.email = data.email;
    this.login.name = Utils.RemoveMoreSpace(
      data.firstnName +
      " " +
      data.secondName +
      " " +
      data.firstSurname +
      " " +
      data.secondSurname
    );
    this.login.rol = "all"; // role.roles[0].name;?????
    /// si el idPromotor es -1 es que no existe
    this.login.idPromotor = parseInt(data.participantId || "-1");
    this.login.username = data.participantId || "-1";
    this.login.ip = window.location.hostname;
    this.login.username = this.login.username.toLocaleLowerCase();
    this.login.codOffice = data.codOffice;
    // this.ipService.getIp(ip => {
    //   this.login.ip = ip || window.location.hostname;
    // });
    MainStore.db.SetUser(this.login);
  }
}
