import { Component, OnInit } from '@angular/core';
import { ListarCampanasConfig } from './listar-campanas.config';
import { UrlRoute } from '@shared/static/urls/url-route';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { from } from 'rxjs/internal/observable/from';
import { BackFacadeService, FrontFacadeService } from '@core/services';

@Component({
  selector: 'app-listar-campanas',
  templateUrl: './listar-campanas.component.html'
})
export class ListarCampanasComponent implements OnInit {

  public linkCrear: string;
  configuracion: ListarCampanasConfig = new ListarCampanasConfig();
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

  ngOnInit(): void {
    this.linkCrear = UrlRoute.ADMINISTRACION_PROTECCIONES_CAMPANAS_ENDOSO_CAMPANAS_NUEVO;
    this.estado = true;
  }

  /**
   * Autor: Juan Cabuyales
   * Función: Obtiene el listado de las campañas
   * @param pagina Número de páginas
   * @param tamanio Número de items por páginas
   */
  obtenerCampanas(pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = 'true') {
    const param = { page: pagina, size: tamanio, isPaged: true, sort: sort };
    if (this.estado) {
      param['estado'] = estado;
    }
    if (this.filtrosGrid.length > 0) {
      this.filtrosGrid.map((x: any) => param[x.columna.keyFiltro] = x.valor);
    }
    this.backService.campanaEndoso.getCampanas(param)
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
        }
        );
      }, (err) => {
        this.frontService.alert.warning(err.error.message);
      });
  }

  /**
 * Autor: Juan Cabuyales
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
   * Autor: Juan Cabuyales
   * Funcion: Captura la accion de la grilla
   */
  _onClickCeldaElement(event: any) {
    if (event.col.key === 'editar') {
      this._alEditar(event.dato);
    } else {
      this._alEliminar(event.dato);
    }
  }

  /**
  * Autor: Juan Cabuyales
  * Función: Redirige a la pantalla de editar campaña
  */
  _alEditar(event: any) {
    const accion = event;
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_CAMPANAS_ENDOSO,
      UrlRoute.ADMINISTRACION_PROTECCIONES_CAMPANAS_ENDOSO_CAMPANAS,
      accion.codigo]);
  }

  /**
  * Autor: Juan Cabuyales
  * Función: Desplega modal para que el usuario confirme la accion de eliminar la campaña
  */
  _alEliminar(event: any) {
    this.translate.get('administracion.protecciones.campanas.alertas.deseaEliminarCampana', {
      nombre: `${event.nombre}`
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

  eliminar(codigoCampana: string) {
    this.backService.campanaEndoso.deleteCampana(codigoCampana).subscribe((resp: any) => {
      this.translate.get('global.eliminadoExitosoMensaje').subscribe(msn => {
        this.frontService.alert.success(msn);
      });
      this.obtenerCampanas();
    }, err => {
      this.frontService.alert.warning(err.error.message);
    });
  }

  /**
   * Autor: Juan Cabuyales
   * Función: Acción para ir a la siguiente pagina de la grid
   */
  _onSiguiente(e: any) {
    this.obtenerCampanasEstado(e, this.estado);
  }

  /**
   * Autor: Juan Cabuyales
   * Función: Acción para regresar a la página anterior de una grid
   */
  _onAtras(e: any) {
    this.obtenerCampanasEstado(e, this.estado);
  }


  _ordenar($event) {
    this.obtenerCampanasEstado($event, this.estado);
  }

  _onToggleStatus($event) {
    this.obtenerCampanasEstado($event, $event.currentTarget.checked);
  }

  private obtenerCampanasEstado($event, estado: boolean) {
    this.estado = estado;
    this.obtenerCampanas($event.pagina, $event.tamano, $event.sort, this.estado ? 'true' : '');
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
    this.obtenerCampanas();
  }
}
