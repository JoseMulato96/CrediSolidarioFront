import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import * as acciones from '../portafolio.actions';
import { UrlRoute } from '@shared/static/urls/url-route';
import { Location } from '@angular/common';
import { DataService } from '@core/store/data.service';
import { DatosAsociadoWrapper } from '@core/store/asociado-data.service';
import { FormValidate } from '@shared/util';
import { FormComponent } from '@core/guards';
import { MimLinksConfiguracion, MimLinkConfiguracion } from '@shared/components/mim-links/mim-links.component';
import { MimPersonaDetalleConfiguracion } from '@shared/components/mim-persona-detalle/mim-persona-detalle.component';
import { AppState } from '@core/store/reducers';
import { Store } from '@ngrx/store';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { GENERALES } from '@shared/static/constantes/constantes';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-gestion-listas-restrictivas',
  templateUrl: './gestion-listas-restrictivas.component.html',
})
export class GestionListasRestrictivasComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  subscriptions: Subscription[] = [];
  datosAsociado: any;
  venta: any;
  conceptos: any[] = [];

  mimLinksConfiguracion: MimLinksConfiguracion;
  mimPersonaDetalleConfiguracion: MimPersonaDetalleConfiguracion;

  form: FormGroup;
  isForm: Promise<any>;
  validateForm: any;
  isPristine: any;

  idProceso: any;
  mostrarBitacora: any;

  tareaProcess: any;
  taskId: any;
  tarea: any;

  tipoListaOficialCumplimiento: boolean;
  tipoListaJefeRiesgos: boolean;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly dataService: DataService,
    private readonly location: Location,
    private readonly store: Store<AppState>,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) { super(); }
  hasChanges: () => boolean | import('rxjs').Observable<boolean> | Promise<boolean>;


  ngOnInit() {
    this.store.dispatch(acciones.mostrarMenuConsultas({ datos: false }));

    this.subscriptions.push(this.activatedRoute.params.subscribe(
      params => {
        this.idProceso = params.processInstanceId;
        if (!this.idProceso) {
          this.translate.get('Falta código del proceso').subscribe(mensaje => {
            this.frontService.alert.info(mensaje).then(() => {
              this.router.navigate([UrlRoute.PAGES]);
            });
          });
        }
      }
    ));

    this.subscriptions.push(this.dataService
      .asociados()
      .asociado.subscribe((respuesta: DatosAsociadoWrapper) => {
        if (!respuesta) {
          return;
        }
        this.datosAsociado = respuesta.datosAsociado;
        this.precargarDatos();
      }));

  }

  precargarDatos() {
    // Obtenemos informacion de la solicitud de la venta.
    this.backService.venta.getVenta({ 'idProceso': this.idProceso }).subscribe((venta: any) => {
      if (!venta.content || venta.content.length === 0) {
        this.translate.get('asociado.protecciones.portafolio.resumen.alertas.noEncontroVenta').subscribe(mensaje => {
          this.frontService.alert.info(mensaje).then(() => {
            this.router.navigate([UrlRoute.PAGES]);
          });
        });
      }
      if (venta.content.length > 0) {
        this.venta = venta.content[0];

        this.contruirPersonaDetalleConfiguracion();
        this.construirMimLinksConfiguracion();
        this.obtenerDatosDesplegables();
        this.initForm(this.venta);
      }
    }, err => {
      this.frontService.alert.error(err.error.message);
    });
  }

  contruirPersonaDetalleConfiguracion() {
    this.mimPersonaDetalleConfiguracion = new MimPersonaDetalleConfiguracion();

    this.mimPersonaDetalleConfiguracion.title = this.datosAsociado.nomCli;
    // Configuaramos la informacion.
    this.mimPersonaDetalleConfiguracion.items = [
      {
        label: 'asociado.protecciones.portafolio.gestionListasRestrictivas.mimPersonaDetalle.noSolicitud',
        value: this.venta.idProceso
      },
      {
        label: 'asociado.protecciones.portafolio.gestionListasRestrictivas.mimPersonaDetalle.fechaSolicitud',
        value: this.venta.fechaSolicitud
      },
      {
        label: 'asociado.protecciones.portafolio.gestionListasRestrictivas.mimPersonaDetalle.estadoSolicitud',
        value: this.venta.mimEstadoVenta?.nombre
      },
      {
        label: 'asociado.protecciones.portafolio.gestionListasRestrictivas.mimPersonaDetalle.nombreAsociado',
        value: this.datosAsociado.nomCli
      },
      {
        label: 'asociado.protecciones.portafolio.gestionListasRestrictivas.mimPersonaDetalle.identificacionAsoiado',
        value: this.datosAsociado.nitCli
      },
      {
        label: 'asociado.protecciones.portafolio.gestionListasRestrictivas.mimPersonaDetalle.tipoMovimiento',
        value: this.venta.mimTipoMovimiento?.nombre
      },
      {
        label: 'asociado.protecciones.portafolio.gestionListasRestrictivas.mimPersonaDetalle.nivelRiesgoActual',
        value: this.datosAsociado.nivelRiesgo
      },
      {
        label: 'asociado.protecciones.portafolio.gestionListasRestrictivas.mimPersonaDetalle.categoriaAsociado',
        value: this.datosAsociado.categoriaAsociado
      },
      {
        label: 'asociado.protecciones.portafolio.gestionListasRestrictivas.mimPersonaDetalle.estadoAsociado',
        value: this.datosAsociado.desEstado
      },
      {
        label: 'asociado.protecciones.portafolio.gestionListasRestrictivas.mimPersonaDetalle.regionalAsociado',
        value: this.datosAsociado.regionalAso
      },
      {
        label: 'asociado.protecciones.portafolio.gestionListasRestrictivas.mimPersonaDetalle.oficinaVinvulacion',
        value: this.datosAsociado.desOficina
      },
      {
        label: 'asociado.protecciones.portafolio.gestionListasRestrictivas.mimPersonaDetalle.canalVenta',
        value: this.venta.mimCanal.nombre
      },
    ];
  }

  construirMimLinksConfiguracion() {
    this.mimLinksConfiguracion = new MimLinksConfiguracion();
    this.mimLinksConfiguracion.title = 'asociado.protecciones.portafolio.tituloLinks';
    this.mimLinksConfiguracion.collapsable = true;
    this.mimLinksConfiguracion.items = [
      {
        label: 'asociado.protecciones.portafolio.gestionListasRestrictivas.mimLinksConfiguracion.bitacora',
        key: 'bitacora',
        customGoTo: true,
        icon: {
          icon: 'icon-external-link text--blue1',
          css: 'btn btn--icon bg--blue2'
        }
      },
      {
        label: 'asociado.protecciones.portafolio.gestionListasRestrictivas.mimLinksConfiguracion.facturacion',
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
        label: 'asociado.protecciones.portafolio.gestionListasRestrictivas.mimLinksConfiguracion.detalleBeneficiario',
        key: 'beneficiariosAsociados',
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
        label: 'asociado.protecciones.portafolio.gestionListasRestrictivas.mimLinksConfiguracion.resumenVenta',
        key: 'resumenVenta',
        url: [
          UrlRoute.PAGES,
          UrlRoute.CONSULTAS,
          UrlRoute.CONSULTAS_ASOCIADO,
          this.datosAsociado.numInt,
          UrlRoute.PROTECCIONES,
          UrlRoute.PORTAFOLIO_BETA,
          UrlRoute.PORTAFOLIO_PLAN_COBERTURA_RESUMEN_VENTA_COBERTURAS,
          this.venta.idProceso
        ],
        icon: {
          icon: 'icon-external-link text--blue1',
          css: 'btn btn--icon bg--blue2'
        }
      },
      {
        label: 'asociado.protecciones.portafolio.gestionListasRestrictivas.mimLinksConfiguracion.portafolioProducto',
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
      },
    ];
  }

  private obtenerMimConceptoTareaFlujo(codigo: any) {
    return this.conceptos ? this.conceptos.find(mimConceptoTareaFlujo => mimConceptoTareaFlujo.codigo === codigo) : null;
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

  /**
     * Autor: Bayron Andres Perez M.
     * Función: obtener la informacion de las listas desplegables
  */
  async obtenerDatosDesplegables() {
    const _tarea = await this.backService.proceso.getTareasPorIdProceso(this.idProceso, { includeTaskLocalVariables: true, includeProcessVariables: true }).toPromise();
    this.tarea = _tarea[0];
    let mimFaseFlujo;

    this.tipoListaOficialCumplimiento = this.tarea.variables.tipoAprobacionListas === 'oficialCumplimiento';
    this.tipoListaJefeRiesgos = this.tarea.variables.tipoAprobacionListas === 'jefeRiesgos';

    if (this.tipoListaOficialCumplimiento) {
      mimFaseFlujo = MIM_PARAMETROS.MIM_FASE_FLUJO.OFICINA_CUMPLIMIENTO;
    } else if (this.tipoListaJefeRiesgos) {
      mimFaseFlujo = MIM_PARAMETROS.MIM_FASE_FLUJO.JEFE_RIESGOS;
    }

    const _conceptos = await this.backService.conceptoTareaFlujo.getConceptoTareaFlujo({
      'mimFaseFlujo.mimFaseProcesoSet.mimFaseProcesoPK.codigoProceso': GENERALES.PROCESO.INCREMENTOS,
      'mimFaseFlujo.codigo': mimFaseFlujo
    }).toPromise();
    this.conceptos = _conceptos._embedded.mimConceptoTareaFlujo;
  }

  /**
   * Autor: Bayron Andres Perez M.
   * Función: Inicializa el formulario
   */
  initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        concepto: new FormControl(param ?
          this.tipoListaOficialCumplimiento && param.mimConceptoOficialCumplimiento ? this.obtenerMimConceptoTareaFlujo(param.mimConceptoOficialCumplimiento.codigo) :
          this.tipoListaJefeRiesgos && param.mimConceptoJefeRiesgo ? this.obtenerMimConceptoTareaFlujo(param.mimConceptoJefeRiesgo.codigo) : null : null,
          [Validators.required]),
        observacion: new FormControl(null, [Validators.required]),
      }));
  }

  conceptoSelected(codigo: string) {
    return this.conceptos.find(x => x.codigo === codigo);
  }

  guardar() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((validateForm: string) => {
        this.frontService.alert.warning(validateForm);
      });
      return;
    }

    // Configuramos el concepto del auditor.
    // TODO(alobaton): Se debe validar el rol del usuario y configurar el concepto con base al rol.
    // Por ahora se configura el concepto del oficial de cumplimiento.
    // Se debe además consultar los conceptos y la logica del switch ajustarla de acuerdo al rol.
    const variables = {} as any;

    if (this.tipoListaOficialCumplimiento) {
      this.venta.mimConceptoOficialCumplimiento = this.form.controls.concepto.value;
      switch (this.venta.mimConceptoOficialCumplimiento.codigo) {
        case MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_VENTA_INCREMENTO_OFICIAL_CUMPLIMIENTO_DESFAVORABLE:
          variables.autorizadoPorListas = false;
          break;
        case MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_VENTA_INCREMENTO_OFICIAL_CUMPLIMIENTO_FAVORABLE:
          variables.autorizadoPorListas = true;
          break;
      }
    } else if (this.tipoListaJefeRiesgos) {
      this.venta.mimConceptoJefeRiesgo = this.form.controls.concepto.value;
      switch (this.venta.mimConceptoJefeRiesgo.codigo) {
        case MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_VENTA_INCREMENTO_JEFE_RIESGOS_DESFAVORABLE:
          variables.autorizadoPorListas = false;
          break;
        case MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_VENTA_INCREMENTO_JEFE_RIESGOS_FAVORABLE:
          variables.autorizadoPorListas = true;
          break;
      }
    }


    // Configuramos las observaciones.
    variables.comment = this.form.controls.observacion.value;

    this.venta.variables = variables;
    this.backService.venta.postGestionListasRestrictivas(this.venta).subscribe((mimVenta: any) => {
      this.initForm();
      this.frontService.alert.success(mimVenta.message).then(() => {
        this.form.reset();
        // Redirigir a resumen ventas
        this.router.navigate([
          UrlRoute.PAGES,
          UrlRoute.CONSULTAS,
          UrlRoute.CONSULTAS_ASOCIADO,
          this.datosAsociado.numInt,
          UrlRoute.PROTECCIONES,
          UrlRoute.PORTAFOLIO_BETA,
          UrlRoute.PORTAFOLIO_PLAN_COBERTURA_RESUMEN_VENTA_COBERTURAS,
          this.venta.idProceso
        ]);
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  ngOnDestroy() {
    this.store.dispatch(acciones.mostrarMenuConsultas({ datos: true }));
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  _onAtras() {
    this.location.back();
  }



}
