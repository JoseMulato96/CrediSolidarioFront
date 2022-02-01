import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormComponent } from '@core/guards';
import { AppState } from '@core/store/reducers';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { minMaxValidator, minMaxValidatorDirectiveValorAsegurado } from '@shared/directives/min-max-validator.directive';
import { Page } from '@shared/interfaces/page.interface';
import { numberMaskConfig, percentMaskConfig } from '@shared/static/constantes/currency-mask';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormValidate } from '@shared/util';
import { DateUtil } from '@shared/util/date.util';
import { forkJoin, from, Subscription } from 'rxjs';
import { Estado } from '../../../model/guardar-plan-cobertura-orden.model';
import { GuardarPlanCobertura } from '../../../model/guardar-plan-cobertura.model';
import { IMimValorAseguradoPlanCobertura } from '../../../model/mim-valor-asegurado-plan-cobertura.model';
import { IMimValorAseguradoTope } from '../../../model/mim-valor-asegurado-tope.model';
import { IMimValorAsegurado, MimValorAsegurado } from '../../../model/mim-valor-asegurado.model';
import { PostValorAseguradoAction } from '../../../plan-cobertura.actions';
import { obtenerSeccionPorId } from '../../../plan-cobertura.reducer';
import { ValorAseguradoConfig } from './valor-asegurado.config';
import { GENERALES } from '../../../../../../../shared/static/constantes/constantes';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { BackFacadeService, FrontFacadeService } from '@core/services';

