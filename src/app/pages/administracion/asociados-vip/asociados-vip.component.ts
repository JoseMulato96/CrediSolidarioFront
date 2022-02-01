import { Component, OnInit } from '@angular/core';
import { ConsultaAsociadosVIPConfig } from './asociados-vip.config';
import { AsociadosVipService } from './services/asociados-vip.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '@core/services';
import { from } from 'rxjs';

@Component({
  selector: 'app-asociados-vip',
  templateUrl: './asociados-vip.component.html'
})
export class AsociadosVIPComponent implements OnInit {

  configuracion: ConsultaAsociadosVIPConfig = new ConsultaAsociadosVIPConfig();


  constructor(
    private readonly asociadosVipService: AsociadosVipService,
    private readonly translate: TranslateService,
    private readonly alertService: AlertService
  ) { }

  ngOnInit() {
    this.obtenerAsociadosVip();
  }

  onBuscarAsociado($event) {
    this.configuracion.deshabilitarBotonAgregar = false;
    this.configuracion.asociado = $event;
  }

  onLimpiar($event) {
    this.configuracion.asociado = undefined;
  }

  onEliminar($event) {
    const asociado = $event;
    this.translate.get('asociadosVIP.alertas.deseaEliminarAsociado', {
      asociado:
        asociado.nitCli + ' - ' + asociado.nomCli
    }).subscribe((mensaje: string) => {
      const modalPromise = this.alertService.confirm(mensaje, 'danger');
      const newObservable = from(modalPromise);

      newObservable.subscribe(
        (desition: any) => {
          if (desition === true) {
            this.eliminarAsociadoVip(asociado.numInt);
          }
        });
    });
  }

  obtenerAsociadosVip() {
    this.asociadosVipService.obtenerAsociadosVip().subscribe((respuesta: any) => {
      if (!respuesta.content && !respuesta.content.length) {
        this.translate
          .get('asociado.noSeEncontraronRegistrosMensaje')
          .subscribe((response: string) => {
            this.alertService.info(response);
          });
        return;
      }

      this.configuracion.gridAsociadosVip.component.cargarDatos(
        respuesta.content,
        {
          maxPaginas: respuesta.totalPages - 1,
          pagina: respuesta.number,
          cantidadRegistros: respuesta.totalElements
        }
      );
    });
  }

  agregarAsociadoVip() {
    if (!this.configuracion.asociado) {
      this.translate.get('asociadosVIP.alertas.debeBuscarAsociado').subscribe((mensaje: string) => {
        this.alertService.info(mensaje);
      });
      return;
    }

    const asociado = {
      asoNumInt: this.configuracion.asociado.numInt,
      nitCli: this.configuracion.asociado.nitCli,
      tipoDoc: this.configuracion.asociado.tipDoc
    };

    this.asociadosVipService.guardarAsociadoVip(asociado).subscribe((respuesta: any) => {
      this.translate.get('global.guardadoExitosoMensaje').subscribe((mensaje: string) => {
        this.alertService.success(mensaje).then(() => {
          this.obtenerAsociadosVip();
          this.configuracion.buscarAsociadoConfiguracion.component.onLimpiar();
        });
      });
    }, err => {
      this.translate.get('error.500.mensaje').subscribe((mensaje: string) => {
        this.alertService.error(err.error && err.error.message && err.error.message.length !== 0 ? err.error.message : mensaje);
      });
    });
  }

  eliminarAsociadoVip(asoNumInt: string) {
    this.asociadosVipService.eliminarAsociadoVip(asoNumInt).subscribe((respuesta: any) => {
      this.translate.get('global.eliminadoExitosoMensaje').subscribe((mensaje: string) => {
        this.alertService.success(mensaje);
      });

      this.obtenerAsociadosVip();
    });
  }
}
