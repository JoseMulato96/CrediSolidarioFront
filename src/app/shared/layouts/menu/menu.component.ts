import { Component, Input } from "@angular/core";
import { collapse } from "../../animation/collapse-animate";
import { GlobalService } from "../../services/global.service";
import { NotificationsAppService } from "../../services/notifications-app.service";

@Component({
  selector: "du-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
  animations: [collapse]
})
export class MenuComponent {
  @Input()
  menuInfo: any;

  constructor(
    private _globalService: GlobalService,
    private notyApp: NotificationsAppService
  ) {}

  /**
   * r
   * @description abre o cierra el sub menu
   * @param item
   */
  isToggleOn(item) {
    item.toggle === "on" ? (item.toggle = "off") : (item.toggle = "on");
  }

  /**
   * r
   * @description envia el item del menu selecionado
   * @param item
   */
  _selectItem(item) {
    this.notyApp.MenuItemClick.emit(item);

    this._globalService.dataBusChanged("isActived", item);
    this._globalService.dataBusChanged("sidebarToggle", false);
  }
}
