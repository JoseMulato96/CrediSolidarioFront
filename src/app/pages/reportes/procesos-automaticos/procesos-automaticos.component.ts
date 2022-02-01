import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BackFacadeService } from '@core/services/back-facade.service';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { TranslateService } from '@ngx-translate/core';
import { GENERALES } from '@shared/static/constantes/constantes';
import { FormValidate } from '@shared/util';
import { DateUtil } from '@shared/util/date.util';
import { FileUtils } from '@shared/util/file.util';
import { ObjectUtil } from '@shared/util/object.util';
import { ProcesosAutomaticosConfig } from './procesos-automaticos.config';

@Component({
  selector: 'app-procesos-automaticos',
  templateUrl: './procesos-automaticos.component.html',
})
export class ProcesosAutomaticosComponent extends FormValidate implements OnInit {

  form: FormGroup;
  isForm: Promise<any>;
  tipoProcesoAutomatico: any;
  configuracion: ProcesosAutomaticosConfig = new ProcesosAutomaticosConfig();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) { super(); }

  ngOnInit(): void {
    this.backService.procesosAutomaticos.getTiposMovimientos().subscribe(item => {
      this.tipoProcesoAutomatico = item.content;
    });
    this.initForm();
  }

  private initForm() {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        procesoAutomatico: new FormControl(null, [Validators.required]),
        fechaInicioFin: new FormControl(null, [Validators.required])
      })
    );
  }

  buscar(pagina = 0, tamanio = 10) {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }
    const _form = this.form.getRawValue();
    const fechaInicio = DateUtil.dateToString(_form.fechaInicioFin[0], 'dd-MM-yyyy');
    const fechaFin = _form.fechaInicioFin[1] ? DateUtil.dateToString(_form.fechaInicioFin[1], 'dd-MM-yyyy') : null;
    const _datos = {
      page: pagina, size: tamanio, isPaged: true,
      sort: 'jobExecutionId,desc',
      'batchJobInstance.jobName': _form.procesoAutomatico.jobName,
      fechaInicio: `${fechaInicio} 00:00:00`,
      fechaFin: `${fechaFin} 23:59:59`
    };
    this.backService.trabajos.getTrabajos(_datos).subscribe(item => {
      this.configuracion.gridConfig.component.limpiar();

      if (!item || !item.content || item.content.length === 0) {
        this.translate.get('global.noSeEncontraronRegistrosMensaje').subscribe(resp => {
          this.frontService.alert.info(resp);
        });
        return;
      }

      this.configuracion.gridConfig.component.cargarDatos(
        this.transformarDatos(item.content), {
        maxPaginas: item.totalPages,
        pagina: item.number,
        cantidadRegistros: item.totalElements
      });

    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });
  }

  limpiar() {
    this.form.reset();
    this.initForm();
    this.configuracion.gridConfig.component.limpiar();
  }

  onSiguiente($event: any) {
    this.buscar($event.pagina, $event.tamano);
  }

  onAtras($event: any) {
    this.buscar($event.pagina, $event.tamano);
  }

  ordenar(event: any) {
    // do nothing
  }

  onClickExportarExcel() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }

    let headers: string[] = [];

    headers = [
      'reportes.procesosAutomaticos.grid.codigoProceso',
      'reportes.procesosAutomaticos.grid.usuario',
      'reportes.procesosAutomaticos.grid.fechaHoraEjecucion',
      'reportes.procesosAutomaticos.grid.cantidadRegistros',
      'reportes.procesosAutomaticos.grid.estado'
    ];

    let columnas: string[] = [
      'codigo',
      'usuario',
      'fechaHoraEjecucion',
      'cantidadRegistros',
      'estado'
    ];
    ObjectUtil.traducirObjeto(headers, this.translate);

    // Se mapean solo las columnas que se quieren mostrar en el archivo Excel
    let datos: any;
    const _form = this.form.getRawValue();
    const fechaInicio = DateUtil.dateToString(_form.fechaInicioFin[0], 'dd-MM-yyyy');
    const fechaFin = _form.fechaInicioFin[1] ? DateUtil.dateToString(_form.fechaInicioFin[1], 'dd-MM-yyyy') : null;
    const _datos = {
      'batchJobInstance.jobName': _form.procesoAutomatico.jobName,
      fechaInicio: `${fechaInicio} 00:00:00`,
      fechaFin: `${fechaFin} 23:59:59`
    };
    this.backService.trabajos.getTrabajos(_datos).subscribe(item => {
      datos = this.transformarDatos(item.content).map(item => {
        const _estado = [item._exitStatusName];
        ObjectUtil.traducirObjeto(_estado, this.translate);
        return {
          codigo: item.id,
          usuario: item.jobParametrs.parameters.userName.parameter,
          fechaHoraEjecucion: item._fecha,
          cantidadRegistros: item.totalRegistros,
          estado: _estado[0]
        };
      });
      this.exportarExcel(
        `reporte_${_form.procesoAutomatico.jobName}_${DateUtil.dateToString(new Date())}`, {
        headers,
        columnas,
        datos
      });
    }, err => {
      this.frontService.alert.error(err.error.message);
    });
  }

  private exportarExcel(nombre, datos: any = {}) {
    this.backService.utilidades.exportarExcel2(nombre, datos).subscribe(respuesta => {
      const body: any = respuesta.body;
      FileUtils.downloadXlsFile(body, nombre);
    });
  }

  private transformarDatos(datos: any) {

    return datos.map(item => {
      let exitStatusName = 'global.unknown';
      switch (item.exitStatus.exitCode) {
        case 'UNKNOWN':
          exitStatusName = 'global.executing';
          break;
        case 'EXECUTING':
          exitStatusName = 'global.executing';
          break;
        case 'COMPLETED':
          exitStatusName = 'global.completed';
          break;
        case 'NOOP':
          exitStatusName = 'global.executing';
          break;
        case 'FAILED':
          exitStatusName = 'global.failed';
          const arrayIdioma = [
            'reportes.procesosAutomaticos.alertas.errorCargueMasivo'
          ];
          ObjectUtil.traducirObjeto(arrayIdioma, this.translate);
          item.tooltips = {
            mensaje: arrayIdioma[0],
            cssButton: 'btn btn--icon bg--red2 mx-auto',
            cssIcon: 'icon-alert-triangle text--red1'
          };
          break;
        case 'STOPPED':
          exitStatusName = 'global.stopped';
          break;
      }

      const fechaMillis = item?.jobParametrs?.parameters?.time?.parameter;
      const fecha = null !== fechaMillis && undefined !== fechaMillis ? new Date(fechaMillis) : null;
      const totalRegistros = item?.jobParametrs?.parameters?.totalElements?.parameter || item?.executionContext?.totalElements;
      return {
        ...item,
        _fecha: DateUtil.dateToString(fecha, GENERALES.FECHA_HORA_PATTERN),
        _exitStatusName: exitStatusName,
        totalRegistros: totalRegistros
      };
    });
  }

  onClickCeldaElement(event: any) {
    if (event.col.key !== 'descargueDetalle') {
      return;
    }
    if (event.dato.exitStatus.exitCode === 'FAILED') {
      this.descargarJobsErrores(event.dato);
    } else {
      this.descargarLogErrore(event.dato.id);
    }
  }

  descargarJobsErrores(dato: any) {
    const headers: string[] = [
      'administracion.cargueMasivo.excelNotificacionPagos.razonDeError',
    ];

    const columnas: string[] = [
      'error',
    ];
    ObjectUtil.traducirObjeto(headers, this.translate);

    const datos = dato.stepExecutions.map(stepExecution => {
      return {
        error: stepExecution.exitStatus.exitDescription
      };
    });

    this.exportarExcel(
      `log_errores_${dato.id}_${DateUtil.dateToString(new Date(), GENERALES.FECHA_HORA_PATTERN_EXCEL)}`, {
      headers,
      columnas,
      datos
    });
  }

  private descargarLogErrore(codigo: string) {
    const params: any = { jobExecutionId: codigo, size: 10000 };
    this.backService.procesoLog.descargarLog(params).subscribe(item => {
      if (item._embedded.mimProcesoLog.length > 0) {
        this.excelLogErrores(item._embedded.mimProcesoLog, codigo);
      } else {
        const _params = {
          name: 'global.errores',
          detalle: 'reportes.procesosAutomaticos.procesoAutomatico'
        };
        ObjectUtil.traducirObjeto(_params, this.translate);
        this.translate.get('global.noExistenRegistroParams', _params).subscribe(resp => {
          this.frontService.alert.info(resp);
        });
      }
    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });
  }

  private excelLogErrores(dato: any, codigo: string) {
    const headers: string[] = [
      'reportes.procesosAutomaticos.logErrores.codigo',
      'reportes.procesosAutomaticos.logErrores.error',
      'reportes.procesosAutomaticos.logErrores.fechaCreacion'
    ];

    const columnas: string[] = [
      'codigo',
      'error',
      'fechaCreacion'
    ];
    ObjectUtil.traducirObjeto(headers, this.translate);
    const datos = dato;
    this.exportarExcel(
      `log_errores_${codigo}_${DateUtil.dateToString(new Date(), GENERALES.FECHA_HORA_PATTERN_EXCEL)}`, {
      headers,
      columnas,
      datos
    });
  }

}
