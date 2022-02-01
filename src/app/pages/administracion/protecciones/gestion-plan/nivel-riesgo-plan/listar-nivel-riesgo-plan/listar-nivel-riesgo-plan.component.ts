import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackFacadeService } from '@core/services/back-facade.service';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { TranslateService } from '@ngx-translate/core';
import { UrlRoute } from '@shared/static/urls/url-route';
import { from } from 'rxjs/internal/observable/from';
import { ListarNivelRiesgoPlanConfig } from './listar-nivel-riesgo-plan.config';

@Component({
  selector: 'app-listar-nivel-riesgo-plan',
  templateUrl: './listar-nivel-riesgo-plan.component.html',
})
export class ListarNivelRiesgoPlanComponent implements OnInit {

  public linkCrear: string;
  configuracion: ListarNivelRiesgoPlanConfig = new ListarNivelRiesgoPlanConfig();
  estado: boolean;

  constructor(
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) { }

  ngOnInit() {
    this.linkCrear = UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_NIVEL_RIESGO_PLAN_NUEVO;
    this.estado = true;
  }

  /**
   * Autor: Cesar Millan
   * Función: Obtiene el listado de los registros
   * @param pagina Número de páginas
   * @param tamanio Número de items por páginas
   */
  obtener(pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = 'true') {
    this.backService.nivelRiesgoPlan.getNivelesRiesgosPlanes({ page: pagina, size: tamanio, isPaged: true, sort: sort, estado: estado })
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
   * @param items
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
   * @param event
   */
  _alEditar(event: any) {
    const accion = event.mimPlanNivelRiesgoPK;
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_NIVEL_RIESGO_PLAN,
      // UrlRoute.CREAR_NIVEL_RIESGO_PLAN,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_NIVEL_RIESGO_PLAN_CODIGO_PLAN,
      accion.codigoPlan,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_NIVEL_RIESGO_PLAN_CODIGO_NIVEL_RIESGO,
      accion.codigoNivelRiesgo
    ]);
  }

  /**
   * Autor: Cesar Millan
   * Función: Desplega modal para que el usuario confirme la accion de eliminar
   * @param event
   */
  _alEliminar(event: any) {
    const item = event;
    this.translate.get('administracion.protecciones.gestionPlanes.nivelesRiesgo.alertas.deseaEliminar', {
      item: `${item.mimPlan.nombre} - ${item.mimNivelRiesgo.nombre}`
    }).subscribe((mensaje: string) => {
      const modalPromise = this.frontService.alert.confirm(mensaje, 'danger');
      const newObservable = from(modalPromise);

      newObservable.subscribe(
        (desition: any) => {
          if (desition === true) {
            this.eliminar(item.mimPlanNivelRiesgoPK.codigoPlan, item.mimPlanNivelRiesgoPK.codigoNivelRiesgo);
          }
        });
    });
  }

  /**
   * Autor: Cesar Millan
   * Función: Realiza la acción de eliminar el registro
   * @param codigo
   */
  eliminar(codigoPlan: string, codigoNivelRiesgo: string) {
    this.backService.nivelRiesgoPlan.deleteNivelRiesgoPlan(codigoPlan, codigoNivelRiesgo).subscribe(resp => {
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

}
