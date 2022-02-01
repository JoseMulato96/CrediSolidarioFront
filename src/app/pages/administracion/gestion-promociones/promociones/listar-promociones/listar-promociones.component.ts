import { Component, OnInit } from '@angular/core';
import { ListarPromocionesConfig } from './listar-promociones.config';
import { Router } from '@angular/router';
import { AlertService } from '@core/services';
import { UrlRoute } from '@shared/static/urls/url-route';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-listar-promociones',
  templateUrl: './listar-promociones.component.html',
})
export class ListarPromocionesComponent implements OnInit {
  configuracion: ListarPromocionesConfig = new ListarPromocionesConfig();
  filtrosGrid: any;
  estado: boolean;

  constructor(
    private readonly router: Router,
    private readonly alertService: AlertService,
    private readonly backService: BackFacadeService
    ) {
      this.estado = true;
      this.filtrosGrid = [];
    }

  ngOnInit(): void {
    this._obtenerDatos(0, 10, 'fechaCreacion,desc', this.estado ? 'true' : '');
  }

  _obtenerDatos(pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = 'true') {
    const param = {page: pagina, size: tamanio, isPaged: true, sort: sort, estado: estado};
    if (this.filtrosGrid.length > 0) {
      this.filtrosGrid.map((x: any) => {
        if (x.columna.typeFilter === 'date') {
          const _fechaFiltro = x.columna.keyFiltro.split(',');
          const _valorFechaFiltro = x.valor.split(',');
          param[_fechaFiltro[0]] = _valorFechaFiltro[0];
          param[_fechaFiltro[1]] = _valorFechaFiltro[1];
        } else {
          param[x.columna.keyFiltro] =  x.valor;
        }
      });
    }

    this.backService.promocion.getPromociones(param)
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

  _obtenerDatosConEstados($event, estado: boolean) {
    this.estado = estado;
    this._obtenerDatos($event.pagina, $event.tamano, $event.sort, this.estado ? 'true' : '');
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

  _ordenar(e: any) {
    this._obtenerDatosConEstados(e, this.estado);
  }

  _onToggleStatus(e) {
    this._obtenerDatosConEstados(e, e.currentTarget.checked);
  }

  _alEditar($event: any) {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINISTRACION_GESTION_PROMOCIONES,
      UrlRoute.ADMINISTRACION_GESTION_PROMOCIONES_PROMOCIONES,
      $event.codigo]);
  }

  irACrear() {
    return [UrlRoute.ADMINISTRACION_GESTION_PROMOCIONES_PROMOCIONES_NUEVO];
  }

  filtroHeader(event: any) {
    if (event.valor === '') {
      this.filtrosGrid = this.filtrosGrid.filter(x => x.columna !== event.columna);
    } else {
      if (this.filtrosGrid.find(item => item.columna === event.columna)) {
        this.filtrosGrid.find(x => x.columna === event.columna).valor = event.valor;
      } else {
        this.filtrosGrid.push(event);
      }
    }
    this._obtenerDatos();
  }

}
