import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { NavigationStart, Router } from "@angular/router";
import { AddressesUrlParams } from "./parameters/addresses-url-params";
import { MainStore } from "./store/main-store";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html"
})
export class AppComponent {
  constructor(private route: Router, http: HttpClient) {
    MainStore.db.SetHttpClient(http);
    this.SubscribeRouter();
  }

  /**
   * r
   * @description Escucha el cambion de url y lo envia por el vijilante de URL
   */
  SubscribeRouter() {
    this.route.events.subscribe(val => {
      if (val instanceof NavigationStart) {
        this.WatcherUrl(val.url.slice(1));
      }
    });
  }

  /**
   * r
   * @description Vigila que el usuario no fuerce el ingreso por la ruta URL
   * @param url URL string
   */
  WatcherUrl(url: string): any {
    if(!url.includes(AddressesUrlParams.AUTO_LOGIN)){
      if (url != AddressesUrlParams.LOGIN && !MainStore.db.GetUser().name) {
        this.route.navigateByUrl(AddressesUrlParams.LOGIN);
      }
    }
  }
}
