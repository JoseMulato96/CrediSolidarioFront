import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ListarCumulosCoberturaConfig } from './listar-cumulos-cobertura.config';
import { UrlRoute } from '@shared/static/urls/url-route';
import { from } from 'rxjs/internal/observable/from';
import { BackFacadeService, FrontFacadeService } from '@core/services';

@Component({
  selector: 'app-listar-cumulos-cobertura',
  templateUrl: './listar-cumulos-cobertura.component.html',
})
export class ListarCumulosCoberturaComponent implements OnInit {

  public linkCrear: string;
  configuracion: ListarCumulosCoberturaConfig = new ListarCumulosCoberturaConfig();
  estado: boolean;
  filtrosGrid: any;

  constructor(
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    this.filtrosGrid = [];
    this.estado = true;
  }

  ngOnInit() {
    this.linkCrear = UrlRoute.ADMINISTRACION_PROTECCIONES_CUMULOS_COBERTURA_NUEVO;
  }

  /**
   * Autor: Cesar Millan
   * Función: Obtiene el listado de los registros
   * @param pagina Número de páginas
   * @param tamanio Número de items por páginas
   */
  obtener(pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = 'true') {
    const param = { page: pagina, size: tamanio, isPaged: true, sort: sort};
    if (this.estado) {
      param['estado'] = estado;
    }
    if (this.filtrosGrid.length > 0) {
      this.filtrosGrid.map((x: any) => param[x.columna.keyFiltro] =  x.valor);
    }
    this.backService.cumuloCobertura.getCumulosCoberturas(param)
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
        _cumulo : item.mimCumulo.nombre,
        _planesCobertura : item.planesCobertura,
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
      UrlRoute.ADMINISTRACION_PROTECCIONES_CUMULOS_COBERTURA,
      accion.mimCumulosPlanCoberturaPK.codigoPlanCobertura,
      accion.mimCumulosPlanCoberturaPK.codigoCumulo,
      accion.mimPlanCobertura.mimPlan.mimFondo.codigo ]);
  }

  /**
   * Autor: Cesar Millan
   * Función: Desplega modal para que el usuario confirme la accion de eliminar
   */
  _alEliminar(event: any) {
    const item = event;
    this.translate.get('administracion.protecciones.cumuloCobertura.alertas.deseaEliminar', {
      item: `${item.mimCumulo.nombre} - ${item.mimCobertura.nombre}`
    }).subscribe((mensaje: string) => {
      const modalPromise = this.frontService.alert.confirm(mensaje, 'danger');
      const newObservable = from(modalPromise);

      newObservable.subscribe(
        (desition: any) => {
          if (desition === true) {
            this.eliminar(item.mimCumulo.codigo, item.mimCobertura.codigo);
          }
        });
    });
  }

  /**
   * Autor: Cesar Millan
   * Función: Realiza la acción de eliminar el registro
   */
  eliminar(codigoCumulo: string, codigoCobertura: string) {
    this.backService.cumuloCobertura.deleteCumuloCobertura(codigoCumulo, codigoCobertura).subscribe(resp => {
      this.translate.get('global.eliminadoExitosoMensaje').subscribe(msn => {
        this.frontService.alert.success(msn);
      });
      this.obtener();
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
    this.obtener($event.pagina, $event.tamano, $event.sort, this.estado ? 'true' : '');
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
    this.obtener();
  }
}
