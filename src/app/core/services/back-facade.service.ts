import { Injectable } from '@angular/core';
import { ActAuxilioFunerarioService } from './api-back.services/mimutualasociados/act-auxilio-funerario.service';
import { ActIndFechaNacimientoService } from './api-back.services/mimutualasociados/act-ind-fecha-nacimiento.service';
import { BeneficiariosAsociadosService } from './api-back.services/mimutualasociados/beneficiarios-asociados.service';
import { BeneficiariosService } from './api-back.services/mimutualasociados/beneficiarios.service';
import { CuentasContablesFacturacionService } from './api-back.services/mimutualasociados/cuentas-contables-facturacion.service';
import { MimCotizacionService } from './api-back.services/mimutualasociados/mim-cotizacion.service';
import { MimRazonDevolucionService } from './api-back.services/mimutualasociados/mim-razon-devolucion.service';
import { MimVentaService } from './api-back.services/mimutualasociados/mim-venta.service';
import { PortafolioAsociadosDetalleService } from './api-back.services/mimutualasociados/portafolio-asociados-detalle.service';
import { PreexistenciasService } from './api-back.services/mimutualasociados/preexistencias.service';
import { ProteccionesEventosService } from './api-back.services/mimutualasociados/protecciones-eventos.service';
import { SipVinculacionesService } from './api-back.services/mimutualasociados/sip-vinculaciones.service';
import { SolidaridadFacturacionService } from './api-back.services/mimutualasociados/solidaridad-facturacion.service';
import { ValorDevolverService } from './api-back.services/mimutualasociados/valor-devolver.service';
import { ConsultasTransaccionalService } from './api-back.services/mimutualauditoria/consultas-transaccional.service';
import { HistoryTaskService } from './api-back.services/mimutualflowable/history-task.service';
import { MimAsignacionDiariaService } from './api-back.services/mimutualflowable/mim-asignacion-diaria.service';
import { MimFaseSubestadoService } from './api-back.services/mimutualflowable/mim-fase-subestado.service';
import { MimFasesService } from './api-back.services/mimutualflowable/mim-fases.service';
import { MimGestionSolicitudService } from './api-back.services/mimutualflowable/mim-gestion-solicitud.service';
import { MimRolesFlujoService } from './api-back.services/mimutualflowable/mim-roles-flujo.service';
import { MimSolicitudService } from './api-back.services/mimutualflowable/mim-solicitud.service';
import { MimSubestadoService } from './api-back.services/mimutualflowable/mim-subestado.service';
import { MimTipoSolicitudService } from './api-back.services/mimutualflowable/mim-tipo-solicitud.service';
import { ProcesoService } from './api-back.services/mimutualflowable/proceso.service';
import { RuntimeService } from './api-back.services/mimutualflowable/runtime.service';
import { TareaService } from './api-back.services/mimutualflowable/tarea.service';
import { DatosAsociadosService } from './api-back.services/mimutualintegraciones/datos-asociados.service';
import { MultiactivaService } from './api-back.services/mimutualintegraciones/multiactiva.service';
import { OficinasService } from './api-back.services/mimutualintegraciones/oficinas.service';
import { BeneficioPreexistenciaService } from './api-back.services/mimutualprotecciones/beneficio-preexistencia.service';
import { BeneficioService } from './api-back.services/mimutualprotecciones/beneficio.service';
import { CanalEventoService } from './api-back.services/mimutualprotecciones/canal-evento.service';
import { CanalVentaService } from './api-back.services/mimutualprotecciones/canal-venta.service';
import { CategoriasAsociadoHomologacionService } from './api-back.services/mimutualprotecciones/categorias-asociado-homologacion.service';
import { CategoriasAsociadoService } from './api-back.services/mimutualprotecciones/categorias-asociado.service';
import { CausasIndmnizacionService } from './api-back.services/mimutualprotecciones/causas-indemnizacion.service';
import { CausasService } from './api-back.services/mimutualprotecciones/causas.service';
import { ClientesService } from './api-back.services/mimutualprotecciones/clientes.service';
import { CoberturasService } from './api-back.services/mimutualprotecciones/coberturas.service';
import { ConceptosFacturacionPlanCoberturaService } from './api-back.services/mimutualprotecciones/conceptos-facturacion-plan-cobertura.service';
import { ConceptosFacturacionService } from './api-back.services/mimutualprotecciones/conceptos-facturacion.service';
import { CondicionActivacionService } from './api-back.services/mimutualprotecciones/condicion-activacion.service';
import { CondicionCoberturaService } from './api-back.services/mimutualprotecciones/condicion-cobertura.service';
import { CondicionPagoAntiguedadService } from './api-back.services/mimutualprotecciones/condicion-pago-antiguedad.service';
import { CondicionesPagoEventoService } from './api-back.services/mimutualprotecciones/condiciones-pago-evento.service';
import { CondicionesVentaService } from './api-back.services/mimutualprotecciones/condiciones-venta.service';
import { CondicionesService } from './api-back.services/mimutualprotecciones/condiciones.service';
import { ControlAreaTecnicaService } from './api-back.services/mimutualprotecciones/control-area-tecnica.service';
import { DeduciblesService } from './api-back.services/mimutualprotecciones/deducibles.service';
import { DistribucionesService } from './api-back.services/mimutualprotecciones/distribuciones.service';
import { EnfermedadGravePlanCoberturaService } from './api-back.services/mimutualprotecciones/enfermedad-grave-plan-cobertura.service';
import { EnfermedadGraveService } from './api-back.services/mimutualprotecciones/enfermedad-grave.service';
import { EstadoAsociadoService } from './api-back.services/mimutualprotecciones/estado-asociado.service';
import { EstadoClientesService } from './api-back.services/mimutualprotecciones/estado-clientes.service';
import { EstadoCoberturasService } from './api-back.services/mimutualprotecciones/estado-coberturas.service';
import { EstadoPlanesService } from './api-back.services/mimutualprotecciones/estado-planes.service';
import { EstadoProteccionesService } from './api-back.services/mimutualprotecciones/estados-proteccion.service';
import { EventoCoberturaService } from './api-back.services/mimutualprotecciones/evento-cobertura.service';
import { EventoTipoBeneficiarioPagoService } from './api-back.services/mimutualprotecciones/evento-tipo-beneficiaro-pago.service';
import { ExcepcionDiagnosticoService } from './api-back.services/mimutualprotecciones/excepcion-diagnostico.service';
import { ExclusionPlanCoberturaService } from './api-back.services/mimutualprotecciones/exclusion-plan-cobertura.service';
import { ExclusionesCoberturaService } from './api-back.services/mimutualprotecciones/exclusiones-cobertura.service';
import { ExclusionesService } from './api-back.services/mimutualprotecciones/exclusiones.service';
import { FondosService } from './api-back.services/mimutualprotecciones/fondos.service';
import { FormulaPlanService } from './api-back.services/mimutualprotecciones/formula-plan.service';
import { TipoPeriodicidadService } from './api-back.services/mimutualprotecciones/mim-tipo-periodicidad.service';
import { TipoRestitucionDeducibleService } from './api-back.services/mimutualprotecciones/mim-tipo-restitucion-deducible.service';
import { FrecuenciaFacturacionService } from './api-back.services/mimutualprotecciones/frecuencia-facturacion.service';
import { GeneroService } from './api-back.services/mimutualprotecciones/genero.service';
import { MesAnioService } from './api-back.services/mimutualprotecciones/mes-anio.service';
import { MimActuariaService } from './api-back.services/mimutualprotecciones/mim-actuaria.service';
import { MimAdicionalPlanCoberturaService } from './api-back.services/mimutualprotecciones/mim-adicional-plan-cobertura.service';
import { MimAsistenciaPlanCoberturaService } from './api-back.services/mimutualprotecciones/mim-asistencia-plan-cobertura.service';
import { MimCondicionesTipoService } from './api-back.services/mimutualprotecciones/mim-condiciones-tipo.service';
import { MimCuentaContableService } from './api-back.services/mimutualprotecciones/mim-cuenta-contable.service';
import { MimCuentaUsoLocalService } from './api-back.services/mimutualprotecciones/mim-cuenta-uso-local.service';
import { MimDesmembracionPorAccidentePlanCoberturaService } from './api-back.services/mimutualprotecciones/mim-desmembracion-por-accidente-plan-cobertura.service';
import { MimDesmembracionPorAccidenteService } from './api-back.services/mimutualprotecciones/mim-desmemebracion-accidente.service';
import { MimEstadoPlanCoberturaService } from './api-back.services/mimutualprotecciones/mim-estado-plan-cobertura.service';
import { MimEventoService } from './api-back.services/mimutualprotecciones/mim-evento.service';
import { MimFactoresContribucionService } from './api-back.services/mimutualprotecciones/mim-factores-contribucion.service';
import { MimFactoresDistribucionService } from './api-back.services/mimutualprotecciones/mim-factores-distribucion.service';
import { MimFactoresService } from './api-back.services/mimutualprotecciones/mim-factores.service';
import { MimPeriodoService } from './api-back.services/mimutualprotecciones/mim-periodo.service';
import { MimProveedorService } from './api-back.services/mimutualprotecciones/mim-proveedor.service';
import { MimProyectoVidaService } from './api-back.services/mimutualprotecciones/mim-proyecto-vida.service';
import { MimReglasExcepcionesService } from './api-back.services/mimutualprotecciones/mim-reglas-excepciones.service';
import { MimTipoBeneficiarioServicioService } from './api-back.services/mimutualprotecciones/mim-tipo-beneficiario-servicio.service';
import { MimTipoConceptoService } from './api-back.services/mimutualprotecciones/mim-tipo-concepto.service';
import { MimTipoCotizacionService } from './api-back.services/mimutualprotecciones/mim-tipo-cotizacion.service';
import { MimTipoFactorService } from './api-back.services/mimutualprotecciones/mim-tipo-factor.service';
import { MimTipoIdentificacionService } from './api-back.services/mimutualprotecciones/mim-tipo-identificacion.service';
import { MimTipoTransaccionCuentaContableService } from './api-back.services/mimutualprotecciones/mim-tipo-transaccion-cuenta-contable.service';
import { MovimientoPlanCanalService } from './api-back.services/mimutualprotecciones/movimiento-plan-canal.service';
import { NivelRiesgoPlanService } from './api-back.services/mimutualprotecciones/nivel-riesgo-plan.service';
import { OrigenCoberturasService } from './api-back.services/mimutualprotecciones/origen-coberturas.service';
import { PlanCoberturaService } from './api-back.services/mimutualprotecciones/plan-cobertura.service';
import { PlanesService } from './api-back.services/mimutualprotecciones/planes.service';
import { PorcentajeCuotasService } from './api-back.services/mimutualprotecciones/porcentaje-cuotas.service';
import { PromocionService } from './api-back.services/mimutualprotecciones/promocion.service';
import { RelacionDistribucionCuentaService } from './api-back.services/mimutualprotecciones/relacion-distribucion-cuenta.service';
import { TipoBeneficiarioPagoService } from './api-back.services/mimutualprotecciones/tipo-beneficiario-pago.service';
import { TipoBeneficioService } from './api-back.services/mimutualprotecciones/tipo-beneficio.service';
import { TipoPlanesService } from './api-back.services/mimutualprotecciones/tipo-planes.service';
import { TipoPromocionService } from './api-back.services/mimutualprotecciones/tipo-promocion.service';
import { TiposMovimientosService } from './api-back.services/mimutualprotecciones/tipos-movimientos.service';
import { TipoValorDevolverService } from './api-back.services/mimutualprotecciones/mim-tipo-valor-devolver.service';
import { TipoValorProteccionService } from './api-back.services/mimutualprotecciones/mim-tipo-valor-proteccion.service';
import { CartaFaseService } from './api-back.services/mimutualreclamaciones/carta-fase.service';
import { ConceptoTareaFlujoService } from './api-back.services/mimutualreclamaciones/concepto-tarea-flujo.service';
import { CuentaBancoService } from './api-back.services/mimutualreclamaciones/cuenta-banco.service';
import { DetalleReclamacionesService } from './api-back.services/mimutualreclamaciones/detalle-reclamaciones.service';
import { DocumentosDocuwareService } from './api-back.services/mimutualreclamaciones/documentos-docuware.service';
import { DocumentosEventoService } from './api-back.services/mimutualreclamaciones/documentos-evento.service';
import { FaseFlujoService } from './api-back.services/mimutualreclamaciones/fase-flujo.service';
import { FormasPagoService } from './api-back.services/mimutualreclamaciones/formas-pagos.service';
import { MimEstadoCierreService } from './api-back.services/mimutualreclamaciones/mim-estado-cierre.service';
import { MimLiquidacionService } from './api-back.services/mimutualreclamaciones/mim-liquidacion.service';
import { MimRazonInsatisfaccionService } from './api-back.services/mimutualreclamaciones/mim-razon-insatisfaccion.service';
import { MimRazonNegacionService } from './api-back.services/mimutualreclamaciones/mim-razon-negacion.service';
import { NotificacionEventoService } from './api-back.services/mimutualreclamaciones/notificacion-evento.service';
import { ReclamacionesService } from './api-back.services/mimutualreclamaciones/reclamaciones.service';
import { ReclamoPorService } from './api-back.services/mimutualreclamaciones/reclamo-por.service';
import { SipLiquidacionesService } from './api-back.services/mimutualreclamaciones/sip-liquidaciones.service';
import { SipintliqService } from './api-back.services/mimutualreclamaciones/sipintliq.service';
import { SolicitudEventoService } from './api-back.services/mimutualreclamaciones/solicitud-evento.service';
import { ValidacionesService } from './api-back.services/mimutualreglas/validaciones.service';
import { DiagnosticosService } from './api-back.services/mimutualutilidades/diagnosticos.service';
import { DownloadFileService } from './api-back.services/mimutualutilidades/download-file.service';
import { GenerarCartaService } from './api-back.services/mimutualutilidades/generar-carta.service';
import { GestionDiariaService } from './api-back.services/mimutualutilidades/gestion-diaria.service';
import { MimCargueSolicitudService } from './api-back.services/mimutualutilidades/mim-cargue-solicitud.service';
import { MimColorimetriaRangoService } from './api-back.services/mimutualutilidades/mim-colorimetria-rango.service';
import { MimPreguntasService } from './api-back.services/mimutualutilidades/mim-preguntas.service';
import { MimProcesoLogService } from './api-back.services/mimutualutilidades/mim-proceso-log.service';
import { MimRazonAnulacionService } from './api-back.services/mimutualutilidades/mim-razon-anulacion.service';
import { MimRazonGlosaService } from './api-back.services/mimutualutilidades/mim-razon-glosa.service';
import { ParametroCartaService } from './api-back.services/mimutualutilidades/parametro-carta.service';
import { ParametroFirmaService } from './api-back.services/mimutualutilidades/parametro-firma.service';
import { ProcesosAutomaticosService } from './api-back.services/mimutualutilidades/procesos-automaticos.service';
import { SipParametrosService } from './api-back.services/mimutualutilidades/sip-parametros.service';
import { SipPreguntasService } from './api-back.services/mimutualutilidades/sip-preguntas.service';
import { TrabajosService } from './api-back.services/mimutualutilidades/trabajos.service';
import { UtilidadesService } from './api-back.services/mimutualutilidades/utilidades.service';
import { SisproService } from './api-back.services/sispro-oauth2/sispro.service';
import { MimTipoSubsistenteService } from './api-back.services/mimutualprotecciones/mim-tipo-subsistente.service';
import { MimUnidadTiempoService } from './api-back.services/mimutualprotecciones/mim-unidad-tiempo.service';
import { MimCondicionesReglasService } from './api-back.services/mimutualprotecciones/mimCondicionesReglas.service';
import { NivelesRiesgoCoberturaService } from './api-back.services/mimutualprotecciones/niveles-riesgo-cobertura.service';
import { NivelesRiesgoService } from './api-back.services/mimutualprotecciones/niveles-riesgo.service';
import { PeriodosCarenciaService } from './api-back.services/mimutualprotecciones/periodos-carencia.service';
import { PresentacionValorPortafolioService } from './api-back.services/mimutualprotecciones/presentacion-valor-portafolio.service';
import { ProcesoCumuloService } from './api-back.services/mimutualprotecciones/proceso-cumulo.service';
import { MimProductoCoberturaService } from './api-back.services/mimutualprotecciones/producto-cobertura.service';
import { PromotorService } from './api-back.services/mimutualprotecciones/promotor.service';
import { ReconocimientoPorPermanenciaService } from './api-back.services/mimutualprotecciones/reconocimiento-por-permanencia.service';
import { RequisitosSolicitadosService } from './api-back.services/mimutualprotecciones/requisitos-solicitados.service';
import { RolAprobadorService } from './api-back.services/mimutualprotecciones/rol-aprobador.service';
import { SublimitesCoberturaService } from './api-back.services/mimutualprotecciones/sublimites-cobertura.service';
import { SubsistentePlanCoberturaService } from './api-back.services/mimutualprotecciones/subsistente-plan-cobertura.service';
import { TipoClientesService } from './api-back.services/mimutualprotecciones/tipo-clientes.service';
import { TipoDeducibleService } from './api-back.services/mimutualprotecciones/tipo-deducible.service';
import { TipoFechaService } from './api-back.services/mimutualprotecciones/tipo-fecha.service';
import { TipoFormulaPlanService } from './api-back.services/mimutualprotecciones/tipo-formula-plan.service';
import { TipoIncrementoService } from './api-back.services/mimutualprotecciones/tipo-incremento.service';
import { TipoLimitacionService } from './api-back.services/mimutualprotecciones/tipo-limitacion.service';
import { TipoPagoService } from './api-back.services/mimutualprotecciones/tipo-pago.service';
import { TipoReconocidoService } from './api-back.services/mimutualprotecciones/tipo-reconocido.service';
import { TipoSolicitudesService } from './api-back.services/mimutualprotecciones/tipo-solicitudes.service';
import { TipoSublimitesService } from './api-back.services/mimutualprotecciones/tipo-sublimites.service';
import { TipoTopeService } from './api-back.services/mimutualprotecciones/tipo-tope.service';
import { TipoValorAseguradoService } from './api-back.services/mimutualprotecciones/tipo-valor-asegurado.service';
import { TipoValorRestitucionService } from './api-back.services/mimutualprotecciones/tipo-valor-restitucion.service';
import { TipoValorTopeService } from './api-back.services/mimutualprotecciones/tipo-valor-tope.service';
import { TipoRescateIndemnizacionService } from './api-back.services/mimutualprotecciones/tipoRescateIndemnizacion.service';
import { UnidadesCarenciaService } from './api-back.services/mimutualprotecciones/unidades-carencia.service';
import { ValorAseguradoService } from './api-back.services/mimutualprotecciones/valor-asegurado.service';
import { MimValorCuotaPlanCoberturaService } from './api-back.services/mimutualprotecciones/valor-cuota-plan-cobertura.service';
import { TipoValorCuotaService } from './api-back.services/mimutualprotecciones/valor-cuota.service';
import { ValorRescateService } from './api-back.services/mimutualprotecciones/valor-rescate.service';
import { VigenciaPlanService } from './api-back.services/mimutualprotecciones/vigencia-plan.service';
import { CampanaService } from './api-back.services/mimutualprotecciones/campana.service';
import { CampanasCoberturaService } from './api-back.services/mimutualprotecciones/campanas-cobertura-service.service';
import { CumulosService } from './api-back.services/mimutualprotecciones/cumulos.service';
import { ControlCumulosService } from './api-back.services/mimutualprotecciones/control-cumulos.service';
import { CumulosCoberturaService } from './api-back.services/mimutualprotecciones/cumulos-cobertura.service';
import { ParametrosConfiguracionOperacionesService } from './api-back.services/mimutualprotecciones/parametros-configuracion-operaciones.service';
import { MimTipoCuotaTotalService } from './api-back.services/mimutualprotecciones/mim-tipo-cuota-total.service';
import { MimParentescosService } from './api-back.services/mimutualprotecciones/mim-parentescos.service';
import { MediosFacturacionService } from './api-back.services/mimutualprotecciones/medios-facturacion.service';
import { MimEstructuraCargueService } from './api-back.services/mimutualprotecciones/mim-estructura-cargue.service';
import { PersonasService } from './api-back.services/mimutualasociados/personas.service';
import { ResponsablePersonaService } from './api-back.services/mimutualasociados/responsable-persona.service';
import { FacMoraService } from './api-back.services/mimutualasociados/fac-mora';

