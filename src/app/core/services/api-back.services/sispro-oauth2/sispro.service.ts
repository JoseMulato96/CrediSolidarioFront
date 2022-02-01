import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SisproService {

  url = `${environment.sisproUrl}`;

  constructor(private readonly http: HttpClient) { }

  /** Obtiene la informacion de un usuario de sispro */
  obtenerUsuario(username: string): Observable<any> {
    return this.http.get<any>(`${this.url}/users/${username}`);
  }

  /** Actualiza rol a sispro */
  actualizarRol(parametros: any): Observable<any> {
    return this.http.put(`${this.url}/users/${parametros.username}/roles`, parametros);
  }

  getUsuariosPorRol(role_id: string): Observable<any> {
    return this.http.post(`${this.url}/roles/${role_id}/users`, {appCode: environment.appName})
          .pipe(
            map((item: any) => {
              return item.users.filter(t => t.username !== environment.userSystem);
            })
          );
  }

  getDatosUser(params: any): Observable<any> {
    return this.http.get(`${this.url}/users/${params.tipoIdentificacion}/${params.numeroIdentificacion}`);
  }

  getRolById(idRol: string) {
    return this.http.post(`${this.url}/roles/${idRol}`, {appCode: environment.appName});
  }

  putPermisos(userName: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/users/${userName}/roles`, param);
  }

}
