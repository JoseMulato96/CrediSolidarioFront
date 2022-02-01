import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { IPage } from '@shared/interfaces/page.interface';
import { FacturacionProteccion } from '@shared/models/facturacion-protecciones.model';
import { CuentasContablesFacturacionDetalleConfig } from './cuentas-contables-facturacion-detalle.config';
import { CuentasContablesFacturacionService } from '../../../../../../core/services/api-back.services/mimutualasociados/cuentas-contables-facturacion.service';
import { EventoAsociadosService } from '../../../services/evento-asociados.service';
import { UtilidadesService } from '@core/services/api-back.services/mimutualutilidades/utilidades.service';
import { FileUtils } from '@shared/util/file.util';
import { DateUtil } from '@shared/util/date.util';
import { ObjectUtil } from '@shared/util/object.util';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-cuentas-contables-detalle',
  templateUrl: './cuentas-contables-facturacion-detalle.component.html',
  styleUrls: ['./cuentas-contables-facturacion-detalle.component.css']
})
export class CuentasContablesFacturacionDetalleComponent implements OnInit, OnDestroy {

  configuracion: CuentasContablesFacturacionDetalleConfig = new CuentasContablesFacturacionDetalleConfig();

  builded: Promise<any>;

  _asoNumInt: string;
  _asoSubscription: any;
  page: IPage<FacturacionProteccion>;
  isForm: Promise<any>;
  totalFacturado = 0;
  totalPagado = 0;
  _sort = 'asc';
  _cuentaPagoCodprodCodigo: number;
  shownPanelDetalleCuota = false;
  selectedFacProteccion: FacturacionProteccion;
  redireccion: any;
  _plan: any;
  _concepto: any;
  _fondo: any;
  _cuenta: any;
  _noTransaccion: any;
  _valor: any;
  exportarDisabled = true;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly eventoAsociado: EventoAsociadosService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {

      this._asoNumInt = params.asoNumInt;
      this.redireccion = params.vista;
      this._plan = params.plan;
      this._concepto = params.concepto;
      this._fondo = params.fondo;
      this._cuenta = params.cuenta;
      this._noTransaccion = params.noTransaccion;
      this._valor = params.valor;
      this._cuentaPagoCodprodCodigo = params.cuentaCod;
      this.getCuentasContablesDetalle();

      this.eventoAsociado.atras().next({
        mostrar: true,
        url: [this.redireccion]
      });
      this.eventoAsociado.summenu().next({ mostrar: false });

    });
  }
  ngOnDestroy() {
    if (this._asoSubscription) {
      this._asoSubscription.unsubscribe();
      this._asoSubscription = undefined;
    }
  }

  getCuentasContablesDetalle() {
    this.backService.cuentasContablesFacturacion
      .getCuentasContablesDetalle(
        this._asoNumInt, {
        cuentaCod: this._cuentaPagoCodprodCodigo,
        page: 0,
        size: 10
      })
      .subscribe((respuestaDatos: any) => {
        const datos: any = respuestaDatos;
        if (!datos || datos['content'].length === 0) {
          this.translate.get(
            'asociado.facturacion.cuentasContables.detalle.noSeEncontraronRegistrosMensaje'
          ).subscribe((response: any) => {
            this.frontService.alert.info(response);
          });
          this.exportarDisabled = true;
          return;
        }

        this.exportarDisabled = false;
        this.configuracion.gridCuentasContablesDetalle.component.cargarDatos(
          datos.content,
          {
            maxPaginas: datos.totalPages,
            pagina: datos.number,
            cantidadRegistros: datos.totalElements
          }
        );
      }, (err) => {
        this.frontService.alert.warning(err.error.message);
      });
  }


  /**
  * @author Hander Fernando Gutierrez
  * @description escucha el boton atras de la tabla
  */
  _OnAtras(e: any) {
    this.getsCuentasContablesTabla(e.pagina, e.tamano);
  }

  /**
   * @author Hander Fernando Gutierrez
   * @description esucha el boton siguiente de la tabla
   */
  _OnSiguiente(e: any) {
    this.getsCuentasContablesTabla(e.pagina, e.tamano);
  }

  getsCuentasContablesTabla(pagina = 0, tamano = 10) {
    this.backService.cuentasContablesFacturacion
      .getCuentasContablesDetalle(
        this._asoNumInt, {
        cuentaCod: this._cuentaPagoCodprodCodigo,
        page: pagina,
        size: tamano
      })
      .subscribe((respuestaDatos: any) => {
        const datos: any = respuestaDatos;

        if (!datos || !datos['content'].length) {
          return;
        }

        this.configuracion.gridCuentasContablesDetalle.component.cargarDatos(
          datos.content,
          {
            maxPaginas: datos.totalPages,
            pagina: datos.number,
            cantidadRegistros: datos.totalElements
          }
        );
      }, (err) => {
        this.frontService.alert.warning(err.error.message);
      });
  }

  /**
  * @author James Muñoz
  * @description escucha cuando le hace click al exportar excel
  */
  _onClickExportarExcel($event) {

    if (
      this.configuracion.gridCuentasContablesDetalle.component &&
      this.configuracion.gridCuentasContablesDetalle.component.hayDatos()
    ) {
      this.backService.cuentasContablesFacturacion
        .getCuentasContablesDetalle(
          this._asoNumInt, {
          cuentaCod: this._cuentaPagoCodprodCodigo,
          exportar: true
        })
        .subscribe((respuesta: any) => {
          const columnas: string[] = [
            'Código',
            'Fecha Pago',
            'Periodo',
            'Valor'
          ];

          this.exportarExcel(
            `Reporte_CuentasContablesFacturacionDetalle_${DateUtil.dateToString(new Date())}`, {
            columnas,
            datos: ObjectUtil.removerAtributos(respuesta.content,
              [
                'cuentaCod',
                'cuentaConcepto',
                'cuentaNumero',
                'cuentaPagoAsoNumInt',
                'cuentaPagoConsecutivo',
                'cuentaPagoCuentaCod',
                'cuentaPagoEstado',
                'cuentaPagoFechaRegistro',
                'cuentaPagoNumeroTransaccion',
                'cuentaPagoValorAnterior',
                'cuentaSistema',
                'cuentaTransaccion',
                'distribucionesCod',
                'distribucionesDesc',
                'distribucionesNombreCorto',
                'estado',
                'pagoAsoNumInt',
                'pagoCod',
                'pagoValor',
                'pagoValorAnterior',
                'productoCambioPlan',
                'productoCodPlt',
                'productoCodigo',
                'productoDescripcion',
                'productoDisminuciones',
                'productoEstado',
                'productoFacturaCuota',
                'productoIncrementos',
                'productoNombreCorto',
                'productoOrden',
                'productoPerseverancia',
                'productoPlanSuperior',
                'productoProducto',
                'productoTemporal',
                'productoTipo',
                'productoTipoCod',
                'productoValorProteccion',
                'transaccion',
              ])
          }
          );
        }, (err) => {
          this.frontService.alert.warning(err.error.message);
        });
    }
  }

  private exportarExcel(nombre, datos: any = {}) {
    this.backService.utilidades.exportarExcel(nombre, datos).subscribe(respuesta => {
      const body: any = respuesta.body;
      FileUtils.downloadXlsFile(body, nombre);
    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });
  }

}
