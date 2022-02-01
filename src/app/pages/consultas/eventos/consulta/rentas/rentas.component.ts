import { Component, OnInit, OnDestroy } from '@angular/core';
import { RentasConfig } from './rentas.config';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SIP_PARAMETROS_TIPO } from '@shared/static/constantes/sip-parametros-tipo';
import { Location } from '@angular/common';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-rentas',
  templateUrl: './rentas.component.html',
})
export class RentasComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  recCodigo: string;
  configuracion: RentasConfig = new RentasConfig();
  queryParams: any;
  reclamacion: any;
  asociado: any;
  detalleReclamacion: any;
  tiposContrato: any;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly location: Location,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) { }

  ngOnInit() {
    this.subscriptions.push(this.activatedRoute.params.subscribe(
      params => {
        this.recCodigo = params['recCodigo'];
        if (!this.recCodigo) {
          return;
        }

        this.getTiposContrato();
        this.getRentas();
        this.getReclamacion();
      }
    ));

    this.subscriptions.push(this.activatedRoute.queryParams.subscribe((params) => {
      this.queryParams = params;
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  _OnAtras($event) {
    this.getRentas($event.pagina, $event.tamano);
  }

  _OnSiguiente($event) {
    this.getRentas($event.pagina, $event.tamano);
  }

  _onAtras() {
    this.location.back();
  }

  getReclamacion() {
    // Obtenemos informacion de la reclamacion.
    this.backService.reclamaciones.getReclamacion(this.recCodigo).subscribe((reclamacion: any) => {
      this.reclamacion = reclamacion || {};

      // Obtenemos informacion del detalle de reclamacion.
      this.backService.detalleReclamaciones.obtenerDetalleReclamaciones({
        recCodigo: this.recCodigo
      }).subscribe((detalleReclamaciones: any) => {
        if (detalleReclamaciones && detalleReclamaciones.content) {
          this.detalleReclamacion = detalleReclamaciones.content[0] || {};
        }

        // Obtenemos la informacion del tipo contrato.
        const tipoContrato = this.getTipoContrato(this.detalleReclamacion.detRecTipoContrato);
        this.detalleReclamacion._tipoContrato = tipoContrato;

        // Solicitamos la informacion del asociado.
        this.backService.asociado.obtenerAsociado(this.reclamacion.asoNumInt).subscribe((asociado: any) => {
          this.asociado = asociado || {};

          this.configuracion.personaRentas.title = this.asociado.nomCli;
          // Configuaramos la informacion.
          this.configuracion.personaRentas.items = [
            {
              label: 'eventos.consulta.rentas.nombre',
              value: this.asociado.nomCli
            },
            {
              label: 'eventos.consulta.rentas.identificacion',
              value: this.asociado.nitCli
            },
            {
              label: 'eventos.consulta.rentas.tipoAuxilio',
              value: this.reclamacion.tipoAuxDescripcion
            },
            {
              label: 'eventos.consulta.rentas.noReclamacion',
              value: this.reclamacion.recCodigo
            },
            {
              label: 'eventos.consulta.rentas.fechaEevento',
              value: this.reclamacion.recFechaEvento
            },
            {
              label: 'eventos.consulta.rentas.fechaRadicacion',
              value: this.reclamacion.recFechaReclamacion
            },
            {
              label: 'eventos.consulta.rentas.tipoContrato',
              value: this.detalleReclamacion && this.detalleReclamacion._tipoContrato ?
                this.detalleReclamacion._tipoContrato.nombre : ''
            },
            {
              label: 'eventos.consulta.rentas.empresa',
              value: this.detalleReclamacion ? this.detalleReclamacion.detRecNombreEmpresa : ''
            }
          ];
          setTimeout(() => {
            this.configuracion.personaRentas.component.cargarDatos(
              this.configuracion.personaRentas.items
            );
          });

        }, (err: any) => {
          this.frontService.alert.error(err.error.message);
        });
      }, err => {
        this.translate.get('asociado.noSeEncontroRegistroMensaje',
          {
            asoNumInt: this.reclamacion.asoNumInt
          }).subscribe((response: string) => {
            this.frontService.alert.error(response);
            this._onAtras();
          });
      });
    }, (err: any) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  getRentas(pagina = 0, tamano = 10) {
    this.backService.reclamaciones.getRentas({
      recCodigo: this.recCodigo,
      estados: [SIP_PARAMETROS_TIPO.TIPO_ESTADOS_RENTAS.SIP_PARAMETROS.PAGADA],
      isPaged: false
    }).subscribe((page: any) => {
      if (!page || page.content.length === 0) {
        this.translate
          .get(
            'eventos.consulta.rentas.noSeEncontraronRegistrosMensaje'
          )
          .subscribe((response: any) => {
            this.frontService.alert.info(response);
          });

        return;
      }

      page.content.forEach((renta: any) => {
        renta._renEstado = renta.renEstado === 2 ? 'SI' : 'NO';
      });

      this.configuracion.gridRentas.component.cargarDatos(
        page.content,
        {
          maxPaginas: page.totalPages,
          pagina: page.number,
          cantidadRegistros: page.totalElements
        }
      );
    }, (err: any) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  getTiposContrato() {
    this.backService.parametro.getParametrosTipo(SIP_PARAMETROS_TIPO.TIPO_CONTRATOS_AUXILIO_DESEMPLEO.TIP_COD).subscribe((tiposContrato: any) => {
      this.tiposContrato = tiposContrato;
    }, (err: any) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  getTipoContrato(tipoContrato: string) {
    if (!this.tiposContrato) {
      return;
    }

    for (let i = 0; i < this.tiposContrato.sipParametrosList.length; i++) {
      const sipParametro = this.tiposContrato.sipParametrosList[i];
      if (sipParametro.sipParametrosPK.codigo === tipoContrato) {
        return sipParametro;
      }
    }
  }
}
