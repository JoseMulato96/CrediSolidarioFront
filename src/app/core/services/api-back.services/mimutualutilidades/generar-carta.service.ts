import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenerarCartaService {

  url = `${environment.miMutualUtilidadesUrl}`;

  constructor(private readonly http: HttpClient) { }

  /**
   * Autor: Katherine Latorre
   * Función: Servicio que consulta registros por código
   * @param codigo Código de la carta reclamación
   */
  obtenerCarta(codigo: string): Observable<any> {
    return this.http.get(`${this.url}/mimCartas/${codigo}`);
  }

  /**
   * Autor: Katherine Latorre
   * Función: Servicio que consulta todos los registros
   * @param params Objeto de parámetros con datos de filtros
   */
  obtenerCartas(params: any): Observable<any> {
    return this.http.get(`${this.url}/mimCartas`, { params: params });
  }

  /**
   * Autor: Katherine Latorre
   * Función: Actualizar registro
   *
   * @param codigo Código de la carta reclamación
   * @param params Objeto de parametros con los datos para actualizar
   */
  actualizarCarta(params: any): Observable<any> {
    return this.http.put(`${this.url}/mimCartas`, params);
  }

  /**
   * Autor: Katherine Latorre
   * Función: Guardar registro
   *
   * @param params Objeto de parametros con los datos para guardar
   */
  guardarCarta(params: any): Observable<any> {
    return this.http.post(`${this.url}/mimCartas`, params);
  }

  /**
   * Autor: Cesar Millan
   * Función: Genera el PDF a partir del tipo de carta
   *
   * @param params Objeto de parámetros con datos de llenado de la carta
   * @param codigo Código de la carta reclamación
   */
  generarPDF(params: any, tipoCarta: string): Observable<HttpResponse<any>> {
    return this.http.post<Blob>(
      `${this.url}/pdf/generar/${tipoCarta}`, params, {
      observe: 'response',
      responseType: 'blob' as 'json'
    }
    );
  }

  /**
   * Autor: Cesar Millan
   * Función: Descarga el PDF del FTP a partir del nombre de la carta
   *
   * @param codigoCartasFTP Codigo de MimCartaFTP
   */
  descargarCartaFTP(codigoCartasFTP: string): Observable<HttpResponse<any>> {
    return this.http.post<Blob>(`${this.url}/mimCartasFTP/descargar?codigoCartasFTP=${codigoCartasFTP}`, {}, {
      observe: 'response',
      responseType: 'blob' as 'json'
    });
  }

  /**
   * Autor: Katherine Latorre
   * Función: Descarga un Zip con varias cartas del FTP a partir del nombre de la carta
   *
   * @param nombreZip Nombre del archivo Zip
   * @param params Objeto de parámetros con codigos de las MimCartasFTP a descargar
   *
   */
  descargarZipCartaFTP(nombreZip: string, params: any): Observable<HttpResponse<any>> {
    return this.http.post<Blob>(
      `${this.url}/mimCartasFTP/descargarZip?nombreZip=${nombreZip}`, params, {
      observe: 'response',
      responseType: 'blob' as 'json'
    });
  }

  /**
   * Autor: Katherine Latorre
   * Función: Sube un archivo al FTP
   *
   * @param formData Objeto de datos con el archivo y parametros adicionales
   */
  cargarCartaFTP(formData: FormData): Observable<any> {
    return this.http.post(`${this.url}/mimCartasFTP`, formData);
  }

}
