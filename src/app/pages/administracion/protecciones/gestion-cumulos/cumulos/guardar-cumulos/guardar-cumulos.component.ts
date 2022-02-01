import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CustomValidators, FormValidate } from '@shared/util';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { UrlRoute } from '@shared/static/urls/url-route';
import { Observable } from 'rxjs/internal/Observable';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { FormComponent } from '@core/guards';
import { SIP_PARAMETROS_TIPO } from '@shared/static/constantes/sip-parametros-tipo';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { BackFacadeService, FrontFacadeService } from '@core/services';

@Component({
  selector: 'app-guardar-cumulos',
  templateUrl: './guardar-cumulos.component.html',
})
export class GuardarCumulosComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  form: FormGroup;
  isForm: Promise<any>;

  _esCreacion = true;
  subscription: Subscription = new Subscription();
  codigoCumulo: any;
  cumulo: any;

  estadosCobertura: any[] = [];
  procesoCalculos: any[] = [];
  fondos: any[] = [];

  planesCobertura: any[] = [];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
  }

  ngOnInit() {
    this.subscription = this.activatedRoute.params.subscribe((params: any) => {
      this.codigoCumulo = params['codigo'];
      // Nos aseguramos de cargar los parametros antes de inicializar el formulario.
      forkJoin([
        this.backService.procesoCumulo.getProcesosCumulos({ estado: true, sort: 'nombre,asc', isPaged: true, size: 1000000 }),
        this.backService.estadoProteccion.getEstadosProtecciones({ estado: true, sort: 'nombre,asc', isPaged: true, size: 1000000 }),
        this.backService.planCobertura.getPlanesCoberturas({ 'estado': true, 'mimEstadoPlanCobertura.codigo': [MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.PROCESO, MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.ACTIVO] }),
        this.backService.fondo.getFondos({ 'estado': true, sort: 'nombre,asc'})
      ]).subscribe(([
        _procesoCalculos,
        _estadoProtecciones,
        _planesCobertura,
        _fondos
      ]) => {
        this.procesoCalculos = _procesoCalculos._embedded.mimTipoProcesoCumulo;
        this.estadosCobertura = _estadoProtecciones._embedded.mimEstadoProteccion.filter(item => item.codigo != SIP_PARAMETROS_TIPO.ESTADOS_PROTECCION.PRE_VINCULACION);
        this.planesCobertura = _planesCobertura.content.map(x => ({ ...x, _nombre: x.mimPlan.nombre + ' - ' + x.mimCobertura.nombre }));
        this.fondos = _fondos.content;
        if (this.codigoCumulo) {
          this.backService.cumulo.getCumulo(this.codigoCumulo)
            .subscribe((resp: any) => {
              this.cumulo = resp;
              if (!this.procesoCumuloSelected(resp.mimTipoProcesoCumulo.codigo)) {
                this.procesoCalculos.push(resp.mimTipoProcesoCumulo);
              }
              this._esCreacion = false;
              this._initForm(this.cumulo);
            }, (err) => {
              this.frontService.alert.warning(err.error.message);
            });
        } else {
          this._esCreacion = true;
          this._initForm();
        }
      }, (err) => {
        this.frontService.alert.warning(err.error.message);
      });
    });
  }

  /**
   * Autor: Cesar Millan
   * Función: Inicializa el formulario
   * @param param
   */
  _initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        codigo: new FormControl(param ? param.codigo : null),
        nombre: new FormControl(param ? param.nombre : null, [Validators.required, Validators.maxLength(255), CustomValidators.vacio]),
        procesoCumulo: new FormControl(param ? this.procesoCumuloSelected(param.mimTipoProcesoCumulo.codigo) : null, [Validators.required]),
        fondo: new FormControl(param ? this.procesoFondoSelected(param.mimFondo.codigo) : null, [Validators.required]),
        descripcion: new FormControl(param ? this.procesoCumuloSelected(param.mimTipoProcesoCumulo.codigo)?.descripcion : null),
        estadoCobertura: new FormControl(param ? this.estadosCoberturaSelected(param.mimEstadoProteccionCumuloList) : null, [Validators.required]),
        dependeOtrosPlanCobertura: new FormControl(param ? param.dependeOtrosPlanCobertura : true, [Validators.required]),
        planCoberturaDependiente: new FormControl(param ? param.mimPlancoberturaDependiente ? this.mimPlanCoberturasDependientes(param.mimPlancoberturaDependiente) : null : null, [Validators.required])
      }));
    if (param && !param.dependeOtrosPlanCobertura) {
      this.form.controls.planCoberturaDependiente.disable();
    }
    if (!this._esCreacion) {
      this.form.controls.codigo.disable();
      if (param && !param.estado) {
        this.form.disable();
      }
    }
    this.form.controls.procesoCumulo.valueChanges.subscribe(proceso => {
      if (proceso !== null) {
        this.form.controls.descripcion.setValue(proceso.descripcion);
      }
    });

    this.form.controls.dependeOtrosPlanCobertura.valueChanges.subscribe(dependiente => {
      if (!dependiente) {
        this.form.controls.planCoberturaDependiente.disable();
      }
    });
    this.controlSetValueDisbalePlanCoberturaDependiente();
  }

  private controlSetValueDisbalePlanCoberturaDependiente() {
    this.form.controls.dependeOtrosPlanCobertura.valueChanges.subscribe(r => {
      if (!r) {
        this.form.controls.planCoberturaDependiente.setValue([]);
        this.form.controls.planCoberturaDependiente.disable();
      } else {
        this.form.controls.planCoberturaDependiente.enable();
      }
    });
  }

  /**
   * Autor: Cesar Millan
   * Función: Devuelve el item de datos del cliente
   * @param codigo Codigo del cliente
   */
  procesoCumuloSelected(codigo: string) {
    return this.procesoCalculos.find(x => x.codigo === codigo);
  }

  procesoFondoSelected(codigo: string) {
    return this.fondos.find(x => x.codigo === codigo);
  }

  private mimPlanCoberturasDependientes(listMimPlanCoberturaDependiente: any) {
    return this.planesCobertura.filter(x => listMimPlanCoberturaDependiente.find(item => item.codigo === x.codigo));
  }

  estadosCoberturaSelected(items: any) {
    return this.estadosCobertura.filter(estados => items.find(item =>
      item.mimEstadoProteccionCumuloPK.codigoEstadoProteccion === estados.codigo));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Autor: Cesar Millan
   * Función: De acuerdo a la acción disparada ejecuta el proceso de crear o modificar
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
      this._crear();
    } else {
      this._actualizar();
    }
  }

  /**
   * Autor: Cesar Millan
   * Función: Crea un cumulo
   */
  _crear() {
    const form: any = this.form.value;
    const param = {
      nombre: form.nombre,
      mimFondo: { codigo: this.form.controls.fondo.value.codigo },
      mimTipoProcesoCumulo: { codigo: form.procesoCumulo.codigo },
      estado: true,
      dependeOtrosPlanCobertura: form.dependeOtrosPlanCobertura,
      mimPlancoberturaDependiente: form.planCoberturaDependiente,
      mimEstadoProteccionCumuloList: form.estadoCobertura.map(estado => {
        const codigo = { mimEstadoProteccion: { codigo: estado.codigo } };
        return codigo;
      }),
    };
    this.backService.cumulo.postCumulo(param).subscribe((resp: any) => {
      this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.form.reset();
          this._initForm();
          // Redireccionamos a la pantalla de listar.
          this._irListaListar();
        });
      });
    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });
  }

  /**
   * Autor: Cesar Millan
   * Función: Modifica la información del cumulo
   */
  _actualizar() {
    const form: any = this.form.getRawValue();
    const param = {
      codigo: this.codigoCumulo,
      nombre: this.form.controls.nombre.value, // form.nombre,
      mimFondo: { codigo: this.form.controls.fondo.value.codigo },
      dependeOtrosPlanCobertura: form.dependeOtrosPlanCobertura,
      mimPlancoberturaDependiente: form.planCoberturaDependiente,
      mimTipoProcesoCumulo: { codigo: this.form.controls.procesoCumulo.value.codigo }, // form.procesoCumulo.codigo
      estado: this.cumulo.estado,
      mimEstadoProteccionCumuloList: form.estadoCobertura ? form.estadoCobertura.map(estado => {
        const codigo = { mimEstadoProteccion: { codigo: estado.codigo } };
        return codigo;
      }) : null,
    };

    this.backService.cumulo.putCumulo(this.codigoCumulo, param).subscribe((resp: any) => {
      this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.form.reset();
          this._initForm();
          // Redireccionamos a la pantalla de listar.
          this._irListaListar();
        });
      });
    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });
  }

  /**
   * Autor: Cesar Millan
   * Función: Retorna a la pantalla de listar los cumulos
   */
  _irListaListar() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_CUMULOS,
      UrlRoute.ADMINISTRACION_PROTECCIONES_CUMULOS]);
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }
}
