import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackFacadeService, FrontFacadeService } from '@core/services';
import { AppState } from '@core/store/reducers';
import { Store } from '@ngrx/store';
import { UrlRoute } from '@shared/static/urls/url-route';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { BeneficiosPreexistenciaAction,
  CargueFactoresAction,
  CoberturasAdicionalesAction,
  CoberturasSubsistentesAction,
  ConceptosDistribucionCuentaAction,
  ConceptosFacturacionAction,
  CondicionesAction,
  CondicionesAsistenciaAction,
  DatosPlanAction, DeduciblesAction,
  DesmembracionAccidenteAction,
  EnfermedadesGravesAction,
  ExclusionesAction,
  LimitacionesCoberturaAction,
  PeriodosCarenciaAction,
  ValoresAseguradosAction,
  ValoresRescateAction } from '../../aprobacion-final.actions';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css']
})
export class ResumenComponent implements OnInit, OnDestroy {

  _subs: Subscription[] = [];

  codigoPlan: string;

  resumenPlan: any;
  plan: any;
  condiciones: any;
  deducibles: any;
  periodosCarencia: any;
  exclusiones: any;
  coberturasSubsistentes: any;
  coberturasAdicionales: any;
  valoresRescate: any;
  valoresAsegurados: any;
  desmembracionAccidentes: any;
  limitacionesCobertura: any;
  enfermedadesGraves: any;
  beneficiosPreexistencia: any;
  condicionesAsistencia: any;
  cargueFactores: any;
  conceptosFacturacion: any;
  conceptosDistribucionCuenta: any;

  mostrarCondiciones: boolean;
  mostrarDeducibles: boolean;
  mostrarPeriodosCarencia: boolean;
  mostrarExclusiones: boolean;
  mostrarCoberturasSubsistentes: boolean;
  mostrarCoberturasAdicionales: boolean;
  mostrarValoresRescate: boolean;
  mostrarValoresAsegurados: boolean;
  mostrarDesmembracionAccidentes: boolean;
  mostrarLimitacionesCobertura: boolean;
  mostrarEnfermedadesGraves: boolean;
  mostrarBeneficiosPreexistencia: boolean;
  mostrarCondicionesAsistencia: boolean;
  mostrarCargueFactores: boolean;
  mostrarConceptosFacturacion: boolean;
  mostrarConceptosDistribucionCuenta: boolean;

