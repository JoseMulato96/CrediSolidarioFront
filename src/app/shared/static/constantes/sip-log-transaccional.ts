/**
 * @description Esta clase contiene los campos que iran en el header de algunas
 * peticiones para guardar en el log transaccional.
 */

export const SIP_LOG_TRANSACCIONAL = {

    consulta_datos_asociados: {
        funcionalidad: '111 - Datos básicos',
        ruta: 'Consulta-Datos asociados-datos básicos',
        accion: 'Consulta Datos Asociado',
        observacion: ''
    },

    Consulta_datos_beneficiario: {
        funcionalidad: '112 - Datos beneficiario',
        ruta: 'Consulta-Datos asociados-datos beneficiario',
        accion: 'Consulta datos Beneficiario',
        observacion: ''
    },

    Generar_datos_beneficiario_pdf: {
        funcionalidad: '112 - Datos beneficiario',
        ruta: 'Consulta-Datos asociados-datos beneficiario-PDF',
        accion: 'Generar datos Beneficiario PDF',
        observacion: ''
    },

    Consulta_protecciones_portafolio_de_productos: {
        funcionalidad: '1132 - Datos protecciones-portafolio de producto',
        ruta: 'Consulta-Datos asociados-datos portafolio de producto',
        accion: 'Consulta Protecciones Portafolio de Productos',
        observacion: ''
    },

    Consulta_detalle_portafolio_de_producto: {
        funcionalidad: '11321 - Detalle protección',
        ruta: 'Consulta-Datos asociados-datos portafolio de producto-detalle',
        accion: 'Consulta Detalle portafolio de Producto',
        observacion: 'Almacenar Código , Nombre del producto'
    },

    Consulta_facturación_portafolio_de_productos: {
        funcionalidad: '11324 - Facturación',
        ruta: 'Consulta-Datos asociados-datos portafolio de producto - facturación',
        accion: 'Consulta Facturación Portafolio de productos',
        observacion: 'Almacenar Código , Nombre del producto'
    },

    Consulta_inactividades_portafolio_de_productos: {
        funcionalidad: '11322 - Inactividades',
        ruta: 'Consulta-Datos asociados-datos portafolio de producto-Inactividades',
        accion: 'Consulta  Inactividades',
        observacion: 'Almacenar Código , Nombre del producto'
    },

    Consulta_histórico: {
        funcionalidad: '11323 - Historico',
        ruta: 'Consulta-Datos asociados-datos portafolio de producto - histórico',
        accion: 'Consulta Histórico',
        observacion: 'Almacenar Código , Nombre del producto'
    },

    Consulta_facturacion_multiactiva: {
        funcionalidad: '1141 - Multiactiva',
        ruta: 'Consulta-Facturacion-Multiactiva',
        accion: 'Consulta Facturación Multiactiva',
        observacion: ''
    },

    Consulta_facturacion_solidaridad: {
        funcionalidad: '1142 - Solidaridad',
        ruta: ' Consulta-Facturacion-Solidaridad',
        accion: 'Consulta Facturacion Solidaridad',
        observacion: ''
    },

    Consulta_facturación_capital_pagado: {
        funcionalidad: '1144 - Capital pagado',
        ruta: ' Consulta-Facturación-Capital Pagado',
        accion: 'Consulta Facturación  Capital Pagado.',
        observacion: ''
    },

    Consulta_cuentas_contables_facturacion: {
        funcionalidad: '1145 - Cuentas contables',
        ruta: 'Consulta - Facturacion - Cuentas contables',
        accion: 'Consulta Facturacion - Cuentas contables',
        observacion: ''
    },

    Consulta_facturacion_recaudos: {
        funcionalidad: '1146 - Recaudos',
        ruta: 'Consulta - Facturación - Recaudos',
        accion: 'Consulta Facturacion - Recaudos',
        observacion: ''
    },

    Consulta_preexistencia_diagnostico: {
        funcionalidad: '115 - Preexistencias',
        ruta: 'Consulta-Preexistencia(Diagnostico)',
        accion: 'Consulta Preexistencia(Diagnostico)',
        observacion: ''
    },

    Consulta_información_beneficiario: {
        funcionalidad: '1.11.2 - Informacion',
        ruta: 'Consulta-Beneficiario-Informacion',
        accion: 'Informacion Beneficiario',
        observacion: ''
    },

    Consulta_información_liquidaciones: {
        funcionalidad: '1.6 - Liquidaciones',
        ruta: 'Consultas-liquidaciones ',
        accion: 'Consulta de liquidaciones',
        observacion: ''
    },

    Consulta_información_reclamaciones: {
        funcionalidad: '1.2 - Reclamaciones',
        ruta: 'Consultas-reclamaciones',
        accion: 'Consulta de reclamaciones',
        observacion: ''
    },

    Consulta_informacion_pagos: {
        funcionalidad: '1.17 - Pagos',
        ruta: 'Consultas-pagos',
        accion: 'Información de pagos',
        observacion: ''
    },

    Consulta_beneficiarios_repetidos: {
        funcionalidad: '1.11.6 - Consulta beneficiarios repetidos',
        ruta: 'Consulta-Beneficiario-Consulta Beneficiarios Repetidos',
        accion: 'Consulta Beneficiarios Repetidos',
        observacion: ''
    },

    Consulta_beneficiarios_fallecidos: {
        funcionalidad: '1.11.7 - Consulta beneficiarios fallecidos',
        ruta: 'Consulta-Beneficiario-Consulta Beneficiarios Fallecidos',
        accion: 'Consulta Beneficiarios Fallecidos',
        observacion: ''
    }
};
