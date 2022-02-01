import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '@core/services';
import { UrlRoute } from '@shared/static/urls/url-route';
import { AportesEstatutariosService } from '../../services/aportes-estatutarios.service';
import { ListarAportesEstatutariosConfig } from './listar-aportes-estatutarios.config';

@Component({
  selector: 'app-listar-aportes-estatutarios',
  templateUrl: './listar-aportes-estatutarios.component.html',
})
export class ListarAportesEstatutariosComponent implements OnInit {

  configuracion: ListarAportesEstatutariosConfig = new ListarAportesEstatutariosConfig();
  estado: boolean;

  constructor(private readonly router: Router,
              private readonly alertService: AlertService,
              private readonly aportesEstatutariosService: AportesEstatutariosService
  ) {
    this.estado = true;
  }

  ngOnInit() {
    //do nothing
  }

  _obtenerDatos(pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = 'true') {
    const param: any = { page: pagina, size: tamanio, isPaged: true, sort, estado };

    this.aportesEstatutariosService.getAportesEstatutarios(param)
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
        this.alertService.error(err.error.message);
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

  _onAtras(e:any) {
    this._obtenerDatos(e.pagina, e.tamano, e.sort, this.estado ? 'true' : '');
  }

  _onSiguiente(e:any) {
    this._obtenerDatos(e.pagina, e.tamano, e.sort, this.estado ? 'true' : '');
  }

  _ordenar(e:any) {
    this._obtenerDatos(e.pagina, e.tamano, e.sort, this.estado ? 'true' : '');
  }

  _onClickCeldaElement($event: any) {
    if ($event.col.key === 'editar') {
      this._alEditar($event.dato);
    }
  }

  _onToggleStatus(e:any) {
    this.estado = e.currentTarget.checked ? e.currentTarget.checked : '';
    this._obtenerDatos(0, 10, 'fechaCreacion,desc', this.estado + '');
  }

  _alEditar($event: any) {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_COTIZADORES,
      UrlRoute.ADMINISTRACION_COTIZADORES_APORTES_ESTATUTARIOS,
      $event.codigo]);
  }

  irACrear() {
    return [UrlRoute.ADMINISTRACION_COTIZADORES_PROYECTO_VIDA_NUEVO];
  }

}
