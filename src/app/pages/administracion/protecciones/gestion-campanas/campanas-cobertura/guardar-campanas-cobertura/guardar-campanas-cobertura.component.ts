import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormValidate } from '@shared/util';
import { DateUtil } from '@shared/util/date.util';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { Observable } from 'rxjs/internal/Observable';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { Subscription } from 'rxjs/internal/Subscription';
import { ListarValoresFondoConfig } from './listar-valores-fondo.config';
import { from } from 'rxjs/internal/observable/from';
import { BackFacadeService, FrontFacadeService } from '@core/services';

@Component({
  selector: 'app-guardar-campanas-cobertura',
  templateUrl: './guardar-campanas-cobertura.component.html'
})
export class GuardarCampanasCoberturaComponent extends FormValidate implements OnInit {

  form: FormGroup;

  isForm: Promise<any>;

  formValor: FormGroup;

  isFormValor: Promise<any>;

  _esCreacion = true;

  subscription: Subscription = new Subscription();

  codigoCampanaCobertura: any;

  campanaCobertura: any;

  campanas: any[];

  planesCobertura: any[];

  mostrarGuardar: boolean;

  valorFijo: any;

  estadosAsegurados: any[];

  beneficiariosCobertura: any[];

  customCurrencyMaskConfig: any;

  configuracion: ListarValoresFondoConfig = new ListarValoresFondoConfig();

  estado: boolean;

  filtrosGrid: any;

  listValorFijo: any[];

  esCreacionValor = true;

  mostrarTabla = false;

  habilitaValor = true;

  constructor(private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService) {
    super();
    this.filtrosGrid = [];
    this.listValorFijo = [];
  }

