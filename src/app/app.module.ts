import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ModalModule } from "ngx-modal";
import { AppComponent } from "./app.component";
import { routing } from "./app.routing";
import { PagesModule } from "./pages/pages.module";
import { AuthenticationService } from "./services/authentication.service";
import { BaseService } from "./services/base.service";
import { ConsultService } from "./services/consult.service";
import { FormService } from "./services/form.service";
import { NotificationService } from "./services/notification.service";
import { SectionsService } from "./services/sections.service";
import { AuthRefreshService } from "./shared/services/auth-refresh.service";
import { GetIPSevice } from "./shared/services/getIp.service";
import { NotificationsAppService } from "./shared/services/notifications-app.service";
import { ResponseUiService } from "./utils/response-ui.service";
import { CooperadorService } from "./services/cooperador.service";

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    PagesModule,
    routing
  ],
  providers: [
    BaseService,
    AuthenticationService,
    FormService,
    SectionsService,
    NotificationService,
    ResponseUiService,
    NotificationsAppService,
    ConsultService,
    GetIPSevice,
    AuthRefreshService,
    CooperadorService
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
