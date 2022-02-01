import { Component, OnInit, OnDestroy } from '@angular/core';
import { ResumenCoberturasVentaConfig } from './resumen-coberturas-venta.config';
import { Store } from '@ngrx/store';
import { AppState } from '@core/store/reducers';
import * as acciones from '../portafolio.actions';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '@core/store/data.service';
import { DatosAsociadoWrapper } from '@core/store/asociado-data.service';
import { UrlRoute } from '@shared/static/urls/url-route';
import { InspektorService } from '../services/inspektor.service';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-resumen-coberturas-venta',
  templateUrl: './resumen-coberturas-venta.component.html',
  styleUrls: ['./resumen-coberturas-venta.component.css']
})
export class ResumenCoberturasVentaComponent implements OnInit, OnDestroy {

  configuracion: ResumenCoberturasVentaConfig = new ResumenCoberturasVentaConfig();
  subs: Subscription[] = [];
  asoNumInt = '';
  datosAsociado: any;
  idProceso: string;
  mostrarLista: boolean;
  inspektor: any;
  mostrarListaRestrictivas: boolean;
  venta: any;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly dataService: DataService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService,
    private readonly inspektorService: InspektorService,
    private readonly store: Store<AppState>
  ) {
    this.mostrarLista = true;
  }

  ngOnInit(): void {
    this.store.dispatch(acciones.mostrarMenuConsultas({ datos: false }));

    this.subs.push(
      this.route.parent.parent.parent.parent.parent.params.subscribe(params => {
        this.asoNumInt = params.asoNumInt;
        if (!this.asoNumInt) {
          return;
        }
      })
    );

    // Para asociado
    this.subs.push(this.dataService.asociados().asociado.subscribe(async (respuesta: DatosAsociadoWrapper) => {
      if (!respuesta) {
        return;
      }
      this.datosAsociado = respuesta.datosAsociado;

      this.subs.push(
        this.route.params.subscribe(async (params: any) => {
          this.idProceso = params.codigo;

          this.venta = await this.backService.venta.getVenta({ idProceso: this.idProceso }).toPromise().catch(err => {
            this.frontService.alert.error(err.error.message);
          });
          this.venta = this.venta && this.venta.content.length > 0 ? this.venta.content[0] : null;
          if (!this.venta) {
            this.translate.get('asociado.protecciones.portafolio.resumen.alertas.noEncontroVenta').subscribe(mensaje => {
              this.frontService.alert.info(mensaje).then(() => {
                this.router.navigate([UrlRoute.PAGES]);
              });
            });
          }

          this.inspektor = await this.inspektorService.getInspektor({ numeroIdentificacion: this.datosAsociado.nitCli, nombreCompleto: this.datosAsociado.nombreAsociado }).toPromise().catch(err => {
            this.frontService.alert.error(err.error.message);
          });

          if (this.inspektor) {
            this.inspektor = {
              ...this.inspektor,
              mimInspektorDetalleList:
                this.inspektor.mimInspektorDetalleList ?
                  this.inspektor.mimInspektorDetalleList.filter(item => item.numDoc === this.datosAsociado.nitCli && item.nombre === this.datosAsociado.nomCli) :
                  []
            };
          }

          this.mostrarListaRestrictivas = this.inspektor && this.inspektor.mimInspektorDetalleList.length > 0 ? true : false;

          // Para el componente mis datos
          this.configuracion.detalle.title = 'Mis datos';
          this.configuracion.detalle.component.cargarDatos(this.venta);

          // Para grid
          this.configuracion.gridListar.component.limpiar();
          if (!this.venta) {
            return;
          }
          this.configuracion.gridListar.borderLeft = true;
          this.configuracion.gridListar.columnas = this.configuracion.gridListarResumen.columnas;
          const _sipProteccionesEventosSet = this.venta.sipProteccionesEventosSet.filter(x => x.proCuota !== 0 && x.proValor != 0);
          this.configuracion.gridListar.component.cargarDatos(_sipProteccionesEventosSet);

        })
      );
    }));
  }

  ngOnDestroy(): void {
    this.store.dispatch(acciones.mostrarMenuConsultas({ datos: true }));
    this.subs.forEach(x => x.unsubscribe());
  }

  cerrar() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.CONSULTAS,
      UrlRoute.CONSULTAS_ASOCIADO,
      this.asoNumInt,
      UrlRoute.PROTECCIONES,
      UrlRoute.PORTAFOLIO_BETA,
      UrlRoute.PORTAFOLIO_PLAN_COBERTURA_MOVIMIENTOS
    ]);
  }

  descargar() {
    // do nothing
  }

  listarPlanCobertura(mostrar: boolean) {
    this.mostrarLista = mostrar;
    this.configuracion.gridListar.component.limpiar();
    this.configuracion.gridListar.borderLeft = mostrar;
    if (mostrar) {
      this.configuracion.gridListar.columnas = this.configuracion.gridListarResumen.columnas;
      this.configuracion.gridListar.component.cargarDatos(this.venta.mimCotizacionDetalleSet);
    } else {
      this.configuracion.gridListar.columnas = this.configuracion.gridListasRestrictivas.columnas;
      this.configuracion.gridListar.component.cargarDatos(this.inspektor.mimInspektorDetalleList);
    }

  }
}
