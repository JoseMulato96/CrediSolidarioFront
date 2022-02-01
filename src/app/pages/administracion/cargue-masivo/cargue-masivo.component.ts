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
import * as FileSaver from 'file-saver';
import { CargueMasivoConfig } from './cargue-masivo.config';
import { MimProcesoMasivoService } from './services/mim-proceso-masivo.service';
import { MimTipoProcesoMasivoService } from './services/mim-tipo-proceso-masivo.service';

@Component({
  selector: 'app-cargue-masivo',
  templateUrl: './cargue-masivo.component.html',
  styleUrls: ['./cargue-masivo.component.css']
})
export class CargueMasivoComponent extends FormValidate implements OnInit {

  form: FormGroup;
  formBuscar: FormGroup;
  isForm: Promise<any>;
  isFormBuscar: Promise<any>;
  mostrarActivarCargar: boolean;
  maxDateValue: any;

  archivoCarga: File;
  formData: FormData;
  extencionesPermitidas = ['xlsx', 'xls'];
  tipoArchivos: any;
  nombreDocumento: string;
  configuracion: CargueMasivoConfig = new CargueMasivoConfig();
  procesos: any;
  tipoCargue: string;
  cargarDocumento: boolean;
  estadoProcesar = true;

  constructor
    (
      private readonly formBuilder: FormBuilder,
      private readonly translate: TranslateService,
      private readonly frontService: FrontFacadeService,
      private readonly backService: BackFacadeService,
      private readonly mimProcesoMasivoService: MimProcesoMasivoService,
      private readonly mimTipoProcesoMasivoService: MimTipoProcesoMasivoService
    ) {
    super();
    this.cargarDocumento = true;
    this.nombreDocumento = 'Selecciones';
  }

  ngOnInit() {
    this.formBusquedatabla();
    this.maxDateValue = new Date();
  }

  private async _cargaTipoTransaccion() {
    const _tipoArchivo = await this.mimTipoProcesoMasivoService.getTipoProcesosMasivo({ estado: true, pantalla: 'cargue-masivo' }).toPromise().catch(err => {
      this.frontService.alert.warning(err.error.message);
    });
    this.tipoArchivos = _tipoArchivo._embedded.mimTipoProcesoMasivo;
  }


  hasChanges() {
    return (this.form && this.form.dirty);
  }

