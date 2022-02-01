export const GENERALES = {
  FECHA_PATTERN: 'dd-MM-yyyy',
  FECHA_WITHOUT_SEPARATOR_PATTERN: 'ddMMyyyy',
  FECHA_HORA_PATTERN: 'dd-MM-yyyy hh:mm:ss a',
  FECHA_HORA_PATTERN_EXCEL: 'dd_MM_yyyy_hh:mm:ss',
  HORA_PATTERN: 'hh:mm:ss',
  HORA_WITHOUT_SEPARATOR_PATTERN: 'hhmmss',

  SI: 'SI',
  NO: 'NO',

  MIM_ESTADO_PLAN: {
    DISPONIBLE: 2
  },

  MIM_PLANES_OBLIGATORIO:{
    TIPO_PLAN_DEFECTO:'Complementario'
  },

  MIM_ESTRUCTURA_CARGUE:{
    TIPO_ESTRUCTURA_DEFECTO:'Estructura de cargue 1'
  },

  MIM_TIPO_TOPE: {
    PROTECCION: 1,
    CONTRIBUCCION: 2
  },

  MIM_PERFILES: {
    DIRECTOR_TECNICO: 'director tecnico',
    ANALISTA_TECNICO: 'analista tecnico'
  },

  PARAMETROS_CONFIGURACION: {
    GENERAL: 1,
    ESPECIFICO: 2
  },

  TIPO_CANTIDAD_CASOS: {
    PORCENTAJE: 1,
    VALOR_FIJO: 2
  },

  GEOLOCALIZACIONES: {
    NACIONAL: 1
  },

  MIM_SUBESTADOS: {
    REMEDY: 'REMEDY'
  },
  ESTADOS_PLAN: {
    ACTIVO: 2,
    EN_PROCESO: 3,
    EN_OBSERVACION: 4
  },

  MIM_ESTADOS_CLIENTE: {
    NO_DISPONIBLE: 1
  },

  DES_FASES_FLUJO: {
    RADICACION: 'Radicación: ',
    AUDITORIA_MEDICA: 'Auditoría Médica: ',
    LIQUIDACION: 'Definición: ',
    PAGO: 'Pago: ',
    NOTIFICAR_APROBACION: 'Notificar Aprobación: ',
    NOTIFICAR_NEGACION: 'Notificar Negación: ',
    REGISTRO: 'Registro solicitud: ',
    TECNICA: 'Técnica: ',
    ACTUARIA: 'Actuaria: ',
    FINALIZADO: 'Finalizado: ',
    ACTIVAR: 'Activar solicitud: ',
    ANULAR: 'Anular solicitud: '
  },

  TIPO_COMENTARIO: {
    NEGACION: 'negation',
    ANULA: 'cancel',
    ACTIVA: 'active',
    SUSPENDIDO: 'suspended',
    GESTION: 'manage',
    COMENTARIO: 'comment',
    COMPLETAR: 'complete',
    ASIGNAR: 'assignee'
  },

  TIPO_FASE_FLUJO: {
    NEGACION: 'NEGACION',
    RADICACION: 'RADICACION',
    AUDITORIA_MEDICA: 'AUDITORIA_MEDICA',
    LIQUIDACION: 'LIQUIDACION',
    PAGO: 'PAGO',
    REGISTRO: 'REGISTRO',
    GENERAL: 'GENERAL'
  },

  ROLES_ID: {
    MM_F5: 'MM_F5',
    MM_F6: 'MM_F6',
    MM_F7: 'MM_F7',
    MM_F8: 'MM_F8',
    MM_F9: 'MM_F9'
  },

  // Aplica SOLO para los flujos de configuración de producto
  CODIGO_SOLICITUD_PADRE: '0',

  PROCESO: {
    INCREMENTOS: 'procesoVentaIncremento',
    MEDICAMENTOS: 'procesoRadicacionMedicamentos',
    ELIMINAR_CLIENTE: 'procesoEliminacionCliente',
    ELIMINAR_PLAN_COBERTURA: 'procesoEliminacionPlanCobertura',
    ELIMINAR_PLAN: 'procesoEliminacionPlan',
    ELIMINAR_COBERTURA: 'procesoEliminacionCobertura',
    APROBAR_PLAN: 'procesoAprobacionPlan'
  },

  TIPO_SOLICITUD: {
    CODIGO_TIPO_SOLICITUD_RECLAMACIONES: 'reclamaciones',
    NOMBRE_TIPO_SOLICITUD_RECLAMACIONES: 'Reclamaciones',
    CODIGO_TIPO_SOLICITUD_ELIMINAR_PLAN: 'eliminar-plan',
    NOMBRE_TIPO_SOLICITUD_ELIMINAR_PLAN: 'Eliminacion plan',
    CODIGO_TIPO_SOLICITUD_APROBACION_PLAN: 'aprobacion-plan',
    NOMBRE_TIPO_SOLICITUD_APROBACION_PLAN: 'Aprobacion plan',
    CODIGO_TIPO_SOLICITUD_ELIMINAR_COBERTURA: 'eliminar-cobertura',
    NOMBRE_TIPO_SOLICITUD_ELIMINAR_COBERTURA: 'Eliminacion cobertura',
    CODIGO_TIPO_SOLICITUD_ELIMINAR_CLIENTE: 'eliminar-cliente',
    NOMBRE_TIPO_SOLICITUD_ELIMINAR_CLIENTE: 'Eliminacion cliente',
    CODIGO_TIPO_SOLICITUD_ELIMINAR_PLAN_COBERTURA: 'eliminar-plan-cobertura',
    NOMBRE_TIPO_SOLICITUD_ELIMINAR_PLAN_COBERTURA: 'Eliminacion plan cobertura'
  },

  TIPO_GESTION: {
    CONCEPTO_OTRAS_AREAS: 1,
    GUARDAR_COMENTARIO: 2,
    ANULAR_PROCESO: 3
  },

  TIPOS_TRABAJO: {
    CARGUE_SOLICITUD_MEDICAMENTOS: 'cargueSolicitudMedicamentos'
  },

  TIPO_USUARIO_FLUJO: {
    DIRECTOR_TECNICO: 'validacionSolicitudDirectorTecnico',
    ANALISTA_TECNICO: 'validacionSolicitudAnalistaTecnico',
    ANALISTA_ACTUARIA: 'validacionSolicitudAnalistaActuaria',
    DIRECTOR_ACTUARIA: 'validacionSolicitudActuaria',
    DIRECTOR_FINANCIERO: 'validacionSolicitudDirectorFinanciero',
    DIRECTOR_FINAL: 'aprobacionConfiguracionFinal'
  },
  ESTADOS_COBERTURA: {
    NO_DISPONIBLE: 1
  },

  TIPOS_PROCESOS_CARGUE_MASIVO: {
    COPAGO: 1,
    NOTIFICACION_PAGOS: 2,
    INCREMENTOS: 3,
    PROMOTORES: 4
  },
  NOMBRE_CARGUE_MASIVO: {
    COPAGO: 'cargueSolicitudMedicamentos',
    NOTIFICACION_PAGOS: 'cargueNotificacionPago',
    INCREMENTOS: 'cargueVentasCallCenter',
    PROMOTORES: 'cargueConfiguracionPromotores'
  },
  PESO_MAXIMO_DOCUMENTO: 5242880,
  MIME_DOCUMENTO: 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  EXTENSION_DOCUMENTO: '.xlsx, .xls',
  TIPO_FACTOR: {
    CONTRIBUCION: 1,
    DISTRIBUCION: 2
  },
  VARIABLES_INICIO_JOB: {
    FECHA_INICIO: 'fechaInicio',
    FECHA_FIN: 'fechaFin'
  },
  ESTADOS: {
    NONE: 'NONE',
    NORMAL: 'NORMAL',
    PAUSED: 'PAUSED',
    COMPLETE: 'COMPLETE',
    ERROR: 'ERROR'
  },
  TIPO_MOVIMIENTO: {
    VINCULACION: 1,
    INCREMENTAR: 2,
    DISMINUCION: 3,
    PAGO: 4,
    COTIZACION: 5
  },
  DEVOLVER_A: {
    ACTIVA: 'activar',
    TECNICO: 'devolverTecnico',
    ACTUARIA: 'devolverActuaria',
    FINANCIERA: 'devolverFinanciera'
  },

  TIPO_CONFIGURACION: {
    GENERAL: '1',
    ESPECIFICA: '2'
  },

  MOVIMIENTOS_ACCIONES: {
    DETALLE_INCREMENTO: 'MM_CONSUL_ASOC_PRO_PORT_ACCION_INCREMENTO_DETALLE',
    DETALLE_COTIZACION: 'MM_CONSUL_ASOC_PRO_PORT_ACCION_COTIZACION_DETALLE',
    ACTIVACION_SOLICITUD: 'MM_CONSUL_ASOC_PRO_PORT_ACCION_ACTIVAR',
    ANULAR_VENTA: 'MM_CONSUL_ASOC_PRO_PORT_ACCION_ANULAR',
    BITACORA_MOVIMIENTO: 'MM_CONSUL_ASOC_PRO_PORT_ACCION_BITACORA',
    DESCARGAR_MOVIMIENTO: 'MM_CONSUL_ASOC_PRO_PORT_ACCION_DESCARGAR',
    VENTA_APARTIR_COTIZACION: 'MM_CONSUL_ASOC_PRO_PORT_ACCION_INCREMENTO',
    CAMBIAR_ESTADO: 'MM_CONSUL_ASOC_PRO_PORT_ACCION_CAMBIAR_ESTADO'
  },

  TIPO_SOLICITUD_FLUJO: {
    VENTAS: 'ventas',
    RECLAMACIONES: 'reclamaciones',
    NOVEDADES: 'novedades',
    ELIMINAR_PLAN_COBERTURA: 'eliminar-plan-cobertura',
    ELIMINAR_PLAN: 'eliminar-plan',
    ELIMINAR_COBERTURA: 'eliminar-cobertura',
    ELIMINAR_CLIENTE: 'eliminar-cliente',
    APROBACION_PLAN: 'aprobacion-plan',
    REVOCATORIA: 'revocatoria',
    REINGRESO: 'reingreso',
    MODIFICACION_BENEFICIARIO: 'modificacion-beneficiario',
    INCREMENTOS: 'incrementos',
    DISMINUCIONES: 'disminuciones',
    DESCAPITALIZACION: 'descapitalizacion',
    CANCELACIONES: 'cancelaciones',
    CAMBIO_FECHA_NACIMIENTO: 'cambio-fecha-nacimiento',
    AJUSTE_FACTURACION: 'ajuste-facturacion'
  },

  CODIGO_REGIONAL: 907,

  TIPO_RECONOCIDO: {
    COP: 1,
    SMMLV: 2,
    PORCENTAJE: 3,
  },

  CASOS_PRESENTACION_PORTAFOLIO: {
    SI_AMPARA: 1,
    VALOR_ASEGURADO: 2,
    RANGO_PORCENTAJE: 3,
    TOPE_DEFINIDO: 4,
  },
   TIPO_BENEFICIO: {
    CUOTAS: 1,
    REGALO: 2
  },
  BENEFICIO: {
    PORCENTAJE_CUOTAS: 1,
    NUMERO_CUOTAS: 2,
    BONO: 3,
  },
  TIPO_PROMOCION: {
    CUOTAS_PAGADAS_FACTURACION: 1,
    VALOR_MAXIMO_MORA: 2,
    ESTADO_ASEGURADO: 3,
    GENERO: 4,
    EDAD: 5,
    ASEGURADOS_APTOS: 6,
    ANTIGUEDAD: 7
  }

};

export const ROLES = [
  { code: 'MM_F5', description: 'Permite radicar Cualquier tipo de reclamación' },
  { code: 'MM_F6', description: 'Permite registrar los auxilios' },
  { code: 'MM_F7', description: 'Gestiona los procesos de auditoria médica para los auxilios' },
  { code: 'MM_F8', description: 'Gestiona la definición de auxilios de medicamentos' },
  { code: 'MM_F9', description: 'Gestiona el pago de los auxilios por medicamentos' }
];