/**
 * @description
 * Proporciona una interfaz unificada para un conjunto de interfaces en el sistema,
 * encapsulando los subsistemas dentro de una sola interfaz.
 */
@Injectable({
  providedIn: 'root',
})
export class BackFacadeService {

  constructor(
    // sispro-oauth2
    private readonly sisproService: SisproService,

    // mimutualauditoria
    private readonly consultasTransaccionalService: ConsultasTransaccionalService,

    // mimutualreglas
    private readonly validacionesService: ValidacionesService,

    // mimutualintegraciones
    private readonly datosAsociadosService: DatosAsociadosService,
    private readonly multiactivaService: MultiactivaService,
    private readonly oficinasService: OficinasService,

    // mimutualprotecciones
    private readonly tipoBeneficioService: TipoBeneficioService,
    private readonly tipoPromocionService: TipoPromocionService,
    private readonly generoService: GeneroService,
    private readonly promocionService: PromocionService,
    private readonly beneficioService: BeneficioService,
    private readonly canalVentaService: CanalVentaService,
    private readonly estadoAsociadoService: EstadoAsociadoService,
    private readonly eventoTipoBeneficiarioPagoService: EventoTipoBeneficiarioPagoService,
    private readonly mimCondicionesTipoService: MimCondicionesTipoService,
    private readonly mimEventoService: MimEventoService,
    private readonly mimProyectoVidaService: MimProyectoVidaService,
    private readonly mimTipoIdentificacionService: MimTipoIdentificacionService,
    private readonly movimientoPlanCanalService: MovimientoPlanCanalService,
    private readonly nivelRiesgoPlanService: NivelRiesgoPlanService,
    private readonly origenCoberturasService: OrigenCoberturasService,
    private readonly planCoberturaService: PlanCoberturaService,
    private readonly planesService: PlanesService,
    private readonly porcentajeCuotasService: PorcentajeCuotasService,
    private readonly proteccionesEventosService: ProteccionesEventosService,
    private readonly tipoBeneficiarioPagoService: TipoBeneficiarioPagoService,
    private readonly tipoPlanesService: TipoPlanesService,
    private readonly tiposMovimientosService: TiposMovimientosService,
    private readonly canalEventoService: CanalEventoService,
    private readonly eventoCoberturaService: EventoCoberturaService,
    private readonly mimActuariaService: MimActuariaService,
    private readonly mimFactoresService: MimFactoresService,
    private readonly mimPeriodoService: MimPeriodoService,
    private readonly mimTipoFactorService: MimTipoFactorService,
    private readonly mimFactoresContribucionService: MimFactoresContribucionService,
    private readonly mimFactoresDistribucionService: MimFactoresDistribucionService,
    private readonly distribucionesService: DistribucionesService,
    private readonly mimCuentaContableService: MimCuentaContableService,
    private readonly mimCuentaUsoLocalService: MimCuentaUsoLocalService,
    private readonly mimTipoTransaccionCuentaContableService: MimTipoTransaccionCuentaContableService,
    private readonly relacionDistribucionCuentaService: RelacionDistribucionCuentaService,
    private readonly beneficioPreexistenciaService: BeneficioPreexistenciaService,
    private readonly categoriasAsociadoHomologacionService: CategoriasAsociadoHomologacionService,
    private readonly categoriasAsociadoService: CategoriasAsociadoService,
    private readonly causasIndmnizacionService: CausasIndmnizacionService,
    private readonly causasService: CausasService,
    private readonly clientesService: ClientesService,
    private readonly coberturasService: CoberturasService,
    private readonly conceptosFacturacionPlanCoberturaService: ConceptosFacturacionPlanCoberturaService,
    private readonly conceptosFacturacionService: ConceptosFacturacionService,
    private readonly condicionActivacionService: CondicionActivacionService,
    private readonly condicionCoberturaService: CondicionCoberturaService,
    private readonly condicionPagoAntiguedadService: CondicionPagoAntiguedadService,
    private readonly condicionesPagoEventoService: CondicionesPagoEventoService,
    private readonly condicionesVentaService: CondicionesVentaService,
    private readonly condicionesService: CondicionesService,
    private readonly controlAreaTecnicaService: ControlAreaTecnicaService,
    private readonly deduciblesService: DeduciblesService,
    private readonly enfermedadGravePlanCoberturaService: EnfermedadGravePlanCoberturaService,
    private readonly enfermedadGraveService: EnfermedadGraveService,
    private readonly estadoClientesService: EstadoClientesService,
    private readonly estadoCoberturasService: EstadoCoberturasService,
    private readonly estadoPlanesService: EstadoPlanesService,
    private readonly estadoProteccionesService: EstadoProteccionesService,
    private readonly excepcionDiagnosticoService: ExcepcionDiagnosticoService,
    private readonly exclusionPlanCoberturaService: ExclusionPlanCoberturaService,
    private readonly exclusionesCoberturaService: ExclusionesCoberturaService,
    private readonly exclusionesService: ExclusionesService,
    private readonly fondosService: FondosService,
    private readonly formulaPlanService: FormulaPlanService,
    private readonly frecuenciaFacturacionService: FrecuenciaFacturacionService,
    private readonly mesAnioService: MesAnioService,
    private readonly mimAdicionalPlanCoberturaService: MimAdicionalPlanCoberturaService,
    private readonly mimAsistenciaPlanCoberturaService: MimAsistenciaPlanCoberturaService,
    private readonly mimDesmembracionPorAccidenteService: MimDesmembracionPorAccidenteService,
    private readonly mimDesmembracionPorAccidentePlanCoberturaService: MimDesmembracionPorAccidentePlanCoberturaService,
    private readonly mimEstadoPlanCoberturaService: MimEstadoPlanCoberturaService,
    private readonly mimProveedorService: MimProveedorService,
    private readonly mimReglasExcepcionesService: MimReglasExcepcionesService,
    private readonly mimTipoBeneficiarioServicioService: MimTipoBeneficiarioServicioService,
    private readonly mimTipoConceptoService: MimTipoConceptoService,
    private readonly mimTipoCotizacionService: MimTipoCotizacionService,
    private readonly tipoPeriodicidadService: TipoPeriodicidadService,
    private readonly tipoRestitucionDeducibleService: TipoRestitucionDeducibleService,
    private readonly mimTipoSubsistenteService: MimTipoSubsistenteService,
    private readonly tipoValorDevolverService: TipoValorDevolverService,
    private readonly tipoValorProteccionService: TipoValorProteccionService,
    private readonly mimUnidadTiempoService: MimUnidadTiempoService,
    private readonly mimCondicionesReglasService: MimCondicionesReglasService,
    private readonly nivelesRiesgoCoberturaService: NivelesRiesgoCoberturaService,
    private readonly nivelesRiesgoService: NivelesRiesgoService,
    private readonly periodosCarenciaService: PeriodosCarenciaService,
    private readonly presentacionValorPortafolioService: PresentacionValorPortafolioService,
    private readonly procesoCumuloService: ProcesoCumuloService,
    private readonly mimProductoCoberturaService: MimProductoCoberturaService,
    private readonly promotorService: PromotorService,
    private readonly reconocimientoPorPermanenciaService: ReconocimientoPorPermanenciaService,
    private readonly requisitosSolicitadosService: RequisitosSolicitadosService,
    private readonly rolAprobadorService: RolAprobadorService,
    private readonly sublimitesCoberturaService: SublimitesCoberturaService,
    private readonly subsistentePlanCoberturaService: SubsistentePlanCoberturaService,
    private readonly tipoClientesService: TipoClientesService,
    private readonly tipoDeducibleService: TipoDeducibleService,
    private readonly tipoFechaService: TipoFechaService,
    private readonly tipoFormulaPlanService: TipoFormulaPlanService,
    private readonly tipoIncrementoService: TipoIncrementoService,
    private readonly tipoLimitacionService: TipoLimitacionService,
    private readonly tipoPagoService: TipoPagoService,
    private readonly tipoReconocidoService: TipoReconocidoService,
    private readonly tipoSolicitudesService: TipoSolicitudesService,
    private readonly tipoSublimitesService: TipoSublimitesService,
    private readonly tipoTopeService: TipoTopeService,
    private readonly tipoValorAseguradoService: TipoValorAseguradoService,
    private readonly tipoValorRestitucionService: TipoValorRestitucionService,
    private readonly tipoValorTopeService: TipoValorTopeService,
    private readonly tipoRescateIndemnizacionService: TipoRescateIndemnizacionService,
    private readonly unidadesCarenciaService: UnidadesCarenciaService,
    private readonly valorAseguradoService: ValorAseguradoService,
    private readonly mimValorCuotaPlanCoberturaService: MimValorCuotaPlanCoberturaService,
    private readonly tipoValorCuotaService: TipoValorCuotaService,
    private readonly valorRescateService: ValorRescateService,
    private readonly vigenciaPlanService: VigenciaPlanService,
    private readonly campanaService: CampanaService,
    private readonly campanasCoberturaService: CampanasCoberturaService,
    private readonly cumulosService: CumulosService,
    private readonly controlCumulosService: ControlCumulosService,
    private readonly cumulosCoberturaService: CumulosCoberturaService,
    private readonly parametrosConfiguracionOperacionesService: ParametrosConfiguracionOperacionesService,
    private readonly mimTipoCuotaTotalService: MimTipoCuotaTotalService,
    private readonly mimParentescosService: MimParentescosService,
    private readonly mediosFacturacionService: MediosFacturacionService,
    private readonly mimEstructuraCargueService: MimEstructuraCargueService,

    // mimutualasociados
    private readonly beneficiariosAsociadosService: BeneficiariosAsociadosService,
    private readonly beneficiariosService: BeneficiariosService,
    private readonly sipVinculacionesService: SipVinculacionesService,
    private readonly preexistenciasService: PreexistenciasService,
    private readonly actIndFechaNacimientoService: ActIndFechaNacimientoService,
    private readonly actAuxilioFunerarioService: ActAuxilioFunerarioService,
    private readonly mimCotizacionService: MimCotizacionService,
    private readonly mimRazonDevolucionService: MimRazonDevolucionService,
    private readonly valorDevolverService: ValorDevolverService,
    private readonly portafolioAsociadosDetalleService: PortafolioAsociadosDetalleService,
    private readonly mimVentaService: MimVentaService,
    private readonly solidaridadFacturacionService: SolidaridadFacturacionService,
    private readonly cuentasContablesFacturacionService: CuentasContablesFacturacionService,
    private readonly personasService: PersonasService,
    private readonly responsablePersonaService: ResponsablePersonaService,
    private readonly facMoraService: FacMoraService,

    // mimutualreclamaciones
    private readonly documentosDocuwareService: DocumentosDocuwareService,
    private readonly cartaFaseService: CartaFaseService,
    private readonly conceptoTareaFlujoService: ConceptoTareaFlujoService,
    private readonly cuentaBancoService: CuentaBancoService,
    private readonly detalleReclamacionesService: DetalleReclamacionesService,
    private readonly faseFlujoService: FaseFlujoService,
    private readonly formasPagoService: FormasPagoService,
    private readonly mimLiquidacionService: MimLiquidacionService,
    private readonly mimRazonInsatisfaccionService: MimRazonInsatisfaccionService,
    private readonly mimRazonNegacionService: MimRazonNegacionService,
    private readonly reclamacionesService: ReclamacionesService,
    private readonly sipLiquidacionesService: SipLiquidacionesService,
    private readonly sipintliqService: SipintliqService,
    private readonly mimEstadoCierreService: MimEstadoCierreService,
    private readonly solicitudEventoService: SolicitudEventoService,
    private readonly notificacionEventoService: NotificacionEventoService,
    private readonly documentosEventoService: DocumentosEventoService,
    private readonly reclamoPorService: ReclamoPorService,

    // mimutualutilidades
    private readonly sipParametrosService: SipParametrosService,
    private readonly mimColorimetriaRangoService: MimColorimetriaRangoService,
    private readonly diagnosticosService: DiagnosticosService,
    private readonly downloadFileService: DownloadFileService,
    private readonly generarCartaService: GenerarCartaService,
    private readonly mimCargueSolicitudService: MimCargueSolicitudService,
    private readonly mimPreguntasService: MimPreguntasService,
    private readonly mimRazonAnulacionService: MimRazonAnulacionService,
    private readonly parametroCartaService: ParametroCartaService,
    private readonly parametroFirmaService: ParametroFirmaService,
    private readonly sipPreguntasService: SipPreguntasService,
    private readonly trabajosService: TrabajosService,
    private readonly utilidadesService: UtilidadesService,
    private readonly mimRazonGlosaService: MimRazonGlosaService,
    private readonly procesosAutomaticosService: ProcesosAutomaticosService,
    private readonly gestionDiariaService: GestionDiariaService,
    private readonly mimProcesoLogService: MimProcesoLogService,

    // mimutualflowable
    private readonly runtimeService: RuntimeService,
    private readonly historyTaskService: HistoryTaskService,
    private readonly mimFaseSubestadoService: MimFaseSubestadoService,
    private readonly mimFasesService: MimFasesService,
    private readonly mimSolicitudService: MimSolicitudService,
    private readonly mimSubestadoService: MimSubestadoService,
    private readonly mimTipoSolicitudService: MimTipoSolicitudService,
    private readonly procesoService: ProcesoService,
    private readonly tareaService: TareaService,
    private readonly mimGestionSolicitudService: MimGestionSolicitudService,
    private readonly mimAsignacionDiariaService: MimAsignacionDiariaService,
    private readonly mimRolesFlujoService: MimRolesFlujoService


  ) { }

