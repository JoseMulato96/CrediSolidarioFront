import { Component, OnInit } from '@angular/core';
import { ListarCartasConfig } from './listar-cartas.config';
import { UrlRoute } from '@shared/static/urls/url-route';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '@core/services';
import { from } from 'rxjs';
import { Router } from '@angular/router';
import { ParametroCartaService } from '@core/services/api-back.services/mimutualutilidades/parametro-carta.service';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-listar-cartas',
  templateUrl: './listar-cartas.component.html'
})

export class ListarCartasComponent implements OnInit {

  public linkCrear: string;
  configuracion: ListarCartasConfig = new ListarCartasConfig();
  estado = true;

  constructor(
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) { }

  ngOnInit() {
    this.linkCrear = UrlRoute.ADMINISTRACION_PARAMETRIZAR_CARTAS_NUEVO;
    this.estado = true;
  }

  obtenerCartas(pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = 'true') {
    const param: any = { page: pagina, size: tamanio, isPaged: true, sort: sort, estado: estado };

    this.backService.parametroCarta.obtenerCartas(param)
      .subscribe((cartas: any) => {
        this.configuracion.gridListarCartas.component.limpiar();

        if (!cartas || !cartas.content || cartas.content.length === 0) {
          return;
        }

        this.configuracion.gridListarCartas.component.cargarDatos(
          this.asignarEstados(cartas.content), {
          maxPaginas: cartas.totalPages,
          pagina: cartas.number,
          cantidadRegistros: cartas.totalElements
        });

      }, (err) => {
        this.frontService.alert.error(err.error.message);
      });
  }

 /**
  * Autor: Cesar Millan
  * Función: Metodo para formatear la descripcion del estado
  * @param items Son los estados del asociado.
  */
  asignarEstados(items: any) {
    const listObj = [];
    let item: any;
    for (item of items) {
      listObj.push({
        ...item,
        _estado: item.estado ? 'Si' : 'No'
      });
    }
    return listObj;
  }

  _onAtras($event) {
    this._obtenerDatosConEstados($event, this.estado);
  }

  _onSiguiente($event) {
    this._obtenerDatosConEstados($event, this.estado);
  }

  _onClickCeldaElement($event: any) {
    if ($event.col.key === 'editar') {
      this._alEditar($event.dato);
    } else {
      this._alEliminar($event.dato);
    }
  }

  _alEditar($event: any) {
    const carta = $event;
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINISTRACION_PARAMETRIZAR_CARTAS,
      carta.codigo]);
  }

   _alEliminar($event: any) {
    const carta = $event;
    this.translate.get('administracion.parametrizarCartas.alertas.deseaEliminarCarta', {
      carta:
        carta.codigo + ' - ' + carta.nombre
    }).subscribe((mensaje: string) => {
      const modalPromise = this.frontService.alert.confirm(mensaje, 'danger');
      const newObservable = from(modalPromise);

      newObservable.subscribe(
        (desition: any) => {
          if (desition === true) {
            this.eliminarCarta(carta.codigo);
          }
        });
    });
  }

  eliminarCarta(codigo: any) {
    this.backService.parametroCarta.eliminarCarta(codigo).subscribe((respuesta: any) => {
      this.translate.get('global.eliminadoExitosoMensaje').subscribe((mensaje: string) => {
        this.frontService.alert.success(mensaje);
      });

      this.obtenerCartas();
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  _ordenar($event) {
    this._obtenerDatosConEstados($event, this.estado);
  }

  _onToggleStatus($event) {
    this._obtenerDatosConEstados($event, $event.currentTarget.checked);
  }

  _obtenerDatosConEstados($event, estado: boolean) {
    this.estado = estado;
    this.obtenerCartas($event.pagina, $event.tamano, $event.sort, this.estado ? 'true' : '');
  }

}
