import { Component, OnInit } from '@angular/core';
import { AlertService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';
import { IPage } from '@shared/interfaces/page.interface';
import { RecaudosFacturacionAsociadosDetalle } from '@shared/models/recaudos-facturacion-asociados-detalle.model';
import { RecaudosFacturacionAsociadosService } from '../services/recaudos-facturacion-asociados.service';
import { RecaudosFacturacionAsociadosDetalleConfig } from './recaudos-facturacion-asociados-detalle.config';


@Component({
  selector: 'app-recaudos-facturacion-asociados-detalle',
  templateUrl: './recaudos-facturacion-asociados-detalle.component.html'
})
export class RecaudosFacturacionAsociadosDetalleComponent implements OnInit {
  configuracion: RecaudosFacturacionAsociadosDetalleConfig = new RecaudosFacturacionAsociadosDetalleConfig();
  builded: Promise<any>;
  _asoNumInt: string;
  _consecutivo: number;
  totalDetalleRecaudo: number;
  showPanelDetalleRecaudo = false;

  constructor(
    private readonly recaudosFacAsoService: RecaudosFacturacionAsociadosService,
    private readonly translate: TranslateService,
    private readonly alertService: AlertService
  ) { }

  ngOnInit() {
    // do nothing
  }

  /**
   * @description Captura evento al ir atras en la grilla de recaudos.
   *
   * @param event Evento al dar click en ir atras.
   */
  _OnAtras(event: any) {
    this.getRecaudoDetalle(
      this._asoNumInt,
      this._consecutivo,
      this.configuracion.gridRecaudoDetalleFacAso.pagina,
      this.configuracion.gridRecaudoDetalleFacAso.tamano
    );
  }

  /**
   * @description Captura evento al ir adelante en la grilla de recaudos
   *
   * @param event Evento al dar click en ir adelante.
   */
  _OnSiguiente(event: any) {
    this.getRecaudoDetalle(
      this._asoNumInt,
      this._consecutivo,
      this.configuracion.gridRecaudoDetalleFacAso.pagina,
      this.configuracion.gridRecaudoDetalleFacAso.tamano
    );
  }

  /**
   *
   * @description Abre el detalle de recaudo.
   * @param asoNumInt Identificador unico de asociado.
   * @param consecutivo Consecutivo del recaudo.
   */
  onOpen(asoNumInt: string, consecutivo: number) {
    this._asoNumInt = asoNumInt;
    this._consecutivo = consecutivo;

    this.getRecaudoDetalle(
      this._asoNumInt,
      this._consecutivo,
      this.configuracion.gridRecaudoDetalleFacAso.pagina,
      this.configuracion.gridRecaudoDetalleFacAso.tamano
    );
    this.showPanelDetalleRecaudo = true;
  }

  /**
   *
   * @description Captura evento al cerrar el detalle de recaudo.
   */
  _OnClose() {
    this._consecutivo = undefined;
    this.showPanelDetalleRecaudo = false;
  }

  /**
   *
   * @description Obtiene el detalle de un recaudo.
   * @param asoNumInt Identificador unico de asociado.
   * @param consecutivo Consecutivo del recaudo
   * @param page Pagina.
   * @param size Tamaño de la pagina.
   */
  getRecaudoDetalle(
    asoNumInt: string,
    consecutivo: number,
    page: number,
    size: number
  ) {
    this.recaudosFacAsoService
      .getRecaudosFacturacionAsociadosDetalle({
        asoNumInt: asoNumInt,
        consecutivo: consecutivo,
        page: page,
        size: size
      })
      .subscribe((result: IPage<RecaudosFacturacionAsociadosDetalle>) => {
        if (!result.content || result.content.length === 0) {
          this.translate
            .get(
              'asociado.facturacion.recaudos.noSeEncontraronRegistrosDetalleMensaje'
            )
            .subscribe((response: any) => {
              this.alertService.info(response);
            });
          this._OnClose();
          return;
        }

        if (result.additionalAttributes) {
          this.totalDetalleRecaudo = result.additionalAttributes.totalDetalle;
        }

        const grid: MimGridConfiguracion = this.configuracion
          .gridRecaudoDetalleFacAso;
        grid.datos = result.content;
        grid.maxPaginas = result.totalPages;
        grid.pagina = result.number;
        grid.cantidadRegistros = result.totalElements;

        this.builded = Promise.resolve(
          (this.configuracion.gridRecaudoDetalleFacAso = grid)
        );
      }, (err) => {
        this.alertService.warning(err.error.message);
      });
  }
}
