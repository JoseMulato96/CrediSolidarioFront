import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  constructor(private readonly http: HttpClient) { }

  obtenerCliente(codigo: string) {
    const url = `${environment.miMutualProteccionesUrl}/mimCliente/${codigo}`;
    return this.http.get(url);
  }

  obtenerClientes(params: any) {
    const url = `${environment.miMutualProteccionesUrl}/mimCliente`;
    return this.http.get(url, { params: params });
  }

  guardarCliente(cliente: any) {
    const url = `${environment.miMutualProteccionesUrl}/mimCliente`;
    return this.http.post(url, cliente);
  }

  actualizarCliente(codigo: string, cliente: any) {
    const url = `${environment.miMutualProteccionesUrl}/mimCliente/${codigo}`;
    return this.http.put(url, cliente);
  }

  eliminarCliente(codigo: string) {
    const url = `${environment.miMutualProteccionesUrl}/mimCliente/${codigo}`;
    return this.http.delete(url);
  }

  actualizarEstadoCliente(codigo: string, estado: any) {
    const url = `${environment.miMutualProteccionesUrl}/mimCliente/${codigo}/estado`;
    return this.http.put(url, estado);
  }

}
