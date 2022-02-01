import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { UrlRoute } from '@shared/static/urls/url-route';
import { from } from 'rxjs';
import { ProductosExcluyentesService } from '../services/productos-excluyentes.service';
import { ListarProductosExcluyentesConfig } from './listar-productos-excluyentes.config';

@Component({
  selector: 'app-listar-productos-excluyentes',
  templateUrl: './listar-productos-excluyentes.component.html',
})
export class ListarProductosExcluyentesComponent implements OnInit {

  public linkCrear: string;
  configuracion: ListarProductosExcluyentesConfig = new ListarProductosExcluyentesConfig();
  estado: boolean;

  constructor(
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly alertService: AlertService,
    private readonly productosExcluyentesService: ProductosExcluyentesService
  ) { }

  ngOnInit(): void {
    this.linkCrear = UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PRODUCTOS_EXCLUYENTES_NUEVO;
    this.estado = true;
  }

  /**
   * Autor: Cesar Millan
   * Función: Obtiene el listado de los registros
   * @param pagina Número de páginas
   * @param tamanio Número de items por páginas
   */
  obtener(pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = 'true') {
    this.productosExcluyentesService.getProductosExcluyentes({ page: pagina, size: tamanio, isPaged: true, sort: sort, estado: estado })
      .subscribe((resp: any) => {
        this.configuracion.gridConfig.component.limpiar();
        if (!resp || !resp.content || resp.content.length === 0) {
          return;
        }
        this.configuracion.gridConfig.component.cargarDatos(
          this.modificarRespuesta(resp.content), {
          maxPaginas: resp.totalPages,
          pagina: resp.number,
          cantidadRegistros: resp.totalElements
        });
      }, (err) => {
        this.alertService.warning(err.error.message);
      });
  }

  /**
   * Autor: Cesar Millan
   * Función: Mentodo para formatear la descripcion del estado
   * @param items
   */
  private modificarRespuesta(items: any) {
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
  clickCeldaElement(event) {
    if (event.col.key === 'editar') {
      this.editar(event.dato);
    } else {
      this.alEliminar(event.dato);
    }
  }

  /**
   * Autor: Cesar Millan
   * Función: Acción para ir a la siguiente pagina de la grid
   */
  siguiente(e: any) {
    this.obtenerDatosConEstados(e, this.estado);
  }

  /**
   * Autor: Cesar Millan
   * Función: Acción para regresar a la página anterior de una grid
   */
  atras(e: any) {
    this.obtenerDatosConEstados(e, this.estado);
  }

  /**
   * Autor: Cesar Millan
   * Función: Redirige a la pantalla de editar
   * @param event
   */
  editar(event: any) {

    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PRODUCTOS_EXCLUYENTES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PRODUCTOS_EXCLUYENTES_CODIGO_PLAN,
      event.codigo,
    ]);
  }

  /**
   * Autor: Cesar Millan
   * Función: Desplega modal para que el usuario confirme la accion de eliminar
   * @param event
   */
  alEliminar(event: any) {
    const item = event;
    this.translate.get('global.alertas.eliminar').subscribe((mensaje: string) => {
      const modalPromise = this.alertService.confirm(mensaje, 'danger');
      const newObservable = from(modalPromise);

      newObservable.subscribe(
        (desition: any) => {
          if (desition === true) {
            this.eliminar(item.codigo);
          }
        });
    });
  }

  /**
   * Autor: Cesar Millan
   * Función: Realiza la acción de eliminar el registro
   * @param codigo
   */
  private eliminar(codigoProductoExcluyente: string) {
    this.productosExcluyentesService.deleteProductoExcluyente(codigoProductoExcluyente).subscribe(resp => {
      this.translate.get('global.eliminadoExitosoMensaje').subscribe(msn => {
        this.alertService.success(msn);
      });
      this.obtener();
    }, (err) => {
      this.alertService.warning(err.error.message);
    });
  }

  ordenar($event) {
    this.obtenerDatosConEstados($event, this.estado);
  }

  toggleStatus($event) {
    this.obtenerDatosConEstados($event, $event.currentTarget.checked);
  }

  obtenerDatosConEstados($event, estado: boolean) {
    this.estado = estado;
    this.obtener($event.pagina, $event.tamano, $event.sort, this.estado ? 'true' : '');
  }

}
