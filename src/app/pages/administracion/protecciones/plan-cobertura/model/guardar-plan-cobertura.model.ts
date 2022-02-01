import { MimPlanCobertura, IMimPlanCobertura } from './mim-plan-cobertura.model';
import { MimPeriodoCarencia, IMimPeriodoCarencia } from './mim-periodo-carencia.model';
import { IPage, Page } from '@shared/interfaces/page.interface';
import { MimDeducible, IMimDeducible } from './mim-deducible.model';
import { GuardarPlanCoberturaOrden, IGuardarPlanCoberturaOrden } from './guardar-plan-cobertura-orden.model';
import { MimValorRescate, IMimValorRescate } from './mim-valor-rescate.model';
import { MimExclusionPlanCobertura, IMimExclusionPlanCobertura } from './mim-exclusion-plan-cobertura.model';
import { MimSubsistentePlanCobertura, IMimSubsistentePlanCobertura } from './mim-subsistente-plan-cobertura.model';
import { MimAsistenciaPlanCobertura, IMimAsistenciaPlanCobertura } from './mim-asistencia-plan-cobertura.model';
import { MimCondicion, IMimCondicion } from './mim-condicion.model';
import { MimValorAsegurado, IMimValorAsegurado } from './mim-valor-asegurado.model';
import { MimExcepcionDiagnostico, IMimExcepcionDiagnostico } from './mim-excepcion-diagnostico';
import { MimCondicionPagoAntiguedad, IMimCondicionPagoAntiguedad } from './mim-condicion-pago-antiguedad';
import { MimSublimiteCobertura, IMimSublimiteCobertura } from './mim-sublimite-cobertura.model';
import { MimAdicionalPlanCobertura, IMimAdicionalPlanCobertura } from './mim-adicional-plan-cobertura.model';
import { IMimBeneficioPreexistencia, MimBeneficioPreexistencia } from './mim-beneficio-preexistencia.model';
import { MimEnfermedadGravePlanCobertura, IMimEnfermedadGravePlanCobertura } from './mim-enfermedad-grave-plan-cobertura.model';
import { MimConceptoFacturacionPlanCobertura, IMimConceptoFacturacionPlanCobertura } from './mim-concepto-facturacion-plan-cobertura.model';
import { MimDesmembracionAccidente } from './mim-desmembracion-accidente.model';
import { MimCondicionesVentaPlanCobertura } from './mim-condiciones-venta-plan-cobertura.model';
import { MimValorCuota } from './valor-cuota-plan-cobertura.model';
import { MimReconocimientoPorPermanencia } from './mim-reconocimiento-por-permanencia.model';
import { IMimReglasExcepciones, MimReglasExcepciones } from './MimReglasExcepciones.model';
import { MimCondicionesPagarEvento } from './mim-condiciones-pagar-evento.model';

export class GuardarPlanCobertura {
  public stepsBloqueados: boolean;
  public cardBloqueadas: boolean;
  public guardarPlanCoberturaOrden: GuardarPlanCoberturaOrden;
  public planCobertura: MimPlanCobertura;
  public condiciones: Page<MimCondicion>;
  public condicionesAsistencia: Page<MimAsistenciaPlanCobertura>;
  public periodosCarencia: Page<MimPeriodoCarencia>;
  public deducibles: Page<MimDeducible>;
  public valorRescate: Page<MimValorRescate>;
  public valorAsegurado: Page<MimValorAsegurado>;
  public exclusionesPlanCobertura: Page<MimExclusionPlanCobertura>;
  public subsistentePlanCobertura: Page<MimSubsistentePlanCobertura>;
  public adicionalPlanCobertura: Page<MimAdicionalPlanCobertura>;
  public maximoDiasPagarEvento: number;
  public excepcionDiagnostico: Page<MimExcepcionDiagnostico>;
  public condicionPagoAntiguedad: Page<MimCondicionPagoAntiguedad>;
  public sublimiteCobertura: Page<MimSublimiteCobertura>;
  public condicionesPagarEvento: Page<MimCondicionesPagarEvento>;
  public beneficioPreexistencia: Page<MimBeneficioPreexistencia>;
  public enfermedadGravePlanCobertura: Page<MimEnfermedadGravePlanCobertura>;
  public conceptoFacturacionPlanCobertura: Page<MimConceptoFacturacionPlanCobertura>;
  public desmembracionAccidente: Page<MimDesmembracionAccidente>;
  public condicionVenta: Page<MimCondicionesVentaPlanCobertura>;
  public valorCuota: Page<MimValorCuota>;
  public reconocimientosPermanencia: Page<MimReconocimientoPorPermanencia>;
  public reglasExcepciones: Page<MimReglasExcepciones>;



