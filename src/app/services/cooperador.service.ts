import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class CooperadorService extends BaseService {

  constructor(
    public http: HttpClient //  public local: Location
  ) { 
    super(http);
  }

  /**
   * r
   * @description Obtener los datos del servicio de recooperamos
   * @param id numero de cedula
   */
  public async GetDataCooperador(id: number): Promise<any> {
    let url: string = `${environment.backend}getDataCooperador?cedula=${id}`

    let jsonHeaders = {};

    jsonHeaders = {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Bearer ${BaseService.TOKEN}`
    };

    let httpOptions = {
      headers: new HttpHeaders(jsonHeaders)
    };
    return this.http.post(url, { cedula: id }, httpOptions).toPromise();
  }
}
