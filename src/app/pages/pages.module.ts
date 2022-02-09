import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ModalModule } from "ngx-modal";
import { LayoutModule } from "../shared/layout.module";
import { SharedModule } from "../shared/shared.module";
import { AssignComponent } from "./assign/assign.component";
import { ConsultAuxComponent } from "./consultaux/consultaux.component";
import { ConsultMomento1Component } from "./consultmomento1/consultmomento1.component";
import { ConsultMomento2Component } from "./consultmomento2/consultmomento2.component";
import { IndexModule } from "./index/index.module";
import { LoginComponent } from "./login/login.component";
import { AutoLoginComponent } from './auto-login/auto-login.component';
/* components */
import { PagesComponent } from "./pages.component";
import { routing } from "./pages.routing";
import { SectionPage1Component } from "./sections/section-page1/section-page1.component";
import { SectionPage10Component } from "./sections/section-page10/section-page10.component";
import { SectionPage2Component } from "./sections/section-page2/section-page2.component";
import { SectionPage3Component } from "./sections/section-page3/section-page3.component";
import { SectionPage4Component } from "./sections/section-page4/section-page4.component";
import { SectionPage5Component } from "./sections/section-page5/section-page5.component";
import { SectionPage6Component } from "./sections/section-page6/section-page6.component";
import { SectionPage7Component } from "./sections/section-page7/section-page7.component";
import { SectionPage8Component } from "./sections/section-page8/section-page8.component";
import { SectionPage9Component } from "./sections/section-page9/section-page9.component";
import { SectionUploadFilesComponent } from "./sections/section-upload-files/section-upload-files.component";
import { SectionUploadFiles2Component } from "./sections/section-upload-files2/section-upload-files2.component";
import { ConsultNacionalComponent } from "./consultanacional/consultanacional.component";
import { ConsultRegionalComponent } from "./consultaregional/consultaregional.component";
import { Form1Component } from "./form1/form1.component";
// Import ng-circle-progress
import { NgCircleProgressModule } from 'ng-circle-progress';
import { SectionPageEncComponent } from "./sections/section-pageenc/section-pageenc.component";
import { SectionVerificarUsuario } from "./sections/section-verificaUsuario/section-verificar-usuario.component";

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
    ModalModule,
    routing,
    IndexModule,
    // Specify ng-circle-progress as an import
    NgCircleProgressModule.forRoot({})
  ],
  declarations: [
    Form1Component,    
    ConsultMomento1Component,
    ConsultMomento2Component,
    ConsultAuxComponent,
    ConsultNacionalComponent,
    ConsultRegionalComponent,
    LoginComponent,
    PagesComponent,
    SectionPage1Component,
    SectionPage2Component,
    SectionPage3Component,
    SectionPage4Component,
    SectionPage5Component,
    SectionPage6Component,
    SectionPage7Component,
    SectionPage8Component,
    SectionPage9Component,
    SectionPage10Component,
    SectionPageEncComponent,
    SectionUploadFilesComponent,
    SectionUploadFiles2Component,
    AssignComponent,
    AutoLoginComponent,
    SectionVerificarUsuario
  ],
  exports: []
})
export class PagesModule { }
