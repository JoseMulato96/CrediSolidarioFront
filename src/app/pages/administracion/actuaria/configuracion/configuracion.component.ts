import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FrontFacadeService, BackFacadeService } from '@core/services';
import { AppState } from '@core/store/reducers';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { GENERALES } from '@shared/static/constantes/constantes';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { UrlRoute } from '@shared/static/urls/url-route';
import { masksPatterns } from '@shared/util/masks.util';
import { forkJoin } from 'rxjs';

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

  statusOpenMasive: Boolean = true;

  codigoPlan: string;
  devolverTecnico: boolean;
  habilitarTerminar: boolean;
  listConceptoDistribucion: any;
  listCargueMasivo: any;
  tipoProceso: string;

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store<AppState>,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    this.tipoProceso = UrlRoute.ADMINISTRACION_ACTUARIA_CONFIGURAR;
    this.estadoCard = this.backService.actuaria.getEstadosCard();
    this.translate.get('administracion.actuaria.relacionFactoresCobertura.tituloModal').subscribe(texto => {
      this.tituloModal = texto;
    });
  }

  ngOnInit(): void {
    this.store.select('acturiaConfiguracion').subscribe((datos) => {
      if (!datos || !datos.conceptoDistribucion || datos.conceptoDistribucion.length <= 0) {
        return;
      }
      this.listConceptoDistribucion = datos.conceptoDistribucion;
      if (!datos.cargueMasivoFactores || datos.cargueMasivoFactores.length <= 0) {
        return;
      }

      if (!datos.coberturasCargueMasivo) {
        return;
      }
      let falta: Boolean = false;
      datos.coberturasCargueMasivo.map(planCobertura => {
        let objectFilter: Array<any> = datos.cargueMasivoFactores.filter(item => item.mimPlanCobertura && item.mimPlanCobertura.codigo === planCobertura.codigo);
        if (!falta && objectFilter.filter(reslt => reslt.mimTipoFactor.codigo === '2' || reslt.mimTipoFactor.codigo === '1' || reslt.mimTipoFactor.codigo === '3').length >= 2) {
          falta = false;
          this.habilitarTerminar = true;
          this.listCargueMasivo = datos.cargueMasivoFactores;
          return;
        } else {
          falta = true;
          this.habilitarTerminar = false;
          this.listCargueMasivo = null;
          return;
        }
      });
    });

    this._initFormDevolver();
    this.activatedRoute.params.subscribe((params: any) => {
      this.codigoPlan = params?.codigoPlan;
      this.idProceso = params.processInstanceId || null;
      this.idTarea = params.taskId || null;
      let objDatos = {
        _faseFlujo: this.backService.faseFlujo.getFaseFlujo({ codigo: MIM_PARAMETROS.MIM_FASE_FLUJO.TECNICA }),
        _mimPlan: this.backService.planes.getPlan(this.codigoPlan)
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
        this.devolveList = [{ codigo: null, nombre: 'Seleccionar' }];
        respuesta._faseFlujo._embedded.mimFaseFlujo.map(item => this.devolveList.push(item));
        this.observaciones = this.idProceso ? respuesta._observaciones : null;
        this.esDirectorTecnico = respuesta._esDirectorTecnico ? respuesta._esDirectorTecnico.taskDefinitionKey === GENERALES.TIPO_USUARIO_FLUJO.DIRECTOR_ACTUARIA ? true : false : false;
        this.statusOpenMasive = respuesta ? respuesta._mimPlan ? respuesta._mimPlan.requiereCargarFactoresPlan !== undefined ? respuesta._mimPlan.requiereCargarFactoresPlan : true : true : true;
        this.listCargueMasivo = respuesta ? respuesta._mimPlan ? respuesta._mimPlan.requiereCargarFactoresPlan !== undefined ? !respuesta._mimPlan.requiereCargarFactoresPlan ? true : null : false : false : false;
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

  public disabledCargueMasivo(event: any): void {
    if (!event.currentTarget.checked) {
      this.validOpenSeccion(true);
      this.statusOpenMasive = false;
      this.listCargueMasivo = true;
      this.habilitarTerminar = true;
    } else {
      this.statusOpenMasive = true;
      this.listCargueMasivo = this.listCargueMasivo ? null : true;
      this.habilitarTerminar = false;
    }
  }

  public validOpenSeccion(notCreate?: Boolean): Boolean {
    return notCreate ? this.dropdownTwo = false : this.statusOpenMasive ?
      this.dropdownTwo = !this.dropdownTwo : this.dropdownTwo = null;
  }

  _initFormDevolver() {
    this.form = this.formBuilder.group({
      devolve: new FormControl()
    });

    this.form.controls.devolve.valueChanges.subscribe(item => {
      if (item?.codigo) {
        this.devolverTecnico = true;
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
    this.setRequiredFactorPlan();
  }

  private setRequiredFactorPlan(): void {
    this.backService.planes.cambiarEstadoRequiereCargarFactor(this.codigoPlan, this.statusOpenMasive).subscribe(resp => {
      this.solicitud = UrlRoute.SOLICITUD_APROBACION;
      this.devolverTecnico = false;
      this.isShowForm = Promise.resolve(
        this.showForm = true
      );
    });
  }

  /* Metodos para el flujo de eliminacion */
  /* Para el flujo de eliminacion */
  _guardarObservacion(datos: any) {
    this._apruebaRechazaSolicitud(datos);
  }

  _apruebaRechazaSolicitud(datos: any) {
    if (this.esDirectorTecnico) {
      datos.aprobacionDirectorActuaria = datos.aprobar;
    } else {
      datos.devolverTecnico = this.devolverTecnico;
    }
    this.backService.tarea.completarTarea(this.idTarea, datos).subscribe((resp: any) => {

      let _mensajeActuaria;
      let _obj;
      if (!this.esDirectorTecnico) {
        datos.devolverTecnico = this.devolverTecnico;
        if (this.form.controls.devolve.value) {
          _mensajeActuaria = 'global.devolverA';
          _obj = { fase: this.form.controls.devolve.value.nombre };
        } else {
          _mensajeActuaria = 'global.solicitudCreacionActuaria';
        }
      } else {
        datos.aprobacionDirectorActuaria = datos.aprobar;
        _mensajeActuaria = 'global.solicitudCreacionRechazadaMensaje';
      }

      this.translate.get(datos.aprobar ? 'global.finalizaFlujo' : _mensajeActuaria, _obj).subscribe((mensaje: string) => {
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

  guardarDevolver() {
    const datos = {
      aprobar: false,
      comment: this.formDevolver.controls.observacion.value,
      devolverTecnico: !this.esDirectorTecnico // false para btn terminar; true para vevolver
    };

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