@Component({
  selector: 'app-valor-asegurado',
  templateUrl: './valor-asegurado.component.html',
  styleUrls: ['./valor-asegurado.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ValorAseguradoComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {
  // Id de la seccion
  id = 'valorAsegurado';
  codigoPlanCobertura: string;
  planCobertura: GuardarPlanCobertura;
  _subs: Subscription[] = [];

  form: FormGroup;
  isForm: Promise<any>;
  _esCreacion: boolean;
  tiposValoresAsegurado: any[];
  tiposReconocidos: any[];
  tiposValoresRestitucion: any[];
  tiposPeriodicidad: any[];
  planesCoberturas: any[];
  planesCoberturasPorPlan: any[];
  planesCoberturasCompletos: any[];
  nivelesRiesgos: any[];
  tiposValoresTope: any[];
  filtroEstadoLista: boolean;

  dropdown: boolean;
  valorAsegurado: any;
  estado: string;
  mostrarModalTopes: boolean;
  mostrarGuardar: boolean;
  mostrarControl: boolean;
  mostrarPlanCoberturaUnico: boolean;
  bloquearBotonTope: boolean;

  configuracion: ValorAseguradoConfig = new ValorAseguradoConfig();

  nombrePlan: any;
  nombreCobertura: any;

  valorMaximoPermitido = null;
  valorMinimoPermitido = null;
  optionsMask;

  listOpcionesPortafolio: any [];
  estadoFecha: boolean = true;

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

    // Nos subscribimos a los cambios al Redux. Si se trata de una actualizacion,
    // al obtener los parametros de URL e ir back se debio haber publicado en Redux
    // la informacion de valor asegurado
    this._subs.push(this.store.select('planCoberturaUI')
      .subscribe(ui => {
        if (!ui || !ui.planCobertura) {
          this._cerrarSeccion();
          return;
        }
        this.planCobertura = ui;
        this.estado = this._obtenerEstado();
        // Inicializamos el formulario con lo que venga de Redux.
        if (this.planCobertura.valorAsegurado) {
          this.valorAsegurado = JSON.parse(JSON.stringify(this.planCobertura.valorAsegurado));
          this._cargarDatosTabla(this.planCobertura.valorAsegurado);
        }
      }));

    this.filtroEstadoLista = true;
    this.mostrarControl = true;
    // Realizamos el llamado al backend para realizar el check de la sección
    this._subs.push(this.activatedRoute.params.subscribe(async (params: any) => {
      this.codigoPlanCobertura = params.codigoCobertura === UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLANES_NUEVO ? null : params.codigoCobertura;

      // Obtenemos el nombre del plan y el nombre de la cobertura para mostrarlos como titulo
      this.nombrePlan = this.planCobertura.planCobertura.mimPlan.nombre;
      this.nombreCobertura = this.planCobertura.planCobertura.mimCobertura.nombre;

      forkJoin([
        this.backService.tipoValorAsegurado.obtenerTiposValoresAsegurados({ estado: true, isPaged: true, sort: 'nombre,asc', size: 1000000 }),
        this.backService.tipoReconocido.getTipoReconocidos({ estado: true, isPaged: true, sort: 'nombre,asc', size: 1000000, codigo : [MIM_PARAMETROS.MIM_TIPO_RECONOCIDO.COP, MIM_PARAMETROS.MIM_TIPO_RECONOCIDO.SMMLV] }),
        this.backService.tipoValorRestitucion.obtenerTiposValoresRestitucion({ estado: true, isPaged: true, sort: 'nombre,asc', size: 1000000 }),
        this.backService.tipoPeriodicidad.obtenerTiposPeriodicidad({ estado: true, isPaged: true, sort: 'nombre,asc', size: 1000000 }),
        this.backService.planCobertura.getPlanesCoberturas({
          'mimPlan.codigo': this.planCobertura.planCobertura.mimPlan.codigo,
          'mimCobertura.mimEstadoCobertura.codigo': MIM_PARAMETROS.MIM_ESTADO_COBERTURA.ACTIVO
        }),
        this.backService.planCobertura.getPlanesCoberturas({
          'mimCobertura.mimEstadoCobertura.codigo': MIM_PARAMETROS.MIM_ESTADO_COBERTURA.ACTIVO
        }),
        this.backService.nivelRiesgo.getNivelesRiesgos({ estado: true }),
        this.backService.tipoValorTope.getTiposValoresTope({ estado: true }),
        this.backService.valorAsegurado.obtenerOpcionesPresentacionPortafolio()
      ]).subscribe(([
        _tiposValoresAsegurado,
        _tiposReconocidos,
        _tiposValoresRestitucion,
        _tiposPeriodicidad,
        _planesCoberturasPorPlan,
        _planesCoberturas,
        _nivelRiesgos,
        _tiposValoresTopes,
        _opcionesPresentacionPortafolio
      ]) => {
        this.tiposValoresAsegurado = _tiposValoresAsegurado._embedded.mimTipoValorAsegurado;
        this.tiposReconocidos = _tiposReconocidos._embedded.mimTipoReconocido;
        this.tiposValoresRestitucion = _tiposValoresRestitucion._embedded.mimTipoValorRestitucion;
        this.tiposPeriodicidad = _tiposPeriodicidad._embedded.MimTipoPeriodicidad;
        this.planesCoberturasPorPlan = _planesCoberturasPorPlan.content.map(x => ({ ...x, _nombre: x.mimPlan.nombre + ' - ' + x.mimCobertura.nombre }));
        this.planesCoberturasCompletos = _planesCoberturas.content.map(x => ({ ...x, _nombre: x.mimPlan.nombre + ' - ' + x.mimCobertura.nombre }));
        this.nivelesRiesgos = _nivelRiesgos._embedded.mimNivelRiesgo;
        this.tiposValoresTope = _tiposValoresTopes._embedded.mimTipoValorTope;
        this.listOpcionesPortafolio = _opcionesPresentacionPortafolio._embedded.mimPresentacionPortafolio;
        if (this.codigoPlanCobertura) {
          this._listar(this.codigoPlanCobertura, this.filtroEstadoLista);
        }
      });

    }));

  }

  _setRowInactivo(dataRow: any) {
    if (!this._esCreacion && dataRow.mimTipoValorAsegurado && !this.obtenerTipoValorAsegurado(dataRow.mimTipoValorAsegurado.codigo)) {
      this.tiposValoresAsegurado.push(dataRow.mimTipoValorAsegurado);
    }
    if (!this._esCreacion && dataRow.mimTipoReconocido && !this.obtenerTipoReconocido(dataRow.mimTipoReconocido.codigo)) {
      this.tiposReconocidos.push(dataRow.mimTipoReconocido);
    }
    if (!this._esCreacion && dataRow.mimTipoValorRestitucion && !this.obtenerTipoValorRestitucion(dataRow.mimTipoValorRestitucion.codigo)) {
      this.tiposValoresRestitucion.push(dataRow.mimTipoValorRestitucion);
    }

    if (!this._esCreacion && dataRow.mimPlanCoberturaRequisitoList && !this.obtenerPlanesCoberturas(dataRow.mimPlanCoberturaRequisitoList)) {
      dataRow.mimPlanCoberturaRequisitoList.forEach(item => {
        if (item.mimPlanCobertura && item.mimPlanCobertura.mimEstadoPlanCobertura === MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.INACTIVO) {
          this.planesCoberturas.push(item.mimPlanCobertura);
        }
      });
    }
  }

  ngOnDestroy() {
    this._subs.forEach(sub => sub.unsubscribe());
  }

  hasChanges() {
    return this.form && this.form.dirty;
  }

  private _cargarDatosTabla(page: Page<MimValorAsegurado>) {
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

  get arrayTopes() {
    return this.form.controls.arrayTopes as FormArray;
  }

  private initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        tipoValorAsegurado: new FormControl(param ? this.obtenerTipoValorAsegurado(param.mimTipoValorAsegurado.codigo) : null, [Validators.required]),
        planCobertura: new FormControl(null, [Validators.required]),
        esUnRangoDe: new FormControl(param ? param.esUnRangoDePorcentaje : false, [Validators.required]),
        aseguradoRangoInicio: new FormControl(param && param.porcentajeAseguradoInicial ? param.porcentajeAseguradoInicial : null, [Validators.required, Validators.min(0), Validators.max(999)]),
        aseguradoRangoFinal: new FormControl(param && param.porcentajeAseguradoFinal ? param.porcentajeAseguradoFinal : null, [Validators.required, Validators.min(0), Validators.max(999)]),
        nroMesesPromedio: new FormControl(param && param.mesesPromedio ? param.mesesPromedio : null, [Validators.required, Validators.min(0), Validators.max(999)]),
        porcentajePromedio: new FormControl(param && param.promedioCobertura ? param.promedioCobertura : null, [Validators.required, Validators.min(0), Validators.max(999)]),
        observacionValorAsegurado: new FormControl(param && param.observacion ? param.observacion : null),
        tipoReconocido: new FormControl(param && param.mimTipoReconocido ? this.obtenerTipoReconocido(param.mimTipoReconocido.codigo) : null, [Validators.required]),
        tieneValorSublimite: new FormControl(param && param.tieneValorSublimite ? param.tieneValorSublimite : false, [Validators.required]),
        valorAsegurado: new FormControl(param && param.valorAsegurado ? param.valorAsegurado : null, [Validators.required, Validators.max(1000000000)]),
        tipoValorRestitucion: new FormControl(param && param.mimTipoValorRestitucion ? this.obtenerTipoValorRestitucion(param.mimTipoValorRestitucion.codigo) : null, [Validators.required]),
        esUnaRenta: new FormControl(param ? param.esUnaRenta : false, [Validators.required]),
        tipoPeriodicidad: new FormControl(param && param.mimTipoPeriodicidad ? this.obtenerTipoPeriodicidad(param.mimTipoPeriodicidad.codigo) : null),
        fechaInicioFechaFin: new FormControl(param ? this.rangoFechaSelected(param.fechaVigenteInicio, param.fechaVigenteFin) : null, [Validators.required]),
        vigente: new FormControl(param ? param.estado : false, [Validators.required]),
        arrayTopes: this.formBuilder.array([]),
        fechaInicioFechaFinRestitucion: new FormControl(param ? this.rangoFechaSelected(param.fechaInicioRestitucion, param.fechaFinRestitucion) : null, [Validators.required]),
        rentaMinimaPagar: new FormControl(param ? param.rentaMinimaPagar : null,[Validators.required]),
        rentaMaximaPagar: new FormControl(param ? param.rentaMaximaPagar : null,[Validators.required]),
        presentacionPortafolio: new FormControl(param ? this.obtenerPresentacionPortafolio(param.mimPresentacionPortafolio.codigo) : null, [Validators.required]),
      }, {
        validators: [minMaxValidator('aseguradoRangoInicio', 'aseguradoRangoFinal'), minMaxValidatorDirectiveValorAsegurado('aseguradoRangoInicio', 'aseguradoRangoFinal', 'esUnRangoDe')]
      })
    );

    this.form.disable();
    this.form.controls.tipoValorAsegurado.enable();

    if (this.planCobertura && this.planCobertura.planCobertura.mimEstadoPlanCobertura.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.INACTIVO) {
      this.form.disable();
    }
    // Por favor conservar la ubicacion de la funcion para no afectar la funcionalidad
    this.changeTipoValorAsegurado(param);
    this.changeEsUnaRenta();
    this.changeEsUnRangoDe();
    this.cargarTopes(param);
    this.changeValorRestitucion(param);

    // Se carga el control plan cobertura en este punto porque antes no se sabe
    // cual de los dos desplegables se muestra si el único o múltiple
    if (param && param.mimValorAseguradoPlanCoberturaList) {
      let planCobertura;
      if (this.mostrarPlanCoberturaUnico) {
        planCobertura = this.obtenerPlanesCoberturas(param.mimValorAseguradoPlanCoberturaList)[0];
      } else {
        planCobertura = this.obtenerPlanesCoberturas(param.mimValorAseguradoPlanCoberturaList);
      }
      this.form.controls.planCobertura.setValue(planCobertura);
    }
  }

  cargarTopes(param: any) {

    if (param && param.mimValorAseguradoTopeList) {
      for (const tope of param.mimValorAseguradoTopeList) {
        this.arrayTopes.push(this.crearFilaTopes(tope));
      }
    }
  }

  private crearFilaTopes(paramTope?: any): FormGroup {
    const formGroupTopes = this.formBuilder.group({
      codigoTope: new FormControl(paramTope && paramTope.codigo ? paramTope.codigo : null),
      nivelRiesgoTope: new FormControl(paramTope && paramTope.mimNivelRiesgo ? this.obtenerNivelRiesgo(paramTope.mimNivelRiesgo.codigo) : null, [Validators.required]),
      tipoValorTopeUno: new FormControl(paramTope && paramTope.mimTipoValorTopeUno ? this.obtenerTipoValorTope(paramTope.mimTipoValorTopeUno.codigo) : null, [Validators.required]),
      planCoberturaTopeUno: new FormControl(paramTope && paramTope.mimPlanCoberturaUno ? this.obtenerPlanCobertura(paramTope.mimPlanCoberturaUno.codigo) : null, [Validators.required]),
      valorMinimoTope: new FormControl(paramTope && paramTope.valorMinimo ? paramTope.valorMinimo : null, [Validators.required]),
      tipoValorTopeDos: new FormControl(paramTope && paramTope.mimTipoValorTopeDos ? this.obtenerTipoValorTope(paramTope.mimTipoValorTopeDos.codigo) : null, [Validators.required]),
      planCoberturaTopeDos: new FormControl(paramTope && paramTope.mimPlanCoberturaDos ? this.obtenerPlanCobertura(paramTope.mimPlanCoberturaDos.codigo) : null, [Validators.required]),
      valorMaximoTope: new FormControl(paramTope && paramTope.valorMaximo ? paramTope.valorMaximo : null, [Validators.required]),
      valorMinPermitido: new FormControl(null),
      valorMaxPermitido: new FormControl(null),
      valorMask: new FormControl(null),
    });

    this.changeTipoValor(formGroupTopes, paramTope);
    return formGroupTopes;
  }

  changeTipoValor(formGroupTopes: FormGroup, paramTope?: any) {

    if (paramTope && paramTope.mimTipoValorTopeUno.codigo) {
      this.validaTipoValorUno(formGroupTopes, paramTope.mimTipoValorTopeUno.codigo);
    }

    if (paramTope && paramTope.mimTipoValorTopeDos.codigo) {
      this.validaTipoValorDos(formGroupTopes, paramTope.mimTipoValorTopeDos.codigo);
    }

    formGroupTopes.controls.tipoValorTopeUno.valueChanges.subscribe(tipoValor => {
      if (tipoValor) {
        this.validaTipoValorUno(formGroupTopes, tipoValor.codigo);
      }
    });

    formGroupTopes.controls.tipoValorTopeDos.valueChanges.subscribe(tipoValor => {
      if (tipoValor) {
        this.validaTipoValorDos(formGroupTopes, tipoValor.codigo);
      }
    });
  }

  validaTipoValorUno(formGroupTopes: FormGroup, codigoTipoValor: number) {

    if (codigoTipoValor === MIM_PARAMETROS.MIM_TIPO_VALOR_TOPE.PORCENTAJE_OTRA_COBERTURA) {
      formGroupTopes.controls.planCoberturaTopeUno.enable();
      formGroupTopes.controls.planCoberturaTopeUno.setErrors({ 'required': true });

      formGroupTopes.controls.valorMinimoTope.setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
      formGroupTopes.controls.valorMinimoTope.updateValueAndValidity();
      formGroupTopes.controls.valorMinimoTope.markAsTouched();

      formGroupTopes.controls.valorMaximoTope.setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
      formGroupTopes.controls.valorMaximoTope.updateValueAndValidity();
      formGroupTopes.controls.valorMaximoTope.markAsTouched();

      formGroupTopes.controls.valorMinPermitido.setValue('0');
      formGroupTopes.controls.valorMaxPermitido.setValue('100');
      formGroupTopes.controls.valorMask.setValue(percentMaskConfig);

    } else {
      formGroupTopes.controls.planCoberturaTopeUno.setValue(null);
      formGroupTopes.controls.planCoberturaTopeUno.disable();
      formGroupTopes.controls.planCoberturaTopeUno.setErrors(null);

      formGroupTopes.controls.valorMinimoTope.setValidators([Validators.required, Validators.min(1), Validators.max(9999999999.99)]);
      formGroupTopes.controls.valorMinimoTope.updateValueAndValidity();
      formGroupTopes.controls.valorMinimoTope.markAsTouched();

      formGroupTopes.controls.valorMaximoTope.setValidators([Validators.required, Validators.min(1), Validators.max(9999999999.99)]);
      formGroupTopes.controls.valorMaximoTope.updateValueAndValidity();
      formGroupTopes.controls.valorMaximoTope.markAsTouched();

      formGroupTopes.controls.valorMinPermitido.setValue('1');
      formGroupTopes.controls.valorMaxPermitido.setValue('9999999999.99');
      formGroupTopes.controls.valorMask.setValue(numberMaskConfig);
    }

  }

  validaTipoValorDos(formGroupTopes: FormGroup, codigoTipoValor: number) {

    if (codigoTipoValor === MIM_PARAMETROS.MIM_TIPO_VALOR_TOPE.PORCENTAJE_OTRA_COBERTURA) {
      formGroupTopes.controls.planCoberturaTopeDos.enable();
      formGroupTopes.controls.planCoberturaTopeDos.setErrors({ 'required': true });

    } else {
      formGroupTopes.controls.planCoberturaTopeDos.setValue(null);
      formGroupTopes.controls.planCoberturaTopeDos.disable();
      formGroupTopes.controls.planCoberturaTopeDos.setErrors(null);
    }
  }

  private obtenerTipoValorAsegurado(codigo: any) {
    return this.tiposValoresAsegurado.find(tipoValorAsegurado => tipoValorAsegurado.codigo === codigo);
  }

  private obtenerTipoReconocido(codigo: any) {
    return this.tiposReconocidos.find(tipoReconocido => tipoReconocido.codigo === codigo);
  }

  private obtenerTipoValorRestitucion(codigo: any) {
    return this.tiposValoresRestitucion.find(tipoValorRestitucion => tipoValorRestitucion.codigo === codigo);
  }

  private obtenerTipoPeriodicidad(codigo: any) {
    return this.tiposPeriodicidad.find(tiposPeriodicidad => tiposPeriodicidad.codigo === codigo);
  }

  private obtenerPlanesCoberturas(items: any[]) {
    return this.planesCoberturas.filter(planCobertura => items.find(item =>
      item.mimValorAseguradoPlanCoberturaPK.codigoPlanCobertura === planCobertura.codigo));
  }

  private obtenerNivelRiesgo(codigo: any) {
    return this.nivelesRiesgos.find(nivelRiesgo => nivelRiesgo.codigo === codigo);
  }

  private obtenerTipoValorTope(codigo: any) {
    return this.tiposValoresTope.find(tipoValorTope => tipoValorTope.codigo === codigo);
  }

  private obtenerPlanCobertura(codigo: any) {
    return this.planesCoberturas.find(planCobertura => planCobertura.codigo === codigo);
  }

  rangoFechaSelected(fechaIni: any, fechaFin: any) {
    return [DateUtil.stringToDate(fechaIni), DateUtil.stringToDate(fechaFin)];
  }

  private obtenerPresentacionPortafolio(codigo: any) {
    return this.listOpcionesPortafolio.find((item:any) => item.codigo === codigo);
  }


  changeEsUnaRenta() {
    this.validaEsUnaRenta(this.form.controls.esUnaRenta.value);
    this.form.controls.esUnaRenta.valueChanges.subscribe(esUnaRenta => {
      this.validaEsUnaRenta(esUnaRenta);
    });
  }

  validaEsUnaRenta(esUnaRenta: boolean) {
    if (esUnaRenta) {
      // Se vuelve los campos activos y requeridos
      this.form.controls.rentaMinimaPagar.enable();
      this.form.controls.rentaMinimaPagar.setErrors({ 'required': true });

      this.form.controls.rentaMaximaPagar.enable();
      this.form.controls.rentaMaximaPagar.setErrors({ 'required': true });
    } else {
      // Se desabilitan los campos y se vuelven opcionales
      this.form.controls.rentaMinimaPagar.setValue(null);
      this.form.controls.rentaMinimaPagar.disable();
      this.form.controls.rentaMinimaPagar.setErrors(null);

      this.form.controls.rentaMaximaPagar.setValue(null);
      this.form.controls.rentaMaximaPagar.disable();
      this.form.controls.rentaMaximaPagar.setErrors(null);
    }
  }

  changeEsUnRangoDe() {
    this.validaEsUnRangoDe(this.form.controls.esUnRangoDe.value);
    this.form.controls.esUnRangoDe.valueChanges.subscribe(esUnRangoDe => {
      this.validaEsUnRangoDe(esUnRangoDe);
    });
  }

  validaEsUnRangoDe(esUnRangoDe: boolean) {
    if (esUnRangoDe) {
      this.form.controls.aseguradoRangoFinal.enable();
      if (this.form.controls.tipoValorAsegurado.value.codigo === MIM_PARAMETROS.MIM_VALOR_ASEGURADO.PORCENTAJE_OTRA_COBERTURA) {
        this.form.controls.observacionValorAsegurado.enable();
        this.form.controls.observacionValorAsegurado.setErrors({ 'required': true });
      }
    } else {
      this.form.controls.aseguradoRangoFinal.disable();
      this.form.controls.observacionValorAsegurado.disable();
      this.form.controls.observacionValorAsegurado.setErrors(null);
    }
    this.validarOpcionesPortafolio();
  }

  changeTipoValorAsegurado(param: any) {
    if (param && this.form.controls.tipoValorAsegurado.value) {
      this.validaFormulario(this.form.controls.tipoValorAsegurado.value.codigo);
    }

    this.form.controls.tipoValorAsegurado.valueChanges.subscribe(valorAsegurado => {
      if (valorAsegurado) {
        this.validaFormulario(valorAsegurado.codigo);
        this.validarOpcionesPortafolio();
      }
    });
  }

  validaFormulario(codigoValorAsegurado: number) {
    switch (codigoValorAsegurado) {
      case MIM_PARAMETROS.MIM_VALOR_ASEGURADO.VOLUNTARIO:
        this.planesCoberturas = this.planesCoberturasPorPlan;
        this.form.controls.planCobertura.setValue(null);
        this.form.controls.planCobertura.disable();
        this.form.controls.planCobertura.setErrors(null);

        this.form.controls.esUnRangoDe.setValue(false);
        this.form.controls.esUnRangoDe.disable();

        this.form.controls.aseguradoRangoInicio.setValue(null);
        this.form.controls.aseguradoRangoInicio.disable();
        this.form.controls.aseguradoRangoInicio.setErrors(null);

        this.form.controls.nroMesesPromedio.setValue(null);
        this.form.controls.nroMesesPromedio.disable();
        this.form.controls.nroMesesPromedio.setErrors(null);

        this.form.controls.porcentajePromedio.setValue(null);
        this.form.controls.porcentajePromedio.disable();

        this.form.controls.tipoReconocido.enable();
        this.form.controls.tipoReconocido.setErrors({ 'required': true });

        this.form.controls.valorAsegurado.setValue(null);
        this.form.controls.valorAsegurado.disable();
        this.form.controls.valorAsegurado.setErrors(null);

        this.form.controls.tieneValorSublimite.setValue(false);
        this.form.controls.tieneValorSublimite.disable();

        this.form.controls.tipoValorRestitucion.enable();
        this.form.controls.esUnaRenta.enable();
        this.form.controls.fechaInicioFechaFin.enable();
        this.form.controls.vigente.enable();

        this.mostrarControl = false;
        this.mostrarPlanCoberturaUnico = true;
        break;
      case MIM_PARAMETROS.MIM_VALOR_ASEGURADO.TOPE_DEFINIDO:
        this.planesCoberturas = this.planesCoberturasPorPlan;
        this.form.controls.planCobertura.setValue(null);
        this.form.controls.planCobertura.disable();
        this.form.controls.planCobertura.setErrors(null);

        this.form.controls.esUnRangoDe.setValue(false);
        this.form.controls.esUnRangoDe.disable();

        this.form.controls.aseguradoRangoInicio.setValue(null);
        this.form.controls.aseguradoRangoInicio.disable();
        this.form.controls.aseguradoRangoInicio.setErrors(null);

        this.form.controls.nroMesesPromedio.setValue(null);
        this.form.controls.nroMesesPromedio.disable();
        this.form.controls.nroMesesPromedio.setErrors(null);

        this.form.controls.porcentajePromedio.setValue(null);
        this.form.controls.porcentajePromedio.disable();

        this.form.controls.tipoReconocido.enable();
        this.form.controls.tipoReconocido.setErrors({ 'required': true });

        this.form.controls.valorAsegurado.enable();
        this.form.controls.valorAsegurado.setErrors({ 'required': true });

        this.form.controls.tieneValorSublimite.enable();
        this.form.controls.tipoValorRestitucion.enable();
        this.form.controls.esUnaRenta.enable();
        this.form.controls.fechaInicioFechaFin.enable();
        this.form.controls.vigente.enable();

        this.arrayTopes.clear();
        this.mostrarControl = true;
        this.mostrarPlanCoberturaUnico = true;
        break;
      case MIM_PARAMETROS.MIM_VALOR_ASEGURADO.PORCENTAJE_OTRA_COBERTURA:
        this.planesCoberturas = this.planesCoberturasPorPlan;
        this.form.controls.planCobertura.enable();
        this.form.controls.planCobertura.setErrors({ 'required': true });

        this.form.controls.esUnRangoDe.enable();

        this.form.controls.aseguradoRangoInicio.enable();
        this.form.controls.aseguradoRangoInicio.setErrors({ 'required': true });

        this.form.controls.nroMesesPromedio.setValue(null);
        this.form.controls.nroMesesPromedio.disable();
        this.form.controls.nroMesesPromedio.setErrors(null);

        this.form.controls.porcentajePromedio.setValue(null);
        this.form.controls.porcentajePromedio.disable();

        this.form.controls.tipoReconocido.setValue(null);
        this.form.controls.tipoReconocido.disable();
        this.form.controls.tipoReconocido.setErrors(null);

        this.form.controls.valorAsegurado.setValue(null);
        this.form.controls.valorAsegurado.disable();
        this.form.controls.valorAsegurado.setErrors(null);

        this.form.controls.tieneValorSublimite.setValue(false);
        this.form.controls.tieneValorSublimite.disable();

        this.form.controls.tipoValorRestitucion.enable();
        this.form.controls.esUnaRenta.enable();
        this.form.controls.fechaInicioFechaFin.enable();
        this.form.controls.vigente.enable();

        this.arrayTopes.clear();
        this.mostrarControl = true;
        this.mostrarPlanCoberturaUnico = true;

        break;
      case MIM_PARAMETROS.MIM_VALOR_ASEGURADO.CUOTA_OTRAS_COBERTURAS:
        this.planesCoberturas = this.planesCoberturasPorPlan;
        this.form.controls.planCobertura.enable();
        this.form.controls.planCobertura.setErrors({ 'required': true });

        this.form.controls.esUnRangoDe.setValue(false);
        this.form.controls.esUnRangoDe.disable();

        this.form.controls.aseguradoRangoInicio.enable();
        this.form.controls.aseguradoRangoInicio.setErrors({ 'required': true });

        this.form.controls.nroMesesPromedio.setValue(null);
        this.form.controls.nroMesesPromedio.disable();
        this.form.controls.nroMesesPromedio.setErrors(null);

        this.form.controls.porcentajePromedio.setValue(null);
        this.form.controls.porcentajePromedio.disable();

        this.form.controls.tipoReconocido.setValue(null);
        this.form.controls.tipoReconocido.disable();
        this.form.controls.tipoReconocido.setErrors(null);

        this.form.controls.valorAsegurado.setValue(null);
        this.form.controls.valorAsegurado.disable();
        this.form.controls.valorAsegurado.setErrors(null);

        this.form.controls.tieneValorSublimite.setValue(false);
        this.form.controls.tieneValorSublimite.disable();

        this.form.controls.tipoValorRestitucion.enable();
        this.form.controls.esUnaRenta.enable();
        this.form.controls.fechaInicioFechaFin.enable();
        this.form.controls.vigente.enable();

        this.arrayTopes.clear();
        this.mostrarControl = true;
        this.mostrarPlanCoberturaUnico = false;
        break;
      case MIM_PARAMETROS.MIM_VALOR_ASEGURADO.VOLUNTARIO_PROMEDIO_OTRA_COBERTURA:
        this.planesCoberturas = this.planesCoberturasPorPlan;
        this.form.controls.planCobertura.enable();
        this.form.controls.planCobertura.setErrors({ 'required': true });

        this.form.controls.esUnRangoDe.setValue(true);
        this.form.controls.esUnRangoDe.enable();

        this.form.controls.aseguradoRangoInicio.enable();
        this.form.controls.aseguradoRangoInicio.setErrors({ 'required': true });

        this.form.controls.nroMesesPromedio.enable();
        this.form.controls.nroMesesPromedio.setErrors({ 'required': true });

        this.form.controls.porcentajePromedio.enable();

        this.form.controls.tipoReconocido.setValue(null);
        this.form.controls.tipoReconocido.disable();
        this.form.controls.tipoReconocido.setErrors(null);

        this.form.controls.valorAsegurado.setValue(null);
        this.form.controls.valorAsegurado.disable();
        this.form.controls.valorAsegurado.setErrors(null);

        this.form.controls.tieneValorSublimite.setValue(false);
        this.form.controls.tieneValorSublimite.disable();

        this.form.controls.tipoValorRestitucion.enable();
        this.form.controls.esUnaRenta.enable();
        this.form.controls.fechaInicioFechaFin.enable();
        this.form.controls.vigente.enable();

        this.arrayTopes.clear();
        this.mostrarControl = true;
        this.mostrarPlanCoberturaUnico = false;
        break;
      case MIM_PARAMETROS.MIM_VALOR_ASEGURADO.PROTECCION_OTRAS_COBERTURAS:
        this.planesCoberturas = this.planesCoberturasCompletos;
        this.form.controls.planCobertura.enable();
        this.form.controls.planCobertura.setErrors({ 'required': true });

        this.form.controls.esUnRangoDe.setValue(false);
        this.form.controls.esUnRangoDe.disable();

        this.form.controls.aseguradoRangoInicio.enable();
        this.form.controls.aseguradoRangoInicio.setErrors({ 'required': true });

        this.form.controls.nroMesesPromedio.setValue(null);
        this.form.controls.nroMesesPromedio.disable();
        this.form.controls.nroMesesPromedio.setErrors(null);

        this.form.controls.porcentajePromedio.setValue(null);
        this.form.controls.porcentajePromedio.disable();

        this.form.controls.tipoReconocido.setValue(null);
        this.form.controls.tipoReconocido.disable();
        this.form.controls.tipoReconocido.setErrors(null);

        this.form.controls.valorAsegurado.setValue(null);
        this.form.controls.valorAsegurado.disable();
        this.form.controls.valorAsegurado.setErrors(null);

        this.form.controls.tieneValorSublimite.setValue(false);
        this.form.controls.tieneValorSublimite.disable();

        this.form.controls.tipoValorRestitucion.enable();
        this.form.controls.esUnaRenta.enable();
        this.form.controls.fechaInicioFechaFin.enable();
        this.form.controls.vigente.enable();

        this.arrayTopes.clear();
        this.mostrarControl = true;
        this.mostrarPlanCoberturaUnico = false;
        break;
      case MIM_PARAMETROS.MIM_VALOR_ASEGURADO.TOPE_OTRA_COBERTURA:
        this.planesCoberturas = this.planesCoberturasPorPlan;
        this.form.controls.planCobertura.enable();
        this.form.controls.planCobertura.setErrors({ 'required': true });

        this.form.controls.esUnRangoDe.setValue(false);
        this.form.controls.esUnRangoDe.disable();

        this.form.controls.aseguradoRangoInicio.setValue(null);
        this.form.controls.aseguradoRangoInicio.disable();
        this.form.controls.aseguradoRangoInicio.setErrors(null);

        this.form.controls.nroMesesPromedio.setValue(null);
        this.form.controls.nroMesesPromedio.disable();
        this.form.controls.nroMesesPromedio.setErrors(null);

        this.form.controls.porcentajePromedio.setValue(null);
        this.form.controls.porcentajePromedio.disable();

        this.form.controls.tipoReconocido.setValue(null);
        this.form.controls.tipoReconocido.disable();
        this.form.controls.tipoReconocido.setErrors(null);

        this.form.controls.valorAsegurado.setValue(null);
        this.form.controls.valorAsegurado.disable();
        this.form.controls.valorAsegurado.setErrors(null);

        this.form.controls.tieneValorSublimite.setValue(false);
        this.form.controls.tieneValorSublimite.disable();

        this.form.controls.tipoValorRestitucion.enable();
        this.form.controls.esUnaRenta.enable();
        this.form.controls.fechaInicioFechaFin.enable();
        this.form.controls.vigente.enable();

        this.arrayTopes.clear();
        this.mostrarControl = true;
        this.mostrarPlanCoberturaUnico = true;
        break;
      default:
        this.form.disable();
        break;
    }
  }

  changeValorRestitucion(param: any){
    if (param && this.form.controls.tipoValorRestitucion.value) {
      this.validarValorRestitucion(this.form.controls.tipoValorRestitucion.value.codigo);
    }

    this.form.controls.tipoValorRestitucion.valueChanges.subscribe((valorRestitucion:any) => {
      if (valorRestitucion) {
        this.validarValorRestitucion(valorRestitucion.codigo);
      }
    });
  }

  validarValorRestitucion(codigoValorRestitucion: number){
    if(codigoValorRestitucion === MIM_PARAMETROS.MIM_TIPO_VALOR_RESTITUCION.VIGENCIA_CALENDARIO){
      this.form.controls.tipoPeriodicidad.enable();
      this.form.controls.tipoPeriodicidad.setErrors({ 'required': true });
      this.form.controls.fechaInicioFechaFinRestitucion.enable();
      this.form.controls.fechaInicioFechaFinRestitucion.setErrors({ 'required': true });
      this.estadoFecha = false;
    }else{
      this.form.controls.tipoPeriodicidad.setValue(null);
      this.form.controls.tipoPeriodicidad.disable();
      this.form.controls.tipoPeriodicidad.setErrors(null);
      this.form.controls.fechaInicioFechaFinRestitucion.setValue(null);
      this.form.controls.fechaInicioFechaFinRestitucion.setErrors(null);
      this.estadoFecha = true;
    }
  }

  validarOpcionesPortafolio(){
    this.form.controls.presentacionPortafolio.enable();
    const valores = this.form.value;
    if(valores.tipoValorAsegurado){
      if(valores.esUnRangoDe && valores.tipoValorAsegurado.codigo === MIM_PARAMETROS.MIM_VALOR_ASEGURADO.PORCENTAJE_OTRA_COBERTURA){
        return this.opcionesPortafolio(GENERALES.CASOS_PRESENTACION_PORTAFOLIO.RANGO_PORCENTAJE);
      } else if(valores.tipoValorAsegurado.codigo === MIM_PARAMETROS.MIM_VALOR_ASEGURADO.PORCENTAJE_OTRA_COBERTURA){
        return this.opcionesPortafolio(GENERALES.CASOS_PRESENTACION_PORTAFOLIO.VALOR_ASEGURADO);
      }else if(valores.tipoValorAsegurado.codigo === MIM_PARAMETROS.MIM_VALOR_ASEGURADO.TOPE_DEFINIDO){
        return this.opcionesPortafolio(GENERALES.CASOS_PRESENTACION_PORTAFOLIO.TOPE_DEFINIDO);
      }else{
        return this.opcionesPortafolio(GENERALES.CASOS_PRESENTACION_PORTAFOLIO.VALOR_ASEGURADO);
      }
    }else{
      return [];
    }
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

  _listar(codigoPlanCobertura: string, estado: any, pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc') {
    const queryListaPorEstado = estado ? { isPaged: true, 'mimPlanCobertura.codigo': codigoPlanCobertura, 'estado': estado, page: pagina, size: tamanio, sort: sort } : { isPaged: true, 'mimPlanCobertura.codigo': codigoPlanCobertura, page: pagina, size: tamanio, sort: sort };
    this.backService.valorAsegurado.obtenerValoresAsegurados(queryListaPorEstado).subscribe((page: any) => {

      this.configuracion.gridConfig.component.limpiar();

      if (!page || !page.content || page.content.length === 0) {
        if (estado === 'true') {
          this.store.dispatch(new PostValorAseguradoAction(page, this.id, Estado.Pendiente));
        }
        return;
      }
      // Informamos que ya hay valores asegurados al Redux para controlar el estado del componente.
      let estadoModulo = this.validarEstado(page.content) === undefined && (estado === 'false' || estado === '') ? Estado.Pendiente : Estado.Guardado;
      this.store.dispatch(new PostValorAseguradoAction(page, this.id, estadoModulo));
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  validarEstado(items: any) {
    return items.find(objec => objec.estado === true);
  }

  _guardar() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }

    if (this.form.controls.tipoValorAsegurado.value.codigo === MIM_PARAMETROS.MIM_VALOR_ASEGURADO.VOLUNTARIO && (!this.arrayTopes || this.arrayTopes.length === 0)) {
      this.translate.get('administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.valorAsegurado.guardar.mensajeTopes').subscribe((text: string) => {
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

  crearValorAseguradoTopeList(): IMimValorAseguradoTope[] {

    let valorAseguradoTopeList: IMimValorAseguradoTope[] = null;

    if (this.arrayTopes && this.arrayTopes.length > 0) {

      // Se obtiene los valores del objeto topes
      valorAseguradoTopeList = this.arrayTopes.controls.map(c => {
        return {
          codigo: c.value.codigoTope,
          mimNivelRiesgo: { codigo: c.value.nivelRiesgoTope.codigo },
          mimTipoValorTopeUno: { codigo: c.value.tipoValorTopeUno.codigo },
          mimPlanCoberturaUno: c.value.planCoberturaTopeUno ? { codigo: c.value.planCoberturaTopeUno.codigo } : null,
          valorMinimo: c.value.valorMinimoTope,
          mimTipoValorTopeDos: { codigo: c.value.tipoValorTopeDos.codigo },
          mimPlanCoberturaDos: c.value.planCoberturaTopeDos ? { codigo: c.value.planCoberturaTopeDos.codigo } : null,
          valorMaximo: c.value.valorMaximoTope
        } as IMimValorAseguradoTope;
      });
    }

    return valorAseguradoTopeList;
  }

  crearValorAseguradoPlanCobertura(): IMimValorAseguradoPlanCobertura[] {
    let valorAseguradoPlanCoberturaList: IMimValorAseguradoPlanCobertura[] = null;

    if (this.form.controls.planCobertura.value) {

      if (this.mostrarPlanCoberturaUnico) {
        const planCobertura = { mimPlanCobertura: { codigo: this.form.controls.planCobertura.value.codigo } } as IMimValorAseguradoPlanCobertura;
        valorAseguradoPlanCoberturaList = [ planCobertura ];
      } else {
        valorAseguradoPlanCoberturaList = this.form.controls.planCobertura.value.map(planCobertura => {
          const codigo = { mimPlanCobertura: { codigo: planCobertura.codigo } };
          return codigo;
        });
      }

    }

    return valorAseguradoPlanCoberturaList;
  }

  _crear() {
    const form: any = this.form.value;
    const valorAsegurado = {
      mimPlanCobertura: { codigo: this.planCobertura.planCobertura.codigo },
      mimTipoValorAsegurado: { codigo: form.tipoValorAsegurado.codigo },
      esUnRangoDePorcentaje: form.esUnRangoDe,
      porcentajeAseguradoInicial: form.aseguradoRangoInicio,
      porcentajeAseguradoFinal: form.aseguradoRangoFinal,
      mesesPromedio: form.nroMesesPromedio,
      promedioCobertura: form.porcentajePromedio,
      observacion: form.observacionValorAsegurado,
      mimTipoReconocido: form.tipoReconocido ? { codigo: form.tipoReconocido.codigo } : null,
      valorAsegurado: form.valorAsegurado,
      tieneValorSublimite: form.tieneValorSublimite,
      mimTipoValorRestitucion: form.tipoValorRestitucion ? { codigo: form.tipoValorRestitucion.codigo } : null,
      esUnaRenta: form.esUnaRenta,
      mimTipoPeriodicidad: form.tipoPeriodicidad ? { codigo: form.tipoPeriodicidad.codigo } : null,
      fechaVigenteInicio: DateUtil.dateToString(form.fechaInicioFechaFin[0], 'dd-MM-yyyy'),
      fechaVigenteFin: DateUtil.dateToString(form.fechaInicioFechaFin[1], 'dd-MM-yyyy'),
      estado: form.vigente,
      mimValorAseguradoPlanCoberturaList: this.crearValorAseguradoPlanCobertura(),
      mimValorAseguradoTopeList: this.crearValorAseguradoTopeList(),
      fechaInicioRestitucion: form.fechaInicioFechaFinRestitucion ? DateUtil.dateToString(form.fechaInicioFechaFinRestitucion[0], 'dd-MM-yyyy') : null,
      fechaFinRestitucion : form.fechaInicioFechaFinRestitucion ? DateUtil.dateToString(form.fechaInicioFechaFinRestitucion[1], 'dd-MM-yyyy'): null,
      rentaMinimaPagar: form.rentaMinimaPagar,
      rentaMaximaPagar: form.rentaMaximaPagar,
      mimPresentacionPortafolio: { codigo: form.presentacionPortafolio.codigo}
    } as IMimValorAsegurado;

    this.backService.valorAsegurado.crearValorAsegurado(valorAsegurado).subscribe((respuesta: any) => {
      // Limpiamos el formulario y cerramos el modulo de registro
      this.limpiarFormulario();
      this.mostrarGuardar = false;

      this.creacionActualizacionExitosa(true);
    }, (err) => {
      this.frontService.alert.error(err.error.message, err.error.traza);
    });
  }

  _actualizar() {
    const form: any = this.form.value;
    this.valorAsegurado.mimPlanCobertura.codigo = this.planCobertura.planCobertura.codigo;
    this.valorAsegurado.mimTipoValorAsegurado.codigo = form.tipoValorAsegurado.codigo;
    this.valorAsegurado.esUnRangoDePorcentaje = form.esUnRangoDe;
    this.valorAsegurado.porcentajeAseguradoInicial = form.aseguradoRangoInicio;
    this.valorAsegurado.porcentajeAseguradoFinal = form.aseguradoRangoFinal;
    this.valorAsegurado.mesesPromedio = form.nroMesesPromedio;
    this.valorAsegurado.promedioCobertura = form.porcentajePromedio;
    this.valorAsegurado.observacion = form.observacionValorAsegurado;
    this.valorAsegurado.mimTipoReconocido = form.tipoReconocido ? { codigo: form.tipoReconocido.codigo } : null;
    this.valorAsegurado.valorAsegurado = form.valorAsegurado;
    this.valorAsegurado.tieneValorSublimite = form.tieneValorSublimite;
    this.valorAsegurado.mimTipoValorRestitucion = form.tipoValorRestitucion ? { codigo: form.tipoValorRestitucion.codigo } : null;
    this.valorAsegurado.esUnaRenta = form.esUnaRenta;
    this.valorAsegurado.mimTipoPeriodicidad = form.tipoPeriodicidad ? { codigo: form.tipoPeriodicidad.codigo } : null;
    this.valorAsegurado.fechaVigenteInicio = DateUtil.dateToString(form.fechaInicioFechaFin[0], 'dd-MM-yyyy');
    this.valorAsegurado.fechaVigenteFin = DateUtil.dateToString(form.fechaInicioFechaFin[1], 'dd-MM-yyyy');
    this.valorAsegurado.estado = form.vigente;
    this.valorAsegurado.mimValorAseguradoPlanCoberturaList = this.crearValorAseguradoPlanCobertura();
    this.valorAsegurado.mimValorAseguradoTopeList = this.crearValorAseguradoTopeList();
    this.valorAsegurado.fechaInicioRestitucion = form.fechaInicioFechaFinRestitucion ? DateUtil.dateToString(form.fechaInicioFechaFinRestitucion[0], 'dd-MM-yyyy') : null;
    this.valorAsegurado.fechaFinRestitucion = form.fechaInicioFechaFinRestitucion ? DateUtil.dateToString(form.fechaInicioFechaFinRestitucion[1], 'dd-MM-yyyy'): null;
    this.valorAsegurado.rentaMinimaPagar = form.rentaMinimaPagar;
    this.valorAsegurado.rentaMaximaPagar = form.rentaMaximaPagar;
    this.valorAsegurado.mimPresentacionPortafolio = { codigo: form.presentacionPortafolio.codigo}

    this.backService.valorAsegurado.actualizarValorAsegurado(this.valorAsegurado.codigo, this.valorAsegurado).subscribe((respuesta: any) => {

      // Limpiamos el formulario y cerramos el modulo de registro
      this.limpiarFormulario();
      this.mostrarGuardar = false;

      this.creacionActualizacionExitosa(false);
    }, (err) => {
      this.frontService.alert.error(err.error.message, err.error.traza);
    });
  }

  private creacionActualizacionExitosa(operacion: boolean){
    this.translate.get(operacion ? 'global.guardadoExitosoMensaje' : 'global.actualizacionExitosaMensaje').subscribe((text: string) => {
      this.frontService.alert.success(text).then(() => {
        // Recargamos la informacion de la tabla.
        this._listar(this.planCobertura.planCobertura.codigo, this.filtroEstadoLista);
      });
    });
  }

  _cerrarSeccion() {
    this.dropdown = false;
    this.valorAsegurado = undefined;
  }

  limpiarFormulario() {
    this.form.reset();
    this.initForm();
  }

  _obtenerEstado(): string {
    if (!this.planCobertura) {
      return Estado.Pendiente;
    }
    const seccion = obtenerSeccionPorId(this.id, this.planCobertura.guardarPlanCoberturaOrden);
    return seccion && seccion.estado ? seccion.estado : Estado.Pendiente;
  }

  _onSiguiente($event) {
    this._listar(this.planCobertura.planCobertura.codigo, this.filtroEstadoLista, $event.pagina, $event.tamano);
  }

  _onAtras($event) {
    this._listar(this.planCobertura.planCobertura.codigo, this.filtroEstadoLista, $event.pagina, $event.tamano);
  }

  _onFiltroEstado($event) {
    this.filtroEstadoLista = $event.currentTarget.checked;
    this._listar(this.planCobertura.planCobertura.codigo, this.filtroEstadoLista);
  }

  _onClickCeldaElement($event) {
    if ($event.col.key === 'editar') {
      this._toggleGuardar(true, $event.dato);
    } else {
      this._alEliminar($event.dato);
    }
  }

  private _alEliminar($event: any) {
    this.translate.get('global.alertas.eliminar').subscribe((text: string) => {
      const modalPromise = this.frontService.alert.confirm(text, 'danger');
      const newObservable = from(modalPromise);
      newObservable.subscribe(
        (desition: any) => {
          if (desition === true) {
            this.backService.valorAsegurado.eliminarValorAsegurado($event.codigo).subscribe((respuesta: any) => {
              this.translate.get('global.eliminadoExitosoMensaje').subscribe((texto: string) => {
                this.frontService.alert.success(texto).then(() => {
                  // Recargamos la informacion de la tabla.
                  this._listar(this.planCobertura.planCobertura.codigo, this.filtroEstadoLista);
                });
              });
            });
          }
        });
    });
  }

  async _toggleGuardar(toggle: boolean, valorAsegurado?: any) {
    if (!toggle && this.hasChanges()) {
      this.frontService.alert.confirm(this.translate.instant('global.onDeactivate')).then((respuesta: boolean) => {
        if (respuesta) {
          this.mostrarGuardar = false;
          this.limpiarFormulario();
        }
      });
    } else {
      if (valorAsegurado) {
        this.valorAsegurado = JSON.parse(JSON.stringify(valorAsegurado));
        this._esCreacion = false;
        this._setRowInactivo(this.valorAsegurado);
        this.initForm(this.valorAsegurado);
      } else {
        this.valorAsegurado = undefined;
        this._esCreacion = true;
        this.initForm();
      }
      this.mostrarGuardar = toggle;
    }
  }

  abrirModalTopes() {
    this.mostrarModalTopes = true;
    if (this._esCreacion && (!this.arrayTopes || this.arrayTopes.length === 0)) {
      this.addNewRow();
    }
  }

  cerrarModalTopes() {
    this.mostrarModalTopes = false;
  }

  onDeleteRow(index: number) {
    this.arrayTopes.removeAt(index);
  }

  addNewRow(): void {
    if (this.arrayTopes.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }
    this.arrayTopes.push(this.crearFilaTopes());
  }

  getControls(index: number) {
    return this.arrayTopes.controls[index]['controls'];
  }

  opcionesPortafolio(caso: number){
    switch(caso){
      case GENERALES.CASOS_PRESENTACION_PORTAFOLIO.VALOR_ASEGURADO:
        return this.listOpcionesPortafolio.filter((item:any) =>
          item.codigo === MIM_PARAMETROS.MIM_PRESENTACION_PORTAFOLIO.SI_AMPARA || item.codigo === MIM_PARAMETROS.MIM_PRESENTACION_PORTAFOLIO.VALOR_ASEGURADO);

      case GENERALES.CASOS_PRESENTACION_PORTAFOLIO.RANGO_PORCENTAJE:
        return this.listOpcionesPortafolio.filter((item:any) =>
          item.codigo === MIM_PARAMETROS.MIM_PRESENTACION_PORTAFOLIO.SI_AMPARA || item.codigo === MIM_PARAMETROS.MIM_PRESENTACION_PORTAFOLIO.RANGO_PORCENTAJE);

      default:
        return this.listOpcionesPortafolio.filter((item:any) => item.codigo !== MIM_PARAMETROS.MIM_PRESENTACION_PORTAFOLIO.RANGO_PORCENTAJE);
    }
  }

  configurarMascara(): any{
    return {
      align: 'left',
      allowNegative: false,
      allowZero: true,
      decimal: ',',
      precision: 0,
      prefix: '',
      suffix: '',
      thousands: '.',
      nullable: true,
      min: null,
      max: null,
      inputMode: CurrencyMaskInputMode.NATURAL
    };
  }

}
