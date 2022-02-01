import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackFacadeService } from '@core/services/back-facade.service';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { DatosAsociadoWrapper } from '@core/store/asociado-data.service';
import { DataService } from '@core/store/data.service';
import { AppState } from '@core/store/reducers';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { DetalleConfiguracion } from '@shared/components/mim-asociado-detalle-config/mim-asociado-detalle-config.component';
import { CustomCurrencyPipe } from '@shared/pipes/custom-currency.pipe';
import { UrlRoute } from '@shared/static/urls/url-route';
import { DateUtil } from '@shared/util/date.util';
import { FileUtils } from '@shared/util/file.util';
import { ObjectUtil } from '@shared/util/object.util';
import { MessageService } from 'primeng/api';
import { forkJoin, Subscription } from 'rxjs';
import * as acciones from '../portafolio.actions';
import { CalculoProyeccionesService } from '../services/calculo-proyecciones.service';
import { GenerateService } from '../services/generate.service';
import { ResumenCoberturaCotizacionConfig } from './resumen-cobertura-cotizacion.config';

@Component({
  selector: 'app-resumen-cobertura-cotizacion',
  templateUrl: './resumen-cobertura-cotizacion.component.html',
  styleUrls: ['./resumen-cobertura-cotizacion.component.css']
})
export class ResumenCoberturaCotizacionComponent implements OnInit, OnDestroy, AfterViewInit {

