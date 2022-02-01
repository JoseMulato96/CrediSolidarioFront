import { Component, OnInit } from '@angular/core';
import { ListarCategoriasAsociadoConfig } from './listar-categorias-asociado.config';
import { UrlRoute } from '@shared/static/urls/url-route';
import { Router } from '@angular/router';
import { BackFacadeService, FrontFacadeService } from '@core/services';

@Component({
  selector: 'app-listar-categorias-asociado',
  templateUrl: './listar-categorias-asociado.component.html',
})
export class ListarCategoriasAsociadoComponent implements OnInit {

  configuracion: ListarCategoriasAsociadoConfig = new ListarCategoriasAsociadoConfig();
  public linkCrear: string;
  estado: boolean;

  constructor(
    private readonly router: Router,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService,
  ) { }

  ngOnInit() {
    this.linkCrear = UrlRoute.ADMINISTRACION_PROTECCIONES_CATEGORIAS_ASOCIADO_NUEVO;
    this.estado = true;
  }

  onClickCelda($event: any) {
    this._alEditar($event.dato);
  }

  listarDatos(pagina = 0, tamano = 10, sort = 'fechaCreacion,desc', estado = 'true') {
    this.backService.categoriasAsociado.getCategoriasAsociado(
      {
        page: pagina,
        size: tamano,
        esPaginable: true,
        sort: sort,
        estado: estado
      }
    )
      .subscribe((resp: any) => {
        this.configuracion.gridConfig.component.limpiar();
        if (!resp || !resp.content.length) {
          return;
        }
        this.configuracion.gridConfig.component.cargarDatos(
          this.asignarEstados(resp.content),
          {
            maxPaginas: resp.totalPages,
            pagina: resp.number,
            cantidadRegistros: resp.totalElements
          }
        );
      }, (err) => {
        this.frontService.alert.error(err.error.message);
      });
  }

  asignarEstados(items: any) {
    const listObj = [];
    let x: any;
    for (x of items) {
      listObj.push({
        ...x,
        _estado: x.estado ? 'Si' : 'No'
      });
    }
    return listObj;
  }
  /**
  * @author Hander Fernando Gutierrez
  * @description escucha el boton atras de la tabla
  */
  _OnAtras(e: any) {
    this._obtenerDatosConEstados(e, this.estado);
  }

  /**
   * @author Hander Fernando Gutierrez
   * @description esucha el boton siguiente de la tabla
   */
  _OnSiguiente(e: any) {
    this._obtenerDatosConEstados(e, this.estado);
  }

  _alEditar($event: any) {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_CATEGORIAS_ASOCIADO,
      $event.codigo]);

  }

  _ordenar($event) {
    this._obtenerDatosConEstados($event, this.estado);
  }

  _onToggleStatus($event) {
    this._obtenerDatosConEstados($event, $event.currentTarget.checked);
  }

  _obtenerDatosConEstados($event, estado: boolean) {
    this.estado = estado;
    this.listarDatos($event.pagina, $event.tamano, $event.sort, this.estado ? 'true' : '');
  }

}
