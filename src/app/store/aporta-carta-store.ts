import { BaseStore } from "../extends/base-store";

export class AportaCartaStore extends BaseStore {  

  /**
   * @author Jose Wilson Mulato Escobar
   * @description Obtener respuestas y guardar en cache
   */
  protected async GetService() {    
    var options = new Array();
    options = [{ descrp: "Si", valor: 24 }, { descrp: "No, Otro Documento", valor: 25 }
    ]
    options.forEach(x =>
      this.Data.push({ Label: x.descrp, Value: x.valor })
    );
    return;
  }
}
