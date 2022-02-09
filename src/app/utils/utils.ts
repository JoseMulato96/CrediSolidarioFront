export class Utils {
  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Obtiene la extencion del archivo
   */
  static ExtracExtFile(nameFile: string) {
    return nameFile.split(".").reverse()[0];
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description pasar un dato blob a string
   * @param blob
   */
  static async BlobToStrign(blob: Blob) {
    return new Promise((success, fail) => {
      const reader = new FileReader();
      reader.addEventListener("loadend", e => {
        const text = e.srcElement["result"];
        success(text);
      });
      // Start reading the blob as text.
      try {
        reader.readAsText(blob);
      } catch (error) {
        fail(error);
      }
    });
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description remueve los doble espacio de seguidos y solo deja uno
   * @param value
   */
  static RemoveMoreSpace(value: string): string {
    return (value || "").replace(/\s+/g, " ");
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description genera un grupo aletorio
   */
  static GeneralNameGroup(): any {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description genera un id
   */
  public static GeneralId() {
    let fin: string = Math.trunc(Math.random() * 100)
      .toString()
      .substr(0, 4);
    return (
      "xxxxxxxx-xxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }) +
      "-" +
      fin
    );
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Formatea el tipo de hora de pendiento del string
   * @param date
   * @param format
   */
  static FormatDate(date: Date, format: string): any {
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    let day = date.getDay();
    let month = date.getMonth();
    let year = date.getFullYear();

    return format
      .replace(/dd/g, day.toString().padStart(2, "0"))
      .replace(/MM/g, month.toString().padStart(2, "0"))
      .replace(/yyyy/g, year.toString().padStart(4, "0"))
      .replace(/hh/g, hour.toString().padStart(2, "0"))
      .replace(/mm/g, minute.toString().padStart(2, "0"))
      .replace(/ss/g, second.toString().padStart(2, "0"));
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Obtiene la edad dependiendo de una fecha
   * @param date
   */
  public static CalculateAge(date) {
    let today = new Date();
    let birth = new Date(date);
    let age = today.getFullYear() - birth.getFullYear();
    let m = today.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description crea una copia de un json
   * @param json
   */
  public static CopyJson(json: object) {
    return JSON.parse(JSON.stringify(json));
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description formato moneda
   * @param value
   */
  public static FormatMoney(value: number) {
    return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description mapea valores de un objeto a otro
   * @param fromObj
   * @param toObj
   */
  public static MappingValue(fromObj: any, toObj: any) {
    for (const key in toObj) {
      fromObj[key] = toObj[key];
    }
    for (const key in fromObj) {
      if (fromObj.hasOwnProperty(key)) {
        const element = fromObj[key];
      }
    }
  }

  public static CopyToClipboard(text: string) {
    // Crea un campo de texto "oculto"
    var aux = document.createElement("input");

    // Asigna el contenido del elemento especificado al valor del campo
    aux.setAttribute("value", text);

    // Añade el campo a la página
    document.body.appendChild(aux);

    // Selecciona el contenido del campo
    aux.select();

    // Copia el texto seleccionado
    document.execCommand("copy");

    // Elimina el campo de la página
    document.body.removeChild(aux);
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description descarga un archivo de los datos blod
   * @param blob
   * @param nameFile
   */
  public static DonwloadFile(blob: Blob, nameFile) {
    if (window.navigator.msSaveOrOpenBlob) {
      //IE & Edge
      //msSaveBlob only available for IE & Edge
      window.navigator.msSaveBlob(blob, nameFile);
      return;
    }
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = nameFile;
    document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
    a.click();
    a.remove();
  }


  /**
   * @author Jose Wilson Mulato Escobar
   * @description 
   * @param originalArray  
   */
  public static findArrayGenero(originalArray) {
    var newArrayFemenino = [];
    var newArrayMasculino = [];
    var arrayGeneros = [];

    for (var i in originalArray) {
      if (originalArray[i].nombreGenero == 'FEMENINO') {       
        newArrayFemenino.push(originalArray[i]);
      } else if (originalArray[i].nombreGenero == 'MASCULINO') {        
        newArrayMasculino.push(originalArray[i]);
      }
    }
    arrayGeneros.push(newArrayFemenino);
    arrayGeneros.push(newArrayMasculino);
    return arrayGeneros;
  }
}
