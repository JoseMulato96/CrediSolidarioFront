import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { FileUtils } from '@shared/util/file.util';
import { ObjectUtil } from '@shared/util/object.util';
import { DateUtil } from '@shared/util/date.util';
import { AmparosPagadosConfig } from './amparos-pagados.config';
import { CustomValidators } from '@shared/util';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-amparos-pagados',
  templateUrl: './amparos-pagados.component.html',
})
export class AmparosPagadosComponent implements OnInit {

  configuracion: AmparosPagadosConfig = new AmparosPagadosConfig();
  form: FormGroup;
  isForm: Promise<any>;
  amparosPagados: any;
  obs: Observable<any>;
  observacion: string;
  mostrarGuardar: boolean;
  habilitarBotonExportar: boolean;
  maxDate: Date = new Date();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        fechaInicioFechaFin: [null, [Validators.required, CustomValidators.RangoFechaDias(31)]]
      })
    );
  }

  async buscar(pagina = 0, tamanio = 10) {
    if (this.form.invalid) {
      this.translate.get('global.validateForm').subscribe((validateForm: string) => {
        this.frontService.alert.warning(validateForm);
      });
      return;
    }
    this.configuracion.gridConfig.component.limpiar();
    await this.getData(true, pagina, tamanio).then((item: any) => {

      this.configuracion.gridConfig.component.limpiar();

      if (!item || !item.content || item.content.length === 0) {
        this.amparosPagados = null;
        this.habilitarBotonExportar = false;
        this.translate.get('global.noSeEncontraronRegistrosMensaje').subscribe((validateForm: string) => {
          this.frontService.alert.info(validateForm);
        });
        return;
      }
      this.habilitarBotonExportar = true;
      this.amparosPagados = item.content;
      this.configuracion.gridConfig.component.cargarDatos(
        item.content, {
        maxPaginas: item.totalPages,
        pagina: item.number,
        cantidadRegistros: item.totalElements
      });
    }).catch(err => {
      this.frontService.alert.error(err.error.message, err.error.traza);
    });
  }

  private async getData(isPaged?: boolean, pagina?: number, tamanio?: number) {
    const _form = this.form.getRawValue();
    const fechaInicio = _form.fechaInicioFechaFin && DateUtil.dateToString(_form.fechaInicioFechaFin[0], 'dd-MM-yyyy');
    const fechaFin = _form.fechaInicioFechaFin && _form.fechaInicioFechaFin[1] ? DateUtil.dateToString(_form.fechaInicioFechaFin[1], 'dd-MM-yyyy') : fechaInicio;

    if (fechaInicio && (!fechaFin || null === fechaFin)) {
      this.translate.get('administracion.reportesGestionDiaria.alertas.fechaFinal').subscribe((validateForm: string) => {
        this.frontService.alert.warning(validateForm);
      });
      return;
    }

    const data = { isPaged } as any;
    if (isPaged) {
      data.page = pagina;
      data.size = tamanio;
    }
    data.fechaInicio = fechaInicio;
    data.fechaFin = fechaFin;

    const amparosObservable  = this.backService.solicitudEvento.getAmparosPagados(data);

    return await new Promise(function (resolve, reject) {
      let value;
      amparosObservable.subscribe((x) => {
        return value = x;
      }, (err) => {
        return reject(err);
      }, () => {
        return resolve(value);
      });
    });
  }

  _onSiguiente($event) {
    this.buscar($event.pagina, $event.tamano);
  }

  _onAtras($event) {
    this.buscar($event.pagina, $event.tamano);
  }

  async _onClickExportarExcel() {
    if (this.configuracion.gridConfig.component && this.configuracion.gridConfig.component.hayDatos()) {
      await this.getData(false).then((respuesta: any) => {
        const headers: string[] = [
          'administracion.reportesAmparosPagados.excel.mesPago',
          'administracion.reportesAmparosPagados.excel.periodoActual',
          'administracion.reportesAmparosPagados.excel.regionalAsociado',
          'administracion.reportesAmparosPagados.excel.zonaAsociado',
          'administracion.reportesAmparosPagados.excel.cedulaAsociado',
          'administracion.reportesAmparosPagados.excel.nombreAsociado',
          'administracion.reportesAmparosPagados.excel.consecutivoReclamacion',
          'administracion.reportesAmparosPagados.excel.tipoAuxilio',
          'administracion.reportesAmparosPagados.excel.nombreAuxilio',
          'administracion.reportesAmparosPagados.excel.producto',
          'administracion.reportesAmparosPagados.excel.fechaIngreso',
          'administracion.reportesAmparosPagados.excel.canalRadicacion',
          'administracion.reportesAmparosPagados.excel.fechaInicioRadicacion',
          'administracion.reportesAmparosPagados.excel.fechaFinalRadicacion',
          'administracion.reportesAmparosPagados.excel.diasGestionRadicacion',
          'administracion.reportesAmparosPagados.excel.usuarioRadicacion',
          'administracion.reportesAmparosPagados.excel.fechaInicioAuditoriaMedica',
          'administracion.reportesAmparosPagados.excel.fechaFinalAuditoriaMedica',
          'administracion.reportesAmparosPagados.excel.diasGestionAuditoriaMedica',
          'administracion.reportesAmparosPagados.excel.usuarioAuditoriaMedica',
          'administracion.reportesAmparosPagados.excel.fechaInicioDefinicion',
          'administracion.reportesAmparosPagados.excel.fechaFinalDefinicion',
          'administracion.reportesAmparosPagados.excel.diasGestionDefinicion',
          'administracion.reportesAmparosPagados.excel.usuarioDefinicion',
          'administracion.reportesAmparosPagados.excel.fechaInicioPago',
          'administracion.reportesAmparosPagados.excel.fechaFinalPago',
          'administracion.reportesAmparosPagados.excel.diasGestionPago',
          'administracion.reportesAmparosPagados.excel.usuarioPago',
          'administracion.reportesAmparosPagados.excel.formaPago',
          'administracion.reportesAmparosPagados.excel.valorPagoCobertura',
          'administracion.reportesAmparosPagados.excel.diasSuspendido',
          'administracion.reportesAmparosPagados.excel.diasGestion',
          'administracion.reportesAmparosPagados.excel.tipoMuerte',
          'administracion.reportesAmparosPagados.excel.tratamientoEspecial',
          'administracion.reportesAmparosPagados.excel.pagoManual'
        ];

        // administracion.reportesGestionDiaria.grid.observacion
        const columnas: string[] = [
          'mesPago',
          'periodoActual',
          'regionalAsociado',
          'zonaAsociado',
          'cedulaAsociado',
          'nombreAsociado',
          'consecutivoReclamacion',
          'tipoAuxilio',
          'nombreAuxilio',
          'producto',
          'fechaIngreso',
          'canalRadicacion',
          'fechaInicioRadicacion',
          'fechaFinalRadicacion',
          'diasGestionRadicacion',
          'usuarioRadicacion',
          'fechaInicioAuditoriaMedica',
          'fechaFinalAuditoriaMedica',
          'diasGestionAuditoriaMedica',
          'usuarioAuditoriaMedica',
          'fechaInicioDefinicion',
          'fechaFinalDefinicion',
          'diasGestionDefinicion',
          'usuarioDefinicion',
          'fechaInicioPago',
          'fechaFinalPago',
          'diasGestionPago',
          'usuarioPago',
          'formaPago',
          'valorPagoCobertura',
          'diasSuspendido',
          'diasGestion',
          'tipoMuerte',
          'tratamientoEspecial',
          'pagoManual'
        ];
        ObjectUtil.traducirObjeto(headers, this.translate);

        // Se mapean solo las columnas que se quieren mostrar en el archivo Excel
        const datos = respuesta.content;

        this.exportarExcel(
          `Amparos_pagados_${DateUtil.dateToString(new Date())}`, {
          headers,
          columnas,
          datos
        });
      }).catch(err => {
        this.frontService.alert.error(err.error.message, err.error.traza);
      });
    }
  }

  private exportarExcel(nombre, datos: any = {}) {
    this.backService.utilidades.exportarExcel2(nombre, datos).subscribe(respuesta => {
      const body: any = respuesta.body;
      FileUtils.downloadXlsFile(body, nombre);
    });
  }

  limpiar() {
    this.habilitarBotonExportar = false;
    this.configuracion.gridConfig.component.limpiar();
    this.form.reset();
    this.initForm();
  }

}
