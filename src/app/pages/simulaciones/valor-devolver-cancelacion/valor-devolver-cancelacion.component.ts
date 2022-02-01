import { PercentPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '@core/store/reducers';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ReportParams } from '@shared/models/report-params.model';
import { CustomCurrencyPipe } from '@shared/pipes/custom-currency.pipe';
import { UrlRoute } from '@shared/static/urls/url-route';
import { DateUtil } from '@shared/util/date.util';
import { FileUtils } from '@shared/util/file.util';
import { ObjectUtil } from '@shared/util/object.util';
import { Subscription } from 'rxjs';
import { parameters } from '../models/parameter';
import { ValorDevolverCancelarConfig } from './valor-devolver-cancelacion.config';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-valor-devolver-cancelacion',
  templateUrl: './valor-devolver-cancelacion.component.html',
})
export class ValorDevolverCancelacionComponent implements OnInit, OnDestroy {

  configuracionCancelacion: ValorDevolverCancelarConfig = new ValorDevolverCancelarConfig();
  _subs: Subscription[] = [];
  id: any = 'mimValoresDevolverCancelacion';
  objectLeftItems: any = [];
  objectoValoresDevolver: any;
  datosAsociado: any;
  valorRescate: any;
  valoresDevolver: any;

  constructor(
    private readonly customCurrencyPipe: CustomCurrencyPipe,
    private readonly customCurrencyPercentaje: PercentPipe,
    private readonly store: Store<AppState>,
    private readonly translate: TranslateService,
    private readonly router: Router,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService) { }
  ngOnDestroy(): void {
    this._subs.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
    this._subs = undefined;
  }

  ngOnInit() {
    this._subs.push(this.store.select('simulacionesUI')
      .subscribe(ui => {
        if (!ui || !ui.mimValoresDevolver || !ui.mimDatosAsociados) {
          this.router.navigate([
            UrlRoute.PAGES,
            UrlRoute.SIMULACIONES,
            UrlRoute.VALOR_DEVOLVER
          ]);
          return;
        }
        this.objectoValoresDevolver = ui.mimValoresDevolver;
        this.datosAsociado = ui.mimDatosAsociados;
        this.backService.valorDevolver.obtenerDetalleValoresDevolver(ui.mimDatosAsociados.numeroAsociado,
          ui.mimValoresDevolver.concepto).subscribe(response => {
            if (response.ValRescateDev.length > 0) {
              this.valoresDevolver = ui.mimValoresDevolver;
              this.valorRescate = response.ValRescateDev;
              const datos = this.formatArray(response.ValRescateDev, ui.mimValoresDevolver);
              this.configuracionCancelacion.gridValorDevolverCancelar.tamano = datos.length;
            } else {
              if (!response || !response.length && ui.mimValoresDevolverCancelacion.estadoBoton) {
                this.translate.get('global.noSeEncontraronRegistrosMensaje').subscribe((response: string) => {
                  this.frontService.alert.info(response);
                });
                return;
              }
            }
          });
      }));
  }

