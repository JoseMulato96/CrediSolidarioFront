import { Component, OnInit } from '@angular/core';
import { ListarCategoriasAsociadoHomologacionConfig } from './listar-categorias-asociado-homologacion.config';
import { UrlRoute } from '@shared/static/urls/url-route';
import { Router } from '@angular/router';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { BackFacadeService, FrontFacadeService } from '@core/services';

@Component({
  selector: 'app-listar-categorias-asociado-homologacion',
  templateUrl: './listar-categorias-asociado-homologacion.component.html',
})
export class ListarCategoriasAsociadoHomologacionComponent implements OnInit {

  configuracion: ListarCategoriasAsociadoHomologacionConfig = new ListarCategoriasAsociadoHomologacionConfig();
  public linkCrear: string;
  estado = [MIM_PARAMETROS.SIP_HOMOLOGACION_CATEGORIAS.ACTIVO];
  estados = [MIM_PARAMETROS.SIP_HOMOLOGACION_CATEGORIAS.ACTIVO, MIM_PARAMETROS.SIP_HOMOLOGACION_CATEGORIAS.INACTIVO];

  constructor(
    private readonly router: Router,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) { }

  ngOnInit() {
    this.linkCrear = UrlRoute.ADMINISTRACION_PROTECCIONES_CATEGORIAS_ASOCIADO_HOMOLOGACION_NUEVO;
  }

  onClickCelda($event: any) {
    this._alEditar($event.dato);
  }

  listarDatos(pagina = 0, tamano = 10, sort = 'fechaCreacion,desc', estado: any[] = this.estado) {
    const param: any = { page: pagina, size: tamano, isPaged: true, sort: sort };
    if (estado) {
      param['estado'] = estado;
    }

    this.backService.categoriaAsociadoHomologacion.getCategoriasAsociadoHomologacion(
      { page: pagina, size: tamano, esPaginable: true, sort: sort, estado: estado }
    )
      .subscribe((resp: any) => {
        this.configuracion.gridConfig.component.limpiar();
        if (!resp || !resp.content || resp.content.length === 0) {
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
        _estado: x.estado === MIM_PARAMETROS.SIP_HOMOLOGACION_CATEGORIAS.ACTIVO ? 'Si' : 'No'
      });
    }
    return listObj;
  }

  _OnAtras(e: any) {
    this._obtenerDatosConEstados(e, this.estado);
  }


  _OnSiguiente(e: any) {
    this._obtenerDatosConEstados(e, this.estado);
  }

  _alEditar($event: any) {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_CATEGORIAS_ASOCIADO_HOMOLOGACION,
      $event.codigo]);

  }

  _ordenar($event) {
    this._obtenerDatosConEstados($event, this.estado);
  }

  _onToggleStatus($event) {
    this._obtenerDatosConEstados($event, $event.currentTarget.checked);
  }

  _obtenerDatosConEstados($event, estado: any[]) {
    this.estado = estado;
    this.listarDatos($event.pagina, $event.tamano, $event.sort, this.estado ? [MIM_PARAMETROS.SIP_HOMOLOGACION_CATEGORIAS.ACTIVO] : this.estados);
  }

}
