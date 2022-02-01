import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatosAsociadoWrapper } from '@core/store/asociado-data.service';
import { DataService } from '@core/store/data.service';
import { Subscription, forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from '@core/store/reducers';
import { Store } from '@ngrx/store';
import * as acciones from '../portafolio.actions';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MimLinkConfiguracion, MimLinksConfiguracion } from '@shared/components/mim-links/mim-links.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { TranslateService } from '@ngx-translate/core';
import { FormValidate } from '@shared/util';
import { masksPatterns } from '@shared/util/masks.util';
import { MimPersonaDetalleConfiguracion } from '@shared/components/mim-persona-detalle/mim-persona-detalle.component';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-gestion-auxiliar-medico',
  templateUrl: './gestion-auxiliar-medico.component.html',
})
export class GestionAuxiliarMedicoComponent extends FormValidate implements OnInit, OnDestroy {

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

  constructor(private readonly route: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly dataService: DataService,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService,
    private readonly router: Router
  ) { super(); }

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
        observacion: [null, [Validators.required]]
      })
    );
  }

  ngOnDestroy(): void {
    this.store.dispatch(acciones.mostrarMenuConsultas({ datos: true }));
    this.subs.forEach((item: Subscription) => item.unsubscribe());
  }

  private precargarDatos() {
    forkJoin({
      _venta: this.backService.venta.getVenta({ idProceso: this.idProceso })
    }).subscribe(async (resp: any) => {
      if (resp._venta.content.length > 0) {
        this.venta = resp._venta.content[0];

        this.contruirPersonaDetalleConfiguracion();
        this.construirMimLinksConfiguracion();

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
        label: 'asociado.protecciones.portafolio.auditoriaMedicaVentas.personaDetalle.numeroSolicitud',
        value: this.venta.idProceso
      },
      {
        label: 'asociado.protecciones.portafolio.auditoriaMedicaVentas.personaDetalle.fechaSolicitud',
        value: this.venta.fechaSolicitud
      },
      {
        label: 'asociado.protecciones.portafolio.auditoriaMedicaVentas.personaDetalle.nombre',
        value: this.datosAsociado.nomCli
      },
      {
        label: 'asociado.protecciones.portafolio.auditoriaMedicaVentas.personaDetalle.cedula',
        value: this.datosAsociado.nitCli
      },
      {
        label: 'asociado.protecciones.portafolio.auditoriaMedicaVentas.personaDetalle.correoElectronico',
        value: this.venta.correoElectronico
      },
      {
        label: 'asociado.protecciones.portafolio.auditoriaMedicaVentas.personaDetalle.celular',
        value: this.datosAsociado.cel
      },
      {
        label: 'asociado.protecciones.portafolio.auditoriaMedicaVentas.personaDetalle.telefonoFijo',
        value: this.datosAsociado.telRes
      },
      {
        label: 'asociado.protecciones.portafolio.auditoriaMedicaVentas.personaDetalle.categoriaAsociado',
        value: this.datosAsociado.categoriaAsociado
      },
      {
        label: 'asociado.protecciones.portafolio.auditoriaMedicaVentas.personaDetalle.canalVenta',
        value: this.venta.mimCanal?.nombre
      },
      {
        label: 'asociado.protecciones.portafolio.auditoriaMedicaVentas.personaDetalle.oficinaVinculacion',
        value: this.datosAsociado.desOficina
      },
      {
        label: 'asociado.protecciones.portafolio.auditoriaMedicaVentas.personaDetalle.regional',
        value: this.datosAsociado.regionalAso
      },
      {
        label: 'asociado.protecciones.portafolio.auditoriaMedicaVentas.personaDetalle.proyectoVida',
        value: this.venta.mimProyectoVida?.nombre || this.venta.otroProyectoVida
      }
    ];
  }

  construirMimLinksConfiguracion() {
    this.mimLinksConfiguracion = new MimLinksConfiguracion();
    this.mimLinksConfiguracion.title = 'asociado.protecciones.portafolio.tituloLinks';
    this.mimLinksConfiguracion.collapsable = true;
    this.mimLinksConfiguracion.items = [
      {
        label: 'asociado.protecciones.portafolio.auditoriaMedicaVentas.links.declaracionSalud',
        key: 'declaracionSalud',
        url: [
          UrlRoute.PAGES,
          UrlRoute.CONSULTAS,
          UrlRoute.CONSULTAS_ASOCIADO,
          this.datosAsociado.numInt,
          UrlRoute.PROTECCIONES,
          UrlRoute.PORTAFOLIO_BETA,
          UrlRoute.PORTAFOLIO_PLAN_COBERTURA_DECLARACION_SALUD_VISTA,
          this.idProceso
        ],
        icon: {
          icon: 'icon-external-link text--blue1',
          css: 'btn btn--icon bg--blue2'
        }
      },
      {
        label: 'asociado.protecciones.portafolio.auditoriaMedicaVentas.links.preexistencia',
        key: 'preexistencia',
        url: [
          UrlRoute.PAGES,
          UrlRoute.CONSULTAS,
          UrlRoute.CONSULTAS_ASOCIADO,
          this.datosAsociado.numInt,
          UrlRoute.PREEXISTENCIAS
        ],
        icon: {
          icon: 'icon-external-link text--blue1',
          css: 'btn btn--icon bg--blue2'
        }
      },
      {
        label: 'asociado.protecciones.portafolio.auditoriaMedicaVentas.links.verPortafolio',
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
      {
        label: 'asociado.protecciones.portafolio.auditoriaMedicaVentas.links.verBitacora',
        key: 'bitacora',
        customGoTo: true,
        icon: {
          icon: 'icon-external-link text--blue1',
          css: 'btn btn--icon bg--blue2'
        }
      },
      {
        label: 'asociado.protecciones.portafolio.auditoriaMedicaVentas.links.resumenVenta',
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

    ];
  }

  guardar() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }

    const variables = {
    } as any;

    // Configuramos las observaciones.
    variables.comment = this.form.controls.observacion.value;

    this.venta.variables = variables;
    this.backService.venta.postSolicitarInformacion(this.venta).subscribe((mimVenta: any) => {
      this.initForm();
      this.frontService.alert.success(mimVenta.message).then(() => {
        this.router.navigate([UrlRoute.PAGES]);
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

}