  configuracion: ResumenCoberturaCotizacionConfig = new ResumenCoberturaCotizacionConfig();
  subs: Subscription[] = [];
  asoNumInt = '';
  datosAsociado: any;
  mostrarLista: boolean;
  itemMenu: number;
  mostrarListaRestrictivas: boolean;
  cotizacion: any;
  datosProyeccion: any;
  data: any;
  options: any;
  codigoCotizacion: number;
  configCabecera: any;
  mostrarDetalleAsociado: boolean;
  detalleCardSuperior: DetalleConfiguracion;
  datosTabla;
  proyeccionesRespuesta: any;
  existePerseverancia: boolean;
  resumenLabelValores: any;
  listasProyecciones: any;
  datosResumen: any;
  mostrarModal: boolean;
  promotor: any;
  habilitarBotones: boolean;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly dataService: DataService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService,
    private readonly messageService: MessageService,
    private readonly store: Store<AppState>,
    private readonly calculoProyeccionesService: CalculoProyeccionesService,
    private readonly generateService: GenerateService,
    private readonly customCurrencyPipe: CustomCurrencyPipe
  ) {
    this.itemMenu = 1;
    this.datosTabla = [];
    this.mostrarModal = false;
    this.habilitarBotones = true;
  }

  ngOnInit(): void {
    this.store.dispatch(acciones.mostrarMenuConsultas({ datos: false }));
    this.store.dispatch(acciones.mostrarDetalleAsociado({ datos: false }));
    this.subs.push(
      this.route.parent.parent.parent.parent.parent.params.subscribe(params => {
        this.asoNumInt = params.asoNumInt;
        if (!this.asoNumInt) {
          return;
        }
      })
    );

    // Para asociado
    this.subs.push(this.dataService.asociados().asociado.subscribe(async (respuesta: DatosAsociadoWrapper) => {
      if (!respuesta) {
        return;
      }
      this.datosAsociado = respuesta.datosAsociado;

      this.subs.push(
        this.route.params.subscribe(async (params: any) => {
          this.codigoCotizacion = params.codigo;
          forkJoin({
            _cotizacion: this.backService.cotizacion.getCotizacion(this.codigoCotizacion),
            _calculoProyeccioes: this.calculoProyeccionesService.getCalculoProyeccion(this.codigoCotizacion)
          }).subscribe(async (resp: any) => {
            if (!resp._cotizacion) {
              this.translate.get('asociado.protecciones.portafolio.resumen.alertas.noEncontroVenta').subscribe(mensaje => {
                this.frontService.alert.info(mensaje).then(() => {
                  this.router.navigate([UrlRoute.PAGES]);
                });
              });
              return;
            }

            this.cotizacion = resp._cotizacion;
            const _promotor = await this.backService.promotor.getPromotores({ numeroIdentificacion: this.cotizacion.promotorComercial })
              .toPromise().catch(err => { this.frontService.alert.error(err.error.message); });
            this.promotor = _promotor._embedded.mimPromotor[0];
            /**
             * Configuramos la barra superior datos del asociado
             */
            this.configuracionDetalleCotizacionAsociado(this.cotizacion);

            /**
             * Para el componente mis datos
             */
            this.configuracion.detalle.title = 'Mis datos';
            this.configuracion.detalle.component.cargarDatos(this.cotizacion);

            /**
             * Para grid de la pestaña de planes
             */
            this.configuracion.gridListar.component.limpiar();
            this.configuracion.gridListar.borderLeft = true;
            this.configuracion.gridListar.columnas = this.configuracion.gridListarResumen.columnas;
            const _mimCotizacionDetalleSet = this.cotizacion.mimCotizacionDetalleSet.filter(x => x.cuota != 0 && x.valorProteccion != 0);
            this.configuracion.gridListar.component.cargarDatos(_mimCotizacionDetalleSet);

            /**
             * Si la proyeccion existe se construye un nuevo objeto haciendo un merje con las dos coberturas
             * Si la proyección no existe se crea.
             */
            if (resp._calculoProyeccioes && resp._calculoProyeccioes.length > 0 &&
              (resp._calculoProyeccioes[0].mimCoberturaProyeccionPerseveranciaDto || resp._calculoProyeccioes[0].mimCoberturaProyeccionMuerteDto)) {
              this.proyeccionesRespuesta = resp._calculoProyeccioes[0];
            } else {
              this.mostrarModal = true;
              await this.calculoProyeccionesService.postCalculoProyeccion(resp._cotizacion).toPromise().catch(err => {
                this.mostrarModal = false;
                this.frontService.alert.error(err.error.message);
              });
              const respuestaProyeccion = await this.calculoProyeccionesService.getCalculoProyeccion(this.codigoCotizacion).toPromise().catch(err => {
                this.mostrarModal = false;
                this.frontService.alert.error(err.error.message);
              });
              this.proyeccionesRespuesta = respuestaProyeccion[0];
              this.mostrarModal = false;
            }
            this.constuirEstructuraProyeccion();
            this.construirEstructuraResume();
            this.configuracionEstadistica();
            this.habilitarBotones = null;


          }, err => {
            this.habilitarBotones = null;
            this.frontService.alert.error(err.error.message);
          });

        })
      );
    }));

  }

  ngAfterViewInit(): void {
    // do nothing
  }

  ngOnDestroy(): void {
    this.store.dispatch(acciones.mostrarMenuConsultas({ datos: true }));
    this.store.dispatch(acciones.mostrarDetalleAsociado({ datos: true }));
    this.subs.forEach(x => x.unsubscribe());
  }

  listarPlanCobertura(mostrar: boolean) {
    this.mostrarLista = mostrar;
    this.configuracion.gridListar.component.limpiar();
    this.configuracion.gridListar.borderLeft = mostrar;
    if (mostrar) {
      this.configuracion.gridListar.columnas = this.configuracion.gridListarResumen.columnas;
    } else {
      this.configuracion.gridListar.columnas = this.configuracion.gridListasRestrictivas.columnas;
    }
  }

  clickMenu(item: number) {
    if (this.proyeccionesRespuesta) {
      if ((item === 4 || item === 3) && !this.existePerseverancia) {
        this.translate.get('asociado.protecciones.portafolio.resumenCotizacion.alertas.noCotizoPerseverancia').subscribe(mensaje => {
          this.frontService.alert.info(mensaje);
        });
        return;
      }
      this.itemMenu = item;
    }
  }

  descargar() {
    const _datosAsociado = this.cotizacion.asociado;
    const param = {
      nombre: 'reportePlanBasico',
      parameters: {
        tituloReporte: 'Cotización de ' + this.cotizacion.mimPlan.nombre,
        nombreCotizante: _datosAsociado.nombreAsociado,
        documento: _datosAsociado.nitCli,
        fechaNacimiento: _datosAsociado.fecNac,
        email: _datosAsociado.mail,
        tipoAsociado: _datosAsociado.tipoVin, // Verificar
        ciudad: _datosAsociado.ciuRes, // Verificar
        canalVenta: this.cotizacion.mimCanal.nombre,
        numeroCotizacion: this.cotizacion.codigo.toString(),
        fechaCotizacion: this.cotizacion.fechaSolicitud,
        planBasico: this.cotizacion.mimPlan.nombre,
        riesgo: this.datosAsociado.nivelRiesgo.toString(),
        regional: _datosAsociado.regionalAso,
        proyectoVida: 'Perseverancia',
        valorPerseveranciaInical: this.customCurrencyPipe.transformNumericoDecimal(this.proyeccionesRespuesta.detalleCoberturaPerseverancia.proteccion), // Plan/protección de la perse
        valorPerseveranciaProyectada: this.customCurrencyPipe.transformNumericoDecimal(this.datosTabla[this.datosTabla.length - 1].valorRescate), // Resumen/Valor a recibir por Perseverancia (no tocar)
        valorPerseveranciaInicalContribuccion: this.customCurrencyPipe.transformNumericoDecimal(this.proyeccionesRespuesta.detalleCoberturaPerseverancia.contribuccion), // Plan/cuota de la perse
        valorPerseveranciaProyectadaContribuccion: '0',
        valorProteccionMuerte: this.customCurrencyPipe.transformNumericoDecimal(this.proyeccionesRespuesta.detalleCoberturaMuerte.proteccion), // Plan/protección de la Muerte
        valorContribucionMuerte: this.customCurrencyPipe.transformNumericoDecimal(this.proyeccionesRespuesta.detalleCoberturaMuerte.contribuccion), // Plan/cuota de la Muerte
        totalIncrementoFacturacion: this.customCurrencyPipe.transform(this.proyeccionesRespuesta.detalleCoberturaIncapacidadTemporal.contribuccion + this.proyeccionesRespuesta.detalleCoberturaMuerte.contribuccion + this.proyeccionesRespuesta.detalleCoberturaPerseverancia.contribuccion), // Confirmar con Gaby
        valorProteccionMuerteAccidental: this.customCurrencyPipe.transformNumericoDecimal(this.proyeccionesRespuesta.detalleCoberturaMuerteAccidental.proteccion),
        valorContribucionMuerteAccidental: this.customCurrencyPipe.transformNumericoDecimal(this.proyeccionesRespuesta.detalleCoberturaMuerteAccidental.contribuccion),
        proteccionGranInvalidez: this.customCurrencyPipe.transformNumericoDecimal(this.proyeccionesRespuesta.detalleCoberturaGranIvalidez.proteccion),
        contriubuccionGranInvalidez: this.customCurrencyPipe.transformNumericoDecimal(this.proyeccionesRespuesta.detalleCoberturaGranIvalidez.contribuccion),
        proteccionIncapaciadaTemporal: this.customCurrencyPipe.transformNumericoDecimal(this.proyeccionesRespuesta.detalleCoberturaIncapacidadTemporal.proteccion),
        contriubuccionIncapaciadaTemporal: this.customCurrencyPipe.transformNumericoDecimal(this.proyeccionesRespuesta.detalleCoberturaIncapacidadTemporal.contribuccion),
        // incapacidadPermanente: 'Si',
        incapacidadPermanenteProteccion: this.customCurrencyPipe.transformNumericoDecimal(this.proyeccionesRespuesta.detalleCoberturaIncapacidadPermanente.proteccion),
        incapacidadPermanenteContribuccion: this.customCurrencyPipe.transformNumericoDecimal(this.proyeccionesRespuesta.detalleCoberturaIncapacidadPermanente.contribuccion),
        contribucionEstimadaPerseverancia: this.customCurrencyPipe.transform(this.datosResumen.pagos.protecciones[0].valor), // '$ 2,000,000',
        contribucionTotalPagadaLineaVida: this.customCurrencyPipe.transform(this.datosResumen.pagos.protecciones[1].valor), // '$ 10,000,000',
        totalContribucionPaga: this.customCurrencyPipe.transform(this.datosResumen.pagos.total.valor),
        tasaRentabilidad: this.proyeccionesRespuesta.tasaRentabilidad.toString(),
        nombreAsesor: this.promotor.nombre,
        telefonoAsesor: _datosAsociado.telCom,
        valorEstimadoRecibirPerseverancia: this.customCurrencyPipe.transform(this.datosResumen.estimados.protecciones[0].valor),
        valorEstimadoEdadPerseverancia: this.customCurrencyPipe.transform(this.datosResumen.estimados.protecciones[1].valor),
        totalValorCancelarAmparoVida: this.customCurrencyPipe.transform(this.datosResumen.estimados.total.valor),
        notasAclaratorias: this.proyeccionesRespuesta.notaAclaratoria ? this.proyeccionesRespuesta.notaAclaratoria.map(x => x.descripcion).join(' ') : ''
      },
      dataSets: {
        graficaPerseverancia: this.getDatasets()
      },
      datasource: this.datosTabla.map(x => {
        return {
          edad: x.edad.toString(),
          anio: x.anio.toString(),
          mesPagar: x.mes.toString(),
          valorContribucionMes: this.customCurrencyPipe.transformNumericoDecimal(x.valorCuota),
          valorContribucionAnio: this.customCurrencyPipe.transformNumericoDecimal(x.valorContribucionAnio),
          valorProteccion: this.customCurrencyPipe.transformNumericoDecimal(x.valorProteccion),
          valorRescatePorCobertura: this.customCurrencyPipe.transformNumericoDecimal(x.valorRescateParaMuerte),
          valorContribucionMesPerseverancia: this.customCurrencyPipe.transformNumericoDecimal(x.mensualAporte),
          valorCapitalizado: this.customCurrencyPipe.transformNumericoDecimal(x.capitalAcomulado),
          valorRescatePerseverancia: x.mostrarValorRescatePerseverancia ? this.customCurrencyPipe.transformNumericoDecimal(x.valorRescate) : ' - '
        };
      })
    };

    this.generateService.postGenerarPDF(param, 'pdf-plan-basico')
      .subscribe(pdf => {
        const body: any = pdf.body;
        FileUtils.downloadPdfFile(body, 'proyeccion-' + DateUtil.dateToString(new Date(), 'dd-MM-yyyy'));
      }, err => {
        this.frontService.alert.error(err.error.message);
      });
  }

  editarCotizacion() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.CONSULTAS,
      UrlRoute.CONSULTAS_ASOCIADO,
      this.asoNumInt,
      UrlRoute.PROTECCIONES,
      UrlRoute.PORTAFOLIO_BETA,
      UrlRoute.PORTAFOLIO_PLAN_COBERTURA_COTIZACION_PLAN,
      this.codigoCotizacion
    ]);
  }

  selectData(event) {
    this.messageService.add({ severity: 'info', summary: 'Data Selected', 'detail': this.data.datasets[event.element._datasetIndex].data[event.element._index] });
  }

  continuarVenta() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.CONSULTAS,
      UrlRoute.CONSULTAS_ASOCIADO,
      this.asoNumInt,
      UrlRoute.PROTECCIONES,
      UrlRoute.PORTAFOLIO_BETA,
      UrlRoute.PORTAFOLIO_PLAN_COBERTURA_VENTA_PLAN,
      this.codigoCotizacion
    ]);
  }

  /**
   * Este método es para configurar los datos de la barra superior datos del asociado
   * @param datos información del asociado
   */
  private configuracionDetalleCotizacionAsociado(datos: any) {

    this.detalleCardSuperior = new DetalleConfiguracion;
    this.detalleCardSuperior.datos = [
      {
        nivel: 1,
        valor: {
          label: datos.asociado.nomCli,
          iconoLeft: 'icon-user-check text--20pts text--orange1 px-2',
          clasesCss: 'text--500wt text--gray1 text-left mr-2 text-uppercase'
        }
      },
      {
        nivel: 1,
        boton: {
          clasesCss: 'btn btn--icon bg--blue2 mr-3',
          clasesCssTextButon: 'icon-external-link text--blue1',
          tipo: 'btnLink'
        }
      },
      {
        nivel: 1,
        clasesCss: 'ml-auto',
        titulo: {
          label: 'asociado.cedula',
          clasesCss: 'text--600wt text--gray2 text-left mr-2'
        },
        valor: {
          label: datos.asociado.nitCli,
          clasesCss: 'text--500wt text--gray1 text-left mr-2'
        }
      },
      {
        nivel: 1,
        boton: {
          clasesCss: 'btn btn--icon bg--blue2 mr-3',
          clasesCssTextButon: 'icon-copy-2 text--orange1',
          tipo: 'btnCopy'
        }
      },
      {
        nivel: 1,
        titulo: {
          label: 'asociado.fechaNacimiento',
          clasesCss: 'text--600wt text--gray2 text-left mr-2'
        },
        valor: {
          label: datos.asociado.fecNac,
          iconoRight: this.calcularIndFecNac(this.datosAsociado.vinIndFechaNacimiento) + ' ml-1',
          clasesCss: 'text--500wt text--gray1 text-left mr-2'
        }
      },
      {
        nivel: 2,
        titulo: {
          label: 'asociado.fechaIngresoCompleto',
          clasesCss: 'text--600wt text--gray2 text-left mr-2'
        },
        valor: {
          label: datos.asociado.fecIngreso,
          clasesCss: 'text--500wt text--gray1 text-left mr-3'
        }
      },
      {
        nivel: 2,
        titulo: {
          label: 'asociado.corte',
          clasesCss: 'text--600wt text--gray2 text-left mr-2'
        },
        valor: {
          label: datos.asociado.desCorte,
          clasesCss: 'text--500wt text--gray1 text-left mr-3'
        }
      },
      {
        nivel: 2,
        titulo: {
          label: 'asociado.nivelRiesgo',
          clasesCss: 'text--600wt text--gray2 text-left mr-2'
        },
        valor: {
          label: this.datosAsociado.nivelRiesgo,
          clasesCss: 'text--500wt text--gray1 text-left mr-3'
        }
      },
      {
        nivel: 2,
        titulo: {
          label: 'asociado.edadActual',
          clasesCss: 'text--600wt text--gray2 text-left mr-2'
        },
        valor: {
          label: this.datosAsociado.edadAct,
          clasesCss: 'text--500wt text--gray1 text-left mr-3'
        }
      },
      {
        nivel: 2,
        titulo: {
          label: 'asociado.profesion',
          clasesCss: 'text--600wt text--gray2 text-left mr-2'
        },
        valor: {
          label: datos.asociado.profesion,
          clasesCss: 'text--500wt text--gray1 text-left mr-3'
        }
      }
    ];
  }

  /**
   * Este metodo es para configurar la grafica que esta en la pestaña estadisticas
   */
  private configuracionEstadistica() {
    let mesAcumulado = null;
    this.data = {
      labels: this.datosTabla ? this.datosTabla.map(x => {
        mesAcumulado = mesAcumulado ? x.mes + mesAcumulado : x.mes;
        return mesAcumulado;
      }) : [],
      datasets: [
        {
          label: 'Contribuciones pagadas',
          data: this.proyeccionesRespuesta.mimCoberturaProyeccionPerseveranciaDto.listMimProyeccionesPerseveranciaDto.map(x => x.capitalAcomulado),
          fill: true,
          borderColor: '#4bc0c0'
        },
        {
          label: 'Perseverancia proyectada',
          data: this.proyeccionesRespuesta.mimCoberturaProyeccionPerseveranciaDto.listMimProyeccionesPerseveranciaDto.map(x => x.valorRescate),
          fill: true,
          borderColor: '#0e8652'
        }
      ]
    };

    this.options = {
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            let dataItem = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            dataItem = dataItem.toString().split(/(?=(?:...)*$)/).join('.');
            return data.datasets[tooltipItem.datasetIndex].label + ': $' + dataItem;
          }
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            stepSize: 200000, // 20000000

            // Return an empty string to draw the tick line but hide the tick label
            // Return `null` or `undefined` to hide the tick line entirely
            userCallback: function (value, index, values) {
              // Convert the number to a string and splite the string every 3 charaters from the end
              value = value.toString();
              value = value.split(/(?=(?:...)*$)/);

              // Convert the array to a string and format the output
              value = value.join('.');
              return '$' + value;
            }
          }
        }]
      }
    };
  }

  /**
  * @description Retorna la clase para el indicador de fecha de nacimiento correspondiente
  *
  * @param indicador Indicador de fecha de nacimiento.
  */
  calcularIndFecNac(indicador: number) {
    switch (indicador) {
      case 1:
        return 'icon-Valida text--green2';
      case 2:
        return 'icon-Pendiente text--red1';
      case 3:
        return 'icon-No-valida text--gray2';
      default:
        return 'icon-No-valida text--gray2';
    }
  }

  /**
   * Metodo para realizar las acciones de los botones que se configuren en la barra superior datos del asociado
   * @param tipoBoton para definir cual de los botones disparo la acción y realizar el procedimiento correspondiente a este.
   */
  onClickElement(tipoBoton: any) {
    if (tipoBoton.boton === 'btnLink') {
      const paths = [
        UrlRoute.PAGES,
        UrlRoute.CONSULTAS,
        UrlRoute.CONSULTAS_ASOCIADO,
        this.asoNumInt,
        UrlRoute.CONSULTAS_ASOCIADO_DATOS_ASOCIADO
      ];
      const urlFull = document.location.href;
      const url = paths.join('/');
      const urlNew = urlFull.split('#')[0] + '#/' + url;

      window.open(urlNew, '', 'width=' + window.outerWidth + ',height=' + window.outerHeight + ',left=0,top=0');
    }

    if (tipoBoton.boton === 'btnCopy') {
      ObjectUtil.copiarAlClipboard(this.datosAsociado.nitCli);
    }
  }

  /**
   * Metodo en el que se realiza un merge de las proyecciones que lleguen.
   * @param items datos de las proyecciones
   */
  private constuirEstructuraProyeccion() {
    this.existePerseverancia = false;
    const _perseverancia = this.proyeccionesRespuesta && this.proyeccionesRespuesta.mimCoberturaProyeccionPerseveranciaDto ?
      this.proyeccionesRespuesta.mimCoberturaProyeccionPerseveranciaDto : null;
    const _muerte = this.proyeccionesRespuesta && this.proyeccionesRespuesta.mimCoberturaProyeccionMuerteDto ?
      this.proyeccionesRespuesta.mimCoberturaProyeccionMuerteDto : null;

    const perseveranciaList = _perseverancia ? _perseverancia.listMimProyeccionesPerseveranciaDto : null;
    const muerteList = _muerte ? _muerte.listMimProyeccionesMuerteDto : null;



    this.configCabecera = [
      {
        titulo: _muerte ? _muerte.mimCoberturaDto.nombre : 'Muerte',
        codigoColor: _muerte ? _muerte.mimCoberturaDto.codigoColor : '#FF4352',
        colspan: 4
      },
      {
        titulo: _perseverancia ? _perseverancia.mimCoberturaDto.nombre : 'Perseverancia',
        codigoColor: _perseverancia ? _perseverancia.mimCoberturaDto.codigoColor : '#80D203',
        colspan: 3
      }
    ];

    if (perseveranciaList && perseveranciaList.length > 0 && muerteList && muerteList.length > 0) {
      this.existePerseverancia = true;
      muerteList.filter(muerte => {
        const perseverancia = perseveranciaList.find(perse => perse.anio === muerte.anio);
        if (perseverancia) {
          this.datosTabla.push({
            ...muerte,
            mostrarValorRescateMueste: muerte.mostrarValorRescate,
            ...perseverancia,
            mostrarValorRescatePerseverancia: perseverancia.mostrarValorRescate
          });
        }
      });
      return;
    }

    if (perseveranciaList) {
      this.existePerseverancia = true;
      perseveranciaList.map(perse => this.datosTabla.push({ ...perse, mostrarValorRescatePerseverancia: perse.mostrarValorRescate }));
      return;
    }

    if (muerteList) {
      muerteList.map(muerte => this.datosTabla.push({ ...muerte, mes: muerte.mes, mostrarValorRescateMueste: muerte.mostrarValorRescate }));
      return;
    }
  }

  private construirEstructuraResume() {

    const _perseverancia = this.proyeccionesRespuesta && this.proyeccionesRespuesta.mimCoberturaProyeccionPerseveranciaDto ?
      this.proyeccionesRespuesta.mimCoberturaProyeccionPerseveranciaDto : null;
    const _muerte = this.proyeccionesRespuesta && this.proyeccionesRespuesta.mimCoberturaProyeccionMuerteDto ?
      this.proyeccionesRespuesta.mimCoberturaProyeccionMuerteDto : null;

    const perseveranciaList = _perseverancia ? _perseverancia.listMimProyeccionesPerseveranciaDto : null;
    const muerteList = _muerte ? _muerte.listMimProyeccionesMuerteDto : null;

    this.resumenLabelValores = { muerte: _muerte, perseverancia: _perseverancia };
    this.listasProyecciones = { muerte: muerteList, perseverancia: perseveranciaList };

    const proteccionesPagos = [];
    this.translate.get('asociado.protecciones.portafolio.resumenCotizacion.resumen.contribucionTotalEstimada', { nombreCobertura: _perseverancia.mimCoberturaDto.nombre }).subscribe(texto => {
      proteccionesPagos.push({ label: texto, valor: this.listasProyecciones.perseverancia[this.listasProyecciones.perseverancia.length - 1].capitalAcomulado });
    });
    this.translate.get('asociado.protecciones.portafolio.resumenCotizacion.resumen.contribucionTotalPagadaAmparo', { nombreCobertura: _muerte.mimCoberturaDto.nombre }).subscribe(texto => {
      proteccionesPagos.push({ label: texto, valor: this.listasProyecciones.muerte.map(x => x.valorContribucionAnio).reduce((a, b) => a + b, 0) });
    });
    let totalpagos = {};
    this.translate.get('asociado.protecciones.portafolio.resumenCotizacion.resumen.totalContribucionPagada').subscribe(texto => {
      totalpagos = { label: texto, valor: proteccionesPagos.map(x => x.valor).reduce((a, b) => a + b, 0) };
    });

    const proteccionesEstimados = [];
    this.translate.get('asociado.protecciones.portafolio.resumenCotizacion.resumen.valorRecibir', { nombreCobertura: _perseverancia.mimCoberturaDto.nombre }).subscribe(texto => {
      proteccionesEstimados.push({ label: texto, valor: this.listasProyecciones.perseverancia[this.listasProyecciones.perseverancia.length - 1].valorRescate });
    });
    this.translate.get('asociado.protecciones.portafolio.resumenCotizacion.resumen.valorRecibirAmparo', { nombreCobertura: _muerte.mimCoberturaDto.nombre }).subscribe(texto => {
      proteccionesEstimados.push({ label: texto, valor: this.listasProyecciones.muerte[this.listasProyecciones.muerte.length - 1].valorRescateParaMuerte });
    });
    let totalEstimado = {};
    this.translate.get('asociado.protecciones.portafolio.resumenCotizacion.resumen.totalValoresEstimadosPagada').subscribe(texto => {
      totalEstimado = { label: texto, valor: proteccionesEstimados.map(x => x.valor).reduce((a, b) => a + b, 0) };
    });

    this.datosResumen = {
      pagos: {
        protecciones: proteccionesPagos,
        total: totalpagos
      },
      estimados: {
        protecciones: proteccionesEstimados,
        total: totalEstimado
      }
    };

  }
  /**
   * Volver a la pantalla de movimiento
   */
  atras() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.CONSULTAS,
      UrlRoute.CONSULTAS_ASOCIADO,
      this.asoNumInt,
      UrlRoute.PROTECCIONES,
      UrlRoute.PORTAFOLIO_BETA,
      UrlRoute.PORTAFOLIO_PLAN_COBERTURA_MOVIMIENTOS
    ]);
  }

  private getDatasets() {
    let mesAcumulado = null;
    const calorContribucionesPagas = this.datosTabla.map(x => {
      mesAcumulado = mesAcumulado ? x.mes + mesAcumulado : x.mes;
      return {
        perseverancia: x.capitalAcomulado.toString(), // ???
        numCuotasPagas: mesAcumulado,
        series: 'Valor contribuciones pagas'
      };
    });
    let mesAcumuladoPerse = null;
    const valorPerseverancia = this.datosTabla.map(x => {
      mesAcumuladoPerse = mesAcumuladoPerse ? x.mes + mesAcumuladoPerse : x.mes;
      return {
        perseverancia: x.valorRescate.toString(), // ???
        numCuotasPagas: mesAcumuladoPerse,
        series: 'valor perseverancia'
      };
    });

    return [...calorContribucionesPagas, ...valorPerseverancia];
  }

}
