import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SolidaridadFacturacionConfig } from './solidaridad-facturacion.config';
import { SolidaridadFacturacionDetalleComponent } from './solidaridad-facturacion-detalle/solidaridad-facturacion-detalle.component';
import { DateUtil } from '@shared/util/date.util';
import { FileUtils } from '@shared/util/file.util';
import { ObjectUtil } from '@shared/util/object.util';
import { SIP_PARAMETROS_TIPO } from '@shared/static/constantes/sip-parametros-tipo';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-solidaridad-facturacion',
  templateUrl: './solidaridad-facturacion.component.html',
})
export class SolidadaridadFacturacionComponent implements OnInit, OnDestroy {
  configuracion: SolidaridadFacturacionConfig = new SolidaridadFacturacionConfig();
  _asoNumInt: any;
  _asoNumIntSubscription: any;
  isForm: Promise<any>;
  @ViewChild(SolidaridadFacturacionDetalleComponent)
  solidaridadFacturacionDetalleComponent: SolidaridadFacturacionDetalleComponent;
  exportarDisabled = true;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) { }

  ngOnInit() {
    this._asoNumIntSubscription = this.route.parent.parent.parent.params.subscribe(
      params => {
        this._asoNumInt = params['asoNumInt'];
        if (!this._asoNumInt) {
          return;
        }

        this.getsolidaridad();
      }
    );
  }

  ngOnDestroy() {
    if (this._asoNumIntSubscription) {
      this._asoNumIntSubscription.unsubscribe();
      this._asoNumIntSubscription = undefined;
    }
  }

  /**
   * @author Hander Fernando Gutierrez
   * @description escucha el boton atras de la tabla
   */
  _OnOpenMora(event: any) {
    this.solidaridadFacturacionDetalleComponent.onOpen(
      this._asoNumInt,
      event['periodo'],
      event['prodCodigo']
    );
  }
  /**
   * @author Hander Fernando Gutierrez
   * @description escucha el boton atras de la tabla
   */

  getsolidaridadTabla(pagina = 0, tamano = 10) {
    this.backService.solidaridadFacturacion
      .getSolidaridadDatos({
        asoNumInt: this._asoNumInt,
        codParamEstadoFac:
          SIP_PARAMETROS_TIPO.TIPOS_ESTADOS_CUOTAS_FACTURACION.TIP_COD,
        pagina: pagina,
        tamano: tamano,
        exportar: true
      })
      .subscribe((respuestaDatos: any) => {
        const datos: any[] = respuestaDatos['content'] as any[];
        if (!datos || !datos.length) {
          this.exportarDisabled = true;
          return;
        }
        this.exportarDisabled = false;

        this.configuracion.gridSolidaridad.component.cargarDatos(
          respuestaDatos.content,
          {
            maxPaginas: respuestaDatos.totalPages,
            pagina: respuestaDatos.number,
            cantidadRegistros: respuestaDatos.totalElements
          }
        );
      }, (err) => {
        this.frontService.alert.warning(err.error.message);
      });
  }

  getsolidaridad(pagina = 0, tamano = 10) {
    this.backService.solidaridadFacturacion
      .getSolidaridadDatos({
        asoNumInt: this._asoNumInt,
        codParamEstadoFac:
          SIP_PARAMETROS_TIPO.TIPOS_ESTADOS_CUOTAS_FACTURACION.TIP_COD,
        pagina: pagina,
        tamano: tamano,
        exportar: true
      })
      .subscribe((respuestaDatos: any) => {
        const datos: any = respuestaDatos;
        if (!datos || datos.content.length === 0) {
          this.translate
            .get(
              'asociado.facturacion.solidaridad.noSeEncontraronRegistrosMensaje'
            )
            .subscribe((response: any) => {
              this.frontService.alert.info(response);
            });
          this.exportarDisabled = true;
          return;
        }
        this.exportarDisabled = false;

        this.configuracion.gridSolidaridad.component.cargarDatos(
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
   * @author Jorge Luis Caviedes Alvarado
   * @description escucha cuando le hace click al exportar excel
   */
  _onClickExportarExcel($event) {
    if (
      this.configuracion.gridSolidaridad.component &&
      this.configuracion.gridSolidaridad.component.hayDatos()
    ) {
      this.backService.solidaridadFacturacion
        .getSolidaridadDatos({
          asoNumInt: this._asoNumInt,
          codParamEstadoFac:
            SIP_PARAMETROS_TIPO.TIPOS_ESTADOS_CUOTAS_FACTURACION.TIP_COD,
          pagina: 0,
          tamano: 0,
          exportar: true
        })
        .subscribe((respuesta: any) => {
          const columnas: string[] = [
            'Fecha de Creación',
            'Periodo',
            'Concepto de Facturación',
            'Nombre de Producto',
            'Valor Cuota',
            'Valor Facturado',
            'Estado',
            'Valor Generado',
            'Valor Pagado',
            'Fecha Pago',
            'Mora',
            'Mora Pagada',
            'Saldo Mora',
            'Saldo Factura'
          ];
          this.exportarExcel(
            `Reporte_Solidaridad_${DateUtil.dateToString(new Date())}`,
            {
              columnas,
              datos: ObjectUtil.removerAtributos(respuesta.content, [
                'estado',
                'prodCodigo'
              ])
            }
          );
        }, (err) => {
          this.frontService.alert.warning(err.error.message);
        });
    }
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
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
