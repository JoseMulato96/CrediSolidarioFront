import { OnInit, Component } from '@angular/core';
import { ListarcontrolCumulosConfig } from './listar-control-cumulos.config';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FileUtils } from '@shared/util/file.util';
import { DateUtil } from '@shared/util/date.util';
import { ObjectUtil } from '@shared/util/object.util';
import { BackFacadeService } from '@core/services/back-facade.service';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { CustomCurrencyPipe } from '@shared/pipes/custom-currency.pipe';


@Component({
  selector: 'app-listar-control-cumulos',
  templateUrl: './listar-control-cumulos.component.html',
})

export class ListarControlCumuloComponent implements OnInit {

  configuracion: ListarcontrolCumulosConfig = new ListarcontrolCumulosConfig();

  public linkCrear: string;
  mostrarForm = false;
  form: FormGroup;
  isForm: Promise<any>;
  _esCreacion = true;
  exportarDisabled = true;

  estado: boolean;
  filtrosGrid: any;

  constructor(
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly backService: BackFacadeService,
    private currencyPipe : CustomCurrencyPipe
  ) { this.filtrosGrid = []; }

  ngOnInit() {
    this.linkCrear = UrlRoute.ADMINISTRACION_PROTECCIONES_CONTROL_CUMULOS_NUEVO;
    this.estado = true;
  }

  /**
   * @author: Edwar Ferney Murillo
   * @description: Obtiene el listado de los registros
   * @param pagina Número de páginas
   * @param tamanio Número de items por páginas
   */
  obtenerItems(pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = 'true') {
    const param = {page: pagina, size: tamanio, isPaged: true, sort: sort, estado: estado};
    if (this.filtrosGrid.length > 0) {
      this.filtrosGrid.map((x: any) => {
        if (x.columna.typeFilter === 'date') {
          const _fechaFiltro = x.columna.keyFiltro.split(',');
          const _valorFechaFiltro = x.valor.split(',');
          param[_fechaFiltro[0]] = _valorFechaFiltro[0];
          param[_fechaFiltro[1]] = _valorFechaFiltro[1];
        } else {
          param[x.columna.keyFiltro] =  x.valor;
        }
      });
    }
    this.backService.controlCumulo.getControlCumulos(param).subscribe((resp: any) => {
        this.configuracion.gridConfig.component.limpiar();
        if (!resp || !resp.content || resp.content.length === 0) {
          this.exportarDisabled = true;
          return;
        }
        this.exportarDisabled = false;
        this.configuracion.gridConfig.component.cargarDatos(
          this.asignarEstados(resp.content), {
          maxPaginas: resp.totalPages,
          pagina: resp.number,
          cantidadRegistros: resp.totalElements
        });
      });
  }

  /**
   * @author: Edwar Ferney Murillo
   * @description: Metodo para formatear la descripcion del estado
   * @param items
   */
  asignarEstados(items: any) {
    const listObj = [];
    let controlCumulo: any;
    for (controlCumulo of items) {
      listObj.push(
        { ...controlCumulo,
          _estado: controlCumulo.estado ? 'Si' : 'No',
          minimoProteccion: controlCumulo.mimTipoReconocido.codigo === MIM_PARAMETROS.MIM_TIPO_RECONOCIDO.COP ? this.currencyPipe.transform(controlCumulo.valorMinimoProteccion) : controlCumulo.valorMinimoProteccion + '%',
          maximoProteccion: controlCumulo.mimTipoReconocido.codigo === MIM_PARAMETROS.MIM_TIPO_RECONOCIDO.COP ? this.currencyPipe.transform(controlCumulo.valorMaximoProteccion) : controlCumulo.valorMaximoProteccion + '%',
        });
    }
    return listObj;
  }

  /**
   * @author: Edwar Ferney Murillo
   * @description: Captura la accion de la grilla
   * @param event
   */
  _onClickCeldaElement(event) {
    this._alEditar(event.dato);
  }

  /**
   * @author: Edwar Ferney Murillo
   * @description: Acción para ir a la siguiente pagina de la grid
   * @param e
   */
  _onSiguiente(e: any) {
    this._obtenerDatosConEstados(e, this.estado);
  }

  /**
   * @author: Edwar Ferney Murillo
   * @description: Acción para regresar a la página anterior de una grid
   * @param e
   */
  _onAtras(e: any) {
    this._obtenerDatosConEstados(e, this.estado);
  }