  // sispro-oauth2
  public get sispro(): SisproService {
    return this.sisproService;
  }

  // mimutualauditoria
  public get consultasTransaccional(): ConsultasTransaccionalService {
    return this.consultasTransaccionalService;
  }

  // mimutualreglas
  public get validaciones(): ValidacionesService {
    return this.validacionesService;
  }

  // mimutualintegraciones
  public get asociado(): DatosAsociadosService {
    return this.datosAsociadosService;
  }

  public get multiactiva(): MultiactivaService {
    return this.multiactivaService;
  }

  public get oficinas(): OficinasService {
    return this.oficinasService;
  }

  // mimutualprotecciones
  public get tipoBeneficio(): TipoBeneficioService {
    return this.tipoBeneficioService;
  }

  public get tipoPromocion(): TipoPromocionService {
    return this.tipoPromocionService;
  }

  public get genero(): GeneroService {
    return this.generoService;
  }

  public get promocion(): PromocionService {
    return this.promocionService;
  }

  public get beneficio(): BeneficioService {
    return this.beneficioService;
  }

  public get canal(): CanalVentaService {
    return this.canalVentaService;
  }

  public get estadoAsociado(): EstadoAsociadoService {
    return this.estadoAsociadoService;
  }

  public get eventoTipoBeneficiarioPago(): EventoTipoBeneficiarioPagoService {
    return this.eventoTipoBeneficiarioPagoService;
  }

