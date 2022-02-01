import { UrlRoute } from '@shared/static/urls/url-route';
import { SubmenuConfiguracion } from '@shared/components/mim-menu-vertical/mim-menu-vertical.component';

export class DatosAsociadosConfig {
  submenu: SubmenuConfiguracion = {
    titulo: 'Consultas',
    items: [
      {
        titulo: 'asociado.datosBasicos',
        iconCss: 'icon-user-check',
        link: [
          UrlRoute.PAGES,
          UrlRoute.CONSULTAS,
          UrlRoute.CONSULTAS_ASOCIADO,
          ':asoNumInt',
          UrlRoute.CONSULTAS_ASOCIADO_DATOS_ASOCIADO
        ]
      },
      {
        titulo: 'asociado.beneficiario.beneficiario',
        iconCss: 'icon-user-group',
        link: [
          UrlRoute.PAGES,
          UrlRoute.CONSULTAS,
          UrlRoute.CONSULTAS_ASOCIADO,
          ':asoNumInt',
          UrlRoute.BENEFICIARIOS_ASOCIADO
        ]
      },
      {
        titulo: 'asociado.protecciones.protecciones',
        iconCss: 'icon-shield ',
        noClick: true,
        link: [
          UrlRoute.PAGES,
          UrlRoute.CONSULTAS,
          UrlRoute.CONSULTAS_ASOCIADO,
          ':asoNumInt',
          UrlRoute.PROTECCIONES
        ],
        items: [
          {
            titulo: 'asociado.protecciones.portafolioProductos',
            link: [UrlRoute.PORTAFOLIO_ASOCIADOS]
          },
          {
            titulo: 'asociado.protecciones.auxiliosAplicables',
            link: []
          },
          {
            titulo: 'asociado.protecciones.pendientes',
            link: []
          },
          {
            titulo: 'asociado.protecciones.promociones',
            link: []
          }
        ]
      },
      {
        titulo: 'asociado.facturacion.facturacion',
        iconCss: 'icon-money ',
        link: [
          UrlRoute.PAGES,
          UrlRoute.CONSULTAS,
          UrlRoute.CONSULTAS_ASOCIADO,
          ':asoNumInt',
          UrlRoute.FACTURACION_ASOCIADOS
        ],
        noClick: true,
        items: [
          {
            titulo: 'asociado.facturacion.multiactiva.titulo',
            link: [UrlRoute.FACTURACION_ASOCIADOS_MULTIATIVA]
          },
          {
            titulo: 'asociado.facturacion.solidaridad.title',
            link: [UrlRoute.FACTURACION_ASOCIADOS_SOLIDARIDAD]
          },
          {
            titulo: 'asociado.facturacion.ajusteFacturacion'
          },
          {
            titulo: 'asociado.facturacion.capitalPagado.title',
            link: [UrlRoute.FACTURACION_ASOCIADOS_CAPITAL_PAGADO]
          },
          {
            titulo: 'asociado.facturacion.cuentasContables.title',
            link: [UrlRoute.FACTURACION_ASOCIADOS_CUENTAS_CONTABLES]
          },
          {
            titulo: 'asociado.facturacion.recaudos.title',
            link: [UrlRoute.FACTURACION_ASOCIADOS_RECAUDOS]
          }
        ]
      },
      {
        titulo: 'asociado.preexistencias.preexistencias',
        iconCss: 'icon-shield ',
        link: [
          UrlRoute.PAGES,
          UrlRoute.CONSULTAS,
          UrlRoute.CONSULTAS_ASOCIADO,
          ':asoNumInt',
          UrlRoute.PREEXISTENCIAS
        ]
      },
      {
        titulo: 'global.general',
        iconCss: 'icon-medical ',
        noClick: true,
        link: [
          UrlRoute.PAGES,
          UrlRoute.CONSULTAS,
          UrlRoute.CONSULTAS_ASOCIADO,
          ':asoNumInt',
          UrlRoute.GENERAL
        ],
        items: [
          {
            titulo:
              'asociado.general.renunciaAuxilioFunerario.renunciaAuxilioFunerario',
            link: [UrlRoute.GENERAL_ACT_IND_AUX_FUN]
          },
          {
            titulo:
              'asociado.general.actualizaIndicadorFNacimiento.actualizaIndicadorFNacimiento',
            link: [UrlRoute.GENERAL_ACT_IND_FEC_NAC]
          },
          {
            titulo: 'asociado.general.actualizaFechaNacimiento'
          }
        ]
      },
      {
        titulo: 'asociado.responsablePago.titulo',
        iconCss: 'icon-shield ',
        link: [
          UrlRoute.PAGES,
          UrlRoute.CONSULTAS,
          UrlRoute.CONSULTAS_ASOCIADO,
          ':asoNumInt',
          UrlRoute.RESPONSABLE_PAGO
        ]
      },
      {
        titulo: 'asociado.asegurado.titulo',
        iconCss: 'icon-shield ',
        link: [
          UrlRoute.PAGES,
          UrlRoute.CONSULTAS,
          UrlRoute.CONSULTAS_ASOCIADO,
          ':asoNumInt',
          UrlRoute.ASEGURADO
        ]
      },
    ]
  };
}
