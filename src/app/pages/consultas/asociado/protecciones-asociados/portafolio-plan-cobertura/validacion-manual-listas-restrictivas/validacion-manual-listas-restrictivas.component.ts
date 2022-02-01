import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormValidate } from '@shared/util';
import { Subscription, forkJoin } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { masksPatterns } from '@shared/util/masks.util';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '@core/store/data.service';
import { Store } from '@ngrx/store';
import * as acciones from '../portafolio.actions';
import { AppState } from '@core/store/reducers';
import { UrlRoute } from '@shared/static/urls/url-route';
import { MimLinksConfiguracion, MimLinkConfiguracion } from '@shared/components/mim-links/mim-links.component';
import { DatosAsociadoWrapper } from '@core/store/asociado-data.service';
import { GENERALES } from '@shared/static/constantes/constantes';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { MimPersonaDetalleConfiguracion } from '@shared/components/mim-persona-detalle/mim-persona-detalle.component';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-validacion-manual-listas-restrictivas',
  templateUrl: './validacion-manual-listas-restrictivas.component.html',
  styleUrls: ['./validacion-manual-listas-restrictivas.component.css']
})
export class ValidacionManualListasRestrictivasComponent extends FormValidate implements OnInit, OnDestroy {

  mimPersonaDetalleConfiguracion: MimPersonaDetalleConfiguracion;

  datosAsociado: any;
  mostrarDatosEvento: boolean;
  subs: Subscription[] = [];
  asoNumInt: string;
  form: FormGroup;
  isForm: Promise<any>;
  conceptoAuditorSelect: any = [];
  mimLinksConfiguracion: any;
  mostrarBitacora: any;
  idProceso: string;
  taskId: string;
  venta: any;
  patterns = masksPatterns;
  windowReference: any;
  declaracionSalud: any;
  imc: number;
  showPortal: boolean;
  nombreDocumento: string;
  archivoCarga: File;
  formData: FormData;
  extencionesPermitidas = ['xlsx', 'xls'];
  tipoArchivos: any;

