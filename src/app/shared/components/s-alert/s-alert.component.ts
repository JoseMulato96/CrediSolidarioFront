import swal from "sweetalert";
export class SAlertComponent {
  static _WindowSpiner: any;

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description construye la alerta con su descripcion
   * @param title
   * @param text
   * @param icon
   */
  private static async Alert(title: string = null, text: string, icon) {
    return (swal || window["swal"])({
      title: title ? title : text,
      text: title ? text : null,
      icon: icon
    });
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description muestra una alerta de confirmacion
   * @param text
   * @param title
   */
  public static AlertOk(
    text: string = "Proceso realizado con éxito.",
    title: string = null
  ) {
    this.Alert(text, title, "success");
  }
  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description muestra una alerta de informacion
   * @param text
   * @param title
   */
  public static async AlertInfo(text: string, title: string = null) {
    this.Alert(text, title, "info");
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description muestra una alerta de alvertencia
   * @param text
   * @param title
   */
  public static async AlertWarning(text: string, title: string = null) {
    return this.Alert(text, title, "warning");
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description muesta una alerta de salida
   * @param text
   * @param title
   */
  public static async AlertExit(text: string, title: string = null) {
    return (swal || window["swal"])({
      title: title ? title : text,
      text: title ? text : null,
      icon: "info",
      closeOnClickOutside: false,
      closeOnEsc: false
    });
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description muestra una alerta con icono error y su texto
   * @param text
   * @param title
   */
  public static AlertError(
    text: string = "Error en el proceso.",
    title: string = null
  ) {
    this.Alert(text, title, "error");
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description muesta el spinner global
   */
  public static ShowSpinner() {
    let spinner = document.createElement("i");
    spinner.className = "fas fa-spinner fa-spin";
    this._WindowSpiner = this._WindowSpiner || (swal || window["swal"]);
    this._WindowSpiner({
      content: spinner,
      closeOnEsc: false,
      className: "window-spiner"
    });
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Cierra el spiner global
   */
  public static CloseSpinner() {
    this._WindowSpiner.close();
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description ventana emergente que solicita confirmacion con respecto al texto
   * @param text
   * @param danger
   * @param title
   */
  public static Confirm(
    text: string,
    danger: boolean = false,
    title: string = "Confirmación?"
  ): Promise<boolean> {
    return new Promise(res => {
      (swal || window["swal"])({
        title: title,
        text: text,
        icon: "warning",
        buttons: ["Cancel", "Aceptar"],
        dangerMode: danger
      }).then(ok => {
        if (ok) {
          res(true);
        } else {
          res(false);
        }
      });
    });
  }

  /**
   * @author Cesar Augusto Millan
   * @description ventana emergente que solicita confirmacion con respecto al texto
   * @param text
   * @param danger
   * @param title
   */
  public static Confirm2(
    text: string,
    danger: boolean = false,
    title: string = "Confirmación?",
    buttons: any = ["Cancel", "Aceptar"]
  ): Promise<boolean> {
    return new Promise(res => {
      (swal || window["swal"])({
        title: title,
        text: text,
        icon: "warning",
        buttons: buttons,
        dangerMode: danger
      }).then(ok => {
        if (ok) {
          res(true);
        } else {
          res(false);
        }
      });
    });
  }


   /**
   * @author Jose Wilson Mulato
   * @description ventana emergente que informa el envio al lider
   * @param text
   * @param danger
   * @param title
   */
  public static alertEnvioLiderRegional(
    text: string,
    danger: boolean = false,
    title: string = "",
    buttons: any = ["Cancelar", "Enviar a validar"]
  ): Promise<boolean> {
    return new Promise(res => {
      (swal || window["swal"])({
        title: title,
        text: text,
        icon: "info",
        buttons: buttons,
        dangerMode: danger
      }).then(ok => {
        if (ok) {
          res(true);
        } else {
          res(false);
        }
      });
    });
  }

}
