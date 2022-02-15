import { Router, NavigationStart } from "@angular/router";

import { AddressesUrlParams } from "../parameters/addresses-url-params";

import { IFormSection } from "../interfaces/form-section";
import { MainStore } from "../store/main-store";
import { NotificationsAppService } from "../shared/services/notifications-app.service";
import { environment } from "../../environments/environment";

export class BaseForm {
  constructor(public route: Router, public notyApp: NotificationsAppService) {
    this.route.events.subscribe(value => {
      if (value instanceof NavigationStart) {
        this.CheckeButtonFinsh(value.url.slice(1));
      }
    });
    this.notyApp.ensablePage.subscribe(x => {
      this.EnableAllSession(x);
    });
  }

  /**
   * r
   * @description habilidata las secciones dar click
   * @param url
   */
  EnableAllSession(url: string) {
    this.CheckeButtonFinsh(url);
  }

  /**
   * @description El sistema en ruta la url para ir a la session enviada
   * @param sectionUrl
   */
  GoSection(sectionUrl: string) {
    let url = AddressesUrlParams.PathSectionForm(
      sectionUrl,
      AddressesUrlParams.PAGES_FORM
    );
    this.route.navigateByUrl(url);
    return url;
  }

  ViewCurrent: IFormSection;

  /**
   * 
   * @description Escucha la vista (Section) actual que agrego al body al formulario
   * @param view Vista Actual
   */
  OnRouterOutletActivate(view) {
    this.ViewCurrent = view as IFormSection;
  }

  /**
   * 
   * @description Escucha el evento del boton Anterior
   */
  async OnClickPrev($event) {
    if (!this.ViewCurrent) {
      return false;
    }

    let nextSection = await this.ViewCurrent.Prev();
    MainStore.db.SavePage(this.GoSection(nextSection));
  }
  /**
   * 
   * @description Escucha el evento del boton guardar
   */
  async OnClickSave($event) {
    if (!this.ViewCurrent) {
      return false;
    }
    let isValid = await this.ViewCurrent.Valid();
    if (isValid) {
      let isSaved = await this.ViewCurrent.Save();
      return isSaved;
    }
    return false;
  }
  /**
   * 
   * @description Escucha el evento del boton finalizar
   */
  async OnClickFinsh($event) {
    if (!this.ViewCurrent) {
      return false;
    }
  }

  /**
   * 
   * @description Escucha el evento del boton cancelar
   * @param $event
   */
  async OnClickCancel($event) {
    if (!this.ViewCurrent) {
      return true;
    }
  }

  /**
   * @author Jorge Luis Caviedes
   * @description El
   */
  async OnClickNext($event) {
    if (!this.ViewCurrent) {
      return false;
    }
    let isSaved = await this.OnClickSave(null);

    if (isSaved) {
      let nextSection = await this.ViewCurrent.Next();

      MainStore.db.SavePage(this.GoSection(nextSection));
    }
  }

  /**
   * 
   * @description Valida si esta en la ultima pagina para mostrar u ocultar el boton finalizar
   * @param value
   */
  CheckeButtonFinsh(value: string) {
    if (value == AddressesUrlParams.SECTION_06) {
      this.btnFinsh.Visible = true;
    } else {
      this.btnFinsh.Visible = false;
    }
  }

  BlockBtn: boolean = environment.blockSubMenu;

  btnPrev: any = {
    Label: "Atras"
  };
  btnSave: any = {
    Label: "Guardar"
  };
  btnFinsh: any = {
    Label: "Finalizar",
    Visible: false
  };
  btnNext: any = {
    Label: "Siguiente"
  };
  btnCancel: any = {
    Label: "Cancelar"
  };

  btnGoM1: any = {
    Hidden: true,
    Label: "Verificar M1"
  };

  ProgressCirle = {
    NumberProgress: 1,
    Items: [
      {
        Label: "1"
      },
      {
        Label: "1"
      }
    ]
  };
}
