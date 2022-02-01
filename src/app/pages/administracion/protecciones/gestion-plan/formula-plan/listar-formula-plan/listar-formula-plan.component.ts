import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackFacadeService, FrontFacadeService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { UrlRoute } from '@shared/static/urls/url-route';
import { from } from 'rxjs/internal/observable/from';
import { ListarFormulaPlanConfig } from './listar-formula-plan.config';

@Component({
  selector: 'app-formula-plan-graves',
  templateUrl: './listar-formula-plan.component.html',
})
export class ListarFormulaPlanComponent implements OnInit {

  public linkCrear: string;
  estado = true;

  configuracion: ListarFormulaPlanConfig = new ListarFormulaPlanConfig();
  filtrosGrid: any;

  constructor(
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) { this.filtrosGrid = []; }

  ngOnInit() {
    this.linkCrear = UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_FORMULA_PLAN_NUEVO;
  }


  /**
   * Autor: Bayron Andres Perez M.
   * Función: Obtiene el listado de los registros
   * @param pagina Número de páginas
   * @param tamanio Número de items por páginas
   */
  obtener(pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = true) {
    const params: any = { page: pagina, size: tamanio, isPaged: true, sort: sort };
    if (this.estado) {
      params.estado = estado;
    }
    if(this.filtrosGrid.length > 0){
      this.filtrosGrid.map((x: any) => params[x.columna.keyFiltro] =  x.valor);
    }
    this.backService.formulaPlan.getFormulasPlan(params)
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
   * Autor: Bayron Andres Perez M.
   * Función: Mentodo para formatear la descripcion del estado
   */
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

  /**
   * Autor: Bayron Andres Perez M.
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
   * Autor: Bayron Andres Perez M.
   * Función: Acción para ir a la siguiente pagina de la grid
   */
  _onSiguiente(e: any) {
    this.obtener(e.pagina, e.tamano, e.sort, this.estado);
  }

  /**
   * Autor: Bayron Andres Perez M.
   * Función: Acción para regresar a la página anterior de una grid
   */
  _onAtras(e: any) {
    this.obtener(e.pagina, e.tamano, e.sort, this.estado);
  }


  /**
   * Autor: Bayron Andres Perez M.
   * Función: Redirige a la pantalla de editar
   */
  _alEditar(event: any) {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_FORMULA_PLAN,
      event.codigo
    ]);
  }

  /**
   * Autor: Bayron Andres Perez M.
   * Función: Desplega modal para que el usuario confirme la accion de eliminar
   */
  _alEliminar(event: any) {
    this.translate.get('administracion.protecciones.enfermedadesGraves.alertas.deseaEliminar', {
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
    this.backService.formulaPlan.deleteFormulaPlan(codigoPlan).subscribe(resp => {
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

  filtroHeader(event: any){
    if(event.valor === ''){
      this.filtrosGrid = this.filtrosGrid.filter(x => x.columna !== event.columna);
    }else{
      if(this.filtrosGrid.find(item => item.columna === event.columna)){
        this.filtrosGrid.find(x => x.columna === event.columna).valor = event.valor;
      }else{
        this.filtrosGrid.push(event);
      }
    }
    this.obtener();
  }

}
