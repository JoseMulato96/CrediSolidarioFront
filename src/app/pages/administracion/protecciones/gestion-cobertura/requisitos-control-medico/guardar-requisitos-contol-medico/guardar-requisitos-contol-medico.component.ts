import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormComponent } from '@core/guards';
import { BackFacadeService } from '@core/services/back-facade.service';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { TranslateService } from '@ngx-translate/core';
import { minMaxValidator } from '@shared/directives/min-max-validator.directive';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormValidate } from '@shared/util';
import { DateUtil } from '@shared/util/date.util';
import { Observable } from 'rxjs/internal/Observable';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { Subscription } from 'rxjs/internal/Subscription';
import { RequisitosColtrolMedicoService } from '../services/requisitos-coltrol-medico.service';

@Component({
  selector: 'app-guardar-requisitos-contol-medico',
  templateUrl: './guardar-requisitos-contol-medico.component.html',
})
export class GuardarRequisitosContolMedicoComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  form: FormGroup;
  isForm: Promise<any>;

  _esCreacion = true;
  subscription: Subscription = new Subscription();
  codigoControlMedico: any;
  controlMedico: any;

  planesCobertura: any[];
  requisitosSolicitados: any[];
  tipoTransaccion: any[];
  generos: any[] = [];
  estadoFecha: boolean;

  vigenciaFechasAMantenerSeleccionadas: Date[];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly router: Router,
    private readonly requisitosColtrolMedicoService: RequisitosColtrolMedicoService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
  }

  ngOnInit() {
    this.subscription = this.activatedRoute.params.subscribe((params: any) => {
      this.codigoControlMedico = params['codigo'];

      // Nos aseguramos de cargar los parametros antes de inicializar el formulario.
      forkJoin([
        this.backService.planCobertura.getPlanesCoberturas({
          'planCoberturaService.codigo': MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.ACTIVO,
          isPaged: true, sort: 'mimPlan.nombre,asc', 'size': 1000000
        }),
        this.backService.requisitoSolicitado.getRequisitosSolicitados({ estado: true, isPaged: true, sort: 'nombre,asc', 'size': 1000000 }),
        this.backService.tiposMovimientos.getTiposMovimientos({ estado: true, isPaged: true, sort: 'nombre,asc', 'size': 1000000 }),
        this.backService.genero.getGeneros({ estado: true, sort: 'nombre,asc', 'size': 1000000 })
      ]).subscribe(([
        _planesCobertura,
        _requisitosSolicitados,
        _tipoTransaccion,
        _generos
      ]) => {
        this.planesCobertura = _planesCobertura.content.map(item => ({ ...item, _nombre: `${item.mimPlan.nombre} - ${item.nombre}` }));
        this.requisitosSolicitados = _requisitosSolicitados._embedded.mimDocumento;
        this.tipoTransaccion = _tipoTransaccion._embedded.mimTipoMovimiento;
        this.generos = _generos._embedded.mimGenero;
        if (this.codigoControlMedico) {
          this.requisitosColtrolMedicoService.getControlMedico(this.codigoControlMedico)
            .subscribe((resp: any) => {
              this.controlMedico = resp;
              this._setRowInactivo(resp);
              this._esCreacion = false;
              this._initForm(this.controlMedico);
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

  _setRowInactivo(row: any) {

    row.mimPlanCoberturaRequisitoList.forEach(item => {
      if (item.mimPlanCobertura && item.mimPlanCobertura.mimEstadoPlanCobertura == MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.INACTIVO) {
        this.planesCobertura.push(item.mimPlanCobertura);
      }
    });

    row.mimDocumentoRequisitoList.forEach(item => {
      if (item.mimDocumento && !item.mimDocumento.estado) {
        this.requisitosSolicitados.push(item.mimDocumento);
      }
    });

    row.mimTransaccionRequisitoList.forEach((item) => {
      if (item.mimTransaccion && !item.mimTransaccion.estado) {
        this.tipoTransaccion.push(item.mimTransaccion);
      }
    });

    row.mimGeneroRequisitoList.forEach(item => {
      if (item.mimGenero && !item.mimGenero.estado) {
        this.generos.push(item.mimGenero);
      }
    });
  }

  /**
   * Autor: Cesar Millan
   * Función: Inicializa el formulario
   */
  _initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        codigo: new FormControl(param ? param.codigo : null),
        planesCobertura: new FormControl(param ? this.planCoberturaSelected(param.mimPlanCoberturaRequisitoList) : null, [Validators.required]),
        requisitosSolicitados: new FormControl(param ? this.documentosSelected(param.mimDocumentoRequisitoList) : null, [Validators.required]),
        tipoTransaccion: new FormControl(param ? this.tipoTransaccionSelected(param.mimTransaccionRequisitoList) : null, [Validators.required]),
        edadMinima: new FormControl(param ? param.edadMinima : null, [Validators.required, Validators.min(0), Validators.max(100)]),
        edadMaxima: new FormControl(param ? param.edadMaxima : null, [Validators.required, Validators.min(0), Validators.max(100)]),
        valorProtecionMinimo: new FormControl(param ? param.valorProteccionMin : null, [Validators.required, Validators.min(0), Validators.max(1000000000)]),
        valorProtecionMaximo: new FormControl(param ? param.valorProteccionMax : null, [Validators.required, Validators.min(0), Validators.max(1000000000)]),
        genero: new FormControl(param ? this.generoSelected(param.mimGeneroRequisitoList) : null, [Validators.required]),
        // aplicaValidacionIMC: new FormControl(param ? this.aplicaValidacionIMCSelected() : false, [Validators.required]),
        IMCMinimo: new FormControl(param ? param.imcMinimo : null, [Validators.min(0), Validators.max(100)]),
        IMCMaximo: new FormControl(param ? param.imcMaximo : null, [Validators.min(0), Validators.max(100)]),
        fechaInicioFechaFin: new FormControl(param ? this.rangoFechaSelected(param.fechaInicio, param.fechaFin) : null, [Validators.required]),
        requiereAuditoriaMedica: new FormControl(param ? param.requiereAuditoriaMedica : false)// preguntasSalud
      }, {
        validators: [minMaxValidator('edadMinima', 'edadMaxima'),
        minMaxValidator('valorProtecionMinimo', 'valorProtecionMaximo'),
        minMaxValidator('IMCMinimo', 'IMCMaximo')]
      }));

    if (!this._esCreacion) {
      this.form.controls.codigo.disable();

      this.vigenciaFechasAMantenerSeleccionadas = [DateUtil.stringToDate(param ? param.fechaInicio : null)];
      this.estadoFecha = param && !param.estado;
      if (param && !param.estado) {
        this.form.disable();
      }
    }


  }

  planCoberturaSelected(items: any[]) {
    return this.planesCobertura.filter(planCobertura => items.find(item =>
      item.mimPlanCoberturaRequisitoPK.codigoPlanCobertura === planCobertura.codigo));
  }

  tipoTransaccionSelected(items: any[]) {
    return this.tipoTransaccion.filter(tipoTransaccion => items.find(item =>
      item.mimTransaccionRequisitoPK.codigoTransaccion === tipoTransaccion.codigo));
  }

  documentosSelected(items: any[]) {
    return this.requisitosSolicitados.filter(requisitoSolicitado => items.find(item =>
      item.mimDocumentoRequisitoPK.codigoDocumento === requisitoSolicitado.codigo));
  }

  rangoFechaSelected(fechaIni: any, fechaFin: any) {
    return [DateUtil.stringToDate(fechaIni), DateUtil.stringToDate(fechaFin)];
  }

  generoSelected(items: any) {
    return this.generos.filter(genero => items.find(item =>
      item.mimGeneroRequisitoPK.codigoGenero === genero.codigo));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Autor: Cesar Millan
   * Función: De acuerdo a la acción disparada ejecuta el proceso de crear o eliminar
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
   * Función: Crea un item
   */
  _crear() {
    const form: any = this.form.value;
    const fechaInicio = DateUtil.dateToString(form.fechaInicioFechaFin[0], 'dd-MM-yyyy');
    const fechaFin = DateUtil.dateToString(form.fechaInicioFechaFin[1], 'dd-MM-yyyy');

    const param = {
      codigo: form.codigo,
      edadMinima: form.edadMinima,
      edadMaxima: form.edadMaxima,
      valorProteccionMin: form.valorProtecionMinimo,
      valorProteccionMax: form.valorProtecionMaximo,
      mimGeneroRequisitoList: form.genero.map(genero => {
        const codigo = { mimGenero: { codigo: genero.codigo } };
        return codigo;
      }),
      imcMinimo: form.IMCMinimo,
      imcMaximo: form.IMCMaximo,
      // preguntasSalud: form.requiereAuditoriaMedica,
      requiereAuditoriaMedica: form.requiereAuditoriaMedica,
      estado: true, // form.vigente,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,

      mimPlanCoberturaRequisitoList: form.planesCobertura.map(planCobertura => {
        const codigo = { mimPlanCobertura: { codigo: planCobertura.codigo } };
        return codigo;
      }),
      mimTransaccionRequisitoList: form.tipoTransaccion.map(tipoTransaccion => {
        const codigo = { mimTransaccion: { codigo: tipoTransaccion.codigo } };
        return codigo;
      }),
      mimDocumentoRequisitoList: form.requisitosSolicitados.map(requisitosSolicitados => {
        const codigo = { mimDocumento: { codigo: requisitosSolicitados.codigo } };
        return codigo;
      })
    };

    this.requisitosColtrolMedicoService.postControlMedico(param).subscribe((resp: any) => {
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
   * Autor: Cesar Millan
   * Función: Modifica la información de un item
   */
  _actualizar() {
    const form: any = this.form.value;
    const fechaInicio = DateUtil.dateToString(form.fechaInicioFechaFin[0], 'dd-MM-yyyy');
    const fechaFin = DateUtil.dateToString(form.fechaInicioFechaFin[1], 'dd-MM-yyyy');

    const param = {
      codigo: this.codigoControlMedico,
      edadMinima: form.edadMinima,
      edadMaxima: form.edadMaxima,
      valorProteccionMin: form.valorProtecionMinimo,
      valorProteccionMax: form.valorProtecionMaximo,
      mimGeneroRequisitoList: form.genero.map(genero => {
        const codigo = { mimGenero: { codigo: genero.codigo } };
        return codigo;
      }),
      imcMinimo: form.IMCMinimo,
      imcMaximo: form.IMCMaximo,
      // preguntasSalud: form.requiereAuditoriaMedica,
      requiereAuditoriaMedica: form.requiereAuditoriaMedica,
      estado: this.controlMedico.estado, // form.vigente,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,

      mimPlanCoberturaRequisitoList: form.planesCobertura.map(planCobertura => {
        const codigo = { mimPlanCobertura: { codigo: planCobertura.codigo } };
        return codigo;
      }),

      mimTransaccionRequisitoList: form.tipoTransaccion.map(tipoTransaccion => {
        const codigo = { mimTransaccion: { codigo: tipoTransaccion.codigo } };
        return codigo;
      }),
      mimDocumentoRequisitoList: form.requisitosSolicitados.map(requisitosSolicitados => {
        const codigo = { mimDocumento: { codigo: requisitosSolicitados.codigo } };
        return codigo;
      })
    };

    this.requisitosColtrolMedicoService.putControlMedico(this.codigoControlMedico, param).subscribe((resp: any) => {
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

  /**
   * Autor: Cesar Millan
   * Función: Retorna a la pantalla de listar los items
   */
  _irListaListar() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA,
      UrlRoute.ADMINISTRACION_PROTECCIONES_REQUISITOS_CONTROL_MEDICO
    ]);
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }

}
