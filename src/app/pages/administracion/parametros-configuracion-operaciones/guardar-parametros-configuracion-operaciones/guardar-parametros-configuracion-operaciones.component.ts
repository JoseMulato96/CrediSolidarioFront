import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormComponent } from '@core/guards';
import { BackFacadeService, FrontFacadeService } from '@core/services';
import { AppState } from '@core/store/reducers';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { minMaxValidator } from '@shared/directives/min-max-validator.directive';
import { GENERALES } from '@shared/static/constantes/constantes';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { UrlRoute } from '@shared/static/urls/url-route';
import { CustomValidators, FormValidate } from '@shared/util';
import { DateUtil } from '@shared/util/date.util';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { ListaParametrosGeolocalizacionConfig } from './lista-parametros-geolocalizacion.config';

@Component({
  selector: 'app-guardar-parametros-configuracion-operaciones',
  templateUrl: './guardar-parametros-configuracion-operaciones.component.html',
})
export class GuardarParametrosConfiguracionOperacionesComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  configuracion: ListaParametrosGeolocalizacionConfig = new ListaParametrosGeolocalizacionConfig();

  form: FormGroup;
  formGeolocalizacion: FormGroup;
  isForm: Promise<any>;
  isFormGeolocalizacion: Promise<any>;

  coberturas: any;
  planes: any[] = [];
  tiposMovimientos: any[] = [];
  nivelesRiesgos: any[];
  ciclosFacturacion: any[];
  subs: Subscription[] = [];
  tipoConfiguracion: boolean;
  dataConfiguracionOperaciones: any;

  dataInit: any;
  datosForm: any;
  mostrarGuardar: boolean;
  esCreacion: boolean;
  tipoTipoGelocalizacion: any[];
  dataInitGeolocalizacion: any;
  tipoMovimiento: any;
  codigoParametrosConfiguracionOperaciones: string;
  ubicaciones: any;
  esCrearCantidadCaso: boolean;
  notNational: boolean;
  idDetalleGeolocalizacion: any;
  creacionGeneral: any;

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store<AppState>,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService) {
    super();
    this.tipoConfiguracion = false;
    this.ubicaciones = [];
    this.esCrearCantidadCaso = true;
    this.notNational = false;
    this.esCreacion = false;
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.isPristine(this.form.controls.formEspecifica as FormGroup) && this.form.controls.formEspecifica && this.form.controls.formEspecifica.dirty) {
      return true;
    }

    if (!this.isPristine(this.form.controls.formGeneral as FormGroup) && this.form.controls.formGeneral && this.form.controls.formGeneral.dirty) {
      return true;
    }
    return false;
  }

  hasChangesGeolocalizacion(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.formGeolocalizacion) && this.formGeolocalizacion && this.formGeolocalizacion.dirty;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      if (params.id) {
        this.codigoParametrosConfiguracionOperaciones = params.id;
      } else {
        this.creacionGeneral = true;
      }
    });
    this.getDataSelect();
    this.initForm();
  }

  onAtras() {
    if (this.hasChanges()) {
      this.frontService.alert.confirm(this.translate.instant('global.onDeactivate')).then((respuesta: boolean) => {
        if (respuesta) {
          this.router.navigate([
            UrlRoute.PAGES,
            UrlRoute.ADMINISTRACION,
            UrlRoute.PARAMETROS_CONFIGURACION_OPERACIONES
          ]);
        }
      });
    } else {
      this.router.navigate([
        UrlRoute.PAGES,
        UrlRoute.ADMINISTRACION,
        UrlRoute.PARAMETROS_CONFIGURACION_OPERACIONES
      ]);
    }
  }

  private initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        tipoConfiguracion: [param ? String(param.tipoConfiguracion) : GENERALES.TIPO_CONFIGURACION.ESPECIFICA],
        formEspecifica: this.formBuilder.group({
          plan: [param && param.tipoConfiguracion === +GENERALES.TIPO_CONFIGURACION.ESPECIFICA ? this.obtenerPlanes(param.mimPlan.codigo) : null, [Validators.required]],
          cobertura: [param && param.tipoConfiguracion === +GENERALES.TIPO_CONFIGURACION.ESPECIFICA ? this.obtenerCoberturas(param.mimCobertura.codigo) : null, [Validators.required]],
          tipoMovimiento: [param ? this.obtenerTipoMovimientos(param.mimTipoMovimiento.codigo) : null, [Validators.required]],
          nivelesRiesgos: [param && param.mimNivelRiesgoConfigMovList ? this.obtenerNivelesRiesgo(param.mimNivelRiesgoConfigMovList) : null],
          valorMinimoProteccion: [param && param.tipoConfiguracion === +GENERALES.TIPO_CONFIGURACION.ESPECIFICA ? param.valorMinimoProteccion : null,
          [Validators.required, Validators.maxLength(10), CustomValidators.minNumberText(1)]],
          valorMaximoProteccion: [param && param.tipoConfiguracion === +GENERALES.TIPO_CONFIGURACION.ESPECIFICA ? param.valorMaximoProteccion : null,
          [Validators.required, Validators.maxLength(10), CustomValidators.minNumberText(1)]],
          rangoMinimoEdad: [param ? param.rangoEdadMinima : null, [Validators.max(100), Validators.min(0)]],
          rangoMaximoEdad: [param ? param.rangoEdadMaxima : null, [Validators.max(100), Validators.min(0)]],
          cicloFacturacion: [param && param.mimCicloFacturacionConfigMovList ? this.obtenerCiclosFacturacion(param.mimCicloFacturacionConfigMovList) : null]
        }, {
          validators: [
            minMaxValidator('valorMinimoProteccion', 'valorMaximoProteccion'),
            minMaxValidator('rangoMinimoEdad', 'rangoMaximoEdad'),
          ]
        }),
        formGeneral: this.formBuilder.group({
          tipoMovimiento: [param ? this.obtenerTipoMovimientos(param.mimTipoMovimiento.codigo) : null],
          nivelesRiesgos: [param && param.mimNivelRiesgoConfigMovList ? this.obtenerNivelesRiesgo(param.mimNivelRiesgoConfigMovList) : null],
          rangoMinimoEdad: [param ? param.rangoEdadMinima : null],
          rangoMaximoEdad: [param ? param.rangoEdadMaxima : null],
          cicloFacturacion: [param && param.mimCicloFacturacionConfigMovList ? this.obtenerCiclosFacturacion(param.mimCicloFacturacionConfigMovList) : null]
        })
      })
    );

    this.initFormGeolocalizacion();

    this.loadDataCoberturasEspecifica();
    this.changeTipoConfiguracion();

    if (param) {
      this.form.controls.tipoConfiguracion.setValue(String(param.tipoConfiguracion));
      this.form.controls.tipoConfiguracion.disable();
      this.formGeolocalizacion.controls.geolocalizacion['controls'].geolocalizacion.setValue(this.getTipoGelocalizacion());
      this.formGeolocalizacion.controls.geolocalizacion['controls'].geolocalizacion.disable();
    }
  }

  private initFormGeolocalizacion(param?: any) {
    this.isFormGeolocalizacion = Promise.resolve(
      this.formGeolocalizacion = this.formBuilder.group({
        geolocalizacion: this.formBuilder.group({
          geolocalizacion: [param ? this.getTipoGelocalizacion() : null, [Validators.required]],
          ubicacion: [param ? this.getUbicacion(param.ubicacion) : null, [Validators.required]],
          tipoCantidadCasos: [param && param.mimTipoCantidadCasosMov ? this.getTipoCantidadCasos(param.mimTipoCantidadCasosMov.codigo) : null],
          valorCantidadCasos: [param ? param.valorCantidadCasos : null],
          horaCorte: [param ? param.horarioCorte : null]
        })
      })
    );
    const form = this.formGeolocalizacion.controls.geolocalizacion['controls'];
    if (this.dataConfiguracionOperaciones && this.dataConfiguracionOperaciones.mimConfiguracionMovDetalleList.length > 1) {
      form.geolocalizacion.disable();
    } else {
      form.geolocalizacion.enable();
    }

    if (this.dataConfiguracionOperaciones && this.dataConfiguracionOperaciones.mimTipoGeolocalizacion.codigo === GENERALES.GEOLOCALIZACIONES.NACIONAL) {
      form.ubicacion.disable();
      form.ubicacion.setValue(null);
    }
    if (param && param.mimTipoCantidadCasosMov) {
      form.tipoCantidadCasos.disable();
    } else {
      form.tipoCantidadCasos.enable();
    }

    if (param && param.mimTipoCantidadCasosMov && param.mimTipoCantidadCasosMov.codigo === GENERALES.TIPO_CANTIDAD_CASOS.PORCENTAJE) {
      this.dataInitGeolocalizacion = {
        ...this.dataInitGeolocalizacion,
        showInput: true
      };
    }

    this.getDataUbicaciones();
  }

  private changeTipoConfiguracion() {
    this.form.controls.tipoConfiguracion.valueChanges.subscribe(item => {
      this.mostrarGuardar = false;
      this.validacionesDinamicas(item);
    });
    this.form.controls.formEspecifica['controls'].valorMinimoProteccion.valueChanges.subscribe(item => {
      if (+item <= 0) {
        this.form.controls.formEspecifica['controls'].valorMinimoProteccion.setValue(null, { emitEvent: false });
      }
    });

    this.form.controls.formEspecifica['controls'].valorMaximoProteccion.valueChanges.subscribe(item => {
      if (+item <= 0) {
        this.form.controls.formEspecifica['controls'].valorMaximoProteccion.setValue(null, { emitEvent: false });
      }
    });
  }

  private validacionesDinamicas(item: any) {
    const _formEspecifica = this.form.controls.formEspecifica['controls'];
    const _formGeneral = this.form.controls.formGeneral['controls'];
    switch (item) {
      case GENERALES.TIPO_CONFIGURACION.GENERAL:
        this.tipoConfiguracion = true;
        this.form.controls.formEspecifica.reset();


        _formEspecifica.plan.setValidators(null);
        _formEspecifica.plan.updateValueAndValidity();

        _formEspecifica.cobertura.setValidators(null);
        _formEspecifica.cobertura.updateValueAndValidity();

        _formEspecifica.tipoMovimiento.setValidators(null);
        _formEspecifica.tipoMovimiento.updateValueAndValidity();

        _formEspecifica.valorMinimoProteccion.setValidators(null);
        _formEspecifica.valorMinimoProteccion.updateValueAndValidity();

        _formEspecifica.valorMaximoProteccion.setValidators(null);
        _formEspecifica.valorMaximoProteccion.updateValueAndValidity();

        _formGeneral.tipoMovimiento.setValidators([Validators.required]);
        _formGeneral.rangoMinimoEdad.setValidators([Validators.required]);
        _formGeneral.rangoMaximoEdad.setValidators([Validators.required]);

        break;
      case GENERALES.TIPO_CONFIGURACION.ESPECIFICA:
        this.tipoConfiguracion = false;
        this.form.controls.formGeneral.reset();

        _formGeneral.tipoMovimiento.setValidators(null);
        _formGeneral.tipoMovimiento.updateValueAndValidity();

        _formGeneral.rangoMinimoEdad.setValidators(null);
        _formGeneral.rangoMinimoEdad.updateValueAndValidity();

        _formGeneral.rangoMaximoEdad.setValidators(null);
        _formGeneral.rangoMaximoEdad.updateValueAndValidity();

        _formEspecifica.plan.setValidators([Validators.required]);
        _formEspecifica.cobertura.setValidators([Validators.required]);
        _formEspecifica.tipoMovimiento.setValidators([Validators.required]);
        _formEspecifica.valorMinimoProteccion.setValidators([Validators.required]);
        _formEspecifica.valorMaximoProteccion.setValidators([Validators.required]);
        break;
      default:
        return;
    }
  }

  private getDataSelect() {
    forkJoin({
      _planes: this.backService.planes.getPlanes({ estado: true }),
      _tipoMovimientos: this.backService.tiposMovimientos.getTiposMovimientos({
        estado: true,
        codigo: [GENERALES.TIPO_MOVIMIENTO.INCREMENTAR]
      }),
      _nivelesRiesgos: this.backService.nivelRiesgo.getNivelesRiesgos({ estado: true }),
      _ciclos_Facturacion: this.backService.parametroConfiguracionOperaciones.getCiclosFacturacion(),
      tiposGeolocalizacion: this.backService.parametroConfiguracionOperaciones.getTipoGeolocalizacion(),
      tipoMovimiento: this.backService.parametroConfiguracionOperaciones.getTipoMovimiento()
    }).subscribe(resp => {
      this.planes = resp._planes.content;
      this.tiposMovimientos = resp._tipoMovimientos._embedded.mimTipoMovimiento;
      this.nivelesRiesgos = resp._nivelesRiesgos._embedded.mimNivelRiesgo;
      this.ciclosFacturacion = resp._ciclos_Facturacion._embedded.mimCicloFacturacion;

      this.tipoTipoGelocalizacion = resp.tiposGeolocalizacion._embedded.mimTipoGeolocalizacion;
      this.tipoMovimiento = resp.tipoMovimiento._embedded.mimTipoCantidadCasosMov;
      this.dataInitGeolocalizacion = {
        tipoTipoGelocalizacion: this.tipoTipoGelocalizacion,
        tipoMovimiento: this.tipoMovimiento
      };

      this.dataInit = {
        planes: this.planes,
        tiposMovimientos: this.tiposMovimientos,
        nivelesRiesgos: this.nivelesRiesgos,
        ciclosFacturacion: this.ciclosFacturacion
      };
      this.loadDataEdit();
    });
  }

  private getDataModule(pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = 'true') {

    this.subs.push(this.activatedRoute.params.subscribe((params: any) => {
      if (params.id) {
        this.codigoParametrosConfiguracionOperaciones = params.id;
        this.backService.parametroConfiguracionOperaciones.getParametrosConfiguracionOperaciones(
          {
            page: pagina,
            size: tamanio,
            isPaged: true,
            sort: sort,
            estado: estado,
            codigo: this.codigoParametrosConfiguracionOperaciones
          }).subscribe(resp => {
            this.dataConfiguracionOperaciones = resp.content.length > 0 ? resp.content[0] : null;
            this.llenarFormularios(this.dataConfiguracionOperaciones);
          });
      }
    }));
  }

  private loadDataEdit() {
    this.subs.push(this.store.select('parametrosConfiguracionUI')
      .subscribe(async ui => {
        if (!ui || !ui.dataConfiguracionOperaciones || !ui.dataConfiguracionOperaciones.dataConfiguracionOperaciones) {
          this.getDataModule();
          return;
        }
        this.llenarFormularios(ui.dataConfiguracionOperaciones.dataConfiguracionOperaciones);
      }));
  }

  private async llenarFormularios(objecto: any) {
    this.creacionGeneral = false;
    this.dataConfiguracionOperaciones = objecto;
    if (this.dataConfiguracionOperaciones.tipoConfiguracion === +GENERALES.TIPO_CONFIGURACION.ESPECIFICA) {
      this.coberturas = await this.getCoberturasPlan(this.dataConfiguracionOperaciones.mimPlan.codigo);
      this.dataInit = {
        ...this.dataInit,
        coberturas: this.coberturas
      };
    }
    this.notNational = this.dataConfiguracionOperaciones.mimTipoGeolocalizacion &&
      this.dataConfiguracionOperaciones.mimTipoGeolocalizacion.codigo === GENERALES.GEOLOCALIZACIONES.NACIONAL ? true : false;
    this.ubicaciones = this.dataConfiguracionOperaciones.mimTipoGeolocalizacion.codTab ? await this.getUbicaciones(this.dataConfiguracionOperaciones.mimTipoGeolocalizacion.codTab) : [];
    this.initForm(this.dataConfiguracionOperaciones);
    this.setDatosTabla();
    this.disabledInputs();
  }

  private disabledInputs() {
    let form;
    if (!this.tipoConfiguracion) {
      form = this.form.controls.formEspecifica['controls'];
      form.plan.disable();
      form.cobertura.disable();
    } else {
      form = this.form.controls.formGeneral['controls'];
    }
    form.tipoMovimiento.disable();
  }

  private async getCoberturasPlan(codigoPlan: any) {
    const restp: any = await this.backService.planCobertura.getPlanesCoberturas({
      'mimEstadoPlanCobertura.codigo': MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.ACTIVO,
      'mimPlan.codigo': codigoPlan
    }).toPromise();
    return restp.content;
  }

  private loadDataCoberturasEspecifica() {
    const formEspecifica = this.form.controls.formEspecifica['controls'];
    formEspecifica.plan.valueChanges.subscribe(resp => {
      if (!resp) {
        return;
      }
      this.backService.planCobertura.getPlanesCoberturas({
        'mimEstadoPlanCobertura.codigo': MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.ACTIVO,
        'mimPlan.codigo': resp.codigo
      }).subscribe(resCober => {
        this.dataInit = {
          ...this.dataInit,
          coberturas: resCober.content
        };
      });
    });
  }

  private obtenerPlanes(codigo: any) {
    return this.planes ? this.planes.find(resp => resp.codigo === codigo) : null;
  }

  private obtenerCoberturas(codigo: any) {
    return this.coberturas ? this.coberturas.find(resp => resp.mimCobertura.codigo === codigo) : null;
  }

  private obtenerTipoMovimientos(codigo: any) {
    return this.tiposMovimientos ? this.tiposMovimientos.find(resp => resp.codigo === codigo) : null;
  }

  private obtenerNivelesRiesgo(items: any[]) {
    return this.nivelesRiesgos.filter(x => items.find(item =>
      item.mimNivelRiesgo.codigo === x.codigo));
  }

  private obtenerCiclosFacturacion(items: any[]) {
    return this.ciclosFacturacion.filter(x => items.find(item =>
      item.mimCicloFacturacion.codigo === x.codigo));
  }

  guardarGeolocalizacion() {
    if (this.formGeolocalizacion.controls.geolocalizacion.invalid) {
      this.validateForm(this.formGeolocalizacion.controls.geolocalizacion as FormGroup);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return false;
    }
    const form = this.formGeolocalizacion.getRawValue();

    const codigoUbicacion = form.geolocalizacion.ubicacion ? form.geolocalizacion.ubicacion.codInt : null;

    if (this.dataConfiguracionOperaciones) {
      const ubicacionRepetida = this.dataConfiguracionOperaciones.mimConfiguracionMovDetalleList.filter(x => +x.ubicacion === codigoUbicacion);

      if (ubicacionRepetida.length > 0) {
        this.translate.get('administracion.configuracionOperaciones.alertas.ubicacionRepetida').subscribe((text: string) => {
          this.frontService.alert.warning(text);
        });
        return;
      }
    }

    const param = {
      valorCantidadCasos: form.geolocalizacion.valorCantidadCasos,
      ubicacion: codigoUbicacion,
      mimTipoCantidadCasosMov: form.geolocalizacion.tipoCantidadCasos,
      horarioCorte: typeof form.geolocalizacion.horaCorte === 'string' ? form.geolocalizacion.horaCorte : DateUtil.hourString(form.geolocalizacion.horaCorte)
    };

    if (this.esCreacion) {
      if (this.dataConfiguracionOperaciones) {
        this.dataConfiguracionOperaciones.mimConfiguracionMovDetalleList.push(param);
      } else {
        this.dataConfiguracionOperaciones = { mimConfiguracionMovDetalleList: [param] };
      }
    } else {
      this.dataConfiguracionOperaciones.mimConfiguracionMovDetalleList.map(resp => {
        if (resp.codigo === this.idDetalleGeolocalizacion) {
          resp.valorCantidadCasos = form.geolocalizacion.valorCantidadCasos;
          resp.ubicacion = codigoUbicacion;
          resp.mimTipoCantidadCasosMov = form.geolocalizacion.tipoCantidadCasos;
          resp.horarioCorte = typeof form.geolocalizacion.horaCorte === 'string' ? form.geolocalizacion.horaCorte : DateUtil.hourString(form.geolocalizacion.horaCorte);
        }
      });
    }
    this.guardar();
  }

  onClickCeldaElement(event) {
    if (event.col.key === 'eliminar') {
      if (this.dataConfiguracionOperaciones.mimConfiguracionMovDetalleList.length === 1) {
        this.translate.get('administracion.configuracionOperaciones.alertas.menorIgualUno').subscribe(mensaje => {
          this.frontService.alert.info(mensaje);
        });
        return;
      }
      this.frontService.alert.confirm(this.translate.instant('administracion.configuracionOperaciones.alertas.deseaEliminar')).then((respuesta: boolean) => {
        if (respuesta) {
          this.backService.parametroConfiguracionOperaciones.eliminarGeolocalizacion(event.dato.codigo).subscribe(mensaje => {
            this.translate.get('global.eliminadoExitosoMensaje').subscribe(msn => {
              this.frontService.alert.success(msn).then(() => {
                this.getDataModule();
              });
            });
          });
        }
      });

    }
    if (event.col.key === 'editar') {
      this.initFormGeolocalizacion(event.dato);
      this.idDetalleGeolocalizacion = event.dato.codigo;
      this.mostrarGuardar = true;
      this.esCreacion = false;
      this.esCrearCantidadCaso = false;
    }
  }

  private getDataUbicaciones() {
    const formGelocalizacion = this.formGeolocalizacion.controls.geolocalizacion['controls'];
    formGelocalizacion.tipoCantidadCasos.valueChanges.subscribe(resp => {
      if (!resp) {
        formGelocalizacion.valorCantidadCasos.setValidators(null);
        formGelocalizacion.valorCantidadCasos.updateValueAndValidity();

        formGelocalizacion.horaCorte.setValidators(null);
        formGelocalizacion.horaCorte.updateValueAndValidity();
        return;
      }
      formGelocalizacion.valorCantidadCasos.setValidators([Validators.required]);
      formGelocalizacion.valorCantidadCasos.updateValueAndValidity();

      formGelocalizacion.horaCorte.setValidators([Validators.required]);
      formGelocalizacion.horaCorte.updateValueAndValidity();

      formGelocalizacion.valorCantidadCasos.setValue('');
      if (resp.codigo === GENERALES.TIPO_CANTIDAD_CASOS.PORCENTAJE) {
        this.dataInitGeolocalizacion = {
          ...this.dataInitGeolocalizacion,
          showInput: true
        };
      } else {
        this.dataInitGeolocalizacion = {
          ...this.dataInitGeolocalizacion,
          showInput: false
        };
      }
    });
    formGelocalizacion.geolocalizacion.valueChanges.subscribe(resp => {
      if (!resp) { return; }
      if (resp.codigo === GENERALES.GEOLOCALIZACIONES.NACIONAL) {
        formGelocalizacion.ubicacion.disable();
        formGelocalizacion.ubicacion.setValue(null);
        return;
      }
      formGelocalizacion.ubicacion.setValue(null);
      formGelocalizacion.ubicacion.enable();
      this.backService.multiactiva.getUbicaciones(resp.codTab).subscribe(respuesta => {
        this.dataInitGeolocalizacion = {
          ...this.dataInitGeolocalizacion,
          ubicaciones: respuesta
        };
        this.ubicaciones = respuesta;
      });
    });
  }

  agregarCasosPorGeolocalizacion() {
    if (this.form.invalid) {
      this.validateForm(this.form.controls.formEspecifica as FormGroup);
      this.validateForm(this.form.controls.formGeneral as FormGroup);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return false;
    }
    if (this.dataConfiguracionOperaciones && this.dataConfiguracionOperaciones.mimTipoGeolocalizacion) {
      this.formGeolocalizacion.controls.geolocalizacion['controls'].geolocalizacion.setValue(this.getTipoGelocalizacion());
      this.formGeolocalizacion.controls.geolocalizacion['controls'].geolocalizacion.disable();

    }
    this.formGeolocalizacion.controls.geolocalizacion['controls'].tipoCantidadCasos.enable();
    this.mostrarGuardar = true;
    this.esCrearCantidadCaso = false;
    this.esCreacion = true;
  }

  cerrarModal() {
    if (this.hasChangesGeolocalizacion()) {
      this.frontService.alert.confirm(this.translate.instant('global.onDeactivate')).then((respuesta: boolean) => {
        if (respuesta) {
          this.mostrarGuardar = false;
          this.formGeolocalizacion.reset({ emitEvent: false });
        }
      });
    } else {
      this.formGeolocalizacion.reset({ emitEvent: false });
      this.mostrarGuardar = false;
    }
    this.getDataModule();
  }

  ngOnDestroy(): void {
    this.subs.forEach(x => x.unsubscribe());
  }

  guardar() {
    const _form = this.form.getRawValue();
    if (this.form.invalid || !(this.dataConfiguracionOperaciones && this.dataConfiguracionOperaciones.mimConfiguracionMovDetalleList.length > 0)) {
      if (_form.tipoConfiguracion === GENERALES.TIPO_CONFIGURACION.ESPECIFICA) {
        this.validateForm(this.form.controls.formEspecifica as FormGroup);
      } else {
        this.validateForm(this.form.controls.formGeneral as FormGroup);
      }
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return false;
    }



    let tipoFormControl: any;
    if (!this.tipoConfiguracion) {
      tipoFormControl = _form.formEspecifica;
    } else {
      tipoFormControl = _form.formGeneral;
    }

    const _nivelesRiesgos = [];
    if (tipoFormControl.nivelesRiesgos && tipoFormControl.nivelesRiesgos.length > 0) {
      tipoFormControl.nivelesRiesgos.map(item => {
        _nivelesRiesgos.push({
          mimNivelRiesgoConfigMovPK: {
            codigoNivelRiesgo: item.codigo,
            codigoConfiguracionMovimiento: this.codigoParametrosConfiguracionOperaciones
          }
        });
      });
    }

    const _cicloFacturacion = [];
    if (tipoFormControl.cicloFacturacion && tipoFormControl.cicloFacturacion.length > 0) {
      tipoFormControl.cicloFacturacion.map(item => {
        _cicloFacturacion.push({
          mimCicloFacturacionConfigMovPK: {
            codigoCicloFacturacion: item.codigo,
            codigoConfiguracionMovimiento: this.codigoParametrosConfiguracionOperaciones
          }
        });
      });
    }

    const _formGeolocalizacion = this.formGeolocalizacion.getRawValue();

    this.datosForm = {
      codigo: this.codigoParametrosConfiguracionOperaciones ? this.codigoParametrosConfiguracionOperaciones : null,
      tipoConfiguracion: _form.tipoConfiguracion,
      valorMinimoProteccion: _form.formEspecifica.valorMinimoProteccion,
      valorMaximoProteccion: _form.formEspecifica.valorMaximoProteccion,
      rangoEdadMinima: tipoFormControl.rangoMinimoEdad,
      rangoEdadMaxima: tipoFormControl.rangoMaximoEdad,
      mimPlan: _form.tipoConfiguracion === GENERALES.TIPO_CONFIGURACION.ESPECIFICA ? { codigo: _form.formEspecifica.plan?.codigo } : null,
      mimCobertura: _form.tipoConfiguracion === GENERALES.TIPO_CONFIGURACION.ESPECIFICA ? { codigo: _form.formEspecifica.cobertura?.mimCobertura.codigo } : null,
      mimTipoMovimiento: { codigo: tipoFormControl.tipoMovimiento.codigo },
      mimTipoGeolocalizacion: {
        codigo: _formGeolocalizacion.geolocalizacion.geolocalizacion ?
          _formGeolocalizacion.geolocalizacion.geolocalizacion.codigo : this.dataConfiguracionOperaciones.mimTipoGeolocalizacion.codigo
      },
      mimConfiguracionMovDetalleList: this.dataConfiguracionOperaciones.mimConfiguracionMovDetalleList,
      mimNivelRiesgoConfigMovList: _nivelesRiesgos.length > 0 ? _nivelesRiesgos : null,
      mimCicloFacturacionConfigMovList: _cicloFacturacion.length > 0 ? _cicloFacturacion : null
    };

    if (this.codigoParametrosConfiguracionOperaciones) {
      this.backService.parametroConfiguracionOperaciones.editarDetalleConfiguracion(this.datosForm, this.codigoParametrosConfiguracionOperaciones).subscribe(resp => {
        const typeMessage = this.esCreacion ? 'global.guardadoExitosoMensaje' : 'global.actualizacionExitosaMensaje';
        this.translate.get(typeMessage).subscribe((mensaje: string) => {
          this.frontService.alert.success(mensaje).then(() => {
            this.dataConfiguracionOperaciones = resp;
            this.refrescarDatos();
          });
        });
      }, err => {
        this.frontService.alert.error(err.error.message);
      });
    } else {
      this.backService.parametroConfiguracionOperaciones.guardarDetalleConfiguracion(this.datosForm).subscribe(resp => {
        this.translate.get('global.guardadoExitosoMensaje').subscribe((mensaje: string) => {
          this.frontService.alert.success(mensaje).then(() => {
            this.router.navigate([
              UrlRoute.PAGES,
              UrlRoute.ADMINISTRACION,
              UrlRoute.PARAMETROS_CONFIGURACION_OPERACIONES,
              UrlRoute.GEOLOCALIZACION_PARAMETROS_CONFIGURACION_OPERACIONES,
              resp.codigo
            ]);
            this.resetForm();
          });
        });
      }, err => {
        this.frontService.alert.error(err.error.message);
      });
    }
  }

  private refrescarDatos() {
    this.notNational = this.dataConfiguracionOperaciones.mimTipoGeolocalizacion &&
      this.dataConfiguracionOperaciones.mimTipoGeolocalizacion.codigo === GENERALES.GEOLOCALIZACIONES.NACIONAL ? true : false;
    this.setDatosTabla();
    this.resetForm();
    this.esCrearCantidadCaso = true;
    this.esCreacion = false;
    this.getDataModule();
  }

  private resetForm() {
    this.formGeolocalizacion.controls.geolocalizacion.reset();
    this.mostrarGuardar = false;
  }

  private setDatosTabla() {
    this.configuracion.gridListarDetalleGeolocalizacion.component.limpiar();

    if (!this.dataConfiguracionOperaciones.mimConfiguracionMovDetalleList ||
      this.dataConfiguracionOperaciones.mimConfiguracionMovDetalleList.length === 0) {
      return;
    }

    this.dataConfiguracionOperaciones.mimConfiguracionMovDetalleList = this.dataConfiguracionOperaciones.mimConfiguracionMovDetalleList.map(item => {
      return {
        ...item,
        ubicacionDetalle: this.getUbicacion(item.ubicacion),
        nombreGeolocalizacion: this.dataConfiguracionOperaciones.mimTipoGeolocalizacion.nombre
      };
    });

    this.configuracion.gridListarDetalleGeolocalizacion.component.cargarDatos(
      this.dataConfiguracionOperaciones.mimConfiguracionMovDetalleList,
      { cantidadRegistros: this.dataConfiguracionOperaciones.mimConfiguracionMovDetalleList.length });
  }

  private async getUbicaciones(codigoGeolocalizacion: any) {
    const restp = await this.backService.multiactiva.getUbicaciones(codigoGeolocalizacion).toPromise();
    return restp;
  }

  private getUbicacion(codigoUbicacion: number) {
    return this.ubicaciones.find(item => item.codInt === +codigoUbicacion);
  }

  private getTipoCantidadCasos(codigo: number) {
    return this.tipoMovimiento.find(item => item.codigo === +codigo);
  }

  private getTipoGelocalizacion() {
    return this.tipoTipoGelocalizacion && this.dataConfiguracionOperaciones ?
      this.tipoTipoGelocalizacion.find(item => item.codigo === this.dataConfiguracionOperaciones.mimTipoGeolocalizacion.codigo) :
      null;
  }

}
