import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ControlCumulosService {

    url = `${environment.miMutualProteccionesUrl}/mimControlCumulo`;

    constructor(private readonly http: HttpClient) { }

    /**
     * @author: Edwar Ferney Murillo Arboleda
     * @description: Obtiene todos los registros de control de cumulos
     * @param params
     */
    getControlCumulos(params: any): Observable<any> {
        return this.http.get(this.url, { params: params });
    }

    /**
     * @author: Edwar Ferney Murillo Arboleda
     * @description: Guarda un nuevo registro de control de cumulos
     * @param params
     */
    postControlCumulos(param: any): Observable<any> {
        return this.http.post(this.url, param);
    }


    /**
     * @author: Edwar Ferney Murillo Arboleda
     * @description: Obtiene un control de cumulo por codigo
     * @param codigo
     */
    getControlCumulo(codigo: any): Observable<any> {
        return this.http.get(`${this.url}/${codigo}`);
    }

    /**
     * @author: Edwar Ferney Murillo Arboleda
     * @description: Actualiza un registro ya existente de control de cumulos
     * @param codigo
     * @param param
     */
    putControlCumulos(codigo: string, param: any): Observable<any> {
        return this.http.put(`${this.url}/${codigo}`, param);
    }

    /**
     * @author: Edwar Ferney Murillo Arboleda
     * @description: Elimina registro de control de cumulos
     * @param codigo
     */
    deleteControlCumulo(codigo: string): Observable<any> {
        return this.http.delete(`${this.url}/${codigo}`);
    }

}