  _conceptos: any = [];
  bloquearBotonGuardar: boolean;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly dataService: DataService,
    private readonly store: Store<AppState>,
    private readonly formBuilde: FormBuilder,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService,
    private readonly router: Router

  ) {
    super();
    this.nombreDocumento = 'Selecciones';
  }

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
      this.dataInit();
    })
    );
  }

  contruirPersonaDetalleConfiguracion() {
    this.mimPersonaDetalleConfiguracion = new MimPersonaDetalleConfiguracion();

    this.mimPersonaDetalleConfiguracion.title = this.datosAsociado.nomCli;
    // Configuaramos la informacion.
    this.mimPersonaDetalleConfiguracion.items = [
      {
        label: 'asociado.protecciones.portafolio.gestionListasRestrictivas.mimPersonaDetalle.noSolicitud',
        value: this.venta.codigo
      },
      {
        label: 'asociado.protecciones.portafolio.gestionListasRestrictivas.mimPersonaDetalle.fechaSolicitud',
        value: this.venta.fechaSolicitud
      },
      {
        label: 'asociado.protecciones.portafolio.gestionListasRestrictivas.mimPersonaDetalle.estadoSolicitud',
        value: this.venta.mimEstadoVenta.nombre
      },
      {
        label: 'asociado.protecciones.portafolio.gestionListasRestrictivas.mimPersonaDetalle.nombreAsociado',
        value: this.venta.asociado.nomCli
      },
      {
        label: 'asociado.protecciones.portafolio.gestionListasRestrictivas.mimPersonaDetalle.identificacionAsoiado',
        value: this.venta.asociado.nitCli
      },
      {
        label: 'asociado.protecciones.portafolio.gestionListasRestrictivas.mimPersonaDetalle.tipoMovimiento',
        value: this.venta.mimTipoMovimiento.nombre
      },
      {
        label: 'asociado.protecciones.portafolio.gestionListasRestrictivas.mimPersonaDetalle.nivelRiesgoActual',
        value: this.datosAsociado.nivelRiesgo
      },
      {
        label: 'asociado.protecciones.portafolio.gestionListasRestrictivas.mimPersonaDetalle.categoriaAsociado',
        value: this.venta.asociado.tipoVin
      },
      {
        label: 'asociado.protecciones.portafolio.gestionListasRestrictivas.mimPersonaDetalle.estadoAsociado',
        value: this.venta.asociado.desEstado
      },
      {
        label: 'asociado.protecciones.portafolio.gestionListasRestrictivas.mimPersonaDetalle.regionalAsociado',
        value: this.venta.asociado.regionalAso
      },
      {
        label: 'asociado.protecciones.portafolio.gestionListasRestrictivas.mimPersonaDetalle.oficinaVinvulacion',
        value: this.venta.asociado.desOficina
      },
      {
        label: 'asociado.protecciones.portafolio.gestionListasRestrictivas.mimPersonaDetalle.canalVenta',
        value: this.venta.mimCanal.nombre
      }
    ];
  }

  private initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilde.group({
        concepto: [param && param.mimConceptoOficialCumplimiento ? this.obtenerMimConceptoTareaFlujo(param.mimConceptoOficialCumplimiento.codigo) : null, [Validators.required]],
        observacion: [null, [Validators.required]]
      })
    );

  }

  ngOnDestroy(): void {
    this.store.dispatch(acciones.mostrarMenuConsultas({ datos: true }));
    this.subs.forEach((item: Subscription) => item.unsubscribe());
  }

  private dataInit() {
    forkJoin({
      _venta: this.backService.venta.getVenta({ idProceso: this.idProceso }),
      _conceptos: this.backService.conceptoTareaFlujo.getConceptoTareaFlujo({
        'mimFaseFlujo.mimFaseProcesoSet.mimFaseProcesoPK.codigoProceso': GENERALES.PROCESO.INCREMENTOS,
        'mimFaseFlujo.codigo': MIM_PARAMETROS.MIM_FASE_FLUJO.OFICINA_CUMPLIMIENTO
      })
    }).subscribe((resp: any) => {
      if (resp._venta.content.length > 0) {
        this.venta = resp._venta.content[0];

        this.contruirPersonaDetalleConfiguracion();
        this.construirMimLinksConfiguracion();
        this.conceptoAuditorSelect = resp._conceptos._embedded.mimConceptoTareaFlujo;
        this.initForm(this.venta);
      } else {
        this.translate.get('asociado.protecciones.portafolio.resumen.alertas.noEncontroVenta').subscribe(mensaje => {
          this.frontService.alert.info(mensaje).then(() => {
            this.router.navigate([UrlRoute.PAGES]);
          });
        });
      }
    }, err => {
      this.frontService.alert.error(err.error.message);
    });
  }

  customGoTo(item: MimLinkConfiguracion) {
    if (item.key === 'bitacora') {
      this.mostrarBitacora = true;
    }
  }

  cerrarModalBitacora() {
    this.mostrarBitacora = false;
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
          this.idProceso
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
    this.validarListasRestrictivas();
  }



  // Metodo para enviar el archivo
  validarListasRestrictivas() {
    // Se setean valores para la venta
    this.venta.mimConceptoOficialCumplimiento = this.form.controls.concepto.value;
    const variables = {} as any;
    switch (this.venta.mimConceptoOficialCumplimiento.codigo) {
      case MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_VENTA_INCREMENTO_OFICIAL_CUMPLIMIENTO_FAVORABLE:
        variables.autorizadoPorListas = true;
        break;
      case MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_VENTA_INCREMENTO_OFICIAL_CUMPLIMIENTO_DESFAVORABLE:
        variables.autorizadoPorListas = false;
        break;
    }
    // Configuramos las observaciones.
    variables.comment = this.form.controls.observacion.value;
    this.venta.variables = variables;
    // Servicio para enviar el archivo
    this.backService.venta.postValidarListasRestrictivas(this.venta).subscribe((mimVenta: any) => {
      this.bloquearBotonGuardar = false;
      this.archivoCarga = null;
      this.initForm();
      this.frontService.alert.success(mimVenta.message).then(() => {
        this.router.navigate([UrlRoute.PAGES]);
      });
    }, (err) => {
      this.bloquearBotonGuardar = false;
      this.frontService.alert.error(err.error.message);
    });
  }
}
