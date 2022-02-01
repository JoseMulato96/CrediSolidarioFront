import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatosAsociadoWrapper } from '@core/store/asociado-data.service';
import { DataService } from '@core/store/data.service';
import { Subscription, forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from '@core/store/reducers';
import { Store } from '@ngrx/store';
import * as acciones from '../portafolio.actions';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { MimLinkConfiguracion, MimLinksConfiguracion } from '@shared/components/mim-links/mim-links.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { TranslateService } from '@ngx-translate/core';
import { FormValidate } from '@shared/util';
import { masksPatterns } from '@shared/util/masks.util';
import { MimPersonaDetalleConfiguracion } from '@shared/components/mim-persona-detalle/mim-persona-detalle.component';
import { DateUtil } from '@shared/util/date.util';
import { environment } from '@environments/environment';
import { GENERALES } from '@shared/static/constantes/constantes';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-gestion-area-tecnica',
  templateUrl: './gestion-area-tecnica.component.html',
})
export class GestionAreaTecnicaComponent extends FormValidate implements OnInit, OnDestroy {

  asoNumInt: string;
  datosAsociado: any;

  idProceso: string;
  mostrarBitacora: any;

  taskId: string;
  venta: any;

  mimLinksConfiguracion: MimLinksConfiguracion;
  mimPersonaDetalleConfiguracion: MimPersonaDetalleConfiguracion;

  subs: Subscription[] = [];

  form: FormGroup;
  isForm: Promise<any>;
  patterns = masksPatterns;
  conceptoTareaFlujoSelect: any = [];
  razonNegacionSelect: any = [];
  razonDevolucionSelect: any = [];
  dataInitDevolverPorError: any;
  esGlosar: boolean;
  bloquearBotonGuardar: boolean;
  datosCarta: any;
  firmas: any;
  datosUsuario: any;
  datosFirma: any;
  tiposCartas: any;
  esGenerarCarta: boolean;
  fechaActual = new Date(Date.now());

  constructor(private readonly route: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly dataService: DataService,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService,
    private readonly router: Router
  ) {
    super();
    this.esGlosar = false;
    this.esGenerarCarta = false;
    this.datosFirma = {};
  }

  ngOnInit() {
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

    this.subs.push(
      this.route.parent.parent.parent.parent.parent.params.subscribe(params => {
        this.asoNumInt = params.asoNumInt;
        if (!this.asoNumInt) {
          return;
        }
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

  private initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        conceptoTareaFlujo: [null, [Validators.required]],
        razonNegacion: [null],
        razonDevolucion: [null],
        observacion: [null, [Validators.required]],
        generarCarta: this.formBuilder.group({
          observacionCarta: [null],
          mimTipoCartaSet: [null]
        })
      })
    );
    this.form.controls.razonNegacion.disable();
    this.changeConceptoTareaFlujo();
    this.form.controls.conceptoTareaFlujo.setValue(param && param.mimConceptoTareaFlujoAreaTecnica ? this.obtenerMimConceptoTareaFlujo(param.mimConceptoTareaFlujoAreaTecnica.codigo) : null);
  }

