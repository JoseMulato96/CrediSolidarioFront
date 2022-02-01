import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlRoute } from '@shared/static/urls/url-route';
import { Subscription } from 'rxjs';

import { ProductoDetalleService } from '../../services/producto-detalle.service';
import { PortafolioAsociadosService } from '../portafolio-asociados/services/portafolio-asociados.service';
import { DetallePortafolioComponent } from './detalle-portafolio/detalle-portafolio.component';
import { FacturacionPortafolioComponent } from './facturacion-portafolio/facturacion-portafolio.component';
import { HistoricoPortafolioComponent } from './historico-portafolio/historico-portafolio.component';
import { InactividadPortafolioComponent } from './inactividad-portafolio/inactividad-portafolio.component';

@Component({
  selector: 'app-portafolio-asociados-detalle',
  templateUrl: './portafolio-asociados-detalle.component.html'
})
export class PortafolioAsociadosDetalleComponent implements OnInit, OnDestroy {
  _consecutivo: any;
  _asoNumInt: any;
  _proCod: any;

  activeNumber: number;
  title: any;
  _subs: Subscription[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly productoDetalleService: ProductoDetalleService,
    private readonly router: Router,
    private readonly portafolioAsociadosServ: PortafolioAsociadosService,
  ) { }

  ngOnInit() {
    this._subs.push(
      this.route.parent.parent.parent.parent.parent.params.subscribe(params => {
        this._asoNumInt = params.asoNumInt;
      }),

      this.route.parent.parent.params.subscribe(params => {
        this._proCod = params.proCod;
      }),

      this.route.params.subscribe(params => {
        this._consecutivo = params.consecutivo;
      })
    );

    this._subs.push(this.productoDetalleService.store.subscribe((respuesta: any) => {
      if (respuesta && respuesta.plan) {
        this.title = respuesta.plan.prodDescripcion;
      } else {
        this.getDetalleProducto();
      }
    }));
  }

  ngOnDestroy() {
    this._subs.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });

    // Limpiamos la pila de de detalle de productos.
    this.productoDetalleService.cleanStore();
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Obtiene el detalle del producto selecionado
   */
  getDetalleProducto() {
    // Se consulta los planes del asociado
    this.portafolioAsociadosServ.getPlanesAsociado(this._asoNumInt).subscribe((respuesta: any[]) => {
      // Se busca el plan selecionado de la ruta _proCod
      const plan = respuesta.map(x => x.listaProtecciones).reduce((acc, val) => acc.concat(val), []).find(x => Number(x.proCod) === Number(this._proCod));
      if (!plan) {
        return;
      }

      this.title = plan.prodDescripcion;

      // Se obtiene los detalle del producto
      this.portafolioAsociadosServ.getEventosDetalleProducto(this._asoNumInt, this._proCod, plan.prodDescripcion).subscribe((detalles: any[]) => {
        // Se busca el detalle selecionado del evento
        const detalleSelectionado = detalles.find(x => Number(x.consecutivo) === Number(this._consecutivo));

        if (detalleSelectionado) {
          // Se notifica los datos selecionados
          this.productoDetalleService.setCambioDetalleProducto(
            detalleSelectionado,
            detalles,
            plan
          );
        }
      });
    });
  }

  onClickDetalle() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.CONSULTAS,
      UrlRoute.CONSULTAS_ASOCIADO,
      this._asoNumInt,
      UrlRoute.PROTECCIONES,
      this._proCod,
      UrlRoute.PORTAFOLIO_ASOCIADO_DETALLE,
      this._consecutivo,
      UrlRoute.DETALLE
    ]);
  }
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description enruta a facturacion
   */
  onClickFacturacion() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.CONSULTAS,
      UrlRoute.CONSULTAS_ASOCIADO,
      this._asoNumInt,
      UrlRoute.PROTECCIONES,
      this._proCod,
      UrlRoute.PORTAFOLIO_ASOCIADO_DETALLE,
      this._consecutivo,
      UrlRoute.FACTURACION
    ]);
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description enruta a Inactividades
   */
  onClickInactividades() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.CONSULTAS,
      UrlRoute.CONSULTAS_ASOCIADO,
      this._asoNumInt,
      UrlRoute.PROTECCIONES,
      this._proCod,
      UrlRoute.PORTAFOLIO_ASOCIADO_DETALLE,
      this._consecutivo,
      UrlRoute.INACTIVIDADES
    ]);
  }
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description enruta historico
   */
  onClickHistoricos() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.CONSULTAS,
      UrlRoute.CONSULTAS_ASOCIADO,
      this._asoNumInt,
      UrlRoute.PROTECCIONES,
      this._proCod,
      UrlRoute.PORTAFOLIO_ASOCIADO_DETALLE,
      this._consecutivo,
      UrlRoute.HISTORICO
    ]);
  }

  getVistaRouter(vista) {
    if (vista instanceof DetallePortafolioComponent) {
      this.activeNumber = 1;
    } else if (vista instanceof FacturacionPortafolioComponent) {
      this.activeNumber = 2;
    } else if (vista instanceof InactividadPortafolioComponent) {
      this.activeNumber = 3;
    } else if (vista instanceof HistoricoPortafolioComponent) {
      this.activeNumber = 4;
    }
  }
}
