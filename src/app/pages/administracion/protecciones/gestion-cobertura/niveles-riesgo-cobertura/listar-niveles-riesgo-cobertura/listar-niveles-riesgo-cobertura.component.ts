import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackFacadeService, FrontFacadeService } from '@core/services';
import { UrlRoute } from '@shared/static/urls/url-route';
import { ListarNivelesRiesgoCoberturaConfig } from './listar-niveles-riesgo-cobertura.config';

@Component({
  selector: 'app-listar-niveles-riesgo-cobertura',
  templateUrl: './listar-niveles-riesgo-cobertura.component.html',
})
export class ListarNivelesRiesgoCoberturaComponent implements OnInit {

  linkCrear = UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_NIVELES_RIESGO_COBERTURA_NUEVO;
  configuracion: ListarNivelesRiesgoCoberturaConfig = new ListarNivelesRiesgoCoberturaConfig();
  estado = true;

  constructor(
    private readonly router: Router,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) { }

  ngOnInit() {
    // do nothing
  }

  _onClickCeldaElement($event: any) {
    this._alEditar($event.dato);
  }

  obtenerNivelesRiesgoCobertura(pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estados = 'true') {
    this.backService.nivelRiesgoCobertura.getRiesgoCobeturas({ page: pagina, size: tamanio, isPaged: true, sort: sort, 'estado': estados })
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

  _onAtras(e: any) {
    this._obtenerDatosConEstados(e, this.estado);
  }


  _onSiguiente(e: any) {
    this._obtenerDatosConEstados(e, this.estado);
  }

  _alEditar($event: any) {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_NIVELES_RIESGO_COBERTURA,
      $event.mimCobertura.codigo,
      $event.mimNivelRiesgo.codigo
    ]);

  }

  _ordenar($event) {
    this._obtenerDatosConEstados($event, this.estado);
  }

  _onToggleStatus($event) {
    this._obtenerDatosConEstados($event, $event.currentTarget.checked);
  }

  _obtenerDatosConEstados($event, estado: boolean) {
    this.estado = estado;
    this.obtenerNivelesRiesgoCobertura($event.pagina, $event.tamano, $event.sort, this.estado ? 'true' : '');
  }


}
