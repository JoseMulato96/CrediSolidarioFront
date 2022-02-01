import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PortafolioAsociadosDetalle } from '@shared/models/portafolio-asociados-detalle.model';
import { DateUtil } from '@shared/util/date.util';
import { DataService } from '@core/store/data.service';
import { DatosAsociadoWrapper } from '@core/store/asociado-data.service';
import { DatosAsociado } from '@shared/models';
import { APP_PARAMETROS } from '@shared/static/constantes/app-parametros';
import { TranslateService } from '@ngx-translate/core';
import { EventoAsociadosService } from '../../../services/evento-asociados.service';
import { UrlRoute } from '@shared/static/urls/url-route';
import { ProductoDetalleService } from '../../../services/producto-detalle.service';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-detalle-portafolio',
  templateUrl: './detalle-portafolio.component.html'
})
export class DetallePortafolioComponent implements OnInit, OnDestroy {
  _consecutivo: any;
  portafolioAsociado: PortafolioAsociadosDetalle;
  auxilioFunerario: number =
    APP_PARAMETROS.PROTECCIONES.CATEGORIA_PROTECCION.AUXILIO_FUNERARIO;
  _asoNumInt: string;
  datosAsociado: DatosAsociado;
  asociadoSubscription: any;
  productoDetalleSubscription: any;
  usuarioRegistro: any;
  usuarioPromotor: any;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly dataService: DataService,
    private readonly translate: TranslateService,
    private readonly eventoAsociado: EventoAsociadosService,
    private readonly productoDetalle: ProductoDetalleService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) { }

  ngOnInit() {
    this.route.parent.parent.parent.parent.parent.params.subscribe(
      asoParams => {
        this._asoNumInt = asoParams['asoNumInt'];
        if (!this._asoNumInt) {
          return;
        }

        this.productoDetalle.store.subscribe((respuesta: any) => {
          if (respuesta) {
            this.productoDetalleSubscription = respuesta.detalleSeleccion;
          }
        });
        this.asociadoSubscription = this.dataService
          .asociados()
          .asociado.subscribe((respuesta: DatosAsociadoWrapper) => {
            if (
              !respuesta ||
              respuesta.datosAsociado.numInt !== this._asoNumInt
            ) {
              return;
            }

            this.datosAsociado = respuesta.datosAsociado;

            this.route.parent.params.subscribe((consParams: any) => {
              this._consecutivo = consParams['consecutivo'];
              if (!this._consecutivo) {
                return;
              }

              this.getDetallePlan();
            });
          }, (err: any) => {
            this.frontService.alert.error(err.error.message);
          });
      }
    );

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
    if (this.asociadoSubscription) {
      this.asociadoSubscription.unsubscribe();
      this.asociadoSubscription = undefined;
    }
  }

  getDetallePlan() {
    this.backService.portafolioAsociadosDetalle
      .getPortafolioDetalle(this._asoNumInt, this._consecutivo)
      .subscribe((respuesta: any) => {
        this.portafolioAsociado = respuesta as PortafolioAsociadosDetalle;
        this.portafolioAsociado.edad = DateUtil.calcularEdad(
          DateUtil.stringToDate(this.datosAsociado.fecNac),
          DateUtil.stringToDate(this.portafolioAsociado.fecSol),
        );

        // El servicio nos devuelve los datos del empleado en preexistencia.empleado;
        // sin embargo debemos mostrar el id - nombre.
        if (this.portafolioAsociado.usuarioEmpleado) {
          this.portafolioAsociado.usuarioEmpleadoNombre = (this.portafolioAsociado.usuarioEmpleado.idString || this.portafolioAsociado.usuarioEmpleado.id)
            + ' - ' + this.portafolioAsociado.usuarioEmpleado.name;
        } else {
          this.portafolioAsociado.usuarioEmpleadoNombre = this.portafolioAsociado.usuario;
        }

        if (this.portafolioAsociado.promotorEmpleado) {
          this.portafolioAsociado.promotorEmpleadoNombre = (this.portafolioAsociado.promotorEmpleado.idString || this.portafolioAsociado.promotorEmpleado.id)
            + ' - ' + this.portafolioAsociado.promotorEmpleado.name;
        } else {
          this.portafolioAsociado.promotorEmpleadoNombre = this.portafolioAsociado.promotor;
        }

        if (respuesta.proObservacion) {
          this.portafolioAsociado.proObservacion =
            respuesta.nomEstPro + ' - ' + respuesta.proObservacion;
        } else if (respuesta.prodCodigo === APP_PARAMETROS.PROTECCIONES.PORTAFOLIO_ASOCIADOS_DETALLE.AUXILIO_FUNERARIO &&
          respuesta.proTipoPago === APP_PARAMETROS.PROTECCIONES.PORTAFOLIO_ASOCIADOS_DETALLE.proTipoPago) {
          this.translate
            .get('asociado.protecciones.detalle.defatulTextObservacion')
            .subscribe((response: string) => {
              this.portafolioAsociado.proObservacion = response || 'Renuncia';
            });
        } else {
          this.portafolioAsociado.proObservacion = respuesta.nomEstPro;
        }

        this.backService.portafolioAsociadosDetalle
          .getEvento(
            this._consecutivo,
            String(this._asoNumInt || ''),
            String(this.portafolioAsociado.proCod || '')
          )
          .subscribe((validacionEvento: any) => {
            this.portafolioAsociado.proFechaVigenciaAuxFunerario =
              validacionEvento.proFechaVigenciaAuxFunerario;
            this.portafolioAsociado.proFechaVigenciaProductoEnfermedadGrave =
              validacionEvento.proFechaVigenciaProductoEnfermedadGrave;
          });
      }, (err: any) => {
        this.frontService.alert.error(err.error.message);
      });
  }
}
