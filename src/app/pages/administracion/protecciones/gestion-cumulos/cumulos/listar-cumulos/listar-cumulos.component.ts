import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ListarCumulosConfig } from './listar-cumulos.config';
import { UrlRoute } from '@shared/static/urls/url-route';
import { from } from 'rxjs/internal/observable/from';
import { BackFacadeService, FrontFacadeService } from '@core/services';

@Component({
  selector: 'app-listar-cumulos',
  templateUrl: './listar-cumulos.component.html',
})
export class ListarCumulosComponent implements OnInit {

  public linkCrear: string;
  configuracion: ListarCumulosConfig = new ListarCumulosConfig();
  estado: boolean;
  filtrosGrid: any;

  constructor(
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    this.filtrosGrid = [];
  }

  ngOnInit() {
    this.linkCrear = UrlRoute.ADMINISTRACION_PROTECCIONES_CUMULOS_NUEVO;
    this.estado = true;
  }

  /**
   * Autor: Cesar Millan
   * Función: Obtiene el listado de los registros
   * @param pagina Número de páginas
   * @param tamanio Número de items por páginas
   */
  obtenerItems(pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = 'true') {
    const param = { page: pagina, size: tamanio, isPaged: true, sort: sort, estado: estado };
    if (this.filtrosGrid.length > 0) {
      this.filtrosGrid.map((x: any) => param[x.columna.keyFiltro] = x.valor);
    }
    this.backService.cumulo.getCumulos(param)
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
   * Función: Mentodo para formatear la descripcion del estado
   */
  asignarEstados(items: any) {
    const listObj = [];
    let item: any;
    for (item of items) {
      listObj.push({
        ...item,
        _estado: item.estado ? 'Si' : 'No',
        dependeOtrosPlanCobertura: item.dependeOtrosPlanCobertura ? 'SI' : 'NO'
      });
    }
    return listObj;
  }

  /**
   * Autor: Cesar Millan
   * Funcion: Captura la accion de la grilla
   */
  _onClickCeldaElement(event) {
    if (event.col.key === 'editar') {
      this._alEditar(event.dato);
    } else {
      this._alEliminar(event.dato);
    }
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
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_CUMULOS,
      UrlRoute.ADMINISTRACION_PROTECCIONES_CUMULOS,
      accion.codigo]);
  }

  /**
   * Autor: Cesar Millan
   * Función: Desplega modal para que el usuario confirme la accion de eliminar
   */
  _alEliminar(event: any) {
    this.translate.get('administracion.protecciones.cumulo.alertas.deseaEliminar', {
      cumulo: `${event.codigo} - ${event.nombre}`
    }).subscribe((mensaje: string) => {
      const modalPromise = this.frontService.alert.confirm(mensaje, 'danger');
      const newObservable = from(modalPromise);

      newObservable.subscribe(
        (desition: any) => {
          if (desition === true) {
            this.eliminar(event.codigo);
          }
        });
    });
  }

  /**
   * Autor: Cesar Millan
   * Función: Realiza la acción de eliminar el registro
   */
  eliminar(codigo: any) {
    this.backService.cumulo.deleteCumulo(codigo).subscribe(resp => {
      this.translate.get('global.eliminadoExitosoMensaje').subscribe(msn => {
        this.frontService.alert.success(msn);
      });
      this.obtenerItems();
    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });
  }

  _ordenar($event) {
    this._obtenerDatosConEstados($event, this.estado);
  }

  _onToggleStatus($event) {
    this._obtenerDatosConEstados($event, $event.currentTarget.checked);
  }

  _obtenerDatosConEstados($event, estado: boolean) {
    this.estado = estado;
    this.obtenerItems($event.pagina, $event.tamano, $event.sort, this.estado ? 'true' : '');
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
    this.obtenerItems();
  }
}
