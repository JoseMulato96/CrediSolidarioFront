import { Injectable } from "@angular/core";
import { SAlertComponent } from "../shared/components/s-alert/s-alert.component";
import { MesaggeText } from "../shared/texts/mesagge-text";
import { ResponseEnum } from "../enums/ResponseEnum.enum";

@Injectable()
export class ResponseUiService {
  constructor() {}

  async CheckResponseForError(error: any) {
    if (!error["ok"] && error["statusText"] == "Unknown Error") {
      SAlertComponent.AlertError(
        "",
        error["messageError"] || MesaggeText.ERROR_CONNETION
      );
    }
    if (error["status"] == ResponseEnum.FAILURE) {
      SAlertComponent.AlertError("Error", error["messageError"]);
    }
    return error;
  }
}