  public get condicionesTipo(): MimCondicionesTipoService {
    return this.mimCondicionesTipoService;
  }

  public get evento(): MimEventoService {
    return this.mimEventoService;
  }

  public get proyectoVida(): MimProyectoVidaService {
    return this.mimProyectoVidaService;
  }

  public get tipoIdentificacion(): MimTipoIdentificacionService {
    return this.mimTipoIdentificacionService;
  }

  public get movimientoPlanCanal(): MovimientoPlanCanalService {
    return this.movimientoPlanCanalService;
  }

  public get nivelRiesgoPlan(): NivelRiesgoPlanService {
    return this.nivelRiesgoPlanService;
  }

  public get origenCoberturas(): OrigenCoberturasService {
    return this.origenCoberturasService;
  }

  public get planCobertura(): PlanCoberturaService {
    return this.planCoberturaService;
  }

  public get planes(): PlanesService {
    return this.planesService;
  }

  public get porcentajeCuotas(): PorcentajeCuotasService {
    return this.porcentajeCuotasService;
  }

  public get tipoBeneficiarioPago(): TipoBeneficiarioPagoService {
    return this.tipoBeneficiarioPagoService;
  }

  public get tipoPlanes(): TipoPlanesService {
    return this.tipoPlanesService;
  }

  public get canalEvento(): CanalEventoService {
    return this.canalEventoService;
  }

