import { Component } from "@angular/core";
import { MainStore } from "../../../store/main-store";
import { UserModel } from "../../models/user-model";
import { GlobalService } from "../../services/global.service";

@Component({
  selector: "pages-top",
  templateUrl: "./pages-top.component.html",
  styleUrls: ["./pages-top.component.scss"]
})
export class PagesTopComponent {
  user: UserModel;

  avatarImgSrc: string = "assets/images/logo_coomeva.png";
  userName: string;
  userPost: string;

  sidebarToggle: boolean = false;
  tip = { ring: true, email: true };

  constructor(private _globalService: GlobalService) {
    this.user = MainStore.db.GetUser();
    this.userName = this.user.username;
    this.userPost = this.user.username;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description envia abrir o cerrar el menu
   */
  public _sidebarToggle() {
    this._globalService.data$.subscribe(
      data => {
        if (data.ev === "sidebarToggle") {
          this.sidebarToggle = data.value;
        }
      },
      error => {

      }
    );
    this._globalService.dataBusChanged("sidebarToggle", !this.sidebarToggle);
  }
}
