import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackFacadeService } from '@core/services/back-facade.service';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { UrlRoute } from '@shared/static/urls/url-route';
import { ListarClientesEstadosAsociadosConfig } from './listar-clientes-estados-asociados.config';

@Component({
  selector: 'app-listar-clientes-estados-asociados',
  templateUrl: './listar-clientes-estados-asociados.component.html',
})
export class ListarClientesEstadosAsociadosComponent implements OnInit {

  configuracion: ListarClientesEstadosAsociadosConfig = new ListarClientesEstadosAsociadosConfig();
  linkCrear = UrlRoute.ADMINISTRACION_PROTECCIONES_CLIENTE_ESTADO_ASOCIADO_NUEVO;
  estado = true;

  constructor(
    private readonly router: Router,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) { }

  ngOnInit() {
    // do nothing
  }

  /**
   * Autor: Cesar Millan
   * Función: Obtiene el listado de los registros
   * @param pagina Número de páginas
   * @param tamanio Número de items por páginas
   */
  obtenerClientesEstadosAsociados(pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estados = 'true') {
    this.backService.estadoAsociado.getEstadosAsociados(
      { page: pagina, size: tamanio, esPaginable: true, sort: sort, 'estado': estados })
      .subscribe((resp: any) => {
        this.configuracion.gridConfig.component.limpiar();

        if (!resp || !resp.content || resp.content.length === 0) {
          return;
        }

        this.configuracion.gridConfig.component.cargarDatos(
          this.asignarEstados(resp.content), {
          maxPaginas: resp.totalPages,
          pagina: resp.number,
          cantidadRegistros: resp.totalElements
        });
      }, (err) => {
        this.frontService.alert.warning(err.error.message);
      });
  }

  /**
   * Autor: Cesar Millan
   * Función: Metodo para formatear la descripcion del estado
   * @param items Son los estados del asociado.
   */
  asignarEstados(items: any) {
    const listObj = [];
    let item: any;
    for (item of items) {
      listObj.push({
        ...item,
        _estado: item.estado ? 'Si' : 'No'
      });
    }
    return listObj;
  }

  /**
   * Autor: Cesar Millan
   * Funcion: Captura la acción de la grilla
   */
  _onClickCeldaElement(event) {
    this._alEditar(event.dato);
  }

  /**
   * Autor: Cesar Millan
   * Función: Acción para ir a la siguiente pagina de la grid
   */
  _onSiguiente(e: any) {
    this._obtenerDatosConEstados(e, this.estado);
  }

  /**
   * Autor: Cesar Millan
   * Función: Acción para regresar a la página anterior de una grid
   */
  _onAtras(e: any) {
    this._obtenerDatosConEstados(e, this.estado);
  }

  /**
   * Autor: Cesar Millan
   * Función: Redirige a la pantalla de editar
   */
  _alEditar(event: any) {
    const accion = event;
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_CLIENTE_ESTADO_ASOCIADO,
      accion.codigo]);
  }

  _ordenar($event) {
    this._obtenerDatosConEstados($event, this.estado);
  }

  _onToggleStatus($event) {
    this._obtenerDatosConEstados($event, $event.currentTarget.checked);
  }

  _obtenerDatosConEstados($event, estado: boolean) {
    this.estado = estado;
    this.obtenerClientesEstadosAsociados($event.pagina, $event.tamano, $event.sort, this.estado ? 'true' : '');
  }

}