  public get tiposMovimientos(): TiposMovimientosService {
    return this.tiposMovimientosService;
  }

  public get eventoCobertura(): EventoCoberturaService {
    return this.eventoCoberturaService;
  }

  public get actuaria(): MimActuariaService {
    return this.mimActuariaService;
  }

  public get factores(): MimFactoresService {
    return this.mimFactoresService;
  }

  public get periodo(): MimPeriodoService {
    return this.mimPeriodoService;
  }

  public get tipoFactor(): MimTipoFactorService {
    return this.mimTipoFactorService;
  }

  public get factoresContribucion(): MimFactoresContribucionService {
    return this.mimFactoresContribucionService;
  }

  public get factoresDistribucion(): MimFactoresDistribucionService {
    return this.mimFactoresDistribucionService;
  }

  public get distribuciones(): DistribucionesService {
    return this.distribucionesService;
  }

  public get cuentaContable(): MimCuentaContableService {
    return this.mimCuentaContableService;
  }

  public get cuentaUsoLocal(): MimCuentaUsoLocalService {
    return this.mimCuentaUsoLocalService;
  }

  public get tipoTransaccionCuentaContable(): MimTipoTransaccionCuentaContableService {
    return this.mimTipoTransaccionCuentaContableService;
  }

  public get relacionDistribucionCuenta(): RelacionDistribucionCuentaService {
    return this.relacionDistribucionCuentaService;
  }