  constructor(obj: IGuardarPlanCobertura) {
    this.stepsBloqueados = obj && obj.stepsBloqueados || true;
    this.cardBloqueadas = obj && obj.cardBloqueadas || true;
    this.guardarPlanCoberturaOrden = obj && obj.guardarPlanCoberturaOrden || null;
    this.planCobertura = obj && obj.planCobertura || null;
    this.condiciones = obj && obj.condiciones || null;
    this.condicionesAsistencia = obj && obj.condicionesAsistencia || null;
    this.periodosCarencia = obj && obj.periodosCarencia || null;
    this.subsistentePlanCobertura = obj && obj.subsistentePlanCobertura || null;
    this.adicionalPlanCobertura = obj && obj.adicionalPlanCobertura || null;
    this.deducibles = obj && obj.deducibles || null;
    this.valorAsegurado = obj && obj.valorAsegurado || null;
    this.exclusionesPlanCobertura = obj && obj.exclusionesPlanCobertura || null;
    this.maximoDiasPagarEvento = obj && obj.maximoDiasPagarEvento || null;
    this.excepcionDiagnostico = obj && obj.excepcionDiagnostico || null;
    this.condicionPagoAntiguedad = obj && obj.condicionPagoAntiguedad || null;
    this.sublimiteCobertura = obj && obj.sublimiteCobertura || null;
    this.condicionesPagarEvento = obj && obj.condicionesPagarEvento || null;
    this.beneficioPreexistencia = obj && obj.beneficioPreexistencia || null;
    this.enfermedadGravePlanCobertura = obj && obj.enfermedadGravePlanCobertura || null;
    this.conceptoFacturacionPlanCobertura = obj && obj.conceptoFacturacionPlanCobertura || null;
    this.desmembracionAccidente = obj.desmembracionAccidente || null;
    this.condicionVenta = obj.condicionVenta || null;
    this.valorCuota = obj.valorCuota || null;
    this.reconocimientosPermanencia = obj.reconocimientosPermanencia || null;
    this.reglasExcepciones = obj.reglasExcepciones || null;
  }
}

export interface IGuardarPlanCobertura {
  stepsBloqueados: boolean;
  cardBloqueadas: boolean;
  guardarPlanCoberturaOrden: IGuardarPlanCoberturaOrden;
  planCobertura: IMimPlanCobertura;
  condiciones: IPage<IMimCondicion>;
  condicionesAsistencia: IPage<IMimAsistenciaPlanCobertura>;
  periodosCarencia: IPage<IMimPeriodoCarencia>;
  deducibles: IPage<IMimDeducible>;
  valorRescate: IPage<IMimValorRescate>;
  valorAsegurado: IPage<IMimValorAsegurado>;
  exclusionesPlanCobertura: IPage<IMimExclusionPlanCobertura>;
  subsistentePlanCobertura: IPage<IMimSubsistentePlanCobertura>;
  adicionalPlanCobertura: IPage<IMimAdicionalPlanCobertura>;
  maximoDiasPagarEvento: number;
  excepcionDiagnostico: IPage<IMimExcepcionDiagnostico>;
  condicionPagoAntiguedad: IPage<IMimCondicionPagoAntiguedad>;
  sublimiteCobertura: IPage<IMimSublimiteCobertura>;
  condicionesPagarEvento: IPage<MimCondicionesPagarEvento>;
  beneficioPreexistencia: IPage<IMimBeneficioPreexistencia>;
  enfermedadGravePlanCobertura: IPage<IMimEnfermedadGravePlanCobertura>;
  conceptoFacturacionPlanCobertura: IPage<IMimConceptoFacturacionPlanCobertura>;
  desmembracionAccidente: Page<MimDesmembracionAccidente>;
  condicionVenta: Page<MimCondicionesVentaPlanCobertura>;
  valorCuota: IPage<MimValorCuota>;
  reconocimientosPermanencia: IPage<MimReconocimientoPorPermanencia>;
  reglasExcepciones: Page<IMimReglasExcepciones>;

}
