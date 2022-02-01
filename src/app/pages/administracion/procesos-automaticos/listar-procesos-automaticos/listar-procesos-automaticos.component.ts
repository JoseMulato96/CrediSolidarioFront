import { Component, OnInit } from '@angular/core';
import { ProcesosAutomaticosConfig } from './procesos-automaticos.config';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { UrlRoute } from '@shared/static/urls/url-route';
import { DateUtil } from '@shared/util/date.util';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { masksPatterns } from '@shared/util/masks.util';
import { GENERALES } from '@shared/static/constantes/constantes';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-listar-procesos-automaticos',
  templateUrl: './listar-procesos-automaticos.component.html',
})
export class ListarProcesosAutomaticosComponent implements OnInit {

  configuracion: ProcesosAutomaticosConfig = new ProcesosAutomaticosConfig();
  mostrarGuardar: boolean;
  estado: boolean;
  formOptionsInputs: FormGroup;
  optionsInputsArray: any[] = [];
  objSelectProces: any;
  patterns = masksPatterns;
  maxFechaFin: Date = new Date();
  minFechaFin: Date = new Date();
  maxFecha: Date = new Date();

  constructor(
    private readonly translate: TranslateService,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService) {
    this.estado = true;
  }

  ngOnInit(): void {
    this._obtenerDatos();
  }

  _obtenerDatos() {
    this.backService.procesosAutomaticos.getProcesosAutomaticos({ includeTriggersInfo: true })
      .subscribe((respuesta: any) => {

        this.configuracion.gridListar.component.limpiar();

        if (!respuesta || respuesta.length === 0) {
          return;
        }

        this.configuracion.gridListar.component.cargarDatos(
          this.asignarParametros(respuesta), {
          pagina: 0,
          cantidadRegistros: respuesta.length
        });
      }, (err) => {
        this.frontService.alert.error(err.error.message);
      });
  }

  asignarParametros(items: any) {
    const listObj = [];
    let item: any;
    let itemJobDetail: any;
    for (item of items) {

      if (item.jobGroup === MIM_PARAMETROS.MIM_PROCESO_AUTOMATICO.JOB_GROUP) {
        for (itemJobDetail of item.triggerList) {
          listObj.push({
            ...item,
            _startTime: DateUtil.dateToString(itemJobDetail.startTime, 'dd-MM-yyyy HH:mm:ss'),
            _nextFireTime: DateUtil.dateToString(itemJobDetail.nextFireTime, 'dd-MM-yyyy HH:mm:ss'),
            _previousFireTime: DateUtil.dateToString(itemJobDetail.previousFireTime, 'dd-MM-yyyy HH:mm:ss'),
            _triggerState: item.running ? 'global.executing' : this._estadoJob(itemJobDetail.triggerState),
            _expressionCron: itemJobDetail.cronExpression
          });
        }
      }

    }
    return listObj;
  }

  _estadoJob(estado: string) {
    let nuevoEstado;
    switch (estado) {
      case GENERALES.ESTADOS.NONE:
        nuevoEstado = 'global.none';
        break;
      case GENERALES.ESTADOS.NORMAL:
        nuevoEstado = 'global.none';
        break;
      case GENERALES.ESTADOS.PAUSED:
        nuevoEstado = 'global.stopped';
        break;
      case GENERALES.ESTADOS.COMPLETE:
        nuevoEstado = 'global.completed';
        break;
      case GENERALES.ESTADOS.ERROR:
        nuevoEstado = 'global.failed';
        break;
      default:
        nuevoEstado = '';
        break;
    }

    return nuevoEstado;
  }

  _onClickCeldaElement($event: any) {
    switch ($event.col.key) {
      case 'editar':
        this._alEditar($event.dato);
        break;
      case 'iniciar-job':
        this.backService.procesosAutomaticos.obtenerParametrosProcesoAutomatico(
          { 'mimProcesoAutomatico.jobName': $event.dato.jobName, 'mimProcesoAutomatico.jobGroup': $event.dato.jobGroup }).subscribe(resp => {
            this.objSelectProces = $event.dato;
            if (resp._embedded.mimParametrosProcesoAutomatico.length <= 0) {
              this._iniciarProcesoAutomatico();
              return;
            }
            this._inputFormat(resp._embedded);
            this._toggleGuardar(true);
          }, (err) => {
            this.frontService.alert.error(err.error.message);
          });
        break;
    }
  }

  async _inputFormat(objectInput: any) {
    this.formOptionsInputs = this.formBuilder.group({});
    this.optionsInputsArray = objectInput.mimParametrosProcesoAutomatico;
    for (let index = 0; index < objectInput.mimParametrosProcesoAutomatico.length; index++) {
      const element = objectInput.mimParametrosProcesoAutomatico[index];
      this.formOptionsInputs.addControl(element.llave, this.formBuilder.control('', element.required ? null : Validators.required));
      if (element.llave === GENERALES.VARIABLES_INICIO_JOB.FECHA_INICIO) {
        this.actionInputDateMaximoDia(element.llave, element.maxDias);
      }
    }
  }

  actionInputDateMaximoDia(llave: any, maxDias: any) {
    this.formOptionsInputs.controls[llave].valueChanges.subscribe(fechaInicio => {
      this.formOptionsInputs.controls[GENERALES.VARIABLES_INICIO_JOB.FECHA_FIN].setValue('');
      this.maxFechaFin.setDate(fechaInicio.getDate() + (maxDias - 1));
      this.maxFechaFin.setMonth(fechaInicio.getMonth());
      this.maxFechaFin.setFullYear(fechaInicio.getFullYear());
      this.minFechaFin = fechaInicio;
    });
  }

  _iniciarProcesoAutomatico() {
    const object = {};
    this.translate.get('administracion.procesosAutomaticos.alertas.iniciarJob')
      .subscribe((mensaje: string) => {
        this.frontService.alert.confirm(mensaje, 'info').then((desition: any) => {
          if (desition === true) {
            this.optionsInputsArray.forEach(element => {
              object[element.llave] = DateUtil.dateToString(this.formOptionsInputs.controls[element.llave].value);
            });
            this.objSelectProces.params = object;
            this.backService.procesosAutomaticos.iniciarProcesoAutomatico(this.objSelectProces).subscribe((respuesta: any) => {
              this.frontService.alert.success(respuesta.message).then(() => {
                this._obtenerDatos();
                this._toggleGuardar(false);
              });
            }, (err) => {
              this.frontService.alert.error(err.error.message);
            });
          }
        });
      });
  }

  _onToggleStatus(e) {
    this.estado = e.currentTarget.checked ? e.currentTarget.checked : '';
    this._obtenerDatos();
  }

  _alEditar($event: any) {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINISTRACION_PROCESOS_AUTOMATICOS,
      $event.jobName,
      $event.jobGroup]);
  }

  irACrear() {
    return [UrlRoute.ADMINISTRACION_COTIZADORES_NOTAS_ACLARATORIAS_NUEVO];
  }

  _toggle(toggle: boolean) {
    this.mostrarGuardar = toggle;
  }

  _cerrarSeccion() {
    this.mostrarGuardar = false;
  }

  async _toggleGuardar(toggle: boolean) {
    this.mostrarGuardar = toggle;
  }

}
