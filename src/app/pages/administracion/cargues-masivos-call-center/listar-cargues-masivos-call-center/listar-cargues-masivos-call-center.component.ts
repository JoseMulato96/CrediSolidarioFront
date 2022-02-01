import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BackFacadeService } from '@core/services/back-facade.service';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { TranslateService } from '@ngx-translate/core';
import { GENERALES } from '@shared/static/constantes/constantes';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormValidate } from '@shared/util';
import { DateUtil } from '@shared/util/date.util';
import { FileUtils } from '@shared/util/file.util';
import { masksPatterns } from '@shared/util/masks.util';
import { ObjectUtil } from '@shared/util/object.util';
import * as FileSaver from 'file-saver';
import { MimProcesoMasivoService } from '../../cargue-masivo/services/mim-proceso-masivo.service';
import { MimTipoProcesoMasivoService } from '../../cargue-masivo/services/mim-tipo-proceso-masivo.service';
import { MimPreventaService } from '../../services/mim-preventa.service';
import { ListarCargueMasivoCallCenterConfig } from './listar-cargues-masivos-call-center.config';

@Component({
  selector: 'app-listar-cargues-masivos-call-center',
  templateUrl: './listar-cargues-masivos-call-center.component.html',
  styleUrls: ['./listar-cargues-masivos-call-center.component.css']
})
export class ListarCarguesMasivosCallCenterComponent extends FormValidate implements OnInit {

  form: FormGroup;
  formBuscar: FormGroup;
  isForm: Promise<any>;
  isFormBuscar: Promise<any>;
  mostrarActivarCargar: boolean;
  maxDateValue: any;

  // nombre: string;
  archivoCarga: File;
  // seleccionado: any;
  formData: FormData;
  extencionesPermitidas = ['xlsx', 'xls'];
  tipoTransaccion: any;
  tipoMovimiento: any;
  nombreDocumento: string;
  configuracion: ListarCargueMasivoCallCenterConfig = new ListarCargueMasivoCallCenterConfig();
  tipoCargue: string;
  cargarDocumento: boolean;
  estadoProcesar = true;

