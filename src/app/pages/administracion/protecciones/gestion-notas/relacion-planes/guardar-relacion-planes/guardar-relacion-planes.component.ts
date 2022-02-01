import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormComponent } from '@core/guards';
import { BackFacadeService, FrontFacadeService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { GENERALES } from '@shared/static/constantes/constantes';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormValidate } from '@shared/util';
import { masksPatterns } from '@shared/util/masks.util';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { NotasAclaratoriasService } from '../../services/notas-aclaratorias.service';
import { RelacionPlanesService } from '../../services/relacion-planes.service';

@Component({
  selector: 'app-guardar-relacion-planes',
  templateUrl: './guardar-relacion-planes.component.html',
})
export class GuardarRelacionPlanesComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  form: FormGroup;
  isForm: Promise<any>;
  resp2: any;
  _esCreacion = true;
  subscription: Subscription = new Subscription();
  codigo: string;
  relacionPlan: any;
  patterns = masksPatterns;
  planes: any;
  tipoMovimientos: any;
  notasAclaratorias: any;
  nivelesRiesgo: any;
  relacionesPlanesCobertura: any;
  ordenes: any;
  codigoNotaSelecionada: any;
  ordenNota: any;
  codigoMimNotaAclaratoria: any;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly router: Router,
    private readonly relacionPlanService: RelacionPlanesService,
    private readonly notasAclaratoriasService: NotasAclaratoriasService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscription = this.activatedRoute.params.subscribe((params: any) => {
      this.codigo = params.codigo || null;
      if (this.codigo) {
        this._esCreacion = false;
      }
      forkJoin({
        _planes: this.backService.planCobertura.getPlanesCoberturas({
          'mimEstadoPlanCobertura.codigo': MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.ACTIVO,
          'mimPlan.mimEstadoPlan': MIM_PARAMETROS.MIM_ESTADO_PLAN.ACTIVO,
          'mimCobertura.mimEstadoCobertura': MIM_PARAMETROS.MIM_ESTADO_COBERTURA.ACTIVO
        }),
        // _tipoSolicitudes: this.mimTipoSolicitudService.getMimTipoSolicitud({estado : true}),
        _relacionesPlanes: this.relacionPlanService.getRelacionPlanes({ estado: true }),
        _nivelesRiesgo: this.backService.nivelRiesgo.getNivelesRiesgos({ estado: true }),
        _tipos_movimiento: this.backService.tiposMovimientos.getTiposMovimientos({
          estado: true,
          codigo: [GENERALES.TIPO_MOVIMIENTO.COTIZACION, GENERALES.TIPO_MOVIMIENTO.DISMINUCION
            , GENERALES.TIPO_MOVIMIENTO.INCREMENTAR, GENERALES.TIPO_MOVIMIENTO.PAGO, GENERALES.TIPO_MOVIMIENTO.VINCULACION]
        })
      }).subscribe(items => {
        this.planes = this.asignarNombrePlanCobertura(items._planes.content);
        this.nivelesRiesgo = items._nivelesRiesgo._embedded.mimNivelRiesgo;
        this.tipoMovimientos = items._tipos_movimiento._embedded.mimTipoMovimiento;
        this.relacionesPlanesCobertura = items._relacionesPlanes.content;
        if (this.codigo) {
          this.relacionPlanService.getRelacionPlan(this.codigo)
            .subscribe((resp: any) => {
              this.relacionPlan = resp;
              this.tipoMovimientos = [];
              this.tipoMovimientos.push(resp.mimNotaAclaratoria.mimTipoMovimiento);
              this._getNotas(resp.mimNotaAclaratoria.mimTipoMovimiento.codigo);
              this._esCreacion = false;
              this._initForm(this.relacionPlan);
            }, (err) => {
              this.frontService.alert.warning(err.error.message);
            });
        } else {
          this._esCreacion = true;
          this._initForm();
        }

      });
    });
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  _initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        planCobertura: new FormControl(param ? this._planSelected(param.mimPlanCoberturaDto.mimPlan.codigo, param.mimPlanCoberturaDto.mimCobertura.codigo) : null, [Validators.required]),
        tipoMovimiento: new FormControl(param ? this._tipoSolicitudSelect(param.mimTipoMovimientoDto.codigo) : null, [Validators.required]),
        notaAclaratoria: new FormControl(null, [Validators.required]),
        nivelRiesgo: [param ? this._nivelesRiesgoSelect(param.listaNivelesRelacionNotasAclaratorias) : null, []],
        ordenNota: [null, [Validators.required]]
      }));

    if (!this._esCreacion && param) {
      this.codigoNotaSelecionada = param.mimNotaAclaratoria.codigo;
      this.ordenNota = param.ordenNota;
      this.codigoMimNotaAclaratoria = param.mimNotaAclaratoria.codigo;
      this.form.controls.planCobertura.disable();
      this.form.controls.tipoMovimiento.disable();
      this.form.controls.notaAclaratoria.disable();
    }
    this._change();
  }


  _change() {
    this.form.controls.tipoMovimiento.valueChanges.subscribe(item => {
      if (this.form.controls.planCobertura.value && item) {
        this._getNotas(item.codigo);
      }
    });
    this.form.controls.planCobertura.valueChanges.subscribe(item => {
      if (this.form.controls.tipoMovimiento.value && item) {
        this._getNotas(this.form.controls.tipoMovimiento.value.codigo);
      }
    });
  }

  _getNotas(codigoTipoMovimiento: number) {
    this.notasAclaratoriasService.getNotasAclaratorias({ estado: true, mimTipoMovimiento: codigoTipoMovimiento }).subscribe(notas => {
      this.filterNotasPorRelacionPlanesCobertura(notas.content);
    });
  }

  _notaSelected(codigo: string) {
    return this.notasAclaratorias.find(item => item.codigo === codigo);
  }

  _nivelesRiesgoSelect(listaSeleccionada: any) {
    return this.nivelesRiesgo.filter(x => listaSeleccionada.find(lista => lista.mimNivelRiesgoDto.codigo === x.codigo));
  }

  filterNotasPorRelacionPlanesCobertura(notasAclaratorias: any) {
    this.notasAclaratorias = [];
    this.ordenes = [];
    this.relacionesPlanesCobertura = this.relacionesPlanesCobertura ? this.relacionesPlanesCobertura : [];
    if (!this.form) {
      return;
    }
    const relacionesFinales = this.relacionesPlanesCobertura.filter(relacion =>
      this.form.controls.planCobertura.value.find(planCobertura =>
        relacion.mimPlanCoberturaDto.mimPlan.codigo === planCobertura.mimPlan.codigo
        && relacion.mimPlanCoberturaDto.mimCobertura.codigo === planCobertura.mimCobertura.codigo &&
        relacion.mimTipoMovimientoDto.codigo === this.form.controls.tipoMovimiento.value.codigo
      ));

    const notasCreadas = relacionesFinales.map(x => x.ordenNota);
    for (let index = 0; index <= notasAclaratorias.length; index++) {
      if (!notasCreadas.find(x => x === String(index + 1))) {
        const element = notasAclaratorias[index];
        if (element) {
          this.ordenes.push({ 'nombre': String(index + 1), 'codigo': element.codigo });
        }
      }
    }

    if (this._esCreacion) {
      this.notasAclaratorias = notasAclaratorias.filter(notas =>
        !relacionesFinales.find(relacion => relacion.mimNotaAclaratoria.codigo === notas.codigo));
    } else {
      this.notasAclaratorias = notasAclaratorias;
      this.ordenes.push({ 'nombre': this.ordenNota, 'codigo': this.codigoMimNotaAclaratoria });
      this.form.controls.ordenNota.setValue(this.ordenNotaSelect(this.ordenNota));
      this.form.controls.notaAclaratoria.setValue(this._notaSelected(this.codigoNotaSelecionada));
    }
  }

  _planSelected(codigoPlan: string, codigoCobertura: String) {
    return this.asignarNombrePlanCobertura(this.planes.filter(item => item.mimPlan.codigo === codigoPlan && item.mimCobertura.codigo === codigoCobertura));
  }

  asignarNombrePlanCobertura(items: any) {
    const listObj = [];
    let item: any;
    for (item of items) {
      listObj.push({
        ...item,
        nombre: item.mimPlan.nombre + ' - ' + item.mimCobertura.nombre
      });
    }
    return listObj;
  }

  ordenNotaSelect(orden: string) {
    return this.ordenes.find(o => o.nombre === orden);
  }

  _tipoSolicitudSelect(codigo: String) {
    return this.tipoMovimientos.find(item => item.codigo === codigo);
  }

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

  crearObjectoNivelesRelacion(nivelesRiesgoRelacion: any = []) {
    const objecto = [];
    if (nivelesRiesgoRelacion) {
      nivelesRiesgoRelacion.forEach(niveles => {
        objecto.push({ 'mimNivelRiesgoDto': niveles });
      });
    }
    return objecto;
  }

  _crear() {
    const form: any = this.form.value;
    const param = {
      listaMimPlanCobertura: form.planCobertura,
      mimNotaAclaratoria: { codigo: form.notaAclaratoria.codigo },
      listaNivelesRelacionNotasAclaratorias: this.crearObjectoNivelesRelacion(form.nivelRiesgo),
      ordenNota: form.ordenNota.nombre,
      estado: true,
      mimTipoMovimientoDto: form.tipoMovimiento
    };

    this.relacionPlanService.postRelacionPlan(param).subscribe((resp: any) => {
      this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.form.reset();
          this._initForm();
          this._irListar();
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  _actualizar() {
    const form: any = this.form.getRawValue();
    const param = {
      codigo: this.codigo,
      mimPlanCoberturaDto: form.planCobertura[0] ? form.planCobertura[0] : null,
      mimNotaAclaratoria: { codigo: form.notaAclaratoria.codigo },
      ordenNota: form.ordenNota.nombre,
      estado: true,
      mimTipoMovimientoDto: form.tipoMovimiento,
      listaNivelesRelacionNotasAclaratorias: this.crearObjectoNivelesRelacion(form.nivelRiesgo),
    };
    this.relacionPlanService.putRelacionPlan(this.codigo, param).subscribe((resp: any) => {
      this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          // Redireccionamos a la pantalla de listar.
          this.form.reset();
          this._initForm();
          this._irListar();
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  _irListar() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_COTIZADORES_GESTION_NOTAS,
      UrlRoute.ADMINISTRACION_COTIZADORES_RELACION_PLANES]);
  }

}
