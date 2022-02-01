import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '@core/services';
import { DatosAsociadosService } from '@core/services/api-back.services/mimutualintegraciones/datos-asociados.service';
import { StoreService } from '@core/services/api-front.services/store.service';
import { ACTION_CONSULTA_STATE_ASOCIADO } from '@core/store/actions/app-action';
import { TranslateService } from '@ngx-translate/core';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { UrlRoute } from '@shared/static/urls/url-route';
import { Subscription } from 'rxjs';

import { ConsultaAsociadosConfig } from './consulta-asociados.config';

@Component({
  selector: 'app-consulta-asociados',
  templateUrl: './consulta-asociados.component.html'
})
export class ConsultaAsociadosComponent implements OnInit, OnDestroy {
  private paramsBusqueda: any;
  configuracion: ConsultaAsociadosConfig = new ConsultaAsociadosConfig();

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly consultarAsociado: DatosAsociadosService,
    private readonly alertService: AlertService,
    private readonly translate: TranslateService,
    private readonly redux: StoreService,
  ) { }

  subs: Subscription[] = [];

  ngOnInit() {
    this.subs.push(
      this.route.queryParams.subscribe(params => {
        this.paramsBusqueda = params;
        this.configuracion.gridConsulta.pagina = parseInt(
          this.paramsBusqueda.p || 0, 10
        );
        if(this.paramsBusqueda.frase){
          this.getConsultarAsociados();
        }
        if(this.paramsBusqueda.nitCli){
          this.getConsultarAsociadosByNiCli();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach(x => x.unsubscribe());
    this.subs = undefined;
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description escucha el boton atras de la grid
   */
  _OnAtras(event: any) {
    const url: string = this.router.url.split('?')[0];
    this.router.navigate([url], {
      queryParams: {
        frase: this.paramsBusqueda.frase,
        p: this.configuracion.gridConsulta.pagina
      }
    });
  }
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description escucha el boton siguiente de la grid
   * @return null
   */
  _OnSiguiente(event: any) {
    const url: string = this.router.url.split('?')[0];
    this.router.navigate([url], {
      queryParams: {
        frase: this.paramsBusqueda.frase,
        p: this.configuracion.gridConsulta.pagina
      }
    });
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description escucha el link de la celda del grid
   */
  _OnClickCelda(dato: any) {
    this.redux.updateAppState({
      action: ACTION_CONSULTA_STATE_ASOCIADO
    });
    this.redux.setTipoAsegurado(dato.tipoAsociado);
    
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.CONSULTAS,
      UrlRoute.CONSULTAS_ASOCIADO,
      dato.numInt,
      UrlRoute.CONSULTAS_ASOCIADO_DATOS_ASOCIADO
    ]);
  }

  private getConsultarAsociados() {
    this.configuracion.gridConsulta.datos = [];
    this.consultarAsociado
      .buscarAsociado({
        nombre: this.paramsBusqueda.frase,
        isPaged: true,
        page: this.configuracion.gridConsulta.pagina,
        size: this.configuracion.gridConsulta.tamano
      })
      .subscribe(
        respuesta => {
          if (!respuesta.content && !respuesta.content.length) {
            this.translate
              .get('asociado.noSeEncontraronRegistrosMensaje')
              .subscribe((response: string) => {
                this.alertService.info(response);
              });
            return;
          }
          this.configuracion.gridConsulta.component.cargarDatos(
            this.asignarEstados(respuesta.content),
            {
              maxPaginas: respuesta.totalPages - 1,
              pagina: respuesta.number,
              cantidadRegistros: respuesta.totalElements
            }
          );
        },
        (err: any) => {
          if (err.status === 404) {
            this.translate
              .get('asociado.noSeEncontraronRegistrosMensaje')
              .subscribe((response: string) => {
                this.alertService.info(response);
              });
            return;
          } else {
            this.alertService.error(err.error.message);
          }
        }
      );
  }

  private getConsultarAsociadosByNiCli() {
    this.configuracion.gridConsulta.datos = [];
    this.consultarAsociado
      .buscarAsociado({
        nitCli: this.paramsBusqueda.nitCli,
        isPaged: true,
        page: this.configuracion.gridConsulta.pagina,
        size: this.configuracion.gridConsulta.tamano
      })
      .subscribe(
        respuesta => {
          if (!respuesta.content && !respuesta.content.length) {
            this.translate
              .get('asociado.noSeEncontraronRegistrosMensaje')
              .subscribe((response: string) => {
                this.alertService.info(response);
              });
            return;
          }
          this.configuracion.gridConsulta.component.cargarDatos(
            this.asignarEstados(respuesta.content),
            {
              maxPaginas: respuesta.totalPages - 1,
              pagina: respuesta.number,
              cantidadRegistros: respuesta.totalElements
            }
          );
        },
        (err: any) => {
          if (err.status === 404) {
            this.translate
              .get('asociado.noSeEncontraronRegistrosMensaje')
              .subscribe((response: string) => {
                this.alertService.info(response);
              });
            return;
          } else {
            this.alertService.error(err.error.message);
          }
        }
      );
  }

  asignarEstados(items: any) {
    const listObj = [];
    let item: any;
    for (item of items) {
      listObj.push({
        ...item,
        _nombreTipo: item.tipoAsociado === MIM_PARAMETROS.MIM_TIPO_ASOCIADO.ASEGURADO ? MIM_PARAMETROS.MIM_TIPO_ASOCIADO.ASEGURADO_NOMBRE : MIM_PARAMETROS.MIM_TIPO_ASOCIADO.RESPONSABLE_PAGO_NOMBRE
      });
    }
    return listObj;
  }

}
