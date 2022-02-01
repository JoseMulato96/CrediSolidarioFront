import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IPage } from '@shared/interfaces/page.interface';
import {
  FacturacionProteccion
} from '@shared/models/facturacion-protecciones.model';
import { APP_PARAMETROS } from '@shared/static/constantes/app-parametros';

import { FacturacionPortafolioConfig } from './facturacion-portafolio.config';
import { EventoAsociadosService } from '../../../services/evento-asociados.service';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FileUtils } from '@shared/util/file.util';
import { DateUtil } from '@shared/util/date.util';
import { ObjectUtil } from '@shared/util/object.util';
import { ProductoDetalleService } from '../../../services/producto-detalle.service';
import { Subscription } from 'rxjs';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-facturacion-portafolio',
  templateUrl: './facturacion-portafolio.component.html',
  styleUrls: ['./facturacion-portafolio.component.css']
})
export class FacturacionPortafolioComponent implements OnInit, OnDestroy {

  auxilioFunerario: number =
    APP_PARAMETROS.PROTECCIONES.CATEGORIA_PROTECCION.AUXILIO_FUNERARIO;
  configuracion: FacturacionPortafolioConfig = new FacturacionPortafolioConfig();

  _asoNumInt: string;
  _consecutivo: number;
  plan: any;
  productoDetalle: any;
  totalFacturado = 0;
  totalPagado = 0;
  _subs: Subscription[] = [];

  shownPanelCrearCuota = false;
  shownPanelDetalleCuota = false;
  selectedFacProteccion: FacturacionProteccion;

