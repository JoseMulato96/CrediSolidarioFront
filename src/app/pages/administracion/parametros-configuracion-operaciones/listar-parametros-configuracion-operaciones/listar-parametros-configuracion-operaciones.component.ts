import { Component, OnInit } from '@angular/core';
import { ListarParametrosConfiguracionConfig } from './listar-parametros-configuracion.config';
import { ParametrosConfiguracionOperacionesService } from '../../../../core/services/api-back.services/mimutualprotecciones/parametros-configuracion-operaciones.service';
import { GENERALES } from '@shared/static/constantes/constantes';
import { Router } from '@angular/router';
import { UrlRoute } from '@shared/static/urls/url-route';
import { TranslateService } from '@ngx-translate/core';
import { BackFacadeService, FrontFacadeService } from '@core/services';
import { Store } from '@ngrx/store';
import { AppState } from '@core/store/reducers';
import { PostParametrosConfiguracion } from '../parametros-configuracion.actions';
import { Estado, ParametrosConfiguracionOperaciones } from '../model/parametros-configuracion-operaciones';

@Component({
  selector: 'app-listar-parametros-configuracion-operaciones',
  templateUrl: './listar-parametros-configuracion-operaciones.component.html',
})
export class ListarParametrosConfiguracionOperacionesComponent implements OnInit {

  configuracion: ListarParametrosConfiguracionConfig = new ListarParametrosConfiguracionConfig();
  id = 'valoresDevolver';

  constructor(
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly store: Store<AppState>,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
    ) {

  }

  ngOnInit(): void {
    this.store.dispatch(new PostParametrosConfiguracion(null, this.id, Estado.Pendiente));
    this.getDataParametrosConfiguracion();
  }

  private getDataParametrosConfiguracion(pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = 'true') {
    this.backService.parametroConfiguracionOperaciones.getParametrosConfiguracionOperaciones({ page: pagina, size: tamanio, isPaged: true, sort: sort, estado: estado }).subscribe(response => {
      this.cargarDatos(response);
    });
  }

  private cargarDatos(resp: any) {
    this.configuracion.gridListarConfiguracionOperacion.component.cargarDatos(
      this.asignarTipoConfiguracion(resp.content), {
      maxPaginas: resp.totalPages,
      pagina: resp.number,
      cantidadRegistros: resp.totalElements
    });
  }

  asignarTipoConfiguracion(items: any) {
    const listObj = [];
    let item: any;
    for (item of items) {
      listObj.push({
        ...item,
        _tipoConfiguracion: item.tipoConfiguracion === GENERALES.PARAMETROS_CONFIGURACION.GENERAL ? 'General' : 'Especifico'
      });
    }
    return listObj;
  }

  onClickCeldaElement($event: any) {
    if ($event.col.key === 'editar') {
      const configuracionOperacion: ParametrosConfiguracionOperaciones = new ParametrosConfiguracionOperaciones();
      configuracionOperacion.dataConfiguracionOperaciones = $event.dato;
      this.store.dispatch(new PostParametrosConfiguracion(configuracionOperacion, this.id, Estado.Guardado));
      this.router.navigate([
        UrlRoute.PAGES,
        UrlRoute.ADMINISTRACION,
        UrlRoute.PARAMETROS_CONFIGURACION_OPERACIONES,
        UrlRoute.GEOLOCALIZACION_PARAMETROS_CONFIGURACION_OPERACIONES,
        $event.dato.codigo
      ]);
    } else {
      this.deleteParametrosConfiguracionOperaciones($event);
    }
  }

  private deleteParametrosConfiguracionOperaciones(event: any) {
    this.frontService.alert.confirm(this.translate.instant('administracion.configuracionOperaciones.alertas.deseaEliminar')).then((respuesta: boolean) => {
      if (respuesta) {
        this.backService.parametroConfiguracionOperaciones.deleteParametrosConfiguracionOperaciones(event.dato.codigo).subscribe(response => {
          this.translate.get('global.eliminadoExitosoMensaje').subscribe(msn => {
            this.frontService.alert.success(msn);
          });
          this.getDataParametrosConfiguracion();
        }, (err) => {
          this.frontService.alert.warning(err.error.message);
        });
      }
    });
  }

  enviarCrearNuevoDetalle() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.PARAMETROS_CONFIGURACION_OPERACIONES,
      UrlRoute.GEOLOCALIZACION_PARAMETROS_CONFIGURACION_OPERACIONES
    ]);
  }

  onSiguiente($event: any) {
    this.getDataParametrosConfiguracion($event.pagina, $event.tamano);
  }

  onAtras($event: any) {
    this.getDataParametrosConfiguracion($event.pagina, $event.tamano);
  }
}