  formRechazar: FormGroup;
  mostrarModal: boolean;
  causaNegaciones: any;
  rowSeleccionado: any;
  patterns = masksPatterns;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService,
    private readonly mimProcesoMasivoService: MimProcesoMasivoService,
    private readonly mimTipoProcesoMasivoService: MimTipoProcesoMasivoService,
    private readonly mimPreventaService: MimPreventaService,
    private readonly router: Router
  ) {
    super();
    this.cargarDocumento = true;
    this.nombreDocumento = 'Selecciones';
    this.maxDateValue = new Date();
    this.causaNegaciones = [];
  }

  ngOnInit(): void {
    this.formBusquedatabla();
  }

  private initForm() {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        tipoTransaccion: [null, [Validators.required]],
        tipoMovimiento: [null, [Validators.required]],
        archivo: [null, [Validators.required]]
      })
    );

    this.form.controls.tipoMovimiento.disable();
    this.form.controls.archivo.disable();
    this.cargarDocumento = true;
    this._onChangeTipoTransaccion();
  }

  private formBusquedatabla() {
    this.isFormBuscar = Promise.resolve(
      this.formBuscar = this.formBuilder.group({
        fechaInicioFin: new FormControl(null),
        codigoCargue: new FormControl(null, Validators.minLength(1))
      })
    );
    this.actionsEventsFilters();
  }

  private initformObservacion() {
    this.formRechazar = this.formBuilder.group({
      causaNegacion: new FormControl(null, [Validators.required]),
      observacion: new FormControl(null, [Validators.required, Validators.maxLength(999), Validators.pattern('.*\\S.*[a-zA-z0-9-zÀ-ÿ\u00f1\u00d1 ]')])
    });
  }

  private actionsEventsFilters() {
    this.formBuscar.controls.codigoCargue.valueChanges.subscribe(rs => {
      this.formBuscar.controls.fechaInicioFin.setErrors(null);
    });
    this.formBuscar.controls.fechaInicioFin.valueChanges.subscribe(rs => {
      this.formBuscar.controls.codigoCargue.setErrors(null);
    });
  }


  buscar(pagina = 0, tamanio = 10) {
    if (!this.validarForm()) {
      return;
    }
    const param: any = {
      page: pagina, size: tamanio, isPaged: false, onlyCargues: true
    };
    const _form = this.formBuscar.getRawValue();
    if (_form.fechaInicioFin) {
      const fechaInicio = DateUtil.dateToString(_form.fechaInicioFin[0], 'dd-MM-yyyy');
      const fechaFin = _form.fechaInicioFin[1] ? DateUtil.dateToString(_form.fechaInicioFin[1], 'dd-MM-yyyy') : fechaInicio;

      param.fechaInicio = `${fechaInicio} 00:00:00`;
      param.fechaFin = `${fechaFin} 23:59:59`;
    }

    if (_form.codigoCargue) {
      param.jobExecutionId = _form.codigoCargue;
    }
    this.backService.trabajos.getTrabajos(param).subscribe(item => {

      this.configuracion.gridConfig.component.limpiar();

      if (!item || !item.content || item.content.length === 0) {
        this.translate
          .get('global.noExistenRegistros', { name: 'cargues masivos call center' })
          .subscribe((response: any) => {
            this.frontService.alert.info(response);
          });
        return;
      }

      const datos = item.content.filter(x => x.jobInstance.jobName === GENERALES.NOMBRE_CARGUE_MASIVO.INCREMENTOS);
      this.configuracion.gridConfig.component.cargarDatos(
        this.transformarDatos(datos), {
        maxPaginas: item.totalPages,
        pagina: item.number,
        cantidadRegistros: item.totalElements
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  transformarDatos(datos: any) {
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
            'administracion.cargueMasivo.alertas.errorCargueMasivo'
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

      return {
        ...item,
        _fecha: DateUtil.dateToString(fecha, GENERALES.FECHA_HORA_PATTERN),
        _exitStatusName: exitStatusName
      };
    });
  }

  private validarForm() {
    if (!this.formBuscar.controls.codigoCargue.value && !this.formBuscar.controls.fechaInicioFin.value) {
      this.translate.get('global.validateForm').subscribe(texto => {
        this.frontService.alert.warning(texto);
      });
      this.formBuscar.controls.codigoCargue.setErrors({ required: true });
      this.formBuscar.controls.fechaInicioFin.setErrors({ required: true });
      return false;
    }

    return true;
  }

  // Habilita la opcion de subir el archivo al seleccionar un tipoArchivo
  _onChangeTipoTransaccion() {
    this.form.controls.tipoTransaccion.valueChanges.subscribe(tipoTransaccion => {

      if (tipoTransaccion) {
        this._getTipoMovimiento(tipoTransaccion.codigo);
        this.form.controls.tipoMovimiento.enable();
        this.form.controls.archivo.enable();
        this.form.controls.archivo.reset();
        this.cargarDocumento = true;
      }
    });

    this.form.controls.tipoMovimiento.valueChanges.subscribe(item => {
      this.cargarDocumento = false;
      if (item) {
        this.tipoCargue = item.jobName;
      }
    });
  }

  _getTipoMovimiento(codigoTipoProceso: string) {
    this.mimProcesoMasivoService.getProcesosMasivo({
      'mimTipoProcesoMasivo.codigo': codigoTipoProceso,
      estado: true
    }).subscribe(item => {
      this.tipoMovimiento = item._embedded.mimProcesoMasivo;
    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });
  }

  uploadFile(e) {
    if (this.form.controls.tipoMovimiento.value.codigo === GENERALES.TIPOS_PROCESOS_CARGUE_MASIVO.INCREMENTOS) {
      this.archivoCarga = e.target.files[0];

      this.formData = new FormData();
      this.formData.append('file', this.archivoCarga);
      // Validaciones
      if (this.archivoCarga.name.includes('.')) {
        const extencion = this.extencionesPermitidas.find(item => item === this.archivoCarga.name.split('.')[1].toLowerCase());
        if (!extencion) {
          this.translate.get('global.alertas.extensionDocumento', { tipoDocumento: '(.xls o .xlsx)' }).subscribe((validateForm: string) => {
            this.frontService.alert.warning(validateForm).then(() => {
              this.nombreDocumento = 'Selecciones';
              return;
            });
          });
        }
        if (this.archivoCarga.size > GENERALES.PESO_MAXIMO_DOCUMENTO) {
          this.translate.get('global.alertas.pesoDocumento', { pesoDocumento: '5' }).subscribe((validateForm: string) => {
            this.frontService.alert.warning(validateForm).then(() => {
              this.nombreDocumento = 'Selecciones';
              return;
            });
          });
        }
        this.nombreDocumento = this.archivoCarga.name;
        this.estadoProcesar = false;
      }
    }
  }

  // Limpia el formulario
  limpiarFormulario() {
    this.tipoMovimiento = null;
    this.nombreDocumento = 'Selecciones';
    this.form.reset();
    this.initForm();
  }

  async modalCargarArchivo(toggle: boolean) {
    if (!toggle && this.hasChanges()) {
      this.frontService.alert.confirm(this.translate.instant('global.onDeactivate')).then((respuesta: boolean) => {
        if (respuesta) {
          this.mostrarActivarCargar = false;
          this.archivoCarga = null;
          this.estadoProcesar = true;
          this.limpiarFormulario();
        }
      });
    } else {
      if (toggle) {
        await this.preCargaDataFormularioCargueMasivo();
        this.initForm();
      }
      this.mostrarActivarCargar = toggle;
    }
  }

  hasChanges() {
    return (this.form && this.form.dirty);
  }

  private async preCargaDataFormularioCargueMasivo() {
    const _tipoTransaccion = await this.mimTipoProcesoMasivoService.getTipoProcesosMasivo({ estado: true, pantalla: 'ventas' }).toPromise().catch(err => {
      this.frontService.alert.warning(err.error.message);
    });
    this.tipoTransaccion = _tipoTransaccion._embedded.mimTipoProcesoMasivo;
  }

  descargarJbosErrores(dato: any) {
    const headers: string[] = ['administracion.cargueMasivo.excelNotificacionPagos.razonDeError'];
    const columnas: string[] = ['error'];
    ObjectUtil.traducirObjeto(headers, this.translate);

    const datos = dato.stepExecutions.map(stepExecution => {
      return {
        error: stepExecution.exitStatus.exitDescription
      };
    });

    const nombreDocumento = dato.jobParametrs.parameters.fileName.parameter.replace('.csv', '');
    const codigoCargue = dato.id;

    this.exportarExcel(
      `log_errores_${nombreDocumento}_${codigoCargue}_${DateUtil.dateToString(new Date(), GENERALES.FECHA_HORA_PATTERN_EXCEL)}`, {
      headers,
      columnas,
      datos
    });
  }

  descargarDocumento() {
    const nombreDocumento = this.form.controls.tipoMovimiento.value.nombreArchivoEjemplo;
    this.backService.downloadFile.descargarDocumentoFTP(nombreDocumento).subscribe(item => {
      const blob = new Blob([item.body], { type: 'application/octet-stream' });
      FileSaver.saveAs(blob, nombreDocumento);
    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });
  }

  limpiar() {
    this.formBuscar.reset();
    this.formBusquedatabla();
    // Limpiamos el set de datos de la tabla.
    if (this.configuracion.gridConfig.component) {
      this.configuracion.gridConfig.component.limpiar();
    } else {
      this.configuracion.gridConfig.datos = [];
    }
  }

  // Metodo para enviar el archivo
  cargar() {

    if (!this.archivoCarga) {
      this.translate.get('global.alertas.elegirDocumento').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }

    this.formData = new FormData();
    this.formData.append('file', this.archivoCarga);
    this.formData.append('delimiter', ',');
    this.formData.append('quote', '"');
    this.formData.append('isQuoted', 'true');

    this.backService.downloadFile.postConvertDocument(this.formData).subscribe(item => {
      const blob: any = new Blob([item.body], { type: 'application/octet-stream' });
      this.formData = new FormData();
      const csvFileName = this.archivoCarga.name.replace('.xlsx', '.csv');
      this.formData.append('file', <File>blob, csvFileName);
      this.backService.trabajos.cargueTrabajo(this.tipoCargue, this.formData).subscribe((respuesta: any) => {
        this.frontService.alert.info(respuesta.message).then(() => {
          this.archivoCarga = null;
          this.limpiarFormulario();
          this.mostrarActivarCargar = false;
        });
      }, (err) => {
        if (err.status === 400) {
          this.translate.get('administracion.cargueMasivo.alertas.estrucutraNoCumple').subscribe((text: string) => {
            this.frontService.alert.error(text).then(() => {
              this.exportarLogErrores(this.archivoCarga.name.replace('.xlsx', ''), err.error.errors);
            });
          });
        } else {
          this.frontService.alert.error(err.error.message);
          this.archivoCarga = null;
        }

      });
    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });

  }

  private exportarExcel(nombre, datos: any = {}) {
    this.backService.utilidades.exportarExcel2(nombre, datos).subscribe(respuesta => {
      const body: any = respuesta.body;
      FileUtils.downloadXlsFile(body, nombre);
    });
  }

  onClickExportarExcelPreventa(item: any, event?: any) {
    const headers: string[] = [
      'administracion.cargueMasivoCallCenter.excel.identificacionAsociado',
      'administracion.cargueMasivoCallCenter.excel.fechaSolicitud',
      'administracion.cargueMasivoCallCenter.excel.correoElectronico',
      'administracion.cargueMasivoCallCenter.excel.cedulaPromotorComercial',
      'administracion.cargueMasivoCallCenter.excel.codigoPlan',
      'administracion.cargueMasivoCallCenter.excel.proyectoVida',
      'administracion.cargueMasivoCallCenter.excel.cual',
      'administracion.cargueMasivoCallCenter.excel.ingresosMensuales',
      'administracion.cargueMasivoCallCenter.excel.codigoPlanCobertura',
      'administracion.cargueMasivoCallCenter.excel.valorProteccion',
      'administracion.cargueMasivoCallCenter.excel.pregunta1DeclaracionSalud',
      'administracion.cargueMasivoCallCenter.excel.pregunta2DeclaracionSalud',
      'administracion.cargueMasivoCallCenter.excel.pregunta3DeclaracionSalud',
      'administracion.cargueMasivoCallCenter.excel.pregunta4DeclaracionSalud',
      'administracion.cargueMasivoCallCenter.excel.pregunta5DeclaracionSalud',
      'administracion.cargueMasivoCallCenter.excel.pregunta6DeclaracionSalud',
      'administracion.cargueMasivoCallCenter.excel.diagnostico',
      'administracion.cargueMasivoCallCenter.excel.fechaDiagnostico',
      'administracion.cargueMasivoCallCenter.excel.descripcionSecuela',
      'administracion.cargueMasivoCallCenter.excel.estatura',
      'administracion.cargueMasivoCallCenter.excel.peso',
      'administracion.cargueMasivoCallCenter.excel.estadoCargueProcesoAutomatico',
      'administracion.cargueMasivoCallCenter.excel.razonError'
    ];

    const columnas: string[] = [
      'numeroIdentificacion', // identificacionAsociado
      'fechaSolicitud',
      'correoElectronico',
      'promotorComercial', // cedulaPromotorComercial
      'codigoPlan',
      'proyectoVida',
      'otroProyectoVida', // cual',
      'ingresosMensuales',
      'codigoPlanCobertura',
      'valorProteccion',
      'preguntaUno', // 'pregunta1DeclaracionSalud',
      'preguntaDos',
      'preguntaTres',
      'preguntaCuatro',
      'preguntaCinco',
      'preguntaSeis',
      'diagnostico',
      'fechaDiagnostico',
      'descripcionSecuela',
      'estatura',
      'peso',
      'estadoCargueProcesoAutomatico',
      'razonError'
    ];
    ObjectUtil.traducirObjeto(headers, this.translate);
    item.content = this.mapearPreventa(columnas, item.content);

    // Se mapean solo las columnas que se quieren mostrar en el archivo Excel
    const datos = item.content.map(x =>
    ({
      numeroIdentificacion: x.numeroIdentificacion,
      fechaSolicitud: x.fechaSolicitud,
      correoElectronico: x.correoElectronico,
      promotorComercial: x.promotorComercial,
      codigoPlan: x.codigoPlan,
      proyectoVida: x.proyectoVida,
      otroProyectoVida: x.otroProyectoVida,
      ingresosMensuales: x.ingresosMensuales,
      codigoPlanCobertura: x.codigoPlanCobertura, // JSON.parse(JSON.stringify(x.mimCargueSolicitudDetalleDto.datosEntrada)),
      valorProteccion: x.valorProteccion,
      preguntaUno: x.preguntaUno,
      preguntaDos: x.preguntaDos,
      preguntaTres: x.preguntaTres,
      preguntaCuatro: x.preguntaCuatro,
      preguntaCinco: x.preguntaCinco,
      preguntaSeis: x.preguntaSeis,
      diagnostico: x.diagnostico,
      fechaDiagnostico: x.fechaDiagnostico,
      descripcionSecuela: x.descripcionSecuela,
      estatura: x.estatura,
      peso: x.peso,
      estadoCargueProcesoAutomatico: this.getTransformarDato(event.dato)._exitStatusName,
      razonError: x.mimCargueSolicitudDetalleDto.mensaje || x.mimCargueSolicitudDetalleDto.mimCargueSolicitudDto.mensajeSalida

      // razonError: event.dato.exitStatus.exitCode === 'FAILED' ? x.mimCargueSolicitudDetalleDto.mensaje || x.mimCargueSolicitudDetalleDto.mimCargueSolicitudDto.mensajeSalida : ''
    }));


    const nombreDocumento = event.dato.jobParametrs.parameters.fileName.parameter.replace('.csv', '');
    const codigoCargue = event.dato.id;

    this.exportarExcel(
      `${nombreDocumento}_${codigoCargue}_${DateUtil.dateToString(new Date(), GENERALES.FECHA_HORA_PATTERN_EXCEL)}`, {
      headers,
      columnas,
      datos
    });
  }

  private exportarLogErrores(nombreArchivo: string, csvErrorSet: any[]) {
    // Validamos si hay datos.
    if (null === csvErrorSet || undefined === csvErrorSet || csvErrorSet.length === 0) {
      return;
    }

    const headers: string[] = [
      'global.row',
      'global.column',
      'global.error'
    ];
    ObjectUtil.traducirObjeto(headers, this.translate);

    const columnas: string[] = [
      'row',
      'column',
      'error'
    ];

    this.exportarExcel(
      `log_errores_${nombreArchivo}_${DateUtil.dateToString(new Date(), GENERALES.FECHA_HORA_PATTERN_EXCEL)}`,
      {
        headers,
        columnas,
        datos: csvErrorSet
      }
    );
  }


  async onClickCeldaElement(event: any) {
    const params: any = {
      'mimCargueSolicitudDetalle.mimCargueSolicitud.jobExecutionId': event.dato.id,
      isPaged: true,
      page: 0,
      size: 1,
      'mimEstadoPreventa.codigo': MIM_PARAMETROS.MIM_ESTADO_PRE_VENTA.DISPONIBLE
    };
    if (event.col.key === 'editarDetalle') {
      const _aplicaEvento = await this.getAplicaEvento(params, 'administracion.cargueMasivoCallCenter.alertas.noPermiteEditar');
      if (!_aplicaEvento) {
        return;
      }
      this.router.navigate([
        UrlRoute.PAGES,
        UrlRoute.ADMINISTRACION,
        UrlRoute.ADMINISTRACION_CARGUES_MASIVOS_CALL_CENTER,
        event.dato.id
      ]);
    } else if (event.col.key === 'eliminarDetalle') {
      const _aplicaEvento = await this.getAplicaEvento(params, 'administracion.cargueMasivoCallCenter.alertas.noPermiteRechazar');
      if (!_aplicaEvento) {
        return;
      }
      this.rowSeleccionado = event.dato;
      const _causaNegaciones = await this.backService.razonAnulacion.getRazonesAnulacion(
        { 'mimFaseFlujo.codigo': MIM_PARAMETROS.MIM_FASE_FLUJO.PRE_REGISTRO }
      ).toPromise()
        .catch(err => this.frontService.alert.warning(err.error.message));
      this.causaNegaciones = _causaNegaciones._embedded.mimRazonAnulacion;
      this.toggleModal();
    } else if (event.col.key === 'descargueDetalle') {
      if (event.dato.exitStatus.exitCode === 'FAILED') {
        this.descargarJbosErrores(event.dato);
      } else {
        const paramsDescarga: any = { 'mimCargueSolicitudDetalle.mimCargueSolicitud.jobExecutionId': event.dato.id };
        this.mimPreventaService.getMimPreventa(paramsDescarga).subscribe(item => {
          this.onClickExportarExcelPreventa(item, event);
        }, (err) => {
          this.frontService.alert.warning(err.error.message);
        });
      }
    }
  }

  private getTransformarDato(datos: any) {
    let exitStatusName = 'global.unknown';
    switch (datos.exitStatus.exitCode) {
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
        break;
      case 'STOPPED':
        exitStatusName = 'global.stopped';
        break;
    }
    const arrayEstado = [exitStatusName];
    ObjectUtil.traducirObjeto(arrayEstado, this.translate);
    return {
      ...datos,
      _exitStatusName: arrayEstado[0]
    };

  }

  private mapearPreventa(columnas: any, datos: any) {
    return datos.map(row => {
      columnas.map(x => {
        if (!row.hasOwnProperty(x)) {
          row[x] = JSON.parse(row.mimCargueSolicitudDetalleDto.datosEntrada).hasOwnProperty(x) ? JSON.parse(row.mimCargueSolicitudDetalleDto.datosEntrada)[x] : null;
        }
      });
      return { ...row };
    });
  }

  toggleModal() {
    this.initformObservacion();
    this.mostrarModal = !this.mostrarModal;
  }

  private async getAplicaEvento(param: any, mensaje: string) {
    const _preventa = await this.mimPreventaService.getMimPreventa(param).toPromise()
      .catch(err => { this.frontService.alert.warning(err.error.message); return false; });
    if (_preventa.content.length <= 0) {
      this.translate.get(mensaje).subscribe(texto => {
        this.frontService.alert.info(texto);
      });
      return false;
    }
    return true;

  }

  guardarCausaNegacion() {
    if (this.formBuscar.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }
    const param = {
      jobExecutionId: this.rowSeleccionado.id,
      observacion: this.formRechazar.controls.observacion.value,
      mimRazonAnulacionCallCenter: this.formRechazar.controls.causaNegacion.value
    };
    this.mimPreventaService.postMimPreventaRechazarCargue(param).subscribe(() => {
      this.translate.get('global.guardadoExitosoMensaje').subscribe(mensaje => {
        this.frontService.alert.success(mensaje);
      });
    }, err => this.frontService.alert.error(err.error.message));
  }
}