  public get beneficioPreexistencia(): BeneficioPreexistenciaService {
    return this.beneficioPreexistenciaService;
  }

  public get categoriaAsociadoHomologacion(): CategoriasAsociadoHomologacionService {
    return this.categoriasAsociadoHomologacionService;
  }

  public get categoriasAsociado(): CategoriasAsociadoService {
    return this.categoriasAsociadoService;
  }

  public get causaIndemnizacion(): CausasIndmnizacionService {
    return this.causasIndmnizacionService;
  }

  public get causa(): CausasService {
    return this.causasService;
  }

  public get cliente(): ClientesService {
    return this.clientesService;
  }

  public get cobertura(): CoberturasService {
    return this.coberturasService;
  }

  public get conceptoFacturacionPlanCobertura(): ConceptosFacturacionPlanCoberturaService {
    return this.conceptosFacturacionPlanCoberturaService;
  }

  public get conceptoFacturacion(): ConceptosFacturacionService {
    return this.conceptosFacturacionService;
  }

  public get condicionActivacion(): CondicionActivacionService {
    return this.condicionActivacionService;
  }

  public get condicionCobertura(): CondicionCoberturaService {
    return this.condicionCoberturaService;
  }

  public get condicionPagoAntiguedad(): CondicionPagoAntiguedadService {
    return this.condicionPagoAntiguedadService;
  }

  public get condicionPagoEvento(): CondicionesPagoEventoService {
    return this.condicionesPagoEventoService;
  }

  public get condicionVenta(): CondicionesVentaService {
    return this.condicionesVentaService;
  }

  public get condicion(): CondicionesService {
    return this.condicionesService;
  }

  public get controlAreaTecnica(): ControlAreaTecnicaService {
    return this.controlAreaTecnicaService;
  }

  public get deducible(): DeduciblesService {
    return this.deduciblesService;
  }

  public get enfermedadGravePlanCobertura(): EnfermedadGravePlanCoberturaService {
    return this.enfermedadGravePlanCoberturaService;
  }

  public get enfermedadGrave(): EnfermedadGraveService {
    return this.enfermedadGraveService;
  }

  public get estadoCliente(): EstadoClientesService {
    return this.estadoClientesService;
  }

  public get estadoCobertura(): EstadoCoberturasService {
    return this.estadoCoberturasService;
  }

  public get estadoPlan(): EstadoPlanesService {
    return this.estadoPlanesService;
  }

  public get estadoProteccion(): EstadoProteccionesService {
    return this.estadoProteccionesService;
  }

  public get excepcionDiagnostico(): ExcepcionDiagnosticoService {
    return this.excepcionDiagnosticoService;
  }

  public get exclusionPlanCobertura(): ExclusionPlanCoberturaService {
    return this.exclusionPlanCoberturaService;
  }

  public get exclusionCobertura(): ExclusionesCoberturaService {
    return this.exclusionesCoberturaService;
  }

