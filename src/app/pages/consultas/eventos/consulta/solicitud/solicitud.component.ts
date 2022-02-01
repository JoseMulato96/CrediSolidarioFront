import { Component, OnInit, OnDestroy } from '@angular/core';
import { UrlRoute } from '@shared/static/urls/url-route';
import { Location } from '@angular/common';
import { DataService } from '@core/store/data.service';
import { Subscription, forkJoin } from 'rxjs';
import { DatosAsociadoWrapper } from '@core/store/asociado-data.service';
import { Acciones } from '@core/store/acciones';
import { SolicitudConfig } from './solicitud.config';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html'
})
export class SolicitudComponent implements OnInit, OnDestroy {

  _subs: Subscription[];
  datosAsociado: any;
  asoNumInt: string;
  gestionarConfig: SolicitudConfig = new SolicitudConfig();
  idProceso: string;
  idSubproceso: string;
  tipoConsulta: string;
  mostrarDatosEvento: boolean;
  reclamacion: any;
  solicitudEvento: any;
  liquidacion: any;

  constructor(
    private readonly dataService: DataService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly backService: BackFacadeService,
    private readonly location: Location
    ) {
    this._subs = [];
  }

  ngOnInit() {

    this._subs.push(this.route.firstChild.paramMap.subscribe((params: ParamMap): void => {
      this.idProceso = (params && params.get('idProceso')) || null;
      this.idSubproceso = (params && params.get('idSubproceso')) || null;
      this.tipoConsulta = (params && params.get('tipoConsulta')) || null;
    }));

    this._subs.push(this.route.params.subscribe((params) => {
      this.asoNumInt = (params && params.asoNumInt);
      this._datosAsociado();
      if (this.idSubproceso) {
        this.backService.proceso.getProcesoPadrePorIdSubproceso(this.idSubproceso).subscribe(proceso => {
          this.idProceso = proceso.processInstanceId;
          this._datosEvento();
        });
      } else {
        this._datosEvento();
      }
    }));
  }

  _datosEvento() {
    if (this.tipoConsulta !== null && this.tipoConsulta === '1') {
      this.backService.reclamaciones.getReclamacion(this.idProceso).subscribe((reclamacion: any) => {

        this.reclamacion = {
          asoNumInt: reclamacion.asoNumInt,
          codigo: reclamacion.recCodigo,
          fechaEvento: reclamacion.recFechaEvento,
          fechaSolicitud: reclamacion.recFechaReclamacion,
          mimEvento: {nombre: reclamacion.tipoAuxDescripcion},
          mimEstadoSolicitudEvento: { nombre: reclamacion.recEstadoNombre}
        };

        this.mostrarDatosEvento = true;
        setTimeout(() => {
          this.gestionarConfig.detalleEvento.component.cargarDatos(this.reclamacion);
          this.gestionarConfig.detalleEvento.component.toggle(true);
        });

      }, (err) => {
        this.mostrarDatosEvento = false;
      });
    } else {
      if (this.idProceso !== null) {

        forkJoin({
          _solicitudEvento: this.backService.solicitudEvento.getSolicitudEvento(this.idProceso),
          _liquidacion: this.backService.liquidacion.getLiquidacionesEvento({'mimSolicitudEvento.codigo' : this.idProceso}),
        }).subscribe(items => {

          this.solicitudEvento = items._solicitudEvento;

          if (!items._liquidacion || !items._liquidacion.content || items._liquidacion.content.length === 0) {
            this.liquidacion = null;
          } else {
            this.liquidacion = items._liquidacion.content[0];
          }

          const nombreEstado = this.solicitudEvento.mimEstadoSolicitudEvento.codigo === MIM_PARAMETROS.MIM_ESTADOS_SOLICITUD_EVENTO.EN_PROCESO ?
          this.solicitudEvento.mimFaseFlujo ? this.solicitudEvento.mimFaseFlujo.nombre : this.solicitudEvento.mimEstadoSolicitudEvento.nombre :
          this.solicitudEvento.mimEstadoSolicitudEvento.nombre;

          this.solicitudEvento.mimEstadoSolicitudEvento = { nombre: nombreEstado };
          this.solicitudEvento.nroLiquidacion = this.liquidacion ? this.liquidacion.codigo : null;

          this.mostrarDatosEvento = true;
          setTimeout(() => {
            this.gestionarConfig.detalleEvento.component.cargarDatos(this.solicitudEvento);
            this.gestionarConfig.detalleEvento.component.toggle(true);

            this.gestionarConfig.detalleEvento.footer.link = [
              UrlRoute.PAGES,
              UrlRoute.CONSULTAS,
              UrlRoute.CONSULTAS_EVENTOS,
              this.asoNumInt,
              UrlRoute.CONSULTAS_EVENTOS_CONSULTA_SOLICITUD,
              this.idProceso,
              UrlRoute.CONSULTAS_EVENTOS_CONSULTA_SOLICITUD_DATOS_EVENTO
            ];
          });

        }, (err) => {
          this.mostrarDatosEvento = false;
        });
      }
    }
  }

  _datosAsociado() {
    // Configuramos los datos del asociado.
    if (this.asoNumInt !== null && this.asoNumInt !== undefined) {
      this._subs.push(this.dataService
        .asociados()
        .asociado.subscribe((datosAsociadoWrapper: DatosAsociadoWrapper) => {
          if (
            !datosAsociadoWrapper ||
            datosAsociadoWrapper.datosAsociado.numInt !== this.asoNumInt
          ) {
            this.dataService
              .asociados()
              .accion(Acciones.Publicar, this.asoNumInt, true);
            return;
          }
          this.datosAsociado = datosAsociadoWrapper.datosAsociado;
          this.gestionarConfig.detalleEvento.title = this.datosAsociado.nomCli;
        }));
    }
  }

  _onAtras() {
    if (this.router.url.includes( UrlRoute.CONSULTAS_EVENTOS_CONSULTA_SOLICITUD_DATOS_EVENTO )) {
      this.location.back();
    } else {
      this.router.navigate([UrlRoute.PAGES]);
    }
  }

  ngOnDestroy() {
    this._subs.forEach(sub => sub.unsubscribe());
  }

}
