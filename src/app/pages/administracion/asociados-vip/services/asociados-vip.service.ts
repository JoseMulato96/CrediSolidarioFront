import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable()
export class AsociadosVipService {
  constructor(private readonly http: HttpClient) { }

  obtenerAsociadosVip() {
    const url = `${environment.miMutualAsociadosUrl}/asociadosvip`;
    return this.http.get(url);
  }

  guardarAsociadoVip(asociadoVip: any) {
    const url = `${environment.miMutualAsociadosUrl}/asociadosvip`;
    return this.http.post(url, asociadoVip);
  }

  eliminarAsociadoVip(asoNumInt: string) {
    const url = `${environment.miMutualAsociadosUrl}/asociadosvip`;
    return this.http.delete(url, { params: { asoNumInt: asoNumInt } });
  }
}
