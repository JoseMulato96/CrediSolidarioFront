import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BackFacadeService } from '@core/services/back-facade.service';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { TranslateService } from '@ngx-translate/core';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { UrlRoute } from '@shared/static/urls/url-route';
import { masksPatterns } from '@shared/util/masks.util';
import { Subscription } from 'rxjs';
import { ListarPlanCoberturaConfig } from './listar-plan-cobertura.config';

@Component({
  selector: 'app-listar-plan',
  templateUrl: './listar-plan.component.html',
  styleUrls: ['./listar-plan-cobertura.component.css']
})
export class ListarPlanComponent implements OnInit, OnDestroy {

  public linkCrear: string;
  configuracion: ListarPlanCoberturaConfig = new ListarPlanCoberturaConfig();
  estado: boolean;

  form: FormGroup;
  mostralModal: boolean;
  solicitudCreacion: any;
  patterns = masksPatterns;

  _subs: Subscription[] = [];
  solicitud: string;
  idProceso: any;
  fase: any;
  showForm: boolean;
  isShowForm: Promise<any>;
  showControlsAprobacion: boolean;
  observaciones: any;
  codigoPlan: string;
  tituloModal: string;
  planes: any[] = [];
  planesCobertura: any[] = [];
  planesCopia: any[] = [];
  nuevoPlanSeleccionado: number;
  listaPlanes: any;

  // bitacora
  mostrarGuardar: boolean;
  proceso: any;
  conProceso: boolean;
  sinProceso: boolean;
  conProcesodos: boolean;

  constructor(
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) { }

  ngOnDestroy(): void {
    this._subs.forEach(sub => sub.unsubscribe());
  }

  ngOnInit() {

    this.linkCrear = UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLANES_NUEVO;
    this.estado = true;
    this.obtenerPlanes();
  }

  /**
   * Autor: Cesar Millan
   * Función: Obtiene el listado de los registros
   * @param pagina Número de páginas
   * @param tamanio Número de items por páginas
   */
  obtenerPlanes(pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = 'true') {
    this.backService.planes.getPlanes({ page: pagina, size: tamanio, isPaged: false, sort: sort, estado: estado })
      .subscribe((resp: any) => {
        this.configuracion.gridConfigPlanes.component.limpiar();
        if (!resp || !resp.content || resp.content.length === 0) {
          return;
        }
        this.configuracion.gridConfigPlanes.component.cargarDatos(
          this._asignarEstados(resp.content), {
          maxPaginas: resp.totalPages,
          pagina: resp.number,
          cantidadRegistros: resp.totalElements
        });
      }, (err) => {
        this.frontService.alert.warning(err.error.message);
      });
  }

