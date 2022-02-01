import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FormValidate } from '@shared/util';
import { DateUtil } from '@shared/util/date.util';
import { FileUtils } from '@shared/util/file.util';
import { masksPatterns } from '@shared/util/masks.util';
import { ObjectUtil } from '@shared/util/object.util';
import { Subscription } from 'rxjs';
import { ConsultaPagosConfig } from './consulta-pagos.config';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-consulta-pagos',
  templateUrl: './consulta-pagos.component.html'
})
export class ConsultaPagosComponent extends FormValidate implements OnInit, OnDestroy {

  configuracion: ConsultaPagosConfig = new ConsultaPagosConfig();
  form: FormGroup;
  isForm: Promise<any>;
  exportarDisabled = true;
  patterns = masksPatterns;
  params: any;
  subs: Subscription[] = [];


  constructor(
    public formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    super();
    this.initFormGroup();
  }

  ngOnInit() {
    this.subs.push(this.route.queryParams.subscribe((params) => {
      this.validarParametros(params);
    }));
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  private initFormGroup() {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        tipoFiltro: new FormControl(null),
        liquidacion: new FormControl(null, [Validators.required]),
        identificacion: new FormControl(null, [Validators.required]),
        nombre: new FormControl(null, [Validators.required])
      }));

    this.onChanges();
    this.form.controls.tipoFiltro.setValue(1);
  }

  private onChanges() {
    this.form.controls.tipoFiltro.valueChanges.subscribe(tipoFiltro => {
      switch (tipoFiltro) {
        case 1:
          this.form.controls.liquidacion.enable();
          this.form.controls.identificacion.disable();
          this.form.controls.identificacion.reset();
          this.form.controls.nombre.disable();
          this.form.controls.nombre.reset();
          break;
        case 2:
          this.form.controls.liquidacion.disable();
          this.form.controls.liquidacion.reset();
          this.form.controls.identificacion.enable();
          this.form.controls.nombre.disable();
          this.form.controls.nombre.reset();
          break;
        case 3:
          this.form.controls.liquidacion.disable();
          this.form.controls.liquidacion.reset();
          this.form.controls.identificacion.disable();
          this.form.controls.identificacion.reset();
          this.form.controls.nombre.enable();
          break;
      }
    });
  }

  private validarParametros(params) {
    if (params.valor && params.tipo) {
      this.form.patchValue({
        tipoFiltro: parseInt(params.tipo, 10),
        liquidacion: params.tipo === '1' ? params.valor : '',
        identificacion: params.tipo === '2' ? params.valor : '',
        nombre: params.tipo === '3' ? params.valor : '',
      });

      this.configuracion.gridPagos.pagina = parseInt(params.p || 0, 10);

      if (this.validarForm()) {
        this.obtenerLiquidaciones();
      } else {
        this.limpiar();
      }
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

    const queryParams: any = { tipo: this.form.controls.tipoFiltro.value };

    if (queryParams.tipo === 1) {
      queryParams.valor = this.form.controls.liquidacion.value;
    } else if (queryParams.tipo === 2) {
      queryParams.valor = this.form.controls.identificacion.value;
    } else {
      queryParams.valor = this.form.controls.nombre.value;
    }

    this.router.navigate([this.router.url.split('?')[0]], {
      queryParams: queryParams
    });
  }

  onLimpiar($event?) {
    this.router.navigate([this.router.url.split('?')[0]], {});
    this.limpiar();
  }

  private limpiar() {
    this.form.reset();
    this.initFormGroup();

    // Limpiamos el set de datos de la tabla.
    this.params = {};
    this.exportarDisabled = true;
    if (this.configuracion.gridPagos.component) {
      this.configuracion.gridPagos.component.limpiar();
    } else {
      this.configuracion.gridPagos.datos = [];
    }
  }

  obtenerLiquidaciones() {
    const params = {
      isMerged: true,
      isPaged: false,
      sort: 'sipintliqPK.fecApl,desc'
    } as any;

    switch (this.form.controls.tipoFiltro.value) {
      case 1:
        params['consecutivo'] = this.form.controls.liquidacion.value;
        break;
      case 2:
        params['sipintliqPK.nitBen'] = this.form.controls.identificacion.value;
        break;
      case 3:
        params.nombreBeneficiarioPago = this.form.controls.nombre.value.replace(' ', '%');
        break;
    }

    // Limpiamos la grilla.
    if (this.configuracion.gridPagos.component) {
      this.configuracion.gridPagos.component.limpiar();
    } else {
      this.configuracion.gridPagos.datos = [];
    }

    this.exportarDisabled = true;
    this.backService.sipintliq.buscar(params).subscribe((respuesta: any) => {

      // Validamos si hay datos.
      if (!respuesta.content || respuesta.content.length === 0) {
        this.translate.get('global.noSeEncontraronRegistrosMensaje').subscribe((response: any) => {
          this.frontService.alert.info(response);
        });

        return;
      }

      this.transformarDatos(respuesta.content);

      this.params = params;
      this.exportarDisabled = false;
      this.configuracion.gridPagos.component.cargarDatos(
        respuesta.content
      );
    }, (error) => {
      this.frontService.alert.warning(error.error.message);
    });
  }

  private transformarDatos(sipintliqList: any[]) {
    sipintliqList.forEach((sipintliq, index) => {

      let mimFormaPago;
      if (sipintliq.fromMiMutual && sipintliq.mimLiquidacion !== null && sipintliq.mimLiquidacion !== undefined) {
        mimFormaPago = sipintliq.mimLiquidacion.mimSolicitudEvento.mimFormaPago;
      } else {
        mimFormaPago = sipintliq.sipLiquidaciones ? sipintliq.sipLiquidaciones.mimFormaPago : null;
      }

      if (mimFormaPago) {
        let _descripcionDestino;
        switch (mimFormaPago.codigo) {
          case MIM_PARAMETROS.MIM_FORMA_PAGO.CHEQUE:
            _descripcionDestino = sipintliq.agcCobName;
            break;
          case MIM_PARAMETROS.MIM_FORMA_PAGO.DEPOSITOS:
            _descripcionDestino = sipintliq.nroCta;
            break;
          default:
            _descripcionDestino = '';
            break;
        }
        sipintliq.destino = `${mimFormaPago.nombre} - (${_descripcionDestino})`;
      }

      sipintliq.indice = index + 1;
      sipintliq.regionalAso =  sipintliq.asociado ? sipintliq.asociado.regionalAso : null;
      sipintliq.zonaAso = sipintliq.asociado ? sipintliq.asociado.zonaAso : null;
    });
  }

  onExportar($event) {
    // Validamos si hay datos en la grilla antes de exportar a excel.
    if (
      !this.configuracion.gridPagos.component ||
      !this.configuracion.gridPagos.component.hayDatos()
    ) {
      return;
    }

    this.params.exportar = true;
    this.backService.sipintliq.buscar(this.params).subscribe((respuesta: any) => {
      const headers: string[] = [
        'consultas.consultaPagos.excel.numeroEvento',
        'consultas.consultaPagos.excel.identificacion',
        'consultas.consultaPagos.excel.nombreBeneficiarioPago',
        'consultas.consultaPagos.excel.auxilioPagado',
        'consultas.consultaPagos.excel.fechaPago',
        'consultas.consultaPagos.excel.destino',
        'consultas.consultaPagos.excel.valorPagado',
        'consultas.consultaPagos.excel.valorRetenido',
        'consultas.consultaPagos.excel.valorDeducido',
        'consultas.consultaPagos.excel.valorNeto',
        'global.status',
        'consultas.consultaPagos.excel.regional',
        'consultas.consultaPagos.excel.zonaAsociado',
        'global.observations',
        'consultas.consultaPagos.excel.numeroLiquidacion',
        'consultas.consultaPagos.excel.consecutivoGiro',
        'consultas.consultaPagos.excel.numero'
      ];
      ObjectUtil.traducirObjeto(headers, this.translate);

      const columnas: string[] = [
        'codRec',
        'nitBen',
        'nomBen',
        'codAux',
        'fecApl',
        'destino',
        'vlrPag',
        'vlrRte',
        'vlrMul',
        'vlrNet',
        'nomRet',
        'regionalAso',
        'zonaAso',
        'observaciones',
        'consec',
        'conGir',
        'indice',
      ];

      this.transformarDatos(respuesta.content);
      const datos = respuesta.content;

      this.exportarExcel(
        `Reporte_Pagos_${DateUtil.dateToString(new Date())}`,
        {
          headers,
          columnas,
          datos
        }
      );
    });
  }

  private exportarExcel(nombre, datos: any = {}) {
    this.backService.utilidades.exportarExcel2(nombre, datos).subscribe(respuesta => {
      const body: any = respuesta.body;
      FileUtils.downloadXlsFile(body, nombre);
    }, (err: any) => {
      this.frontService.alert.error(err.error.message);
    });
  }
}
