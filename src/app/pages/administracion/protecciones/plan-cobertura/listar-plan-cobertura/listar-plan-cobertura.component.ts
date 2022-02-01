import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackFacadeService, FrontFacadeService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { GENERALES } from '@shared/static/constantes/constantes';
import { UrlRoute } from '@shared/static/urls/url-route';
import { forkJoin, Subscription } from 'rxjs';
import { ListarPlanCoberturaConfig } from './listar-plan-cobertura.config';

@Component({
  selector: 'app-listar-plan-cobertura',
  templateUrl: './listar-plan-cobertura.component.html',
  styleUrls: ['./listar-plan-cobertura.component.css']
})
export class ListarPlanCoberturaComponent implements OnInit {

  configuracion: ListarPlanCoberturaConfig = new ListarPlanCoberturaConfig();
  planes: any[] = [];
  coberturas: any[] = [];
  dataFiltros: any;
  codigoPlan: string;

  _subs: Subscription[] = [];
  solicitud: string;
  idProceso: string;
  showForm: boolean;
  isShowForm: Promise<any>;
  showControlsAprobacion: boolean;
  observaciones: any;
  tituloModal: string;
  idTarea: string;
  esDirectorTecnico: boolean;
  tipoProceso: string;
  filtrosGrid: any;

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly location: Location,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService

  ) {
    this.translate.get('administracion.protecciones.planCobertura.solicitudCrear.tituloModal').subscribe(texto => {
      this.tituloModal = texto;
    });
    this.tipoProceso = UrlRoute.SOLICITUD_APROBACION;
    this.filtrosGrid = [];
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: any) => {
      this.codigoPlan = params.codigoPlan;

      this.solicitud = params.solicitud || null;
      this.idProceso = params.processInstanceId || null;
      this.idTarea = params.taskId || null;
      this.showControlsAprobacion = this.idTarea !== null ? true : false;

      if (this.idTarea) {
        this.backService.tarea.obtenerTarea(this.idTarea).subscribe((item: any) => {
          this.validarPermiso(this.frontService.authentication.getUser().username === item.userId);
          this.esDirectorTecnico = item.taskDefinitionKey === GENERALES.TIPO_USUARIO_FLUJO.DIRECTOR_TECNICO ? true : false;
        });
      }
      if (this.idProceso) {
        this.backService.proceso.getObservacionesByIdProceso(this.idProceso).subscribe(items => {
          this.observaciones = this.idProceso ? items : null;
        }, (err) => {
          this.frontService.alert.warning(err.error.message);
        });
      }
      if (this.solicitud === UrlRoute.SOLICITUD_APROBACION) {
        this.showForm = true;
      }
      this.obtener();
    });
  }

  /**
   * Autor: Cesar Millan
   * Función: Obtiene el listado de los registros
   * @param pagina Número de páginas
   * @param tamanio Número de items por páginas
   */
  obtener() {
    forkJoin([
      this.backService.cobertura.obtenerCoberturas({})
    ]).subscribe(([

      _listaCoberturas
    ]) => {
      this.coberturas = _listaCoberturas.content;
      this.configuracion.gridConfig.component.cargarDatosDropdown([
        { code: 'cobertura', datos: this.formatDropdown(this.coberturas) }
      ]);
    }, (err: any) => {
      this.frontService.alert.warning(err.error.message);
    });

  }

  /**
   * @description Metodo para construir la estructura de datos que recibe el control lista desplegable
   */
  formatDropdown(datos: any[]) {
    const item: any[] = [];
    datos.forEach(x => {
      item.push({ label: x.nombre, value: x.codigo });
    });
    return item;
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
    this._selectDropdown(this.dataFiltros, e.pagina, e.tamano, e.sort);
  }

  /**
   * Autor: Cesar Millan
   * Función: Acción para regresar a la página anterior de una grid
   */
  _onAtras(e: any) {
    this._selectDropdown(this.dataFiltros, e.pagina, e.tamano, e.sort);
  }

  /**
   * Autor: Cesar Millan
   * Función: Redirige a la pantalla de editar
   */
  _alEditar(event: any) {
    const accion = event;
    /* ${UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLAN}/:codigoPlan/
    ${UrlRoute.ADMINISTRACION_PROTECCIONES_COBERTURA}/:codigoCobertura`, */

    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_PLAN_COBERTURA,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLAN,
      this.codigoPlan,
      UrlRoute.ADMINISTRACION_PROTECCIONES_COBERTURA,
      accion.codigo]);
  }

  /**
   * Autor: Cesar Millan
   * Función: Desplega modal para que el usuario confirme la accion de eliminar
   */
  _alEliminar(event: any) {
    const accion = event;
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_PLAN_COBERTURA,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLAN,
      this.codigoPlan,
      UrlRoute.ADMINISTRACION_PROTECCIONES_COBERTURA,
      accion.codigo,
      UrlRoute.SOLICITUD_ELIMINACION // Solicitud
    ]);
  }

  /**
   * Autor: Cesar Millan
   * Función: Realiza la acción de eliminar el registro
   */
  eliminar(codigo: string) {
    this.backService.planCobertura.deletePlanCobertura(codigo).subscribe(resp => {
      this.translate.get('global.eliminadoExitosoMensaje').subscribe(msn => {
        this.frontService.alert.success(msn);
      });
      this._selectDropdown(this.dataFiltros);
    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });
  }

  /**
   * @description metodo para realizar el oredenamiento de los datos de la tabla
   */
  _ordenar($event) {
    this._selectDropdown(this.dataFiltros, $event.pagina, $event.tamano, $event.sort);
  }

  /**
   * @description Metodo para construir los parametros para realizar la busqueda de los registros
   * @param event Datos de las listas deplegables para filtrar
   */
  _selectDropdown(event: any, pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc') {
    this.dataFiltros = event;
    let param: any = {
      'mimPlan.codigo': this.codigoPlan,
      page: pagina,
      size: tamanio,
      sort: sort,
      isPaged: true,
    };
    if (event !== undefined) {

      const codigoCobertura = event.filter(x => x.codeControl === 'cobertura').map(x => x.codigoDropdown)[0];
      if (codigoCobertura !== undefined) {
        param = {
          ...param,
          'mimCobertura.codigo': codigoCobertura
        };
      }
    }
    this.getDataTable(param);
  }

  /**
   * @description Metodo para obtener los datos y cargarlos en la tabla
   */
  getDataTable(param: any) {
    this.backService.planCobertura.getPlanesCoberturas(param)
      .subscribe((resp: any) => {
        this.configuracion.gridConfig.component.limpiar();

        if (!resp || !resp.content || resp.content.length === 0) {
          return;
        }
        this.planes = resp.content;
        this.configuracion.gridConfig.component.cargarDatos(
          resp.content, {
          maxPaginas: resp.totalPages,
          pagina: resp.number,
          cantidadRegistros: resp.totalElements
        });
      }, (err) => {
        this.frontService.alert.warning(err.error.message);
      });
  }

  irCrear() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_PLAN_COBERTURA,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLAN,
      this.codigoPlan,
      UrlRoute.ADMINISTRACION_PROTECCIONES_COBERTURA,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLANES_NUEVO
    ]);
  }

  /* Metodos para el flujo de Creación */
  /* Para el flujo de Creación */
  _guardarObservacion(datos: any) {
    const _datos = {
      ...datos,
      codigoPlan: this.codigoPlan,
      codigoSolicitudPadre: GENERALES.CODIGO_SOLICITUD_PADRE,
      codigoSolicitud: this.codigoPlan.toString(),
      nombreSolicitud: this.planes[0].mimPlan.nombre,
      codigoTipoSolicitud: GENERALES.TIPO_SOLICITUD.CODIGO_TIPO_SOLICITUD_APROBACION_PLAN,
      nombreTipoSolicitud: GENERALES.TIPO_SOLICITUD.NOMBRE_TIPO_SOLICITUD_APROBACION_PLAN
    };

    this.backService.proceso.iniciarProceso(GENERALES.PROCESO.APROBAR_PLAN, _datos).subscribe((resp: any) => {
      this.translate.get('global.solicitudCreacionEnviada').subscribe((getMensaje: string) => {
        this.translate.get('global.solicitudEliminacionMensaje', { mensaje: getMensaje, numero: resp }).subscribe((mensaje: string) => {
          this.frontService.alert.success(mensaje);
        });
      });

      this.irALIstar();
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  _apruebaRechazaSolicitud(datos: any) {
    if (this.esDirectorTecnico) {
      datos.aprobacionDirectorTecnico = datos.aprobar;
    } else {
      datos.aprobacionAnalistaTecnico = datos.aprobar;
    }
    this.backService.tarea.completarTarea(this.idTarea, datos).subscribe((resp: any) => {
      this.translate.get(datos.aprobar ? 'global.finalizaFlujo' : 'global.solicitudCreacionRechazadaMensaje').subscribe((mensaje: string) => {
        this.frontService.alert.success(mensaje);
      });

      this.router.navigate([UrlRoute.PAGES, UrlRoute.HOME]);
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  _toggleObservaciones(showModal?: boolean) {
    if (this.solicitud === UrlRoute.SOLICITUD_APROBACION) {
      this.irALIstar();
    }
  }

  anAtras() {
    this.location.back();
  }

  irALIstar() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_PLAN_COBERTURA
    ]);
  }

  private validarPermiso(autorizado: boolean) {
    if (!autorizado) {
      this.translate.get('error.403.mensaje').subscribe(msn => {
        this.frontService.alert.info(msn).then(() => { this.router.navigate([UrlRoute.PAGES]); });
      });
      return;
    }
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

    const param: any = {
      'mimPlan.codigo': this.codigoPlan,
      page: 0,
      size: 10,
      sort: 'fechaCreacion,desc',
      isPaged: true,
    };
    if (this.filtrosGrid.length > 0) {
      this.filtrosGrid.map((x: any) => param[x.columna.keyFiltro] = x.valor);
    }
    this.getDataTable(param);
  }

}
