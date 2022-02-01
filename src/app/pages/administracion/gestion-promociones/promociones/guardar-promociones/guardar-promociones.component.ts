import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { numberMaskConfig, percentMaskConfig } from '@shared/static/constantes/currency-mask';
import { TranslateService } from '@ngx-translate/core';
import { CustomValidators, FormValidate } from '@shared/util';
import { DateUtil } from '@shared/util/date.util';
import { FormComponent } from '@core/guards';
import { UrlRoute } from '@shared/static/urls/url-route';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { minMaxValidator} from '@shared/directives/min-max-validator.directive';
import { FileUpload } from 'primeng/fileupload';
import { GENERALES } from '@shared/static/constantes/constantes';
import * as FileSaver from 'file-saver';
import { BackFacadeService } from '@core/services/back-facade.service';
import { FrontFacadeService } from '@core/services/front-facade.service';

@Component({
  selector: 'app-guardar-promociones',
  templateUrl: './guardar-promociones.component.html',
  styleUrls: ['./guardar-promociones.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GuardarPromocionesComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  form: FormGroup;
  isForm: Promise<any>;

  _esCreacion = true;
  subscription: Subscription = new Subscription();
  codigoPromocion: any;
  promocion: any;
  mostrarCuotas: boolean;
  bloquearBotonCondicion: boolean;

  types: string = GENERALES.EXTENSION_DOCUMENTO;
  maxUploadSize: number = GENERALES.PESO_MAXIMO_DOCUMENTO;
  uploadAcceptedFormat: string = GENERALES.MIME_DOCUMENTO;
  uploadSizeMB: number;
  archivoAseguradosAptos: FileUpload;

  valorMaxBeneficio = null;
  valorMinBeneficio = null;
  optionsMask;

  tiposBeneficios: any[];
  beneficios: any[];
  tiposSolicitudes: any[];
  canales: any[];
  planesCoberturas: any[];
  condiciones: any[];
  condicionesOriginales: any[];
  estadosAsegurado: any[];
  generos: any[];
  planCanalesVenta: any[];

  listBeneficios: Observable<any>;
  listCanales: Observable<any>;
  listPlanesCoberturas: Observable<any>;

  formData: FormData;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService,
    private readonly router: Router) {
      super();
      this.uploadSizeMB = this.getSizeInMegaBytes(this.maxUploadSize);
      this.bloquearBotonCondicion = false;
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.activatedRoute.params.subscribe((params: any) => {
      this.codigoPromocion = params.codigo || null;

      forkJoin({
        _tiposBeneficios: this.backService.tipoBeneficio.getTiposBeneficios({ estado: true }),
        _tiposPromociones: this.backService.tipoPromocion.getTiposPromociones({ estado: true }),
        _generos: this.backService.genero.getGeneros({ estado: true }),
        _estadosAsegurados: this.backService.estadoAsociado.getEstadosAsociados({estado: true}),
        _tiposMovimientos: this.backService.tiposMovimientos.getTiposMovimientos({
          estado: true,
          codigo: [ GENERALES.TIPO_MOVIMIENTO.INCREMENTAR, GENERALES.TIPO_MOVIMIENTO.VINCULACION]
        })
      }).subscribe((x: any) => {
        this.tiposBeneficios = x._tiposBeneficios._embedded.mimTipoBeneficio;
        this.tiposSolicitudes = x._tiposMovimientos._embedded.mimTipoMovimiento;
        this.condiciones = x._tiposPromociones._embedded.mimTipoPromocion;
        this.estadosAsegurado = x._estadosAsegurados.content;
        this.generos = x._generos._embedded.mimGenero;
        this.condicionesOriginales = this.condiciones;

        if (this.codigoPromocion) {
          this.backService.promocion.getPromocion(this.codigoPromocion).subscribe((resp: any) => {
              this.promocion = resp;
              this._esCreacion = false;
              this.getListBeneficios(this.promocion.mimTipoBeneficio.codigo);
              this.getListCanales(this.promocion.mimPromocionSolicitudList.map(y => y.mimTipoMovimiento.codigo));
              this.getListPlanesCoberturas(this.promocion.mimPromocionPlanCoberturaList.map(y => y.mimPlanCobertura.mimPlan.codigo));
              this.initForm(this.promocion);
            }, (err) => {
              this.frontService.alert.warning(err.error.message);
            });
        } else {
          this._esCreacion = true;
          this.initForm();
        }

      }, (err: any) => {
        this.frontService.alert.warning(err.error.message);
        this.irListar();
      });

    });
  }

  get arrayCondiciones() {
    return this.form.controls.arrayCondiciones as FormArray;
  }

  initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        nombrePromocion: new FormControl(param ? param.nombre : null,  [Validators.required, Validators.maxLength(255), CustomValidators.vacio]),
        descripcion: new FormControl(param ? param.descripcion : null,  [Validators.required, Validators.maxLength(512), CustomValidators.vacio]),
        tipoBeneficio: new FormControl(param ? this.getTipoBeneficio(param.mimTipoBeneficio.codigo) : null, [Validators.required]),
        beneficio: new FormControl(param ? this.subscribeBeneficios(param.mimBeneficio.codigo) : null, [Validators.required]),
        valorBeneficio: new FormControl(param && param.valorBeneficio ? param.valorBeneficio : null),
        cantidadStock: new FormControl(param && param.cantidadStock ? param.cantidadStock : null),
        tipoSolicitud: new FormControl(param ? this.getTiposSolicitudes(param.mimPromocionSolicitudList) : null, [Validators.required]),
        canal: new FormControl(param ? this.subscribeCanales(param.mimPromocionCanalList) : null, [Validators.required]),
        planCobertura: new FormControl(param ? this.subscribePlanesCobertura(param.mimPromocionPlanCoberturaList) : null, [Validators.required]),
        fechaInicioFechaFin: new FormControl(param ? this.getRangoFecha(param.fechaInicio, param.fechaFin) : null, [Validators.required]),
        vigente: new FormControl(param ? param.estado : true),
        arrayCondiciones: this.formBuilder.array([]),
      }));

    if (!this._esCreacion) {
      this.form.controls.tipoBeneficio.disable();
      this.form.controls.beneficio.disable();
      this.form.controls.valorBeneficio.disable();
      this.form.controls.cantidadStock.disable();
    }

    this.onChangeTipoBeneficio();
    this.onChangeBeneficio();
    this.onChangeTipoSolicitud();
    this.onChangeCanal();
    this.cargarCondiciones(param);
  }

  private crearFilaCondicion(paramCondicion?: any): FormGroup {
    const formGroupCondicion = this.formBuilder.group({
      codigoCondicion: new FormControl(paramCondicion && paramCondicion.codigo ? paramCondicion.codigo : null),
      condicion: new FormControl(paramCondicion && paramCondicion.mimTipoPromocion ? this.getCondicion(paramCondicion.mimTipoPromocion.codigo) : null, [Validators.required]),
      cuotasPagadas: new FormControl(paramCondicion ? paramCondicion.cuotasPagadas : null),
      valorMaximoMora: new FormControl(paramCondicion ? paramCondicion.valorMaximoMora : null),
      estadoAsegurado: new FormControl(paramCondicion && paramCondicion.mimEstadoAsegurado ? this.getEstadoAsegurado(paramCondicion.mimEstadoAsegurado.codigo) : null),
      genero: new FormControl(paramCondicion && paramCondicion.mimGenero ? this.getGenero(paramCondicion.mimGenero.codigo) : null),
      edadMinima: new FormControl(paramCondicion ? paramCondicion.edadMinima : null),
      edadMaxima: new FormControl(paramCondicion ? paramCondicion.edadMaxima : null),
      antiguedad: new FormControl(paramCondicion ? paramCondicion.antiguedad : null),
      archivoAseguradoAptos: new FormControl(null),
      codigoTipoPromocion: new FormControl(0),
      nombreTipoPromocion: new FormControl(null),
    }, {
      validators: [
        minMaxValidator('edadMinima', 'edadMaxima')
      ]
    });

    this.onChangeCondicion(formGroupCondicion, paramCondicion);
    return formGroupCondicion;
  }

  private cargarCondiciones(param: any) {
    if (param && param.mimPromocionCondicionList) {
      for (const condicion of param.mimPromocionCondicionList) {
        this.arrayCondiciones.push(this.crearFilaCondicion(condicion));
      }
    }
  }

  onChangeCondicion(formGroupCondicion: FormGroup, paramCondicion?: any) {

    if (paramCondicion && paramCondicion.mimTipoPromocion.codigo) {
      this.validaCondicion(formGroupCondicion, paramCondicion.mimTipoPromocion, true);
    }

    formGroupCondicion.controls.condicion.valueChanges.subscribe(tipoPromocion => {
      if (tipoPromocion) {
        this.validaCondicion(formGroupCondicion, tipoPromocion);
      }
    });
  }

  validaCondicion(formGroupCondicion: FormGroup, tipoPromocion: any, cargaPrimeraVez?: any) {

    formGroupCondicion.controls.codigoTipoPromocion.setValue(tipoPromocion.codigo);
    formGroupCondicion.controls.nombreTipoPromocion.setValue(tipoPromocion.nombre);
    this.condiciones = this.condiciones.filter(x => x.codigo !== tipoPromocion.codigo);

    if (tipoPromocion.codigo !== GENERALES.TIPO_PROMOCION.ASEGURADOS_APTOS) {
      this.condiciones = this.condiciones.filter(x => x.codigo !== GENERALES.TIPO_PROMOCION.ASEGURADOS_APTOS);
    }

    if (!cargaPrimeraVez) {
      this.clearCondicionDetalle(formGroupCondicion);
    }


    switch (tipoPromocion.codigo) {
      case GENERALES.TIPO_PROMOCION.CUOTAS_PAGADAS_FACTURACION:

        formGroupCondicion.controls.cuotasPagadas.setValidators([Validators.required, Validators.min(1), Validators.max(999999999)]);
        formGroupCondicion.controls.cuotasPagadas.updateValueAndValidity();
        formGroupCondicion.controls.cuotasPagadas.markAsTouched();

        break;
      case GENERALES.TIPO_PROMOCION.VALOR_MAXIMO_MORA:

        formGroupCondicion.controls.valorMaximoMora.setValidators([Validators.required, Validators.min(1), Validators.max(9999999999.99)]);
        formGroupCondicion.controls.valorMaximoMora.updateValueAndValidity();
        formGroupCondicion.controls.valorMaximoMora.markAsTouched();

        break;
      case GENERALES.TIPO_PROMOCION.ESTADO_ASEGURADO:

        formGroupCondicion.controls.estadoAsegurado.setValidators([Validators.required]);
        formGroupCondicion.controls.estadoAsegurado.updateValueAndValidity();
        formGroupCondicion.controls.estadoAsegurado.markAsTouched();

        break;
      case GENERALES.TIPO_PROMOCION.GENERO:

        formGroupCondicion.controls.genero.setValidators([Validators.required]);
        formGroupCondicion.controls.genero.updateValueAndValidity();
        formGroupCondicion.controls.genero.markAsTouched();


        break;
      case GENERALES.TIPO_PROMOCION.EDAD:

        formGroupCondicion.controls.edadMinima.setValidators([Validators.required, Validators.min(18), Validators.max(100)]);
        formGroupCondicion.controls.edadMinima.updateValueAndValidity();
        formGroupCondicion.controls.edadMinima.markAsTouched();

        formGroupCondicion.controls.edadMaxima.setValidators([Validators.required, Validators.min(1), Validators.max(100)]);
        formGroupCondicion.controls.edadMaxima.updateValueAndValidity();
        formGroupCondicion.controls.edadMaxima.markAsTouched();

        break;
      case GENERALES.TIPO_PROMOCION.ASEGURADOS_APTOS:

        formGroupCondicion.controls.archivoAseguradoAptos.setValidators([Validators.required]);
        formGroupCondicion.controls.archivoAseguradoAptos.updateValueAndValidity();
        formGroupCondicion.controls.archivoAseguradoAptos.markAsTouched();
        this.bloquearBotonCondicion = true;

        break;
      case GENERALES.TIPO_PROMOCION.ANTIGUEDAD:

        formGroupCondicion.controls.antiguedad.setValidators([Validators.required, Validators.min(1), Validators.max(100)]);
        formGroupCondicion.controls.antiguedad.updateValueAndValidity();
        formGroupCondicion.controls.antiguedad.markAsTouched();

        break;
      default:

        break;
    }

  }

  clearCondicionDetalle(formGroupCondicion: FormGroup) {

    formGroupCondicion.controls.cuotasPagadas.setValue(null);
    formGroupCondicion.controls.cuotasPagadas.setErrors(null);
    formGroupCondicion.controls.valorMaximoMora.setValue(null);
    formGroupCondicion.controls.valorMaximoMora.setErrors(null);
    formGroupCondicion.controls.estadoAsegurado.setValue(null);
    formGroupCondicion.controls.estadoAsegurado.setErrors(null);
    formGroupCondicion.controls.genero.setValue(null);
    formGroupCondicion.controls.genero.setErrors(null);
    formGroupCondicion.controls.edadMinima.setValue(null);
    formGroupCondicion.controls.edadMinima.setErrors(null);
    formGroupCondicion.controls.edadMaxima.setValue(null);
    formGroupCondicion.controls.edadMaxima.setErrors(null);
    formGroupCondicion.controls.antiguedad.setValue(null);
    formGroupCondicion.controls.antiguedad.setErrors(null);
    formGroupCondicion.controls.archivoAseguradoAptos.setValue(null);
    formGroupCondicion.controls.archivoAseguradoAptos.setErrors(null);
    this.archivoAseguradosAptos = null;

  }

  onChangeTipoBeneficio() {
    this.form.controls.tipoBeneficio.valueChanges.subscribe(tipoBeneficio => {
      if (tipoBeneficio) {
        this.getListBeneficios(tipoBeneficio.codigo);
        this.subscribeBeneficios();
      }
      this.form.controls.beneficio.setValue(null);
    });
  }

  onChangeBeneficio() {
    if (this._esCreacion) {
      this.form.controls.beneficio.valueChanges.subscribe(beneficio => {
        // Si el beneficio es 1 = % Cuota
        if (beneficio && beneficio.codigo === GENERALES.BENEFICIO.PORCENTAJE_CUOTAS) {
          this.form.controls.valorBeneficio.setValidators([Validators.required, Validators.min(1), Validators.max(100)]);
          this.valorMinBeneficio = '1';
          this.valorMaxBeneficio = '100';
          this.optionsMask = percentMaskConfig;
          this.form.controls.valorBeneficio.updateValueAndValidity();
          this.form.controls.valorBeneficio.markAsTouched();
          this.form.controls.valorBeneficio.setValue(null);

        // Si el beneficio es 2 = # Cuota
        } else if (beneficio && beneficio.codigo === GENERALES.BENEFICIO.NUMERO_CUOTAS) {
          this.form.controls.valorBeneficio.setValidators([Validators.required, Validators.min(1), Validators.max(9999999999.99)]);
          this.valorMinBeneficio = '1';
          this.valorMaxBeneficio = '9999999999.99';
          this.optionsMask = numberMaskConfig;
          this.form.controls.valorBeneficio.updateValueAndValidity();
          this.form.controls.valorBeneficio.markAsTouched();
          this.form.controls.valorBeneficio.setValue(null);

        // Si el beneficio es 3 = Bono
        } else if (beneficio && beneficio.codigo === GENERALES.BENEFICIO.BONO) {
          this.form.controls.cantidadStock.setValidators([Validators.required, Validators.min(1), Validators.max(9999999999.99)]);
          this.form.controls.cantidadStock.updateValueAndValidity();
          this.form.controls.cantidadStock.markAsTouched();
          this.form.controls.cantidadStock.setValue(null);
        }

      });
    }

  }

  onChangeTipoSolicitud() {
    this.form.controls.tipoSolicitud.valueChanges.subscribe(tipoSolicitud => {
      if (tipoSolicitud) {
        this.getListCanales(tipoSolicitud.map(x => x.codigo));
        this.subscribeCanales();
      }
    });
  }

  onChangeCanal() {
    this.form.controls.canal.valueChanges.subscribe(canal => {
      if (canal) {
        const planesCanales = this.planCanalesVenta.filter(planCanal => canal.find(x =>
          x.codigo === planCanal.mimCanalVenta.codigo));
        this.getListPlanesCoberturas(planesCanales.map(x => x.mimPlan.codigo));
        this.subscribePlanesCobertura();
      }
    });
  }

  private getListBeneficios(codigoTipoBeneficio: number) {
    let codigosBeneficios: any[] = null;
    // Si el tipo de beneficio es 1 = Cuotas
    if (codigoTipoBeneficio === GENERALES.TIPO_BENEFICIO.CUOTAS) {
      codigosBeneficios = [GENERALES.BENEFICIO.PORCENTAJE_CUOTAS, GENERALES.BENEFICIO.NUMERO_CUOTAS];
      this.mostrarCuotas = true;
    } else {
      codigosBeneficios = [GENERALES.BENEFICIO.BONO];
      this.mostrarCuotas = false;
    }
    this.listBeneficios = this.backService.beneficio.getBeneficios({ estado: true, codigo: codigosBeneficios });
  }

  private subscribeBeneficios(codigoBeneficio?: string) {
    this.listBeneficios.subscribe(item => {
      this.beneficios = item._embedded.mimBeneficio;

      if (codigoBeneficio != null) {
        this.form.controls.beneficio.setValue(this.getBeneficio(codigoBeneficio));
      }

    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });
  }

  private getListCanales(codigosTipoMovimiento: any) {
    this.listCanales = this.backService.movimientoPlanCanal.getMimMovimientoPlanCanal({
      mimTipoMovimiento: codigosTipoMovimiento,
      'mimPlanCanalVenta.mimCanalVenta.mimEstadoPlan.codigo': [MIM_PARAMETROS.MIM_ESTADO_PLAN.ACTIVO, MIM_PARAMETROS.MIM_ESTADO_PLAN.PROCESO]
    });
  }

  private subscribeCanales(promocionCanalList?: any[]) {
    this.listCanales.subscribe(resp => {
      const _canales = resp.content.map(x => x.mimPlanCanalVenta.mimCanalVenta);
      this.planCanalesVenta = resp.content.map(x => x.mimPlanCanalVenta);
      this.canales = [...new Set(_canales.map(JSON.stringify))].map((x: any) => JSON.parse(x));
      if (promocionCanalList != null) {
        this.form.controls.canal.setValue(this.getCanales(promocionCanalList));
      }
     }, (err) => {
        this.frontService.alert.warning(err.error.message);
      });
  }

  private getListPlanesCoberturas(codigosPlanes: any) {
    this.listPlanesCoberturas = this.backService.planCobertura.getPlanesCoberturas({
      'mimEstadoPlanCobertura.codigo': [MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.ACTIVO, MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.PROCESO],
      'mimPlan.codigo': codigosPlanes });
  }

  private subscribePlanesCobertura(promocionPlanCoberturaList?: any[]) {
    this.listPlanesCoberturas.subscribe(resp => {
      this.planesCoberturas = resp.content.map((item: any) => ({ ...item, _nombre: `${item.mimPlan.nombre} - ${item.nombre}` }));
      if (promocionPlanCoberturaList != null) {
        this.form.controls.planCobertura.setValue(this.getPlanesCoberturas(promocionPlanCoberturaList));
      }
    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });
  }

  getTipoBeneficio(codigo: string) {
    return this.tiposBeneficios.find(x => x.codigo === codigo);
  }

  getBeneficio(codigo: string) {
    return this.beneficios.find(x => x.codigo === codigo);
  }

  getTiposSolicitudes(items: any[]) {
    return this.tiposSolicitudes.filter(tipoSolicitud => items.find(item =>
      item.mimPromocionSolicitudPK.codigoTipoMovimiento === tipoSolicitud.codigo));
  }

  getCanales(items: any[]) {
    return this.canales.filter(canal => items.find(item =>
      item.mimPromocionCanalPK.codigoCanal === canal.codigo));
  }

  getPlanesCoberturas(items: any[]) {
    return this.planesCoberturas.filter(planCobertura => items.find(item =>
      item.mimPromocionPlanCoberturaPK.codigoPlanCobertura === planCobertura.codigo));
  }

  getRangoFecha(fechaIni: any, fechaFin: any) {
    return [DateUtil.stringToDate(fechaIni), DateUtil.stringToDate(fechaFin)];
  }

  getCondicion(codigo: string) {
    return this.condiciones.find(x => x.codigo === codigo);
  }

  getEstadoAsegurado(codigo: string) {
    return this.estadosAsegurado.find(x => x.codigo === codigo);
  }

  getGenero(codigo: string) {
    return this.generos.find(x => x.codigo === codigo);
  }

 _alGuardar() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((validateForm: string) => {
        this.frontService.alert.warning(validateForm);
      });
      return;
    }

    if (!this.arrayCondiciones || this.arrayCondiciones.length === 0) {
      this.translate.get('administracion.gestionPromociones.promociones.alertas.condicionObligatorio').subscribe((text: string) => {
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

  crearPromocionCondicionList(): any[] {

    let promocionCondicionList: any[] = null;

    if (this.arrayCondiciones && this.arrayCondiciones.length > 0) {

      // Se obtiene los valores de las condiciones
      promocionCondicionList = this.arrayCondiciones.controls.map(c => {
        return {
          codigo: c.value.codigoCondicion,
          mimTipoPromocion: { codigo: c.value.codigoTipoPromocion },
          cuotasPagadas: c.value.cuotasPagadas,
          valorMaximoMora: c.value.valorMaximoMora,
          mimEstadoAsegurado: c.value.estadoAsegurado ? { codigo: c.value.estadoAsegurado.codigo } : null,
          mimGenero: c.value.genero ? { codigo: c.value.genero.codigo } : null,
          edadMinima: c.value.edadMinima,
          edadMaxima: c.value.edadMaxima,
          antiguedad: c.value.antiguedad
        };
      });
    }

    return promocionCondicionList;
  }

  _crear() {
    const form: any = this.form.value;
    const fechaInicio = DateUtil.dateToString(form.fechaInicioFechaFin[0], 'dd-MM-yyyy');
    const fechaFin = DateUtil.dateToString(form.fechaInicioFechaFin[1], 'dd-MM-yyyy');

    const promocion = {
      nombre: form.nombrePromocion,
      descripcion: form.descripcion,
      mimTipoBeneficio: { codigo: form.tipoBeneficio.codigo },
      mimBeneficio: { codigo: form.beneficio.codigo },
      valorBeneficio: form.valorBeneficio,
      cantidadStock: form.cantidadStock,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      estado: true,
      mimPromocionSolicitudList: form.tipoSolicitud.map(tipoSolicitud => {
        return { mimTipoMovimiento: { codigo: tipoSolicitud.codigo } };
      }),
      mimPromocionCanalList: form.canal.map(canal => {
        return { mimCanal: { codigo: canal.codigo } };
      }),
      mimPromocionPlanCoberturaList: form.planCobertura.map(planCobertura => {
        return { mimPlanCobertura: { codigo: planCobertura.codigo } };
      }),
      mimPromocionCondicionList: this.crearPromocionCondicionList()
    };
    if(this.validarCondicionCargue(promocion)){
      this.crearPromocionCargue(promocion);
    }else{
      this.backService.promocion.postPromocion(promocion).subscribe((resp: any) => {
        this.procesarCreacionActualizacion(true);
      }, (err) => {
        this.frontService.alert.error(err.error.message);
      });
    }
  }

  _actualizar() {
    const form: any = this.form.value;
    const fechaInicio = DateUtil.dateToString(form.fechaInicioFechaFin[0], 'dd-MM-yyyy');
    const fechaFin = DateUtil.dateToString(form.fechaInicioFechaFin[1], 'dd-MM-yyyy');

    this.promocion.nombre = form.nombrePromocion;
    this.promocion.descripcion = form.descripcion;
    this.promocion.fechaInicio = fechaInicio;
    this.promocion.fechaFin = fechaFin;
    this.promocion.estado = form.vigente;
    this.promocion.mimPromocionSolicitudList = form.tipoSolicitud.map(tipoSolicitud => {
      return { mimTipoMovimiento: { codigo: tipoSolicitud.codigo } };
    });
    this.promocion.mimPromocionCanalList = form.canal.map(canal => {
      return { mimCanal: { codigo: canal.codigo } };
    });
    this.promocion.mimPromocionPlanCoberturaList = form.planCobertura.map(planCobertura => {
      return { mimPlanCobertura: { codigo: planCobertura.codigo } };
    });
    this.promocion.mimPromocionCondicionList = this.crearPromocionCondicionList();

    this.backService.promocion.putPromocion(this.codigoPromocion, this.promocion).subscribe((resp: any) => {
      this.procesarCreacionActualizacion(false);
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  private validarCondicionCargue(promocion:any): boolean{
    let condicion = promocion.mimPromocionCondicionList.find((item:any) => item.mimTipoPromocion.codigo === GENERALES.TIPO_PROMOCION.ASEGURADOS_APTOS);
    if(condicion){
      return true;
    }
    return false;
  }

  private crearPromocionCargue(promocion:any){
    let archivoCarga: File = this.archivoAseguradosAptos._files[0];

    this.formData = new FormData();
    this.formData.append('file', archivoCarga);
    this.formData.append('delimiter', ',');
    this.formData.append('quote', '"');
    this.formData.append('isQuoted', 'true');

    this.backService.downloadFile.postConvertDocument(this.formData).subscribe( (item:any) =>{
      const blob: any = new Blob([item.body], { type: 'application/octet-stream' });
      this.formData = new FormData();
      const csvFileName = archivoCarga.name.replace('.xlsx', '.csv');
      this.formData.append('file', <File>blob, csvFileName);
      this.formData.append('mimPromocionDto', JSON.stringify(promocion));

      this.backService.promocion.postPromocionArchivo(this.formData).subscribe((resp: any) => {
        this.procesarCreacionActualizacion(false, resp.message);
      }, err => {
        this.frontService.alert.error(err.error.message);
      });

    }, (err) => {
      if (err.status === 400) {
        this.translate.get('administracion.cargueMasivo.alertas.estrucutraNoCumple').subscribe((text: string) => {
          this.frontService.alert.error(text);
        });
      } else {
        this.frontService.alert.error(err.error.message);
      }
    });
  }

  private procesarCreacionActualizacion(blnOperacion: boolean, mensaje?: string) {
    if (mensaje) {
      this.frontService.alert.success(mensaje).then(() => {
        this.finalizarOperacion();
      });
    } else {
      this.translate.get(blnOperacion ? 'global.guardadoExitosoMensaje' : 'global.actualizacionExitosaMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.finalizarOperacion();
        });
      });
    }
  }

  private finalizarOperacion() {
    this.form.reset();
    this.initForm();
    // Redireccionamos a la pantalla de listar.
    this.irListar();
  }

  irListar() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINISTRACION_GESTION_PROMOCIONES,
      UrlRoute.ADMINISTRACION_GESTION_PROMOCIONES_PROMOCIONES]);
  }

  onDeleteRow(index: number, codigo: any, nombre: any) {
    this.arrayCondiciones.removeAt(index);
    this.bloquearBotonCondicion = false;

    if (!this.arrayCondiciones || this.arrayCondiciones.length === 0) {
      this.condiciones = this.condicionesOriginales;
    } else {
      if (codigo !== null && nombre !== null) {
        this.condiciones.push({ codigo: codigo, nombre: nombre});
      }
    }
  }

  addNewRow(): void {
    if (this.arrayCondiciones.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }
    this.arrayCondiciones.push(this.crearFilaCondicion());

    if (this.condiciones.length === 1) {
      this.bloquearBotonCondicion = true;
    }
  }

  getControls(index: number) {
    return this.arrayCondiciones.controls[index]['controls'];
  }

  onFileSelect(pFileUpload: FileUpload,index:number) {
    if (pFileUpload.files && pFileUpload.files.length > 0) {
      this.archivoAseguradosAptos = pFileUpload;
    }
    this.getControls(index).archivoAseguradoAptos.setValue(this.archivoAseguradosAptos._files[0]);
  }

  getSizeInMegaBytes(size: number) {
    // Los MB se tratan en Binario no en decimal
    return size ? size / 1048576 : 0;
  }

  removeFile(event, file: File, pFileUpload: FileUpload) {
    const index = pFileUpload.files.indexOf(file);
    pFileUpload.remove(event, index);
    this.archivoAseguradosAptos = null;
  }

  downloadFile() {
    const nombreDocumento = 'Cargue_asegurados_aptos.xlsx';
    this.backService.downloadFile.descargarDocumentoFTP(nombreDocumento).subscribe(item => {
      const blob = new Blob([item.body], { type: 'application/octet-stream' });
      FileSaver.saveAs(blob, nombreDocumento);
    }, async (err) => {
      const message = JSON.parse(await err.error.text()).message;
      this.frontService.alert.warning(message);
    });
  }
}
