import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriasAsociadoHomologacionService {
  url = `${environment.miMutualProteccionesUrl}/sipCategoriaHomologacion`;
  constructor(private readonly http: HttpClient) { }

  getCategoriasAsociadoHomologacion(options: any = {}): Observable<any> {
    return this.http.get(this.url, { params: options });
  }

  guardarHomologacion(categoriasAsociado: any) {
    return this.http.post(this.url, categoriasAsociado);
  }

  eliminarHomologacion(codigo: string) {
    return this.http.delete(`${this.url}/${codigo}`);
  }

  obtenerHomologacion(codigo: string) {
    return this.http.get(`${this.url}/${codigo}`);
  }

  actualizarHomologacion(categoriasAsociado: any) {
    return this.http.put(`${this.url}/${categoriasAsociado.codigo}`, categoriasAsociado);
  }

  getCategorias(params: any) {
    const url = `${environment.miMutualProteccionesUrl}/sipCategoriaAsociado`;
    return this.http.get(url, {params: params});
  }

}
