import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { DetalleLiquidacionConfig } from './detalle-liquidacion.config';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SIP_PARAMETROS_TIPO } from '@shared/static/constantes/sip-parametros-tipo';
import { SIP_TIPO_AUXILIOS } from '@shared/static/constantes/sip-tipo-auxilios';
import { MimDeduccionesCardItemConfig } from '@shared/components/mim-deducciones-card/mim-deducciones-card.component';
import { ReportParams, ReportConfiguration } from '@shared/models/report-params.model';
import { FileUtils } from '@shared/util/file.util';
import { Location } from '@angular/common';
import { ObjectUtil } from '@shared/util/object.util';
import { DateUtil } from '@shared/util/date.util';
import { GENERALES } from '@shared/static/constantes/constantes';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-detalle-liquidacion',
  templateUrl: './detalle-liquidacion.component.html',
  styleUrls: ['./detalle-liquidacion.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DetalleLiquidacionComponent implements OnInit, OnDestroy {
  paramsBuscar: any;
  subs: Subscription[] = [];
  numeroLiquidacion: string;
  numeroReclamacion: string;
  configuracion: DetalleLiquidacionConfig = new DetalleLiquidacionConfig();
  tiposContrato: any;
  detalleLiquidacion: any;
  formaPagoGiro = SIP_PARAMETROS_TIPO.TIPO_FORMAS_PAGO.SIP_PARAMETROS.GIRO;
  formaPagoDeposito = SIP_PARAMETROS_TIPO.TIPO_FORMAS_PAGO.SIP_PARAMETROS.DEPOSITOS;
  formaPagoDistribuda = SIP_PARAMETROS_TIPO.TIPO_FORMAS_PAGO.SIP_PARAMETROS.DISTRIBUIDA;
  formaPagoDistribudaRentas = SIP_PARAMETROS_TIPO.TIPO_FORMAS_PAGO.SIP_PARAMETROS.DISTRIBUIDA_RENTAS;

  constructor(private readonly translate: TranslateService,
    private readonly route: ActivatedRoute,
    private readonly location: Location,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService) { }


  ngOnInit() {
    this.subs.push(this.route.queryParams.subscribe((params) => {
      this.paramsBuscar = params;
    }));
    this.subs.push(this.route.params.subscribe(params => {
      this.numeroReclamacion = params.numeroReclamacion;
      this.numeroLiquidacion = params.numeroLiquidacion;

      // Obtenemos la informacion necesaria para la pantalla.
      this.getDetalleLiquidacion();
    })
    );
  }

  ngOnDestroy() {
    this.subs.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  getDetalleLiquidacion() {
    const that = this;
    this.backService.liquidaciones.getDetalleLiquidacion(this.numeroLiquidacion, { numeroReclamacion: this.numeroReclamacion })
      .subscribe(async (_detalleLiquidacion: any) => {
        this.detalleLiquidacion = _detalleLiquidacion;
        // Configuracion abono a credito.
        this.configuracion.mostrarAbonoCredito = this.detalleLiquidacion.liquidacionCrediSolidarioList &&
          this.detalleLiquidacion.liquidacionCrediSolidarioList.length > 0;
        if (this.configuracion.mostrarAbonoCredito) {
          this.configuracion.configuracionAccordionAbonoCredito.title = 'liquidaciones.detalleLiquidacion.abonoCredito.title';
          this.configuracion.configuracionAccordionAbonoCredito.collapsable = true;

          this.configuracion.configuracionAccordionAbonoCredito.description =
            this.configuracion.mostrarAbonoCredito ?
              'global.si' : 'global.no';

          this.detalleLiquidacion.liquidacionCrediSolidarioList.forEach((abonoACredito: any) => {
            abonoACredito._numeroPagare = abonoACredito.sipLiquidacionCredisolidarioPK.creNroPagare;
          });

          setTimeout(function () {
            that.configuracion.gridAbonoCredito.component.cargarDatos(that.detalleLiquidacion.liquidacionCrediSolidarioList);
          });
        }

        // Configuracion forma de pago.
        this.configuracion.configuracionAccordionFormaPago.title = 'liquidaciones.detalleLiquidacion.formaPago';
        this.configuracion.configuracionAccordionFormaPago.description = this.detalleLiquidacion.nombreFormaPago;
        switch (this.detalleLiquidacion.formaPago) {
          case SIP_PARAMETROS_TIPO.TIPO_FORMAS_PAGO.SIP_PARAMETROS.GIRO:
            this.configuracion.configuracionAccordionFormaPago.collapsable = true;
            this.configuracion.configuracionFormPago = [
              {
                titulo: 'liquidaciones.detalleLiquidacion.formaPagoGiro.detalle.agenciaCobro',
                valor: this.detalleLiquidacion.nombreAgenciaCobro
              }
            ];
            break;

          case SIP_PARAMETROS_TIPO.TIPO_FORMAS_PAGO.SIP_PARAMETROS.DEPOSITOS:
            this.configuracion.configuracionAccordionFormaPago.collapsable = true;
            this.configuracion.configuracionFormPago = [
              {
                titulo: 'liquidaciones.detalleLiquidacion.formaPagoDeposito.detalle.noCuenta',
                valor: this.detalleLiquidacion.numeroCuenta
              },
              {
                titulo: 'liquidaciones.detalleLiquidacion.formaPagoDeposito.detalle.banco',
                valor: this.detalleLiquidacion.nombreBanco
              },
              {
                titulo: 'liquidaciones.detalleLiquidacion.formaPagoDeposito.detalle.sucursal',
                valor: this.detalleLiquidacion.nombreSucursal
              }
            ];
            break;

          default:
            break;
        }

        // Configuramos el apartado de forma de pago distribucion.
        this.configuracion.mostrarFormaPagoDistribucion = this.detalleLiquidacion.mostrarDetalleLiquidacionHijasList;
        if (this.configuracion.mostrarFormaPagoDistribucion) {
          if (this.detalleLiquidacion.formaPago === SIP_PARAMETROS_TIPO.TIPO_FORMAS_PAGO.SIP_PARAMETROS.DISTRIBUIDA_RENTAS) {
            // Configuramos la columna de numero de rentas.
            this.configuracion.gridFormaPagoDistribucion.columnas.unshift({
              key: '_numeroRentas',
              titulo: 'liquidaciones.detalleLiquidacion.formaPagoDistribuida.detalle.noRentas',
              configCelda: {
                width: 100
              }
            });

            this.detalleLiquidacion.detalleLiquidacionHijasList.forEach((liquidacionHija: any) => {
              liquidacionHija._numeroRentas = liquidacionHija.numeroRentasList.join('-');

              switch (liquidacionHija.formaPago) {
                case SIP_PARAMETROS_TIPO.TIPO_FORMAS_PAGO.SIP_PARAMETROS.GIRO:
                  liquidacionHija._formaPago = liquidacionHija.nombreAgenciaCobro;
                  break;
                case SIP_PARAMETROS_TIPO.TIPO_FORMAS_PAGO.SIP_PARAMETROS.DEPOSITOS:
                  liquidacionHija._formaPago = liquidacionHija.numeroCuenta;
                  break;
              }
            });
          } else {
            // Configuramos la columna de beneficiario.
            this.configuracion.gridFormaPagoDistribucion.columnas.unshift({
              key: '_beneficiario',
              titulo: 'liquidaciones.detalleLiquidacion.formaPagoDistribuida.detalle.beneficiario',
              configCelda: {
                width: 180
              }
            });

            this.detalleLiquidacion.detalleLiquidacionHijasList.forEach((liquidacionHija: any) => {
              liquidacionHija._beneficiario = (liquidacionHija.nitBen || '') + ' - ' + (liquidacionHija.nomBen || '');

              switch (liquidacionHija.formaPago) {
                case SIP_PARAMETROS_TIPO.TIPO_FORMAS_PAGO.SIP_PARAMETROS.GIRO:
                  liquidacionHija._formaPago = liquidacionHija.nombreAgenciaCobro;
                  break;
                case SIP_PARAMETROS_TIPO.TIPO_FORMAS_PAGO.SIP_PARAMETROS.DEPOSITOS:
                  liquidacionHija._formaPago = liquidacionHija.numeroCuenta;
                  break;
              }
            });
          }

          this.configuracion.configuracionAccordionFormaPago.collapsable = this.detalleLiquidacion.formaPago !== SIP_PARAMETROS_TIPO.TIPO_FORMAS_PAGO.SIP_PARAMETROS.DISTRIBUIDA
            && this.detalleLiquidacion.formaPago !== SIP_PARAMETROS_TIPO.TIPO_FORMAS_PAGO.SIP_PARAMETROS.DISTRIBUIDA_RENTAS;
          setTimeout(() => {
            that.configuracion.gridFormaPagoDistribucion.component.cargarDatos(
              that.detalleLiquidacion.detalleLiquidacionHijasList,
              {
                cantidadRegistros: that.detalleLiquidacion.detalleLiquidacionHijasList.length
              });
          });
        }

        // Configuramos el detalle de las coberturas.
        this.configurarCoberturasDetalleLiquidacion(this.detalleLiquidacion);

        // No se muestra el detalle de deducciones si se trata de una forma de pago distribuida.
        if (!this.configuracion.mostrarFormaPagoDistribucion) {
          // Configuramos las deducciones.
          this.configuracion.deduccionesCard.subtotal = this.detalleLiquidacion.vlrDeducciones;
          this.configuracion.deduccionesCard.total = this.detalleLiquidacion.vlrNetoPago;
          this.configuracion.deduccionesCard.leftItems.forEach((leftItem: MimDeduccionesCardItemConfig) => {
            if (leftItem.key === 'vlrFactura') {
              leftItem.labelParams = {
                numeroFactura: this.detalleLiquidacion.numeroFactura || ''
              };
            }
          });

          if (this.detalleLiquidacion.mostrarRendimiento) {
            this.configuracion.deduccionesCard.rightItems.unshift(
              {
                label: 'liquidaciones.detalleLiquidacion.cardTotalNeto.rendimiento',
                key: 'rendimiento',
                tipo: 'currency'
              }
            );
          }

          setTimeout(function () {
            that.configuracion.deduccionesCard.component.cargarDatos(that.detalleLiquidacion);
          });
        }

        // Configuracion observaciones.
        this.configuracion.mostrarObservaciones = this.detalleLiquidacion.mostrarObservaciones;
        this.configuracion.observaciones = this.detalleLiquidacion.observaciones;

        // Configura el codigo de reclamacion para obtener informacion del asociado,
        // de la liquidacion y reclamacion.
        this.getReclamacion(this.numeroReclamacion || this.detalleLiquidacion.codReclamacion);
      }, err => {
        this.frontService.alert.error(err.error.message).then(() => this.location.back());
      });
  }

  configurarCoberturasDetalleLiquidacion(detalleLiquidacion: any) {
    const coberturasDetalleLiquidacionList = detalleLiquidacion.coberturasDetalleLiquidacionList;

    if (!coberturasDetalleLiquidacionList || coberturasDetalleLiquidacionList.length === 0) {
      return;
    }

    this.configuracion.totalPago = 0;
    coberturasDetalleLiquidacionList.forEach((cobertura: any) => {
      cobertura._nombreCobertura = `${cobertura.auxNombre || ''} - ${cobertura.prodDescripcion || ''}`;
      cobertura._reconocido = `${cobertura.tipoReconocimiento === 0 ?
        '' :
        cobertura.reconocido || '0'}  ${cobertura.tipoReconocimientoNombreCorto || ''}`;
    });

    this.configuracion.totalPago = detalleLiquidacion.totalPagado;

    const that = this;
    setTimeout(function () {
      that.configuracion.gridCoberturas.component.cargarDatos(coberturasDetalleLiquidacionList);
    });
  }

  private getReclamacion(numeroReclamacion: string) {
    let reclamacion: any;
    // Obtenemos informacion de la reclamacion.
    this.backService.reclamaciones.getReclamacion(numeroReclamacion).subscribe((_reclamacion: any) => {
      reclamacion = _reclamacion;

      this.configuracion.datosAsociado.title = this.detalleLiquidacion.asociado.nomCli;
      // Configuaramos la informacion.
      this.configuracion.datosAsociado.items = [
        {
          label: 'liquidaciones.detalleLiquidacion.datosAsociado.nombre',
          key: 'nomCli',
          value: this.detalleLiquidacion.asociado.nomCli
        },
        {
          label: 'liquidaciones.detalleLiquidacion.datosAsociado.identificacion',
          key: 'nitCli',
          value: this.detalleLiquidacion.asociado.nitCli
        },
        {
          label: 'liquidaciones.detalleLiquidacion.datosAsociado.tipoAuxilio',
          value: this.detalleLiquidacion.nomTipAux
        },
        {
          label: 'liquidaciones.detalleLiquidacion.datosAsociado.noReclamacion',
          value: reclamacion.recCodigo
        },
        {
          label: 'liquidaciones.detalleLiquidacion.datosAsociado.noLiquidacion',
          value: this.detalleLiquidacion.consecLiquidacion
        },
        {
          label: 'liquidaciones.detalleLiquidacion.datosAsociado.fechaEevento',
          value: reclamacion.recFechaEvento
        },
        {
          label: 'liquidaciones.detalleLiquidacion.datosAsociado.fechaReclamacion',
          value: reclamacion.recFechaReclamacion
        }
      ];

      // Solo si NO es de tipo distribuida y distribuida rentas mostramos la fecha de pago.
      if (SIP_PARAMETROS_TIPO.TIPO_FORMAS_PAGO.SIP_PARAMETROS.DISTRIBUIDA !== this.detalleLiquidacion.formaPago
        && SIP_PARAMETROS_TIPO.TIPO_FORMAS_PAGO.SIP_PARAMETROS.DISTRIBUIDA_RENTAS !== this.detalleLiquidacion.formaPago) {
        this.configuracion.datosAsociado.items.push(
          {
            label: 'liquidaciones.detalleLiquidacion.datosAsociado.fechaPago',
            value: this.detalleLiquidacion.fecApl
          }
        );
      }

      // Informamos el tipo de contrato y la empresa solo si se trata de auxilio de desempleo
      // o diminucion de ingresos.
      const tipoAuxilios = [SIP_TIPO_AUXILIOS.DESEMPLEO_DEPENDIENTE.TIP_ID,
      SIP_TIPO_AUXILIOS.DISMINUCION_INGRESOS_INDEPENDIENTE.TIP_ID];
      if (tipoAuxilios.indexOf(this.detalleLiquidacion.codTipAux) !== -1) {
        // Obtenemos informacion del detalle de reclamacion.
        this.backService.detalleReclamaciones.obtenerDetalleReclamaciones({
          recCodigo: numeroReclamacion
        }).subscribe((detalleReclamaciones: any) => {
          let detalleReclamacion;
          if (detalleReclamaciones && detalleReclamaciones.content && detalleReclamaciones.content.length > 0) {
            detalleReclamacion = detalleReclamaciones.content[0];
          }
          // Obtenemos la informacion del tipo contrato.
          const tipoContrato = this.getTipoContrato(detalleReclamacion.detRecTipoContrato);
          detalleReclamacion._tipoContrato = tipoContrato;
          this.configuracion.datosAsociado.items.push(
            {
              label: 'liquidaciones.detalleLiquidacion.datosAsociado.tipoContrato',
              value: detalleReclamacion && detalleReclamacion._tipoContrato ?
                detalleReclamacion._tipoContrato.nombre : ''
            },
            {
              label: 'liquidaciones.detalleLiquidacion.datosAsociado.empresa',
              value: detalleReclamacion ? detalleReclamacion.detRecNombreEmpresa : ''
            }
          );

          // Debido a que la obtenci;ón de informaci;ón de tipo de contrato y empresa es asincrona,
          // debemos asegurarnos de actualizar los datos del componente nuevamente.
          const that_ = this;
          setTimeout(function () {
            that_.configuracion.datosAsociado.component.cargarDatos(
              that_.configuracion.datosAsociado.items
            );
          });
        });
      }

      const that = this;
      setTimeout(function () {
        that.configuracion.datosAsociado.component.cargarDatos(
          that.configuracion.datosAsociado.items
        );

        // Por defecto siempre abierto el componente de datos basicos del asociado y de la reclamacion.
        that.configuracion.datosAsociado.component.toggle(true);
      });

      this.configuracion.mostrarDatosBeneficiario =
        SIP_TIPO_AUXILIOS.FUNERARIO_FAMILIAR.TIP_ID === this.detalleLiquidacion.codTipAux;
      // Configuramos los datos del beneficiario.
      if (this.configuracion.mostrarDatosBeneficiario) {
        this.configuracion.datosBeneficiario.title = 'liquidaciones.detalleLiquidacion.datosBeneficiario.titulo';
        this.configuracion.datosBeneficiario.items.push({
          label: 'liquidaciones.detalleLiquidacion.datosBeneficiario.nombre',
          key: 'nomBen',
          value: this.detalleLiquidacion.nomBen
        },
          {
            label: 'liquidaciones.detalleLiquidacion.datosBeneficiario.identificacion',
            key: 'nitBen',
            value: this.detalleLiquidacion.nitBen
          });
        setTimeout(function () {
          that.configuracion.datosBeneficiario.component.cargarDatos(
            that.configuracion.datosBeneficiario.items
          );
        });
      }

    });
  }

  getTiposContrato() {
    this.backService.parametro.getParametrosTipo(SIP_PARAMETROS_TIPO.TIPO_CONTRATOS_AUXILIO_DESEMPLEO.TIP_COD).subscribe((tiposContrato: any) => {
      this.tiposContrato = tiposContrato;
    });
  }

  getTipoContrato(tipoContrato: string) {
    if (!this.tiposContrato) {
      return;
    }

    for (let i = 0; i < this.tiposContrato.sipParametrosList.length; i++) {
      const sipParametro = this.tiposContrato.sipParametrosList[i];
      if (sipParametro.sipParametrosPK.codigo === tipoContrato) {
        return sipParametro;
      }
    }
  }

  _onAtras() {
    this.location.back();
  }

  async exportarPdf() {
    const parametros: any = {};
    // Configuramos el titulo del reporte.
    parametros.tituloReporte = 'liquidaciones.detalleLiquidacion.titulo';

    // Datos del asociado, reclamacion y liquidaci;ón.
    parametros.nombreAsociado = this.detalleLiquidacion.asociado.nomCli;
    parametros.identificacionAsociado = this.detalleLiquidacion.asociado.nitCli;
    parametros.detalleAsociado = [];
    this.configuracion.datosAsociado.items.forEach(datoAsociado => {
      // A partir de 28/09/2019 a solicitud del PO no se informa nombre del asociado e identificacion en la seccion
      // de datos del asociado del reporte.
      if (datoAsociado.key !== 'nomCli' && datoAsociado.key !== 'nitCli') {
        parametros.detalleAsociado.push({ titulo: datoAsociado.label, valor: datoAsociado.value });
      }
    });

    // Configuramos la informacion del familiar fallecido.
    parametros.tituloFamiliarFallecido = this.configuracion.datosBeneficiario.title;
    parametros.detalleFamiliarFallecido = [];
    this.configuracion.datosBeneficiario.items.forEach(datoBeneficiario => {
      parametros.detalleFamiliarFallecido.push({ titulo: datoBeneficiario.label, valor: datoBeneficiario.value });
    });

    // Configuramos el abono a credito.
    parametros.tituloAbonoACredito = this.configuracion.configuracionAccordionAbonoCredito.title;
    parametros.abonoACredito = this.configuracion.configuracionAccordionAbonoCredito.description;
    parametros.detalleAbonoACredito = this.detalleLiquidacion.liquidacionCrediSolidarioList;

    // Configuramos la forma de pago.
    parametros.tituloFormaPago = this.configuracion.configuracionAccordionFormaPago.title;
    parametros.formaPago = String(this.detalleLiquidacion.formaPago);
    parametros.nombreFormaPago = this.configuracion.configuracionAccordionFormaPago.description;
    parametros.detalleFormaPago = this.configuracion.configuracionFormPago;

    // Configuramos las coberturas.
    parametros.detalleCoberturas = this.detalleLiquidacion.coberturasDetalleLiquidacionList;
    parametros.valorTotalPago = this.configuracion.totalPago;
    // Configuramos alerta de incapacidades temporales.
    parametros.mostrarAlertaIncapacidadesTemporales = this.detalleLiquidacion.mostrarAlerta;
    parametros.alertaIncapacidadesTemporales = this.detalleLiquidacion.alerta;

    // Configuramos forma de pago distribuida (Normal y rentas)
    parametros.mostrarFormaPagoDistribucion = this.configuracion.mostrarFormaPagoDistribucion;
    parametros.distribucionFormaPago = this.detalleLiquidacion.detalleLiquidacionHijasList;

    // Configuramos el detalle de deducciones.
    parametros.tituloCuotaMensual = 'liquidaciones.detalleLiquidacion.cardTotalNeto.cuotaMesual';
    parametros.cuotaMensual = this.detalleLiquidacion.vlrCuotaMes;
    parametros.tituloSaldosVencidos = 'liquidaciones.detalleLiquidacion.cardTotalNeto.saldoVencidos';
    parametros.saldosVencidos = this.detalleLiquidacion.vlrDescuentoCart;
    parametros.tituloDeduccionesVarias = 'liquidaciones.detalleLiquidacion.cardTotalNeto.deduccionesVarias';
    parametros.deduccionesVarias = this.detalleLiquidacion.vlrDescuentoVarios;
    parametros.noFactura = this.detalleLiquidacion.numeroFactura;
    parametros.valorFactura = this.detalleLiquidacion.vlrFactura;
    parametros.tituloTotalDeducciones = 'liquidaciones.detalleLiquidacion.cardTotalNeto.totalDeducciones';
    parametros.totalDeducciones = this.detalleLiquidacion.vlrDeducciones;
    parametros.mostrarRendimiento = this.detalleLiquidacion.mostrarRendimiento;
    parametros.tituloRendimiento = 'liquidaciones.detalleLiquidacion.cardTotalNeto.rendimiento';
    parametros.rendimiento = this.detalleLiquidacion.rendimiento;
    parametros.tituloPorcRetefuente = 'liquidaciones.detalleLiquidacion.cardTotalNeto.retencion';
    parametros.porcRetefuente = this.detalleLiquidacion.porcReteFuente;
    parametros.tituloRetefuente = 'liquidaciones.detalleLiquidacion.cardTotalNeto.retefuente';
    parametros.retefuente = this.detalleLiquidacion.vlrReteFuente;
    parametros.tituloValorNetoPago = 'liquidaciones.detalleLiquidacion.cardTotalNeto.valorNeto';
    parametros.valorNetoPago = this.detalleLiquidacion.vlrNetoPago;

    // Seteamos las obsrvaciones.
    parametros.tituloObservaciones = 'global.observations';
    parametros.mostrarObservaciones = this.detalleLiquidacion.mostrarObservaciones;
    parametros.observaciones = this.configuracion.observaciones;

    // Traducimos el objeto.
    ObjectUtil.traducirObjeto(parametros, this.translate);

    // Debemos agregar los parametros de visualizacion luego de traducir todo el objeto para no convertirlos a string.
    parametros.mostrarFamiliarFallecido = this.configuracion.mostrarDatosBeneficiario;
    parametros.mostrarAbonoACredito = this.configuracion.mostrarAbonoCredito;

    // Configuramos la peticion.
    const peticion = new ReportParams();
    peticion.nombre = `${this.numeroReclamacion || this.detalleLiquidacion.codReclamacion}_${
      DateUtil.dateToString(new Date(), GENERALES.FECHA_WITHOUT_SEPARATOR_PATTERN)}_${
      DateUtil.dateToString(new Date(), GENERALES.HORA_WITHOUT_SEPARATOR_PATTERN)}`;
    peticion.parameters = parametros;
    peticion.configuration = {
      isEncrypted: true,
      is128BitKey: true,
      userPassword: this.detalleLiquidacion.asociado.nitCli
    } as ReportConfiguration;

    this.backService.utilidades.generarJasper('pdf', 'detalle-liquidaciones', peticion).subscribe(respuesta => {
      const body: any = respuesta.body;
      FileUtils.downloadPdfFile(body, peticion.nombre);
    }, async (err) => {
      const message = JSON.parse(await err.error.text()).message;
      this.frontService.alert.error(message);
    });
  }

}
