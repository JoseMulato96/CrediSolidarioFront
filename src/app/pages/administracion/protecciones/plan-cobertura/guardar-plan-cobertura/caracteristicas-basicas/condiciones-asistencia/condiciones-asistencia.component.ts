import { AfterViewInit, Component, forwardRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
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
import { from, Subscription } from 'rxjs';
import { Estado } from '../../../model/guardar-plan-cobertura-orden.model';
import { GuardarPlanCobertura } from '../../../model/guardar-plan-cobertura.model';
import { IMimBeneficiarioAsistencia } from '../../../model/mim-beneficiario-asistencia.model';
import { PostCondicionesAsistencia } from '../../../plan-cobertura.actions';
import { obtenerSeccionAnteriorPorId, obtenerSeccionPorId } from '../../../plan-cobertura.reducer';
import { CondicionesAsistenciaConfig } from './condiciones-asistencia.config';

@Component({
  selector: 'app-condiciones-asistencia',
  templateUrl: './condiciones-asistencia.component.html',
  styleUrls: ['./condiciones-asistencia.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CondicionesAsistenciaComponent),
      multi: true
    }
  ]
})
export class CondicionesAsistenciaComponent extends FormValidate implements OnInit, OnDestroy, AfterViewInit, FormComponent {
  /** Id de la seccion */
  id = 'condicionesAsistencia';

  planCobertura: GuardarPlanCobertura;
  _subs: Subscription[] = [];

  cabeceraForm: FormGroup;
  isCabeceraForm: Promise<any>;
  detalleForm: FormGroup;
  isDetalleForm: Promise<any>;
  _esCreacion: boolean;
  _esCreacionDetalle: boolean;
  proveedores: any[];
  aplicaciones: any[];
  unidadesEventos: any[];
  _ilimitado: boolean;
  vigenciaFechasAMantenerSeleccionadas: Date[];

  configuracion: CondicionesAsistenciaConfig = new CondicionesAsistenciaConfig();

  dropdown: boolean;
  mostrarGuardar: boolean;
  asistenciaPlanCobertura: any;
  asistenciaPlanCoberturaDetalle: any;