  private changeConceptoTareaFlujo() {
    const _generarCarta = this.form.controls.generarCarta['controls'];
    this.form.controls.conceptoTareaFlujo.valueChanges.subscribe(async item => {
      if (item === null || item === undefined) {
        return;
      }
      this.esGlosar = false;
      this.esGenerarCarta = false;

      _generarCarta.observacionCarta.reset();

      this.form.controls.razonNegacion.setValidators(null);
      this.form.controls.razonNegacion.setValue(null);
      this.form.controls.razonNegacion.disable();

      this.form.controls.razonDevolucion.setValidators(null);
      this.form.controls.razonDevolucion.setValue(null);
      this.form.controls.razonDevolucion.disable();

      _generarCarta.observacionCarta.setValidators(null);
      _generarCarta.observacionCarta.setValue(null);

      _generarCarta.mimTipoCartaSet.setValidators(null);
      _generarCarta.mimTipoCartaSet.setValue(null);

      if (item.codigo === MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_VENTA_INCREMENTO_GESTION_AREA_TECNICA_DESFAVORABLE) {
        this.form.controls.razonNegacion.setValidators([Validators.required]);
        this.form.controls.razonNegacion.enable();
      } else if (item.codigo === MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_VENTA_INCREMENTO_GESTION_AREA_TECNICA_GLOSAR) {
        this.esGlosar = true;
        this.form.controls.razonDevolucion.setValidators([Validators.required]);
        this.form.controls.razonDevolucion.enable();
      } else if (item.codigo === MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_VENTA_INCREMENTO_GESTION_AREA_TECNICA_SOLICITAR_INFORMACION) {
        _generarCarta.observacionCarta.setValidators([Validators.required]);
        _generarCarta.mimTipoCartaSet.setValidators([Validators.required]);
        const _formatoCarta = await this.backService.cartaFase.getCartaFase({
          'mimFaseFlujo.codigo': MIM_PARAMETROS.MIM_FASE_FLUJO.GESTION_AREA_TECNICA,
          'mimConceptoFlujo.codigo': MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_VENTA_INCREMENTO_GESTION_AREA_TECNICA_SOLICITAR_INFORMACION
        }).toPromise().catch(err => this.frontService.alert.error(err.error.message));

        if (_formatoCarta) {
          this.tiposCartas = _formatoCarta.content.map(x => {
            return {
              codigo: x.mimParametroCarta.codigo,
              nombre: x.mimParametroCarta.nombre,
              contenido: atob(x.mimParametroCarta.contenido),
              estado: x.mimParametroCarta.estado,
            };
          });
        }

        this.datosCarta = {
          tiposCartas: this.tiposCartas,
          generarCarta: false,
        };

        this.esGenerarCarta = true;
      }
    });


    _generarCarta.mimTipoCartaSet.valueChanges.subscribe(async item => {
      if (!item) { return; }
      _generarCarta.observacionCarta.setValue(null, { emitEvent: false });
      await this.getDatosFirma();

      this.datosCarta = {
        ...this.datosCarta,
        tituloCarta: 'Carta de ' + item.nombre,
        diligenciarCarta: true,
        tipoCartaSeleccionada: item,
        cuerpoCarta: this.construirCuperpoCarta(),
        parametrosCarta: this.parametrosCarta()
      };
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
        'mimFaseFlujo.codigo': MIM_PARAMETROS.MIM_FASE_FLUJO.GESTION_AREA_TECNICA
      }),
      _razonNegacion: this.backService.razonNegacion.getRazonesNegacion({
        'mimFaseFlujo.codigo': MIM_PARAMETROS.MIM_FASE_FLUJO.GESTION_AREA_TECNICA
      }),
      _razonDevolucion: this.backService.razonGlosa.getRazonGlosa({
        'mimFaseFlujo.codigo': MIM_PARAMETROS.MIM_FASE_FLUJO.GESTION_AREA_TECNICA
      }),
      _tarea: this.backService.proceso.getTareasPorIdProceso(this.idProceso, { includeTaskLocalVariables: true, includeProcessVariables: true })
    }).subscribe(async (resp: any) => {
      if (resp._venta.content.length > 0) {
        this.venta = resp._venta.content[0];

        this.contruirPersonaDetalleConfiguracion();
        this.construirMimLinksConfiguracion();

        this.conceptoTareaFlujoSelect = resp._conceptoTarea._embedded.mimConceptoTareaFlujo;
        this.razonNegacionSelect = resp._razonNegacion._embedded.mimRazonNegacion;

        this.razonDevolucionSelect = resp._razonDevolucion._embedded.mimRazonGlosa;

        // Con base en las variables que tenga la tarea, debemos configurar que
        // fases se muestran para permitir la devolucion por error.
        const tarea = resp._tarea[0];
        const codigo = [];

        if (tarea && tarea.variables && tarea.variables.requiereMesaControl) {
          codigo.push(MIM_PARAMETROS.MIM_FASE_FLUJO.MESA_CONTROL);
        } else {
          codigo.push(MIM_PARAMETROS.MIM_FASE_FLUJO.REGISTRO_INCREMENTO);
        }

        this.initForm(this.venta);
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

    this.mimPersonaDetalleConfiguracion.title = this.datosAsociado.nomCli;
    // Configuaramos la informacion.
    this.mimPersonaDetalleConfiguracion.items = [
      {
        label: 'asociado.protecciones.portafolio.gestionAreaTecnica.personaDetalle.numeroSolicitud',
        value: this.venta.idProceso
      },
      {
        label: 'asociado.protecciones.portafolio.gestionAreaTecnica.personaDetalle.fechaSolicitud',
        value: this.venta.fechaSolicitud
      },
      {
        label: 'asociado.protecciones.portafolio.gestionAreaTecnica.personaDetalle.estadoSolicitud',
        value: this.venta.mimEstadoVenta?.nombre
      },
      {
        label: 'asociado.protecciones.portafolio.gestionAreaTecnica.personaDetalle.tipoMovimiento',
        value: this.venta.mimTipoMovimiento?.nombre
      },
      /* {
        label: 'asociado.protecciones.portafolio.gestionAreaTecnica.personaDetalle.nivelRiesgoIngreso',
        value: this.datosAsociado.nivelRiesgo
      }, */
      {
        label: 'asociado.protecciones.portafolio.gestionAreaTecnica.personaDetalle.oficinaVinvulacion',
        value: this.datosAsociado.desOficina
      },
      {
        label: 'asociado.protecciones.portafolio.gestionAreaTecnica.personaDetalle.regionalAsociado',
        value: this.datosAsociado.regionalAso
      },
      {
        label: 'asociado.protecciones.portafolio.gestionAreaTecnica.personaDetalle.categoriaAsociado',
        value: this.datosAsociado.categoriaAsociado
      },
      {
        label: 'asociado.protecciones.portafolio.gestionAreaTecnica.personaDetalle.estadoAsociado',
        value: this.datosAsociado.desEstado
      },
    ];
  }

  construirMimLinksConfiguracion() {
    this.mimLinksConfiguracion = new MimLinksConfiguracion();
    this.mimLinksConfiguracion.title = 'asociado.protecciones.portafolio.tituloLinks';
    this.mimLinksConfiguracion.collapsable = true;
    this.mimLinksConfiguracion.items = [
      {
        label: 'asociado.protecciones.portafolio.gestionAreaTecnica.links.bitacora',
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
        label: 'asociado.protecciones.portafolio.gestionAreaTecnica.links.detalleBeneficiario',
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
        label: 'asociado.protecciones.portafolio.gestionAreaTecnica.links.resumenVenta',
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
        label: 'asociado.protecciones.portafolio.gestionAreaTecnica.links.portafolioProducto',
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
    return this.conceptoTareaFlujoSelect ? this.conceptoTareaFlujoSelect.find(mimConceptoTareaFlujo => mimConceptoTareaFlujo.codigo === codigo) : null;
  }

  guardar() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }

    if (this.form.controls.generarCarta.invalid) {
      this.validateForm(this.form.controls.generarCarta as FormGroup);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return false;
    }

    // Configuramos el concepto
    const conceptoTareaFlujo = this.form.controls.conceptoTareaFlujo.value;
    const comentario = [];
    const variables = {
      devueltoErrorTecnica: 'none',
      solicitarInformacion: false
    } as any;

    switch (conceptoTareaFlujo.codigo) {
      case MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_VENTA_INCREMENTO_GESTION_AREA_TECNICA_GLOSAR:
        this.venta.mimRazonGlosaAreaTecnica = this.form.controls.razonDevolucion.value;
        break;
      case MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_VENTA_INCREMENTO_GESTION_AREA_TECNICA_SOLICITAR_INFORMACION:
        variables.solicitarInformacion = true;
        const _generarCarta = this.form.controls.generarCarta['controls'];
        variables.contenidoCarta = _generarCarta.observacionCarta.value;
        break;
      case MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_VENTA_INCREMENTO_GESTION_AREA_TECNICA_DESFAVORABLE:
        this.venta.mimRazonNegacionAreaTecnica = this.form.controls.razonNegacion.value;
        variables.autorizadoTecnica = false;
        break;
      case MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_VENTA_INCREMENTO_GESTION_AREA_TECNICA_FAVORABLE:
        variables.autorizadoTecnica = true;
        break;
    }

    comentario.push(this.form.controls.observacion.value);
    const observacion = comentario.join(': ');

    // Configuramos las observaciones.
    variables.comment = observacion;

    this.venta.variables = variables;
    this.venta.mimConceptoTareaFlujoAreaTecnica = this.form.controls.conceptoTareaFlujo.value;
    this.bloquearBotonGuardar = true;

    this.backService.venta.postGestionAreaTecnica(this.venta).subscribe((mimVenta: any) => {
      this.bloquearBotonGuardar = false;
      this.initForm();
      this.datosCarta = null;
      this.frontService.alert.success(mimVenta.message).then(() => {
        this.router.navigate([UrlRoute.PAGES]);
      });
    }, (err) => {
      this.bloquearBotonGuardar = false;
      this.frontService.alert.error(err.error.message);
    });
  }

  private construirCuperpoCarta() {
    let strCarta = this.tiposCartas[0].contenido;
    strCarta = strCarta && strCarta.replace(/\[/g, '').replace(/\]/g, '')
      .replace(/\$\{dia\}/g, this.fechaActual.getDate().toString())
      .replace(/\$\{mes\}/g, DateUtil.nombreMes(this.fechaActual.getMonth() + 1))
      .replace(/\$\{anio\}/g, this.fechaActual.getFullYear().toString())
      .replace(/\$\{asociado\.nombre\}/g, this.datosAsociado.nombreAsociado)
      .replace(/\$\{asociado\.tipoDocumento\}/g, this.datosAsociado.desTipDoc)
      .replace(/\$\{asociado\.nroIdentificacion\}/g, this.datosAsociado.nitCli)
      .replace(/\$\{asociado\.barrioCorrespondencia\}/g, this.datosAsociado.barRes || '')
      .replace(/\$\{asociado\.direccionCorrespondencia\}/g, this.datosAsociado.dirRes || '')
      .replace(/\$\{asociado\.ciudadCorrespondencia\}/g, this.datosAsociado.ciuRes || '')
      .replace(/\$\{venta\.plan\.nombre\}/g, this.venta.mimPlan.nombre || '')
      .replace(/\$\{venta\.idProceso\}/g, this.idProceso)
      .replace(/th:src/g, 'src')
      .replace(/@{\${datosFirma\.src}}/g, this.datosFirma.src)
      .replace(/\$\{datosFirma\.nombre\}/g, this.datosFirma.nombre || '')
      .replace(/\$\{datosFirma\.cargo\}/g, this.datosFirma.cargo || '')
      .replace(/\$\{datosFirma\.email\}/g, this.datosFirma.email || '')
      .replace(/\$\{datosFirma\.telefono\}/g, this.datosFirma.telefono || '');

    return strCarta.split('\$\{comment\}');
  }

  private async getDatosFirma() {
    const cargo = 'Jefe';
    // Se consultan los datos de la firma correspondiente a la regional del asociado
    const param: any = { isPaged: false, estado: true, cargo: cargo, regional: this.datosAsociado.regionalAso };

    const _firmas = await this.backService.parametroFirma.obtenerFirmas(param).toPromise().catch(err => this.frontService.alert.error(err.error.message));
    if (_firmas) {
      this.firmas = _firmas.content[0];
      // Se consultan los datos de la persona que firma
      const _datosUsuario = await this.backService.sispro.getDatosUser({ tipoIdentificacion: 'CC', numeroIdentificacion: this.firmas.numeroIdentificacion })
        .toPromise().catch(err => this.frontService.alert.error(err.error.message));
      if (_datosUsuario) {
        this.datosUsuario = _datosUsuario.user;
        this.datosFirma.nombre = this.datosUsuario.name;
        this.datosFirma.email = this.datosUsuario.email;
        this.datosFirma.telefono = this.datosUsuario.telephone;
        this.datosFirma.cargo = this.datosUsuario.title.description + ' ' + this.datosUsuario.regional.description;
        // Ruta de la imagen de la firma
        this.datosFirma.src = `${environment.miMutualUtilidadesUrl}/${this.firmas.firma}`;
      }
    } else {
      this.translate.get('global.noHayFirma').subscribe((response: string) => {
        this.frontService.alert.info(response);
      });
    }
  }

  private parametrosCarta() {
    const parameters: any = {};
    const _generarCarta = this.form.controls.generarCarta['controls'];

    parameters.dia = this.fechaActual.getDate();
    parameters.mes = DateUtil.nombreMes(this.fechaActual.getMonth() + 1);
    parameters.anio = this.fechaActual.getFullYear();
    parameters.comment = _generarCarta.observacionCarta.value;

    // Datos del asociado
    parameters.asociado = {
      nombre: this.datosAsociado.nombreAsociado,
      tipoDocumento: this.datosAsociado.desTipDoc,
      nroIdentificacion: this.datosAsociado.nitCli,
      direccionCorrespondencia: this.datosAsociado.dirRes || '',
      barrioCorrespondencia: this.datosAsociado.barRes || '',
      ciudadCorrespondencia: this.datosAsociado.ciuRes || ''
    };
    // Datos de la venta.
    parameters.venta = {
      idProceso: this.idProceso,
      plan: {
        nombre: this.venta.mimPlan.nombre
      }
    };
    // Datos de la firma.
    parameters.datosFirma = this.datosFirma;

    return parameters;
  }

}