  private formatArray(array: any, objectoValorDevolver: any) {
    let objectTable = [];
    let titles = [
      'simulaciones.valorDevolver.gridDetalle.valorProteccionActualVida',
      'simulaciones.valorDevolver.gridDetalle.valorTotalApartadoVida',
      'simulaciones.valorDevolver.gridDetalle.valorReservaMatematica',
      'simulaciones.valorDevolver.gridDetalle.valorAnualidadVida',
      'simulaciones.valorDevolver.gridDetalle.valorRescateVida',
      'simulaciones.valorDevolver.gridDetalle.valorProteccionActual',
      'simulaciones.valorDevolver.gridDetalle.valorTotalApartado',
      'simulaciones.valorDevolver.gridDetalle.numeroCuotasPagas',
      'simulaciones.valorDevolver.gridDetalle.porcentajeDevolucion',
      'simulaciones.valorDevolver.gridDetalle.porcentajeRentabilidad',
      'simulaciones.valorDevolver.gridDetalle.porcentajePerseverancia',
      'simulaciones.valorDevolver.gridDetalle.valorRescate',
      'simulaciones.valorDevolver.gridDetalle.valorAportadoPerseveranciaMuerte',
      'simulaciones.valorDevolver.gridDetalle.porcentajeGastosAdministrativos',
      'simulaciones.valorDevolver.gridDetalle.edadSolicitud',
      'simulaciones.valorDevolver.gridDetalle.plazo'
    ];
    ObjectUtil.traducirObjeto(titles, this.translate);
    array.forEach(element => {
      this.objectLeftItems.push({ 'label': `${objectoValorDevolver.descripcion} - Valor total devolución`, 'value': this.customCurrencyPipe.transform(element.valorDevolucion), 'bold': true });
      switch (this.objectoValoresDevolver.tipoPlan) {
        case 3:
          this.objectLeftItems.push({ 'label': titles[5], 'value': this.customCurrencyPipe.transform(element.valorProteccionActualPersev) });
          this.objectLeftItems.push({ 'label': titles[6], 'value': this.customCurrencyPipe.transform(element.valorAportadoPersev) });
          this.objectLeftItems.push({ 'label': titles[9], 'value': element.porcentajeRent !== null ? `${this.replacePuntoComa(element.porcentajeRent)}%` : '-' });
          this.objectLeftItems.push({ 'label': titles[10], 'value': element.porcentajePersev !== null ? `${this.replacePuntoComa(element.porcentajePersev)}%` : '-' });
          this.objectLeftItems.push({ 'label': titles[11], 'value': this.customCurrencyPipe.transform(element.valorRescatePersev) });
          break;
        case 2:
          this.objectLeftItems.push({ 'label': titles[5], 'value': this.customCurrencyPipe.transform(element.valorProteccionActualPersev) });
          this.objectLeftItems.push({ 'label': titles[6], 'value': this.customCurrencyPipe.transform(element.valorAportadoPersev) });
          this.objectLeftItems.push({ 'label': titles[7], 'value': element.numCuoPag !== null ? element.numCuoPag : '-' });
          this.objectLeftItems.push({ 'label': titles[8], 'value': element.porcentajeDevolucion !== null ? `${this.replacePuntoComa(String(this.customCurrencyPercentaje.transform(element.porcentajeDevolucion)))}` : '-' });
          break;
        case 4:
          this.objectLeftItems.push({ 'label': titles[5], 'value': this.customCurrencyPipe.transform(element.valorProteccionActualPersev) });
          this.objectLeftItems.push({ 'label': titles[6], 'value': this.customCurrencyPipe.transform(element.valorAportadoPersev) });
          this.objectLeftItems.push({ 'label': titles[12], 'value': this.customCurrencyPipe.transform(element.valorAportPersevMuerte) });
          this.objectLeftItems.push({ 'label': titles[13], 'value': element.porcentajeAdm !== null ? `${this.replacePuntoComa(element.porcentajeAdm)}%` : '-' });
          this.objectLeftItems.push({ 'label': titles[9], 'value': element.porcentajeRent !== null ? `${this.replacePuntoComa(element.porcentajeRent)}%` : '-' });
          this.objectLeftItems.push({ 'label': titles[7], 'value': element.numCuoPag !== null ? element.numCuoPag : '-' });
          this.objectLeftItems.push({ 'label': titles[14], 'value': element.edadSolicitud !== null ? element.edadSolicitud : '-' });
          this.objectLeftItems.push({ 'label': titles[15], 'value': element.planSolvencia !== null ? element.planSolvencia : '' });
          break;
        case 1:
          this.objectLeftItems.push({ 'label': titles[0], 'value': this.customCurrencyPipe.transform(element.valorProteccionVida) });
          this.objectLeftItems.push({ 'label': titles[1], 'value': this.customCurrencyPipe.transform(element.valorAportadoVida) });
          this.objectLeftItems.push({ 'label': titles[2], 'value': this.customCurrencyPipe.transform(element.valorReservMatVida) });
          this.objectLeftItems.push({ 'label': titles[3], 'value': this.customCurrencyPipe.transform(element.anualidadVida) });
          this.objectLeftItems.push({ 'label': titles[4], 'value': this.customCurrencyPipe.transform(element.valorRescateVida) });
          this.objectLeftItems.push({ 'label': '', 'value': '' });
          this.objectLeftItems.push({ 'label': titles[5], 'value': this.customCurrencyPipe.transform(element.valorProteccionActualPersev) });
          this.objectLeftItems.push({ 'label': titles[6], 'value': this.customCurrencyPipe.transform(element.valorAportadoPersev) });
          this.objectLeftItems.push({ 'label': titles[9], 'value': element.porcentajeRent !== null ? `${this.replacePuntoComa(element.porcentajeRent)}%` : '-' });
          this.objectLeftItems.push({ 'label': titles[10], 'value': element.porcentajePersev !== null ? `${this.replacePuntoComa(element.porcentajePersev)}%` : '-' });
          this.objectLeftItems.push({ 'label': titles[11], 'value': this.customCurrencyPipe.transform(element.valorRescatePersev) });
          break;

        default:
          break;
      }
    });
    return objectTable;
  }

  generarPdf() {
    let objectoPdf = new ReportParams();
    objectoPdf.nombre = `${DateUtil.dateToString(new Date(), 'ddMMyyyy')}_Valores a devolver_Asociado`;
    objectoPdf.parameters = this.valueParams();
    this.backService.utilidades.generarJasper('pdf', 'valores_devolver', objectoPdf).subscribe(resp => {
      const body: any = resp.body;
      FileUtils.downloadPdfFile(body, objectoPdf.nombre);
    });
  }

