import { Component, OnInit, OnDestroy } from '@angular/core';
import { CapitalPagadoFacturacionAsociadoService } from './services/capital-pagodo-facturacion-asociado.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '@core/services';
import { Subscription } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { APP_PARAMETROS } from '@shared/static/constantes/app-parametros';
import { ProteccionesAcumuladas } from '@shared/models/protecciones-acumuladas';
import { ActivatedRoute } from '@angular/router';
import { MimCategoriaConfiguracion } from '@shared/components/mim-categoria/mim-categoria.component';
import { MimCategoriaDetalleConfiguracion, MimEstadoConfiguracion } from '@shared/components/mim-categoria-detalle/mim-categoria-detalle.component';
import { SIP_PARAMETROS_TIPO } from '@shared/static/constantes/sip-parametros-tipo';

/**
 *
 * @param estado Estado de la proteccion.
 * @description True si corresponde a una proteccion activo, falso sino.
 */
export function cssFun(estado: number) {
  const activos = [
    SIP_PARAMETROS_TIPO.TIPO_ESTADOS_PROTECCIONES.SIP_PARAMETROS.ACTIVO,
    SIP_PARAMETROS_TIPO.TIPO_ESTADOS_PROTECCIONES.SIP_PARAMETROS.INACTIVO_MORA,
    SIP_PARAMETROS_TIPO.TIPO_ESTADOS_PROTECCIONES.SIP_PARAMETROS.ACTIVO_ESPECIAL,
    SIP_PARAMETROS_TIPO.TIPO_ESTADOS_PROTECCIONES.SIP_PARAMETROS.RETENCION,
  ];
  return activos.indexOf(Number(estado)) !== -1 ? 'active' : '';
}

@Component({
  selector: 'app-capital-pagado-facturacion-asociados',
  templateUrl: './capital-pagado-facturacion-asociados.component.html',
})
export class CapitalPagadoFacturacionAsociadosComponent implements OnInit, OnDestroy {
  auxilioFunerario: number =
    APP_PARAMETROS.PROTECCIONES.PORTAFOLIO_ASOCIADOS.AUXILIO_FUNERARIO;

  _asoNumInt;
  _asoNumIntSubscription: Subscription;

  totalProteccionesSeleccionadas = 0;
  /**
   * @description Agrupado de protecciones.
   */
  _agrupadoProtecciones: any[];
  _proteccionesSubscription: Subscription;
  /**
   * @description Configuracion de categorias de protecciones.
   * Se realiza primero un agrupado y posteriormente se crea la configuracion del componente.
   */
  configuracionProtecciones: MimCategoriaConfiguracion[];

  /**
   * @description Se encarga de controlar los activos.
   */
  mostrarActivos = true;
  /**
   * @description Se encarga de validar que almenos un elemento (Una proteccion) este seleccionada.
   */
  atLeastOneSelected = false;

  constructor(private readonly capitalPagadoFacturacionAsociadoService: CapitalPagadoFacturacionAsociadoService,
    private readonly route: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly alertService: AlertService,
    private readonly ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this._asoNumIntSubscription = this.route.parent.parent.parent.params.subscribe(params => {
      this._asoNumInt = params['asoNumInt'];

      this.getCapitalPagado(this._asoNumInt);
    });
  }

