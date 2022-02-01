import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BackFacadeService } from '@core/services/back-facade.service';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { TranslateService } from '@ngx-translate/core';
import { ApruebaEliminaComponent } from '@shared/components/apueba-elimina/aprueba-elimina.component';
import { GENERALES } from '@shared/static/constantes/constantes';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { UrlRoute } from '@shared/static/urls/url-route';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
})
export class ConfiguracionComponent implements OnInit {

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
  mostrarModal: boolean;

  codigoPlan: string;
  devolverA: string;
  @ViewChild(ApruebaEliminaComponent) apruebaEliminaComponent: ApruebaEliminaComponent;

  constructor(
    private readonly translate: TranslateService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    this.translate.get('administracion.actuaria.relacionFactoresCobertura.tituloModal').subscribe(texto => {
      this.tituloModal = texto;
    });
  }


  ngOnInit(): void {
    this._initFormDevolver();
    this.activatedRoute.params.subscribe((params: any) => {
      this.codigoPlan = params?.codigoPlan;
      this.idProceso = params.processInstanceId || null;
      this.idTarea = params.taskId || null;
      let objDatos = {
        _faseFlujo: this.backService.faseFlujo.getFaseFlujo({
          codigo: [MIM_PARAMETROS.MIM_FASE_FLUJO.TECNICA, MIM_PARAMETROS.MIM_FASE_FLUJO.ACTUARIA, MIM_PARAMETROS.MIM_FASE_FLUJO.FINANCIERA]
        })
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
        this.esDirectorTecnico = respuesta._esDirectorTecnico ? respuesta._esDirectorTecnico.taskDefinitionKey === GENERALES.TIPO_USUARIO_FLUJO.DIRECTOR_FINAL ? true : false : false;

      }, (err) => {
        this.frontService.alert.error(err.error.message);
      });

    });
  }

  verDetalleConfiguracion() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINISTRACION_APROBACION_FINAL,
      UrlRoute.ADMINISTRACION_APROBACION_FINAL_CONFIGURAR,
      this.codigoPlan,
      UrlRoute.SOLICITUD_APROBACION,
      UrlRoute.PROCESO,
      this.idProceso,
      UrlRoute.TAREA,
      this.idTarea,
      UrlRoute.ADMINISTRACION_APROBACION_FINAL_CONFIGURAR_RESUMEN
    ]);
  }

  _initFormDevolver() {
    this.form = this.formBuilder.group({
      devolve: new FormControl()
    });

    this.form.controls.devolve.valueChanges.subscribe(item => {
      if (item?.codigo) {
        this.devolverA = null;
        if (item.codigo === MIM_PARAMETROS.MIM_FASE_FLUJO.TECNICA) {
          this.devolverA = GENERALES.DEVOLVER_A.TECNICO;
        }
        if (item.codigo === MIM_PARAMETROS.MIM_FASE_FLUJO.ACTUARIA) {
          this.devolverA = GENERALES.DEVOLVER_A.ACTUARIA;
        }
        if (item.codigo === MIM_PARAMETROS.MIM_FASE_FLUJO.FINANCIERA) {
          this.devolverA = GENERALES.DEVOLVER_A.FINANCIERA;
        }
        this.apruebaEliminaComponent._rechazarSolicitud();
      }
    });
  }

  terminar() {
    this.solicitud = UrlRoute.SOLICITUD_APROBACION;
    this.apruebaEliminaComponent._rechazarSolicitud();
  }

  /* Metodos para el flujo de eliminacion */
  /* Para el flujo de eliminacion */
  _guardarObservacion(datos: any) {
    datos.decisionFinal = this.devolverA ? this.devolverA : 'activar';
    this._apruebaRechazaSolicitud(datos);
  }

  _apruebaRechazaSolicitud(datos: any) {
    if (this.devolverA) {
      datos.decisionFinal = this.devolverA ? this.devolverA : 'activar';
    } else {
      datos.decisionFinal = 'activar';
    }
    this.backService.tarea.completarTarea(this.idTarea, datos).subscribe((resp: any) => {
      let _mensaje;
      let _obj;
      if (this.form.controls.devolve.value) {
        _mensaje = 'global.devolverA';
        _obj = { fase: this.form.controls.devolve.value.nombre };
      } else {
        _mensaje = 'global.finalizaFlujo';
      }

      this.translate.get(datos.aprobar ? 'global.finalizaFlujo' : _mensaje, _obj).subscribe((mensaje: string) => {
        this.frontService.alert.success(mensaje).then(() => {
          this.router.navigate([UrlRoute.PAGES, UrlRoute.HOME]);
        });
      });

    }, (err) => {
      this.frontService.alert.error(err.error.message);
    }, () => {
      this.form.controls.devolve.reset();
    });
  }

  _toggleObservaciones(showModal?: boolean) {
    // do nothing
  }

  verObservacion() {
    this.apruebaEliminaComponent.verObservaciones();
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
