import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormComponent } from '@core/guards';
import { BackFacadeService, FrontFacadeService } from '@core/services';
import { AppState } from '@core/store/reducers';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Page } from '@shared/interfaces/page.interface';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormValidate } from '@shared/util';
import { DateUtil } from '@shared/util/date.util';
import { from, Subscription } from 'rxjs';
import { Estado } from '../../../model/guardar-plan-cobertura-orden.model';
import { GuardarPlanCobertura } from '../../../model/guardar-plan-cobertura.model';
import { PostDesmembracionAccidenteAction } from '../../../plan-cobertura.actions';
import { obtenerSeccionPorId } from '../../../plan-cobertura.reducer';
import { DesmembracionAccidenteConfig } from './desmembracion-accidente.config';

@Component({
  selector: 'app-desmembracion-accidente',
  templateUrl: './desmembracion-accidente.component.html',
})
export class DesmembracionAccidenteComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  id = 'desmembracionAccidente';
  configuracion: DesmembracionAccidenteConfig = new DesmembracionAccidenteConfig();
  planCobertura: GuardarPlanCobertura;
  _subs: Subscription[] = [];
  form: FormGroup;
  isForm: Promise<any>;
  _esCreacion: boolean;
  crear: boolean;
  editar: boolean;

  dropdown: boolean;
  mostrarGuardar: boolean;
  estado = true;

  tiposValorProteccion: any[];
  coberturas: any[];
  desmembraciones: any[];

  rowDesmembracionAcidente: any;

  nombrePlan: any;
  nombreCobertura: any;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly store: Store<AppState>,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
  }

  hasChanges() {
    return this.form && this.form.dirty;
  }

  ngOnDestroy(): void {
    this._subs.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    // Realizamos el llamado al backend para listar por primera vez.
    this._subs.push(this.activatedRoute.params.subscribe((params: any) => {
      const codigoPlanCobertura = params.codigoCobertura === UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLANES_NUEVO ? null : params.codigoCobertura;
      if (codigoPlanCobertura) {
        this.listar(codigoPlanCobertura);
      }
    }));

    this._subs.push(this.store.select('planCoberturaUI')
      .subscribe(ui => {
        if (!ui || !ui.planCobertura) {
          return;
        }

        this.planCobertura = ui;
        this.cargarDatosTabla(this.planCobertura.desmembracionAccidente);
      }));
  }

  private cargarDatosTabla(page: Page<any>) {
    if (!page || !page.content || page.content.length === 0) {
      return;
    }

    if (this.configuracion.gridConfig.component) {
      this.configuracion.gridConfig.component.limpiar();
      this.configuracion.gridConfig.component.cargarDatos(
        this.asignarEstados(page.content), {
        maxPaginas: page.totalPages,
        pagina: page.number,
        cantidadRegistros: page.totalElements
      });
    }
  }

  private asignarEstados(items: any) {
    const listObj = [];
    let item: any;
    for (item of items) {
      listObj.push({
        ...item,
        _estado: item.estado ? 'Si' : 'No',
        _pagoPorDesmembracionAccidental: item.pagoPorDesmembracionAccidental.toString().includes('.') ? item.pagoPorDesmembracionAccidental.toString().replace('.', ',') : item.pagoPorDesmembracionAccidental
      });
    }
    return listObj;
  }

  private initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        tipoValor: new FormControl(param && param.mimTipoValorProteccion ? this.obtenertipoValorProteccion(param.mimTipoValorProteccion.codigo) : null, [Validators.required]),
        cobertura: new FormControl(param && param.mimCobertura ? this.obtenerCoberturas(param.mimCobertura.codigo) : null, [Validators.required]),
        desmembracion: new FormControl(param && param.mimDesmembracionPorAccidente ? this.obtenerDesmembracionPorAccidente(param.mimDesmembracionPorAccidente.codigo) : null, [Validators.required]),
        porcentajePago: new FormControl(param ? param.pagoPorDesmembracionAccidental.toString().includes('.') ? param.pagoPorDesmembracionAccidental.toString().replace('.', ',') : param.pagoPorDesmembracionAccidental : null, [Validators.required, Validators.max(100), Validators.min(1)]),
        vigente: new FormControl(param ? param.estado : false),
        fechaInicioFechaFin: new FormControl(param ? this.rangoFechaSelected(param.fechaInicio, param.fechaFin) : null, [Validators.required])
      })
    );

    if (!this._esCreacion) {
      this.form.controls.tipoValor.disable();
      this.form.controls.cobertura.disable();
      this.form.controls.desmembracion.disable();
    }
    if (this._esCreacion) {
      this.form.controls.vigente.disable();
      this.form.controls.vigente.setValue(true);
    }

    this.changeValueForm();
  }

  private changeValueForm() {
    this.form.controls.porcentajePago.valueChanges.subscribe(resp => {
      if (!resp || resp === '') {
        return;
      }
      let paramaErrors: ValidationErrors = this.form.controls.porcentajePago.errors;
      paramaErrors = paramaErrors && Object.entries(paramaErrors).length > 0 ? paramaErrors : {};
      const valor = resp.includes(',') ? resp.replace(',', '.') : resp;
      if (+valor > 100) {
        paramaErrors.max = true;
      } else {
        delete paramaErrors?.['max'];
        paramaErrors = paramaErrors && Object.entries(paramaErrors).length > 0 ? paramaErrors : null;
      }
      this.form.controls.porcentajePago.setErrors(paramaErrors);
    });
  }

  private async cargarDatosDesplegables() {

    const _tipoValor: any = await this.backService.tipoValorProteccion.obtenerTiposValorProteccion({
      estado: true, sort: 'nombre,asc'
      // codigo: MIM_PARAMETROS.MIM_TIPO_VALOR_PROTECCION.PORCENTAJE_COBERTURA
    }).toPromise().catch(err => this.frontService.alert.error(err.error.message));

    // const _coberturas: any = await this.coberturaService.obtenerCoberturas({ codigo: MIM_PARAMETROS.MIM_COBERTURAS.MUERTE_ACCIDENTAL }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
    const _desmembraciones: any = await this.backService.desmembracionAccidente.getDesmembracionPorAccidentes({
      estado: true, sort: 'nombre,asc',
      'mimFondo.codigo': this.planCobertura.planCobertura.mimPlan.mimFondo.codigo
    }).toPromise().catch(err => this.frontService.alert.error(err.error.message));

    const _coberturas: any = await this.backService.planCobertura.getPlanesCoberturas({
      'mimPlan.codigo': this.planCobertura.planCobertura.mimPlan.codigo,
      'mimCobertura.mimEstadoCobertura.codigo': MIM_PARAMETROS.MIM_ESTADO_COBERTURA.ACTIVO
    }).toPromise().catch(err => this.frontService.alert.error(err.error.message));

    this.nombreCobertura = this.planCobertura.planCobertura.mimCobertura.nombre;
    this.nombrePlan = this.planCobertura.planCobertura.mimPlan.nombre;
    this.tiposValorProteccion = _tipoValor && _tipoValor._embedded && _tipoValor._embedded.MimTipoValorProteccion.length > 0 ? _tipoValor._embedded.MimTipoValorProteccion : null;
    this.coberturas = _coberturas && _coberturas.content.length > 0 ? _coberturas.content.map(x => x.mimCobertura) : null;
    this.desmembraciones = _desmembraciones && _desmembraciones.content.length > 0 ? _desmembraciones.content : null; // .filter(x => this.planCobertura.desmembracionAccidente.content.find((y: any) => y.mimDesmembracionPorAccidente.codigo !== x.codigo));

  }

  private obtenertipoValorProteccion(codigo: any) {
    return this.tiposValorProteccion.find(res => res.codigo === codigo);
  }

  private obtenerCoberturas(codigo: any) {
    return this.coberturas ? this.coberturas.find(cobertura => cobertura.codigo === codigo) : null;
  }

  private obtenerDesmembracionPorAccidente(codigo: any) {
    return this.desmembraciones.find(res => res.codigo === codigo);
  }

  private rangoFechaSelected(fechaInicio: any, fechaFin: any) {
    return [DateUtil.stringToDate(fechaInicio), DateUtil.stringToDate(fechaFin)];
  }

  async toggleGuardar(toggle: boolean, rowDesmembracionAcidente?: any) {
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
      if (toggle) {
        await this.cargarDatosDesplegables();
      }
      if (rowDesmembracionAcidente) {
        this.rowDesmembracionAcidente = JSON.parse(JSON.stringify(rowDesmembracionAcidente.dato));
        this._esCreacion = false;
        this.editar = true;
        this.crear = false;
        this.initForm(this.rowDesmembracionAcidente);
      } else {
        this.rowDesmembracionAcidente = undefined;
        this._esCreacion = true;
        this.editar = false;
        this.crear = true;
        this.initForm();
      }

      this.mostrarGuardar = toggle;
    }
  }

  private listar(codigoPlanCobertura: string, pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = 'true') {
    this.backService.desmembracionAccidentePlanCobertura.getDesmembracionesPorAccidentePlanCobertura({
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
          this.store.dispatch(new PostDesmembracionAccidenteAction(page, this.id, Estado.Pendiente));
        }
        return;
      }
      // Informamos que ya hay beneficionpreexistentes al Redux para controlar el estado del componente.
      let estadoModulo = this.validarEstado(page.content) === undefined && (estado === 'false' || estado === '') ? Estado.Pendiente : Estado.Guardado;
      this.store.dispatch(new PostDesmembracionAccidenteAction(page, this.id, estadoModulo));
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  validarEstado(items: any) {
    return items.find(objec => objec.estado === true);
  }

  limpiarFormulario() {
    this.form.reset();
    this.initForm();
  }

  obtenerEstado(): string {
    if (!this.planCobertura) {
      return Estado.Pendiente;
    }

    const seccion = obtenerSeccionPorId(this.id, this.planCobertura.guardarPlanCoberturaOrden);
    return seccion ? seccion.estado : Estado.Pendiente;
  }

  onToggleStatus($event) {
    this.obtenerDatosConEstados($event, $event.currentTarget.checked);
  }

  obtenerDatosConEstados($event, estado: boolean) {
    this.estado = estado;
    this.listar(this.planCobertura.planCobertura.codigo, $event.pagina, $event.tamano, $event.sort, this.estado ? 'true' : '');
  }

  async toggle() {
    if (this.planCobertura) {
      this.dropdown = !this.dropdown;
    } else {
      this.translate.get('administracion.protecciones.planCobertura.datosPrincipales.alertas.guardar').subscribe((respuesta: string) => {
        this.frontService.alert.info(respuesta);
      });
    }
  }

  onClickCeldaElement($event) {
    if ($event.col.key === 'editar') {
      this.toggleGuardar(true, $event);
    } else {
      this.alEliminar($event.dato);
    }
  }

  onSiguiente($event) {
    this.obtenerDatosConEstados($event, this.estado);
  }

  onAtras($event) {
    this.obtenerDatosConEstados($event, this.estado);
  }

  guardar() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }

    if (this._esCreacion) {
      this.crearData();
    } else {
      this.actualizar();
    }
  }

  private crearData() {
    const form: any = this.form.value;
    const datosForm = {
      mimPlanCobertura: { codigo: this.planCobertura.planCobertura.codigo },
      mimTipoValorProteccion: { codigo: form.tipoValor.codigo },
      mimCobertura: { codigo: form.cobertura.codigo },
      mimDesmembracionPorAccidente: { codigo: form.desmembracion.codigo },
      pagoPorDesmembracionAccidental: form.porcentajePago.includes(',') ? +form.porcentajePago.replace(',', '.') : form.porcentajePago,
      estado: this.form.controls.vigente.value,
      fechaInicio: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy'),
      fechaFin: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy'),
    };

    this.backService.desmembracionAccidentePlanCobertura.postDesmembracionPorAccidentePlanCobertura(datosForm).subscribe(() => {
      // cerramos modal
      this.rowDesmembracionAcidente = undefined;
      this.mostrarGuardar = false;
      this.limpiarFormulario();

      this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          // Recargamos la informacion de la tabla.
          this.listar(this.planCobertura.planCobertura.codigo);
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  private actualizar() {
    const form: any = this.form.getRawValue();
    this.rowDesmembracionAcidente = {
      codigo: this.rowDesmembracionAcidente.codigo,
      mimPlanCobertura: { codigo: this.planCobertura.planCobertura.codigo },
      mimTipoValorProteccion: { codigo: form.tipoValor.codigo },
      mimCobertura: { codigo: form.cobertura.codigo },
      mimDesmembracionPorAccidente: { codigo: form.desmembracion.codigo },
      pagoPorDesmembracionAccidental: form.porcentajePago.includes(',') ? +form.porcentajePago.replace(',', '.') : form.porcentajePago,
      estado: this.form.controls.vigente.value,
      fechaInicio: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy'),
      fechaFin: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy'),
    };

    this.backService.desmembracionAccidentePlanCobertura.putDesmembracionPorAccidentePlanCobertura(
      this.planCobertura.planCobertura.codigo,
      this.rowDesmembracionAcidente
    ).subscribe((respuesta: any) => {

      // Cerramos el modal.
      this.rowDesmembracionAcidente = undefined;
      this.mostrarGuardar = false;
      // Limpiamos el formulario.
      this.limpiarFormulario();

      this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          // Recargamos la informacion de la tabla.
          this.listar(this.planCobertura.planCobertura.codigo, 0, 10, 'fechaCreacion,desc', this.estado ? 'true' : '');

        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });

  }

  private alEliminar($event: any) {
    const codigoDesmembracionAccidente = $event.codigo;
    this.translate.get('administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.desmembracionAccidente.alertas.eliminar').subscribe((text: string) => {
      const modalPromise = this.frontService.alert.confirm(text, 'danger');
      const newObservable = from(modalPromise);
      newObservable.subscribe(
        (desition: any) => {
          if (desition === true) {
            this.backService.desmembracionAccidentePlanCobertura.deleteDesmembracionPorAccidentePlanCobertura(codigoDesmembracionAccidente).subscribe((respuesta: any) => {
              this.translate.get('global.eliminadoExitosoMensaje').subscribe((texto: string) => {
                this.frontService.alert.success(texto).then(() => {
                  // Recargamos la informacion de la tabla.
                  this.listar(this.planCobertura.planCobertura.codigo);
                });
              });
            });
          }
        });
    });
  }

}
