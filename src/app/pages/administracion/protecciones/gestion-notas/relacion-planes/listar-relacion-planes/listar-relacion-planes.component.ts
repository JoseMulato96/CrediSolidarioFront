import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { UrlRoute } from '@shared/static/urls/url-route';
import { RelacionPlanesService } from '../../services/relacion-planes.service';
import { ListarRelacionPlanesConfig } from './listar-relacion-planes.config';

@Component({
  selector: 'app-listar-relacion-planes',
  templateUrl: './listar-relacion-planes.component.html',
})
export class ListarRelacionPlanesComponent implements OnInit {

  configuracion: ListarRelacionPlanesConfig = new ListarRelacionPlanesConfig();
  estado: boolean;
  filtrosGrid: any;

  constructor(
    private readonly router: Router,
    private readonly alertService: AlertService,
    private readonly translate: TranslateService,
    private readonly relacionPlanesService: RelacionPlanesService
  ) {
    this.estado = true;
    this.filtrosGrid = [];
  }

  ngOnInit() {
    //do nothing
  }

  _obtenerDatos(pagina = 0, tamanio = 10, sort = ['fechaCreacion,desc'], estado = 'true') {
    const param: any = { page: pagina, size: tamanio, isPaged: true, sort, estado };
    if (this.filtrosGrid.length > 0) {
      this.filtrosGrid.map((x: any) => param[x.columna.keyFiltro] = x.valor);
    }
    this.relacionPlanesService.getRelacionPlanes(param)
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
        _estado: item.estado ? 'Si' : 'No',
        _planCobertura: item.mimPlanCoberturaDto ? item.mimPlanCoberturaDto.mimPlan.nombre + ' - ' + item.mimPlanCoberturaDto.mimCobertura.nombre : null,
        _nivelRiesgo: item.listaNivelesRelacionNotasAclaratorias ? item.listaNivelesRelacionNotasAclaratorias.map(x => x.mimNivelRiesgoDto.nombre).toString() : null
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
      this.translate.get('administracion.cofiguracionCotizadores.gestionNotas.relacionPlanes.alertas.deseaEliminar')
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
    this.relacionPlanesService.deleteRelacionPlan(codigo).subscribe((respuesta: any) => {
      this.translate.get('global.eliminadoExitosoMensaje').subscribe((mensaje: string) => {
        this.alertService.success(mensaje).then(() => {
          this._obtenerDatos(0, 10, ['mimPlan.codigo,asc', 'fechaCreacion,desc'], this.estado + '');
        });
      });
    });
  }

  _onToggleStatus(e) {
    this.estado = e.currentTarget.checked ? e.currentTarget.checked : '';
    this._obtenerDatos(0, 10, ['mimPlan.codigo', 'fechaCreacion,desc'], this.estado + '');
  }

  _alEditar($event: any) {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_COTIZADORES_GESTION_NOTAS,
      UrlRoute.ADMINISTRACION_COTIZADORES_RELACION_PLANES,
      $event.codigo]);
  }

  irACrear() {
    return [UrlRoute.ADMINISTRACION_COTIZADORES_RELACION_PLANES_NUEVO];
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
