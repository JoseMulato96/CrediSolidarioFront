import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormComponent } from '@core/guards';
import { DatosAsociadoWrapper } from '@core/store/asociado-data.service';
import { DataService } from '@core/store/data.service';
import { AppState } from '@core/store/reducers';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { MimLinkConfiguracion, MimLinksConfiguracion } from '@shared/components/mim-links/mim-links.component';
import { MimPersonaDetalleConfiguracion } from '@shared/components/mim-persona-detalle/mim-persona-detalle.component';
import { GENERALES } from '@shared/static/constantes/constantes';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormValidate } from '@shared/util';
import { masksPatterns } from '@shared/util/masks.util';
import { forkJoin, Observable, Subscription } from 'rxjs';
import * as acciones from '../portafolio.actions';
import { BackFacadeService } from '@core/services/back-facade.service';
import { FrontFacadeService } from '@core/services/front-facade.service';

@Component({
  selector: 'app-gestion-operaciones',
  templateUrl: './gestion-operaciones.component.html',
})
export class GestionOperacionesComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  asoNumInt: string;
  datosAsociado: any;

  idProceso: string;
  mostrarBitacora: any;

  taskId: string;
  task: any;
  venta: any;

  mimLinksConfiguracion: MimLinksConfiguracion;
  mimPersonaDetalleConfiguracion: MimPersonaDetalleConfiguracion;

  subs: Subscription[] = [];

  form: FormGroup;
  isForm: Promise<any>;
  patterns = masksPatterns;
  conceptoAuditorSelect: any = [];
  razonNegociacionSelect: any = [];
  razonDevolucionSelect: any = [];
  dataInitDevolverPorError: any;
  bloquearBotonGuardar: boolean;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly dataService: DataService,
    private readonly store: Store<AppState>,
    private readonly formBuilde: FormBuilder,
    private readonly router: Router,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) { super(); }

  ngOnInit(): void {
    this.store.dispatch(acciones.mostrarMenuConsultas({ datos: false }));
    this.actionsRouterParams();
  }

  private actionsRouterParams() {
    this.subs.push(
      this.route.parent.parent.parent.parent.parent.params.subscribe(params => {
        this.asoNumInt = params.asoNumInt;
        if (!this.asoNumInt) {
          return;
        }
      })
    );

    this.subs.push(
      this.route.params.subscribe(params => {
        this.idProceso = params.processInstanceId;
        this.taskId = params.taskId;
      })
    );

    this.subs.push(this.dataService.asociados().asociado.subscribe((respuesta: DatosAsociadoWrapper) => {
      if (!respuesta) { return; }
      this.datosAsociado = respuesta.datosAsociado;
      this.precargarDatos();
    }, (err: any) => {
      this.frontService.alert.error(err.error.message);
    })
    );
  }

  private initForm(param?: any, task?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilde.group({
        concepto: [null, [Validators.required]],
        tipoGlosa: [null],
        solicitarRevisionAreaTecnica: new FormControl(task && task.variables && task.variables.requiereAutorizacionTecnica ? task.variables.requiereAutorizacionTecnica : false),
        observacion: [param && param.mimConceptoTareaFlujoMesaControl &&
          param.mimConceptoTareaFlujoMesaControl.codigo === MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_VENTA_INCREMENTO_GESTION_OPERACIONES_APROBAR ?
          'Solicitud aprobada' : null, [Validators.required, Validators.maxLength(1000), Validators.pattern('.*\\S.*[a-zA-z0-9-zÀ-ÿ\u00f1\u00d1 ]')]]
      })
    );
    this.form.controls.tipoGlosa.disable();
    this.changeConcepto();
    this.form.controls.concepto.setValue(param && param.mimConceptoTareaFlujoMesaControl ? this.obtenerMimConceptoTareaFlujo(param.mimConceptoTareaFlujoMesaControl.codigo) : null);
  }

  private changeConcepto() {
    this.form.controls.concepto.valueChanges.subscribe(item => {
      if (item === null || item === undefined) {
        return;
      }

      this.form.controls.tipoGlosa.setValidators(null);
      this.form.controls.tipoGlosa.setValue(null);
      this.form.controls.tipoGlosa.disable();
      this.form.controls.observacion.setValue(null, { emitEvent: false });

      if (item.codigo === MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_VENTA_INCREMENTO_GESTION_OPERACIONES_GLOSAR) {
        this.form.controls.tipoGlosa.setValidators([Validators.required]);
        this.form.controls.tipoGlosa.enable();
      } else if (item.codigo === MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_VENTA_INCREMENTO_GESTION_OPERACIONES_APROBAR) {
        this.form.controls.observacion.setValue('Solicitud aprobada');
      }
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch(acciones.mostrarMenuConsultas({ datos: true }));
    this.subs.forEach((item: Subscription) => item.unsubscribe());
  }

  private precargarDatos() {
    forkJoin({
      _venta: this.backService.venta.getVenta({ idProceso: this.idProceso }),
      _conceptoTarea: this.backService.conceptoTareaFlujo.getConceptoTareaFlujo({
        'mimFaseFlujo.mimFaseProcesoSet.mimFaseProcesoPK.codigoProceso': GENERALES.PROCESO.INCREMENTOS,
        'mimFaseFlujo.codigo': MIM_PARAMETROS.MIM_FASE_FLUJO.MESA_CONTROL
      }),
      _razonDevolucion: this.backService.razonGlosa.getRazonGlosa({
        'mimFaseFlujo.codigo': MIM_PARAMETROS.MIM_FASE_FLUJO.MESA_CONTROL
      }),
      _task: this.backService.proceso.getTareasPorIdProceso(this.idProceso, {
        'includeProcessVariables': true
      })
    }).subscribe(async (resp: any) => {
      if (resp._venta.content.length > 0) {
        this.venta = resp._venta.content[0];

        this.contruirPersonaDetalleConfiguracion();
        this.construirMimLinksConfiguracion();

        this.conceptoAuditorSelect = resp._conceptoTarea._embedded.mimConceptoTareaFlujo;
        this.razonDevolucionSelect = resp._razonDevolucion._embedded.mimRazonGlosa;

        this.task = resp._task[0];
        this.initForm(this.venta, this.task);
      }
    }, (err: any) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  customGoTo(item: MimLinkConfiguracion) {
    if (item.key === 'bitacora') {
      this.idProceso = this.venta.idProceso;
      this.mostrarBitacora = true;
    }
  }

  cerrarModalBitacora() {
    this.mostrarBitacora = false;
    this.idProceso = undefined;
  }

  contruirPersonaDetalleConfiguracion() {
    this.mimPersonaDetalleConfiguracion = new MimPersonaDetalleConfiguracion();

    this.mimPersonaDetalleConfiguracion.title = 'asociado.protecciones.portafolio.gestionOperaciones.personaDetalle.titulo';
    // Configuaramos la informacion.
    this.mimPersonaDetalleConfiguracion.items = [
      {
        label: 'asociado.protecciones.portafolio.gestionOperaciones.personaDetalle.numeroSolicitud',
        value: this.venta.idProceso
      },
      {
        label: 'asociado.protecciones.portafolio.gestionOperaciones.personaDetalle.fechaSolicitud',
        value: this.venta.fechaSolicitud
      },
      {
        label: 'asociado.protecciones.portafolio.gestionOperaciones.personaDetalle.estadoSolicitud',
        value: this.venta.mimEstadoVenta.nombre
      },
      {
        label: 'asociado.protecciones.portafolio.gestionOperaciones.personaDetalle.nombreAsociado',
        value: this.datosAsociado.nomCli
      },
      {
        label: 'asociado.protecciones.portafolio.gestionOperaciones.personaDetalle.identidifacionAsociado',
        value: this.datosAsociado.nitCli
      },
      {
        label: 'asociado.protecciones.portafolio.gestionOperaciones.personaDetalle.tipoMovimiento',
        value: this.venta.mimTipoMovimiento.nombre
      },
      {
        label: 'asociado.protecciones.portafolio.gestionOperaciones.personaDetalle.nivelRiesgoActual',
        value: this.datosAsociado.nivelRiesgo
      },
      {
        label: 'asociado.protecciones.portafolio.gestionOperaciones.personaDetalle.categoriaAsociado',
        value: this.datosAsociado.categoriaAsociado
      },
      {
        label: 'asociado.protecciones.portafolio.gestionOperaciones.personaDetalle.estadoAsociado',
        value: this.venta.asociado.desEstado
      },
      {
        label: 'asociado.protecciones.portafolio.gestionOperaciones.personaDetalle.cuotasMora',
        value: this.venta.mimProyectoVida?.nombre || this.venta.otroProyectoVida
      },
      {
        label: 'asociado.protecciones.portafolio.gestionOperaciones.personaDetalle.regionalAsociado',
        value: this.datosAsociado.regionalAso
      },
      {
        label: 'asociado.protecciones.portafolio.gestionOperaciones.personaDetalle.oficinaVinculacion',
        value: this.datosAsociado.desOficina
      },
      {
        label: 'asociado.protecciones.portafolio.gestionOperaciones.personaDetalle.canal',
        value: this.venta.mimCanal?.nombre
      },
    ];
  }

  construirMimLinksConfiguracion() {
    this.mimLinksConfiguracion = new MimLinksConfiguracion();
    this.mimLinksConfiguracion.title = 'asociado.protecciones.portafolio.tituloLinks';
    this.mimLinksConfiguracion.collapsable = true;
    this.mimLinksConfiguracion.items = [
      {
        label: 'asociado.protecciones.portafolio.gestionOperaciones.links.bitacora',
        key: 'bitacora',
        customGoTo: true,
        icon: {
          icon: 'icon-external-link text--blue1',
          css: 'btn btn--icon bg--blue2'
        }
      },
      {
        label: 'asociado.protecciones.portafolio.gestionAreaTecnica.links.facturacionMultiactiva',
        key: 'facturacionMultiaciva',
        url: [
          UrlRoute.PAGES,
          UrlRoute.CONSULTAS,
          UrlRoute.CONSULTAS_ASOCIADO,
          this.datosAsociado.numInt,
          UrlRoute.FACTURACION_ASOCIADOS,
          UrlRoute.FACTURACION_ASOCIADOS_MULTIATIVA
        ],
        icon: {
          icon: 'icon-external-link text--blue1',
          css: 'btn btn--icon bg--blue2'
        }
      },
      {
        label: 'asociado.protecciones.portafolio.gestionAreaTecnica.links.facturacionSolidaridad',
        key: 'facturacionMultiaciva',
        url: [
          UrlRoute.PAGES,
          UrlRoute.CONSULTAS,
          UrlRoute.CONSULTAS_ASOCIADO,
          this.datosAsociado.numInt,
          UrlRoute.FACTURACION_ASOCIADOS,
          UrlRoute.FACTURACION_ASOCIADOS_SOLIDARIDAD
        ],
        icon: {
          icon: 'icon-external-link text--blue1',
          css: 'btn btn--icon bg--blue2'
        }
      },
      {
        label: 'asociado.protecciones.portafolio.gestionOperaciones.links.detalleBeneficiarios',
        key: 'preexistencia',
        url: [
          UrlRoute.PAGES,
          UrlRoute.CONSULTAS,
          UrlRoute.CONSULTAS_ASOCIADO,
          this.datosAsociado.numInt,
          UrlRoute.BENEFICIARIOS_ASOCIADO
        ],
        icon: {
          icon: 'icon-external-link text--blue1',
          css: 'btn btn--icon bg--blue2'
        }
      },
      {
        label: 'asociado.protecciones.portafolio.gestionOperaciones.links.resumenVenta',
        key: 'resumenVenta',
        url: [
          UrlRoute.PAGES,
          UrlRoute.CONSULTAS,
          UrlRoute.CONSULTAS_ASOCIADO,
          this.datosAsociado.numInt,
          UrlRoute.PROTECCIONES,
          UrlRoute.PORTAFOLIO_BETA,
          UrlRoute.PORTAFOLIO_PLAN_COBERTURA_RESUMEN_VENTA_COBERTURAS,
          this.idProceso
        ],
        icon: {
          icon: 'icon-external-link text--blue1',
          css: 'btn btn--icon bg--blue2'
        }
      },
      {
        label: 'asociado.protecciones.portafolio.gestionOperaciones.links.portafolioProducto',
        key: 'portafolio',
        url: [
          UrlRoute.PAGES,
          UrlRoute.CONSULTAS,
          UrlRoute.CONSULTAS_ASOCIADO,
          this.datosAsociado.numInt,
          UrlRoute.PROTECCIONES,
          UrlRoute.PORTAFOLIO_BETA
        ],
        icon: {
          icon: 'icon-external-link text--blue1',
          css: 'btn btn--icon bg--blue2'
        }
      }

    ];
  }

  private obtenerMimConceptoTareaFlujo(codigo: any) {
    return this.conceptoAuditorSelect ? this.conceptoAuditorSelect.find(mimConceptoTareaFlujo => mimConceptoTareaFlujo.codigo === codigo) : null;
  }

  guardar() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }

    const _form = this.form.getRawValue();

    // Configuramos el concepto del auditor.
    this.venta.mimConceptoTareaFlujoMesaControl = _form.concepto;

    const variables = {} as any;
    switch (this.venta.mimConceptoTareaFlujoMesaControl.codigo) {
      case MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_VENTA_INCREMENTO_GESTION_OPERACIONES_GLOSAR:
        this.venta.mimRazonGlosaMesaControl = _form.tipoGlosa;
        break;
      case MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_VENTA_INCREMENTO_GESTION_OPERACIONES_APROBAR:
        variables.autorizadoMesaControl = true;
        break;
    }

    variables.requiereAutorizacionTecnica = _form.solicitarRevisionAreaTecnica ? _form.solicitarRevisionAreaTecnica : false;


    // Configuramos las observaciones.
    variables.comment = _form.observacion;

    this.venta.variables = variables;
    this.bloquearBotonGuardar = true;
    this.backService.venta.postGestionMesaControl(this.venta).subscribe((mimVenta: any) => {
      this.bloquearBotonGuardar = false;
      this.initForm();
      this.frontService.alert.success(mimVenta.message).then(() => {
        this.router.navigate([UrlRoute.PAGES]);
      });
    }, (err) => {
      this.bloquearBotonGuardar = false;
      this.frontService.alert.error(err.error.message);
    });
  }

  activarBotonGuardar() {
    const _form = this.form.getRawValue();
    if (!_form.observacion) {
      return true;
    }
    if (!_form.concepto) {
      return true;
    }
    if (_form.concepto && !_form.tipoGlosa && _form.concepto.codigo === MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_VENTA_INCREMENTO_GESTION_OPERACIONES_GLOSAR) {
      return true;
    }
    return false;
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }

}
