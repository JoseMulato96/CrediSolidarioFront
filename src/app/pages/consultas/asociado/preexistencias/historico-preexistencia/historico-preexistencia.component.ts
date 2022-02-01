import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { SIP_PARAMETROS_TIPO } from '@shared/static/constantes/sip-parametros-tipo';
import { UrlRoute } from '@shared/static/urls/url-route';
import { Subscription } from 'rxjs';

import { EventoAsociadosService } from '../../services/evento-asociados.service';
import { PreexistenciasService } from '../../../../../core/services/api-back.services/mimutualasociados/preexistencias.service';
import { HistoricoPreexistenciaConfig } from './historico-preexistencia.config';

@Component({
  selector: 'app-historico-preexistencia',
  templateUrl: './historico-preexistencia.component.html',
  encapsulation: ViewEncapsulation.None
})
export class HistoricoPreexistenciaComponent implements OnInit, OnDestroy {
  _asoNumInt: string;
  _asoSubscription: Subscription;
  _diagCod: any;
  _diagCodSubscription: Subscription;
  _preCod: any;
  _preCodSubscription: Subscription;

  configuracion: HistoricoPreexistenciaConfig = new HistoricoPreexistenciaConfig();
  historico: any;
  builded: Promise<any>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly preexistenciaService: PreexistenciasService,
    private readonly alertService: AlertService,
    private readonly translate: TranslateService,
    private readonly eventoAsociado: EventoAsociadosService
  ) { }

  ngOnInit() {
    this._asoSubscription = this.route.parent.parent.params.subscribe(
      params => {
        this._asoNumInt = params['asoNumInt'];
        if (!this._asoNumInt) {
          return;
        }

        this._preCodSubscription = this.route.params.subscribe(preCodParams => {
          this._preCod = preCodParams['preCod'];
          if (!this._preCod) {
            return;
          }

          this.eventoAsociado.atras().next({
            mostrar: true,
            url: [
              UrlRoute.PAGES,
              UrlRoute.CONSULTAS,
              UrlRoute.CONSULTAS_ASOCIADO,
              this._asoNumInt,
              UrlRoute.PREEXISTENCIAS,
              this._preCod
            ]
          });
          this.eventoAsociado.summenu().next({ mostrar: false });
        });

        this._diagCodSubscription = this.route.queryParams.subscribe(
          (queryParams: any) => {
            this._diagCod = queryParams.diagCod;

            this.getHistoricoPreexistencia(
              this._asoNumInt,
              this._diagCod,
              this.configuracion.gridHistoricoPreexistencia.pagina,
              this.configuracion.gridHistoricoPreexistencia.tamano
            );
          }
        );
      }
    );
  }

  ngOnDestroy() {
    if (this._asoSubscription) {
      this._asoSubscription.unsubscribe();
      this._asoSubscription = undefined;
    }

    if (this._diagCodSubscription) {
      this._diagCodSubscription.unsubscribe();
      this._diagCodSubscription = undefined;
    }

    if (this._preCodSubscription) {
      this._preCodSubscription.unsubscribe();
      this._preCodSubscription = undefined;
    }
  }

  _OnAtras($event) {
    this.getHistoricoPreexistencia(
      this._asoNumInt,
      this._diagCod,
      this.configuracion.gridHistoricoPreexistencia.pagina,
      this.configuracion.gridHistoricoPreexistencia.tamano
    );
  }

  _OnSiguiente($event) {
    this.getHistoricoPreexistencia(
      this._asoNumInt,
      this._diagCod,
      this.configuracion.gridHistoricoPreexistencia.pagina,
      this.configuracion.gridHistoricoPreexistencia.tamano
    );
  }

  /**
   * @description Obtener historico de preexistencia.
   * @param asoNumInt Identificador unico de asociado.
   * @param diagCod Codigo de diagnostico
   * @param page Pagina
   * @param size Tamanio
   */
  private getHistoricoPreexistencia(
    asoNumInt: string,
    diagCod: any,
    page: number,
    size: number
  ) {
    this.preexistenciaService
      .getHistoricoPreexistencia({
        asoNumInt: asoNumInt,
        diagCod: diagCod,
        preEstado:
          SIP_PARAMETROS_TIPO.TIPO_ESTADOS_PREEXISTENCIAS.SIP_PARAMETROS
            .INACTIVA,
        diagEstado:
          SIP_PARAMETROS_TIPO.TIPO_ESTADOS_DIAGNOSTICOS.SIP_PARAMETROS.ACTIVO,
        page: page,
        size: size
      })
      .subscribe((result: any) => {
        if (!result.content || result.content.length === 0) {
          this.translate
            .get(
              'asociado.preexistencias.historico.noSeEncontraronRegistrosMensaje'
            )
            .subscribe((response: any) => {
              this.alertService.info(response);
            });

          return;
        }

        this.historico = result;
        // El servicio nos devuelve los datos del empleado en historico.content.empleado;
        // sin embargo debemos mostrar el id - nombre.
        // Debemos asegurarnos de mostrar tambien el codigo diagnostico - nombre diagnostico.
        this.historico.content.forEach(registro => {
          if (registro.usuarioDto) {
            registro.empleadoNombre = `${registro.usuarioDto.identification} - ${registro.usuarioDto.name}`;
          } else if (registro.empleado) {
            registro.empleadoNombre = `${registro.empleado.idString || registro.empleado.id} - ${registro.empleado.name}`;
          } else {
            registro.empleadoNombre = registro.usuario;
          }

          registro._diagnostico = `${registro.diagCod} ${registro.diagCod !== null && registro.diagCod !== undefined ? '-' : ''} ${registro.diagnostico}`;
        });

        this.configuracion.gridHistoricoPreexistencia.component.cargarDatos(
          result.content,
          {
            maxPaginas: result.totalPages,
            pagina: result.number,
            cantidadRegistros: result.totalElements
          }
        );
      }, (err: any) => {
        this.alertService.error(err.error.message);
      });
  }
}
