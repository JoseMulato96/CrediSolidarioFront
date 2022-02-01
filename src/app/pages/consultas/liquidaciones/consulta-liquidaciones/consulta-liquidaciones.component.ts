import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FormValidate } from '@shared/util';
import { masksPatterns } from '@shared/util/masks.util';
import { Subscription, forkJoin } from 'rxjs';
import { ConsultaLiquidacionesConfig } from './consulta-liquidaciones.config';
import { UrlRoute } from '@shared/static/urls/url-route';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { Page } from '@shared/interfaces/page.interface';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-consulta-liquidaciones',
  templateUrl: './consulta-liquidaciones.component.html',
})
export class ConsultaLiquidacionesComponent extends FormValidate implements OnInit, OnDestroy {

  /** Configuracion de la grilla. */
  configuracion: ConsultaLiquidacionesConfig = new ConsultaLiquidacionesConfig();

  /** Formulario de busqueda. */
  form: FormGroup; isForm: Promise<any>;
  patterns = masksPatterns;
  /** Habilita/deshabilita el exportar a excel */
  exportarDisabled;
  /** Subscripciones de la pantalla */
  subs: Subscription[] = [];
  /** Parametros d busqueda */
  paramsBusqueda: any = {};

  constructor(public formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService,
    private readonly route: ActivatedRoute,
    private readonly router: Router) {
    super(); this.initFormGroup();
  }

