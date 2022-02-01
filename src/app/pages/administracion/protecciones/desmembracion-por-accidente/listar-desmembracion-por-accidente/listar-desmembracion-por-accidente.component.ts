import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackFacadeService, FrontFacadeService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { UrlRoute } from '@shared/static/urls/url-route';
import { from } from 'rxjs';
import { ListarDesmembracionPorAccidenteConfig } from './listar-listar-desmembracion-por-accidente.config';

@Component({
  selector: 'app-listar-desmembracion-por-accidente',
  templateUrl: './listar-desmembracion-por-accidente.component.html',
})
export class ListarDesmembracionPorAccidenteComponent implements OnInit {

  public linkCrear: string;
  estado = true;

  configuracion: ListarDesmembracionPorAccidenteConfig = new ListarDesmembracionPorAccidenteConfig();

  constructor(
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    this.linkCrear = UrlRoute.ADMINISTRACION_PROTECCIONES_DESMEMBRACION_ACCIDENTE_NUEVO;
  }

  ngOnInit() {
    //do nothing
  }

  obtener(pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = true) {
    const params: any = { page: pagina, size: tamanio, isPaged: true, sort: sort };
    if (estado) {
      params.estado = estado;
    }

    this.backService.desmembracionAccidente.getDesmembracionPorAccidentes(params)
      .subscribe((resp: any) => {
        this.configuracion.gridConfig.component.limpiar();

        if (!resp || !resp.content || resp.content.length === 0) {
          return;
        }

        this.configuracion.gridConfig.component.cargarDatos(
          this.asignarEstados(resp.content), {
          maxPaginas: resp.totalPages,
          pagina: resp.number,
          cantidadRegistros: resp.totalElements
        });
      }, (err) => {
        this.frontService.alert.warning(err.error.message);
      });
  }

  /**
   * Autor: Cesar Millan
   * Función: Mentodo para formatear la descripcion del estado
   */
  asignarEstados(items: any) {
    const listObj = [];
    let x: any;
    for (x of items) {
      listObj.push({ ...x, _estado: x.estado ? 'Si' : 'No' });
    }
    return listObj;
  }

  /**
   * Autor: Cesar Millan
   * Funcion: Captura la accion de la grilla
   */
  _onClickCeldaElement(event) {
    if (event.col.key === 'editar') {
      this._alEditar(event.dato);
    } else {
      this._alEliminar(event.dato);
    }
  }

  /**
   * Autor: Cesar Millan
   * Función: Acción para ir a la siguiente pagina de la grid
   */
  _onSiguiente(e: any) {
    this.obtener(e.pagina, e.tamano, e.sort, this.estado);
  }

  /**
   * Autor: Cesar Millan
   * Función: Acción para regresar a la página anterior de una grid
   */
  _onAtras(e: any) {
    this.obtener(e.pagina, e.tamano, e.sort, this.estado);
  }

  /**
   * Autor: Cesar Millan
   * Función: Redirige a la pantalla de editar
   */
  _alEditar(event: any) {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_DESMEMBRACION_ACCIDENTE,
      event.codigo
    ]);
  }

  /**
   * Autor: Cesar Millan
   * Función: Desplega modal para que el usuario confirme la accion de eliminar
   */
  _alEliminar(event: any) {
    this.translate.get('administracion.protecciones.desmembracionAccidente.alertas.deseaEliminar', {
      item: `${event.nombre}`
    }).subscribe((mensaje: string) => {
      const modalPromise = this.frontService.alert.confirm(mensaje, 'danger');
      const newObservable = from(modalPromise);

      newObservable.subscribe(
        (desition: any) => {
          if (desition === true) {
            this.eliminar(event.codigo);
          }
        });
    });
  }

  /**
   * Autor: Cesar Millan
   * Función: Realiza la acción de eliminar el registro
   */
  eliminar(codigoPlan: string) {
    this.backService.desmembracionAccidente.deleteDesmembracionPorAccidente(codigoPlan).subscribe(resp => {
      this.translate.get('global.eliminadoExitosoMensaje').subscribe(msn => {
        this.frontService.alert.success(msn);
      });
      this.obtener();
    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });
  }

  _ordenar($event) {
    this.obtener($event.pagina, $event.tamano, $event.sort, this.estado);
  }

  _onToggleStatus($event) {
    this._obtenerDatosConEstados($event, $event.currentTarget.checked);
  }

  _obtenerDatosConEstados($event, estado: boolean) {
    this.estado = estado;
    this.obtener($event.pagina, $event.tamano, $event.sort, this.estado ? true : false);
  }
}
