import { TranslateService } from '@ngx-translate/core';

export class ObjectUtil {
  static OrdenMenorAMayor(key: string) {
    return function (a: any, b: any) {
      if (a[key] < b[key]) {
        return -1;
      }
      if (a[key] > b[key]) {
        return 1;
      }
      return 0;
    };
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description copia el elemento selcionado a clipboard
   */
  static copiarAlClipboard(text: string) {
    // Crea un campo de texto "oculto"
    const aux = document.createElement('input');

    // Asigna el contenido del elemento especificado al valor del campo
    aux.setAttribute('value', text);

    // Añade el campo a la página
    document.body.appendChild(aux);

    // Selecciona el contenido del campo
    aux.select();

    // Copia el texto seleccionado
    document.execCommand('copy');

    // Elimina el campo de la página
    document.body.removeChild(aux);
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Elimina atributos de los objetos en la lista.
   */
  static removerAtributos(objs: any[], keys: string[]) {
    objs.forEach((obj: any) => {
      for (let i = 0; i < keys.length; i++) {
        delete obj[keys[i]];
      }
    });
    return objs;
  }

  static traducirObjeto(objeto: Object, translate: TranslateService) {
    for (const propiedad in objeto) {
      if (Object.prototype.hasOwnProperty.call(objeto, propiedad)) {
        const objetoPropiedad = objeto[propiedad];
        if (!objetoPropiedad) {
          continue;
        }

        if (typeof objetoPropiedad === 'object') {
          ObjectUtil.traducirObjeto(objetoPropiedad, translate);
        } else {
          if (typeof objetoPropiedad === 'string') {
            const strObjetoPropiedad = String(objetoPropiedad) || '';
            translate.get(strObjetoPropiedad).subscribe((respuesta: string) => {
              objeto[propiedad] = respuesta;
            });
          }
        }
      }
    }
  }
}
