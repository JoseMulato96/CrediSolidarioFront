import { Component, OnInit } from '@angular/core';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormValidate, CustomValidators } from '@shared/util';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormComponent } from '@core/guards';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { GENERALES } from '@shared/static/constantes/constantes';
import { SIP_PARAMETROS_TIPO } from '@shared/static/constantes/sip-parametros-tipo';
import { AutomaticoPagosConfig } from './automatico-pagos.config';
import { TranslateService } from '@ngx-translate/core';
import { DateUtil } from '@shared/util/date.util';
import { ObjectUtil } from '@shared/util/object.util';
import { FileUtils } from '@shared/util/file.util';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-automatico-pagos',
  templateUrl: './automatico-pagos.component.html',
})
export class AutomaticoPagosComponent extends FormValidate implements OnInit, FormComponent {
  configuracion: AutomaticoPagosConfig = new AutomaticoPagosConfig();

  form: FormGroup;
  isForm: Promise<any>;

  maxDate: Date = new Date();

  // obs: Observable<any>;
  observacion: string;
  mostrarGuardar: boolean;
  habilitarBotonExportar: boolean;

  usuariosPagadores: any;
  usuariosRadicadores: any;
  nombreUsuarioSistema: string;

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

  obtenerAutomaticoPagos(pagina = 0, tamanio = 10) {

    if (!this.validarForm()) {
      return;
    }

    const params: any = { page: pagina, size: tamanio, isPaged: true };
    params.fechaInicio = DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy');
    params.fechaFin = DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy');
    params['mimSolicitudEvento.mimEstadoSolicitudEvento.codigo'] = MIM_PARAMETROS.MIM_ESTADOS_SOLICITUD_EVENTO.PAGADA;


    forkJoin({
      _liquidaciones: this.backService.liquidacion.getLiquidacionesEvento(params),
      _usuariosRadicadores: this.backService.sispro.getUsuariosPorRol(GENERALES.ROLES_ID.MM_F5),
      _usuariosPagadores: this.backService.sispro.getUsuariosPorRol(GENERALES.ROLES_ID.MM_F9),
      _usuarioSistema: this.backService.parametro.getParametrosTipo(SIP_PARAMETROS_TIPO.USUARIO_SISTEMA.TIP_COD)
    }).pipe(
      map(x => {
        return {
          _liquidaciones: x._liquidaciones,
          _usuarioSistema: x._usuarioSistema,
          _usuariosRadicadores: x._usuariosRadicadores.map(t => {
            return {
              codigo: t.identification,
              nombre: t.name
            };
          }),
          _usuariosPagadores: x._usuariosPagadores.map(t => {
            return {
              codigo: t.identification,
              nombre: t.name
            };
          })
        };
      })
    ).subscribe((respuesta: any) => {

      this.configuracion.gridConfig.component.limpiar();
      if (!respuesta._liquidaciones.content || !respuesta._liquidaciones.content.length) {
        this.habilitarBotonExportar = false;
        const msg = 'global.noSeEncontraronRegistrosMensaje';
        this.translate.get(msg).subscribe((response: string) => {
            this.frontService.alert.info(response);
          });
        return;
      }

      this.nombreUsuarioSistema = respuesta._usuarioSistema.tipDesc;
      this.usuariosRadicadores = respuesta._usuariosRadicadores;
      this.usuariosPagadores = respuesta._usuariosPagadores;

      respuesta._liquidaciones.content.map(resp => {
        const x = resp;
        x.nombreUsuarioRadicador =  resp.mimSolicitudEvento.usuarioRadicador ? this._getNombreRadicador(resp.mimSolicitudEvento.usuarioRadicador) : null;
        x.nombreUsuarioPagador = resp.usuarioPagador ? this._getNombrePagador(resp.usuarioPagador) : null;
        return x;
      });

      this.habilitarBotonExportar = true;
      this.configuracion.gridConfig.component.cargarDatos(
        respuesta._liquidaciones.content,
        {
          maxPaginas:  respuesta._liquidaciones.totalPages,
          pagina:  respuesta._liquidaciones.number,
          cantidadRegistros:  respuesta._liquidaciones.totalElements
        }
      );

    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });

  }

