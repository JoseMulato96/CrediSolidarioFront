import { Component, OnInit } from '@angular/core';
import { BackFacadeService } from '@core/services/back-facade.service';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { TranslateService } from '@ngx-translate/core';
import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';
import { SolidaridadFacturacionDetalleConfig } from './solidaridad-facturacion-detalle.config';


@Component({
  selector: 'app-solidaridad-facturacion-detalle',
  templateUrl: './solidaridad-facturacion-detalle.component.html'
})
export class SolidaridadFacturacionDetalleComponent implements OnInit {
  configuracion: SolidaridadFacturacionDetalleConfig = new SolidaridadFacturacionDetalleConfig();
  builded: Promise<any>;
  _asoNumInt: string;
  _consecutivo: number;
  showPanelDetalleMora = false;
  _periodo: string;
  _prodCodigo: string;
  _totalMora: number;

  constructor(
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) { }

  ngOnInit() {
    // do nothing
  }

  /**
   * @author Hander Fernando Gutierrez
   * @description Abre el detalle de Mora.
   * @param asoNumInt Identificador unico de asociado.
   * @param consecutivo Consecutivo de la solidaridad.
   */
  onOpen(asoNumInt: string, periodo: string, prodCodigo: string) {
    this._asoNumInt = asoNumInt;
    this._periodo = periodo;
    this._prodCodigo = prodCodigo;

    this.getMoraDetalle({
      asoNumInt: this._asoNumInt,
      periodo: this._periodo,
      prodCodigo: this._prodCodigo,
      page: this.configuracion.gridSolidaridadDetalle.pagina,
      size: this.configuracion.gridSolidaridadDetalle.tamano
    });
    this.showPanelDetalleMora = true;
  }

  /**
   * @author Hander Fernando Gutierrez
   * @description Captura evento al cerrar el detalle de Mora.
   */
  _OnClose() {
    this._consecutivo = undefined;
    this.showPanelDetalleMora = false;
  }

  /**
   * @author Hander Fernando Gutierrez
   * @description Obtiene el detalle de mora.
   * @param asoNumInt Identificador unico de asociado.
   * @param consecutivo Consecutivo del Mora
   * @param page Pagina.
   * @param size Tamaño de la pagina.
   */
  getMoraDetalle({
    asoNumInt,
    periodo,
    prodCodigo,
    page,
    size
  }: {
    asoNumInt: string;
    periodo: string;
    prodCodigo: string;
    page: number;
    size: number;
  }) {
    this.backService.solidaridadFacturacion
      .getSolidaridadDetalle({
        asoNumInt: asoNumInt,
        periodo: periodo,
        prodCodigo: prodCodigo
      })
      .subscribe((result: any) => {
        const datos: any[] = result;

        if (!datos || datos.length <= 0) {
          this.translate
            .get(
              'asociado.facturacion.solidaridad.detalle.noSeEncontraronRegistrosDetalleMensaje'
            )
            .subscribe((response: any) => {
              this.frontService.alert.info(response);
            });
          this._OnClose();
          return;
        }
        this._totalMora = 0;
        datos.forEach((e: any) => {
          this._totalMora += e.valorMora;
        });

        const grid: MimGridConfiguracion = this.configuracion
          .gridSolidaridadDetalle;
        grid.datos = datos;
        grid.cantidadRegistros = datos.length;
        this.builded = Promise.resolve(
          (this.configuracion.gridSolidaridadDetalle = grid)
        );
      }, (err) => {
        this.frontService.alert.warning(err.error.message);
      });
  }
}