  private initForm() {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        tipoArchivo: new FormControl(null, [Validators.required]),
        archivo: new FormControl(null, [Validators.required]),
        proceso: new FormControl(null, [Validators.required]),
        nombreArchivo: new FormControl(null, [Validators.required])
      })
    );
    this.form.controls.proceso.disable();
    this.form.controls.archivo.disable();
    this.cargarDocumento = true;
    this._onChangeTipoArchivo();
  }

  private formBusquedatabla() {
    this.isFormBuscar = Promise.resolve(
      this.formBuscar = this.formBuilder.group({
        fechaInicio: new FormControl(null),
        codigoCargue: new FormControl(null, Validators.minLength(1))
      })
    );
    this.actionsEventsFilters();
  }

  // Habilita la opcion de subir el archivo al seleccionar un tipoArchivo
  _onChangeTipoArchivo() {

    this.form.controls.tipoArchivo.valueChanges.subscribe(tipoArchivo => {
      if (tipoArchivo) {
        this._getProceso(tipoArchivo.codigo);
        this.form.controls.proceso.enable();
        this.form.controls.archivo.enable();
        this.form.controls.archivo.reset();
        this.form.controls.nombreArchivo.reset();
        this.cargarDocumento = true;
      }
    });

    this.form.controls.proceso.valueChanges.subscribe(item => {
      this.cargarDocumento = false;
      if (item) {
        this.tipoCargue = item.jobName;
      }
    });
  }

  _getProceso(codigoTipoProceso: string) {
    this.mimProcesoMasivoService.getProcesosMasivo({
      'mimTipoProcesoMasivo.codigo': codigoTipoProceso,
      estado: true
    }).subscribe(item => {
      this.procesos = item._embedded.mimProcesoMasivo;
    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });
  }

  uploadFile(e) {
    if (this.form.controls.proceso.value.codigo === GENERALES.TIPOS_PROCESOS_CARGUE_MASIVO.COPAGO ||
      this.form.controls.proceso.value.codigo === GENERALES.TIPOS_PROCESOS_CARGUE_MASIVO.NOTIFICACION_PAGOS ||
      this.form.controls.proceso.value.codigo === GENERALES.TIPOS_PROCESOS_CARGUE_MASIVO.PROMOTORES
    ) {
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
    } else {
      // Aqui se define el proceso si es otro tipo de archivo
    }
  }

  _limpiar() {
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
  _cargar() {
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

  // Limpia el formulario
  limpiarFormulario() {
    this.procesos = null;
    this.nombreDocumento = 'Selecciones';
    this.form.reset();
    this.initForm();
  }

  private validarForm() {
    if (!this.formBuscar.controls.codigoCargue.value
      && !this.formBuscar.controls.fechaInicio.value) {
      this.translate
        .get('global.validateForm')
        .subscribe(texto => {
          this.frontService.alert.warning(texto);
        });
      this.addAccionError();
      return false;
    }

    return true;
  }

  private addAccionError() {
    this.formBuscar.controls.codigoCargue.setErrors({ required: true });
    this.formBuscar.controls.fechaInicio.setErrors({ required: true });
  }

  private actionsEventsFilters() {
    this.formBuscar.controls.codigoCargue.valueChanges.subscribe(rs => {
      this.formBuscar.controls.fechaInicio.setErrors(null);
    });
    this.formBuscar.controls.fechaInicio.valueChanges.subscribe(rs => {
      this.formBuscar.controls.codigoCargue.setErrors(null);
    });
  }

  buscar(pagina = 0, tamanio = 10) {
    if (!this.validarForm()) {
      return;
    }

    if (this.formBuscar.invalid) {
      this.validateForm(this.formBuscar);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }
    const param: any = {
      page: pagina, size: tamanio, isPaged: true, onlyCargues: true
    };
    const _form = this.formBuscar.getRawValue();
    if (_form.fechaInicio) {
      const fechaInicio = DateUtil.dateToString(_form.fechaInicio[0], 'dd-MM-yyyy');
      const fechaFin = _form.fechaInicio[1] ? DateUtil.dateToString(_form.fechaInicio[1], 'dd-MM-yyyy') : fechaInicio;
      if (fechaInicio) {
        param.fechaInicio = `${fechaInicio} 00:00:00`;
      }
      if (fechaFin) {
        param.fechaFin = `${fechaFin} 23:59:59`;
      }
    }
    const codigoCargue = _form.codigoCargue;

    if (codigoCargue) {
      param.jobExecutionId = codigoCargue;
    }
    this.backService.trabajos.getTrabajos(param).subscribe(item => {
      this.configuracion.gridConfig.component.limpiar();

      if (!item || !item.content || item.content.length === 0) {
        this.translate
          .get('global.noExistenRegistros', { name: 'cargues masivos' })
          .subscribe((response: any) => {
            this.frontService.alert.info(response);
          });
        return;
      }

      const datos = item.content.filter(x => x.jobInstance.jobName === GENERALES.NOMBRE_CARGUE_MASIVO.COPAGO
        || x.jobInstance.jobName === GENERALES.NOMBRE_CARGUE_MASIVO.NOTIFICACION_PAGOS
        || x.jobInstance.jobName === GENERALES.NOMBRE_CARGUE_MASIVO.PROMOTORES);
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


  _onClickCeldaElement(event: any) {
    if (event.col.key !== 'descargueDetalle') {
      return;
    }
    if (event.dato.exitStatus.exitCode === 'FAILED') {
      this.descargarJbosErrores(event.dato);
    } else {
      const params: any = { jobExecutionId: event.dato.id };
      this.backService.cargueSolicitud.descargarDetalleTrabajo(params).subscribe(item => {
        if (event.dato.jobInstance.jobName === GENERALES.NOMBRE_CARGUE_MASIVO.COPAGO) {
          this._onClickExportarExcelCopago(item, event);
        } else if (event.dato.jobInstance.jobName === GENERALES.NOMBRE_CARGUE_MASIVO.NOTIFICACION_PAGOS) {
          this._onClickExportarExcelNotificacionPagos(item, event);
        } else if (event.dato.jobInstance.jobName === GENERALES.NOMBRE_CARGUE_MASIVO.PROMOTORES) {
          this._onClickExportarExcelPromotores(item, event);
        } else {
          this.frontService.alert.warning('No hay parametrización para descargar el archivo');
        }
      }, (err) => {
        this.frontService.alert.warning(err.error.message);
      });
    }
  }

  descargarJbosErrores(dato: any) {
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

    const nombreDocumento = dato.jobParametrs.parameters.fileName.parameter.replace('.csv', '');
    const codigoCargue = dato.id;

    this.exportarExcel(
      `log_errores_${nombreDocumento}_${codigoCargue}_${DateUtil.dateToString(new Date(), GENERALES.FECHA_HORA_PATTERN_EXCEL)}`, {
      headers,
      columnas,
      datos
    });
  }


  _onSiguiente($event: any) {
    this.buscar($event.pagina, $event.tamano);
  }
  _onAtras($event: any) {
    this.buscar($event.pagina, $event.tamano);
  }
  _ordenar(event: any) {
    // do nothing
  }

  obtener(pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = true) {
    const params: any = { page: pagina, size: tamanio, isPaged: true, sort: sort };
    if (estado) {
      params.estado = estado;
    }
    const resp: any = [];
    this.configuracion.gridConfig.component.limpiar();

    if (!resp || !resp.content || resp.content.length === 0) {
      return;
    }

    this.configuracion.gridConfig.component.cargarDatos(
      resp.content, {
      maxPaginas: resp.totalPages,
      pagina: resp.number,
      cantidadRegistros: resp.totalElements
    });
  }

  descargarDocumento() {
    const nombreDocumento = this.form.controls.proceso.value.nombreArchivoEjemplo;
    this.backService.downloadFile.descargarDocumentoFTP(nombreDocumento).subscribe(item => {
      const blob = new Blob([item.body], { type: 'application/octet-stream' });
      FileSaver.saveAs(blob, nombreDocumento);
    }, async (err) => {
      const message = JSON.parse(await err.error.text()).message;
      this.frontService.alert.warning(message);
    });
  }

  _onClickExportarExcelNotificacionPagos(item: any, event?: any) {
    const headers: string[] = [
      'administracion.cargueMasivo.excelNotificacionPagos.fecha',
      'administracion.cargueMasivo.excelNotificacionPagos.hora',
      'administracion.cargueMasivo.excelNotificacionPagos.numeroReclamo',
      'administracion.cargueMasivo.excelNotificacionPagos.identificacionReclamante',
      'administracion.cargueMasivo.excelNotificacionPagos.nombreReclamante',
      'administracion.cargueMasivo.excelNotificacionPagos.valorReclamacion',
      'administracion.cargueMasivo.excelNotificacionPagos.descuentoCartera',
      'administracion.cargueMasivo.excelNotificacionPagos.valorContable',
      'administracion.cargueMasivo.excelNotificacionPagos.valorLiquidacion',
      'administracion.cargueMasivo.excelNotificacionPagos.descuentoImpuestos',
      'administracion.cargueMasivo.excelNotificacionPagos.idAsociado',
      'administracion.cargueMasivo.excelNotificacionPagos.nombreAsociado',
      'administracion.cargueMasivo.excelNotificacionPagos.estadoCargueReclamacion',
      'administracion.cargueMasivo.excelNotificacionPagos.razonDeError'
    ];

    const columnas: string[] = [
      'fecha',
      'hora',
      'numeroReclamo',
      'idReclamante',
      'nombreReclamante',
      'valorReclamacion',
      'descuentoCartera',
      'valorContable',
      'valorLiquidacion',
      'descuentoImpuestos',
      'idAsociado',
      'nombreAsociado',
      'estadoCargueReclamacion',
      'mensajeSalida'
    ];
    ObjectUtil.traducirObjeto(headers, this.translate);

    const _items = item.content.map(x => {
      return {
        ...x,
        _datosEntrada: JSON.parse(x.datosEntrada)
      };
    });

    // Se mapean solo las columnas que se quieren mostrar en el archivo Excel
    const datos = _items.map(x =>
    ({
      fecha: x._datosEntrada.fecha,
      hora: x._datosEntrada.hora,
      numeroReclamo: x._datosEntrada.numeroReclamo,
      idReclamante: x._datosEntrada.idReclamante,
      nombreReclamante: x._datosEntrada.nombreReclamante,
      valorReclamacion: x._datosEntrada.valorReclamacion,
      descuentoCartera: x._datosEntrada.descuentoCartera,
      valorContable: x._datosEntrada.valorContable,
      valorLiquidacion: x._datosEntrada.valorLiquidacion,
      descuentoImpuestos: x._datosEntrada.descuentoImpuestos,
      idAsociado: x._datosEntrada.idAsociado,
      nombreAsociado: x._datosEntrada.nombreAsociado,
      estadoCargueReclamacion: x.mimEstadoCargue.nombre,
      mensajeSalida: x.mensajeSalida
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

  _onClickExportarExcelCopago(item: any, event?: any) {
    const headers: string[] = [
      'administracion.cargueMasivo.excel.idReclamacion',
      'administracion.cargueMasivo.excel.idAsociado',
      'administracion.cargueMasivo.excel.solicitudRecibidaPor',
      'administracion.cargueMasivo.excel.oficinaRadicacion',
      'administracion.cargueMasivo.excel.fechaReclamación',
      'administracion.cargueMasivo.excel.tipoOrigen',
      'administracion.cargueMasivo.excel.tratamientoEspecial',
      'administracion.cargueMasivo.excel.asociadoBeneficiarioDeclaranteRenta',
      'administracion.cargueMasivo.excel.reclamaSoloCopago',
      'administracion.cargueMasivo.excel.observacionRegistro',
      'administracion.cargueMasivo.excel.fechaEvento',
      'administracion.cargueMasivo.excel.formaPago',
      'administracion.cargueMasivo.excel.tipoCuenta',
      'administracion.cargueMasivo.excel.banco',
      'administracion.cargueMasivo.excel.noCuenta',
      'administracion.cargueMasivo.excel.oficina',
      'administracion.cargueMasivo.excel.valorSolicitado',
      'administracion.cargueMasivo.excel.descuentoCuotaMes',
      'administracion.cargueMasivo.excel.descuentoSaldoVencido',
      'administracion.cargueMasivo.excel.observacionRadicación',
      'administracion.cargueMasivo.excel.notificarAsociado',
      'administracion.cargueMasivo.excel.estadoReclamacion',
      'administracion.cargueMasivo.excel.estadoCargueReclamacion',
      'administracion.cargueMasivo.excel.razonDeError'
    ];

    const columnas: string[] = [
      'idReclamacion',
      'idAsociado',
      'solicitudRecibidaPor',
      'oficinaRadicacion',
      'fechaReclamación',
      'tipoOrigen',
      'tratamientoEspecial',
      'asociadoBeneficiarioDeclaranteRenta',
      'reclamaSoloCopago',
      'observacionRegistro',
      'fechaEvento',
      'formaPago',
      'tipoCuenta',
      'banco',
      'noCuenta',
      'oficina',
      'valorSolicitado',
      'descuentoCuotaMes',
      'descuentoSaldoVencido',
      'observacionRadicacion',
      'notificarAsociado',
      'estadoReclamacion',
      'estadoCargueReclamacion',
      'mensajeSalida'
    ];
    ObjectUtil.traducirObjeto(headers, this.translate);

    const _items = item.content.map(x => {
      return {
        ...x,
        _datosEntrada: JSON.parse(x.datosEntrada)
      };
    });

    // Se mapean solo las columnas que se quieren mostrar en el archivo Excel
    const datos = _items.map(x =>
    ({
      idReclamacion: x.mimSolicitudEvento?.codigo,
      idAsociado: x._datosEntrada.idAsociado,
      solicitudRecibidaPor: x._datosEntrada.solicitudRecibidaPor,
      oficinaRadicacion: x._datosEntrada.oficinaRadicacion,
      fechaReclamación: x._datosEntrada.fechaReclamacion,
      tipoOrigen: x._datosEntrada.tipoOrigen,
      tratamientoEspecial: x._datosEntrada.tratamientoEspecial ? GENERALES.SI : GENERALES.NO,
      asociadoBeneficiarioDeclaranteRenta: x._datosEntrada.asociadoBeneficiarioDeclaranteRenta ? GENERALES.SI : GENERALES.NO,
      reclamaSoloCopago: x._datosEntrada.reclamaSoloCopago ? GENERALES.SI : GENERALES.NO,
      observacionRegistro: x._datosEntrada.observacionRegistro,
      fechaEvento: x._datosEntrada.fechaEvento,
      formaPago: x._datosEntrada.formaPago,
      tipoCuenta: x._datosEntrada.tipoCuenta,
      banco: x._datosEntrada.banco,
      noCuenta: x._datosEntrada.numeroCuenta,
      oficina: x._datosEntrada.oficina,
      valorSolicitado: x._datosEntrada.valorSolicitado,
      descuentoCuotaMes: x._datosEntrada.descuentoCuotaMes ? GENERALES.SI : GENERALES.NO,
      descuentoSaldoVencido: x._datosEntrada.descuentoSaldoVencido ? GENERALES.SI : GENERALES.NO,
      observacionRadicacion: x._datosEntrada.observacionRadicacion,
      notificarAsociado: x._datosEntrada.notificarAsociado ? GENERALES.SI : GENERALES.NO,
      estadoReclamacion: x.mimSolicitudEvento?.mimFaseFlujo ? x.mimSolicitudEvento?.mimFaseFlujo?.nombre : x.mimSolicitudEvento?.mimEstadoSolicitudEvento?.nombre,
      estadoCargueReclamacion: x.mimEstadoCargue.nombre,
      mensajeSalida: x.mensajeSalida
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

  _onClickExportarExcelPromotores(item: any, event?: any) {
    const headers: string[] = [
      'administracion.cargueMasivo.excelPromotores.codigoCargue',
      'administracion.cargueMasivo.excelPromotores.nombreCompania',
      'administracion.cargueMasivo.excelPromotores.tipoIdentificacion',
      'administracion.cargueMasivo.excelPromotores.numeroIdentificacion',
      'administracion.cargueMasivo.excelPromotores.nombrePromotor',
      'administracion.cargueMasivo.excelPromotores.correoElectronico',
      'administracion.cargueMasivo.excelPromotores.regional',
      'administracion.cargueMasivo.excelPromotores.tipoSolicitud',
      'administracion.cargueMasivo.excelPromotores.canalVenta',
      'administracion.cargueMasivo.excelPromotores.disponible',
      'administracion.cargueMasivo.excelPromotores.estadoCarguePromotor',
      'administracion.cargueMasivo.excelPromotores.razonDeError'
    ];
    const columnas: string[] = [
      'codigoCargue',
      'nombreCompania',
      'tipoIdentificacion',
      'numeroIdentificacion',
      'nombrePromotor',
      'correoElectronico',
      'regional',
      'tipoSolicitud',
      'canalVenta',
      'disponible',
      'estadoCarguePromotor',
      'mensajeSalida'
    ];

    ObjectUtil.traducirObjeto(headers, this.translate);

    const _items = item.content.map(x => {
      return {
        ...x,
        _datosEntrada: JSON.parse(x.datosEntrada)
      };
    });

    // Se mapean solo las columnas que se quieren mostrar en el archivo Excel
    const datos = _items.map(x =>
      ({
        codigoCargue: x.jobExecutionId,
        nombreCompania: x._datosEntrada.nombreCompania,
        tipoIdentificacion: x._datosEntrada.tipoIdentificacion,
        numeroIdentificacion: x._datosEntrada.numeroIdentificacion,
        nombrePromotor: x._datosEntrada.nombrePromotor,
        correoElectronico: x._datosEntrada.correoElectronico,
        regional: x._datosEntrada.regional,
        tipoSolicitud: x._datosEntrada.tipoSolicitud,
        canalVenta: x._datosEntrada.canalVenta,
        disponible: x._datosEntrada.disponible? 'Si': 'No',
        estadoCarguePromotor: x.mimEstadoCargue.nombre,
        mensajeSalida: x.mensajeSalida,
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

  private exportarExcel(nombre, datos: any = {}) {
    this.backService.utilidades.exportarExcel2(nombre, datos).subscribe(respuesta => {
      const body: any = respuesta.body;
      FileUtils.downloadXlsFile(body, nombre);
    });
  }

  // Proceso para el incio de la creacion de los formularios y las coberturas adicionales
  async _toggleGuardar2(toggle: boolean) {

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
        await this._cargaTipoTransaccion();
        this.initForm();
      }
      this.mostrarActivarCargar = toggle;
    }
  }

}