  taskId: String;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly location: Location,
    private readonly store: Store<AppState>,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) { }

  ngOnInit() {

    this.plan = {};
    this.mostrarCondiciones = true;
    this.mostrarDeducibles = true;
    this.mostrarPeriodosCarencia = true;
    this.mostrarExclusiones = true;
    this.mostrarCoberturasSubsistentes = true;
    this.mostrarCoberturasAdicionales = true;
    this.mostrarValoresRescate = true;
    this.mostrarValoresAsegurados = true;
    this.mostrarDesmembracionAccidentes = true;
    this.mostrarLimitacionesCobertura = true;
    this.mostrarEnfermedadesGraves = true;
    this.mostrarBeneficiosPreexistencia = true;
    this.mostrarCondicionesAsistencia = true;
    this.mostrarCargueFactores = true;
    this.mostrarConceptosFacturacion = true;
    this.mostrarConceptosDistribucionCuenta = true;
    this._subs.push(this.route.params.subscribe((params) => {
      this.taskId = params.taskId;
      this.codigoPlan = params.codigoPlan;
      this._getData();
    }));

    // Cargamos los datos luego de que los componentes visuales se hayan cargado para evitar errores.
    // El componente de la grilla/tabla se utiliza en este scope y para usarse la tabla debe estar renderizada.
    this._subs.push(this.store.select('aprobacionFinal')
      .subscribe(ui => {
        if (!ui || !ui.plan) {
          return;
        }
        this.plan = ui.plan;
        this.resumenPlan = ui;
      }));
  }

  _getData() {
    const parametros = { 'mimPlanCobertura.mimPlan.codigo': this.codigoPlan, isPaged: false, estado: true };
    forkJoin({
      _plan: this.backService.planes.getPlan(this.codigoPlan),
      _condiciones: this.backService.condicion.obtenerCondiciones(parametros),
      _deducibles: this.backService.deducible.obtenerDeducibles(parametros),
      _periodosCarencia: this.backService.periodoCarencia.obtenerPeriodosCarencia(parametros),
      _exclusiones: this.backService.exclusionPlanCobertura.getExclusionesPlanesCoberturas(parametros),
      _coberturasSubsistentes: this.backService.subsistentePlanCobertura.getSubsistentesPlanesCoberturas(parametros),
      _coberturasAdicionales: this.backService.adicionalPlanCobertura.getAdicionalPlanesCoberturas(parametros),
      _valoresRescate: this.backService.valorRescate.getValoresRescate(parametros),
      _valoresAsegurados: this.backService.valorAsegurado.obtenerValoresAsegurados(parametros),
      _limitacionCoberturaPA: this.backService.condicionPagoAntiguedad.getCondicionesPagoAntiguedad(parametros),
      _limitacionCoberturaDX: this.backService.excepcionDiagnostico.getExcepcionesDiagnosticos(parametros),
      _limitacionCoberturaSL: this.backService.sublimiteCobertura.obtenerSublimitesCobertura(parametros),
      _enfermedadesGraves: this.backService.enfermedadGravePlanCobertura.getEnfermedadesGraves(parametros),
      _beneficiosPreexistencia: this.backService.beneficioPreexistencia.getBeneficiosPreexistencia(parametros),
      _condicionesAsistencia: this.backService.asistenciaPlanCobertura.obtenerAsistenciasPlanCobertura(parametros),
      _cargueFactores: this.backService.periodo.getPeriodosCargueFactores({ 'mimPlanCobertura.mimPlan.codigo': this.codigoPlan, isPaged: false, sort: 'mimCargue.fechaCreacion,desc' }),
      _conceptosFacturacion: this.backService.conceptoFacturacionPlanCobertura.getListadoConceptosFacturacion({ codigoPlan: this.codigoPlan, isPaged: false }),
      _distribucionCuenta: this.backService.relacionDistribucionCuenta.getRelacionDistribucionCuentas({ 'mimPlanCobertura.mimPlan.codigo': this.codigoPlan, isPaged: false }),
      _desmembracionAccidente: this.backService.desmembracionAccidentePlanCobertura.getDesmembracionesPorAccidentePlanCobertura(parametros)
    }).pipe(
      map((x: any) => {
        return {
          plan: x._plan,
          condiciones: x._condiciones.content.map(t => {
            return {
              nombreAmparo: t.mimPlanCobertura.mimCobertura.nombre,
              edadMinima: Math.min.apply(Math, t.mimPlanCobertura.mimPlanCoberturaEdadList.map(j => j.edadMinIngreso)),
              edadMaxima: Math.max.apply(Math, t.mimPlanCobertura.mimPlanCoberturaEdadList.map(j => j.edadMaxIngreso)),
              edadPermanencia: Math.max.apply(Math, t.mimPlanCobertura.mimPlanCoberturaEdadList.map(j => j.edadMaxPermanencia)),
              origen: t.mimPlanCobertura.mimOrigenPlanCoberturaList.map(j => j.mimOrigenCobertura.nombre).join(', '),
              planFamiliar: t.aplicaPlanFamiliar ? 'SI' : 'NO',
              renunciaAmparo: t.renunciaAmparo ? 'SI' : 'NO',
              incrementoProteccion: t.incrementoProteccion ? 'SI' : 'NO',
              disminucionProteccion: t.disminucionProteccion ? 'SI' : 'NO',
              requisitosMedicos: t.requisitosMedicos ? 'SI' : 'NO',
              tieneFacturacion: t.facturacion ? 'SI' : 'NO',
              disponibleGarantia: t.disponibleParaGarantia ? 'SI' : 'NO',
              aplicaReactivacion: t.aplicaReactivacion ? 'SI' : 'NO',
              aplicaRevocatoria: t.aplicaRevocatoria ? 'SI' : 'NO',
              aplicaHabilitacion: t.aplicaHabilitacion ? 'SI' : 'NO',
              aplicaReceso: t.aplicaReceso ? 'SI' : 'NO',
              aplicaReingreso: t.aplicaReingreso ? 'SI' : 'NO',
              cancelar: t.cancelar ? 'SI' : 'NO',
              devolucionRetiro: t.devolucionRetiro ? 'SI' : 'NO',
              prorroga: t.prorroga ? 'SI' : 'NO',
              tieneRescate: t.rescate ? 'SI' : 'NO',
              exoneracionPago: t.exoneracionPago ? 'SI' : 'NO',
              disminucionAnticipo: t.disminucionAnticipoPago ? 'SI' : 'NO',
              beneficioPreexistencia: t.beneficiosPreexistencia ? 'SI' : 'NO',
              fechaInicioFin: t.fechaInicio && t.fechaFin ? t.fechaInicio + ' - ' + t.fechaFin : t.fechaInicio
            };
          }),
          deducibles: x._deducibles.content.map(t => {
            return {
              nombreAmparo: t.mimPlanCobertura.mimCobertura.nombre,
              tipoDeducible: t.mimTipoDeducible.nombre,
              tipoPago: t.mimTipoPago.nombre,
              cantidad: t.cantidad,
              aplicaProrroga: t.aplicaProrroga ? 'SI' : 'NO',
              discontinuidad: t.discontinuidadCalendario,
              fechaInicioFin: t.fechaInicio && t.fechaFin ? t.fechaInicio + ' - ' + t.fechaFin : t.fechaInicio
            };
          }),
          periodosCarencia: x._periodosCarencia.content.map(t => {
            return {
              ...t,
              nombreAmparo: t.mimPlanCobertura.mimCobertura.nombre,
              unidadCarencia: t.mimUnidadTiempo ? t.mimUnidadTiempo.nombre ? t.mimUnidadTiempo.nombre : '' : '',
              causa: t.mimCausa ? t.mimCausa.nombre : null,
              fechaInicioFin: t.fechaInicio && t.fechaFin ? t.fechaInicio + ' - ' + t.fechaFin : t.fechaInicio
            };
          }),
          exclusiones: x._exclusiones.content.reduce((s,
            {
              mimPlanCobertura,
              mimExclusion,
              mimExclusionPlanCoberturaDetalleList
            }) =>
            mimExclusionPlanCoberturaDetalleList.map(y => {
              return {
                ...y,
                nombresTransacciones: y.mimTransaccionExclusionList.map(j => j.mimTransaccion.nombre).join(', '),
                nombresCanales: y.mimCanalVentaExclusionList.map(j => j.mimCanalVenta.nombre).join(', ')
              };
            }).reduce((t, detalle) =>
              [...t, {
                nombreAmparo: mimPlanCobertura.mimCobertura.nombre,
                nombreExclusion: mimExclusion.descripcion,
                ...detalle
              }
              ], s),
            []
          ),
          coberturasSubsistentes: x._coberturasSubsistentes.content.reduce((s,
            {
              mimPlanCobertura,
              mimCoberturaIndemnizada,
              mimSubsistentePlanCoberturaDetalleList
            }) =>
            mimSubsistentePlanCoberturaDetalleList.map(y => {
              return {
                ...y,
                subsisteCobertura: y.subsistente ? 'SI' : 'NO',
                contribuccionAsociado: y.mimTipoSubsistencia ? y.mimTipoSubsistencia.nombre : null,
                fechaInicioFin: y.fechaInicio && y.fechaFin ? y.fechaInicio + ' - ' + y.fechaFin : y.fechaInicio
              };
            }).reduce((t, detalle) =>
              [...t, {
                nombreAmparo: mimPlanCobertura.mimCobertura.nombre,
                coberturaIndemnizada: mimCoberturaIndemnizada.nombre,
                ...detalle
              }
              ], s),
            []
          ),
          coberturasAdicionales: x._coberturasAdicionales.content.map(t => {
            return {
              nombreAmparo: t.mimPlanCobertura.mimCobertura.nombre,
              coberturaIndemnizada: t.mimCoberturaIndemnizada.nombre,
              fechaInicioFin: t.fechaInicio && t.fechaFin ? t.fechaInicio + ' - ' + t.fechaFin : t.fechaInicio
            };
          }),
          valoresRescate: x._valoresRescate.content.map(t => {
            return {
              nombreAmparo: t.mimPlanCobertura.mimCobertura.nombre,
              causaRescate: t.mimCausaIndemnizacion.nombre,
              tipoRescate: t.mimTipoRescateIndemnizacion.nombre,
              contribuccionMimina: t.contribucionesMinimas,
              contribuccionMaxima: t.contribucionesMaximas,
              valor: t.valor,
              rentabilidad: t.rentabilidad,
              anticipoCobertura: t.esAnticipoOtraCobertura ? 'SI' : 'NO',
              cobertura: t.mimValorRescatePlanCoberturaList ? t.mimValorRescatePlanCoberturaList.map(j => j.mimPlanCobertura.nombre).join(', ') : null,
              fechaInicioFin: t.fechaInicio && t.fechaFin ? t.fechaInicio + ' - ' + t.fechaFin : t.fechaInicio ? t.fechaInicio : null
            };
          }),

          desmembracionAccidentes: x._desmembracionAccidente.content.map(t => {
            return {
              nombreAmparo: t.mimPlanCobertura.mimCobertura.nombre,
              tipoValor: t.mimTipoValorProteccion.nombre,
              cobertura: t.mimCobertura ? t.mimCobertura.nombre : null,
              desmembracionAccidente: t.mimDesmembracionPorAccidente ? t.mimDesmembracionPorAccidente.descripcion : null,
              porcentajePagoDesmembracion: t.pagoPorDesmembracionAccidental && t.pagoPorDesmembracionAccidental.toString().includes('.') ? t.pagoPorDesmembracionAccidental.toString().replace('.', ',') : t.pagoPorDesmembracionAccidental,
              fechaInicioFin: t.fechaInicio && t.fechaFin ? t.fechaInicio + ' - ' + t.fechaFin : t.fechaInicio
            };
          }),

          valoresAsegurados: x._valoresAsegurados.content.map(t => {
            return {
              nombreAmparo: t.mimPlanCobertura.mimCobertura.nombre,
              tipoValor: t.mimTipoValorAsegurado.nombre,
              cobertura: t.mimCobertura ? t.mimCobertura.nombre : null,
              rango: t.esUnRangoDePorcentaje ? 'SI' : 'NO',
              asegurado: t.porcentajeAseguradoInicial && t.porcentajeAseguradoFinal ? t.porcentajeAseguradoInicial + ' - ' + t.porcentajeAseguradoFinal : null,
              unidad: t.mimTipoReconocido ? t.mimTipoReconocido.nombre : null,
              valorAsegurado: t.valorAsegurado,
              tieneSublimite: t.tieneValorSublimite ? 'SI' : 'NO',
              tipoRestitucion: t.mimTipoValorRestitucion.nombre,
              vitalicio: t.vitalicio ? 'SI' : 'NO',
              pagoAdicional: t.pagoAdicional ? 'SI' : 'NO',
              renta: t.esUnaRenta ? 'SI' : 'NO',
              rentasPago: t.cuantasRentasPagara,
              periocidad: t.mimTipoPeriodicidad ? t.mimTipoPeriodicidad.nombre : null,
              fechaInicioFin: t.fechaVigenteInicio && t.fechaVigenteFin ? t.fechaVigenteInicio + ' - ' + t.fechaVigenteFin : t.fechaVigenteInicio
            };
          }),
          limitacionesCobertura:
            [
              ...x._limitacionCoberturaPA.content.map(t => {
                return {
                  nombreAmparo: t.mimPlanCobertura.mimCobertura.nombre,
                  diasPagoEvento: t.mimPlanCobertura.diasMaximoEvento,
                  dxEspecifico: null,
                  condicionCobertura: null,
                  diasPago: null,
                  fechaInicioFin: null,
                  antiguedadMinima: t.antiguedadMinima,
                  antiguedadMaxima: t.antiguedadMaxima,
                  tipoLimitacion: t.mimTipoLimitacion.nombre,
                  valor: t.valor,
                  fechaInicioFinPA: t.fechaInicio && t.fechaFin ? t.fechaInicio + ' - ' + t.fechaFin : t.fechaInicio,
                  nombreSublimite: null,
                  tipoSublimite: null,
                  valorSublimite: null,
                  fechaDesdeSublimite: null,
                  fechaHastaSublimite: null
                };
              }),
              ...x._limitacionCoberturaDX.content.map(t => {
                return {
                  nombreAmparo: t.mimPlanCobertura.mimCobertura.nombre,
                  diasPagoEvento: t.mimPlanCobertura.diasMaximoEvento,
                  dxEspecifico: t.sipDiagnosticos ? t.sipDiagnosticos.diagCod + ' - ' + t.sipDiagnosticos.diagDesc : null,
                  condicionCobertura: t.mimCondicionCobertura ? t.mimCondicionCobertura.nombre : null,
                  diasPago: t.maximoDiasPagar,
                  fechaInicioFin: t.fechaInicio && t.fechaFin ? t.fechaInicio + ' - ' + t.fechaFin : t.fechaInicio,
                  antiguedadMinima: null,
                  antiguedadMaxima: null,
                  tipoLimitacion: null,
                  valor: null,
                  fechaInicioFinPA: null,
                  nombreSublimite: null,
                  tipoSublimite: null,
                  valorSublimite: null,
                  fechaDesdeSublimite: null,
                  fechaHastaSublimite: null
                };
              }),
              ...x._limitacionCoberturaSL.content.map(t => {
                return {
                  nombreAmparo: t.mimPlanCobertura.mimCobertura.nombre,
                  diasPagoEvento: t.mimPlanCobertura.diasMaximoEvento,
                  dxEspecifico: null,
                  condicionCobertura: null,
                  diasPago: null,
                  fechaInicioFin: null,
                  antiguedadMinima: null,
                  antiguedadMaxima: null,
                  tipoLimitacion: null,
                  valor: null,
                  fechaInicioFinPA: null,
                  nombreSublimite: t.nombre,
                  tipoSublimite: t.mimTipoSublimites ? t.mimTipoSublimites.nombre : null,
                  valorSublimite: t.valor,
                  fechaDesdeSublimite: t.fechaInicio,
                  fechaHastaSublimite: t.fechaFin
                };
              })
            ],
          enfermedadesGraves: x._enfermedadesGraves.content.map(t => {
            return {
              nombreAmparo: t.mimPlanCobertura.mimCobertura.nombre,
              tratamiento: t.mimEnfermedadGrave.descripcion,
              tipoValor: t.mimTipoValorProteccion.nombre,
              tipoValorCodigo: t.mimTipoValorProteccion.codigo,
              valor: t.valor,
              fechaInicioFin: t.fechaInicio && t.fechaFin ? t.fechaInicio + ' - ' + t.fechaFin : t.fechaInicio
            };
          }),
          beneficiosPreexistencia: x._beneficiosPreexistencia.content.length > 0 ? x._beneficiosPreexistencia.content : null,
          condicionesAsistencia: x._condicionesAsistencia.content.reduce((s,
            {
              mimPlanCobertura,
              nombreServicio,
              mimAsistenciaPlanCoberturaDetalleList
            }) =>
            mimAsistenciaPlanCoberturaDetalleList ?
              mimAsistenciaPlanCoberturaDetalleList.map(y => {
                return {
                  ...y,
                  proveedor: y.mimProveedor.nombre,
                  aplicaPara: y.mimBeneficiarioAsistenciaList.map(j => j.mimTipoBeneficiarioServicio.nombre).join(', '),
                  servicioIlimitado: y.numeroEventos ? 'NO' : 'SI',
                  numeroEventos: y.numeroEventos,
                  unidadTiempo: y.mimUnidadTiempo ? y.mimUnidadTiempo.nombre : null,
                  fechaInicioFin: y.fechaInicio && y.fechaFin ? y.fechaInicio + ' - ' + y.fechaFin : y.fechaInicio
                };
              }).reduce((t, detalle) =>
                [...t, {
                  nombreAmparo: mimPlanCobertura.mimCobertura.nombre,
                  edadMinima: mimPlanCobertura.edadMinIngreso,
                  edadMaxima: mimPlanCobertura.edadMaxIngreso,
                  edadPermanencia: mimPlanCobertura.edadMaxPermanencia,
                  origen: mimPlanCobertura.mimOrigenPlanCoberturaList.map(j => j.mimOrigenCobertura.nombre).join(', '),
                  nombreServicio,
                  ...detalle
                }
                ], s) : [],
            []
          ),
          cargueFactores: x._cargueFactores.content.map(t => {
            return {
              nombreAmparo: t.mimPlanCobertura.nombre,
              codigoCargue: t.mimCargue.codigo,
              totalDatos: t.mimCargue.totalDatos,
              descripcion: t.mimCargue.descripcion,
              nombreTipoFactor: t.mimTipoFactor.nombre,
              fechaInicioFin: t.fechaInicio && t.fechaFin ? t.fechaInicio + ' - ' + t.fechaFin : t.fechaInicio
            };
          }),
          conceptosFacturacion: x._conceptosFacturacion.content.length > 0 ? x._conceptosFacturacion.content : null,
          distribucionCuenta: x._distribucionCuenta.content.length > 0 ? x._distribucionCuenta.content : null,
        };
      })
    ).subscribe(x => {
      this.plan = x.plan;
      this.condiciones = x.condiciones;
      this.deducibles = x.deducibles;
      this.periodosCarencia = x.periodosCarencia;
      this.exclusiones = x.exclusiones;
      this.coberturasSubsistentes = x.coberturasSubsistentes;
      this.coberturasAdicionales = x.coberturasAdicionales;
      this.valoresRescate = x.valoresRescate;
      this.valoresAsegurados = x.valoresAsegurados;
      this.desmembracionAccidentes = x.desmembracionAccidentes;
      this.limitacionesCobertura = x.limitacionesCobertura;
      this.enfermedadesGraves = x.enfermedadesGraves;
      this.beneficiosPreexistencia = x.beneficiosPreexistencia;
      this.condicionesAsistencia = x.condicionesAsistencia;
      this.cargueFactores = x.cargueFactores;
      this.conceptosFacturacion = x.conceptosFacturacion;
      this.conceptosDistribucionCuenta = x.distribucionCuenta ? x.distribucionCuenta.filter(y => y.codigoEstado === '1') : null;
      // Informamos que ya hay datos al Redux para controlar el estado del componente.
      this._datosRedux();
    }, (err) => {
      this.frontService.alert.error(err);
    });
  }

  _datosRedux() {

    if (this.plan) {
      this.store.dispatch(new DatosPlanAction(this.plan));
    }

    if (this.condiciones && this.condiciones.length > 0) {
      this.store.dispatch(new CondicionesAction(this.condiciones));
    } else {
      this.mostrarCondiciones = false;
    }

    if (this.deducibles && this.deducibles.length > 0) {
      this.store.dispatch(new DeduciblesAction(this.deducibles));
    } else {
      this.mostrarDeducibles = false;
    }

    if (this.periodosCarencia && this.periodosCarencia.length > 0) {
      this.store.dispatch(new PeriodosCarenciaAction(this.periodosCarencia));
    } else {
      this.mostrarPeriodosCarencia = false;
    }

    if (this.exclusiones && this.exclusiones.length > 0) {
      this.store.dispatch(new ExclusionesAction(this.exclusiones));
    } else {
      this.mostrarExclusiones = false;
    }

    if (this.coberturasSubsistentes && this.coberturasSubsistentes.length > 0) {
      this.store.dispatch(new CoberturasSubsistentesAction(this.coberturasSubsistentes));
    } else {
      this.mostrarCoberturasSubsistentes = false;
    }

    if (this.coberturasAdicionales && this.coberturasAdicionales.length > 0) {
      this.store.dispatch(new CoberturasAdicionalesAction(this.coberturasAdicionales));
    } else {
      this.mostrarCoberturasAdicionales = false;
    }

    if (this.valoresRescate && this.valoresRescate.length > 0) {
      this.store.dispatch(new ValoresRescateAction(this.valoresRescate));
    } else {
      this.mostrarValoresRescate = false;
    }

    if (this.desmembracionAccidentes && this.desmembracionAccidentes.length > 0) {
      this.store.dispatch(new DesmembracionAccidenteAction(this.desmembracionAccidentes));
    } else {
      this.mostrarDesmembracionAccidentes = false;
    }

    if (this.valoresAsegurados && this.valoresAsegurados.length > 0) {
      this.store.dispatch(new ValoresAseguradosAction(this.valoresAsegurados));
    } else {
      this.mostrarValoresAsegurados = false;
    }

    if (this.limitacionesCobertura && this.limitacionesCobertura.length > 0) {
      this.store.dispatch(new LimitacionesCoberturaAction(this.limitacionesCobertura));
    } else {
      this.mostrarLimitacionesCobertura = false;
    }

    if (this.enfermedadesGraves && this.enfermedadesGraves.length > 0) {
      this.store.dispatch(new EnfermedadesGravesAction(this.enfermedadesGraves));
    } else {
      this.mostrarEnfermedadesGraves = false;
    }

    if (this.beneficiosPreexistencia && this.beneficiosPreexistencia.length > 0) {
      this.store.dispatch(new BeneficiosPreexistenciaAction(this.beneficiosPreexistencia));
    } else {
      this.mostrarBeneficiosPreexistencia = false;
    }

    if (this.condicionesAsistencia && this.condicionesAsistencia.length > 0) {
      this.store.dispatch(new CondicionesAsistenciaAction(this.condicionesAsistencia));
    } else {
      this.mostrarCondicionesAsistencia = false;
    }

    if (this.cargueFactores && this.cargueFactores.length > 0) {
      this.store.dispatch(new CargueFactoresAction(this.cargueFactores));
    } else {
      this.mostrarCargueFactores = false;
    }

    if (this.conceptosFacturacion && this.conceptosFacturacion.length > 0) {
      this.store.dispatch(new ConceptosFacturacionAction(this.conceptosFacturacion));
    } else {
      this.mostrarConceptosFacturacion = false;
    }

    if (this.conceptosDistribucionCuenta && this.conceptosDistribucionCuenta.length > 0) {
      this.store.dispatch(new ConceptosDistribucionCuentaAction(this.conceptosDistribucionCuenta));
    } else {
      this.mostrarConceptosDistribucionCuenta = false;
    }
  }

  imprimirPagina() {
    window.print();
  }

  _onAtras() {
    if (this.taskId) {
      this.location.back();
    } else {
      this.router.navigate([
        UrlRoute.PAGES,
        UrlRoute.ADMINISTRACION,
        UrlRoute.ADMINSTRACION_PROTECCIONES,
        UrlRoute.ADMINISTRACION_PROTECCIONES_PLAN_COBERTURA
      ]);
    }
  }

  ngOnDestroy() {
    this._subs.forEach(x => x.unsubscribe());
  }

}

