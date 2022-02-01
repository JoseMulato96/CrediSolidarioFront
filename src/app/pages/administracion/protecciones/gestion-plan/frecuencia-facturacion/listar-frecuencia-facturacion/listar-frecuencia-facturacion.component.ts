import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '@core/services';
import { UrlRoute } from '@shared/static/urls/url-route';
import { ListarFrecuenciaFacturacionConfig } from './listar-frecuencia-facturacion.config';
import { FrecuenciaFacturacionPlanService } from '../services/frecuencia-facturacion-plan.service';

@Component({
  selector: 'app-listar-frecuencia-facturacion',
  templateUrl: './listar-frecuencia-facturacion.component.html',
})
export class ListarFrecuenciaFacturacionComponent implements OnInit {

  public linkCrear: string;
  configuracion: ListarFrecuenciaFacturacionConfig = new ListarFrecuenciaFacturacionConfig();
  estado: boolean;

  constructor(
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly alertService: AlertService,
    private readonly frecuenciaFacturacionPlanService: FrecuenciaFacturacionPlanService
  ) { }

  ngOnInit() {
    this.linkCrear = UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_FRECUENCIA_FACTURACION_PLAN_NUEVO;
    this.estado = true;
  }

  /**
   * Autor: Cesar Millan
   * Función: Obtiene el listado de los registros
   * @param pagina Número de páginas
   * @param tamanio Número de items por páginas
   */
  obtener(pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = 'true') {
    this.frecuenciaFacturacionPlanService.getFrecuenciasFacturaciones({ page: pagina, size: tamanio, isPaged: true, sort: sort, estado: estado })
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
        this.alertService.warning(err.error.message);
      });
  }

  /**
   * Autor: Cesar Millan
   * Función: Mentodo para formatear la descripcion del estado
   */
  asignarEstados(items: any) {
    const listObj = [];
    let x: any;
    for (x of items) {
      listObj.push({ ...x, _estado: x.estado ? 'Si' : 'No' });
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
    const accion = event.mimPlanFrecuenciaFacturacionPK;
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_FRECUENCIA_FACTURACION_PLAN,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_FRECUENCIA_FACTURACION_PLAN_CODIGO_PLAN,
      accion.codigoPlan,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_FRECUENCIA_FACTURACION_PLAN_CODIGO_PERIODO_FACTURACION,
      accion.codigoPeriodoFacturacion
    ]);
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

}
