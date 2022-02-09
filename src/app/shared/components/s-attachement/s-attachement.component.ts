import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output
} from "@angular/core";
import {
  BaseComponent,
  BaseModel
} from "../../extends-components/base-component";
import { MesaggeText } from "../../texts/mesagge-text";
import { SAlertComponent } from "../s-alert/s-alert.component";

@Component({
  selector: "s-attachement",
  templateUrl: "./s-attachement.component.html",
  styleUrls: ["./s-attachement.component.scss"]
})
export class SAttachementComponent extends BaseComponent implements OnInit {
  inputfile: Element;
  Skeleton: AttachModel;
  element: any;

  constructor(private el: ElementRef) {
    super();
  }

  ngAfterViewInit() {
    let inputElements = this.el.nativeElement;
    let inputsEl: HTMLCollection = inputElements.getElementsByTagName("input");

    this.inputfile = inputsEl.item(1);
    this.Skeleton.MaxSizeFile = this.Skeleton.MaxSizeFile || Infinity;
    this.Skeleton.MinSizeFile = this.Skeleton.MinSizeFile || -Infinity;
  }

  ngOnInit() {}

  @Output()
  EvtSelectFile: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description coloca estado del componente disable y sin poderlo usar
   * @param value
   */
  SetDisable(value) {
    super.SetDisable(value);
    this.Skeleton.Disable = value;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description limpia el contenido
   */
  Clear(): any {
    this.element && this.element.pop();
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description escucha cuando ha selecionado un archivo
   * @param $event
   */
  OnChangeFile($event) {
    this.element = $event.target.files;
    let file: File = $event.target.files.item(0);

    if (!file) {
      this.EvtSelectFile.emit(null);
      return;
    }

    if (!this.ValidExt(file)) {
      return SAlertComponent.AlertWarning(
        MesaggeText.TEXT_TYPE_FORMAT_ERROR + " " + this.Skeleton.FilesAccept
      );
    }

    if (!this.ValidSize(file)) {
      SAlertComponent.AlertWarning(
        MesaggeText.FILE_SIZE_NOT_SOPORT.replace("{0}", file.name)
          .replace("{1}", (file.size / (1024 * 1000)).toString())
          .replace(
            "{2}",
            this._ForReplace(this.Skeleton.MinSizeFile, -Infinity, "0")
          )
          .replace(
            "{3}",
            this._ForReplace(this.Skeleton.MaxSizeFile, Infinity, "")
          )
      );
      return;
    }
    this.Skeleton.Data = file.name;
    this.EvtSelectFile.emit(file);
  }

  /**
   * @description valida que el valor sea diferente el defaultvalor y sino coloca el otro valor por defecto que se le envia por parmetros
   * @param value
   * @param defaultvalu
   * @param _default
   */
  _ForReplace(value, defaultvalu, _default): string {
    return (value == defaultvalu ? "" : value).toString() || _default;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Valida la extencion con base a la configuracion dada
   * @param file
   */
  ValidExt(file: File) {
    let ext = file.name.split(".").reverse()[0];
    return !!(
      this.Skeleton.FilesAccept.search(new RegExp(ext.toLowerCase())) + 1
    );
  }

  /**
   * valida el tamaño del archivo que no supere el valor de lo configurado
   * @param file
   */
  ValidSize(file: any): any {
    let size = file.size / (1024 * 1000);
    return this.Skeleton.MaxSizeFile > size && this.Skeleton.MinSizeFile < size;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description escucha el click del boton exportar para abrir la ventana
   * @param e
   */
  OnClickFile(e) {
    if (this.inputfile) {
      this.inputfile["value"] = "";
      this.inputfile["click"]();
    }
  }
}

export class AttachModel extends BaseModel {
  FilesAccept?: string = "";
  Placeholder?: string = "";
  MaxSizeFile?: number = Infinity;
  MinSizeFile?: number = -Infinity;
  Disable?: boolean = false;
  Name?: string = "";
}