  /**
   * @author: Edwar Ferney Murillo
   * @description: Ordena la tabla dependiendo de la columna
   * @param event
   */
  _ordenar($event) {
    this._obtenerDatosConEstados($event, this.estado);
  }

  /**
   * @author: Edwar Ferney Murillo
   * @description: Redirige a la pantalla de editar
   * @param event
   */
  _alEditar(event: any) {
    const accion = event;
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_CUMULOS,
      UrlRoute.ADMINISTRACION_PROTECCIONES_CONTROL_CUMULOS,
      accion.codigo]);
  }

  _onToggleStatus($event) {
    this._obtenerDatosConEstados($event, $event.currentTarget.checked);
  }

  _obtenerDatosConEstados($event, estado: boolean) {
    this.estado = estado;
    this.obtenerItems($event.pagina, $event.tamano, $event.sort, this.estado ? 'true' : '');
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description escucha cuando le hace click al exportar excel
   */
  _onClickExportarExcel($event) {
    if (this.configuracion.gridConfig.component && this.configuracion.gridConfig.component.hayDatos()) {
      this.backService.controlCumulo
        .getControlCumulos({ isPaged: false })
        .subscribe((respuesta) => {
          // Se traen los encabezados
          const columnas: string[] = [
            'administracion.protecciones.controlCumulo.excel.fondo',
            'administracion.protecciones.controlCumulo.excel.tipoTope',
            'administracion.protecciones.controlCumulo.excel.nombre',
            'administracion.protecciones.controlCumulo.excel.nombreTipoVinculacionAsociado',
            'administracion.protecciones.controlCumulo.excel.edadMinimaAsociado',
            'administracion.protecciones.controlCumulo.excel.edadMaximaAsociado',
            'administracion.protecciones.controlCumulo.excel.ingresosMinimosAsociado',
            'administracion.protecciones.controlCumulo.excel.ingresosMaximosAsociado',
            'administracion.protecciones.controlCumulo.excel.nivelRiesgo',
            'administracion.protecciones.controlCumulo.excel.unidad',
            'administracion.protecciones.controlCumulo.excel.valorMinimoTope',
            'administracion.protecciones.controlCumulo.excel.valorMaximoTope',
            'administracion.protecciones.controlCumulo.excel.fechaInicioVigencia',
            'administracion.protecciones.controlCumulo.excel.fechaFinVigencia',
            'administracion.protecciones.controlCumulo.excel.estado'
          ];
          ObjectUtil.traducirObjeto(columnas, this.translate);

          // Se mapean solo las columnas que se quieren mostrar en el archivo Excel
          const datos = respuesta.content.map(x =>
            ({
              fondo:x.mimFondo.nombre,
              tipoTope: x.mimTipoTope.nombre,
              nombre: x.mimCumulo.nombre,
              categoriaAsociado: x.sipCategoriaAsociado ? x.sipCategoriaAsociado.nombre : null,
              edadMinimaAsociado: x.edadMinimaIngreso,
              edadMaximaAsociado: x.edadMaximaIngreso,
              ingresosMinimosAsociado: x.ingresoMinimoAsociado ? x.ingresoMinimoAsociado : null,
              ingresosMaximosAsociado: x.ingresoMaximoAsociado ? x.ingresoMaximoAsociado : null,
              nivelRiesgo: x.mimNivelRiesgo ? x.mimNivelRiesgo.nombre : null,
              unidad: x.mimTipoReconocido ? x.mimTipoReconocido.nombre : null,
              valorMinimoTope: x.valorMinimoProteccion,
              valorMaximoTope: x.valorMaximoProteccion,
              fechaInicioVigencia: x.fechaInicioVigencia,
              fechaFinVigencia: x.fechaFinVigencia ? x.fechaFinVigencia : null,
              estado: x.estado === true ? 'Si' : 'No',
            }));

          this.exportarExcel(
            `Reporte_ControlCumulosCobertura_${DateUtil.dateToString(new Date())}`, {
            columnas,
            datos
          });
        });
    }
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Exporta el excel con recto a los datos.
   */
  private exportarExcel(nombre, datos: any = {}) {
    this.backService.utilidades.exportarExcel(nombre, datos).subscribe(respuesta => {
      const body: any = respuesta.body;
      FileUtils.downloadXlsFile(body, nombre);
    });
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