  ngOnInit(): void {
    this.estado = true;
    this.subscription = this.activatedRoute.params.subscribe((params: any) => {
      this.codigoCampanaCobertura = params['codigo'];

      forkJoin([
        this.backService.campanaEndoso.getCampanas({ estado: true, isPaged: true, sort: 'nombre,asc', 'size': 1000000 }),
        this.backService.planCobertura.getPlanesCoberturas({
          'mimEstadoPlanCobertura.codigo': [MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.ACTIVO, MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.PROCESO],
        })
      ]).subscribe(([
        _listaCampanas,
        _listPlanesCobertura
      ]) => {
        this.mostrarTabla = true;
        this.campanas = _listaCampanas.content;
        this.planesCobertura = _listPlanesCobertura.content.map((item: any) => ({ ...item, _nombre: `${item.mimPlan.nombre} - ${item.nombre}` }));
        if (this.codigoCampanaCobertura) {
          this.backService.campanaCobertura.getCampanaPlanCobertura(this.codigoCampanaCobertura).subscribe(
            resp => {
              this.campanaCobertura = resp;
              this._esCreacion = false;
              this._initForm(this.campanaCobertura);
            },
            err => {
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  _initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        campana: new FormControl(param ? this.campanaSelected(param.mimCampanaEndoso.codigo) : null),
        planCobertura: new FormControl(param ? this.planCoberturaSelected(param.mimCampanaRelacionPlanCoberturaList) : null, [Validators.required]),
        descripcion: new FormControl(param ? this.campanaSelected(param.mimCampanaEndoso.codigo).descripcion : null, [Validators.required]),
        valorFijo: new FormControl(this.valorFijoSelected(param), [Validators.required]),
        vigente: new FormControl(param ? param.estado : false, [Validators.required]),
      }));

    if (!this._esCreacion) {
      this.form.controls.campana.disable();
      if(param){
        this.listValorFijo = this.validarEstadoValor(param.listMimCampanaRelacionValorFijoFondoGarantia);
        this.configuracion.gridConfig.component.cargarDatos(this.asignarEstados(this.listValorFijo));
      }
    }
    this.form.controls.descripcion.disable();
    this._change();
  }

  /**
   * Autor: Juan Cabuyales
   * Función: Devuelve el item de campaña endoso
   * @param codigo Codigo de la campaña endoso
   */
  campanaSelected(codigo: string) {
    return this.campanas.find((item: any) => item.codigo === codigo);
  }

  /**
   * Autor: Juan Cabuyales
   * Función: Devuelve el item de plan cobertura
   * @param codigo Codigo del plan cobertura
   */
  planCoberturaSelected(items: any) {
    return this.planesCobertura.filter((planCobertura: any) => items.find((item: any) => item.mimPlanCobertura.codigo === planCobertura.codigo));
  }

  /**
   * Autor: Juan Cabuyales
   * Función: De acuerdo a la acción disparada ejecuta el proceso de crear o actualizar
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
      this.crearCampanaPlanCobertura();
    } else {
      this.actualizarCampanaPlanCobertura();
    }
  }

  private limpiarFormulario(){
    this.form.reset();
    if(this.formValor){
      this.formValor.reset();
    }
    this._initForm();
  }

  private crearCampanaPlanCobertura() {
    const form: any = this.form.value;
    const campanaPlanCobertura = {
      mimCampanaEndoso: {
        codigo: form.campana.codigo
      },
      mimCampanaRelacionPlanCoberturaList: form.planCobertura.map((planCobertura: any) => { return { mimPlanCobertura: { codigo: planCobertura.codigo } } }),
      valorFijoDestinadoFondoGarantia: form.valorFijo,
      estado: true,
      listMimCampanaRelacionValorFijoFondoGarantia: this.procesarListaValores(this.listValorFijo)
    };

    this.backService.campanaCobertura.postCampanaPlanCobertura(campanaPlanCobertura).subscribe(
      () => {
        this.procesarCreacionActualizacion();
      }, err => {
        this.frontService.alert.error(err.error.message);
      }
    );
  }

  private actualizarCampanaPlanCobertura() {
    const form: any = this.form.value;
    const campanaPlanCobertura = {
      codigo: this.codigoCampanaCobertura,
      mimCampanaEndoso: {
        codigo: this.form.get('campana').value.codigo
      },
      mimCampanaRelacionPlanCoberturaList: form.planCobertura.map((planCobertura: any) => { return { mimPlanCobertura: { codigo: planCobertura.codigo } } }),
      valorFijoDestinadoFondoGarantia: form.valorFijo,
      estado: form.vigente,
      listMimCampanaRelacionValorFijoFondoGarantia: this.procesarListaValores(this.listValorFijo)
    };

    this.backService.campanaCobertura.putCampanaPlanCobertura(campanaPlanCobertura.codigo, campanaPlanCobertura).subscribe(
      () => {
        this.procesarCreacionActualizacion();
      },
      err => {
        this.frontService.alert.error(err.error.message);
      }
    );
  }

  private procesarListaValores(items: any[]){
    const listaFinal = [];
    items.forEach((item: any) => {
      delete item.codigo;
      listaFinal.push(item);
    });
    return listaFinal;
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }

  _change() {
    this.form.controls.campana.valueChanges.subscribe(item => {
      if (item) {
        this.form.controls.descripcion.setValue(item.descripcion);
      }
    });

    this.form.controls.valorFijo.valueChanges.subscribe(() => {
      this.habilitaValor = !this.habilitaValor;
      this.configuracion.gridConfig.component.cargarDatos(this.asignarEstados(this.listValorFijo));
    });
  }

  private valorFijoSelected(param: any) {
    if (param && param.valorFijoDestinadoFondoGarantia) {
      this.habilitaValor = !param.valorFijoDestinadoFondoGarantia;
      return param.valorFijoDestinadoFondoGarantia;
    }
    return false;
  }

  private procesarCreacionActualizacion() {
    this.translate.get(this._esCreacion ? 'global.guardadoExitosoMensaje' : 'global.actualizacionExitosaMensaje').subscribe((text: string) => {
      this.frontService.alert.success(text).then(() => {
        this.limpiarFormulario();
        this._irListaCampanasPlanCobertua();
      });
    });
  }

  /**
  * Autor: Juan Cabuyales
  * Función: Retorna a la pantalla de listar las campañas por plan cobertura
  */
  _irListaCampanasPlanCobertua() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_CAMPANAS_ENDOSO,
      UrlRoute.ADMINISTRACION_PROTECCIONES_CAMPANAS_ENDOSO_CAMPANAS_PLAN_COBERTURA]
    );
  }

  /*******************************************************************************************************
   * Zona de metodos para manejo de formulario y tabla de valores fijos
   ******************************************************************************************************/
  tieneCambiosFormularioValor() {
    return this.formValor && this.formValor.dirty;
  }

  /**
  * Autor: Juan Cabuyales
  * Funcion: Captura la accion de la grilla
  */
  _onClickCeldaElement(event: any) {
    if (event.col.key === 'editar') {
      this._toggleGuardar(true, event.dato);
    } else {
      this.eliminarRegistro(event.dato);
    }
  }

  async _toggleGuardar(toggle: boolean, valorFijo?: any) {
    if (!toggle && this.tieneCambiosFormularioValor()) {
      this.frontService.alert.confirm(this.translate.instant('global.onDeactivate')).then((respuesta: boolean) => {
        if (respuesta) {
          this.mostrarGuardar = false;
          this.limpiarFormularioValor();
        }
      });
    }  else {
      if (toggle) {
        await this._cargarDatosFormularioValor();
      }
      if (valorFijo) {
        this.valorFijo = valorFijo;
        this.esCreacionValor = false;
        this.initFormValorFijo(this.valorFijo);
      } else {
        this.valorFijo = null;
        this.esCreacionValor = true;
        this.initFormValorFijo();
      }
      this.mostrarGuardar = toggle;
    }
  }

  private eliminarRegistro(item: any) {
    this.translate.get('administracion.protecciones.campanasCobertura.alertas.deseaEliminarCampana').subscribe((mensaje: string) => {
      const modalPromise = this.frontService.alert.confirm(mensaje, 'danger');
      const newObservable = from(modalPromise);

      newObservable.subscribe(
        (desition: any) => {
          if (desition === true) {
            this.listValorFijo.find((valor: any) => valor.codigo === item.codigo).estado = false;
            this.actualizarCampanaPlanCobertura();
          }
        });
    });
  }

  private initFormValorFijo(param?: any) {
    this.isFormValor = Promise.resolve(
      this.formValor = this.formBuilder.group({
        codigo: new FormControl(param ? param.codigo : null),
        campanaRelacion: new FormControl(param ? param.campanaRelacion : null),
        estadoAsegurado: new FormControl(param ? this.estadoMPSelected(param.mimEstadoAseguradoMP.codigo) : null, [Validators.required]),
        beneficiarioCobertura: new FormControl(param ? this.beneficiarioCoberturaSelected(param.mimBeneficiarioCobertura.codigo) : null, [Validators.required]),
        edadInicio: new FormControl(param ? param.edadInicio : null, [Validators.required, Validators.min(0), Validators.max(99)]),
        edadFin: new FormControl(param ? param.edadFinal : null, [Validators.required, Validators.min(0), Validators.max(100)]),
        valorDestinado: new FormControl(param ? param.valor : null, [Validators.required]),
        fechaInicioFechaFin: new FormControl(param ? this.rangoFechaSelected(param.fechaInicio, param.fechaFin) : null, [Validators.required, Validators.minLength(2)]),
        valorVigente: new FormControl(param ? param.estado : false, [Validators.required])
      }));

    this.customCurrencyMaskConfig = {
      align: 'left',
      allowNegative: true,
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

  private async _cargarDatosFormularioValor(param?: any) {
    const _estados = await this.backService.campanaCobertura.getEstadoAsegurado({ estado: true, isPaged: true, sort: 'nombre,asc', 'size': 1000000 }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
    const _beneficiariosCobertura = await this.backService.campanaCobertura.getBeneficiariosCobertura({ estado: true, isPaged: true, sort: 'nombre,asc', 'size': 1000000 }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
    this.estadosAsegurados = _estados._embedded.mimEstadoAseguradoMP;
    this.beneficiariosCobertura = _beneficiariosCobertura._embedded.mimBeneficiarioCobertura;
  }

  limpiarFormularioValor() {
    this.formValor.reset();
    this.form.markAsDirty();
  }

  rangoFechaSelected(fechaIni: any, fechaFin: any) {
    return [DateUtil.stringToDate(fechaIni), DateUtil.stringToDate(fechaFin)];
  }

  /**
   * Autor: Juan Cabuyales
   * Función: Devuelve el item de beneficiario cobertura
   * @param codigo Codigo del beneficiario
   */
  beneficiarioCoberturaSelected(codigo: string) {
    return this.beneficiariosCobertura.find((item: any) => item.codigo === codigo);
  }

  /**
   * Autor: Juan Cabuyales
   * Función: Devuelve el item de estado en Medicina Prepagada
   * @param codigo Codigo del estado
   */
  estadoMPSelected(codigo: string) {
    return this.estadosAsegurados.find((item: any) => item.codigo === codigo);
  }

  validarFormularioValor() {
    if (this.formValor.invalid) {
      this.validateForm(this.formValor);
      this.frontService.alert.confirm(this.translate.instant('global.validateForm'));
    } else {
      this.guardarValores();
    }
  }

  guardarValores() {
    const formValor = this.formValor.value;
    let valorFondo: any;
    const fechaInicio = DateUtil.dateToString(formValor.fechaInicioFechaFin[0], 'dd-MM-yyyy');
    const fechaFin = DateUtil.dateToString(formValor.fechaInicioFechaFin[1], 'dd-MM-yyyy');
    if (this.esCreacionValor) {
      valorFondo = {
        codigo: this.listValorFijo.length,
        mimBeneficiarioCobertura: {
          codigo: formValor.beneficiarioCobertura.codigo,
          nombre: formValor.beneficiarioCobertura.nombre,
        },
        mimEstadoAseguradoMP: {
          codigo: formValor.estadoAsegurado.codigo,
          nombre: formValor.estadoAsegurado.nombre,
        },
        edadInicio: formValor.edadInicio,
        edadFin: formValor.edadFin,
        valorDestinadoFondoGarantia: formValor.valorDestinado,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        estado: true
      };
      this.listValorFijo.push(valorFondo);
    } else {
      valorFondo = {
        codigo: formValor.codigo,
        mimCampanaRelacion: {
          codigo: formValor.campanaRelacion
        },
        mimBeneficiarioCobertura: {
          codigo: formValor.beneficiarioCobertura.codigo,
          nombre: formValor.beneficiarioCobertura.nombre,
        },
        mimEstadoAseguradoMP: {
          codigo: formValor.estadoAsegurado.codigo,
          nombre: formValor.estadoAsegurado.nombre,
        },
        edadInicio: formValor.edadInicio,
        edadFin: formValor.edadFin,
        valorDestinadoFondoGarantia: formValor.valorDestinado,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        estado: formValor.valorVigente
      };
      const posicion = this.listValorFijo.findIndex((valor: any) => valor.codigo === valorFondo.codigo);
      this.listValorFijo[posicion] = valorFondo;
    }
    const listAux = this.validarEstadoValor(this.listValorFijo);
    this.configuracion.gridConfig.component.cargarDatos(
      this.asignarEstados(listAux), {
        maxPaginas: Math.ceil(listAux.length / 5),
        pagina: 0,
        cantidadRegistros: listAux.length
      }
    );

    // Cerramos el modal
    this.mostrarGuardar = false;
    this.limpiarFormularioValor();
  }

  _onToggleStatus(event: any) {
    let listAux = [];
    if (!event.currentTarget.checked) {
      listAux = this.listValorFijo;
    } else {
      listAux = this.validarEstadoValor(this.listValorFijo);
    }
    this.configuracion.gridConfig.component.cargarDatos(
      this.asignarEstados(listAux), {
        maxPaginas: Math.ceil(listAux.length / 5),
        pagina: 0,
        cantidadRegistros: listAux.length
      }
    );
  }

  /**
  * Autor: Juan Cabuyales
  * Función: Metodo para formatear la data a mostar
  * @param items Son los registros obtenidos de la consulta
  */
  asignarEstados(items: any) {
    const listObj = [];
    let item: any;
    for (item of items) {
      listObj.push({
        _habilitaValor: this.habilitaValor,
        estadoAsociado: item.mimEstadoAseguradoMP.nombre,
        beneficiarioCobertura: item.mimBeneficiarioCobertura ? item.mimBeneficiarioCobertura.nombre : null,
        edadInicio: item.edadInicio,
        edadFinal: item.edadFin,
        valor: item.valorDestinadoFondoGarantia,
        fechaModificacion: item.fechaModificacion,
        ...item
      });
    }
    return listObj;
  }

  private validarEstadoValor(items: any[]) {
    if (items && items.length > 0) {
       const valores = items.filter((valor: any) => valor.estado === true);
       if (valores) {
         return valores;
       }
    }
    return [];
  }
}
