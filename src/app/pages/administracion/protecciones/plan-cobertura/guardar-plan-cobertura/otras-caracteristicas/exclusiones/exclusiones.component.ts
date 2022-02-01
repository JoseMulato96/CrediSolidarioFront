import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormComponent } from '@core/guards';
import { BackFacadeService, FrontFacadeService } from '@core/services';
import { AppState } from '@core/store/reducers';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { MimGridComponent } from '@shared/components/mim-grid/mim-grid.component';
import { Page } from '@shared/interfaces/page.interface';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormValidate } from '@shared/util';
import { DateUtil } from '@shared/util/date.util';
import { from } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { Estado } from '../../../model/guardar-plan-cobertura-orden.model';
import { GuardarPlanCobertura } from '../../../model/guardar-plan-cobertura.model';
import { PostExclusionesAction } from '../../../plan-cobertura.actions';
import { obtenerSeccionPorId } from '../../../plan-cobertura.reducer';
import { ExclusionesConfig } from './exclusiones.config';

@Component({
  selector: 'app-exclusiones',
  templateUrl: './exclusiones.component.html'
})
export class ExclusionesComponent extends FormValidate implements OnInit, OnDestroy, AfterViewInit, FormComponent {

  /** Id de la seccion */
  id = 'exclusionesPlanCobertura';

  planCobertura: GuardarPlanCobertura;
  _subs: Subscription[] = [];


  cabeceraForm: FormGroup;
  isCabeceraForm: Promise<any>;
  detalleForm: FormGroup;
  isDetalleForm: Promise<any>;
  _esCreacion: boolean;
  _esCreacionDetalle: boolean;
  vigenciaFechasAMantenerSeleccionadas: Date[];

  configuracion: ExclusionesConfig = new ExclusionesConfig();

  dropdown: boolean;
  mostrarGuardar: boolean;
  exclusionPlanCobertura: any;
  exclusionPlanCoberturaDetalle: any;

  transaccionesSelected: any[] = [];
  canalesSelected: any[] = [];
  exclusionesCobertura: any;
  transacciones: any[];
  canales: any[];
  estado = true;

  respuestaTable: Promise<any>;
  estadoFecha: boolean;
  unidadPeriodo: any;
  unidadPeriodos: any[];

  nombrePlan: any;
  nombreCobertura: any;