  atLeastOneSelected = false;
  exportarDisabled = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly eventoAsociado: EventoAsociadosService,
    private readonly productoDetalleService: ProductoDetalleService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) { }

  ngOnInit() {
    this._subs.push(this.route.parent.parent.parent.parent.parent.params.subscribe(
      asoParams => {
        this._asoNumInt = asoParams.asoNumInt;
        if (!this._asoNumInt) {
          return;
        }

        this._subs.push(this.route.parent.params.subscribe(
          conseParams => {
            this._consecutivo = conseParams.consecutivo;
            if (!this._consecutivo) {
              return;
            }

            this._subs.push(this.productoDetalleService.store.subscribe((respuesta: any) => {
              if (respuesta && respuesta.plan) {
                this.plan = respuesta.plan;
                this.productoDetalle = respuesta.detalleSeleccion;

                this.getFacturacionProtecciones(
                  this._asoNumInt,
                  this._consecutivo,
                  this.configuracion.gridFacturacion.pagina,
                  this.configuracion.gridFacturacion.tamano
                );
              }
            }));
          }
        ));
      }
    ));

    this.eventoAsociado.atras().next({
      mostrar: true,
      url: [
        UrlRoute.PAGES,
        UrlRoute.CONSULTAS,
        UrlRoute.CONSULTAS_ASOCIADO,
        this._asoNumInt,
        UrlRoute.PROTECCIONES,
        UrlRoute.PORTAFOLIO_ASOCIADOS
      ]
    });
    this.eventoAsociado.summenu().next({ mostrar: false });
  }

  ngOnDestroy() {
    this._subs.forEach(sub => sub.unsubscribe());
  }

  _OnDeseleccionar(event: any) {
    this.sumatoria();
  }

  _OnSeleccionar(event: any) {
    this.sumatoria();
  }

  private idCompuesta(item) {
    return item.consecutivo + '-' + item.periodo + '-' + item.tipo;
  }

  private sumatoria() {
    this.totalFacturado = 0;
    this.totalPagado = 0;

    this.atLeastOneSelected = this.configuracion.gridFacturacion.component
      .obtenerTodosSeleccionados().length > 0;

    this.configuracion.gridFacturacion.component
      .obtenerTodosSeleccionados()
      .forEach((x: any) => {
        this.totalFacturado += isNaN(Number(x.valorFacturado))
          ? 0
          : Number(x.valorFacturado);
        this.totalPagado += isNaN(Number(x.valorPagado))
          ? 0
          : Number(x.valorPagado);
      });
  }

  _OnClickCelda(event: any) {
    const selectedFacProteccion = event;
    if (selectedFacProteccion) {
      this.shownPanelDetalleCuota = true;

      this.getFacturacionProteccion(selectedFacProteccion.tipo, selectedFacProteccion.periodoOr,
        selectedFacProteccion.consecutivo, this._asoNumInt);
    } else {
      this.shownPanelDetalleCuota = false;
      this.selectedFacProteccion = undefined;
    }
  }

  activePanelRightCrearCuota(status) {
    if (!status) {
      this.shownPanelCrearCuota = false;
    } else {
      this.shownPanelCrearCuota = true;
    }
  }

  /**
   * @description Se encarga de traer los detalles de la facturacion para el incremento o decremento del producto.
   * @param consecutivo Consecutivo de incremento o decremento.
   * @param page Pagina solicitada.
   * @param size Tamanio de la pagina solicitada.
   */
  getFacturacionProtecciones(
    asoNumInt: string,
    consecutivo: number,
    page: number,
    size?: number,
    direction = 'desc',
    sort = 'periodo'
  ) {
    this.backService.portafolioAsociadosDetalle
      .getFacturacionProtecciones({
        asoNumInt: asoNumInt,
        consecutivo: consecutivo,
        page: page,
        size: size,
        sort,
        direction
      }, { Observation: consecutivo + ',' + this.plan.prodDescripcion })
      .subscribe((result: IPage<FacturacionProteccion>) => {
        if (!result.content || result.content.length === 0) {
          this.translate
            .get(
              'asociado.protecciones.facturacion.alertas.noSeEncontraronRegistrosMensaje'
            )
            .subscribe((response: any) => {
              this.frontService.alert.info(response);
            });

          this.configuracion.gridFacturacion.component.limpiar();
          return;
        }

        result.content.forEach(dato => (dato['id'] = this.idCompuesta(dato)));
        this.configuracion.gridFacturacion.component.cargarDatos(
          result.content,
          {
            maxPaginas: result.totalPages,
            pagina: result.number,
            cantidadRegistros: result.totalElements
          }
        );
      }, (err: any) => {
        this.frontService.alert.error(err.error.message);
      });
  }

  getFacturacionProteccion(tipo: any, periodo: any, consecutivo: any, asoNumInt: any) {
    this.backService.portafolioAsociadosDetalle.getFacturacionProteccion(tipo, periodo, consecutivo, asoNumInt).subscribe((respuesta: any) => {
      this.selectedFacProteccion = respuesta;

      if (this.selectedFacProteccion.usuarioEmpleado) {
        this.selectedFacProteccion._usuarioEmpleado = `${this.selectedFacProteccion.usuarioEmpleado.idString || this.selectedFacProteccion.usuarioEmpleado.id} - ${
          this.selectedFacProteccion.usuarioEmpleado.name}`;
      } else {
        this.selectedFacProteccion._usuarioEmpleado = this.selectedFacProteccion.usuario;
      }
    }, (err: any) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  _onClickExportarExcel($event) {
    this.backService.portafolioAsociadosDetalle
      .getFacturacionProtecciones({
        asoNumInt: this._asoNumInt,
        consecutivo: this._consecutivo,
        sort: 'periodo',
        direction: 'desc'
      }, {})
      .subscribe((result: IPage<FacturacionProteccion>) => {

        const columnas: string[] = [
          'global.period',
          'asociado.protecciones.facturacion.excel.valorProteccion',
          'asociado.protecciones.facturacion.excel.plan',
          'asociado.protecciones.facturacion.excel.concepto',
          'global.status',
          'asociado.protecciones.facturacion.excel.valorCuota',
          'asociado.protecciones.facturacion.excel.valorGenerado',
          'asociado.protecciones.facturacion.excel.valorFacturado',
          'asociado.protecciones.facturacion.excel.valorMora',
          'asociado.protecciones.facturacion.excel.saldoMora',
          'asociado.protecciones.facturacion.excel.saldoPago',
          'asociado.protecciones.facturacion.excel.valorPagado',
          'asociado.protecciones.facturacion.excel.moraPagada',
          'asociado.protecciones.facturacion.excel.valorDescapitalizado',
          'asociado.protecciones.facturacion.excel.fechaAjuste',
          'asociado.protecciones.facturacion.excel.usuario',
          'asociado.protecciones.facturacion.excel.fechaPago',
          'asociado.protecciones.facturacion.excel.observaciones'
        ];
        ObjectUtil.traducirObjeto(columnas, this.translate);

        this.exportarExcel(
          `Reporte_FacturacionProteccion_${this._asoNumInt}_${DateUtil.dateToString(new Date())}`,
          {
            columnas,
            datos: ObjectUtil.removerAtributos(result.content, [
              'consecutivo',
              'asoNumInt',
              'periodoOr',
              'tipo',
              'tipoNombre',
              'tipoNombreCorto',
              'tipoEstado',
              'estado',
              'estadoNombreCorto',
              'estadoEstado',
              'prodCodigo',
              'usuario',
              'usuarioEmpleado'
            ])
          }
        );
      }, (err: any) => {
        this.frontService.alert.error(err.error.message);
      });
  }

  /**
   * @description Exporta el excel con recto a los datos.
   */
  private exportarExcel(nombre, datos: any = {}) {
    this.backService.utilidades.exportarExcel(nombre, datos).subscribe(respuesta => {
      const body: any = respuesta.body;
      FileUtils.downloadXlsFile(body, nombre);
    }, (err: any) => {
      this.frontService.alert.error(err.error.message);
    });
  }
}
