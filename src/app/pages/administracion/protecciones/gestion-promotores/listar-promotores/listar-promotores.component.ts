import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackFacadeService, FrontFacadeService } from '@core/services';
import { UrlRoute } from '@shared/static/urls/url-route';
import { ListarPromotoresConfig } from './listar-promotores.config';

@Component({
  selector: 'app-listar-promotores',
  templateUrl: './listar-promotores.component.html',
})
export class ListarPromotoresComponent implements OnInit {

  public linkCrear: string;
  configuracion: ListarPromotoresConfig = new ListarPromotoresConfig();
  estado: boolean;
  filtros: any;
  filtrosGrid: any;

  constructor(
    private readonly router: Router,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    this.filtros = { };
    this.filtrosGrid = [];
   }

  ngOnInit(): void {
    this.linkCrear = UrlRoute.ADMINISTRACION_PROTECCIONES_PROMOTORES_NUEVO;
    this.estado = true;
  }

  /**
   * Autor: Cesar Millan
   * Función: Obtiene el listado de los registros
   * @param pagina Número de páginas
   * @param tamanio Número de items por páginas
   */
  obtenerPromotores(pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', filtros = this.filtros) {
    const params = {
      page: pagina, size: tamanio, isPaged: true, sort: sort, ...filtros
    };
    this.getPromotores(params);
  }

  private getPromotores(params: any) {
    this.backService.promotor.getPromotores(params)
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
      UrlRoute.ADMINISTRACION_PROTECCIONES_PROMOTORES,
      accion.numeroIdentificacion]);
  }

  _ordenar($event) {
    this._obtenerDatosConEstados($event, this.estado);
  }

  _onToggleStatus($event) {
    this._obtenerDatosConEstados($event, $event.currentTarget.checked);
  }

  _obtenerDatosConEstados($event, estado: boolean) {
    this.estado = estado;
    if (this.filtrosGrid.length > 0 && this.filtrosGrid.find(x => x.columna.keyFiltro === 'estado')) {
      return;
    } else if (this.estado) {
      this.filtros = {...this.filtros, estado: estado};
    } else {
      delete this.filtros.estado;
    }
    this.obtenerPromotores($event.pagina, $event.tamano, $event.sort);
  }

  filtroHeader(event: any) {
    if (event.valor === '') {
      this.filtrosGrid = this.filtrosGrid.filter(x => x.columna !== event.columna);
    } else {
      if (this.filtrosGrid.find(item => item.columna === event.columna)) {
        this.filtrosGrid.find(x => x.columna === event.columna).valor = event.valor;
      } else {
        this.filtrosGrid.push(event);
      }
    }

    const buildFilter = {};
    if (this.filtrosGrid.length > 0) {
      this.filtrosGrid.map((x: any) => {
        if (x.columna.keyFiltro === 'estado') {
          buildFilter['estado'] = x.valor.toLowerCase() === 'no' ? false : true;
        } else {
          buildFilter[x.columna.keyFiltro] = x.valor;
        }
      });
    }

    if (this.filtrosGrid.length > 0 && this.filtrosGrid.find(x => x.columna.keyFiltro === 'estado')) {
      this.filtros = buildFilter;
    } else {
      this.filtros = {...this.filtros, estado: this.estado, ...buildFilter};
    }
    this.obtenerPromotores(0, 10, 'fechaCreacion,desc');
  }

}
