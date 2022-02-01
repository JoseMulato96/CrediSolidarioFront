import { Component, OnInit } from '@angular/core';
import { ListarBeneficiarioPagoConfig } from './listar-beneficiario-pago.config';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { UrlRoute } from '@shared/static/urls/url-route';
import { GENERALES } from '../../../../../../shared/static/constantes/constantes';
import { BackFacadeService, FrontFacadeService } from '@core/services';

@Component({
  selector: 'app-listar-beneficiario-pago',
  templateUrl: './listar-beneficiario-pago.component.html',
})
export class ListarBeneficiarioPagoComponent implements OnInit {

  configuracion: ListarBeneficiarioPagoConfig = new ListarBeneficiarioPagoConfig();
  estado: any = '2,3';
  coberturas: any[] = [];
  dataFiltros: any;

  constructor(
    private readonly router: Router,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService) { }

  ngOnInit() {
    this.obtenerCoberturas();
  }

  obtenerCoberturas(pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estados = '2,3') {
    const param: any = { page: pagina, size: tamanio, isPaged: true, sort: sort };
    if (estados !== '') {
      param['mimEstadoCobertura.codigo'] = [2, 3];
    }

    forkJoin([
      this.backService.cobertura.obtenerCoberturas({})
    ]).subscribe(([
      _listaFiltroCoberturas
    ]) => {
      this.coberturas = _listaFiltroCoberturas.content;
      this.configuracion.gridListarBeneficiariosPago.component.cargarDatosDropdown([
        { code: 'cobertura', datos: this.formatDropdown(this.coberturas) }
      ]);

    }, (err: any) => {
      this.frontService.alert.warning(err.error.message);
    });
  }

  /**
   * @description Metodo para construir la estructura de datos que recibe el control lista desplegable
   */
  formatDropdown(datos: any[]) {
    const item: any[] = [];
    datos.forEach(x => {
      item.push({ label: x.nombre, value: x.codigo });
    });
    return item;
  }

  fechaModificaMayor(items: any) {
    const listObj = [];
    let item: any;
    for (item of items) {

      // Fecha del registro cobertura
      let fechaModifica = item.fechaModificacion;

      // Si existen registros de beneficiarios cobertura
      if (item.mimCoberturaBeneficiarioCoberturaList) {

        // Se evaluan si alguna de las fechas del listado es mayor a la fecha de cobertura y se retorna el registro
        const datosFechasCobertura = item.mimCoberturaBeneficiarioCoberturaList.filter(function (elementoA) {
          const fechaCobertura1 = fechaModifica;
          const fechaCobertura2 = elementoA.fechaModificacion;
          if (fechaCobertura2 > fechaCobertura1) {
            return fechaCobertura2;
          }
        });

        // Si la fecha de modificación de beneficiarios cobertura es mayor a la fecha de cobertura
        if (datosFechasCobertura.length > 0) {
          fechaModifica = datosFechasCobertura[0].fechaModificacion;
        }
      }

      // Si existen registros de beneficiarios pago
      if (item.mimCoberturaBeneficiarioPagoList) {

        // Se evaluan si alguna de las fechas del listado es mayor a la fecha de cobertura y se retorna el registro
        const datosFechasPagos = item.mimCoberturaBeneficiarioPagoList.filter(function (elementoB) {
          const fechaPago1 = fechaModifica;
          const fechaPago2 = elementoB.fechaModificacion;
          if (fechaPago2 > fechaPago1) {
            return fechaPago2;
          }
        });

        // Si la fecha de modificación de beneficiarios pago es mayor a la fecha de cobertura
        if (datosFechasPagos.length > 0) {
          fechaModifica = datosFechasPagos[0].fechaModificacion;
        }
      }

      listObj.push({
        ...item,
        estado: item.mimEstadoCobertura.codigo === GENERALES.ESTADOS_COBERTURA.NO_DISPONIBLE ? 'No' : 'Si',
        _fechaModificacion: fechaModifica
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

  _onClickCeldaElement($event: any) {
    if ($event.col.key === 'editar') {
      this._alEditar($event.dato);
    }
  }

  _alEditar($event: any) {
    const cobertura = $event;
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_BENEFICIARIO_PAGO,
      cobertura.codigo]);
  }

  _ordenar($event) {
    this._obtenerDatosConEstados($event, this.estado);
  }

  _onToggleStatus($event) {
    this._obtenerDatosConEstados($event, $event.currentTarget.checked);
  }

  _obtenerDatosConEstados($event, estado: boolean) {
    this.estado = estado;
    this._selectDropdown(this.dataFiltros, $event.pagina, $event.tamano, $event.sort, this.estado ? '2,3' : '');
  }

  /**
 * @description Metodo para construir los parametros para realizar la busqueda de los registros
 * @param event Datos de las listas deplegables para filtrar
 */
  _selectDropdown(event: any, pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estados = '2,3') {
    this.dataFiltros = event;
    let param: any = { page: pagina, size: tamanio, isPaged: true, sort: sort, };
    if (estados !== '') {
      param['mimEstadoCobertura.codigo'] = [2, 3];
    }

    if (event !== undefined) {
      const codigoCobertura = event.filter(x => x.codeControl === 'cobertura').map(x => x.codigoDropdown)[0];
      if (codigoCobertura !== undefined) {
        param = {
          ...param,
          'codigo': codigoCobertura
        };
        this.getDataTable(param);
      }
    } else {
      this.getDataTable(param);
    }
  }

  /**
   * @description Metodo para obtener los datos y cargarlos en la tabla
   */
  getDataTable(param: any) {

    this.backService.cobertura.obtenerCoberturas(param)
      .subscribe((resp: any) => {
        this.configuracion.gridListarBeneficiariosPago.component.limpiar();

        if (!resp || !resp.content || resp.content.length === 0) {
          return;
        }

        this.configuracion.gridListarBeneficiariosPago.component.cargarDatos(
          this.fechaModificaMayor(resp.content), {
          maxPaginas: resp.totalPages,
          pagina: resp.number,
          cantidadRegistros: resp.totalElements
        });
      }, (err) => {
        this.frontService.alert.warning(err.error.message);
      });
  }

}