  private valueParams() {
    let titles = [
      'simulaciones.valorDevolver.gridDetalle.valorProteccionActualVida',
      'simulaciones.valorDevolver.gridDetalle.valorTotalApartadoVida',
      'simulaciones.valorDevolver.gridDetalle.valorReservaMatematica',
      'simulaciones.valorDevolver.gridDetalle.valorAnualidadVida',
      'simulaciones.valorDevolver.gridDetalle.valorRescateVida',
      'simulaciones.valorDevolver.gridDetalle.valorProteccionActual',
      'simulaciones.valorDevolver.gridDetalle.valorTotalApartado',
      'simulaciones.valorDevolver.gridDetalle.numeroCuotasPagas',
      'simulaciones.valorDevolver.gridDetalle.porcentajeDevolucion',
      'simulaciones.valorDevolver.gridDetalle.porcentajeRentabilidad',
      'simulaciones.valorDevolver.gridDetalle.porcentajePerseverancia',
      'simulaciones.valorDevolver.gridDetalle.valorRescate',
      'simulaciones.valorDevolver.gridDetalle.valorAportadoPerseveranciaMuerte',
      'simulaciones.valorDevolver.gridDetalle.porcentajeGastosAdministrativos',
      'simulaciones.valorDevolver.gridDetalle.edadSolicitud',
      'simulaciones.valorDevolver.gridDetalle.plazo'
    ];
    ObjectUtil.traducirObjeto(titles, this.translate);
    let params = new parameters();
    this.valorRescate.forEach(element => {
      params.tituloReporte = `Valores a devolver asociado`;
      params.fechaGeneracion = DateUtil.dateToString(new Date(), 'dd/MM/yyyy');
      params.tipoPlan = Number(this.objectoValoresDevolver.tipoPlan);
      params.identificacionAsociado = this.datosAsociado.nitCli;
      params.nombreAsociado = this.datosAsociado.nomCli;
      params.nivelRiesgo = String(this.datosAsociado.nivelRiesgo);
      params.estado = this.datosAsociado.desEstado;
      params.edadIngreso = String(this.datosAsociado.edadIng);
      params.edadActual = String(this.datosAsociado.edadAct);
      params.fechaIngreso = this.datosAsociado.fecIngreso;
      params.fechaNacimiento = this.datosAsociado.fecNac;
      params.regional = this.datosAsociado.regionalAso;
      params.oficinaVinculacion = this.datosAsociado.desOficina;
      params.nombrePlan = `${this.valoresDevolver.descripcion} - Valor total devolución`;
      params.valorPlan = this.customCurrencyPipe.transform(element.valorDevolucion);
      params.proteccionVida = titles[0];
      params.valorProteccionVida = this.customCurrencyPipe.transform(element.valorProteccionVida);
      params.totalAportadoVida = titles[1];
      params.valorTotalAportadoVida = this.customCurrencyPipe.transform(element.valorAportadoVida);
      params.reservaMatematica = titles[2];
      params.valorReservaMate = this.customCurrencyPipe.transform(element.valorReservMatVida);
      params.anualidadVida = titles[3];
      params.valorAnualidadVida = this.customCurrencyPipe.transform(element.anualidadVida);
      params.rescateVida = titles[4];
      params.valorRescateVida = this.customCurrencyPipe.transform(element.valorRescateVida);
      params.proteccionActualPerse = titles[5];
      params.valorproteccionActualPerse = this.customCurrencyPipe.transform(element.valorProteccionActualPersev);
      params.totalAportadoPerse = titles[6];
      params.valorTotalAportadoPerse = this.customCurrencyPipe.transform(element.valorAportadoPersev);
      params.textoValorAportPersevMuerte = titles[12];
      params.valorAportPersevMuerte = this.customCurrencyPipe.transform(element.valorAportPersevMuerte);
      params.textoPorcentajeAdm = titles[13];
      params.porcentajeAdm = element.porcentajeAdm !== null ? `${this.replacePuntoComa(element.porcentajeAdm)}%` : '-';
      params.numeroCuota = titles[7];
      params.numCuoPag = element.numCuoPag !== null ? element.numCuoPag : '-';
      params.textoEdadSolicitud = titles[14];
      params.edadSolicitud = element.edadSolicitud !== null ? element.edadSolicitud : '-';
      params.textoPlanSolvencia = titles[15];
      params.planSolvencia = element.planSolvencia !== null ? element.planSolvencia : '-';
      params.textoporcentajeDevolucion = titles[8];
      params.porcentajeDevolucion = element.porcentajeDevolucion !== null ? `${this.replacePuntoComa(String(this.customCurrencyPercentaje.transform(element.porcentajeDevolucion)))}` : '-';
      params.procentajeRentabilidad = titles[9];
      params.valorProcentajeRentabilidad = element.porcentajeRent !== null ? `${this.replacePuntoComa(element.porcentajeRent)}%` : '-';
      params.porcentajePerseverancia = titles[10];
      params.valorPorcentajePerseverancia = element.porcentajePersev !== null ? `${this.replacePuntoComa(element.porcentajePersev)}%` : '-';
      params.rescatePerseverancia = titles[11];
      params.valorRescatePerseverancia = this.customCurrencyPipe.transform(element.valorRescatePersev);
    });
    return params;
  }

  replacePuntoComa(params: any) {
    return params.replace('.', ',');
  }

}