  _asignarEstados(items: any) {
    const listObj = [];
    let item: any;
    for (item of items) {
      listObj.push({
        ...item,
        _mimFase: item.mimFaseFlujo ? item.mimFaseFlujo.nombre : null,
        idFaseFlujo: item.mimFaseFlujo ? item.mimFaseFlujo.codigo : null
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

      if (event.dato.mimFaseFlujo !== undefined &&
        event.dato.mimFaseFlujo.codigo !== MIM_PARAMETROS.MIM_FASE_FLUJO.TECNICA) {
        this.router.navigate([
          UrlRoute.PAGES,
          UrlRoute.ADMINISTRACION,
          UrlRoute.ADMINISTRACION_APROBACION_FINAL,
          UrlRoute.ADMINISTRACION_APROBACION_FINAL_CONFIGURAR,
          event.dato.codigo,
          UrlRoute.SOLICITUD_APROBACION
        ]);
      } else {
        this._alEditar(event.config._dato);
      }
    } else if (event.col.key === 'aprobacion') {
      this.solicitudCreacion = event;

      this.router.navigate([
        UrlRoute.PAGES,
        UrlRoute.ADMINISTRACION,
        UrlRoute.ADMINSTRACION_PROTECCIONES,
        UrlRoute.ADMINISTRACION_PROTECCIONES_PLAN_COBERTURA,
        UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLAN,
        event.dato.codigo,
        UrlRoute.SOLICITUD_APROBACION]);
    } else if (event.col.key === 'duplicar') {
      this._alDuplicar(event.dato);
    } else if (event.col.key === 'bitacora') {
      this._bitacora(event.dato);
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
      UrlRoute.ADMINISTRACION_PROTECCIONES_PLAN_COBERTURA,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLAN,
      accion.codigo]);
  }


  /**
   * Autor: Bayron Andres Perez Muñoz
   * Función: Desplega modal para que el usuario pueda duplicar un plan cobertura
   */
  async _alDuplicar(event: any) {
    // Lista de PlanesCobertura
    const _planesCobertura = await this.backService.planCobertura.getPlanesCoberturas({}).toPromise().catch(err => this.frontService.alert.error(err.error.message));
    this.planesCobertura = _planesCobertura.content;
    // Lista de Planes
    const _planes = await this.backService.planes.getPlanes({}).toPromise().catch(err => this.frontService.alert.error(err.error.message));
    this.planes = _planes.content;
    this.planesCopia = _planes.content;

    for (let i = 0; i < this.planesCopia.length; i++) {
      const elementP = this.planesCopia[i];
      for (let j = 0; j < this.planesCobertura.length; j++) {
        const elementPC = this.planesCobertura[j];
        if (elementP.codigo === elementPC.mimPlan.codigo) {
          this.borrarSelect(elementP);
        }
      }
    }

    let lista: any;
    lista = {};
    this.planes.forEach(element => {
      lista[element.codigo] = element.nombre;
    });
    // Plan a clonar
    const _planNombreAClonar = event.nombre;
    const _planCodigoAClonar = event.codigo;

    // TODO(bayron): Configurar etiquetas de html en json de idiomas.
    const config = {
      closeButton: 'btn btn--circle float-right p-0 btn-color-close',
      confirmButton: `btn btn--md btn--blue1 btn-min-with mx-2`,
      cancelButton: 'btn btn--md btn--grey btn-min-with mx-2',
      html: `<div class="text-left pl-2 form--default">
      <div class="col-md-12"><div class="form-group row align-items-center">
      <label class="col-sm-12 col-form-label px-0">Plan a Copiar:</label>
      <div class="col-sm-12 px-0"><div class="input-group">
      <input type="text" class="form-control" value="${event.nombre}" disabled />
      </div></div></div></div>
      <label>Nuevo Plan:</label></div>`
    };

    // TODO(bayron): Configurar titulo, nombre de campo y placeholder en json de idiomas.
    this.frontService.alert.launch('Copiar cobertura de un plan existente', event.nombre, 'Nuevo Plan:', 'select', config, 'Seleccione', lista)
      .then((resultSelect) => {

        if (resultSelect) {

          this.nuevoPlanSeleccionado = +resultSelect;

          const parametros = {
            codigoPlanOrigen: _planCodigoAClonar,
            codigoPlanDestino: this.nuevoPlanSeleccionado
          };

          this.backService.planCobertura.postDuplicarPlanCobertura(parametros).subscribe((respuesta: any) => {
            this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
              this.frontService.alert.success(text).then(() => {
                // Redireccionamos a listar todas las coberturas del nuevo plan
                this.router.navigate([
                  UrlRoute.PAGES,
                  UrlRoute.ADMINISTRACION,
                  UrlRoute.ADMINSTRACION_PROTECCIONES,
                  UrlRoute.ADMINISTRACION_PROTECCIONES_PLAN_COBERTURA,
                  UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLAN,
                  this.nuevoPlanSeleccionado]);

              });
            });
          }
            , (err) => {
              this.frontService.alert.error(err.error.message);
            });
        }
      });

  }

  borrarSelect(item) {
    this.planes = this.planes.filter(va => va !== item);
  }


  /**
   * Autor: Bayron Andres Perez Muñoz
   * Función: Desplega modal para que el usuario pueda ver la bitacora
   */
  async _bitacora(event: any) {

    // obtenemos codigo de proceso y se envia a mim_bitacora
    this.idProceso = event.codigoProcesoPlan;

    const idFase = event.codigoFasePlan;

    if (this.idProceso !== null && this.idProceso !== undefined) {
      this.conProceso = true;
      // Cargar informacion
      this.mostrarPorSeguir();
    } else {
      this.conProceso = false;
    }

    // Abrimos modal
    this.mostrarGuardar = true;
  }

  async mostrarPorSeguir() {
    const requestParams = {
      includeAssigneeInfo: true
    };
    const _proceso = await this.backService.proceso.getTareasPorIdProceso(this.idProceso, requestParams).toPromise().catch(err => this.frontService.alert.error(err.error.message));
    this.proceso = _proceso;
    this.conProcesodos = true;
    this.sinProceso = false;
  }

  cerrarModal() {
    this.mostrarGuardar = false;
    this.conProcesodos = false;
  }

  _ordenar($event) {
    this._obtenerDatosConEstados($event, this.estado);
  }

  _onToggleStatus($event) {
    this._obtenerDatosConEstados($event, $event.currentTarget.checked);
  }

  _obtenerDatosConEstados($event, estado: boolean) {
    this.estado = estado;
    this.obtenerPlanes($event.pagina, $event.tamano, $event.sort, this.estado ? 'true' : '');
  }
}
