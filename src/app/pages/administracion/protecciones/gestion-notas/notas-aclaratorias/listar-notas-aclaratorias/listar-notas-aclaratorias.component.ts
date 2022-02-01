import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { UrlRoute } from '@shared/static/urls/url-route';
import { NotasAclaratoriasService } from '../../services/notas-aclaratorias.service';
import { RelacionPlanesService } from '../../services/relacion-planes.service';
import { ListarNotasAclaratoriasConfig } from './listar-notas-aclaratorias.config';

@Component({
  selector: 'app-listar-notas-aclaratorias',
  templateUrl: './listar-notas-aclaratorias.component.html',
})
export class ListarNotasAclaratoriasComponent implements OnInit {

  configuracion: ListarNotasAclaratoriasConfig = new ListarNotasAclaratoriasConfig();
  estado: boolean;
  mostrarGuardar: boolean;

  constructor(
    private readonly router: Router,
    private readonly alertService: AlertService,
    private readonly translate: TranslateService,
    private readonly notaAclaratoriaService: NotasAclaratoriasService,
    private readonly relacionPlanService: RelacionPlanesService
  ) {
    this.estado = true;
  }

  ngOnInit() {
    //do nothing
  }

  _obtenerDatos(pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = 'true') {
    const param: any = { page: pagina, size: tamanio, isPaged: true, sort, estado };

    this.notaAclaratoriaService.getNotasAclaratorias(param)
      .subscribe((resp: any) => {
        this.configuracion.gridListar.component.limpiar();

        if (!resp || !resp.content || resp.content.length === 0) {
          return;
        }

        this.configuracion.gridListar.component.cargarDatos(
          resp.content, {
          maxPaginas: resp.totalPages,
          pagina: resp.number,
          cantidadRegistros: resp.totalElements
        });
      }, (err) => {
        this.alertService.error(err.error.message);
      });
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
      this.translate.get('administracion.cofiguracionCotizadores.gestionNotas.notasAclaratorias.alertas.deseaEliminar')
        .subscribe((mensaje: string) => {
          this.alertService.confirm(mensaje, 'danger').then((desition: any) => {
            if (desition === true) {
              this._eliminar($event.dato.codigo);
            }
          });
        });
    } else if ($event.col.key === 'detalle') {
      this._getDetalle($event.dato.codigo);
    }
  }

  _eliminar(codigo: string) {
    this.notaAclaratoriaService.deleteNotaAclaratoria(codigo).subscribe((respuesta: any) => {
      this.translate.get('global.eliminadoExitosoMensaje').subscribe((mensaje: string) => {
        this.alertService.success(mensaje).then(() => {
          this._obtenerDatos(0, 10, 'fechaCreacion,desc', this.estado + '');
        });
      });
    }, err => {
      this.alertService.error(err.error.message);
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
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_COTIZADORES_GESTION_NOTAS,
      UrlRoute.ADMINISTRACION_COTIZADORES_NOTAS_ACLARATORIAS,
      $event.codigo]);
  }

  irACrear() {
    return [UrlRoute.ADMINISTRACION_COTIZADORES_NOTAS_ACLARATORIAS_NUEVO];
  }

  _toggle(toggle: boolean) {
    this.mostrarGuardar = toggle;
  }

  _getDetalle(codigo: string) {
    this.relacionPlanService.getRelacionPlanes({ 'mimNotaAclaratoria.codigo': codigo }).subscribe(resp => {
      this.configuracion.modalResumen.component.mostrar();
      this.configuracion.gridPlanesAsociados.component.limpiar();
      if (!resp || !resp.content || resp.content.length === 0) {
        return;
      }
      this.configuracion.gridPlanesAsociados.component.cargarDatos(
        this.asignarNombrePlanCobertura(resp.content), {
        maxPaginas: resp.totalPages,
        pagina: resp.number,
        cantidadRegistros: resp.totalElements
      });
      this._toggle(true);
    }, (err) => {
      this.alertService.error(err.error.message);
    });
  }

  asignarNombrePlanCobertura(items: any) {
    const listObj = [];
    let x: any;
    for (x of items) {
      listObj.push({ ...x, _planCobertura: x.mimPlanCoberturaDto.mimPlan.nombre + ' - ' + x.mimPlanCoberturaDto.mimCobertura.nombre });
    }
    return listObj;
  }

}
