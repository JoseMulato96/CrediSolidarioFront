import { Component, OnInit } from '@angular/core';
import { UrlRoute } from '@shared/static/urls/url-route';
import { ListarFondosConfig } from './listar-fondos.config';
import { Router } from '@angular/router';
import { BackFacadeService, FrontFacadeService } from '@core/services';

@Component({
  selector: 'app-listar-fondos',
  templateUrl: './listar-fondos.component.html',
})
export class ListarFondosComponent implements OnInit {

  public linkCrear: string;
  configuracion: ListarFondosConfig = new ListarFondosConfig();
  estado: boolean;

  constructor(
    private readonly router: Router,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) { }

  ngOnInit() {
    this.linkCrear = UrlRoute.ADMINISTRACION_PROTECCIONES_FONDO_NUEVO;
    this.estado = true;
  }

  /**
   * Autor: Cesar Millan
   * Función: Obtiene el listado de los registros
   * @param pagina Número de páginas
   * @param tamanio Número de items por páginas
   */
  obtenerFondos(pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = 'true') {
    this.backService.fondo.getFondos({ page: pagina, size: tamanio, isPaged: true, sort: sort, estado: estado })
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
   * Funcion: Captura la accion de la grilla
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
      UrlRoute.ADMINISTRACION_PROTECCIONES_FONDOS,
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
    this.obtenerFondos($event.pagina, $event.tamano, $event.sort, this.estado ? 'true' : '');
  }

}