  estado = true;
  estadoFecha: boolean;

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
      this._cargarDatosTablaDetalle(this.asistenciaPlanCobertura.mimAsistenciaPlanCoberturaDetalleList,
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
        this._cargarDatosTabla(this.planCobertura.condicionesAsistencia);

        // Debemos ademas intentar actualizar la tabla del modal de creacion/actualizacion.
        if (this.asistenciaPlanCobertura) {
          const _mimAsistenciaPlanCobertura = Object(this.planCobertura.condicionesAsistencia.content)
            .find(mimAsistenciaPlanCobertura =>
              mimAsistenciaPlanCobertura.codigo === this.asistenciaPlanCobertura.codigo);
          this.asistenciaPlanCobertura = _mimAsistenciaPlanCobertura;
          this._cargarDatosTablaDetalle(this.asistenciaPlanCobertura.mimAsistenciaPlanCoberturaDetalleList,
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
    // Validamos que la seccion anterior este guardado.
    const seccionAnterior = obtenerSeccionAnteriorPorId(this.id, this.planCobertura.guardarPlanCoberturaOrden);
    const seccion = obtenerSeccionPorId(this.id, this.planCobertura.guardarPlanCoberturaOrden);
    if (seccionAnterior && (!seccionAnterior.estado || seccionAnterior.estado === Estado.Pendiente)) {
      const seccionAnteriorTitle = await this.translate.get(seccionAnterior.title).toPromise();
      const seccionTitle = await this.translate.get(seccion.title).toPromise();
      const mensaje = await this.translate.get('administracion.protecciones.planCobertura.guardar.alertas.debeCompletarSeccionAnterior',
        {
          anterior: seccionAnteriorTitle,
          seccion: seccionTitle
        }).toPromise();
      this.frontService.alert.info(mensaje);
      return;
    }

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
    this.asistenciaPlanCobertura = undefined;
  }

  private _listar(codigoPlanCobertura: string, pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = 'true') {
    this.backService.asistenciaPlanCobertura.obtenerAsistenciasPlanCobertura({
      'mimPlanCobertura.codigo': codigoPlanCobertura,
      estado: estado,
      page: pagina,
      size: tamanio,
      sort: sort,
      isPaged: true,
    }).subscribe((page: any) => {

      this.configuracion.gridConfig.component.limpiar();

      if (!page || !page.content || page.content.length === 0) {
        if (estado === 'true') {
          this.store.dispatch(new PostCondicionesAsistencia(page, this.id, Estado.Pendiente));
        }
        return;
      }

      // Informamos que ya hay condiciones asistencia al Redux para controlar el estado del componente.
      page.content = this.asignarEstados(page.content);
      let estadoModulo = this.validarEstado(page.content) === undefined && (estado === 'false' || estado === '') ? Estado.Pendiente : Estado.Guardado;
      this.store.dispatch(new PostCondicionesAsistencia(page, this.id, estadoModulo));
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  validarEstado(items: any) {
    return items.find(objec => objec.estado === true);
  }

  private asignarEstados(items: any) {
    const objetos = [];
    let x: any;
    for (x of items) {
      objetos.push({ ...x, _estado: x.estado ? 'Sí' : 'No' });
    }
    return objetos;
  }

  private _cargarDatosTabla(page: Page<any>) {
    if (!page || !page.content || page.content.length === 0) {
      return;
    }

    if (this.configuracion.gridConfig.component) {
      this.configuracion.gridConfig.component.limpiar();
      this.configuracion.gridConfig.component.cargarDatos(
        page.content, {
        maxPaginas: page.totalPages,
        pagina: page.number,
        cantidadRegistros: page.totalElements
      });
    }
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
    const condicionAsistencia = $event;
    this.translate.get('administracion.protecciones.planCobertura.guardar.caracteristicasBasicas.condicionesAsistencia.alertas.deseaEliminar', {
      condicionAsistencia:
        `${condicionAsistencia.codigo} - ${condicionAsistencia.nombreServicio}`
    }).subscribe((mensaje: string) => {
      const modalPromise = this.frontService.alert.confirm(mensaje, 'danger');
      const newObservable = from(modalPromise);

      newObservable.subscribe(
        (desition: any) => {
          if (desition === true) {
            this.eliminar(condicionAsistencia.codigo);
          }
        });
    });
  }

  private eliminar(codigo: number) {
    this.backService.asistenciaPlanCobertura.eliminarAsistenciaPlanCobertura(String(codigo)).subscribe((respuesta) => {
      this.translate.get('global.eliminadoExitosoMensaje').subscribe(msn => {
        this.frontService.alert.success(msn);
      });

      this._listar(this.planCobertura.planCobertura.codigo);
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

  async _toggleGuardar(toggle: boolean, asistenciaPlanCobertura?: any) {
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

      if (asistenciaPlanCobertura) {
        this.asistenciaPlanCobertura = JSON.parse(JSON.stringify(asistenciaPlanCobertura)).dato;
        this._esCreacion = false;
        this.initCabeceraForm(this.asistenciaPlanCobertura);
        this._esCreacionDetalle = true;
        this.initDetalleForm();
      } else {
        this.asistenciaPlanCobertura = undefined;
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

    if (!this.proveedores || !this.aplicaciones || !this.unidadesEventos) {
      const _proveedores = await this.backService.proveedor.obtenerProveedores({ estado: true }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
      const _aplicaciones = await this.backService.tipoBeneficiarioServicio.obtenerTiposBeneficiariosServicio({ estado: true }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
      const _unidadesEventos = await this.backService.unidadTiempo.obtenerUnidadesTiempo({ estado: true }).toPromise().catch(err => this.frontService.alert.error(err.error.message));

      this.proveedores = _proveedores._embedded.mimProveedor;
      this.aplicaciones = _aplicaciones._embedded.mimTipoBeneficiarioServicio;
      this.unidadesEventos = _unidadesEventos._embedded.mimUnidadTiempo;
    }
  }

  private _agregarRegistrosInactivosDesplegables(element: any) {
    if (!this.obtenerProveedor(element.mimProveedor.codigo)) {
      this.proveedores.push(element.mimProveedor);
    }
    if (element.mimUnidadTiempo && !this.obtenerUnidadTiempo(element.mimUnidadTiempo.codigo)) {
      this.unidadesEventos.push(element.mimUnidadTiempo);
    }

    if (element.mimBeneficiarioAsistenciaList) {
      element.mimBeneficiarioAsistenciaList.filter(x => {
        if (!this.aplicaciones.find(t => t.codigo === x.mimTipoBeneficiarioServicio.codigo)) {
          this.aplicaciones.push(x.mimTipoBeneficiarioServicio);
        }
      });
    }
  }

  private initCabeceraForm(param?: any) {
    this.isCabeceraForm = Promise.resolve(
      this.cabeceraForm = this.formBuilder.group({
        nombreServicio: new FormControl(param && param.nombreServicio ? param.nombreServicio : null,
          [Validators.required]),
        vigente: new FormControl(param && param.estado ? param.estado : false, [Validators.required])
      })
    );

    this.estadoFecha = param && !param.estado || this.planCobertura && this.planCobertura.planCobertura.mimEstadoPlanCobertura.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.INACTIVO;
    if (!this._esCreacion) {
      this.cabeceraForm.controls.vigente.enable();
      if (param && !param.estado) {
        this.cabeceraForm.controls.nombreServicio.disable();
      } else {
        this.cabeceraForm.enable();
      }
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

  private _crearCabecera() {
    const mimAsistenciaPlanCobertura = {
      mimPlanCobertura: {
        codigo: this.planCobertura.planCobertura.codigo
      },
      nombreServicio: this.cabeceraForm.controls.nombreServicio.value,
      estado: this.cabeceraForm.controls.vigente.value
    };


    this.backService.asistenciaPlanCobertura.crearAsistenciaPlanCobertura(mimAsistenciaPlanCobertura).subscribe(_mimAsistenciaPlanCobertura => {
      // Transformamos a edicion.
      this.asistenciaPlanCobertura = _mimAsistenciaPlanCobertura;
      this._esCreacion = false;
      this.cabeceraForm.controls.vigente.enable();
      this.limpiarFormularioCabecera(this.asistenciaPlanCobertura);

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

  private _actualizarCabecera() {
    const mimAsistenciaPlanCobertura = {
      codigo: this.asistenciaPlanCobertura.codigo,
      mimPlanCobertura: {
        codigo: this.planCobertura.planCobertura.codigo
      },
      nombreServicio: this.cabeceraForm.controls.nombreServicio.value,
      estado: this.cabeceraForm.controls.vigente.value
    };

    this.backService.asistenciaPlanCobertura.actualizarAsistenciaPlanCobertura(
      this.asistenciaPlanCobertura.codigo,
      mimAsistenciaPlanCobertura).subscribe(_mimAsistenciaPlanCobertura => {
        this.asistenciaPlanCobertura = _mimAsistenciaPlanCobertura;
        this.limpiarFormularioCabecera(this.asistenciaPlanCobertura);

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

  private _cargarDatosTablaDetalle(content: any[], gridDetalle: MimGridComponent) {
    if (!content || content.length === 0) {
      return;
    }

    if (gridDetalle) {
      gridDetalle.limpiar();
      gridDetalle.cargarDatos(
        content, {
        maxPaginas: Math.ceil(content.length / 10),
        pagina: 0,
        cantidadRegistros: content.length
      });
    }
  }

  _onClickCeldaDetalle($event) {
    if (!this.asistenciaPlanCobertura) {
      return;
    }

    this.asistenciaPlanCoberturaDetalle = $event;

    this._esCreacionDetalle = false;
    this._agregarRegistrosInactivosDesplegables(this.asistenciaPlanCoberturaDetalle);


    this.initDetalleForm(this.asistenciaPlanCoberturaDetalle);
  }


  private initDetalleForm(paramDetalle?: any) {
    this.isDetalleForm = Promise.resolve(
      this.detalleForm = this.formBuilder.group({
        proveedor: new FormControl(paramDetalle && paramDetalle.mimProveedor ? this.obtenerProveedor(paramDetalle.mimProveedor.codigo) : null, [Validators.required]),
        aplicaPara: new FormControl(paramDetalle ? this.obtenerTiposBeneficiariosServicio(paramDetalle.mimBeneficiarioAsistenciaList) : null, [Validators.required]),
        servicioIlimitado: new FormControl(false, [Validators.required]),
        numeroEventos: new FormControl(paramDetalle && paramDetalle.numeroEventos ? paramDetalle.numeroEventos : null, [
          Validators.required,
          Validators.min(0),
          Validators.max(999)]),
        unidadEventos: new FormControl(paramDetalle && paramDetalle.mimUnidadTiempo ?
          this.obtenerUnidadTiempo(paramDetalle.mimUnidadTiempo.codigo)
          : null, [Validators.required]),
        fechaInicioFechaFin: new FormControl(paramDetalle ? this.rangoFechaSelected(paramDetalle.fechaInicio, paramDetalle.fechaFin) : null, [Validators.required]),
      })
    );
    this.onChangesDetalle();

    // Es ilimitado si no tiene valor para numero de eventos o unidad de tiempo.
    // Ademas paramDetalle debe venir informado para asegurarnos de que por defecto sea falso.
    this._ilimitado = (paramDetalle !== null && paramDetalle !== undefined)
      && ((paramDetalle.numeroEventos === null || paramDetalle.numeroEventos === undefined)
        && (paramDetalle.mimUnidadTiempo === null) || paramDetalle.mimUnidadTiempo === undefined);
    this.detalleForm.controls.servicioIlimitado.setValue(this._ilimitado);

    this.vigenciaFechasAMantenerSeleccionadas = undefined;
    if (!this._esCreacionDetalle) {
      this.vigenciaFechasAMantenerSeleccionadas = [DateUtil.stringToDate(paramDetalle ? paramDetalle.fechaInicio : null)];
    }

    if (this.cabeceraForm && !this.cabeceraForm.controls.vigente.value) {
      this.detalleForm.disable();
    }

    if (this.planCobertura && this.planCobertura.planCobertura.mimEstadoPlanCobertura.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.INACTIVO) {
      this.detalleForm.disable();
    }
  }

  private onChangesDetalle() {
    this.detalleForm.controls.servicioIlimitado.valueChanges.subscribe(servicioIlimitado => {
      if (servicioIlimitado) {
        this.detalleForm.controls.numeroEventos.disable();
        this.detalleForm.controls.numeroEventos.setValue(null);
        this.detalleForm.controls.numeroEventos.markAsPristine({ onlySelf: true });
        this.detalleForm.controls.unidadEventos.disable();
        this.detalleForm.controls.unidadEventos.setValue(null);
        this.detalleForm.controls.unidadEventos.markAsPristine({ onlySelf: true });
        this._ilimitado = true;
      } else {
        this.detalleForm.controls.numeroEventos.enable();
        this.detalleForm.controls.unidadEventos.enable();
        this._ilimitado = false;
      }
    });
  }

  private obtenerProveedor(codigo: any) {
    return this.proveedores ? this.proveedores.find(proveedor => proveedor.codigo === codigo) : null;
  }

  private obtenerUnidadTiempo(codigo: any) {
    return this.unidadesEventos ? this.unidadesEventos.find(unidadTiempo => unidadTiempo.codigo === codigo) : null;
  }

  private obtenerTiposBeneficiariosServicio(tiposBeneficiariosServicio: any[]) {
    return this.aplicaciones ? this.aplicaciones.filter(_tipoBeneficiarioServicio => {
      return tiposBeneficiariosServicio.find(tipoBeneficiarioServicio =>
        tipoBeneficiarioServicio.mimTipoBeneficiarioServicio.codigo === _tipoBeneficiarioServicio.codigo);
    }) : null;
  }

  private rangoFechaSelected(fechaIni: any, fechaFin: any) {
    return [DateUtil.stringToDate(fechaIni), DateUtil.stringToDate(fechaFin)];
  }

  limpiarFormularioDetalle() {
    this.asistenciaPlanCoberturaDetalle = undefined;
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
    const tiposBeneficiariosServicio: IMimBeneficiarioAsistencia[] = [];
    this.detalleForm.controls.aplicaPara.value.forEach(tipoBeneficiarioServicio => {
      tiposBeneficiariosServicio.push({
        mimBeneficiarioAsistenciaPK: {
          codigoBeneficiarioServicio: tipoBeneficiarioServicio.codigo
        },
        mimTipoBeneficiarioServicio: {
          codigo: tipoBeneficiarioServicio.codigo
        }
      });
    });

    const mimAsistenciaPlanCobertura = {
      codigo: this.asistenciaPlanCobertura.codigo,
      mimPlanCobertura: {
        codigo: this.planCobertura.planCobertura.codigo
      },
      nombreServicio: this.asistenciaPlanCobertura.nombreServicio,
      estado: this.asistenciaPlanCobertura.estado,
      mimAsistenciaPlanCoberturaDetalleList: [
        {
          mimProveedor: {
            codigo: this.detalleForm.controls.proveedor.value.codigo
          },
          numeroEventos: this.detalleForm.controls.numeroEventos.value,
          mimUnidadTiempo: this.detalleForm.controls.unidadEventos.value ? {
            codigo: this.detalleForm.controls.unidadEventos.value.codigo
          } : null,
          fechaInicio: DateUtil.dateToString(this.detalleForm.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy'),
          fechaFin: DateUtil.dateToString(this.detalleForm.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy'),
          mimBeneficiarioAsistenciaList: tiposBeneficiariosServicio
        }
      ]
    };

    this.backService.asistenciaPlanCobertura.actualizarAsistenciaPlanCobertura(
      this.asistenciaPlanCobertura.codigo,
      mimAsistenciaPlanCobertura).subscribe(_mimAsistenciaPlanCobertura => {
        this.asistenciaPlanCobertura = _mimAsistenciaPlanCobertura;
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
    const tiposBeneficiariosServicio: IMimBeneficiarioAsistencia[] = [];
    this.detalleForm.controls.aplicaPara.value.forEach(tipoBeneficiarioServicio => {
      tiposBeneficiariosServicio.push({
        mimBeneficiarioAsistenciaPK: {
          codigoBeneficiarioServicio: tipoBeneficiarioServicio.codigo
        },
        mimTipoBeneficiarioServicio: {
          codigo: tipoBeneficiarioServicio.codigo
        }
      });
    });

    const mimAsistenciaPlanCobertura = {
      codigo: this.asistenciaPlanCobertura.codigo,
      mimPlanCobertura: {
        codigo: this.planCobertura.planCobertura.codigo
      },
      nombreServicio: this.asistenciaPlanCobertura.nombreServicio,
      estado: this.asistenciaPlanCobertura.estado,
      mimAsistenciaPlanCoberturaDetalleList: [
        {
          codigo: this.asistenciaPlanCoberturaDetalle ? this.asistenciaPlanCoberturaDetalle.codigo : null,
          mimProveedor: {
            codigo: this.detalleForm.controls.proveedor.value.codigo
          },
          numeroEventos: this.detalleForm.controls.numeroEventos.value,
          mimUnidadTiempo: this.detalleForm.controls.unidadEventos.value ? {
            codigo: this.detalleForm.controls.unidadEventos.value.codigo
          } : null,
          fechaInicio: DateUtil.dateToString(this.detalleForm.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy'),
          fechaFin: DateUtil.dateToString(this.detalleForm.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy'),
          mimBeneficiarioAsistenciaList: tiposBeneficiariosServicio
        }
      ]
    };

    this.backService.asistenciaPlanCobertura.actualizarAsistenciaPlanCobertura(
      this.asistenciaPlanCobertura.codigo,
      mimAsistenciaPlanCobertura).subscribe(_mimAsistenciaPlanCobertura => {
        this.asistenciaPlanCobertura = _mimAsistenciaPlanCobertura;
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