  public get exclusion(): ExclusionesService {
    return this.exclusionesService;
  }

  public get fondo(): FondosService {
    return this.fondosService;
  }

  public get formulaPlan(): FormulaPlanService {
    return this.formulaPlanService;
  }

  public get frecuenciaFacturacion(): FrecuenciaFacturacionService {
    return this.frecuenciaFacturacionService;
  }

  public get mes(): MesAnioService {
    return this.mesAnioService;
  }

  public get adicionalPlanCobertura(): MimAdicionalPlanCoberturaService {
    return this.mimAdicionalPlanCoberturaService;
  }

  public get asistenciaPlanCobertura(): MimAsistenciaPlanCoberturaService {
    return this.mimAsistenciaPlanCoberturaService;
  }

  public get desmembracionAccidente(): MimDesmembracionPorAccidenteService {
    return this.mimDesmembracionPorAccidenteService;
  }

  public get desmembracionAccidentePlanCobertura(): MimDesmembracionPorAccidentePlanCoberturaService {
    return this.mimDesmembracionPorAccidentePlanCoberturaService;
  }

  public get estadoPlanCobertura(): MimEstadoPlanCoberturaService {
    return this.mimEstadoPlanCoberturaService;
  }

  public get proveedor(): MimProveedorService {
    return this.mimProveedorService;
  }

  public get reglaExcepcion(): MimReglasExcepcionesService {
    return this.mimReglasExcepcionesService;
  }

  public get tipoBeneficiarioServicio(): MimTipoBeneficiarioServicioService {
    return this.mimTipoBeneficiarioServicioService;
  }

  public get tipoConcepto(): MimTipoConceptoService {
    return this.mimTipoConceptoService;
  }

  public get tipoCotizacion(): MimTipoCotizacionService {
    return this.mimTipoCotizacionService;
  }

  public get tipoPeriodicidad(): TipoPeriodicidadService {
    return this.tipoPeriodicidadService;
  }

  public get tipoRestitucionDeducible(): TipoRestitucionDeducibleService {
    return this.tipoRestitucionDeducibleService;
  }

  public get tipoSubsistente(): MimTipoSubsistenteService {
    return this.mimTipoSubsistenteService;
  }

  public get tipoValorDevolver(): TipoValorDevolverService {
    return this.tipoValorDevolverService;
  }

  public get tipoValorProteccion(): TipoValorProteccionService {
    return this.tipoValorProteccionService;
  }

  public get responsablePersonas(): ResponsablePersonaService {
    return this.responsablePersonaService;
  }
  public get facMora(): FacMoraService {
    return this.facMoraService;
  }

  public get unidadTiempo(): MimUnidadTiempoService {
    return this.mimUnidadTiempoService;
  }

  public get condicionRegla(): MimCondicionesReglasService {
    return this.mimCondicionesReglasService;
  }

  public get nivelRiesgoCobertura(): NivelesRiesgoCoberturaService {
    return this.nivelesRiesgoCoberturaService;
  }

  public get nivelRiesgo(): NivelesRiesgoService {
    return this.nivelesRiesgoService;
  }

  public get periodoCarencia(): PeriodosCarenciaService {
    return this.periodosCarenciaService;
  }

  public get presentacionValorPortafolio(): PresentacionValorPortafolioService {
    return this.presentacionValorPortafolioService;
  }

  public get procesoCumulo(): ProcesoCumuloService {
    return this.procesoCumuloService;
  }

  public get productoCobertura(): MimProductoCoberturaService {
    return this.mimProductoCoberturaService;
  }

  public get promotor(): PromotorService {
    return this.promotorService;
  }

  public get reconocimientoPermanencia(): ReconocimientoPorPermanenciaService {
    return this.reconocimientoPorPermanenciaService;
  }

  public get requisitoSolicitado(): RequisitosSolicitadosService {
    return this.requisitosSolicitadosService;
  }

  public get rolAprobador(): RolAprobadorService {
    return this.rolAprobadorService;
  }

  public get sublimiteCobertura(): SublimitesCoberturaService {
    return this.sublimitesCoberturaService;
  }

  public get subsistentePlanCobertura(): SubsistentePlanCoberturaService {
    return this.subsistentePlanCoberturaService;
  }

  public get tipoCliente(): TipoClientesService {
    return this.tipoClientesService;
  }

  public get tipoDeducible(): TipoDeducibleService {
    return this.tipoDeducibleService;
  }

  public get tipoFecha(): TipoFechaService {
    return this.tipoFechaService;
  }

  public get tipoFormulaPlan(): TipoFormulaPlanService {
    return this.tipoFormulaPlanService;
  }

  public get tipoIncremento(): TipoIncrementoService {
    return this.tipoIncrementoService;
  }

  public get tipoLimitacion(): TipoLimitacionService {
    return this.tipoLimitacionService;
  }

  public get tipoPago(): TipoPagoService {
    return this.tipoPagoService;
  }

  public get tipoReconocido(): TipoReconocidoService {
    return this.tipoReconocidoService;
  }

  public get tipoSolicitudes(): TipoSolicitudesService {
    return this.tipoSolicitudesService;
  }

  public get tipoSublimite(): TipoSublimitesService {
    return this.tipoSublimitesService;
  }

  public get tipoTope(): TipoTopeService {
    return this.tipoTopeService;
  }

  public get tipoValorAsegurado(): TipoValorAseguradoService {
    return this.tipoValorAseguradoService;
  }

  public get tipoValorRestitucion(): TipoValorRestitucionService {
    return this.tipoValorRestitucionService;
  }

  public get tipoValorTope(): TipoValorTopeService {
    return this.tipoValorTopeService;
  }

  public get tipoRescateIndemnizacion(): TipoRescateIndemnizacionService {
    return this.tipoRescateIndemnizacionService;
  }

  public get unidadesCarencia(): UnidadesCarenciaService {
    return this.unidadesCarenciaService;
  }

  public get valorAsegurado(): ValorAseguradoService {
    return this.valorAseguradoService;
  }

  public get valorCuotaPlanCobertura(): MimValorCuotaPlanCoberturaService {
    return this.mimValorCuotaPlanCoberturaService;
  }

  public get tipoValorCuota(): TipoValorCuotaService {
    return this.tipoValorCuotaService;
  }

  public get valorRescate(): ValorRescateService {
    return this.valorRescateService;
  }

  public get vigenciaPlan(): VigenciaPlanService {
    return this.vigenciaPlanService;
  }

  public get campanaEndoso(): CampanaService {
    return this.campanaService;
  }

  public get campanaCobertura(): CampanasCoberturaService {
    return this.campanasCoberturaService;
  }

  public get cumulo(): CumulosService {
    return this.cumulosService;
  }

  public get controlCumulo(): ControlCumulosService {
    return this.controlCumulosService;
  }

  public get cumuloCobertura(): CumulosCoberturaService {
    return this.cumulosCoberturaService;
  }

