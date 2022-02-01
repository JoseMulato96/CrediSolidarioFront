import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormComponent } from '@core/guards';
import { BackFacadeService, FrontFacadeService } from '@core/services';
import { AppState } from '@core/store/reducers';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Page } from '@shared/interfaces/page.interface';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormValidate } from '@shared/util';
import { from, Subscription } from 'rxjs';
import { Estado } from '../../../model/guardar-plan-cobertura-orden.model';
import { GuardarPlanCobertura } from '../../../model/guardar-plan-cobertura.model';
import { PostConceptoFacturacionPlanCoberturaAction } from '../../../plan-cobertura.actions';
import { obtenerSeccionPorId } from '../../../plan-cobertura.reducer';
import { ConceptosFacturacionConfig } from './conceptos-facturacion.config';

@Component({
  selector: 'app-conceptos-facturacion',
  templateUrl: './conceptos-facturacion.component.html',
})
export class ConceptosFacturacionComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  /** Id de la seccion */
  id = 'conceptosFacturacion';
  configuracion: ConceptosFacturacionConfig = new ConceptosFacturacionConfig();
  planCobertura: GuardarPlanCobertura;
  _subs: Subscription[] = [];
  form: FormGroup;
  isForm: Promise<any>;
  _esCreacion: boolean;

  dropdown: boolean;
  mostrarGuardar: boolean;
  estado = true;
  conceptoFacturacionPlanCobertura: any;
  conceptos: any[];
  tiposConceptos: any[];
  tiposConceptosSinFiltro: any[];
  conceptosFacturacionSinFiltro: any[];
  producto: any;

  estadoCrear = true;
  estadoFecha: boolean;
  selection = false;
  tipo: boolean;

  nombrePlan: any;
  nombreCobertura: any;

  proteccionesEventos: any[] = [];

  listaConceptos: any[] = [];



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

  hasChanges() {
    return this.form && this.form.dirty;
  }

  private initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        tipoConcepto: new FormControl(param ? this.obtenertipoConcepto(param.dato.mimTipoConcepto.codigo) : null, [Validators.required]),
        concepta: new FormControl(param ? this.obtenerConcepto(param.dato.sipConceptoFacturacion.concepto) : null, [Validators.required]),
      })
    );
  }

  private obtenertipoConcepto(codigo: any) {
    return this.tiposConceptos.find(res => res.codigo === codigo);
  }

  private obtenerConcepto(codigo: any) {
    return this.conceptos.find(res => res.concepto === codigo);
  }

  ngOnDestroy(): void {
    this._subs.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    this._subs.push(this.store.select('planCoberturaUI')
      .subscribe(ui => {
        if (!ui || !ui.planCobertura) {
          return;
        }

        this.planCobertura = ui;
        this._cargarDatosTabla(this.planCobertura.conceptoFacturacionPlanCobertura);
      }));

    // Realizamos el llamado al backend para listar por primera vez.
    this._subs.push(this.activatedRoute.params.subscribe((params: any) => {
      const codigoPlanCobertura = params.codigoCobertura === UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLANES_NUEVO ? null : params.codigoCobertura;
      if (codigoPlanCobertura) {
        this._listar(codigoPlanCobertura);
      }
    }));

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
    this.conceptoFacturacionPlanCobertura = undefined;
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

  private async _listar(codigoPlanCobertura: string, pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = 'true') {
    this.producto = await this.backService.productoCobertura.obtenerMimProductoCoberturaByPlanCobertura(codigoPlanCobertura)
      .toPromise().catch(err => this.frontService.alert.error(err.error.message));

    this.backService.conceptoFacturacionPlanCobertura.getConceptosFacturacion({
      'sipProducto.codigo': this.producto.sipProducto.codigo,
      'mimPlanCobertura.codigo': codigoPlanCobertura,
      estado: estado,
      page: pagina,
      size: tamanio,
      isPaged: true,
    }).subscribe((page: any) => {
      this.configuracion.gridConfig.component.limpiar();

      if (!page || !page.content || page.content.length === 0) {
        if (estado === 'true') {
          this.store.dispatch(new PostConceptoFacturacionPlanCoberturaAction(page, this.id, Estado.Pendiente));
        }
        return;
      }
      // Informamos que ya hay conceptosFacturacion al Redux para controlar el estado del componente.
      let estadoModulo = this.validarEstado(page.content) === undefined && (estado === 'false' || estado === '') ? Estado.Pendiente : Estado.Guardado;
      this.store.dispatch(new PostConceptoFacturacionPlanCoberturaAction(page, this.id, estadoModulo));
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  validarEstado(items: any) {
    return items.find(objec => objec.estado === true);
  }

  async _toggleGuardar(toggle: boolean, conceptoFacturacionPlanCobertura?: any) {
    if (!toggle && this.hasChanges()) {
      this.frontService.alert.confirm(this.translate.instant('global.onDeactivate')).then((respuesta: boolean) => {
        if (respuesta) {
          this.mostrarGuardar = false;
          this.limpiarFormulario();
        }
      });
    } else {
      // Intentamos cargar los datos de los desplegables solo cuando se abra el formulario.
      // Ademas, si ya estan inicializados, no lo hacemos de nuevo.
      await this._cargarDatosDesplegables();

      if (conceptoFacturacionPlanCobertura) {
        this.conceptoFacturacionPlanCobertura = JSON.parse(JSON.stringify(conceptoFacturacionPlanCobertura));
        this._esCreacion = false;
        this.initForm(this.conceptoFacturacionPlanCobertura);
      } else {
        this.conceptoFacturacionPlanCobertura = undefined;
        this._esCreacion = true;
        this.initForm();
      }

      if (this.tiposConceptos.length === 0) {
        this.frontService.alert.error('La cobertura ya tiene un concepto facturación de tipo de concepto Ajustes y/o Facturación activo');
        this.conceptoFacturacionPlanCobertura = undefined;
        this.mostrarGuardar = false;
      } else {
        this.mostrarGuardar = toggle;
      }

    }
  }

  limpiarFormulario() {
    this.form.reset();
    this.initForm();
    this.selection = false;
  }

  private async _cargarDatosDesplegables() {

    // Obtenemos el nombre del plan y el nombre de la cobertura para mostrarlos como titulo
    this.nombrePlan = this.planCobertura.planCobertura.mimPlan.nombre;
    this.nombreCobertura = this.planCobertura.planCobertura.mimCobertura.nombre;

    const _tiposConceptos = await this.backService.tipoConcepto.getTiposConceptos({ estado: true, sort: 'nombre,asc' }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
    this.tiposConceptos = _tiposConceptos._embedded.mimTipoConcepto;

    const _concepto = await this.backService.conceptoFacturacionPlanCobertura.getConceptosFacturacion({
      estado: true,
      sort: 'concepto,desc'
    }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
    this.conceptos = _concepto.content;

  }

  _onSiguiente($event) {
    this._obtenerDatosConEstados($event, this.estado);
  }

  _onAtras($event) {
    this._obtenerDatosConEstados($event, this.estado);
  }

  _onClickCeldaElement($event) {
    if ($event.col.key === 'eliminar') {
      this._alEliminar($event.dato);
    }
  }

  limpiarFormularioDetalle() {
    this.conceptoFacturacionPlanCobertura = undefined;
    this.form.reset();
    this.initForm();
    this.selection = false;
  }

  private _alEliminar($event: any) {
    this.translate.get('administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.conceptoFacturacionPlanCobertura.eliminar.mensajeEliminar').subscribe((text: string) => {
      const modalPromise = this.frontService.alert.confirm(text, 'danger');
      const newObservable = from(modalPromise);
      newObservable.subscribe(
        async (desition: any) => {
          if (desition === true) {
            this.backService.conceptoFacturacionPlanCobertura.deleteConceptoFacturacion($event.sipProducto.codigo, $event.sipConceptoFacturacion.concepto).subscribe((respuesta: any) => {
              this.translate.get('global.eliminadoExitosoMensaje').subscribe((texto: string) => {
                this.frontService.alert.success(texto).then(() => {
                  // Recargamos la informacion de la tabla.
                  this._listar(this.planCobertura.planCobertura.codigo);
                });
              });
            }, (err) => {
              this.frontService.alert.error(err.error.message);
            });
          }
        });
    });
  }

  _guardar() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }

    if (this._esCreacion) {
      this._crear();
    } else {
      this._actualizar();
    }
  }

  async _crear() {
    const form: any = this.form.value;
    const mimConceptoFacturacionPlanCobertura = {
      mimPlanCobertura: { codigo: this.planCobertura.planCobertura.codigo },
      sipConceptoFacturacion: { concepto: form.concepta.sipConceptoFacturacion.concepto,estado:true },
      mimTipoConcepto: { codigo: form.tipoConcepto.codigo },
      sipProducto: this.producto.sipProducto,
      estado: true
    };

    if (this.producto.sipProducto === undefined || this.producto.sipProducto === null) {
      this.frontService.alert.error("No se encuentra el plan y la cobertura configurados en la tabla de homologacion MIM_PRODUCTO_COBERTURA");
      return;
    }

    const _conceptosTipos = await this.backService.conceptoFacturacionPlanCobertura.getConceptosFacturacion({
      'sipProducto.codigo': this.producto.sipProducto.codigo,
      'mimTipoConcepto.codigo': mimConceptoFacturacionPlanCobertura.mimTipoConcepto.codigo,
      estado: true
    }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
    this.listaConceptos = _conceptosTipos.content;


    if (this.listaConceptos.length > 0) {
      this.translate.get('administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.conceptoFacturacionPlanCobertura.alertas.tipoFactorYaRegistrado').subscribe((mensaje: string) => {
        this.frontService.alert.confirm(mensaje, 'danger').then((desition: any) => {
          if (desition === true) {
            this.backService.conceptoFacturacionPlanCobertura.postConceptoFacturacion(mimConceptoFacturacionPlanCobertura).subscribe((respuesta: any) => {
              // cerramos modal
              this.conceptoFacturacionPlanCobertura = undefined;
              this.mostrarGuardar = false;
              this.limpiarFormulario();

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
        });
      });
    } else {
      this.backService.conceptoFacturacionPlanCobertura.postConceptoFacturacion(mimConceptoFacturacionPlanCobertura).subscribe((respuesta: any) => {
        // cerramos modal
        this.conceptoFacturacionPlanCobertura = undefined;
        this.mostrarGuardar = false;
        this.limpiarFormulario();

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
  }

  _actualizar() {
    // do nothing
  }

}
