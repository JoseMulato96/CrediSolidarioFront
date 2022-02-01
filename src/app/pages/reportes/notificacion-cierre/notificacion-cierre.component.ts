import { Component, OnInit } from '@angular/core';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormValidate, CustomValidators } from '@shared/util';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormComponent } from '@core/guards';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { NotificacionCierreConfig } from './notificacion-cierre.config';
import { TranslateService } from '@ngx-translate/core';
import { DateUtil } from '@shared/util/date.util';
import { ObjectUtil } from '@shared/util/object.util';
import { FileUtils } from '@shared/util/file.util';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-notificacion-cierre-reclamaciones',
  templateUrl: './notificacion-cierre.component.html',
})
export class NotificacionCierreComponent extends FormValidate implements OnInit, FormComponent {
  configuracion: NotificacionCierreConfig = new NotificacionCierreConfig();

  form: FormGroup;
  isForm: Promise<any>;

  maxDate: Date = new Date();

  // obs: Observable<any>;
  observacion: string;
  mostrarGuardar: boolean;
  habilitarBotonExportar: boolean;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
  }

  ngOnInit(): void {
    this._initForm();
  }

  _initForm() {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        fechaInicioFechaFin: new FormControl(null, [Validators.required, CustomValidators.RangoFechaDias(31)])
      },
      { validators: [CustomValidators.RangoFechaObligatorio] }
      )
    );
  }

  onLimpiar() {
    this.router.navigate([this.router.url.split('?')[0]], {});
    this._limpiar();
  }

  _limpiar() {
    this.habilitarBotonExportar = false;
    this.form.reset();
    this._initForm();

    // Limpiamos el set de datos de la tabla.
    if (this.configuracion.gridConfig.component) {
      this.configuracion.gridConfig.component.limpiar();
    } else {
      this.configuracion.gridConfig.datos = [];
    }
  }

  private validarForm() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate
        .get('global.validateForm')
        .subscribe(texto => {
          this.frontService.alert.warning(texto);
        });
      return false;
    }

    return true;
  }

  obtenerNotificacionCierre(pagina = 0, tamanio = 10) {

    if (!this.validarForm()) {
      return;
    }

    const params: any = { page: pagina, size: tamanio, isPaged: true };
    params.fechaInicio = DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy');
    params.fechaFin = DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy');
    params['mimSolicitudEvento.mimEstadoSolicitudEvento.codigo'] = MIM_PARAMETROS.MIM_ESTADOS_SOLICITUD_EVENTO.PAGADA;

    this.backService.notificacionEvento.getNotificacionesEvento(params).subscribe(respuesta => {
      this.configuracion.gridConfig.component.limpiar();
      if (!respuesta.content || !respuesta.content.length) {
        this.habilitarBotonExportar = false;
        const msg = 'global.noSeEncontraronRegistrosMensaje';
        this.translate.get(msg).subscribe((response: string) => {
            this.frontService.alert.info(response);
          });
        return;
      }
      this.habilitarBotonExportar = true;
      this.configuracion.gridConfig.component.cargarDatos(
        this.indicadorCerrado(respuesta.content),
        {
          maxPaginas: respuesta.totalPages,
          pagina: respuesta.number,
          cantidadRegistros: respuesta.totalElements
        }
      );

    }, error => {
      this.frontService.alert.warning(error.error.message);
    });

  }

  indicadorCerrado(items: any) {
    const listObj = [];
    let item: any;
    for (item of items) {
      listObj.push({
        ...item,
        _cerrado: item.mimEstadoCierre && item.mimEstadoCierre.codigo === MIM_PARAMETROS.MIM_ESTADO_CIERRE.NOTIFADO_TAYLOR ? 'Si' : 'No'
      });
    }
    return listObj;
  }

  _onAtras($event) {
    this.obtenerNotificacionCierre($event.pagina, $event.tamano);
  }

  _onSiguiente($event) {
    this.obtenerNotificacionCierre($event.pagina, $event.tamano);
  }

  _onClickExportarExcel() {
    if (this.configuracion.gridConfig.component && this.configuracion.gridConfig.component.hayDatos()) {

      const params: any = { isPaged: false };
      params.fechaInicio = DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy');
      params.fechaFin = DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy');
      params['mimSolicitudEvento.mimEstadoSolicitudEvento.codigo'] = MIM_PARAMETROS.MIM_ESTADOS_SOLICITUD_EVENTO.PAGADA;

      this.backService.notificacionEvento.getNotificacionesEvento(params).subscribe((respuesta) => {
          // Se traen los encabezados
          const columnas: string[] = [
            'reportes.notificacionCierre.grid.tipoAuxilioPagado',
            'reportes.notificacionCierre.grid.numeroReclamacion',
            'reportes.notificacionCierre.grid.cedulaAsociadoBeneficiarioPago',
            'reportes.notificacionCierre.grid.fechaPago',
            'reportes.notificacionCierre.grid.fechaNotificacion',
            'reportes.notificacionCierre.grid.indicadorCerradoContactoExitoso',
            'reportes.notificacionCierre.grid.observacion'
          ];
          ObjectUtil.traducirObjeto(columnas, this.translate);

          // Se mapean solo las columnas que se quieren mostrar en el archivo Excel
          const datos = respuesta.content.map(x =>
            ({
              tipoAuxilioPagado: x.mimSolicitudEvento.mimEvento.nombre,
              numeroReclamacion: x.mimSolicitudEvento.codigo,
              cedulaAsociadoBeneficiarioPago: x.asociado.numInt,
              fechaPago: x.mimLiquidacion.fechaPago ? x.mimLiquidacion.fechaPago : null,
              fechaNotificacion: x.fechaNotificacion,
              indicadorCerradoContactoExitoso: x.mimEstadoCierre && x.mimEstadoCierre.codigo === MIM_PARAMETROS.MIM_ESTADO_CIERRE.NOTIFADO_TAYLOR ? 'Si' : 'No',
              observacion: x.observaciones
            }));

            this.exportarExcel(
              `Reporte_notificacion_cierre_${DateUtil.dateToString(new Date())}`, {
              columnas,
              datos
            });
        }, err => {
          this.frontService.alert.warning(err.error.message);
        });
    }
  }

  private exportarExcel(nombre, datos: any = {}) {
    this.backService.utilidades.exportarExcel(nombre, datos).subscribe(respuesta => {
      const body: any = respuesta.body;
      FileUtils.downloadXlsFile(body, nombre);
    });
  }

  _onSalir() {
    this.router.navigate([UrlRoute.PAGES]);
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return this.form && this.form.dirty && !this.isPristine(this.form);
  }


}
