import { Component, OnInit, OnDestroy } from '@angular/core';
import { HistoricoPortafolioConfig } from './historico-portafolio.config';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PortafolioAsociadosDetalle } from '@shared/models/portafolio-asociados-detalle.model';
import { EventoAsociadosService } from '../../../services/evento-asociados.service';
import { UrlRoute } from '@shared/static/urls/url-route';
import { ProductoDetalleService } from '../../../services/producto-detalle.service';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-historico-portafolio',
  templateUrl: './historico-portafolio.component.html',
})
export class HistoricoPortafolioComponent implements OnInit, OnDestroy {
  portafolioAsociado: any;
  configuracion: HistoricoPortafolioConfig = new HistoricoPortafolioConfig();
  _asoNumInt: string;
  _consecutivo: number;
  plan: any;
  productoDetalle: any;
  isReady: Promise<any>;
  _subs: Subscription[] = [];

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
          params => {
            this._consecutivo = params.consecutivo;
            if (!this._consecutivo) {
              return;
            }

            this._subs.push(this.productoDetalleService.store.subscribe((respuesta: any) => {
              if (respuesta && respuesta.plan) {
                this.plan = respuesta.plan;
                this.productoDetalle = respuesta.detalleSeleccion;
                // Configuramos la grilla.
                this.setupGrid();
              }
            }, (err: any) => {
              this.frontService.alert.error(err.error.message);
            }));
          }));
      }));

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

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description escucha el boton atras de la grid
   */
  _OnAtras(e) {
    this.getHistoricoPlan(e.pagina, e.tamano);
  }
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description escucha el boton siguiente de la grid
   * @return null
   */
  _OnSiguiente(e) {
    this.getHistoricoPlan(e.pagina, e.tamano);
  }

  /**
   * @description Obtiene el detalle del plan. A futuro este metodo debera desaparecer. Se debe
   * implementar un servicio de datos para la informacion del producto a traves del detalle.
   * Ademas se reemplazara el componente de a grilla por el que provea ExistaYa.
   *
   */
  setupGrid() {
    // Obtiene el detalle del plan.
    this.portafolioAsociado = new PortafolioAsociadosDetalle();
    this.backService.portafolioAsociadosDetalle
      .getPortafolioDetalle(this._asoNumInt, this._consecutivo)
      .subscribe(respuesta => {
        this.portafolioAsociado = respuesta as PortafolioAsociadosDetalle;

        // Configura la grilla con base en el c;ódigo de la categoria.
        const that = this;
        this.isReady = Promise.resolve(
          that.configuracion.configurarColumnasTablaHistorico(that.productoDetalle.codigoCategoria)
        );

        // Una vez configuremos la grilla debemos obtener los datos.
        this.getHistoricoPlan(
          this.configuracion.gridHistorico.pagina,
          this.configuracion.gridHistorico.tamano
        );
      });
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Obtiene el historial de plan selecionado
   */
  getHistoricoPlan(pagina: number, tamano: number) {
    this.backService.portafolioAsociadosDetalle
      .getPortafolioHistorico({
        asoNumInt: this._asoNumInt,
        consecutivo: this._consecutivo,
        page: pagina,
        size: tamano
      }, { Observation: this._consecutivo + ',' + this.plan.prodDescripcion })
      .subscribe((respuesta: any) => {
        if (!respuesta.content || respuesta.content.length === 0) {
          this.translate
            .get('asociado.protecciones.historico.noSeEncontraronRegistrosMensaje')
            .subscribe((response: any) => {
              this.frontService.alert.info(response);
            });
          this.configuracion.gridHistorico.component.limpiar();
          return;
        }

        this.configuracion.gridHistorico.component.cargarDatos(
          respuesta.content,
          {
            maxPaginas: respuesta.totalPages,
            pagina: respuesta.number,
            cantidadRegistros: respuesta.totalElements
          }
        );
      }, (err: any) => {
        this.frontService.alert.error(err.error.message);
      });
  }
}
