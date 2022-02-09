import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { MainStore } from "../../../store/main-store";
import { SAlertComponent } from "../../components/s-alert/s-alert.component";
import { UserModel } from "../../models/user-model";
import { GlobalService } from "../../services/global.service";
import { MesaggeText } from "../../texts/mesagge-text";

@Component({
  selector: "right-config",
  templateUrl: "./right-config.component.html",
  styleUrls: ["./right-config.component.scss"]
})
export class RightConfigComponent implements OnInit {
  isConfigToggle: boolean = false;
  userName: string;
  avatarSrc: string;
  constructor(private _globalService: GlobalService, private route: Router) {
    let user: UserModel = MainStore.db.GetUser();
    this.userName = user.username;
  }

  ngOnInit() {}

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description cierra o abre el menu
   */
  configToggle() {
    this.isConfigToggle = !this.isConfigToggle;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description el sistema escucha cuando seleciona el boton salir
   */
  OnExitSeccion() {
    SAlertComponent.Confirm(
      MesaggeText.TEXT_EXIT_APP,
      false,
      MesaggeText.TITLE_ALERT
    ).then(response => {
      if (response) {
       
        //window.location.href = window.location.origin + environment.ceropapel;
        window.location.href = MainStore.ORIGIN == 1 ? 
                                      window.location.origin + environment.ceropapel:
                                      environment.redirect;
      }
    });
  }

  btnExit = {
    Label: "Salir"
  };
}
