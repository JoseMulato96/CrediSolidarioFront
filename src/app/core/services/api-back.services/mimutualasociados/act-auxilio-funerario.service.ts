import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActAuxilioFunerarioService {

  constructor(private readonly http: HttpClient) { }

  /**
   * @author Hander Fernando Gutierrez Cordoba
   * @description enviar a actualizar el indicador funerario
   * @param indicadorFunerario objeto que trae toda la info de la pantalla indicador aux funerario
   * @return subscripcion
   */
  sendUpdateIndicadorFunerario(param: any) {

    const url = `${environment.miMutualAsociadosUrl}/sipVinculaciones/indicador/auxilioFunerario`;
    return this.http.put(url, param);
  }

}
