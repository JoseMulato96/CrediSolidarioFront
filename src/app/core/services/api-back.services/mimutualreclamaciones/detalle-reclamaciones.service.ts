import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DetalleReclamacionesService {

  constructor(private readonly http: HttpClient) { }

  obtenerDetalleReclamaciones(params: any) {
    const url = `${environment.miMutualReclamacionesUrl}/sipdetallesreclamaciones/buscar`;
    return this.http.get(url, {
      params: params
    });
  }
}