  ngOnInit() {
    this.subs.push(this.route.queryParams.subscribe((params) => {
      this.paramsBusqueda = params;
      if (this.paramsBusqueda.p && this.paramsBusqueda.valor && this.paramsBusqueda.tipo) {
        this.form.patchValue({
          tipoFiltro: parseInt(this.paramsBusqueda.tipo, 10),
          identificacion: this.paramsBusqueda.tipo === '1' ? this.paramsBusqueda.valor : '',
          liquidacion: this.paramsBusqueda.tipo === '2' ? this.paramsBusqueda.valor : '',
          reclamacion: this.paramsBusqueda.tipo === '3' ? this.paramsBusqueda.valor : ''
        });
        this.configuracion.gridLiquidacion.pagina = parseInt(this.paramsBusqueda.p || 0, 10);

        if (this.validarForm()) {
          this.obtenerLiquidaciones();
        }
      } else {
        this._limpiar();
      }
    }));
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  private initFormGroup() {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        tipoFiltro: new FormControl(null),
        reclamacion: new FormControl(null, [Validators.required]),
        liquidacion: new FormControl(null, [Validators.required]),
        identificacion: new FormControl(null, [Validators.required]),
      }));

    this.onChanges();
    this.form.controls.tipoFiltro.setValue(1);
  }

  private onChanges() {
    this.form.controls.tipoFiltro.valueChanges.subscribe(tipoFiltro => {
      switch (tipoFiltro) {
        case 3:
          this.form.controls.reclamacion.enable();
          this.form.controls.liquidacion.disable();
          this.form.controls.liquidacion.reset();
          this.form.controls.identificacion.disable();
          this.form.controls.identificacion.reset();
          break;
        case 2:
          this.form.controls.reclamacion.disable();
          this.form.controls.reclamacion.reset();
          this.form.controls.liquidacion.enable();
          this.form.controls.identificacion.disable();
          this.form.controls.identificacion.reset();
          break;
        case 1:
          this.form.controls.reclamacion.disable();
          this.form.controls.reclamacion.reset();
          this.form.controls.liquidacion.disable();
          this.form.controls.liquidacion.reset();
          this.form.controls.identificacion.enable();
          break;
      }
    });
  }


  onLimpiar() {
    this.router.navigate([this.router.url.split('?')[0]], {});
    this._limpiar();
  }

  _limpiar() {
    this.form.reset();
    this.initFormGroup();

    // Limpiamos el set de datos de la tabla.
    this.exportarDisabled = true;
    if (this.configuracion.gridLiquidacion.component) {
      this.configuracion.gridLiquidacion.component.limpiar();
    } else {
      this.configuracion.gridLiquidacion.datos = [];
    }

  }

  _onClickLink(e) {
    if (e.isFromMiMutual) {
      this.router.navigate([
        UrlRoute.PAGES,
        UrlRoute.CONSULTAS,
        UrlRoute.CONSULTAS_LIQUIDACIONES,
        e.codigo
      ]);
    } else {
      this.router.navigate([
        UrlRoute.PAGES,
        UrlRoute.CONSULTAS,
        UrlRoute.CONSULTAS_LIQUIDACIONES,
        e.consec,
        e.codRec,
        UrlRoute.CONSULTAS_LIQUIDACIONES_CONSULTA_LIQUIDACIONES_DETALLE_LIQUIDACION], { queryParams: this.paramsBusqueda });
    }
  }

  private validarForm() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate
        .get('global.validateForm')
        .subscribe(texto => {
          this.frontService.alert.warning(texto);
        });
      return false;
    }

    return true;
  }

  onBuscar($event) {
    if (!this.validarForm()) {
      return;
    }

    let valor;
    if (this.form.controls.tipoFiltro.value === 1) {
      valor = this.form.controls.identificacion.value;
    } else if (this.form.controls.tipoFiltro.value === 2) {
      valor = this.form.controls.liquidacion.value;
    } else if (this.form.controls.tipoFiltro.value === 3) {
      valor = this.form.controls.reclamacion.value;
    }

    this.router.navigate([this.router.url.split('?')[0]], {
      queryParams: {
        p: 0,
        valor: valor,
        tipo: this.form.controls.tipoFiltro.value,
      }
    });
  }

  obtenerLiquidaciones() {
    const liquidacionesSipasParams: any = {};
    // No paginamos los resultados y consultamos solo las liquidaciones pagadas.
    const liquidacionesMiMutualParams: any = {
      isPaged: false,
      'mimSolicitudEvento.mimEstadoSolicitudEvento.codigo': MIM_PARAMETROS.MIM_ESTADOS_SOLICITUD_EVENTO.PAGADA
    };

    if (this.form.controls.tipoFiltro.value === 1) {
      liquidacionesSipasParams.identificacion = this.form.controls.identificacion.value;
      liquidacionesMiMutualParams.identificacion = this.form.controls.identificacion.value;
    } else if (this.form.controls.tipoFiltro.value === 2) {
      liquidacionesSipasParams.numeroLiquidacion = this.form.controls.liquidacion.value;
      liquidacionesMiMutualParams.codigo = this.form.controls.liquidacion.value;
    } else if (this.form.controls.tipoFiltro.value === 3) {
      liquidacionesSipasParams.recCodigo = this.form.controls.reclamacion.value;
      liquidacionesMiMutualParams['mimSolicitudEvento.codigo'] = this.form.controls.reclamacion.value;
    }

    const liquidacionesSipasObservable = this.backService.liquidaciones.getLiquidaciones(liquidacionesSipasParams);
    const obliquidacionesMiMutualObservable = this.backService.liquidacion.getLiquidacionesEvento(liquidacionesMiMutualParams);

    forkJoin([liquidacionesSipasObservable, obliquidacionesMiMutualObservable]).subscribe((respuesta: any) => {
      this.configuracion.gridLiquidacion.component.limpiar();

      // Mezclamos los datos de ambas fuentes de datos (Sipas y MiMutual)
      const liquidacionesSipasList = respuesta[0];
      const liquidacionesMiMutualPage = respuesta[1] as Page<any>;


      // Transformamos los datos de MiMutual para que calcen con la grilla.


      // Mezclamos los datos.
      let liquidacionesList = [];
      liquidacionesList = liquidacionesList.concat(liquidacionesSipasList);

      const liquidacionesMiMutualList = liquidacionesMiMutualPage.content;
      this.transformarDatosMiMutual(liquidacionesMiMutualList);
      liquidacionesList = liquidacionesList.concat(liquidacionesMiMutualList);

      // Validamos si no hay resultados.
      if (!liquidacionesList || !liquidacionesList.length) {
        const message = 'global.noSeEncontraronRegistrosMensaje';
        this.translate
          .get(message)
          .subscribe((response: string) => {
            this.frontService.alert.info(response);
          });
        return;
      }

      // Configuramos la grilla.
      liquidacionesList.forEach(element => {
        element._asociado = `${element.asociado.nitCli} - ${element.asociado.nomCli}`;
      });

      this.configuracion.gridLiquidacion.component.cargarDatos(
        liquidacionesList,
        {
          pagina: 0,
          cantidadRegistros: liquidacionesList.length
        }
      );

    }, error => {
      this.frontService.alert.warning(error.error.message);
    });

  }

  /**
   * @description Transforma los datos consultados a MiMutual pra que calcen con las llaves definidas en la grilla.
   * TODO(alobaton): Una vez se hayan migrado a MiMutual todas las reclamaciones este metodo debe ser eliminado y
   * configurar la grilla para que trabaje con las llaves de MiMutual en lugar de las de Sipas.
   */
  private transformarDatosMiMutual(liquidacionesMiMutualList: any[]) {
    liquidacionesMiMutualList.forEach((mimLiquidacion: any) => {
      // Indicamos que la solicitud evento viene de MiMutual.
      mimLiquidacion.isFromMiMutual = true;
      mimLiquidacion.codRec = mimLiquidacion.mimSolicitudEvento.codigo;
      mimLiquidacion.consec = mimLiquidacion.codigo;
      mimLiquidacion.fecApl = mimLiquidacion.fechaPago;
      mimLiquidacion.nomEstPago = mimLiquidacion.mimSolicitudEvento.mimEstadoSolicitudEvento.nombre;
      mimLiquidacion.nomFormaPago = mimLiquidacion.mimSolicitudEvento.mimFormaPago.nombre;
      mimLiquidacion.nomTipAux = mimLiquidacion.mimSolicitudEvento.mimEvento.nombre;
    });
  }

}