  ngOnDestroy() {
    if (this._asoNumIntSubscription) {
      this._asoNumIntSubscription.unsubscribe();
    }
    if (this._proteccionesSubscription) {
      this._proteccionesSubscription.unsubscribe();
    }
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
      detalle._seleccionado = !categoria._seleccionado
        && that.mostrarCategoria(detalle.estadoConf.param);
    });

    this._totalize(this.configuracionProtecciones);
    this._validateAtLeastOneSelected(this.configuracionProtecciones);
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
   * @description Se encarga de dar consistencia al estado de los checks de seleccion de las categorias.
   *
   */
  _validateSelectAll(categorias: any) {
    const that = this;
    categorias.forEach((categoria: MimCategoriaConfiguracion) => {
      let allSelected = true;
      categoria.detalles.forEach((detalle: MimCategoriaDetalleConfiguracion) => {
        allSelected = allSelected &&
          (detalle._seleccionado || !that.mostrarCategoria(detalle.estadoConf.param));
      });

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
      categoria.detalles.forEach((detalle: MimCategoriaDetalleConfiguracion) => {
        that.atLeastOneSelected = that.atLeastOneSelected || detalle._seleccionado;
      });
    });
  }

  /**
   *
   * @description Deselecciona todas las categorias.
   * @param categorias Categorias.
   */
  _deselectAll(categorias: any) {
    categorias.forEach((categoria: MimCategoriaConfiguracion) => {
      categoria._seleccionado = false;
      categoria.detalles.forEach((detalle: MimCategoriaDetalleConfiguracion) => {
        detalle._seleccionado = false;
      });
    });
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
        SIP_PARAMETROS_TIPO.TIPO_ESTADOS_PROTECCIONES.SIP_PARAMETROS.INACTIVO_MORA,
        SIP_PARAMETROS_TIPO.TIPO_ESTADOS_PROTECCIONES.SIP_PARAMETROS.ACTIVO_ESPECIAL,
        SIP_PARAMETROS_TIPO.TIPO_ESTADOS_PROTECCIONES.SIP_PARAMETROS.RETENCION,
      ];
      return activos.indexOf(Number(estado)) !== -1;
    }

    return true;
  }

  /**
  * @author Hander gutierrez
  * @description Totaliza los productos seleccionados.
  * @param categorias Productos seleccionados.
  */
  _totalize(categorias: any) {
    this.totalProteccionesSeleccionadas = 0;

    let valor = 0;

    categorias.forEach((categoria: MimCategoriaConfiguracion) => {
      categoria.detalles.forEach((detalle: MimCategoriaDetalleConfiguracion) => {
        const selected = detalle._seleccionado;
        detalle.atributos.forEach((atributo: any) => {
          if (atributo.key === 'acumulado') {
            if (selected) {
              valor += atributo.valor;
            }
          }
        });
      });
    });

    this.totalProteccionesSeleccionadas = valor;
  }

  /**
   * @author Hander Fernando Gutierrez Cordoba
   * @description Obtener los valores acumulados por productos
   * @param asoNumInt Identificador unico del asociado.
   */
  getCapitalPagado(asoNumInt) {
    this._proteccionesSubscription = this.capitalPagadoFacturacionAsociadoService.getCapitalPagado(asoNumInt).subscribe(
      (respuesta: any[]) => {
        if (!respuesta || respuesta.length === 0) {
          this.translate.get('asociado.facturacion.capitalPagado.noSeEncontraronRegistrosMensaje').subscribe((response: any) => {
            this.alertService.info(response);
          });

          return;
        }

        this._agrupadoProtecciones = respuesta.reduce(
          (entryMap, e) =>
            entryMap.set(e.nombre, [...(entryMap.get(e.nombre) || []), e]),
          new Map()
        );

        // Construimos la configuraci;ón del componente de categorias.
        this._buildConfig(this._agrupadoProtecciones);
      },
      error => {
        this.ngxService.stop();
        this.alertService.warning(error.error.message);
      }
    );
  }

  _buildConfig(agrupacion: any) {
    const that = this;
    this.configuracionProtecciones = [];

    agrupacion.forEach(function (value: any, index: any, array: any[]) {
      const config = new MimCategoriaConfiguracion();
      config.titulo = index;
      config.cssBgBadge = (
        APP_PARAMETROS.PROTECCIONES.COLORES_BADGE.find(
          x => x.value.toUpperCase() === index.toUpperCase()
        ) || { css: 'bg--orange1' }
      ).css;
      config.seleccionado = true;

      config.detalles = [];
      value.forEach((proteccion: ProteccionesAcumuladas) => {
        const detalleConfig = new MimCategoriaDetalleConfiguracion();
        detalleConfig.titulo = proteccion.plan;
        detalleConfig.seleccionado = true;

        detalleConfig.atributos = [];
        detalleConfig.atributos.push({
          key: 'acumulado',
          titulo: 'asociado.protecciones.acumulado',
          valor: proteccion.acumulado,
          tipo: 'currency'
        });

        detalleConfig.atributos.push({
          key: 'cuotasVenccuotasPagadasidas',
          titulo: 'asociado.facturacion.capitalPagado.cuotasPagadas',
          valor: proteccion.cuotasPagadas
        });

        detalleConfig.atributos.push({
          key: 'cuotasVencidas',
          titulo: 'asociado.facturacion.capitalPagado.cuotasVencidas',
          valor: proteccion.cuotasVencidas
        });

        detalleConfig.estadoConf = new MimEstadoConfiguracion();
        detalleConfig.estadoConf.titulo = proteccion.proEstado;
        detalleConfig.estadoConf.cssFun = cssFun;
        detalleConfig.estadoConf.param = proteccion.codigoEstado;

        config.detalles.push(detalleConfig);
      });

      that.configuracionProtecciones.push(config);
    });
  }
}
