import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ResponseEnum } from "../../../enums/ResponseEnum.enum";
import { BaseSection } from "../../../extends/base-section";
import { IFormSection } from "../../../interfaces/form-section";
import { IResponseService } from "../../../interfaces/response-service";
import { AddressesUrlParams } from "../../../parameters/addresses-url-params";
import { SAlertComponent } from "../../../shared/components/s-alert/s-alert.component";
import {
  AttachModel,
  SAttachementComponent
} from "../../../shared/components/s-attachement/s-attachement.component";
import { SInputComponent } from "../../../shared/components/s-input/s-input.component";
import { InputModel } from "../../../shared/extends-components/binput-component";
import { NotificationsAppService } from "../../../shared/services/notifications-app.service";
import { MesaggeText } from "../../../shared/texts/mesagge-text";
import { MainStore } from "../../../store/main-store";
import { ResponseUiService } from "../../../utils/response-ui.service";
import { Utils } from "../../../utils/utils";
import { Section1Model } from "../../../shared/models/section1-model";

@Component({
  selector: "section-upload-files",
  templateUrl: "./section-upload-files.component.html",
  styleUrls: ["./section-upload-files.component.scss"]
})
export class SectionUploadFilesComponent extends BaseSection
  implements OnInit, IFormSection {
  _FormDataFileDocument: File;
  _FormDataFileSoportIngress: File;
  _FormDataFileSoportStudy: File;
  _OnlyReadView: boolean;
  DOC_ID: string = "{0} - Cedula";
  DOC_STUDY: string = "{0} - Sop Estudios";
  DOC_INGRESO: string = "{0} - Sop Ingresos";

  constructor(
    private responseUI: ResponseUiService,
    private notyAPP: NotificationsAppService,
    private params: ActivatedRoute
  ) {
    super();
    this._toggleOption = 2;
    // Se commenta el bloque de codigo mientras el cliente define lo de docuwer
    // MainStore.db.GetTypeLoadFiles().then((response: IResponseService) => {
    //   /**
    //    * Si la respuesta de data es 0 el valor debe asignar el valor 2 para ajuntar datos
    //    * SI la respuesta de data es 1 el valor debe asugnar el valor 1 para docuwer
    //    */
    //   this._toggleOption = response.data ? 1 : 2;
    // });
    this._OnlyReadView = this.params.snapshot.data["OnlyReadView"];
  }

  ngOnInit() {
    // MainStore.db.GetDocuwareKey().then(docuwareKey => {
    //   this.InputDocumentKey.SetData(docuwareKey || "");
    // });

    this.notyAPP.ValidateBtnContinue.emit();
  }

  ngAfterContentInit() {
    this.IsLockSection();
    this.InputDocument.Skeleton.Name = "";
    this.InputSoportIngress.Skeleton.Name = "";
    this.InputSoportIngress.Skeleton.Name = "";
    MainStore.db
      .GetFilesAdjuntNames()
      .then(async (response: IResponseService) => {
        let section: Section1Model = await MainStore.db.GetSection1();
        this.responseUI.CheckResponseForError(response).then(() => {
          if (response.status == ResponseEnum.OK) {
            let list: string[] = response.data;

            if (list && list.length) {
              this.InputDocument.Skeleton.Name =
                list.find(x =>
                  x.startsWith(
                    this.DOC_ID.replace("{0}", section.numeroIdentificacion)
                  )
                ) || "";

              this.InputSoportStudy.Skeleton.Name =
                list.find(x =>
                  x.startsWith(
                    this.DOC_STUDY.replace("{0}", section.numeroIdentificacion)
                  )
                ) || "";

              this.InputSoportIngress.Skeleton.Name =
                list.find(x =>
                  x.startsWith(
                    this.DOC_INGRESO.replace(
                      "{0}",
                      section.numeroIdentificacion
                    )
                  )
                ) || "";
            }
          }
        });
      });
  }

  @ViewChild("InputDocumentKey")
  InputDocumentKey: SInputComponent;

  @ViewChild("InputDocument")
  InputDocument: SAttachementComponent;

  @ViewChild("InputSoportIngress")
  InputSoportIngress: SAttachementComponent;

  @ViewChild("InputSoportStudy")
  InputSoportStudy: SAttachementComponent;

  filterfile: string = "image/png, .jpeg, .jpg, image/gif, .pdf";
  filterMaxSize: number = 4;

  FieldDocument: AttachModel = {
    Label: "Documento de Identidad",
    Placeholder: "Ej. file.png",
    FilesAccept: this.filterfile,
    MaxSizeFile: this.filterMaxSize
  };
  FieldSoportIngress: AttachModel = {
    Label: "Soporte de Ingresos",
    Placeholder: "Ej. file.png",
    FilesAccept: this.filterfile,
    MaxSizeFile: this.filterMaxSize
  };
  FieldSoportStudy: AttachModel = {
    Label: "Soporte de Estudios",
    Placeholder: "Ej. file.png",
    FilesAccept: this.filterfile,
    MaxSizeFile: this.filterMaxSize
  };

  FieldDocumentKey: InputModel = {
    Label: "Docuware Key",
    Placeholder: "FCP0001161022018",
    ReadOnly: true
  };

  BtnSee = {
    Label: "Ver",
    IconCss: "eye"
  };

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description retorna la direccion previo
   */
  async Prev(): Promise<any> {
    return AddressesUrlParams.SECTION_06;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description retorna la direccion siguiente
   */
  async Next(): Promise<any> {
    return;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description guardar la informacion en el servidor
   */
  async Save(): Promise<any> {
    if (
      !this._FormDataFileDocument &&
      !this._FormDataFileSoportIngress &&
      !this._FormDataFileSoportStudy
    ) {      
      this.notyAPP.UpdateFiles.emit();
      return true;
    }

    return new Promise(async (seccess, fail) => {
      let formData = new FormData();
      let section: Section1Model = await MainStore.db.GetSection1();

      this._FormDataFileDocument &&
        formData.append(
          "files",
          this._FormDataFileDocument,
          this.DOC_ID.replace("{0}", section.numeroIdentificacion) +
          "." +
          Utils.ExtracExtFile(this._FormDataFileDocument.name)
        );

      this._FormDataFileSoportStudy &&
        formData.append(
          "files",
          this._FormDataFileSoportStudy,
          this.DOC_STUDY.replace("{0}", section.numeroIdentificacion) +
          "." +
          Utils.ExtracExtFile(this._FormDataFileSoportStudy.name)
        );

      this._FormDataFileSoportIngress &&
        formData.append(
          "files",
          this._FormDataFileSoportIngress,
          this.DOC_INGRESO.replace("{0}", section.numeroIdentificacion) +
          "." +
          Utils.ExtracExtFile(this._FormDataFileSoportIngress.name)
        );

      formData.append("user", MainStore.db.GetUser().username);
      formData.append("ip", MainStore.db.GetUser().ip);
      MainStore.db
        .SetSectionFiles(formData)
        .then((response: IResponseService) => {
          this.responseUI.CheckResponseForError(response);
          if (response.status == ResponseEnum.OK) {
            this.notyAPP.UpdateFiles.emit();
            SAlertComponent.AlertOk(response.message);
          }
        })
        .catch(error => {
          this.responseUI.CheckResponseForError(error);
        });
    });
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description valida los componente la informacion contenida
   */
  async Valid(): Promise<any> {
    // let valid: boolean = this.ValidFields([
    //   this.InputDocument,
    //   this.InputSoportIngress,
    //   this.InputSoportStudy
    // ]);    
    return true;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description no carga nada
   */
  async Load(): Promise<any> {
    return true;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description hace el switch del taba de adjuntar y docuwer
   *  */
  _OnClickOptionAbjuntar() {
    this._toggleOption = 1;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description hace el switch del taba de adjuntar y docuwer
   */
  _OnClickOptionDigital() {
    this._toggleOption = 2;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description descarga los archivo adjunto
   */
  OnSeeFilesDownload() {
    SAlertComponent.ShowSpinner();
    MainStore.db
      .GetFilesAdjunt()
      .then((blob: Blob) => {
        Utils.DonwloadFile(blob, "documentos.zip");
        SAlertComponent.CloseSpinner();
      })
      .catch(error => {
        Utils.BlobToStrign(error.error)
          .then((text: string) => SAlertComponent.AlertError(text))
          .catch(error => {
            SAlertComponent.AlertError(MesaggeText.ERROR_CONNETION);
          });
        SAlertComponent.CloseSpinner();
      });
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description obtiene el valor de los archivos
   * @param file
   */
  OnSelectFileDocument(file: File) {
    this._FormDataFileDocument = file;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description obtiene el valor de los archivos
   * @param file
   */
  OnSelectFileSoportIngress(file: File) {
    this._FormDataFileSoportIngress = file;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description obtiene el valor de los archivos
   * @param file
   */
  OnSelectFileSoportStudy(file: File) {
    this._FormDataFileSoportStudy = file;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description copiar el valor
   */
  CopyToClir() {
    Utils.CopyToClipboard(this.InputDocumentKey.GetData());
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description bloquea los campos
   */
  IsLockSection() {
    if (!MainStore.db.GetLockAllSectionM1().sectionFiles) {
      return;
    }
    super.IsLockSection([
      this.InputDocumentKey,
      this.InputDocument,
      this.InputSoportIngress,
      this.InputSoportStudy
    ]);
  }
}
