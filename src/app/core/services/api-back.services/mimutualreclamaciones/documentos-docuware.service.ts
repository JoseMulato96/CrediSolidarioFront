import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentosDocuwareService {

  constructor(private readonly http: HttpClient) { }

  notificarDigitalizacion(solicitud: any) {
    const url = `${environment.miMutualReclamacionesUrl}/documentos/notificarDigitalizacion/${solicitud}`;
    return this.http.post(url, null);
  }
}
