import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { masksPatterns } from '@shared/util/masks.util';
import { UrlRoute } from '@shared/static/urls/url-route';
import { forkJoin } from 'rxjs';
import { GENERALES } from '@shared/static/constantes/constantes';
import { Store } from '@ngrx/store';
import { AppState } from '@core/store/reducers';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
})
export class ConfiguracionComponent implements OnInit {

  dropdownOne: boolean;
  dropdownTwo: boolean;
  dropdownThree: boolean;
  estadoCard: any;

  solicitud: string;
  idProceso: string;
  showForm: boolean;
  showControlsAprobacion: boolean;
  observaciones: any;
  idTarea: string;
  esDirectorTecnico: boolean;
  isShowForm: Promise<any>;
  tituloModal: string;

  form: FormGroup;
  devolveList: any;
  formDevolver: FormGroup;
  mostrarModal: boolean;
  patterns = masksPatterns;

  codigoPlan: string;
  habilitarTerminar: boolean;
  dataRedux: any;
  devolverA: string;
  tipoProceso: string;

  constructor(
    private readonly translate: TranslateService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store<AppState>,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService,

  ) {
    this.tipoProceso = UrlRoute.ADMINISTRACION_ACTUARIA_CONFIGURAR;
    this.translate.get('administracion.actuaria.relacionFactoresCobertura.tituloModal').subscribe(texto => {
      this.tituloModal = texto;
    });
  }

  ngOnInit(): void {
    this._initFormDevolver();
    this.store.select('financieraConfiguracion').subscribe((datos) => {
      this.dataRedux = datos;
      if (datos && datos.relacionConceptosDeDistribucionCuenta) {
        this.habilitarTerminar = true;
      }
    });

    this.activatedRoute.params.subscribe((params: any) => {
      this.codigoPlan = params?.codigoPlan;
      this.idProceso = params.processInstanceId || null;
      this.idTarea = params.taskId || null;
      let objDatos = {
        _faseFlujo: this.backService.faseFlujo.getFaseFlujo({codigo: [MIM_PARAMETROS.MIM_FASE_FLUJO.TECNICA, MIM_PARAMETROS.MIM_FASE_FLUJO.ACTUARIA]})
      } as any;
      if (this.idProceso) {
        objDatos = {
          ...objDatos,
          _observaciones: this.backService.proceso.getObservacionesByIdProceso(this.idProceso)
        };
      }

      if (this.idTarea) {
        objDatos = {
          ...objDatos,
          _esDirectorTecnico: this.backService.tarea.obtenerTarea(this.idTarea)
        };
      }

      forkJoin(objDatos).subscribe((respuesta: any) => {
        this.validarPermiso(this.frontService.authentication.getUser().username === respuesta._esDirectorTecnico.userId);
        this.devolveList = [{codigo: null, nombre: 'Seleccionar'}];
        respuesta._faseFlujo._embedded.mimFaseFlujo.map(item => this.devolveList.push(item));
        this.observaciones = this.idProceso ? respuesta._observaciones : null;
        this.esDirectorTecnico = respuesta._esDirectorTecnico ? respuesta._esDirectorTecnico.taskDefinitionKey === GENERALES.TIPO_USUARIO_FLUJO.DIRECTOR_FINANCIERO ? true : false : false;
        this.isShowForm = Promise.resolve(
          this.showControlsAprobacion = this.esDirectorTecnico
        );
        if (this.esDirectorTecnico) {
          this.form.disable();
        }

      }, (err) => {
        this.frontService.alert.error(err.error.message);
      });

    });
  }

  _initFormDevolver() {
    this.form = this.formBuilder.group({
      devolve: new FormControl()
    });

    this.form.controls.devolve.valueChanges.subscribe(item => {
      if (item?.codigo) {
        this.translate.get('administracion.actuaria.relacionFactoresCobertura.tituloModal').subscribe(texto => {
          this.tituloModal = texto;
        });
        this.devolverA = null;
        if (item.codigo === MIM_PARAMETROS.MIM_FASE_FLUJO.TECNICA) {
          this.devolverA = GENERALES.DEVOLVER_A.TECNICO;
        }
        if (item.codigo === MIM_PARAMETROS.MIM_FASE_FLUJO.ACTUARIA) {
          this.devolverA = GENERALES.DEVOLVER_A.ACTUARIA;
        }

        this.isShowForm = Promise.resolve(
          this.showForm = true
        );
      }
    });
  }

  _initformObservacion() {
    this.formDevolver = this.formBuilder.group({
      observacion: new FormControl(null, [Validators.required, Validators.maxLength(999), Validators.pattern('.*\\S.*[a-zA-z0-9-zÀ-ÿ\u00f1\u00d1 ]')])
    });
  }

  terminar() {
    this.solicitud = UrlRoute.SOLICITUD_APROBACION;
    this.isShowForm = Promise.resolve(
      this.showForm = true
    );
  }

  /* Metodos para el flujo de eliminacion */
  /* Para el flujo de eliminacion */
  _guardarObservacion(datos: any) {
    datos.devolverA = this.devolverA ? this.devolverA : 'none';
    this._apruebaRechazaSolicitud(datos);
  }

  _apruebaRechazaSolicitud(datos: any) {

    if (this.esDirectorTecnico) {
        datos.aprobacionDirectorFinanciero = datos.aprobar;
    }
    this.backService.tarea.completarTarea(this.idTarea, datos).subscribe((resp: any) => {
      let _mensaje;
      let _obj;
      if (!this.esDirectorTecnico) {
        if (this.form.controls.devolve.value) {
          _mensaje = 'global.devolverA';
          _obj = {fase: this.form.controls.devolve.value.nombre};
        } else {
          _mensaje = 'global.solicitudCreacionActuaria';
        }
      } else {
          _mensaje = 'global.solicitudCreacionRechazadaMensaje';
      }

      this.translate.get(datos.aprobar ? 'global.finalizaFlujo' : _mensaje, _obj).subscribe((mensaje: string) => {
        this.frontService.alert.success(mensaje).then(() => {
          this.router.navigate([UrlRoute.PAGES, UrlRoute.HOME]);
        });
      });

    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  _toggleObservaciones(showModal?: boolean) {
    this.form.controls.devolve.reset();
  }

  _toggleModal() {
    this.mostrarModal = !this.mostrarModal;
    this.form.controls.devolve.reset();
  }

  private validarPermiso(autorizado: boolean) {
    if (!autorizado) {
      this.translate.get('error.403.mensaje').subscribe(msn => {
        this.frontService.alert.info(msn).then(() => { this.router.navigate([UrlRoute.PAGES]); });
      });
      return;
    }
  }

}
