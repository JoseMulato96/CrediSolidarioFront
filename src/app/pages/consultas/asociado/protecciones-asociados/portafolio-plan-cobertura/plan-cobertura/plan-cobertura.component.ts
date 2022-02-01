import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BackFacadeService } from '@core/services/back-facade.service';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { DatosAsociadoWrapper } from '@core/store/asociado-data.service';
import { DataService } from '@core/store/data.service';
import { TranslateService } from '@ngx-translate/core';
import { DatosAsociado } from '@shared/models';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { UrlRoute } from '@shared/static/urls/url-route';
import { DateUtil } from '@shared/util/date.util';
import { ObjectUtil } from '@shared/util/object.util';
import { Subscription } from 'rxjs';
import { PlanCoberturaConfig } from './plan-cobertura.config';

@Component({
  selector: 'app-plan-cobertura',
  templateUrl: './plan-cobertura.component.html',
  styleUrls: ['./plan-cobertura.component.css']
})
export class PlanCoberturaComponent implements OnInit {

  form: FormGroup;
  isForm: Promise<any>;
  _asoNumInt = '';
  datosAsociado: DatosAsociado;
  configuracion: PlanCoberturaConfig = new PlanCoberturaConfig();
  totalProductosPlan: number;
  totalCuotaPlan: number;
  totalProductosCobertura: number;
  totalCuotaCobertura: number;
  mostrarTotal: boolean;
  mostrarListaPlanCobertura: boolean;
  mostrarLoader: boolean;
  mostrarModal: boolean;
  tituloModal: string;
  sePersevera: string;
  coberturas: any;
  coberturasAll: any;
  planes: any;
  planesAll: any;
  estadosActivosPlanes = [MIM_PARAMETROS.MIM_ESTADO_PLAN.ACTIVO, MIM_PARAMETROS.MIM_ESTADO_PLAN.PROCESO, MIM_PARAMETROS.MIM_ESTADO_PLAN.EN_ELIMINACION];
  detalleModal: any;
  datosDetalleModal: any;
  paginas: number;
  totalRegistros: number;
  regVisto: number;
  public linkMovimiento: string;
  _subs: Subscription[] = [];

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly dataService: DataService,
    private readonly formBuilder: FormBuilder,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    this.mostrarTotal = true;
    this.mostrarListaPlanCobertura = true;
    this.paginas = 0;
    this.totalRegistros = 0;
    this.linkMovimiento = UrlRoute.PORTAFOLIO_PLAN_COBERTURA_MOVIMIENTOS;
  }
  ngOnDestroy(): void {
    this._subs.forEach(item => item.unsubscribe());
  }

  ngOnInit(): void {
    this._subs.push(this.route.parent.parent.parent.parent.parent.params.subscribe(params => {
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
        }));


    }));
    this.initForm();
    this.getPlanes();
  }

  private initForm() {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        buscar: new FormControl(null),
        estado: new FormControl(true)
      }));
  }

  private getPlanes(estados = true) {
    if (this.planesAll && estados) {
      this.planes = this.planesAll;
    } else {
      this.mostrarLoader = true;
      const param: any = { asoNumInt: this._asoNumInt };
      if (estados) {
        param['estado'] = estados;
      }
      this.backService.proteccionesEventos.getPortafolio('portafolioAgrupadoPlan', param).subscribe(items => {
        this.configuracion.gridConfig.component.limpiar();
        this.mostrarLoader = false;
        if (!items || !items.protecciones || items.protecciones.length === 0) {
          return;
        }

        this.totalProductosPlan = items.totalCuota;
        this.totalCuotaPlan = items.totalProtecciones;
        this.planes = this.transformarDataPlan(items.protecciones);
        this.planesAll = this.planes;

        this.configuracion.gridConfig.component.cargarDatos(
          this.planes, {
          maxPaginas: items.protecciones.length % 10,
          pagina: 0,
          cantidadRegistros: items.protecciones.length
        });

      }, (err) => {
        this.mostrarLoader = false;
        this.frontService.alert.warning(err.error.message);
      });
    }

  }

  private getCoberturas(estados = true) {
    if (this.coberturasAll && estados) {
      this.coberturas = this.coberturasAll;
    } else {
      this.mostrarLoader = true;
      const param: any = { asoNumInt: this._asoNumInt };
      if (estados) {
        param['estado'] = estados;
      }
      this.backService.proteccionesEventos.getPortafolio('portafolio', param).subscribe(items => {

        this.configuracion.gridConfigCobertura.component.limpiar();
        this.mostrarLoader = false;
        if (!items || !items.protecciones || items.protecciones.length === 0) {
          return;
        }
        this.totalProductosCobertura = items.totalCuota;
        this.totalCuotaCobertura = items.totalProtecciones;
        this.coberturas = this.transformarDataCobertura(items.protecciones);
        this.coberturasAll = this.coberturas;

        this.configuracion.gridConfigCobertura.component.cargarDatos(
          this.coberturas, {
          maxPaginas: items.protecciones.length % 10,
          pagina: 0,
          cantidadRegistros: items.protecciones.length
        });
      }, (err) => {
        this.mostrarLoader = false;
        this.frontService.alert.warning(err.error.message);
      });

    }

  }

  _onToggleStatus($event) {
    if (this.mostrarListaPlanCobertura) {
      this.getPlanes($event.currentTarget.checked);
    } else {
      this.getCoberturas($event.currentTarget.checked);
    }
  }

  private transformarDataPlan(items: any) {
    const mensajes: string[] = [
      'asociado.protecciones.alertas.haLogradoPerseverarse',
      'asociado.protecciones.alertas.enProcesoPerseverarse'
    ];
    ObjectUtil.traducirObjeto(mensajes, this.translate);
    const listObj = [];
    let item: any;
    for (item of items) {
      listObj.push({
        ...item,
        tooltips: item.fechaPerseverancia !== null && item.fechaPerseverancia !== undefined ? {
          mensaje: item.perseverancia === 'Si' ? mensajes[0] : mensajes[1],
          cssButton: 'btn btn--icon bg--gray4',
          cssIcon: (item.perseverancia === 'Si' ? 'icon-trophy text-warning' : 'icon-cogs text--gray2') + ' text--20pts', // 'icon-cogs text--20pts text--gray2'
        } : null,
        _color: item.plan.codigoColor
      });
    }
    return listObj;
  }

  private transformarDataCobertura(items: any) {
    const listObj = [];
    let item: any;
    for (item of items) {
      listObj.push({
        ...item,
        _color: item.plan.codigoColor,
        edad: DateUtil.calcularEdad(
          DateUtil.stringToDate(this.datosAsociado.fecNac),
          DateUtil.stringToDate(item.fechaAprobacion)
        )
      });
    }
    return listObj;
  }

  private transformarDataDetalle(items: any) {
    const listObj = [];
    let item: any;
    for (item of items) {
      listObj.push({
        ...item,
        edad: DateUtil.calcularEdad(
          DateUtil.stringToDate(this.datosAsociado.fecNac),
          DateUtil.stringToDate(item.fechaAprobacion)
        )
      });
    }
    return listObj;
  }

  listarPlanCobertura(mostrar: boolean) {
    this.limpiar();
    this.mostrarListaPlanCobertura = mostrar;
    if (this.mostrarListaPlanCobertura) {
      this.getPlanes();
    } else {
      this.getCoberturas();
    }

  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  clicDetalle(event: any) {
    this.tituloModal = event.dato.fechaPerseverancia;
    this.sePersevera = event.dato.perseverancia;
    Promise.resolve(this.mostrarModal = true).then(() => {
      this.detalleModal = this.transformarDataDetalle(event.dato.coberturas.data);
      this.paginar();
    });
  }

  /**
   *
   * @description Filtros
   * si this.mostrarListaPlanCobertura = true se filtra para la pestaña de plan, de lo contrario, se filtra para cobertura
   */
  getFiltro(event: any) {
    if (this.mostrarListaPlanCobertura) {
      this.planes = this.planesAll.filter(item => item.plan.nombre.toLowerCase().match(event.target.value.toLowerCase()));
      this.configuracion.gridConfig.component.limpiar();

      this.configuracion.gridConfig.component.cargarDatos(
        this.planes, {
        maxPaginas: this.planes.length % 10,
        pagina: 0,
        cantidadRegistros: this.planes.length
      });
    } else {
      this.coberturas = this.coberturasAll.filter(item => item.planCobertura.nombre.toLowerCase().match(event.target.value.toLowerCase()));
      this.configuracion.gridConfigCobertura.component.limpiar();

      this.configuracion.gridConfigCobertura.component.cargarDatos(
        this.coberturas, {
        maxPaginas: this.coberturas.length % 10,
        pagina: 0,
        cantidadRegistros: this.coberturas.length
      });
    }


  }

  private limpiar() {
    this.form.reset();
    this.form.controls.buscar.reset();
    this.form.controls.estado.setValue(true);
    this.initForm();
  }

  clickInicio() {
    if (this.paginas) {
      this.paginas = 0;
      this.paginar();
    }
  }

  clickAtras() {
    if (this.paginas) {
      this.paginas--;
      this.paginar();
    }
  }

  clickSiguiente() {
    if (
      (this.paginas + 1) * 10 <
      this.totalRegistros
    ) {
      this.paginas++;
      this.paginar();
    }
  }
  clickFin() {
    if ((this.paginas + 1) * 10 < this.totalRegistros) {
      const div: number = this.totalRegistros / 10;
      this.paginas = Math.floor(div);
      const mod: number =
        this.totalRegistros % 10;
      this.paginas += mod === 0 ? -1 : 0;
      this.paginar();
    }
  }

  private paginar() {
    this.totalRegistros = this.detalleModal.length;
    this.regVisto = Math.min(
      (this.paginas + 1) * 10,
      this.totalRegistros
    );
    const _rangoInicial = this.paginas === 0 ? 0 : this.paginas * 10;
    this.datosDetalleModal = this.detalleModal.slice(_rangoInicial, this.regVisto);
  }

  clickCeldaProteccion(event: any) {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.CONSULTAS,
      UrlRoute.CONSULTAS_ASOCIADO,
      this._asoNumInt,
      UrlRoute.PROTECCIONES,
      event.dato.proteccion,
      UrlRoute.PORTAFOLIO_ASOCIADO_DETALLE,
      event.dato.consecutivo,
      UrlRoute.DETALLE
    ]);
  }

}
