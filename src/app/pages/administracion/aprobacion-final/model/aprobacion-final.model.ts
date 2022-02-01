export class AprobacionFinalModel {
  public plan: any;
  public condiciones: any;
  public deducibles: any;
  public periodosCarencia: any;
  public exclusiones: any;
  public coberturasSubsistentes: any;
  public coberturasAdicionales: any;
  public valoresRescate: any;
  public valoresAsegurados: any;
  public limitacionesCobertura: any;
  public enfermedadesGraves: any;
  public beneficiosPreexistencia: any;
  public condicionesAsistencia: any;
  public cargueFactores: any;
  public conceptosFacturacion: any;
  public conceptosDistribucionCuenta: any;

  constructor(obj: IAprobacionFinalModel) {
    this.plan = obj && obj.plan || null;
    this.condiciones = obj && obj.condiciones || null;
    this.deducibles = obj && obj.deducibles || null;
    this.periodosCarencia = obj && obj.periodosCarencia || null;
    this.exclusiones = obj && obj.exclusiones || null;
    this.coberturasSubsistentes = obj && obj.coberturasSubsistentes || null;
    this.coberturasAdicionales = obj && obj.coberturasAdicionales || null;
    this.valoresRescate = obj && obj.valoresRescate || null;
    this.valoresAsegurados = obj && obj.valoresAsegurados || null;
    this.limitacionesCobertura = obj && obj.limitacionesCobertura || null;
    this.enfermedadesGraves = obj && obj.enfermedadesGraves || null;
    this.beneficiosPreexistencia = obj && obj.beneficiosPreexistencia || null;
    this.condicionesAsistencia = obj && obj.condicionesAsistencia || null;
    this.cargueFactores = obj && obj.cargueFactores || null;
    this.conceptosFacturacion = obj && obj.conceptosFacturacion || null;
    this.conceptosDistribucionCuenta = obj && obj.conceptosDistribucionCuenta || null;
  }
}

export interface IAprobacionFinalModel {
  plan: any;
  condiciones: any;
  deducibles: any;
  periodosCarencia: any;
  exclusiones: any;
  coberturasSubsistentes: any;
  coberturasAdicionales: any;
  valoresRescate: any;
  valoresAsegurados: any;
  limitacionesCobertura: any;
  enfermedadesGraves: any;
  beneficiosPreexistencia: any;
  condicionesAsistencia: any;
  cargueFactores: any;
  conceptosFacturacion: any;
  conceptosDistribucionCuenta: any;
}
