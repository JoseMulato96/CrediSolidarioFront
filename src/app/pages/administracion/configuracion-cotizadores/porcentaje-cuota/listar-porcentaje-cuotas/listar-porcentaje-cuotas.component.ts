import { Component, OnInit } from '@angular/core';
import { ListarPorcentajeCuotasConfig } from './listar-porcentaje-cuotas.config';
import { Router } from '@angular/router';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-listar-porcentaje-cuotas',
  templateUrl: './listar-porcentaje-cuotas.component.html',
})
export class ListarPorcentajeCuotasComponent implements OnInit {
  configuracion: ListarPorcentajeCuotasConfig = new ListarPorcentajeCuotasConfig();
  estado: boolean;

  constructor(
    private readonly router: Router,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
    ) {
      this.estado = true;
    }

  ngOnInit(): void {
    this._obtenerDatos(0, 10, 'fechaCreacion,desc', this.estado ? 'true' : '');
  }

  _obtenerDatos(pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = 'true') {
    const param: any = { page: pagina, size: tamanio, isPaged: true, sort, estado };

    this.backService.porcentajeCuotas.getPorcentajeCuotas(param)
      .subscribe((resp: any) => {
        this.configuracion.gridListar.component.limpiar();

        if (!resp || !resp.content || resp.content.length === 0) {
          return;
        }

        this.configuracion.gridListar.component.cargarDatos(
          this.asignarEstados(resp.content), {
          maxPaginas: resp.totalPages,
          pagina: resp.number,
          cantidadRegistros: resp.totalElements
        });
      }, (err) => {
        this.frontService.alert.error(err.error.message);
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

  _onAtras(e) {
    this._obtenerDatos(e.pagina, e.tamano, e.sort, this.estado ? 'true' : '');
  }

  _onSiguiente(e) {
    this._obtenerDatos(e.pagina, e.tamano, e.sort, this.estado ? 'true' : '');
  }

  _ordenar(e) {
    this._obtenerDatos(e.pagina, e.tamano, e.sort, this.estado ? 'true' : '');
  }

  _onClickCeldaElement($event: any) {
    if ($event.col.key === 'editar') {
      this._alEditar($event.dato);
    }
  }

  _onToggleStatus(e) {
    this.estado = e.currentTarget.checked;
    this._obtenerDatos(0, 10, 'fechaCreacion,desc', e.currentTarget.checked || '');
  }

  _alEditar($event: any) {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_COTIZADORES,
      UrlRoute.ADMINISTRACION_COTIZADORES_PORCENTAJE_CUOTA,
      $event.codigo]);
  }

  irACrear() {
    return [UrlRoute.ADMINISTRACION_COTIZADORES_PORCENTAJE_CUOTA_NUEVO];
  }

}
