import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";

@Component({
  selector: "s-submenu",
  templateUrl: "./s-submenu.component.html",
  styleUrls: ["./s-submenu.component.scss"]
})
export class SSubMenuComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  /**
   * r
   * @description se subcribe para escuchar el contenido de la url
   */
  ngAfterContentInit() {
    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        this.WatcherUrl(val.url.split("/").reverse()[0]);
      }
    });
    this.WatcherUrl(this.router.url.split("/").reverse()[0]);
  }

  /**
   * r
   * @description escucha el estado de la url para pintarse el item del sub-menu como selecionado
   * @param url string
   */
  WatcherUrl(url: string): any {
    this.SelectItemMenu(
      this._Items.find(x => {
        return x.Link.includes(url);
      })
    );
  }

  /**
   * r
   * @description escucha el item selecionado y valida que si esta disponible para emitir el evento
   * @param item
   */
  OnClickLink(item: ItemSubMenu) {
    if (item.Disable) {
      return;
    }

    this.SelectItemMenu(item);
    this.router.navigateByUrl(item.Link);
  }

  /**
   * r
   * @description seleciona el item del sub-menu y pinta la selecion
   * @param item
   */
  SelectItemMenu(item: ItemSubMenu) {
    if (!item) {
      return;
    }
    if (this._ItemSelect) {
      this._ItemSelect._active = false;
    }
    this._ItemSelect = item;
    this._ItemSelect._active = true;
    this.EvtClickItemMenu.emit(item);
  }

  _ItemSelect: ItemSubMenu;
  @Output()
  EvtClickItemMenu: EventEmitter<any> = new EventEmitter<any>();

  @Input("itemsmenu")
  _Items: ItemSubMenu[] = [];
}

export class ItemSubMenu {
  Label: string;
  Link: string;
  Disable?: boolean;
  IconCls: string;
  _active?: boolean;
}
