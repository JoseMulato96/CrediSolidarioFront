import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InactividadPortafolioConfig } from './inactividad-portafolio.config';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { EventoAsociadosService } from '../../../services/evento-asociados.service';
import { UrlRoute } from '@shared/static/urls/url-route';
import { ProductoDetalleService } from '../../../services/producto-detalle.service';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-inactividad-portafolio',
  templateUrl: './inactividad-portafolio.component.html',
})
export class InactividadPortafolioComponent implements OnInit, OnDestroy {
  configuracion: InactividadPortafolioConfig = new InactividadPortafolioConfig();
  _asoNumInt: string;
  _consecutivo: number;
  subs: Subscription[] = [];
  _nombreProducto: string;
  isForm: Promise<any>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly eventoAsociado: EventoAsociadosService,
    private readonly productEvent: ProductoDetalleService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService,
  ) { }

  ngOnInit() {
    this.subs.push(this.route.parent.parent.parent.parent.parent.params.subscribe(
      asoParams => {
        this._asoNumInt = asoParams['asoNumInt'];
        if (!this._asoNumInt) {
          return;
        }

        this.subs.push(this.route.parent.params.subscribe(
          conseParams => {

            this._consecutivo = conseParams['consecutivo'];
            if (!this._consecutivo) {
              return;
            }

            this.subs.push(this.productEvent.store.subscribe((respuesta: any) => {
              if (respuesta && respuesta.plan) {
                this._nombreProducto = respuesta.plan.prodDescripcion;

                this.getInactividadPlan(
                  this.configuracion.gridInactividad.pagina,
                  this.configuracion.gridInactividad.tamano
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
    this.subs.forEach(sub => {
      if (null != sub && undefined !== sub) {
        sub.unsubscribe();
      }
    });
    this.subs = [];
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description escucha el boton atras de la grid
   * @return null
   */
  _OnAtras(e) {
    this.getInactividadPlan(e.pagina, e.tamano);
  }
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description escucha el boton siguiente de la grid
   * @return null
   */
  _OnSiguiente(e) {
    this.getInactividadPlan(e.pagina, e.tamano);
  }
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Obtiene el historial de plan selecionado
   */
  getInactividadPlan(pagina: number, tamano: number) {
    this.subs.push(
      this.backService.portafolioAsociadosDetalle
        .getPortafolioInatividad({
          asoNumInt: this._asoNumInt,
          consecutivo: this._consecutivo,
          isPaged: true,
          page: pagina,
          size: tamano
        }, { Observation: this._consecutivo + ',' + this._nombreProducto })
        .subscribe((respuesta: any) => {


          if (!respuesta.content || respuesta.content.length === 0) {
            this.translate
              .get(
                'asociado.protecciones.inactividades.noSeEncontraronRegistrosMensaje'
              )
              .subscribe((response: any) => {
                this.frontService.alert.info(response);
              });

            this.configuracion.gridInactividad.component.limpiar();
            return;
          }

          this.configuracion.gridInactividad.component.cargarDatos(
            respuesta.content,
            {
              maxPaginas: respuesta.totalPages,
              pagina: respuesta.number,
              cantidadRegistros: respuesta.totalElements
            }
          );
        }, (err: any) => {
          this.frontService.alert.error(err.error.message);
        }));
  }
}
