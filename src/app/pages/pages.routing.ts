import { Routes, RouterModule } from "@angular/router";
import { PagesComponent } from "./pages.component";
import { LoginComponent } from "./login/login.component";
import { AddressesUrlParams } from "../parameters/addresses-url-params";
import { SectionPage1Component } from "./sections/section-page1/section-page1.component";
import { SectionPage2Component } from "./sections/section-page2/section-page2.component";
import { SectionPage3Component } from "./sections/section-page3/section-page3.component";
import { SectionPage6Component } from "./sections/section-page6/section-page6.component";
import { SectionPage5Component } from "./sections/section-page5/section-page5.component";
import { SectionPage4Component } from "./sections/section-page4/section-page4.component";
import { SectionPage7Component } from "./sections/section-page7/section-page7.component";
import { SectionPage8Component } from "./sections/section-page8/section-page8.component";
import { SectionPage9Component } from "./sections/section-page9/section-page9.component";
import { SectionPage10Component } from "./sections/section-page10/section-page10.component";
import { SectionUploadFilesComponent } from "./sections/section-upload-files/section-upload-files.component";
import { ConsultMomento1Component } from "./consultmomento1/consultmomento1.component";
import { ConsultMomento2Component } from "./consultmomento2/consultmomento2.component";
import { AssignComponent } from "./assign/assign.component";
import { SectionUploadFiles2Component } from "./sections/section-upload-files2/section-upload-files2.component";
import { ConsultAuxComponent } from "./consultaux/consultaux.component";
import { IndexComponent } from "./index/index.component";
import { AutoLoginComponent } from "./auto-login/auto-login.component";
import { ConsultNacionalComponent } from "./consultanacional/consultanacional.component";
import { ConsultRegionalComponent } from "./consultaregional/consultaregional.component";
import { Form1Component } from "./form1/form1.component";
import { SectionPageEncComponent } from "./sections/section-pageenc/section-pageenc.component";
import { SectionVerificarUsuario } from "./sections/section-verificaUsuario/section-verificar-usuario.component";

export const childRoutes: Routes = [
  {
    path: AddressesUrlParams.LOGIN,
    component: LoginComponent
  },
  {
    path: AddressesUrlParams.AUTO_LOGIN,
    component: AutoLoginComponent
  },
  {
    path: AddressesUrlParams.PAGES_HOME,
    component: PagesComponent,
    children: [
      {
        path: AddressesUrlParams.PAGES_QUERY_REQUEST_MOMENT1,
        component: ConsultMomento1Component
      },
      {
        path: AddressesUrlParams.PAGES_QUERY_REQUEST_MOMENT2,
        component: ConsultMomento2Component
      },
      {
        path: AddressesUrlParams.PAGES_ASSIGN_FORM,
        component: AssignComponent
      },
      {
        path: AddressesUrlParams.PAGES_QUERY_AUX,
        component: ConsultAuxComponent
      },
      {
        path: AddressesUrlParams.PAGES_QUERY_LIDER_NACIONAL,
        component: ConsultNacionalComponent
      },
      {
        path: AddressesUrlParams.PAGES_QUERY_LIDER_REGIONAL,
        component: ConsultRegionalComponent
      },

      // {
      //   path: AddressesUrlParams.PAGES_FORM1,
      //   component: Form1Component,
      //   children: [
      //     {
      //       path: AddressesUrlParams.SECTION_01,
      //       component: SectionPage1Component
      //     },
      //     {
      //       path: AddressesUrlParams.SECTION_02,
      //       component: SectionPage2Component
      //     },
      //     {
      //       path: AddressesUrlParams.SECTION_03,
      //       component: SectionPage3Component
      //     },
      //     {
      //       path: AddressesUrlParams.SECTION_04,
      //       component: SectionPage4Component
      //     },
      //     {
      //       path: AddressesUrlParams.SECTION_05,
      //       component: SectionPage5Component
      //     },
      //     {
      //       path: AddressesUrlParams.SECTION_06,
      //       component: SectionPage6Component
      //     },
      //     {
      //       path: AddressesUrlParams.SECTION_UPLOAD_FILES,
      //       component: SectionUploadFilesComponent
      //     }
      //   ]
      // },      
      // {
      //   path: AddressesUrlParams.PAGES_FORM2,
      //   component: Form2Component,
      //   children: [
      //     {
      //       path: AddressesUrlParams.SECTION_07,
      //       component: SectionPage7Component
      //     },
      //     {
      //       path: AddressesUrlParams.SECTION_08,
      //       component: SectionPage8Component
      //     },
      //     {
      //       path: AddressesUrlParams.SECTION_09,
      //       component: SectionPage9Component
      //     },
      //     {
      //       path: AddressesUrlParams.SECTION_10,
      //       component: SectionPage10Component
      //     },
      //     {
      //       path: AddressesUrlParams.SECTION_UPLOAD_FILES,
      //       component: SectionUploadFiles2Component,
      //       data: { OnlyReadView: false }
      //     }
      //   ]
      // },
      {
        path: AddressesUrlParams.PAGES_FORM,
        component: Form1Component,
        children: [
          {
            path: AddressesUrlParams.SECTION_01,
            component: SectionPage1Component
          },
          {
            path: AddressesUrlParams.SECTION_02,
            component: SectionPage2Component
          },
          {
            path: AddressesUrlParams.SECTION_03,
            component: SectionPage3Component
          },
          {
            path: AddressesUrlParams.SECTION_04,
            component: SectionPage4Component
          },
          {
            path: AddressesUrlParams.SECTION_05,
            component: SectionPage5Component
          },
          {
            path: AddressesUrlParams.SECTION_06,
            component: SectionPage6Component
          },
          {
            path: AddressesUrlParams.SECTION_UPLOAD_FILES,
            component: SectionUploadFilesComponent
          },
          {
            path: AddressesUrlParams.SECTION_07,
            component: SectionPage7Component
          },
          {
            path: AddressesUrlParams.SECTION_08,
            component: SectionPage8Component
          },
          {
            path: AddressesUrlParams.SECTION_09,
            component: SectionPage9Component
          },
          {
            path: AddressesUrlParams.SECTION_10,
            component: SectionPage10Component
          },
          {
            path: AddressesUrlParams.SECTION_ENC,
            component: SectionPageEncComponent
          },
          {
            path: AddressesUrlParams.SECTION_UPLOAD_FILES,
            component: SectionUploadFiles2Component,
            data: { OnlyReadView: false }
          },
          {
            path: AddressesUrlParams.SECTION_VERIFIC_USUARIO,
            component: SectionVerificarUsuario            
          }
        ]
      },
      //{ path: "", redirectTo: AddressesUrlParams.LOGIN, pathMatch: "full" },
      { path: "index", component: IndexComponent }
    ]
  }
];

export const routing = RouterModule.forChild(childRoutes);
