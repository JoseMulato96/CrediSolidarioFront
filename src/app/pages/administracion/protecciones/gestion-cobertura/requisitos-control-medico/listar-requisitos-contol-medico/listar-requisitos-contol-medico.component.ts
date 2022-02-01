import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '@core/services';
import { RequisitosControlMedicoConfig } from './requisitos-control-medico.config';
import { UrlRoute } from '@shared/static/urls/url-route';
import { RequisitosColtrolMedicoService } from '../services/requisitos-coltrol-medico.service';

@Component({
  selector: 'app-listar-requisitos-contol-medico',
  templateUrl: './listar-requisitos-contol-medico.component.html',
})
export class ListarRequisitosContolMedicoComponent implements OnInit {

  public linkCrear: string;
  configuracion: RequisitosControlMedicoConfig = new RequisitosControlMedicoConfig();
  estado = true;

  requisiosMedicos: any[] = [];
  filtrosGrid: any;

  constructor(
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly alertService: AlertService,
    private readonly requisitosColtrolMedicoService: RequisitosColtrolMedicoService
  ) {
    this.filtrosGrid = [];
   }

  ngOnInit() {
    this.linkCrear = UrlRoute.ADMINISTRACION_PROTECCIONES_FONDO_NUEVO;
  }

  /**
   * Autor: Cesar Millan
   * Función: Obtiene el listado de los registros
   * @param pagina Número de páginas
   * @param tamanio Número de items por páginas
   */
  obtenerItems(pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estados = 'true') {
    const param = {
      page: pagina,
      size: tamanio,
      isPaged: true,
      sort: sort,
      estado: this.estado ? true : ''
    };
    if (this.filtrosGrid.length > 0) {
      this.filtrosGrid.map((x: any) => param[x.columna.keyFiltro] =  x.valor);
    }
    this.requisitosColtrolMedicoService.getControlesMedicos(param)
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
        this.alertService.warning(err.error.message);
      });
  }

  /**
   * Autor: Cesar Millan
   * Función: Mentodo para formatear la descripcion del estado
   */
  asignarEstados(items: any) {
    const listObj = [];
    let item: any;
    for (item of items) {
      // Se obtienen la lista de requisitos medicos
      const listaRequisitos = item.mimDocumentoRequisitoList;
      let nombresRequisitos = '';
      for (let i = 0; i < listaRequisitos.length; i++) {
        const listaItem = listaRequisitos[i];
        nombresRequisitos += i > 0 ? `; ${listaItem.mimDocumento.nombre}` : listaItem.mimDocumento.nombre;
      }
      // Se obtienen la lista de tipos de transaccion
      const listaTransaccion = item.mimTransaccionRequisitoList;
      let nombresTransacciones = '';
      for (let i = 0; i < listaTransaccion.length; i++) {
        const listaItem = listaTransaccion[i];
        nombresTransacciones += i > 0 ? `; ${listaItem.mimTransaccion.nombre}` : listaItem.mimTransaccion.nombre;
      }
      // Se obtienen el fondo de cada plan cobertura
      const listaPlanesCobertura = item.mimPlanCoberturaRequisitoList;
      let nombreFondo = '';
      for (let i = 0; i < listaPlanesCobertura.length; i++) {
        const listaItem = listaPlanesCobertura[i];
        nombreFondo += i > 0 ? `; ${listaItem.mimPlanCobertura.mimCobertura.mimFondo.nombre}` : listaItem.mimPlanCobertura.mimCobertura.mimFondo.nombre;
      }

      listObj.push({
        ...item,
        _fondos: nombreFondo,
        _requisitos: nombresRequisitos,
        _transacciones: nombresTransacciones,
        _estado: item.estado ? 'Si' : 'No'
      });
    }
    return listObj;
  }

  /**
   * Autor: Cesar Millan
   * Funcion: Captura la accion de la grilla
   */
  _onClickCeldaElement(event) {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA,
      UrlRoute.ADMINISTRACION_PROTECCIONES_REQUISITOS_CONTROL_MEDICO,
      event.dato.codigo]);
  }

  /**
   * Autor: Cesar Millan
   * Función: Acción para ir a la siguiente pagina de la grid
   */
  _onSiguiente(e: any) {
    this._obtenerDatosConEstados(e, this.estado);
  }

  /**
   * Autor: Cesar Millan
   * Función: Acción para regresar a la página anterior de una grid
   */
  _onAtras(e: any) {
    this._obtenerDatosConEstados(e, this.estado);
  }

  _ordenar($event) {
    this._obtenerDatosConEstados($event, this.estado);
  }

  _onToggleStatus($event) {
    this._obtenerDatosConEstados($event, $event.currentTarget.checked);
  }

  _obtenerDatosConEstados($event, estado: boolean) {
    this.estado = estado;
    this.obtenerItems($event.pagina, $event.tamano, $event.sort, this.estado ? 'true' : '');
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
    this.obtenerItems();
  }

}
