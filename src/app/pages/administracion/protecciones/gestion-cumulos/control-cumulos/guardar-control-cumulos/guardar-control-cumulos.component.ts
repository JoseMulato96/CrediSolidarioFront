import { Component, OnInit, OnDestroy } from '@angular/core';
import { CustomValidators, FormValidate } from '@shared/util';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, Subscription, Observable } from 'rxjs';
import { DateUtil } from '@shared/util/date.util';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormComponent } from '@core/guards';
import { masksPatterns } from '@shared/util/masks.util';
import { minMaxValidator } from '@shared/directives/min-max-validator.directive';
import { GENERALES } from '@shared/static/constantes/constantes';
import { BackFacadeService, FrontFacadeService } from '@core/services';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';

@Component({
  selector: 'app-guardar-control-cumulos',
  templateUrl: './guardar-control-cumulos.component.html',
})
export class GuardarControlCumulosComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  form: FormGroup;
  subscription: Subscription = new Subscription();
  isForm: Promise<any>;
  codigoControlCumulo: any;
  _esCreacion = true;
  controlCumulo: any;
  tipoTopes: any[];
  fondos: any[];
  cumulos: any[];
  vigenciasPlan: any[];
  categoriasAsociados: any[];
  unidades: any[];
  nivelesRiesgo: any[];
  tipoReconocidos: any[];
  patterns = masksPatterns;
  estadoFecha: boolean;
  vigenciaFechasAMantenerSeleccionadas: Date[];
  signoPesoPorcentaje: boolean = false;


  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) { super(); }

  ngOnInit() {
    this.subscription = this.activatedRoute.params.subscribe((params: any) => {
      this.codigoControlCumulo = params['codigo'];
      // Nos aseguramos de cargar los parametros antes de inicializar el formulario.
      forkJoin([
        this.backService.tipoTope.getTiposTopes({ estado: true, sort: 'nombre,asc', isPaged: true, size: 1000000 }),
        this.backService.fondo.getFondos({ estado: true, sort: 'nombre,asc', isPaged: true, size: 1000000 }),
        this.backService.cumulo.getCumulos({ estado: true, sort: 'nombre,asc', isPaged: true, size: 1000000 }),
        this.backService.categoriasAsociado.getCategoriasAsociado({ estado: true, esPaginable: false, sort: 'nombre,asc', isPaged: true, size: 1000000 }),
        this.backService.nivelRiesgo.getNivelesRiesgos({ estado: true }),
        this.backService.tipoReconocido.getTipoReconocidos({
          estado: true,
          isPaged: true,
          sort: 'nombre,asc',
          size: 1000000 ,
          codigo : [MIM_PARAMETROS.MIM_TIPO_RECONOCIDO.COP, MIM_PARAMETROS.MIM_TIPO_RECONOCIDO.PORCENTAJE]
        })
      ]).subscribe(([
        _tipoTopes,
        _fondos,
        _cumulos,
        _categoriasAsociado,
        _nivelesRiesgo,
        _unidades
      ]) => {
        this.tipoTopes = _tipoTopes._embedded.mimTipoTope;
        this.fondos = _fondos.content;
        this.cumulos = _cumulos.content;
        this.categoriasAsociados = _categoriasAsociado.content;
        this.nivelesRiesgo = _nivelesRiesgo._embedded.mimNivelRiesgo;
        this.unidades = _unidades._embedded.mimTipoReconocido;
        if (this.codigoControlCumulo) {
          this.backService.controlCumulo.getControlCumulo(this.codigoControlCumulo).
            subscribe((resp: any) => {
              this.controlCumulo = resp;
              this._setRowInactivo(resp);
              this._esCreacion = false;
              this._initForm(this.controlCumulo);
            }, (err) => {
              this.frontService.alert.warning(err.error.message);
            });
        } else {
          this._esCreacion = true;
          this._initForm();
        }
      }, (err: any) => {
        this.frontService.alert.warning(err.error.message);
      });
    });
  }

  _setRowInactivo(row: any) {
    if (!this.tipoTopeSelected(row.mimTipoTope.codigo)) {
      this.tipoTopes.push(row.mimTipoTope);
    }

    if (!this.cumuloSelected(row.mimCumulo.codigo)) {
      this.cumulos.push(row.mimCumulo);
    }

    if (row.sipCategoriaAsociado && !this.categoriaAsociadoSelected(row.sipCategoriaAsociado.codigo)) {
      this.categoriasAsociados.push(row.sipCategoriaAsociado);
    }

    if (row.mimNivelRiesgo && !this.nivelRiesgoSelected(row.mimNivelRiesgo.codigo)) {
      this.nivelesRiesgo.push(row.mimNivelRiesgo);
    }
  }

  /**
   * @author: Edwar Ferney Murillo
   * @description: Inicializa el formulario
   */
  _initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        codigoControlCumulo: new FormControl(param ? param.codigo : null),
        fondo: new FormControl(param ? this.fondosSelected(param.mimFondo.codigo) : null, [Validators.required]),
        tipoTope: new FormControl(param ? this.tipoTopeSelected(param.mimTipoTope.codigo) : null, [Validators.required]),
        nombreCumulo: new FormControl(param ? this.cumuloSelected(param.mimCumulo.codigo) : null, [Validators.required]),
        categoriaAsociado: new FormControl(param ? param.sipCategoriaAsociado ? this.categoriaAsociadoSelected(param.sipCategoriaAsociado.codigo) : null : null),
        nivelRiesgo: new FormControl(param ? param.mimNivelRiesgo ? this.nivelRiesgoSelected(param.mimNivelRiesgo.codigo) : null : null),
        unidad : new FormControl(param ? this.unidadSelected(param) :  null, [Validators.required]),
        valorMinimoTope: new FormControl(param ? param.valorMinimoProteccion : null, [Validators.min(0), CustomValidators.maxNumberText(15), Validators.required]),
        valorMaximoTope: new FormControl(param ? param.valorMaximoProteccion : null, [Validators.min(1), CustomValidators.maxNumberText(15), Validators.required]),
        ingresosMinimos: new FormControl(param ? param.ingresoMinimoAsociado : null, [Validators.min(1) , CustomValidators.maxNumberText(15)]),
        ingresosMaximos: new FormControl(param ? param.ingresoMaximoAsociado : null, [Validators.min(1), CustomValidators.maxNumberText(15)]),
        edadMinima: new FormControl(param ? param.edadMinimaIngreso : null, [Validators.required, Validators.min(18), Validators.max(100)]),
        edadMaxima: new FormControl(param ? param.edadMaximaIngreso : null, [Validators.required, Validators.min(18), Validators.max(100)]),
        fechaInicioFechaFin: new FormControl(param ? this.rangoFechaSelected(param.fechaInicioVigencia, param.fechaFinVigencia) : null, [Validators.required])
      }, {
        validators: [
          minMaxValidator('edadMinima', 'edadMaxima'),
          minMaxValidator('valorMinimoTope', 'valorMaximoTope'),
          minMaxValidator('ingresosMinimos', 'ingresosMaximos')
          ]

      }));

      this.vigenciaFechasAMantenerSeleccionadas = undefined;
    if (!this._esCreacion) {
      this.vigenciaFechasAMantenerSeleccionadas = [DateUtil.stringToDate(param ? param.fechaInicioVigencia : null)];
      this.form.controls.tipoTope.disable();
      this.form.controls.fondo.disable();
      this.form.controls.nombreCumulo.disable();
      this.form.controls.codigoControlCumulo.disable();
      this.estadoFecha = param && !param.estado;
      if (param && !param.estado) {
        this.form.disable();
        this.form.controls.vigente.enable();
      }
    }
    this.controlCambioValorTopeRequeridos();
    this.changeUnidad();
  }

  controlCambioValorTopeRequeridos() {
    this.form.controls.tipoTope.valueChanges.subscribe(resp => {
      if (resp?.codigo === GENERALES.MIM_TIPO_TOPE.PROTECCION) {
        this.form.controls.categoriaAsociado.setErrors({ required: true });
        this.form.controls.nivelRiesgo.setErrors({ required: true });
      } else {
        this.form.controls.categoriaAsociado.setErrors(null);
        this.form.controls.nivelRiesgo.setErrors(null);
      }
    });
  }

  changeUnidad(){
    this.form.controls.unidad.valueChanges.subscribe((unidad:any) => {
      if(unidad.codigo === MIM_PARAMETROS.MIM_TIPO_RECONOCIDO.COP){
        this.signoPesoPorcentaje = false;
      }else{
        this.signoPesoPorcentaje = true;
      }
    });
  }

  /**
   * @author: Edwar Ferney Murillo
   * @description: De acuerdo a la acción disparada ejecuta el proceso de
   * crear o actualizar un control de cumulo
   */
  _alGuardar() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((validateForm: string) => {
        this.frontService.alert.warning(validateForm);
      });
      return;
    }
    if (this._esCreacion) {
      this._crearControlCumulo();
    } else {
      this._actualizarControlCumulo();
    }
  }

  /**
   * @author: Edwar Ferney Murillo
   * @description: Crear un nuevo control de cumulo
   */
  _crearControlCumulo() {
    const form: any = this.form.value;
    const fechaInicio = DateUtil.dateToString(form.fechaInicioFechaFin[0], 'dd-MM-yyyy');
    const fechaFin = DateUtil.dateToString(form.fechaInicioFechaFin[1], 'dd-MM-yyyy');
    const param = {
      mimCumulo: { codigo: form.nombreCumulo.codigo },
      edadMinimaIngreso: form.edadMinima,
      edadMaximaIngreso: form.edadMaxima,
      valorMinimoProteccion: form.valorMinimoTope,
      valorMaximoProteccion: form.valorMaximoTope,
      ingresoMinimoAsociado: form.ingresosMinimos,
      ingresoMaximoAsociado: form.ingresosMaximos,
      fechaInicioVigencia: fechaInicio,
      fechaFinVigencia: fechaFin,
      mimTipoTope: { codigo: form.tipoTope.codigo },
      mimFondo:form.fondo,
      estado: true,
      mimTipoReconocido: form.unidad
    };

    if (form.categoriaAsociado && form.categoriaAsociado.codigo) {
      param['sipCategoriaAsociado'] = { codigo: form.categoriaAsociado.codigo };
    }

    if (form.nivelRiesgo && form.nivelRiesgo.codigo) {
      param['mimNivelRiesgo'] = { codigo: form.nivelRiesgo.codigo };
    }
    this.backService.controlCumulo.postControlCumulos(param).subscribe((resp: any) => {
      this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.form.reset();
          this._initForm();
          // Redireccionamos a la pantalla de listar.
          this._irListaListar();
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  /**
   * @author: Edwar Ferney Murillo
   * @description: Actualiza un control de cumulo ya existente
   */
  _actualizarControlCumulo() {
    const form: any = this.form.getRawValue();
    const fechaInicio = DateUtil.dateToString(form.fechaInicioFechaFin[0], 'dd-MM-yyyy');
    const fechaFin = DateUtil.dateToString(form.fechaInicioFechaFin[1], 'dd-MM-yyyy');

    const param = {
      codigo: this.codigoControlCumulo,
      mimCumulo: { codigo: form.nombreCumulo.codigo },
      edadMinimaIngreso: form.edadMinima,
      edadMaximaIngreso: form.edadMaxima,
      valorMinimoProteccion: form.valorMinimoTope,
      valorMaximoProteccion: form.valorMaximoTope,
      ingresoMinimoAsociado: form.ingresosMinimos,
      ingresoMaximoAsociado: form.ingresosMaximos,
      fechaInicioVigencia: fechaInicio,
      fechaFinVigencia: fechaFin,
      mimTipoTope: { codigo: form.tipoTope.codigo },
      mimFondo:form.fondo,
      estado: this.controlCumulo.estado
    };

    if (form.categoriaAsociado && form.categoriaAsociado.codigo) {
      param['sipCategoriaAsociado'] = { codigo: form.categoriaAsociado.codigo };
    }

    if (form.nivelRiesgo && form.nivelRiesgo.codigo) {
      param['mimNivelRiesgo'] = { codigo: form.nivelRiesgo.codigo };
    }
    this.backService.controlCumulo.putControlCumulos(this.codigoControlCumulo, param).subscribe((resp: any) => {
      this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.form.reset();
          this._initForm();
          // Redireccionamos a la pantalla de listar.
          this._irListaListar();
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * @author: Edwar Ferney Murillo
   * @description: Redirecciona a la pantalla listar control de cumulos
   */
  _irListaListar() {
    this.router.navigate([UrlRoute.PAGES, UrlRoute.ADMINISTRACION,
    UrlRoute.ADMINSTRACION_PROTECCIONES,
    UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_CUMULOS,
    UrlRoute.ADMINISTRACION_PROTECCIONES_CONTROL_CUMULOS]);
  }


  fondosSelected(codigo: string) {
    return this.fondos.find(fondo => fondo.codigo === codigo);
  }

  tipoTopeSelected(codigo: string) {
    return this.tipoTopes.find(tipoTope => tipoTope.codigo === codigo);
  }

  cumuloSelected(codigo: string) {
    return this.cumulos.find(cumulo => cumulo.codigo === codigo);
  }

  categoriaAsociadoSelected(codigo: string) {
    return this.categoriasAsociados.find(categoriasAsociado => categoriasAsociado.codigo === codigo);
  }

  nivelRiesgoSelected(codigo: string) {
    return this.nivelesRiesgo.find(nivelRiesgo => nivelRiesgo.codigo === codigo);
  }

  unidadSelected(param: any) {
    if (param.mimTipoReconocido) {
      return this.unidades.find( unidad => unidad.codigo === param.mimTipoReconocido.codigo);
    } else {
      return null;
    }
  }

  rangoFechaSelected(fechaIni: any, fechaFin: any) {
    return [DateUtil.stringToDate(fechaIni), DateUtil.stringToDate(fechaFin)];
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }
}
