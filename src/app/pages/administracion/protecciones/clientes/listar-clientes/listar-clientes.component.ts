import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackFacadeService, FrontFacadeService } from '@core/services';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { UrlRoute } from '@shared/static/urls/url-route';
import { ListarClientesConfig } from './listar-clientes.config';

@Component({
  selector: 'app-listar-clientes',
  templateUrl: './listar-clientes.component.html',
})
export class ListarClientesComponent implements OnInit {

  configuracion: ListarClientesConfig = new ListarClientesConfig();
  estado = true;
  estadosActivos = [MIM_PARAMETROS.MIM_ESTADO_CLIENTE.ACTIVO];

  constructor(
    private readonly router: Router,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService) { }

  ngOnInit() {
    // do nothing
  }

  obtenerClientes(pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estados: any[] = this.estadosActivos) {
    const param: any = { page: pagina, size: tamanio, isPaged: true, sort: sort };
    if (estados) {
      param['mimEstadoCliente.codigo'] = estados;
    }

    this.backService.cliente.obtenerClientes(param)
      .subscribe((clientes: any) => {
        this.configuracion.gridListarClientes.component.limpiar();

        if (!clientes || !clientes.content || clientes.content.length === 0) {
          return;
        }

        this.configuracion.gridListarClientes.component.cargarDatos(
          clientes.content, {
          maxPaginas: clientes.totalPages,
          pagina: clientes.number,
          cantidadRegistros: clientes.totalElements
        });
      }, (err) => {
        this.frontService.alert.error(err.error.message);
      });
  }

  _onAtras($event) {
    this._obtenerDatosConEstados($event, this.estado);
  }

  _onSiguiente($event) {
    this._obtenerDatosConEstados($event, this.estado);
  }

  _onClickCeldaElement($event: any) {
    if ($event.col.key === 'editar') {
      this._alEditar($event.dato);
    } else {
      this._alEliminar($event.dato);
    }
  }

  _alEditar($event: any) {
    const cliente = $event;
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_CLIENTES,
      cliente.codigo]);
  }

  irACrearCliente() {
    return [UrlRoute.ADMINISTRACION_PROTECCIONES_CLIENTES_NUEVO];
  }

  _ordenar($event) {
    this._obtenerDatosConEstados($event, this.estado);
  }

  _onToggleStatus($event) {
    this._obtenerDatosConEstados($event, $event.currentTarget.checked);
  }

  _obtenerDatosConEstados($event, estado: boolean) {
    this.estado = estado;
    this.obtenerClientes($event.pagina, $event.tamano, $event.sort, this.estado ? this.estadosActivos : null);
  }

  _alEliminar($event: any) {
    const cliente = $event;
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_CLIENTES,
      cliente.codigo,
      UrlRoute.SOLICITUD_ELIMINACION
    ]);
  }

}
