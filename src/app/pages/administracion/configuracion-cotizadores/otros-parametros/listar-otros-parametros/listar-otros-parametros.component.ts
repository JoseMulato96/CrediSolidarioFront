import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';

import { ListarOtrosParametrosConfig } from './listar-otros-parametros.config';
import { OtrosParametrosService } from '../../services/otros-parametros.service';
import { UrlRoute } from '@shared/static/urls/url-route';

@Component({
  selector: 'app-listar-otros-parametros',
  templateUrl: './listar-otros-parametros.component.html'
})
export class ListarOtrosParametrosComponent {

  configuracion: ListarOtrosParametrosConfig = new ListarOtrosParametrosConfig();

  constructor(private readonly router: Router,
              private readonly alertService: AlertService,
              private readonly translate: TranslateService,
              private readonly otrosParametroService: OtrosParametrosService) { }

  obtenerParametros(pagina = 0, tamanio = 10, sort = 'codigo,desc', estado = 'true') {
    const param: any = { page: pagina, size: tamanio, isPaged: true, sort, estado };

    this.otrosParametroService.getOtrosParametros(param)
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
        descripcion : item.nombre,
        dias: item.dias,
        ...item
      });
    }
    return listObj;
  }

  _onAtras(e:any) {
    this.obtenerParametros(e.pagina, e.tamano, e.sort,'true');
  }

  _onSiguiente(e:any) {
    this.obtenerParametros(e.pagina, e.tamano, e.sort,'true');
  }

  _ordenar(e:any) {
    this.obtenerParametros(e.pagina, e.tamano, e.sort,'true');
  }

  _onClickCeldaElement($event: any) {
    if ($event.col.key === 'editar') {
      this._alEditar($event.dato);
    }
  }

  _alEditar($event: any) {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_COTIZADORES,
      UrlRoute.ADMINISTRACION_COTIZADORES_OTROS_PARAMETROS,
      $event.codigo]);
  }
}