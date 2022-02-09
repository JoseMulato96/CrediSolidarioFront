import { Routes, RouterModule } from "@angular/router";
import { PagesComponent } from "./pages/pages.component";
import { AddressesUrlParams } from "./parameters/addresses-url-params";

const appRoutes: Routes = [
  {
    path: "",
    redirectTo: AddressesUrlParams.LOGIN,
    pathMatch: "full"
  },
  {
    path: "**",
    redirectTo: AddressesUrlParams.PAGES_HOME + "/index"
  }
];

export const routing = RouterModule.forRoot(appRoutes, { useHash: true });
