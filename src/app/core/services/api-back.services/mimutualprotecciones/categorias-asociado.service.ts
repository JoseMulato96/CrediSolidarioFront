import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriasAsociadoService {

  constructor(private readonly http: HttpClient) { }

  getCategoriasAsociado(options: any = {}): Observable<any> { // ?esPaginable=true
    const url = `${environment.miMutualProteccionesUrl}/sipCategoriaAsociado`;
    return this.http.get(url, { params: options });
  }

  /**Obtiene los datos utilizando paginacion */
  getCategoriasAsociadoPaginado(options: any = {}) {
    const url = `${environment.miMutualProteccionesUrl}/sipCategoriaAsociado`;
    return this.http.get(url, { params: options });
  }

  guardarCategoriasAsociado(categoriasAsociado: any) {
    const url = `${environment.miMutualProteccionesUrl}/sipCategoriaAsociado`;
    return this.http.post(url, categoriasAsociado);
  }

  guardarCategoriasAsociado2(categoriasAsociado: any) {
    const url = `${environment.miMutualProteccionesUrl}/sipCategoriaAsociado`;
    return this.http.post(url, categoriasAsociado);
  }

  eliminarCategoriasAsociado(codigo: string) {
    const url = `${environment.miMutualProteccionesUrl}/sipCategoriaAsociado/${codigo}`;
    return this.http.delete(url);
  }

  obtenerCategoriaAsociado(codigo: string) {
    const url = `${environment.miMutualProteccionesUrl}/sipCategoriaAsociado/${codigo}`;
    return this.http.get(url);
  }

  actualizarCategoriaAsociado(categoriasAsociado: any) {
    const url = `${environment.miMutualProteccionesUrl}/sipCategoriaAsociado/${categoriasAsociado.codigo}`;
    return this.http.put(url, categoriasAsociado);
  }
}
