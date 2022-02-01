import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { RecaudosFacturacionAsociadosConfig } from './recaudos-facturacion-asociados.config';
import { RecaudosFacturacionAsociados } from '@shared/models/recaudos-facturacion-asociados.model';
import { IPage } from '@shared/interfaces/page.interface';
import { RecaudosFacturacionAsociadosService } from './services/recaudos-facturacion-asociados.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '@core/services';
import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';
import { RecaudosFacturacionAsociadosDetalleComponent } from './recaudos-detalle/recaudos-facturacion-asociados-detalle.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recaudos-facturacion-asociados',
  templateUrl: './recaudos-facturacion-asociados.component.html',
})
export class RecaudosFacturacionAsociadosComponent implements OnInit, OnDestroy {

  configuracion: RecaudosFacturacionAsociadosConfig = new RecaudosFacturacionAsociadosConfig();
  builded: Promise<any>;
  _asoNumInt: string;
  _asoNumIntSubscription: any;
  page: IPage<RecaudosFacturacionAsociados>;

  @ViewChild(RecaudosFacturacionAsociadosDetalleComponent)
  recaudosFacturacionAsociadosDetalleComponent: RecaudosFacturacionAsociadosDetalleComponent;

  constructor(
    private readonly recaudosFacAsoService: RecaudosFacturacionAsociadosService,
    private readonly route: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly alertService: AlertService,
    ) {}

  ngOnInit() {
    this._asoNumIntSubscription = this.route.parent.parent.parent.params.subscribe(params => {
      this._asoNumInt = params['asoNumInt'];

      this.getRecaudos(
        this._asoNumInt,
        this.configuracion.gridRecaudosFacAso.pagina,
        this.configuracion.gridRecaudosFacAso.tamano);
    });
  }

  ngOnDestroy() {
    if (this._asoNumIntSubscription) {
      this._asoNumIntSubscription.unsubscribe();
      this._asoNumIntSubscription = undefined;
    }
  }

  /**
   * @description Captura evento al ir atras en la grilla de recaudos.
   *
   * @param event Evento al dar click en ir atras.
   */
  _OnAtras(event: any) {
    this.getRecaudos(
      this._asoNumInt,
      this.configuracion.gridRecaudosFacAso.pagina,
      this.configuracion.gridRecaudosFacAso.tamano);
  }

  /**
   * @description Captura evento al ir adelante en la grilla de recaudos
   *
   * @param event Evento al dar click en ir adelante.
   */
  _OnSiguiente(event: any) {
    this.getRecaudos(
      this._asoNumInt,
      this.configuracion.gridRecaudosFacAso.pagina,
      this.configuracion.gridRecaudosFacAso.tamano);
  }

  /**
   * @description Captura evento al dar click en la celda.
   *
   */
  _OnClickCelda(event: RecaudosFacturacionAsociados) {
    this.recaudosFacturacionAsociadosDetalleComponent.onOpen(this._asoNumInt, event.consecutivo);
  }

  /**
   *
   * @description Obtiene los recaudos del asociado.
   * @param asoNumInt Identificador unico de asociado.
   * @param page Pagina
   * @param size Tamaño
   */
  getRecaudos(asoNumInt: string, page: number, size: number) {
    this.recaudosFacAsoService
    .getRecaudosFacturacionAsociados({
      asoNumInt: asoNumInt,
      page: page,
      size: size
    })
    .subscribe(
      (result: IPage<RecaudosFacturacionAsociados>) => {
        if (!result.content || result.content.length === 0) {
          this.translate.get('asociado.facturacion.recaudos.noSeEncontraronRegistrosMensaje').subscribe((response: any) => {
            this.alertService.info(response);
          });

          return;
        }

        const grid: MimGridConfiguracion = this.configuracion.gridRecaudosFacAso;
        grid.datos = result.content;
        grid.maxPaginas = result.totalPages;
        grid.pagina = result.number;
        grid.cantidadRegistros = result.totalElements;

        this.builded = Promise.resolve(
          (this.configuracion.gridRecaudosFacAso = grid)
        );
      }, (err) => {
        this.alertService.warning(err.error.message);
      });
  }
}
