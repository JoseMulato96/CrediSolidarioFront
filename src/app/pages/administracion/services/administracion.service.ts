import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';


@Injectable()
export class AdministracionService {
  entidadesListerSubcription: Subscription = new Subscription();

  constructor(
    private readonly http: HttpClient,
  ) { }

  getEntidades() {
    const url = `${environment.miMutualAuditoriaUrl}/sipCrudLogNovedades?todos=true`;
    return this.http.get(url);
  }

  getNombreEntidas(nombre: string) {
    const url = `${environment.miMutualAuditoriaUrl}/sipLogNovedades/buscar?nombre=${nombre}`;
    return this.http.get(url);
  }

  getNovedades(): Observable<any> {
    return this.http.get(
      `${environment.miMutualAuditoriaUrl}/sipDescripcionNovedades`
    );
  }

  guardarNovedad(dato: any) {
    const url = `${environment.miMutualAuditoriaUrl}/sipDescripcionNovedades`;
    return this.http.post(url, dato);
  }

  guardarConfiguracion(dato: any) {
    const url = `${environment.miMutualAuditoriaUrl}/sipLogNovedades`;
    return this.http.post(url, dato);
  }

  obtenerConfiguraciones() {
    const url = `${environment.miMutualAuditoriaUrl}/sipLogNovedades`;
    return this.http.get(url);
  }
  /**Obtiene los datos utilizando paginacion */
  getConfiguraciones(options: any = {}) {
    const url = `${environment.miMutualAuditoriaUrl}/sipLogNovedades`;
    return this.http.get(url, { params: options });
  }

  eliminarConfiguracion(codigo: string) {
    const url = `${environment.miMutualAuditoriaUrl}/sipLogNovedades/${codigo}`;
    return this.http.delete(url);
  }

  /**Obtener listado de auditoria */
  getAuditoria() {
    const url = `${environment.miMutualAuditoriaUrl}/sipCrudLogNovedades?todos=false`;
    return this.http.get(url);
  }

  /**Obtiene los datos sw auditoria utilizando paginacion */
  getConfiguracionesAuditoria(options: any = {}) {
    const url = `${environment.miMutualAuditoriaUrl}/sipCrudLogNovedades`;
    return this.http.get(url, { params: options });
  }

  /**Actualiza registros de auditoria */
  actualizarRowAuditoria(parametros: any) {
    const url = `${environment.miMutualAuditoriaUrl}/sipCrudLogNovedades/${parametros.codigo}`;
    return this.http.put(url, parametros);
  }

  /**obtener nombre de la tabla */
  getNombreTabla(entidad: string) {
    const url = `${environment.miMutualAuditoriaUrl}/tablasLogNovedades/buscar?nombre=${entidad}`;
    return this.http.get(url);
  }

  /**guardar entidad y tabla */
  guardarTabla(parametros: any) {
    const url = `${environment.miMutualAuditoriaUrl}/sipCrudLogNovedades?todos=false`;
    return this.http.post(url, parametros);
  }

}
