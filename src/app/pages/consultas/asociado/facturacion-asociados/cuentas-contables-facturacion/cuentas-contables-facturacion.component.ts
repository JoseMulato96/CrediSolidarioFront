import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '@core/services';
import { CuentasContablesFacturacionService } from '../../../../../core/services/api-back.services/mimutualasociados/cuentas-contables-facturacion.service';
import { CuentasContablesFacturacionConfig } from './cuentas-contables-facturacion.config';
import { DateUtil } from '@shared/util/date.util';
import { UtilidadesService } from '@core/services/api-back.services/mimutualutilidades/utilidades.service';
import { FileUtils } from '@shared/util/file.util';
import { CuentasContablesFacturacionDetalleComponent } from './cuentas-contables-facturacion-detalle/cuentas-contables-facturacion-detalle';
import { UrlRoute } from '@shared/static/urls/url-route';
import { ObjectUtil } from '@shared/util/object.util';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-cuentas-contables-facturacion',
  templateUrl: './cuentas-contables-facturacion.component.html',
  styleUrls: ['./cuentas-contables-facturacion.component.css']
})
export class CuentasContablesFacturacionComponent implements OnInit, OnDestroy {
  configuracion: CuentasContablesFacturacionConfig = new CuentasContablesFacturacionConfig();
  _asoNumInt: any;
  _asoNumIntSubscription: any;
  isForm: Promise<any>;
  cuentaCod: any;
  @ViewChild(CuentasContablesFacturacionDetalleComponent)
    CuentasContablesFacturacionDetalleComponent: CuentasContablesFacturacionDetalleComponent;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) { }

  ngOnInit() {
    this._asoNumIntSubscription = this.route.parent.parent.parent.params.subscribe(params => {
      this._asoNumInt = params['asoNumInt'];
      if (!this._asoNumInt) {
        return;
      }
      this.getsCuentasContables();
    });
  }

  ngOnDestroy() {
    if (this._asoNumIntSubscription) {
      this._asoNumIntSubscription.unsubscribe();
      this._asoNumIntSubscription = undefined;
    }
  }

  /**
     * @author Hander Fernando Gutierrez
     * @description escucha el vinculo del del detalle
     */
  _OnDetalle(event: any) {

    this.router.navigate([UrlRoute.PAGES, UrlRoute.CONSULTAS, UrlRoute.CONSULTAS_ASOCIADO, this._asoNumInt,
    UrlRoute.FACTURACION_ASOCIADOS, UrlRoute.FACTURACION_ASOCIADOS_CUENTAS_CONTABLES_DETALLE,
    ],
      {
        queryParams: {
          vista: this.router.url.toString(),
          cuentaCod: event.cuentaCod,
          plan: event.productoDescripcion,
          concepto: event.cuentaConcepto,
          fondo: event.distribucionesDesc,
          cuenta: event.cuentaNumero,
          noTransaccion: event.cuentaTransaccion,
          valor: event.pagoValor,
          asoNumInt: this._asoNumInt
        }
      }

    );
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
      .getCuentasContables(this._asoNumInt, { page: pagina, size: tamano, exportar: false })
      .subscribe((respuesta: any) => {
        if (!respuesta || !respuesta.content || !respuesta.content.length) {
          return;
        }
        this.configuracion.gridCuentasContables.component.cargarDatos(
          respuesta.content,
          {
            maxPaginas: respuesta.totalPages,
            pagina: respuesta.number,
            cantidadRegistros: respuesta.totalElements
          }
        );
      }, (err) => {
        this.frontService.alert.warning(err.error.message);
      });
  }

  getsCuentasContables(pagina = 0, tamano = 10) {
    this.backService.cuentasContablesFacturacion.getCuentasContables(this._asoNumInt, { page: pagina, size: tamano })
      .subscribe((respuestaDatos: any) => {

        const datos: any = respuestaDatos;
        if (!datos || datos['content'].length === 0) {
          this.translate.get(
            'asociado.facturacion.cuentasContables.noSeEncontraronRegistrosMensaje'
          ).subscribe((response: any) => {
            this.frontService.alert.info(response);
          });
          return;
        }
        this.configuracion.gridCuentasContables.component.cargarDatos(
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
* @author Hander Fernando Gutierrez Cordoba
* @description escucha cuando le hace click al exportar excel
*/
  _onClickExportarExcel($event) {
    if (this.configuracion.gridCuentasContables.component &&
      this.configuracion.gridCuentasContables.component.hayDatos()) {
      this.backService.cuentasContablesFacturacion
        .getCuentasContables(this._asoNumInt, { exportar: true })
        .subscribe((respuesta: any) => {
          const columnas: string[] = ['Concepto', 'Plan/Producto', 'Fondo', 'Nro Cuenta', 'Valor Acumulado'];
          this.exportarExcel(
            `Reporte_Cuentas_Contables_${DateUtil.dateToString(new Date())}`,
            {
              columnas,
              datos: ObjectUtil.removerAtributos(respuesta.content, [
                'cuentaCod',
                'cuentaSistema',
                'cuentaTransaccion',
                'distribucionesCod',
                'distribucionesNombreCorto',
                'pagoAsoNumInt',
                'pagoCod',
                'pagoValorAnterior',
                'productoCambioPlan',
                'productoCodPlt',
                'productoCodigo',
                'productoDisminuciones',
                'productoEstado',
                'productoFacturaCuota',
                'productoIncrementos',
                'productoNombreCorto',
                'productoOrden',
                'productoPerseverancia',
                'productoPlanSuperior',
                'productoTipo',
                'productoTipoCod',
                'productoValorProteccion',
                'transaccion',
                'productoProducto'
              ])
            }
          );
        }, (err) => {
          this.frontService.alert.warning(err.error.message);
        });
    }
  }
  /**
    * @author Hander Fernando Gutierrez cordoba
    * @description exporta el excel con recto a los datos
    */
  private exportarExcel(nombre, datos: any = {}) {
    this.backService.utilidades.exportarExcel(nombre, datos).subscribe(respuesta => {
      const body: any = respuesta.body;
      FileUtils.downloadXlsFile(body, nombre);
    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });
  }

}
