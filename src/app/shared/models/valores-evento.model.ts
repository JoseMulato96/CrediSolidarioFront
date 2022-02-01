export interface IValoresEvento {
  fechaEvento?: string;
  formaPago?: string;
  numeroCuenta?: string;
  valorSolicitado?: string;
  oficina?: number;
  cuotaMes?: boolean;
  saldoVencido?: boolean;
  banco?: string;
  tipoCuenta?: string;
  retencionEvento?: string;
  pagarA?: string;
  abonaCredito?: boolean;
  esDeposito?: boolean;
  esCheque?: boolean;
  nombreOficina?: string;
  nombreTipoCuenta?: string;
  nombreBanco?: string;
  nombreFormaPago?: string;
  porcentajeRetefuente?: number;
  copago: boolean;
}
