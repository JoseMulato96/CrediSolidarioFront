import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackFacadeService } from '@core/services/back-facade.service';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { UrlRoute } from '@shared/static/urls/url-route';
import { ListarCanalesConfig } from './listar-canales.config';

@Component({
  selector: 'app-listar-canales',
  templateUrl: './listar-canales.component.html',
})
export class ListarCanalesComponent implements OnInit {

  public linkCrear: string;
  configuracion: ListarCanalesConfig = new ListarCanalesConfig();
  estado: boolean;

  constructor(
    private readonly router: Router,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) { }


  ngOnInit() {
    this.linkCrear = UrlRoute.ADMINISTRACION_PROTECCIONES_CANAL_NUEVO;
    this.estado = true;
  }


  obtenerCanales(pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = 'true') {
    this.backService.canal.getCanalesVentas({ page: pagina, size: tamanio, isPaged: true, estado: estado, sort: sort })
      .subscribe((resp: any) => {
        this.configuracion.gridConfig.component.limpiar();

        if (!resp || !resp._embedded.mimCanal || resp._embedded.mimCanal === 0) {
          return;
        }

        this.configuracion.gridConfig.component.cargarDatos(
          this.asignarEstados(resp._embedded.mimCanal), {
          maxPaginas: resp.page.totalPages,
          pagina: resp.page.number,
          cantidadRegistros: resp.page.totalElements
        });
      }, (err) => {
        this.frontService.alert.warning(err.error.message);
      });
  }

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

  _onClickCeldaElement(event) {
    this._alEditar(event.dato);
  }


  _onSiguiente(e: any) {
    this._obtenerDatosConEstados(e, this.estado);
  }

  _onAtras(e: any) {
    this._obtenerDatosConEstados(e, this.estado);
  }

  _alEditar(event: any) {
    const accion = event;
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_CANALES,
      accion.codigo]);
  }

  _ordenar($event) {
    this._obtenerDatosConEstados($event, this.estado);
  }

  _onToggleStatus($event) {
    this._obtenerDatosConEstados($event, $event.currentTarget.checked);
  }

  _obtenerDatosConEstados($event, estado: boolean) {
    this.estado = estado;
    this.obtenerCanales($event.pagina, $event.tamano, $event.sort, this.estado ? 'true' : '');
  }

}