  @ViewChild('gridDetalle')
  set gridDetalle(gridDetalle: MimGridComponent) {
    setTimeout(() => {
      if (!gridDetalle) {
        return;
      }

      // Limpiamos siempre la tabla antes de cargar los nuevos datos.
      gridDetalle.limpiar();
      this._cargarDatosTablaDetalle(this.exclusionPlanCobertura.mimExclusionPlanCoberturaDetalleList,
        gridDetalle);
    });
  }

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store<AppState>,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
  }

  ngOnInit() {
    // Realizamos el llamado al backend para listar por primera vez.
    this._subs.push(this.activatedRoute.params.subscribe((params: any) => {
      const codigoPlanCobertura = params.codigoCobertura === UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLANES_NUEVO ? null : params.codigoCobertura;
      if (codigoPlanCobertura) {
        this._listar(codigoPlanCobertura);
      }
    }));

    // Cargamos los datos luego de que los componentes visuales se hayan cargado para evitar errores.
    // El componente de la grilla/tabla se utiliza en este scope y para usarse la tabla debe estar renderizada.
    this._subs.push(this.store.select('planCoberturaUI')
      .subscribe(ui => {
        if (!ui || !ui.planCobertura) {
          this._cerrarSeccion();
          return;
        }

        this.planCobertura = ui;
        this._cargarDatosTabla(this.planCobertura.exclusionesPlanCobertura);

        // Debemos ademas intentar actualizar la tabla del modal de creacion/actualizacion.
        if (this.exclusionPlanCobertura) {
          const _mimExclusionPlanCobertura = Object(this.planCobertura.exclusionesPlanCobertura.content)
            .find(mimExclusionPlanCobertura =>
              mimExclusionPlanCobertura.mimExclusion.codigo === this.exclusionPlanCobertura.mimExclusion.codigo);
          this.exclusionPlanCobertura = _mimExclusionPlanCobertura;
          this._cargarDatosTablaDetalle(this.exclusionPlanCobertura.mimExclusionPlanCoberturaDetalleList,
            this.configuracion.gridDetalleConfig.component);
        }
      }));
  }

  ngOnDestroy() {
    this._subs.forEach(sub => sub.unsubscribe());
  }

  hasChanges() {
    return (this.cabeceraForm && this.cabeceraForm.dirty) || (this.detalleForm && this.detalleForm.dirty);
  }

  ngAfterViewInit() {
    // do nothing
  }

  async _toggle() {
    if (this.planCobertura) {
      this.dropdown = !this.dropdown;
    } else {
      this.translate.get('administracion.protecciones.planCobertura.datosPrincipales.alertas.guardar').subscribe((respuesta: string) => {
        this.frontService.alert.info(respuesta);
      });

      this._cerrarSeccion();
    }
  }

  private _cerrarSeccion() {
    this.dropdown = false;
    this.mostrarGuardar = false;
    this.exclusionPlanCobertura = undefined;
  }

  private _listar(codigoPlanCobertura: string, pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = 'true') {
    this.backService.exclusionPlanCobertura.getExclusionesPlanesCoberturas({
      'mimPlanCobertura.codigo': codigoPlanCobertura,
      estado: estado === 'false' ? '' : estado,
      page: pagina,
      size: tamanio,
      sort: sort,
      isPaged: true,
    }).subscribe((page: any) => {

      this.configuracion.gridConfig.component.limpiar();

      if (!page || !page.content || page.content.length === 0) {
        if (estado === 'true') {
          this.store.dispatch(new PostExclusionesAction(page, this.id, Estado.Pendiente));
        }
        return;
      }

      // Informamos que ya hay exclusiones plan cobertura al Redux para controlar el estado del componente.
      const estadoModulo = this.validarEstado(page.content) === undefined && (estado === 'false' || estado === '') ? Estado.Pendiente : Estado.Guardado;
      this.store.dispatch(new PostExclusionesAction(page, this.id, estadoModulo));
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  validarEstado(items: any) {
    return items.find(objec => objec.estado === true);
  }

  private _cargarDatosTabla(page: Page<any>) {
    if (!page || !page.content || page.content.length === 0) {
      return;
    }

    if (this.configuracion.gridConfig.component) {
      this.configuracion.gridConfig.component.limpiar();
      this.configuracion.gridConfig.component.cargarDatos(
        this._asignarEstados(page.content), {
        maxPaginas: page.totalPages,
        pagina: page.number,
        cantidadRegistros: page.totalElements
      });
    }
  }

  _asignarEstados(items: any) {
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

  _onSiguiente($event) {
    this._obtenerDatosConEstados($event, this.estado);
  }

  _onAtras($event) {
    this._obtenerDatosConEstados($event, this.estado);
  }

  _onClickCeldaElement($event) {
    if ($event.col.key === 'editar') {
      this._toggleGuardar(true, $event);
    } else {
      this._alEliminar($event.dato);
    }
  }

  private _alEliminar($event: any) {

    this.translate.get('administracion.protecciones.planCobertura.guardar.alertas.deseaEliminarRow')
      .subscribe((mensaje: string) => {
        const modalPromise = this.frontService.alert.confirm(mensaje, 'danger');
        const newObservable = from(modalPromise);

        newObservable.subscribe(
          (desition: any) => {
            if (desition === true) {
              this._eliminar($event.mimExclusion.codigo);
            }
          });
      });
  }

  private _eliminar(codigoExclusion: string) {
    this.backService.exclusionPlanCobertura.deleteExclusionPlanCobertura(codigoExclusion, this.planCobertura.planCobertura.codigo).subscribe(resp => {
      this.translate.get('global.eliminadoExitosoMensaje').subscribe(msn => {
        this.frontService.alert.success(msn);
      });
      this._listar(this.planCobertura.planCobertura.codigo, 0, 10, 'fechaCreacion,desc', String(this.estado));
    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });
  }

  _obtenerEstado(): string {
    if (!this.planCobertura) {
      return Estado.Pendiente;
    }

    const seccion = obtenerSeccionPorId(this.id, this.planCobertura.guardarPlanCoberturaOrden);
    return seccion ? seccion.estado : Estado.Pendiente;
  }

  _onToggleStatus($event) {
    this._obtenerDatosConEstados($event, $event.currentTarget.checked);
  }

  _obtenerDatosConEstados($event, estado: boolean) {
    this.estado = estado;
    this._listar(this.planCobertura.planCobertura.codigo, $event.pagina, $event.tamano, $event.sort, this.estado ? 'true' : '');
  }

  async _toggleGuardar(toggle: boolean, exclusionesPlanCobertura?: any) {
    if (!toggle && this.hasChanges()) {
      this.frontService.alert.confirm(this.translate.instant('global.onDeactivate')).then((respuesta: boolean) => {
        if (respuesta) {
          this.mostrarGuardar = false;
          this.limpiarFormularioDetalle();
        }
      });
    } else {
      // Intentamos cargar los datos de los desplegables solo cuando se abra el formulario.
      // Ademas, si ya estan inicializados, no lo hacemos de nuevo.
      await this._cargarDatosDesplegables();

      // Si no hay exclusiones configuradas para la cobertura informamos al usuario.
      if (toggle && (!this.exclusionesCobertura || this.exclusionesCobertura.length === 0)) {
        this.translate.get('administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.exclusiones.guardar.alertas.exclusionesCoberturaNoRelacionadas').subscribe((text: string) => {
          this.frontService.alert.info(text);
        });
      }

      if (exclusionesPlanCobertura) {
        this.exclusionPlanCobertura = JSON.parse(JSON.stringify(exclusionesPlanCobertura)).dato;
        this._esCreacion = false;
        await this._agregarRegistrosInactivosDesplegables(this.exclusionPlanCobertura);
        this.initCabeceraForm(this.exclusionPlanCobertura);
        this._esCreacionDetalle = true;
        this.initDetalleForm();
      } else {
        this.exclusionPlanCobertura = undefined;
        this._esCreacion = true;
        this.initCabeceraForm();
        this._esCreacionDetalle = true;
        this.initDetalleForm();
      }

      this.mostrarGuardar = toggle;
    }
  }

  private async _cargarDatosDesplegables() {

    // Obtenemos el nombre del plan y el nombre de la cobertura para mostrarlos como titulo
    this.nombrePlan = this.planCobertura.planCobertura.mimPlan.nombre;
    this.nombreCobertura = this.planCobertura.planCobertura.mimCobertura.nombre;

    if (!this.exclusionesCobertura || !this.transacciones || !this.canales || !this.unidadPeriodos) {
      const _exclusiones = await this.backService.exclusionCobertura.getExclusionesCoberturas({
        'mimCobertura.codigo': this.planCobertura.planCobertura.mimCobertura.codigo,
        'mimExclusion.estado': true,
        sort: 'mimExclusion.descripcion,asc'

      }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
      const _transacciones = await this.backService.tiposMovimientos.getTiposMovimientos({ estado: true, sort: 'nombre,asc' }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
      const _canales = await this.backService.canal.getCanalesVentas({ estado: true, sort: 'nombre,asc', size: 1000 }).toPromise().catch(err => this.frontService.alert.error(err.error.message));

      const _unidadesTiempo = await this.backService.unidadTiempo.obtenerUnidadesTiempo({ estado: true, sort: 'nombre,asc' }).toPromise().catch(err => this.frontService.alert.error(err.error.message));

      this.exclusionesCobertura = _exclusiones.content;
      this.transacciones = _transacciones._embedded.mimTipoMovimiento;
      this.canales = _canales._embedded.mimCanal;
      this.unidadPeriodos = _unidadesTiempo._embedded.mimUnidadTiempo;
    }
  }

  private async _agregarRegistrosInactivosDesplegables(exclusionPlanCobertura: any) {
    if (!this._esCreacion && !this.obtenerExclusion(exclusionPlanCobertura.mimExclusion.codigo)) {
      this.exclusionesCobertura.push({ mimExclusion: exclusionPlanCobertura.mimExclusion });
    }
  }

  private initCabeceraForm(param?: any) {
    this.isCabeceraForm = Promise.resolve(
      this.cabeceraForm = this.formBuilder.group({
        exclusion: new FormControl(param ? this.obtenerExclusion(param.mimExclusion.codigo) : null, [Validators.required]),
        vigente: new FormControl(param ? param.estado : false, [Validators.required])
      })
    );

    if (!this._esCreacion) {
      this.cabeceraForm.controls.exclusion.disable();
    } else {
      this.cabeceraForm.controls.vigente.setValue(true);
      this.cabeceraForm.controls.vigente.disable();
    }

    if (this.planCobertura && this.planCobertura.planCobertura.mimEstadoPlanCobertura.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.INACTIVO) {
      this.cabeceraForm.disable();
    }
  }

  private limpiarFormularioCabecera(param?: any) {
    this.cabeceraForm.reset();
    this.initCabeceraForm(param);
  }

  _guardarCabecera() {
    if (this.cabeceraForm.invalid) {
      this.validateForm(this.cabeceraForm);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }

    if (this._esCreacion) {
      this._crearCabecera();
    } else {
      this._actualizarCabecera();
    }
  }

  _crearCabecera() {
    const mimExclusionPlanCobertura = {
      estado: this.cabeceraForm.controls.vigente.value,
      mimExclusion: { codigo: this.cabeceraForm.controls.exclusion.value.mimExclusion.codigo },
      mimPlanCobertura: { codigo: this.planCobertura.planCobertura.codigo }
    };

    this.backService.exclusionPlanCobertura.postExclusionPlanCobertura(mimExclusionPlanCobertura).subscribe((respuesta: any) => {
      // Transformamos a edicion
      this.exclusionPlanCobertura = respuesta;
      this._esCreacion = false;
      this.cabeceraForm.controls.vigente.enable();
      this.limpiarFormularioCabecera(this.exclusionPlanCobertura);

      this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          // Recargamos la informacion de la tabla.
          this._listar(this.planCobertura.planCobertura.codigo);
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });

  }

  _actualizarCabecera() {
    const mimExclusionPlanCobertura = {
      estado: this.cabeceraForm.controls.vigente.value,
      mimExclusion: { codigo: this.exclusionPlanCobertura.mimExclusion.codigo },
      mimPlanCobertura: { codigo: this.planCobertura.planCobertura.codigo }
    };

    this.backService.exclusionPlanCobertura.putExclusionPlanCobertura(
      this.exclusionPlanCobertura.mimExclusion.codigo,
      this.planCobertura.planCobertura.codigo,
      mimExclusionPlanCobertura).subscribe((respuesta: any) => {

        this.exclusionPlanCobertura = respuesta;
        this.limpiarFormularioCabecera(this.exclusionPlanCobertura);

        this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
          this.frontService.alert.success(text).then(() => {
            // Recargamos la informacion de la tabla.
            this.exclusionPlanCobertura = undefined;
            this.mostrarGuardar = false;
            this._listar(this.planCobertura.planCobertura.codigo);

          });
        });
      }, (err) => {
        this.frontService.alert.error(err.error.message);
      });
  }

  private _cargarDatosTablaDetalle(content: any[], gridDetalle: MimGridComponent) {
    if (!content || content.length === 0) {
      return;
    }

    if (gridDetalle) {
      gridDetalle.limpiar();
      gridDetalle.cargarDatos(
        this._asignarEstados(content), {
        maxPaginas: Math.ceil(content.length / 10),
        pagina: 0,
        cantidadRegistros: content.length
      });
    }
  }

  _onClickCeldaDetalle($event) {
    if (!this.exclusionPlanCobertura) {
      return;
    }

    this._esCreacionDetalle = false;

    this.exclusionPlanCoberturaDetalle = $event;
    this.initDetalleForm($event);
  }

  private initDetalleForm(param?: any) {
    this.isDetalleForm = Promise.resolve(
      this.detalleForm = this.formBuilder.group({
        periodoDefinido: new FormControl(param ? param.periodoDefinido : null, [Validators.min(1)]),
        unidadPeriodoDefinido: new FormControl(param && param.unidadPeriodoDefinido !== undefined ? this.obtenerUnidad(param.unidadPeriodoDefinido.codigo) : null),
        contribuciones: new FormControl(param ? param.contribuciones : null),
        transaccion: new FormControl(param ? this.obtenerTransaccion(param.mimTransaccionExclusionList) : null, [Validators.required]),
        canal: new FormControl(param ? this.obtenerCanal(param.mimCanalVentaExclusionList) : null, [Validators.required]),
        fechaInicioFechaFin: new FormControl(param ? this.rangoFechaSelected(param.fechaInicio, param.fechaFin) : null, [Validators.required]),
        vigenteDetalle: new FormControl(param ? param.estado : false, [Validators.required])
      })
    );

    if (this.exclusionPlanCobertura && !this.exclusionPlanCobertura.estado ||
      this.planCobertura && this.planCobertura.planCobertura.mimEstadoPlanCobertura.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.INACTIVO) {
      this.detalleForm.disable();
    }

    this.vigenciaFechasAMantenerSeleccionadas = undefined;
    if (!this._esCreacionDetalle) {
      this.vigenciaFechasAMantenerSeleccionadas = [DateUtil.stringToDate(param ? param.fechaInicio : null)];
    }
  }

  private obtenerExclusion(codigo: number) {
    return this.exclusionesCobertura.find(exclusion => (exclusion.mimExclusion && exclusion.mimExclusion.codigo === codigo) ? exclusion.mimExclusion.codigo === codigo : null);
  }

  private obtenerUnidad(codigo: number) {
    return this.unidadPeriodos.find(unidad => unidad.codigo === codigo);
  }

  private obtenerTransaccion(obj: any[]) {
    return this.transacciones.filter(transaccion => obj.find(transaccionObj => transaccionObj.mimTransaccionExclusionPK.codigoTransaccion === transaccion.codigo));
  }

  private obtenerCanal(obj: any[]) {
    return this.canales.filter(canal => obj.find(canalObj => canalObj.mimCanalVentaExclusionPK.codigoCanalVenta === canal.codigo));
  }

  rangoFechaSelected(fechaIni: any, fechaFin: any) {
    return [DateUtil.stringToDate(fechaIni), DateUtil.stringToDate(fechaFin)];
  }

  limpiarFormularioDetalle() {
    this.exclusionPlanCoberturaDetalle = undefined;
    this._esCreacionDetalle = true;
    this.detalleForm.reset();
    this.initDetalleForm();
  }

  _guardarDetalle() {
    if (this.detalleForm.invalid) {
      this.validateForm(this.detalleForm);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }

    if (this._esCreacionDetalle) {
      this._crearDetalle();
    } else {
      this._actualizarDetalle();
    }
  }

  private _crearDetalle() {
    let detalle = [];
    const transaccionList = [];
    const canalList = [];

    this.detalleForm.controls.transaccion.value.forEach(transaccion => {
      transaccionList.push({
        mimTransaccionExclusionPK: { codigoTransaccion: transaccion.codigo },
        mimTransaccion: { codigo: transaccion.codigo }
      });
    });

    this.detalleForm.controls.canal.value.forEach(canal => {
      canalList.push({
        mimCanalVentaExclusionPK: { codigoCanalVenta: canal.codigo },
        mimCanalVenta: { codigo: canal.codigo }
      });
    });

    detalle = [{
      estado: this.detalleForm.controls.vigenteDetalle.value,
      periodoDefinido: this.detalleForm.controls.periodoDefinido.value,
      unidadPeriodoDefinido: this.detalleForm.controls.unidadPeriodoDefinido.value,
      contribuciones: this.detalleForm.controls.contribuciones.value,

      fechaInicio: DateUtil.dateToString(this.detalleForm.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy'),
      fechaFin: DateUtil.dateToString(this.detalleForm.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy'),
      mimTransaccionExclusionList: transaccionList,
      mimCanalVentaExclusionList: canalList
    }];

    const mimExclusionPlanCobertura = {
      estado: this.cabeceraForm.controls.vigente.value,
      mimExclusion: { codigo: this.exclusionPlanCobertura.mimExclusion.codigo },
      mimPlanCobertura: { codigo: this.planCobertura.planCobertura.codigo },
      mimExclusionPlanCoberturaDetalleList: detalle
    };

    this.backService.exclusionPlanCobertura.putExclusionPlanCobertura(
      this.exclusionPlanCobertura.mimExclusion.codigo,
      this.planCobertura.planCobertura.codigo,
      mimExclusionPlanCobertura).subscribe((respuesta: any) => {
        this.exclusionPlanCobertura = respuesta;
        // Limpiamos el formulario.
        this.limpiarFormularioDetalle();

        this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
          this.frontService.alert.success(text).then(() => {
            // Recargamos la informacion de la tabla.
            this._listar(this.planCobertura.planCobertura.codigo);

          });
        });
      }, (err) => {
        this.frontService.alert.error(err.error.message);
      });
  }

  private _actualizarDetalle() {
    let detalle = [];
    const transaccionList = [];
    const canalList = [];

    this.detalleForm.controls.transaccion.value.forEach(transaccion => {
      transaccionList.push({
        mimTransaccionExclusionPK: { codigoTransaccion: transaccion.codigo },
        mimTransaccion: { codigo: transaccion.codigo }
      });
    });

    this.detalleForm.controls.canal.value.forEach(canal => {
      canalList.push({
        mimCanalVentaExclusionPK: { codigoCanalVenta: canal.codigo },
        mimCanalVenta: { codigo: canal.codigo }
      });
    });

    detalle = [{
      codigo: this.exclusionPlanCoberturaDetalle ? this.exclusionPlanCoberturaDetalle.codigo : null,
      estado: this.detalleForm.controls.vigenteDetalle.value,
      periodoDefinido: this.detalleForm.controls.periodoDefinido.value,
      unidadPeriodoDefinido: this.detalleForm.controls.unidadPeriodoDefinido.value,
      contribuciones: this.detalleForm.controls.contribuciones.value,

      fechaInicio: DateUtil.dateToString(this.detalleForm.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy'),
      fechaFin: DateUtil.dateToString(this.detalleForm.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy'),
      mimTransaccionExclusionList: transaccionList,
      mimCanalVentaExclusionList: canalList
    }];

    const mimExclusionPlanCobertura = {
      estado: this.cabeceraForm.controls.vigente.value,
      mimExclusion: { codigo: this.exclusionPlanCobertura.mimExclusion.codigo },
      mimPlanCobertura: { codigo: this.planCobertura.planCobertura.codigo },
      mimExclusionPlanCoberturaDetalleList: detalle
    };

    this.backService.exclusionPlanCobertura.putExclusionPlanCobertura(
      this.exclusionPlanCobertura.mimExclusion.codigo,
      this.planCobertura.planCobertura.codigo,
      mimExclusionPlanCobertura).subscribe((respuesta: any) => {
        this.exclusionPlanCobertura = respuesta;
        // Limpiamos el formulario.
        this.limpiarFormularioDetalle();

        this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
          this.frontService.alert.success(text).then(() => {
            // Recargamos la informacion de la tabla.
            this._listar(this.planCobertura.planCobertura.codigo);

          });
        });
      }, (err) => {
        this.frontService.alert.error(err.error.message);
      });
  }

}
