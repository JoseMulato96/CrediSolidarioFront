import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { UrlRoute } from '@shared/static/urls/url-route';
import { ProyectoVidaService } from '../../services/proyecto-vida.service';
import { ListarProyectoVidaConfig } from './listar-proyecto-vida.config';

@Component({
  selector: 'app-listar-proyecto-vida',
  templateUrl: './listar-proyecto-vida.component.html',
})
export class ListarProyectoVidaComponent implements OnInit {
  configuracion: ListarProyectoVidaConfig = new ListarProyectoVidaConfig();
  estado: boolean;

  constructor(private readonly router: Router,
    private readonly alertService: AlertService,
    private readonly translate: TranslateService,
    private readonly proyectoVidaService: ProyectoVidaService
  ) {
    this.estado = true;
  }

  ngOnInit() {
    //do nothing
  }

  _obtenerDatos(pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = 'true') {
    const param: any = { page: pagina, size: tamanio, isPaged: true, sort, estado };

    this.proyectoVidaService.getProyectoVidas(param)
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
    } else if ($event.col.key === 'eliminar') {
      this.translate.get('administracion.cofiguracionCotizadores.proyectoVida.alertas.deseaEliminar')
        .subscribe((mensaje: string) => {
          this.alertService.confirm(mensaje, 'danger').then((desition: any) => {
            if (desition === true) {
              this._eliminar($event.dato.codigo);
            }
          });
        });
    }
  }

  _eliminar(codigo: string) {
    this.proyectoVidaService.deleteProyectoVida(codigo).subscribe((respuesta: any) => {
      this.translate.get('global.eliminadoExitosoMensaje').subscribe((mensaje: string) => {
        this.alertService.success(mensaje).then(() => {
          this._obtenerDatos(0, 10, 'fechaCreacion,desc', this.estado + '');
        });
      });
    });
  }

  _onToggleStatus(e) {
    this.estado = e.currentTarget.checked ? e.currentTarget.checked : '';
    this._obtenerDatos(0, 10, 'fechaCreacion,desc', this.estado + '');
  }

  _alEditar($event: any) {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_COTIZADORES,
      UrlRoute.ADMINISTRACION_COTIZADORES_PROYECTO_VIDA,
      $event.codigo]);
  }

  irACrear() {
    return [UrlRoute.ADMINISTRACION_COTIZADORES_PROYECTO_VIDA_NUEVO];
  }

}
