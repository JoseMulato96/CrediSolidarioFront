export class UrlRoute {
  static PAGES = 'pages';
  static LOGIN = 'login';
  static HOME = 'inicio';
  // ==========================================================================
  // Consultas
  // ==========================================================================
  static CONSULTAS = 'consulta';
  static CONSULTA_LOG_TRANSACCIONAL = 'log-transaccional';

  // Asociado.
  static CONSULTAS_ASOCIADO = 'asociado';
  static CONSULTAS_ASOCIADO_DATOS_ASOCIADO = 'datos-de-asociado';
  static CONSULTAS_ASOCIADO_DATOS_DE_ASOCIADO_DETALLE = 'datos-de-asociado-detalle';
  // Beneficiarios del asociado.
  static BENEFICIARIOS_ASOCIADO = 'beneficiarios-asociado';
  static EDITAR_BENEFICIARIO = 'editar-beneficiario';
  static NUEVO_BENEFICIARIO = 'nuevo-beneficiario';
  static CREAR_BENEFICIARIO = 'nuevo';
  // Protecciones del asociado.
  static PROTECCIONES = 'protecciones';
  static REGISTRO_PROTECCION = 'registro-proteccion';
  static PORTAFOLIO_ASOCIADOS = 'portafolio';
  static PORTAFOLIO_BETA = 'portafolio-beta';
  static PORTAFOLIO_PLAN_COBERTURA = 'plan-cobertura';
  static PORTAFOLIO_PLAN_COBERTURA_MOVIMIENTOS = 'movimientos';
  static AUDITORIA_MEDICA = 'auditoria-medica';
  static GESTION_AUXILIAR_MEDICO = 'auxiliar-medico';
  static GESTION_OPERACIONES = 'gestion-operaciones';
  static PORTAFOLIO_GESTION_LISTAS_RESTRICTIVAS = 'gestion-listas-restrictivas';
  static PORTAFOLIO_PLAN_COBERTURA_COTIZACION_PLAN = 'cotizacion-plan';
  static PORTAFOLIO_PLAN_COBERTURA_VENTA_PLAN = 'venta-plan';
  static PORTAFOLIO_PLAN_COBERTURA_ACTIVAR_SOLICITUDES_SUSPENDIDAS = 'activar-solicitudes-suspendidas';
  static PORTAFOLIO_PLAN_COBERTURA_RESUMEN_VENTA_COBERTURAS = 'resumen-venta-coberturas';
  static PORTAFOLIO_PLAN_COBERTURA_GESTION_AREA_TECNICA = 'gestion-area-tecnica';
  // resumen cotización
  static PORTAFOLIO_PLAN_COBERTURA_RESUMEN_COTIZACION_COBERTURAS = 'resumen-cotizacion-coberturas';
  static PORTAFOLIO_PLAN_COBERTURA_RESUMEN_COTIZACION_COBERTURAS_PLANES = 'planes';
  static PORTAFOLIO_PLAN_COBERTURA_RESUMEN_COTIZACION_COBERTURAS_PROYECCION = 'proyeccion';
  static PORTAFOLIO_PLAN_COBERTURA_RESUMEN_COTIZACION_COBERTURAS_RESUMEN = 'resumen';
  static PORTAFOLIO_PLAN_COBERTURA_RESUMEN_COTIZACION_COBERTURAS_ESTADISTICAS = 'estadisticas';
  static PORTAFOLIO_PLAN_COBERTURA_DECLARACION_SALUD_VISTA = 'declaracion-salud-vista';
  static PORTAFOLIO_PLAN_COBERTURA_VALIDACION_MANUAL_LISTAS_RESTRICTIVAS = 'validacion-manual-listas-restrictivas';
  static REGISTRAR_PORTAFOLIO_ASOCIADOS =
    'registrar-portafolio-asociados';
  static PORTAFOLIO_ASOCIADO_DETALLE = 'portafolio-asociado-detalle';
  static DETALLE = 'detalle';
  static HISTORICO = 'historico';
  static INACTIVIDADES = 'inactividades';
  static FACTURACION = 'facturacion';
  // Facturacion Asociado.
  static FACTURACION_ASOCIADOS = 'facturacion';
  static FACTURACION_ASOCIADOS_MULTIATIVA = 'multiactiva';
  static FACTURACION_ASOCIADOS_SOLIDARIDAD = 'solidaridad';
  static FACTURACION_ASOCIADOS_CAPITAL_PAGADO = 'capital-pagado';
  static FACTURACION_ASOCIADOS_RECAUDOS = 'recaudos';
  static FACTURACION_ASOCIADOS_CUENTAS_CONTABLES = 'cuentas-contables';
  static FACTURACION_ASOCIADOS_CUENTAS_CONTABLES_DETALLE = 'cuentas-contables-detalle';
  // Preexistencias.
  static PREEXISTENCIAS = 'preexistencias';
  static PREEXISTENCIAS_HISTORICO = 'historico';
  // General.
  static GENERAL = 'general';
  static GENERAL_ACT_IND_FEC_NAC =
    'actualizacion-indicador-fecha-nacimiento';
  static GENERAL_ACT_IND_AUX_FUN = 'actualizacion-auxilio-funerario';
  // Responsable Pago.
  static RESPONSABLE_PAGO = 'responsable-pago';
  // Asegurado.
  static ASEGURADO = 'asegurado';
  // Beneficiarios
  static BENEFICIARIOS = 'beneficiarios';
  static BENEFICIARIOS_REPETIDOS = 'repetidos';
  static BENEFICIARIOS_FALLECIDOS = 'fallecidos';
  static BENEFICIARIOS_INFORMACION = 'informacion';
  static BENEFICIARIOS_ASOCIADO_RELACIONADOS = 'asociados-relacionado';
  static BENEFICIARIOS_NOVEDANDES_HISTORICO = 'novedades-historico';
  static CONSULTA_ASOCIADOS = 'consulta-asociados';
  static BENEFICIARIOS_FECHA_NACIMIENTO = 'actualizacion-fecha-nacimiento-beneficiarios';
  static BENEFICIARIOS_FECHA_NACIMIENTO_ACTUALIZAR = 'actualizacion-fecha-nacimiento-detalle';
  // Consulta Pagos
  static CONSULTA_PAGOS = 'pagos';
  static ASOCIADOS_VIP = 'config-asociados-vip';
  // Liquidaciones
  static CONSULTAS_LIQUIDACIONES = 'liquidaciones';
  static CONSULTAS_LIQUIDACIONES_CONSULTA_LIQUIDACIONES = 'consulta-liquidaciones';
  static CONSULTAS_LIQUIDACIONES_CONSULTA_LIQUIDACIONES_DETALLE_LIQUIDACION = 'detalle-liquidacion';

  // Reclamaciones
  static CONSULTAS_EVENTOS = 'eventos';
  static CONSULTAS_EVENTOS_CONSULTA = 'consulta';
  static CONSULTAS_EVENTOS_CONSULTA_RENTAS = 'rentas';
  static CONSULTAS_EVENTOS_CONSULTA_SOLICITUD = 'solicitud';
  static CONSULTAS_EVENTOS_CONSULTA_SOLICITUD_BITACORA = 'bitacora';
  static CONSULTAS_EVENTOS_CONSULTA_SOLICITUD_REGISTRO = 'registro';
  static CONSULTAS_EVENTOS_CONSULTA_SOLICITUD_RADICAR = 'radicar';
  static CONSULTAS_EVENTOS_CONSULTA_SOLICITUD_NOTIFICAR_NEGACION = 'notificar-negacion';
  static CONSULTAS_EVENTOS_CONSULTA_SOLICITUD_AUDITORIA_MEDICA = 'auditoria-medica';
  static CONSULTAS_EVENTOS_CONSULTA_SOLICITUD_DEFINICION = 'definicion';
  static CONSULTAS_EVENTOS_CONSULTA_SOLICITUD_CONCEPTO_OTRAS_AREAS = 'concepto-otras-areas';
  static CONSULTAS_EVENTOS_CONSULTA_SOLICITUD_ACTIVAR = 'activar';
  static CONSULTAS_EVENTOS_CONSULTA_SOLICITUD_DATOS_EVENTO = 'datos-evento';
  static CONSULTAS_EVENTOS_CONSULTA_SOLICITUD_PAGO = 'pago';

  // ==========================================================================
  // Administracion.
  // ==========================================================================

  // Simulaciones
  static VALOR_DEVOLVER = 'valor-devolver';
  static VALOR_DEVOLVER_CANCELADOS = 'valores-devolver-cancelados';

  // Administracion - Configuración Seguridad
  static ADMINISTRACION = 'administracion';
  static SIMULACIONES = 'simulaciones';
  static CONFIGURACION_SEGURIDAD = 'seguridad';
  static LOG_NOVEDADES = 'log-novedades';
  static AUDITORIA = 'auditoria';
  static ASIGNACION_PERMISOS_ESPECIALES = 'asignacion-permisos';

  // Administracion - Configuracion seguridad.
  static ADMINISTRACION_CONFIGURACION_SEGURIDAD = 'seguridad';
  static ADMINISTRACION_CONFIGURACION_SEGURIDAD_LOG_NOVEDADES = 'log-novedades';
  static ADMINISTRACION_CONFIGURACION_SEGURIDAD_AUDITORIA = 'auditoria';

  // Administracion - Asignacion de permisos especiales.
  static ADMINISTRACION_ASIGNACION_PERMISOS_ESPECIALES = 'asignacion-permisos';

  // Administracion - Asignacion de permisos especiales.
  static ADMINISTRACION_CARGUE_MASIVO = 'cargue-masivo';

  static ADMINISTRACION_CARGUES_MASIVOS_CALL_CENTER = 'cargue-masivo-call-center';

  // Administracion - Procesos automaticos
  static ADMINISTRACION_PROCESOS_AUTOMATICOS = 'procesos-automaticos';
  static ADMINISTRACION_PROCESOS_AUTOMATICOS_NUEVO = 'nuevo';

  // Administracion -parametros configuracion operacion
  static PARAMETROS_CONFIGURACION_OPERACIONES = 'parametros-configuracion-operaciones';
  static GEOLOCALIZACION_PARAMETROS_CONFIGURACION_OPERACIONES = 'parametros-geolocalizacion';

  // Administracion - Asignacion gestion diaria.
  static ADMINISTRACION_ASIGNACION_GESTION_DIARIA = 'asignacion-diaria';
  static ADMINISTRACION_ASIGNACION_GESTION_DIARIA_BETA = 'asignacion-diaria-beta';
  static ADMINISTRACION_CONFIGURACION_ASIGNACION_GESTION_DIARIA = 'configuracion-asignacion-gestion-diaria';
  static ADMINISTRACION_CONFIGURACION_ASIGNACION_GESTION_DIARIA_AUTOMATICA = 'configuracion-asignacion-gestion-diaria-automatica';

  // Gestión solicitudes suspendidas
  static ADMINISTRACION_GESTION_SOLICITUD_SUSPENDIDA = 'gestion-solicitud-suspendida';

  // Administracion Cartas
  static ADMINISTRACION_PARAMETRIZAR_CARTAS = 'parametrizar-cartas';
  static ADMINISTRACION_PARAMETRIZAR_CARTAS_NUEVO = 'nuevo';

  // Administracion actuaria
  static ADMINISTRACION_ACTUARIA = 'actuaria';
  static ADMINISTRACION_ACTUARIA_CONFIGURAR = 'configuracion';
  static ADMINISTRACION_ACTUARIA_CONFIGURAR_DETALLE = 'detalle';

  // Admnistración final
  static ADMINISTRACION_APROBACION_FINAL = 'aprobacion-final';
  static ADMINISTRACION_APROBACION_FINAL_CONFIGURAR = 'configuracion';
  static ADMINISTRACION_APROBACION_FINAL_CONFIGURAR_RESUMEN = 'resumen';

  // Administracion financiera
  static ADMINISTRACION_FINANCIERA = 'financiera';
  static ADMINISTRACION_FINANCIERA_CONFIGURAR = 'configuracion';

  // Administracion - Reasignacion de ordenes.
  static ADMINISTRACION_REASIGNACION_ORDENES = 'reasignacion-ordenes';

  // TODO(alobaton): Esto debemos removerlo de aqui y usar el archivo codigos-menu.ts
  // Codigos menu principal
  static CODE_MENU_ASOCIADO = 'MM_FLOTANTE_CONSULTA_ASOCIADO';
  static CODE_MENU_CONSULTA = 'MM_CONSULTA';
  static CODE_MENU_BENEFICIARIO = 'MM_CONSUL_BENEFICIARIOS';

  // Administracion - Protecciones
  static ADMINSTRACION_PROTECCIONES = 'configuracion-protecciones';
  // Protecciones Clientes
  static ADMINISTRACION_PROTECCIONES_CLIENTES = 'clientes';
  static ADMINISTRACION_PROTECCIONES_CLIENTES_NUEVO = 'nuevo';
  // Protecciones Categoria Asociados
  static ADMINISTRACION_PROTECCIONES_CATEGORIAS_ASOCIADO = 'categoria-asociado';
  static ADMINISTRACION_PROTECCIONES_CATEGORIAS_ASOCIADO_NUEVO = 'nuevo';
  // Protecciones Categoria Asociados Homologacion
  static ADMINISTRACION_PROTECCIONES_CATEGORIAS_ASOCIADO_HOMOLOGACION = 'categorias-asociado-homologacion';
  static ADMINISTRACION_PROTECCIONES_CATEGORIAS_ASOCIADO_HOMOLOGACION_NUEVO = 'nuevo';
  // Cliente estado asociado
  static ADMINISTRACION_PROTECCIONES_CLIENTE_ESTADO_ASOCIADO = 'cliente-estado-asociado';
  static ADMINISTRACION_PROTECCIONES_CLIENTE_ESTADO_ASOCIADO_NUEVO = 'nuevo';
  // Fondos
  static ADMINISTRACION_PROTECCIONES_FONDOS = 'fondos';
  static ADMINISTRACION_PROTECCIONES_FONDO_NUEVO = 'nuevo';
  // Fondos
  static ADMINISTRACION_PROTECCIONES_CANALES = 'canales';
  static ADMINISTRACION_PROTECCIONES_CANAL_NUEVO = 'nuevo';
  // Exclusiones
  static ADMINISTRACION_PROTECCIONES_EXCLUSIONES = 'exclusiones';
  static ADMINISTRACION_PROTECCIONES_ESCLUSIONES_NUEVO = 'nuevo';

  // Campañas Endoso
  static ADMINISTRACION_PROTECCIONES_CAMPANAS_ENDOSO = 'gestion-campana';
  static ADMINISTRACION_PROTECCIONES_CAMPANAS_ENDOSO_CAMPANAS = 'campana-endoso';
  static ADMINISTRACION_PROTECCIONES_CAMPANAS_ENDOSO_CAMPANAS_NUEVO = 'nuevo';

  // Campañas Endoso - Plan Cobertura
  static ADMINISTRACION_PROTECCIONES_CAMPANAS_ENDOSO_CAMPANAS_PLAN_COBERTURA = 'campana-cobertura';

  // Desmembración accidente
  static ADMINISTRACION_PROTECCIONES_DESMEMBRACION_ACCIDENTE = 'desmembracion-accidente';
  static ADMINISTRACION_PROTECCIONES_DESMEMBRACION_ACCIDENTE_NUEVO = 'nuevo';

  // Enfermedades Graves
  static ADMINISTRACION_PROTECCIONES_ENFERMEDADES_GRAVES = 'enfermedades-graves';
  static ADMINISTRACION_PROTECCIONES_ENFERMEDADES_GRAVES_NUEVO = 'nuevo';

  // Conceptos facturacion
  static ADMINISTRACION_PROTECCIONES_CONCEPTOS_FACTURACION = 'concepto-facturacion';
  static ADMINISTRACION_PROTECCIONES_CONCEPTOS_FACTURACION_NUEVO = 'nuevo';

  // Protecciones Gestión Coberturas
  static ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA = 'gestion-cobertura';
  // Coberturas
  static ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_COBERTURAS = 'coberturas';
  static ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_COBERTURAS_NUEVO = 'nuevo';
  // Beneficairio pago
  static ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_BENEFICIARIO_PAGO = 'beneficiario-pago';
  // Requisitos control medico
  static ADMINISTRACION_PROTECCIONES_REQUISITOS_CONTROL_MEDICO = 'requisitos-control-medico';
  static ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_REQUISITOS_CONTROL_MEDICO_NUEVO = 'nuevo';
  // Niveles de riesgo por cobertura
  static ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_NIVELES_RIESGO_COBERTURA = 'niveles-riesgo-cobertura';
  static ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_NIVELES_RIESGO_COBERTURA_NUEVO = 'nuevo';

  // Niveles de concepto facturacion
  static ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_CONCEPTOS_FACTURACION = 'concepto-facturacion';
  static ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_CONCEPTOS_FACTURACION_NUEVO = 'nuevo';

  // Exclusiones cobertura
  static ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_EXCLUSIONES_COBERTURA = 'exclusiones-cobertura';
  static ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_EXCLUSIONES_COBERTURA_CODIGO_EXCLUSION = 'codigoExclusion';
  static ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_EXCLUSIONES_COBERTURA_CODIGO_COBERTURA = 'codigoCobertura';
  static ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_EXCLUSIONES_COBERTURA_CODIGO_FONDO = 'codigoFondo';
  static ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_EXCLUSIONES_COBERTURA_NUEVO = 'nuevo';
  // Gestión cúmulos
  static ADMINISTRACION_PROTECCIONES_GESTION_CUMULOS = 'gestion-cumulos';
  // Cumulos
  static ADMINISTRACION_PROTECCIONES_CUMULOS = 'cumulos';
  static ADMINISTRACION_PROTECCIONES_CUMULOS_NUEVO = 'nuevo';
  // Cumulos cobertura
  static ADMINISTRACION_PROTECCIONES_CUMULOS_COBERTURA = 'cumulos-cobertura';
  static ADMINISTRACION_PROTECCIONES_CUMULOS_COBERTURA_NUEVO = 'nuevo';
  // Control cumulos
  static ADMINISTRACION_PROTECCIONES_CONTROL_CUMULOS = 'control-cumulos';
  static ADMINISTRACION_PROTECCIONES_CONTROL_CUMULOS_NUEVO = 'nuevo';
  // Gestión plan
  static ADMINISTRACION_PROTECCIONES_GESTION_PLAN = 'gestion-plan';
  // Planes
  static ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLANES = 'planes';
  static ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLANES_NUEVO = 'nuevo';

  static ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLAN = 'plan';
  static CONSULTA_RELACION_MAESTROS = 'consultas-relacion-maestro';
  static ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLAN_NUEVO = 'nuevo';
  // Medio facturación plan
  static ADMINISTRACION_PROTECCIONES_GESTION_PLAN_MEDIO_FACTURACION_PLAN = 'medio-facturacion-plan';
  static ADMINISTRACION_PROTECCIONES_GESTION_PLAN_MEDIO_FACTURACION_PLAN_CODIGO_PLAN = 'codigoPlan';
  static ADMINISTRACION_PROTECCIONES_GESTION_PLAN_MEDIO_FACTURACION_PLAN_CODIGO_MEDIO_FACTURACION = 'codigoMedioFacturacion';
  static ADMINISTRACION_PROTECCIONES_GESTION_PLAN_MEDIO_FACTURACION_PLAN_NUEVO = 'nuevo';
  // Canal ventas y movimiento
  static ADMINISTRACION_PROTECCIONES_GESTION_PLAN_CANAL_VENTAS_MOVIMIENTO = 'canal-ventas-movimiento';
  static ADMINISTRACION_PROTECCIONES_GESTION_PLAN_CANAL_VENTAS_MOVIMIENTO_NUEVO = 'nuevo';
  // Frecuencia facturación plan
  static ADMINISTRACION_PROTECCIONES_GESTION_PLAN_FRECUENCIA_FACTURACION_PLAN = 'frecuencia-facturacion-plan';
  static ADMINISTRACION_PROTECCIONES_GESTION_PLAN_FRECUENCIA_FACTURACION_PLAN_NUEVO = 'nuevo';
  static ADMINISTRACION_PROTECCIONES_GESTION_PLAN_FRECUENCIA_FACTURACION_PLAN_CODIGO_PLAN = 'codigoPlan';
  static ADMINISTRACION_PROTECCIONES_GESTION_PLAN_FRECUENCIA_FACTURACION_PLAN_CODIGO_PERIODO_FACTURACION = 'codigoFrecuenciaFacturacion';
  // Control area tecnica
  static ADMINISTRACION_PROTECCIONES_GESTION_PLAN_CONTROL_AREA_TECNICA = 'control-area-tecnica';
  static ADMINISTRACION_PROTECCIONES_GESTION_PLAN_CONTROL_AREA_TECNICA_NUEVO = 'nuevo';
  // Nivel de riesgo plan
  static ADMINISTRACION_PROTECCIONES_GESTION_PLAN_NIVEL_RIESGO_PLAN = 'nivel-riesgo-plan';
  static ADMINISTRACION_PROTECCIONES_GESTION_PLAN_NIVEL_RIESGO_PLAN_NUEVO = 'nuevo';
  static ADMINISTRACION_PROTECCIONES_GESTION_PLAN_NIVEL_RIESGO_PLAN_CODIGO_PLAN = 'codigoPlan';
  static ADMINISTRACION_PROTECCIONES_GESTION_PLAN_NIVEL_RIESGO_PLAN_CODIGO_NIVEL_RIESGO = 'codigoNivelRiesgo';
  // Productos Excluyentes
  static ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PRODUCTOS_EXCLUYENTES = 'productos-excluyentes';
  static ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PRODUCTOS_EXCLUYENTES_NUEVO = 'nuevo';
  static ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PRODUCTOS_EXCLUYENTES_CODIGO_PLAN = 'codigoPlan';
  static ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PRODUCTOS_EXCLUYENTES_CODIGO_PRODUCTOS_EXCLUYENTES = 'codigoProductoExcluyente';

  // Formula Plan
  static ADMINISTRACION_PROTECCIONES_GESTION_PLAN_FORMULA_PLAN = 'formula-plan';
  static ADMINISTRACION_PROTECCIONES_GESTION_PLAN_FORMULA_PLAN_NUEVO = 'nuevo';

  // Plan cobertura
  static ADMINISTRACION_PROTECCIONES_PLAN_COBERTURA = 'plan-cobertura';
  static ADMINISTRACION_PROTECCIONES_PLAN_COBERTURA_NUEVO = 'nuevo';
  static ADMINISTRACION_PROTECCIONES_COBERTURA = 'cobertura';

  static ADMINISTRACION_PROTECCIONES_PROMOTORES = 'promotores';
  static ADMINISTRACION_PROTECCIONES_PROMOTORES_NUEVO = 'nuevo';

  // Solicitudes
  static SOLICITUD_ELIMINACION = 'solicitud-eliminacion';
  static SOLICITUD_APROBACION = 'solicitud-aprobacion';
  static DEVOLVER_A = 'devolver';
  static PROCESO = 'proceso';
  static TAREA = 'tarea';

  // Administracion - Cotizadores
  static ADMINSTRACION_COTIZADORES = 'configuracion-cotizadores';
  // Cotizadores - Porcentaje de cuota
  static ADMINISTRACION_COTIZADORES_PORCENTAJE_CUOTA = 'porcentaje-cuota';
  static ADMINISTRACION_COTIZADORES_PORCENTAJE_CUOTA_NUEVO = 'nuevo';
  // Cotizadores - Porcentaje de cuota
  static ADMINISTRACION_COTIZADORES_PROYECTO_VIDA = 'proyecto-vida';
  static ADMINISTRACION_COTIZADORES_PROYECTO_VIDA_NUEVO = 'nuevo';
  // Cotizadores - Gestión notas
  static ADMINISTRACION_COTIZADORES_GESTION_NOTAS = 'gestion-notas';
  // Cotizadores - Gestión notas - Notas aclaratorias
  static ADMINISTRACION_COTIZADORES_NOTAS_ACLARATORIAS = 'notas-aclaratorias';
  static ADMINISTRACION_COTIZADORES_NOTAS_ACLARATORIAS_NUEVO = 'nuevo';
  // Cotizadores - Gestión notas - Relación planes
  static ADMINISTRACION_COTIZADORES_RELACION_PLANES = 'relacion-planes';
  static ADMINISTRACION_COTIZADORES_RELACION_PLANES_NUEVO = 'nuevo';
  // Cotizadores - Gestión Otros Parametros - Otros parametros
  static ADMINISTRACION_COTIZADORES_OTROS_PARAMETROS = 'otros-parametros';
  static ADMINISTRACION_COTIZADORES_OTROS_PARAMETROS_NUEVO = 'nuevo';
  // Cotizadores - Aportes estatutarios
  static ADMINISTRACION_COTIZADORES_APORTES_ESTATUTARIOS = 'aportes-estatutarios';
  static ADMINISTRACION_COTIZADORES_APORTES_ESTATUTARIOS_NUEVO = 'nuevo';
  // Administracion - Gestión Promociones
  static ADMINISTRACION_GESTION_PROMOCIONES = 'gestion-promociones';
  static ADMINISTRACION_GESTION_PROMOCIONES_PROMOCIONES = 'promociones';
  static ADMINISTRACION_GESTION_PROMOCIONES_PROMOCIONES_NUEVO = 'nuevo';

  // ==========================================================================
  // Reportes
  // ==========================================================================
  static REPORTES = 'reportes';
  static REPORTES_CARTAS = 'cartas';
  static REPORTES_GESTION_DIARIA = 'reporte-gestion-diaria';
  static REPORTES_AUTOMATICO_PAGOS = 'automatico-pagos';
  static REPORTES_NOTIFICACION_CIERRE = 'notificacion-cierre';
  static REPORTES_PROCESOS_AUTOMATICOS = 'procesos-automaticos';
  static REPORTES_AMPAROS_PAGADOS = 'amparos-pagados';
}