  public get tipoCuotaTotalService(): MimTipoCuotaTotalService {
    return this.mimTipoCuotaTotalService;
  }

  public get parentescos(): MimParentescosService {
    return this.mimParentescosService;
  }

  public get tip(): ParametrosConfiguracionOperacionesService {
    return this.parametrosConfiguracionOperacionesService;
  }

  public get parametroConfiguracionOperaciones(): ParametrosConfiguracionOperacionesService {
    return this.parametrosConfiguracionOperacionesService;
  }

  public get mediosFacturacion(): MediosFacturacionService {
    return this.mediosFacturacionService;
  }

  public get estructuraCargue(): MimEstructuraCargueService {
    return this.mimEstructuraCargueService;
  }

  // mimutualasociados
  public get beneficiario(): BeneficiariosAsociadosService {
    return this.beneficiariosAsociadosService;
  }

  public get beneficiarios(): BeneficiariosService {
    return this.beneficiariosService;
  }

  public get vinculacion(): SipVinculacionesService {
    return this.sipVinculacionesService;
  }

  public get preexistencia(): PreexistenciasService {
    return this.preexistenciasService;
  }

  public get fechaNacimiento(): ActIndFechaNacimientoService {
    return this.actIndFechaNacimientoService;
  }

  public get auxilioFunerario(): ActAuxilioFunerarioService {
    return this.actAuxilioFunerarioService;
  }

  public get cotizacion(): MimCotizacionService {
    return this.mimCotizacionService;
  }

  public get razonDevolucion(): MimRazonDevolucionService {
    return this.mimRazonDevolucionService;
  }

  public get proteccionesEventos(): ProteccionesEventosService {
    return this.proteccionesEventosService;
  }

  public get valorDevolver(): ValorDevolverService {
    return this.valorDevolverService;
  }

  public get portafolioAsociadosDetalle(): PortafolioAsociadosDetalleService {
    return this.portafolioAsociadosDetalleService;
  }

  public get venta(): MimVentaService {
    return this.mimVentaService;
  }

  public get solidaridadFacturacion(): SolidaridadFacturacionService {
    return this.solidaridadFacturacionService;
  }

  public get cuentasContablesFacturacion(): CuentasContablesFacturacionService {
    return this.cuentasContablesFacturacionService;
  }

  public get personas(): PersonasService {
    return this.personasService;
  }

  // mimutualreclamaciones
  public get documentosDocuware(): DocumentosDocuwareService {
    return this.documentosDocuwareService;
  }

  public get cartaFase(): CartaFaseService {
    return this.cartaFaseService;
  }

  public get conceptoTareaFlujo(): ConceptoTareaFlujoService {
    return this.conceptoTareaFlujoService;
  }

  public get cuentaBanco(): CuentaBancoService {
    return this.cuentaBancoService;
  }

  public get detalleReclamaciones(): DetalleReclamacionesService {
    return this.detalleReclamacionesService;
  }

  public get faseFlujo(): FaseFlujoService {
    return this.faseFlujoService;
  }

  public get formasPago(): FormasPagoService {
    return this.formasPagoService;
  }

  public get liquidacion(): MimLiquidacionService {
    return this.mimLiquidacionService;
  }

  public get razonInsatisfaccion(): MimRazonInsatisfaccionService {
    return this.mimRazonInsatisfaccionService;
  }

  public get razonNegacion(): MimRazonNegacionService {
    return this.mimRazonNegacionService;
  }

  public get reclamaciones(): ReclamacionesService {
    return this.reclamacionesService;
  }

  public get liquidaciones(): SipLiquidacionesService {
    return this.sipLiquidacionesService;
  }

  public get sipintliq(): SipintliqService {
    return this.sipintliqService;
  }

  public get estadoCierre(): MimEstadoCierreService {
    return this.mimEstadoCierreService;
  }

  public get solicitudEvento(): SolicitudEventoService {
    return this.solicitudEventoService;
  }

  public get notificacionEvento(): NotificacionEventoService {
    return this.notificacionEventoService;
  }

  public get documentosEvento(): DocumentosEventoService {
    return this.documentosEventoService;
  }

  public get reclamoPor(): ReclamoPorService {
    return this.reclamoPorService;
  }

  // mimutualutilidades
  public get parametro(): SipParametrosService {
    return this.sipParametrosService;
  }

  public get colorimetria(): MimColorimetriaRangoService {
    return this.mimColorimetriaRangoService;
  }

  public get diagnostico(): DiagnosticosService {
    return this.diagnosticosService;
  }

  public get downloadFile(): DownloadFileService {
    return this.downloadFileService;
  }

  public get generarCarta(): GenerarCartaService {
    return this.generarCartaService;
  }

  public get cargueSolicitud(): MimCargueSolicitudService {
    return this.mimCargueSolicitudService;
  }

  public get preguntas(): MimPreguntasService {
    return this.mimPreguntasService;
  }

  public get razonAnulacion(): MimRazonAnulacionService {
    return this.mimRazonAnulacionService;
  }

  public get parametroCarta(): ParametroCartaService {
    return this.parametroCartaService;
  }

  public get parametroFirma(): ParametroFirmaService {
    return this.parametroFirmaService;
  }

  public get sipPreguntas(): SipPreguntasService {
    return this.sipPreguntasService;
  }

  public get trabajos(): TrabajosService {
    return this.trabajosService;
  }

  public get utilidades(): UtilidadesService {
    return this.utilidadesService;
  }

  public get razonGlosa(): MimRazonGlosaService {
    return this.mimRazonGlosaService;
  }

  public get procesosAutomaticos(): ProcesosAutomaticosService {
    return this.procesosAutomaticosService;
  }

  public get gestionDiaria(): GestionDiariaService {
    return this.gestionDiariaService;
  }

  public get procesoLog(): MimProcesoLogService {
    return this.mimProcesoLogService;
  }

  // mimutualflowable
  public get runtime(): RuntimeService {
    return this.runtimeService;
  }

  public get historyTask(): HistoryTaskService {
    return this.historyTaskService;
  }

  public get faseSubestado(): MimFaseSubestadoService {
    return this.mimFaseSubestadoService;
  }

  public get fases(): MimFasesService {
    return this.mimFasesService;
  }

  public get solicitud(): MimSolicitudService {
    return this.mimSolicitudService;
  }

  public get subestado(): MimSubestadoService {
    return this.mimSubestadoService;
  }

  public get tipoSolicitud(): MimTipoSolicitudService {
    return this.mimTipoSolicitudService;
  }

  public get proceso(): ProcesoService {
    return this.procesoService;
  }

  public get tarea(): TareaService {
    return this.tareaService;
  }

  public get gestionSolicitud(): MimGestionSolicitudService {
    return this.mimGestionSolicitudService;
  }

  public get asignacionDiaria(): MimAsignacionDiariaService {
    return this.mimAsignacionDiariaService;
  }

  public get rolesFlujo(): MimRolesFlujoService {
    return this.mimRolesFlujoService;
  }

}