  _getNombreRadicador(numeroIdentificacion: string) {
    const registroRadicador = this.usuariosRadicadores.find(item => item.codigo === numeroIdentificacion);
    return registroRadicador ? registroRadicador.nombre : this.nombreUsuarioSistema;
  }

  _getNombrePagador(numeroIdentificacion: string) {
    const registroPagador = this.usuariosPagadores.find(item => item.codigo === numeroIdentificacion);
    return registroPagador ? registroPagador.nombre : this.nombreUsuarioSistema;
  }

  _onAtras($event) {
    this.obtenerAutomaticoPagos($event.pagina, $event.tamano);
  }

  _onSiguiente($event) {
    this.obtenerAutomaticoPagos($event.pagina, $event.tamano);
  }


  _onClickCeldaElement(event) {
    const comentario = event.dato.commentMessage;
    this.observacion = comentario.includes('|') ? comentario.split('|')[0] : comentario || 'No hay observación';
    this.mostrarGuardar = true;
  }

  _onClickExportarExcel() {
    if (this.configuracion.gridConfig.component && this.configuracion.gridConfig.component.hayDatos()) {

      const params: any = { isPaged: false };
      params.fechaInicio = DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy');
      params.fechaFin = DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy');
      params['mimSolicitudEvento.mimEstadoSolicitudEvento.codigo'] = MIM_PARAMETROS.MIM_ESTADOS_SOLICITUD_EVENTO.PAGADA;

      this.backService.liquidacion.getLiquidacionesEvento(params).subscribe((respuesta) => {
          // Se traen los encabezados
          const columnas: string[] = [
            'reportes.automaticoPagos.grid.noIdentificacionAsociadoBeneficiarioPago',
            'reportes.automaticoPagos.grid.nombreAsociadoBeneficiarioPago',
            'reportes.automaticoPagos.grid.numeroSolicitud',
            'reportes.automaticoPagos.grid.amparo',
            'reportes.automaticoPagos.grid.estadoNotificacion',
            'reportes.automaticoPagos.grid.estadoSolicitud',
            'reportes.automaticoPagos.grid.formaPago',
            'reportes.automaticoPagos.grid.numeroCuenta',
            'reportes.automaticoPagos.grid.valorBase',
            'reportes.automaticoPagos.grid.valorDeducciones',
            'reportes.automaticoPagos.grid.valorRetencion',
            'reportes.automaticoPagos.grid.valorNeto',
            'reportes.automaticoPagos.grid.usuarioRadicador',
            'reportes.automaticoPagos.grid.usuarioPagador'
          ];
          ObjectUtil.traducirObjeto(columnas, this.translate);

          // Se mapean solo las columnas que se quieren mostrar en el archivo Excel
          const datos = respuesta.content.map(x =>
            ({
              noIdentificacionAsociadoBeneficiarioPago: x.asociado.numInt,
              nombreAsociadoBeneficiarioPago: x.asociado.nomCli,
              numeroSolicitud: x.mimSolicitudEvento.codigo,
              amparo: x.mimSolicitudEvento.mimEvento.nombre,
              estadoNotificacion: x.mimNotificacionEvento.mimEstadoCierre && x.mimNotificacionEvento.mimEstadoCierre.codigo ? x.mimNotificacionEvento.mimEstadoCierre.nombre : null,
              estadoSolicitud: x.mimSolicitudEvento.mimEstadoSolicitudEvento.nombre,
              formaPago: x.mimSolicitudEvento.mimFormaPago && x.mimSolicitudEvento.mimFormaPago.codigo ? x.mimSolicitudEvento.mimFormaPago.nombre : null,
              numeroCuenta: x.mimSolicitudEvento.numeroCuentaDeposito ? x.mimSolicitudEvento.numeroCuentaDeposito : null,
              valorBase: x.valorTotalPago,
              valorDeducciones: x.valorDeduccionesVarias,
              valorRetencion: x.retefuente,
              valorNeto: x.valorNetoPago,
              usuarioRadicador: x.mimSolicitudEvento.usuarioRadicador ? this._getNombreRadicador(x.mimSolicitudEvento.usuarioRadicador) : null,
              usuarioPagador: x.usuarioPagador ? this._getNombrePagador(x.usuarioPagador) : null
            }));

            this.exportarExcel(
              `Reporte_automatico_pagos_${DateUtil.dateToString(new Date())}`, {
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
