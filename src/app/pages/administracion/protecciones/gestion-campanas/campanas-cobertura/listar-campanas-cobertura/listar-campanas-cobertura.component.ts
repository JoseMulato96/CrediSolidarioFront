import { Component, OnInit } from '@angular/core';
import { ListarCampanasPlanCoberturaConfig } from './listar-campanas-cobertura.config';
import { TranslateService } from '@ngx-translate/core';
import { UrlRoute } from '@shared/static/urls/url-route';
import { Router } from '@angular/router';
import { from } from 'rxjs/internal/observable/from';
import { BackFacadeService, FrontFacadeService } from '@core/services';

@Component({
  selector: 'app-listar-campanas-cobertura',
  templateUrl: './listar-campanas-cobertura.component.html'
})
export class ListarCampanasCoberturaComponent implements OnInit {

  public linkCrear: string;

  configuracion: ListarCampanasPlanCoberturaConfig = new ListarCampanasPlanCoberturaConfig();

  estado: boolean;

  filtrosGrid: any;

  constructor(
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService) {
    this.filtrosGrid = [];
  }

  ngOnInit(): void {
    this.linkCrear = UrlRoute.ADMINISTRACION_PROTECCIONES_CAMPANAS_ENDOSO_CAMPANAS_NUEVO;
    this.estado = true;
  }

  /**
 * Autor: Juan Cabuyales
 * Función: Obtiene el listado de las campañas plan cobertura
 * @param pagina Número de páginas
 * @param tamanio Número de items por páginas
 */
  obtenerCampanasPlanCobertura(pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = 'true') {
    const param = { page: pagina, size: tamanio, isPaged: true, sort: sort };
    if (this.estado) {
      param['estado'] = estado;
    }

    if (this.filtrosGrid.length > 0) {
      this.filtrosGrid.map((x: any) => param[x.columna.keyFiltro] = x.valor);
    }

    this.filtrosGrid = [];

    this.backService.campanaCobertura.getCampanasPlanCobertura(param)
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
 * Función: Metodo para formatear la data a mostar
 * @param items Son los registros obtenidos de la consulta
 */
  asignarEstados(items: any) {
    const listObj = [];
    let item: any;
    for (item of items) {

      // Se obtienen la lista de planes cobertura
      const listaPlanesCobertura = item.mimCampanaRelacionPlanCoberturaList;
      let nombresPlanes = '';
      for (let i = 0; i < listaPlanesCobertura.length; i++) {
        const listaItem = listaPlanesCobertura[i];
        nombresPlanes += i > 0 ? `; ${listaItem.mimPlanCobertura.nombre}` : listaItem.mimPlanCobertura.nombre;
      }

      listObj.push({
        nombre: item.mimCampanaEndoso.nombre,
        nombrePlan: nombresPlanes,
        valorFijo: item.valorFijoDestinadoFondoGarantia ? 'Si' : 'No',
        fechaModificacion: item.fechaModificacion,
        estado: item.estado ? 'Si' : 'No',
        codigo: item.codigo
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
      UrlRoute.ADMINISTRACION_PROTECCIONES_CAMPANAS_ENDOSO_CAMPANAS_PLAN_COBERTURA,
      accion.codigo]);
  }

  /**
  * Autor: Juan Cabuyales
  * Función: Desplega modal para que el usuario confirme la accion de eliminar la campaña
  */
  _alEliminar(event: any) {
    this.translate.get('administracion.protecciones.campanasCobertura.alertas.deseaEliminarCampana')
    .subscribe((mensaje: string) => {
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
    this.backService.campanaCobertura.deleteCampanaPlanCobertura(codigoCampana).subscribe((resp: any) => {
      this.translate.get('global.eliminadoExitosoMensaje').subscribe(msn => {
        this.frontService.alert.success(msn);
      });
      this.obtenerCampanasPlanCobertura();
    }, err => {
      this.frontService.alert.warning(err.error.message);
    });
  }

  /**
 * Autor: Juan Cabuyales
 * Función: Acción para ir a la siguiente pagina de la grid
 */
  _onSiguiente(e: any) {
    this.obtenerCampanasPlanCoberturaEstado(e, this.estado);
  }

  /**
   * Autor: Juan Cabuyales
   * Función: Acción para regresar a la página anterior de una grid
   */
  _onAtras(e: any) {
    this.obtenerCampanasPlanCoberturaEstado(e, this.estado);
  }


  _ordenar($event) {
    this.obtenerCampanasPlanCoberturaEstado($event, this.estado);
  }

  _onToggleStatus($event) {
    this.obtenerCampanasPlanCoberturaEstado($event, $event.currentTarget.checked);
  }

  private obtenerCampanasPlanCoberturaEstado($event, estado: boolean) {
    this.estado = estado;
    this.obtenerCampanasPlanCobertura($event.pagina, $event.tamano, $event.sort, this.estado ? 'true' : '');
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
    this.obtenerCampanasPlanCobertura();
  }
}
