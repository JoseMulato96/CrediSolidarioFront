import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatosAsociadoWrapper } from '@core/store/asociado-data.service';
import { DataService } from '@core/store/data.service';
import {
  DatosAsociado,
  ProductoAsociado,
  ProductoAsociadoDetalle,
  PortafolioAsociado
} from '@shared/models';
import { UrlRoute } from '@shared/static/urls/url-route';
import { DateUtil } from '@shared/util/date.util';
import { ProductoDetalleService } from '../../services/producto-detalle.service';
import { PortafolioAsociadosService } from './services/portafolio-asociados.service';
import { MimCategoriaConfiguracion } from '@shared/components/mim-categoria/mim-categoria.component';
import {
  MimCategoriaDetalleConfiguracion,
  MimEstadoConfiguracion
} from '@shared/components/mim-categoria-detalle/mim-categoria-detalle.component';
import { SIP_PARAMETROS_TIPO } from '@shared/static/constantes/sip-parametros-tipo';
import { AlertService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { EventoAsociadosService } from '../../services/evento-asociados.service';
import { SIP_ASEGURABILIDAD } from '@shared/static/constantes/sip-asegurabilidad';
import { Subscription } from 'rxjs';

/**
 *
 * @param estado Estado de la proteccion.
 * @description True si corresponde a una proteccion activo, falso sino.
 */
export function cssFun(estado: number) {
  const activos = [
    SIP_PARAMETROS_TIPO.TIPO_ESTADOS_PROTECCIONES.SIP_PARAMETROS.ACTIVO,
    SIP_PARAMETROS_TIPO.TIPO_ESTADOS_PROTECCIONES.SIP_PARAMETROS.INACTIVO_MORA,
    SIP_PARAMETROS_TIPO.TIPO_ESTADOS_PROTECCIONES.SIP_PARAMETROS
      .ACTIVO_ESPECIAL,
    SIP_PARAMETROS_TIPO.TIPO_ESTADOS_PROTECCIONES.SIP_PARAMETROS.RETENCION
  ];
  return activos.indexOf(Number(estado)) !== -1 ? 'active' : '';
}

@Component({
  selector: 'app-portafolio-asociados',
  templateUrl: './portafolio-asociados.component.html',
  styleUrls: ['./portafolio-asociados.component.css']
})
export class PortafolioAsociadosComponent implements OnInit, OnDestroy {
  _asoNumInt = '';
  datosAsociado: DatosAsociado;
  asociadoSubscription: any;

  /**
   * @description Agrupado de protecciones.
   */
  _agrupadoProtecciones: any;
  portafolioAsociado: PortafolioAsociado = new PortafolioAsociado();
  /**
   * @description Configuracion de categorias de protecciones.
   * Se realiza primero un agrupado y posteriormente se crea la configuracion del componente.
   */
  configuracionProtecciones: MimCategoriaConfiguracion[];

  totalProductos = 0;
  totalCuota = 0;

  /**
   * @description Se encarga de controlar los activos.
   */
  mostrarActivos = true;
  /**
   * @description Se encarga de validar que almenos un elemento (Una proteccion) este seleccionada.
   */
  atLeastOneSelected = false;

  _subs: Subscription[] = [];

  constructor(
    private readonly portafolioAsociadosServ: PortafolioAsociadosService,
    private readonly productEvent: ProductoDetalleService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly dataService: DataService,
    private readonly translate: TranslateService,
    private readonly alertService: AlertService,
    private readonly eventoAsociado: EventoAsociadosService,
  ) { }

  ngOnInit() {
    this._subs.push(this.route.parent.parent.parent.parent.params.subscribe(params => {
      this._asoNumInt = params.asoNumInt;
      if (!this._asoNumInt) {
        return;
      }

      this._subs.push(this.dataService
        .asociados()
        .asociado.subscribe((respuesta: DatosAsociadoWrapper) => {
          if (
            !respuesta ||
            respuesta.datosAsociado.numInt !== this._asoNumInt
          ) {
            return;
          }

          this.datosAsociado = respuesta.datosAsociado;
        }, (err: any) => {
          this.alertService.error(err.error.message);
        }));

      // Obtiene el id asociados de la ruta ejemplo /pages/asociado/xxxxx
      this.getPlanesAsociado();
    }));
    this.eventoAsociado.summenu().next({ mostrar: true });
  }

  ngOnDestroy() {
    this._subs.forEach(sub => sub.unsubscribe());
  }

  /**
   * @description Muestra/oculta activos.
   *
   */
  _onToggleStatus() {
    this._deselectAll(this.configuracionProtecciones);
    this._totalize(this.configuracionProtecciones);

    this.mostrarActivos = !this.mostrarActivos;
  }

  /**
   *
   * @description Deselecciona todas las categorias.
   * @param categorias Categorias.
   */
  _deselectAll(categorias: any) {
    categorias.forEach((categoria: MimCategoriaConfiguracion) => {
      categoria._seleccionado = false;
      categoria.detalles.forEach(
        (detalle: MimCategoriaDetalleConfiguracion) => {
          detalle._seleccionado = false;
        }
      );
    });
  }

  /**
   *
   * @description Procesa vento al seleccionar una fila.
   * @param row Fila seleccionada
   */
  _onSelectRow(row: any) {
    this._totalize(this.configuracionProtecciones);
    this._validateSelectAll(this.configuracionProtecciones);
    this._validateAtLeastOneSelected(this.configuracionProtecciones);
  }

  /**
   *
   *
   * @description Procesa evento al seleccionr una categoria
   * @param categoria Categoria seleccionada
   */
  _onSelectAll(categoria: MimCategoriaConfiguracion) {
    const that = this;
    categoria.detalles.forEach((detalle: MimCategoriaDetalleConfiguracion) => {
      detalle._seleccionado =
        !categoria._seleccionado &&
        that.mostrarCategoria(detalle.estadoConf.param);
    });

    this._totalize(this.configuracionProtecciones);
    this._validateAtLeastOneSelected(this.configuracionProtecciones);
  }

  /**
   * @description Se encarga de dar consistencia al estado de los checks de seleccion de las categorias.
   *
   */
  _validateSelectAll(categorias: any) {
    const that = this;
    categorias.forEach((categoria: MimCategoriaConfiguracion) => {
      let allSelected = true;
      categoria.detalles.forEach(
        (detalle: MimCategoriaDetalleConfiguracion) => {
          allSelected =
            allSelected &&
            (detalle._seleccionado ||
              !that.mostrarCategoria(detalle.estadoConf.param));
        }
      );

      categoria._seleccionado = allSelected;
    });
  }

  /**
   * @description Mantiene el estado de la variable atLeastOneSelected.
   * @param categorias Categorias del asociado.
   */
  _validateAtLeastOneSelected(categorias: any) {
    this.atLeastOneSelected = false;
    const that = this;
    categorias.forEach((categoria: MimCategoriaConfiguracion) => {
      categoria.detalles.forEach(
        (detalle: MimCategoriaDetalleConfiguracion) => {
          that.atLeastOneSelected =
            that.atLeastOneSelected || detalle._seleccionado;
        }
      );
    });
  }

  /**
   * @author Hander gutierrez
   * @description Totaliza los productos seleccionados.
   * @param categorias Productos seleccionados.
   */
  _totalize(categorias: any) {
    this.totalProductos = 0;
    this.totalCuota = 0;

    let valorProductos = 0;
    let valorCuota = 0;

    categorias.forEach((categoria: MimCategoriaConfiguracion) => {
      categoria.detalles.forEach(
        (detalle: MimCategoriaDetalleConfiguracion) => {
          const selected = detalle._seleccionado;
          detalle.atributos.forEach((atributo: any) => {
            if (atributo.key === 'proProteccionAcumulada') {
              if (selected) {
                valorProductos += atributo.valor;
              }
            }

            if (atributo.key === 'proCuotaAcumulada') {
              if (selected) {
                valorCuota += atributo.valor;
              }
            }
          });
        }
      );
    });

    this.totalProductos = valorProductos;
    this.totalCuota = valorCuota;
  }

  /**
   * @description Valida si debe mostrar la categoria.
   * @param categorias Categorias
   */
  _mostrarCategoria(categoria: MimCategoriaConfiguracion): boolean {
    let mostrar = false;
    categoria.detalles.forEach((detalle: MimCategoriaDetalleConfiguracion) => {
      mostrar = mostrar || this.mostrarCategoria(detalle.estadoConf.param);
    });

    return mostrar;
  }

  /**
   * @description True si debe mostrar la categoria, false sino.
   *
   */
  mostrarCategoria(estado: number): boolean {
    if (this.mostrarActivos) {
      const activos = [
        SIP_PARAMETROS_TIPO.TIPO_ESTADOS_PROTECCIONES.SIP_PARAMETROS.ACTIVO,
        SIP_PARAMETROS_TIPO.TIPO_ESTADOS_PROTECCIONES.SIP_PARAMETROS
          .INACTIVO_MORA,
        SIP_PARAMETROS_TIPO.TIPO_ESTADOS_PROTECCIONES.SIP_PARAMETROS
          .ACTIVO_ESPECIAL,
        SIP_PARAMETROS_TIPO.TIPO_ESTADOS_PROTECCIONES.SIP_PARAMETROS.RETENCION
      ];
      return activos.indexOf(Number(estado)) !== -1;
    }

    return true;
  }

  /**
   * @author: Jorge Luis Caviedes Alvarado
   * @description: Obtiene los planes del asociado
   * @return la subscribe
   */
  getPlanesAsociado() {
    this._subs.push(this.portafolioAsociadosServ
      .getPlanesAsociado(this._asoNumInt)
      .subscribe(
        (respuesta: any[]) => {
          if (!respuesta || respuesta.length === 0) {
            this.translate
              .get('asociado.protecciones.noSeEncontraronRegistrosMensaje')
              .subscribe((response: any) => {
                this.alertService.info(response);
              });

            return;
          }
          this._agrupadoProtecciones = respuesta.reduce(
            (entryMap, e) =>
              entryMap.set(e.codigoCategoria, e),
            new Map()
          );

          // Inicializamos las categoria de los planes en el portafolio de asociados.
          this.portafolioAsociado.categoriasPlanes = this._agrupadoProtecciones;

          // Construimos la configuraci;ón del componente de categorias.
          this._buildConfig(this._agrupadoProtecciones);
        },
        (err) => {
          this.alertService.error(err.error.message);
        }
      ));
  }

  private _obtenerCssAgrupacion(codigoAsegurabilidad: number): any {
    return Object.values(SIP_ASEGURABILIDAD).find(asegurabilidad => asegurabilidad.ASE_CODIGO === codigoAsegurabilidad);
  }

  _buildConfig(agrupacion: any) {
    const that = this;
    this.configuracionProtecciones = [];

    agrupacion.forEach(function (value: any, index: any, array: any[]) {
      const config = new MimCategoriaConfiguracion();
      config.titulo = value.nombreCategoria;
      config.codigoCategoria = index;
      config.cssBgBadge = that._obtenerCssAgrupacion(config.codigoCategoria).CSS_BADGE;
      config.seleccionado = true;
      config.detalles = [];

      value.listaProtecciones.forEach((proteccion: ProductoAsociado) => {
        const detalleConfig = new MimCategoriaDetalleConfiguracion();
        detalleConfig.key = proteccion.proCod;
        detalleConfig.titulo = proteccion.prodDescripcion;
        detalleConfig.seleccionado = true;
        detalleConfig.dropdown = true;

        detalleConfig.subTitleDetail = [];
        detalleConfig.atributos = [];
        detalleConfig.atributos.push({
          key: 'proProteccionAcumulada',
          titulo: 'asociado.protecciones.proteccion',
          valor: proteccion.proProteccionAcumulada,
          tipo:
            !that.esAuxilioFunerario(config.codigoCategoria)
              ? 'currency'
              : 'default'
        });

        // Cuota
        detalleConfig.atributos.push({
          key: 'proCuotaAcumulada',
          titulo: 'global.fee',
          valor: proteccion.proCuotaAcumulada,
          tipo: 'currency'
        });

        // Perseverado
        if (proteccion.fechaPerseverancia !== null && proteccion.fechaPerseverancia !== undefined) {
          detalleConfig.atributos.push({
            key: 'fechaPerseverancia',
            titulo: 'F. Perseverancia',
            valor: proteccion.fechaPerseverancia,
            tipo: 'icono',
            icono: (proteccion.perseverancia === 'Si' ? 'icon-trophy text-warning' : 'icon-cogs text--gray2') + ' text--20pts',
            boton: 'btn btn--icon bg--gray4',
            tooltip: proteccion.perseverancia === 'Si' ?
              'asociado.protecciones.alertas.haLogradoPerseverarse'
              : 'asociado.protecciones.alertas.enProcesoPerseverarse'
          });

          // Sub titulo para el detalle
          detalleConfig.subTitleDetail.push({
            titulo: 'asociado.protecciones.fechaPerseverancia',
            valor: proteccion.fechaPerseverancia,
          });
          detalleConfig.subTitleDetail.push({
            titulo: 'asociado.protecciones.perseverado',
            valor: proteccion.perseverancia,
          });
        }


        detalleConfig.estadoConf = new MimEstadoConfiguracion();
        detalleConfig.estadoConf.titulo = proteccion.descEstado;
        detalleConfig.estadoConf.cssFun = cssFun;
        detalleConfig.estadoConf.param = proteccion.proEstado;

        config.detalles.push(detalleConfig);
      });

      that.configuracionProtecciones.push(config);
    });
  }

  /**
   * @description Muestra u oculta el detalle del producto del asociado.
   * @param detalleConfiguracion Configuracion del detalle
   */
  _onToogleDetalleCategoriaDetalle(detalleConfiguracion: MimCategoriaDetalleConfiguracion) {
    if (detalleConfiguracion._dropdown) {
      const that = this;
      this._agrupadoProtecciones.forEach(function (value: any, index: any, array: any[]) {
        value.listaProtecciones.forEach((proteccion: ProductoAsociado) => {
          if (proteccion.proCod === Number(detalleConfiguracion.key)) {
            proteccion.proteccionEventoDtoList.forEach(proteccionEventoDto => {
              proteccionEventoDto.edad = DateUtil.calcularEdad(
                DateUtil.stringToDate(that.datosAsociado.fecNac),
                DateUtil.stringToDate(proteccionEventoDto.fechaAprobacion)
              );
            });
          }
        });
      });
    }
  }

  /**
   * @description Se encarga de obtener el detalle del producto a mostrar.
   * @param categoriaKey Id de la categoria.
   * @param proCod  Codigo de la proteccion.
   */
  _getDetalleProducto(categoriaKey: number, proCod: any) {
    let detalleProteccion = [];

    this._agrupadoProtecciones.get(categoriaKey).listaProtecciones
      .forEach((proteccion: ProductoAsociado) => {
        if (proteccion.proCod === Number(proCod)) {
          detalleProteccion = proteccion.proteccionEventoDtoList;
        }
      });

    return detalleProteccion;
  }

  _obtenerProducto(categoriaKey: any, proCod: any) {
    let producto: any;

    this._agrupadoProtecciones
      .get(categoriaKey).listaProtecciones
      .forEach((proteccion: ProductoAsociado) => {
        if (proteccion.proCod === Number(proCod)) {
          producto = proteccion;
        }
      });

    return producto;
  }

  _EnRutaPlanAsociado(consecutivo: any, proCod: any, url: string) {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.CONSULTAS,
      UrlRoute.CONSULTAS_ASOCIADO,
      this._asoNumInt,
      UrlRoute.PROTECCIONES,
      proCod,
      UrlRoute.PORTAFOLIO_ASOCIADO_DETALLE,
      consecutivo,
      url
    ]);
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description  enrutar Detalle
   */
  onClickDetalle(
    detalleSeleccion: ProductoAsociadoDetalle,
    categoriaKey: number,
    proCod: any
  ) {
    this.productEvent.setCambioDetalleProducto(
      detalleSeleccion,
      this._getDetalleProducto(categoriaKey, proCod),
      this._obtenerProducto(categoriaKey, proCod)
    );
    this._EnRutaPlanAsociado(
      detalleSeleccion.consecutivo,
      proCod,
      UrlRoute.DETALLE
    );
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description enruta a facturacion
   */
  onClickFacturacion(
    detalleSeleccion: ProductoAsociadoDetalle,
    categoriaKey: number,
    proCod: any
  ) {
    this.productEvent.setCambioDetalleProducto(
      detalleSeleccion,
      this._getDetalleProducto(categoriaKey, proCod),
      this._obtenerProducto(categoriaKey, proCod)
    );
    return this._EnRutaPlanAsociado(
      detalleSeleccion.consecutivo,
      proCod,
      UrlRoute.FACTURACION
    );
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description enruta a Inactividades
   */
  onClickInactividades(
    detalleSeleccion: ProductoAsociadoDetalle,
    categoriaKey: number,
    proCod: any
  ) {
    this.productEvent.setCambioDetalleProducto(
      detalleSeleccion,
      this._getDetalleProducto(categoriaKey, proCod),
      this._obtenerProducto(categoriaKey, proCod)
    );
    return this._EnRutaPlanAsociado(
      detalleSeleccion.consecutivo,
      proCod,
      UrlRoute.INACTIVIDADES
    );
  }
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description enruta historico
   */
  onClickHistoricos(
    detalleSeleccion: ProductoAsociadoDetalle,
    categoriaKey: number,
    proCod: any
  ) {
    this.productEvent.setCambioDetalleProducto(
      detalleSeleccion,
      this._getDetalleProducto(categoriaKey, proCod),
      this._obtenerProducto(categoriaKey, proCod)
    );
    return this._EnRutaPlanAsociado(
      detalleSeleccion.consecutivo,
      proCod,
      UrlRoute.HISTORICO
    );
  }

  esAuxilioFunerario(codigoAsegurabilidad: any) {
    return SIP_ASEGURABILIDAD.AUXILIO_FUNERARIO.ASE_CODIGO === Number(codigoAsegurabilidad);
  }
}
