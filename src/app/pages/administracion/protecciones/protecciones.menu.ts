import { UrlRoute } from '@shared/static/urls/url-route';
import { SubmenuConfiguracion } from '@shared/components/mim-menu-vertical/mim-menu-vertical.component';

export class ProteccionesMenu {
  static submenu: SubmenuConfiguracion = {
    titulo: 'Administración',
    items: [
      {
        titulo: 'Clientes',
        iconCss: 'icon-user-check',
        link:
        [ UrlRoute.PAGES,
          UrlRoute.ADMINISTRACION,
          UrlRoute.ADMINSTRACION_PROTECCIONES,
          UrlRoute.ADMINISTRACION_PROTECCIONES_CLIENTES
        ]
      },
      {
        titulo: 'Categorías Asociado',
        iconCss: 'icon-user-check',
        link:
        [ UrlRoute.PAGES,
          UrlRoute.ADMINISTRACION,
          UrlRoute.ADMINSTRACION_PROTECCIONES,
          UrlRoute.ADMINISTRACION_PROTECCIONES_CATEGORIAS_ASOCIADO
        ]
      },
      {
        titulo: 'Homologación Categorías',
        iconCss: 'icon-user-check',
        link:
        [ UrlRoute.PAGES,
          UrlRoute.ADMINISTRACION,
          UrlRoute.ADMINSTRACION_PROTECCIONES,
          UrlRoute.ADMINISTRACION_PROTECCIONES_CATEGORIAS_ASOCIADO_HOMOLOGACION
        ]
      },
      {
        titulo: 'Estados Asociado',
        iconCss: 'icon-user-check',
        link:
        [ UrlRoute.PAGES,
          UrlRoute.ADMINISTRACION,
          UrlRoute.ADMINSTRACION_PROTECCIONES,
          UrlRoute.ADMINISTRACION_PROTECCIONES_CLIENTE_ESTADO_ASOCIADO
        ]
      },
      {
        titulo: 'Fondo',
        iconCss: 'icon-user-check',
        link:
        [ UrlRoute.PAGES,
          UrlRoute.ADMINISTRACION,
          UrlRoute.ADMINSTRACION_PROTECCIONES,
          UrlRoute.ADMINISTRACION_PROTECCIONES_FONDOS
        ]
      },
      {
        titulo: 'Exclusiones',
        iconCss: 'icon-user-check',
        link:
        [ UrlRoute.PAGES,
          UrlRoute.ADMINISTRACION,
          UrlRoute.ADMINSTRACION_PROTECCIONES,
          UrlRoute.ADMINISTRACION_PROTECCIONES_EXCLUSIONES
        ]
      },
      {
        titulo: 'Enfermedades Graves',
        iconCss: 'icon-user-check',
        link:
        [ UrlRoute.PAGES,
          UrlRoute.ADMINISTRACION,
          UrlRoute.ADMINSTRACION_PROTECCIONES,
          UrlRoute.ADMINISTRACION_PROTECCIONES_ENFERMEDADES_GRAVES
        ]
      },
      {
        titulo: 'Gestión Coberturas',
        iconCss: 'icon-user-check',
        noClick: true,
        link: [],
        items: [
          {
            titulo: 'Coberturas',
            link:
            [ UrlRoute.PAGES,
              UrlRoute.ADMINISTRACION,
              UrlRoute.ADMINSTRACION_PROTECCIONES,
              UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA,
              UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_COBERTURAS
            ]
          },
          {
            titulo: 'Beneficiario Pago',
            link:
            [ UrlRoute.PAGES,
              UrlRoute.ADMINISTRACION,
              UrlRoute.ADMINSTRACION_PROTECCIONES,
              UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA,
              UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_BENEFICIARIO_PAGO
            ]
          },
          {
            titulo: 'Requisitos Control Médicos',
            link:
            [ UrlRoute.PAGES,
              UrlRoute.ADMINISTRACION,
              UrlRoute.ADMINSTRACION_PROTECCIONES,
              UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA,
              UrlRoute.ADMINISTRACION_PROTECCIONES_REQUISITOS_CONTROL_MEDICO
            ]
          },
          {
            titulo: 'Riesgo por Cobertura',
            link:
            [ UrlRoute.PAGES,
              UrlRoute.ADMINISTRACION,
              UrlRoute.ADMINSTRACION_PROTECCIONES,
              UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA,
              UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_NIVELES_RIESGO_COBERTURA
            ]
          },
          {
            titulo: 'Exclusiones Cobertura',
            link:
            [ UrlRoute.PAGES,
              UrlRoute.ADMINISTRACION,
              UrlRoute.ADMINSTRACION_PROTECCIONES,
              UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA,
              UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_EXCLUSIONES_COBERTURA
            ]
          }
        ]
      },

      {
        titulo: 'Gestión Cúmulos',
        iconCss: 'icon-user-check',
        noClick: true,
        link: [],
        items: [
          {
            titulo: 'Cúmulos',
            link:
            [ UrlRoute.PAGES,
              UrlRoute.ADMINISTRACION,
              UrlRoute.ADMINSTRACION_PROTECCIONES,
              UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_CUMULOS,
              UrlRoute.ADMINISTRACION_PROTECCIONES_CUMULOS
            ],
          },
          {
            titulo: 'Cúmulos cobertura',
            link:
            [ UrlRoute.PAGES,
              UrlRoute.ADMINISTRACION,
              UrlRoute.ADMINSTRACION_PROTECCIONES,
              UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_CUMULOS,
              UrlRoute.ADMINISTRACION_PROTECCIONES_CUMULOS_COBERTURA
            ]
          },
          {
            titulo: 'Control cúmulos',
            link:
            [ UrlRoute.PAGES,
              UrlRoute.ADMINISTRACION,
              UrlRoute.ADMINSTRACION_PROTECCIONES,
              UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_CUMULOS,
              UrlRoute.ADMINISTRACION_PROTECCIONES_CONTROL_CUMULOS
            ]
          },
        ]
      },

      {
        titulo: 'Gestión Plan',
        iconCss: 'icon-user-check',
        noClick: true,
        link: [],
        items: [
          {
            titulo: 'Plan',
            link:
            [ UrlRoute.PAGES,
              UrlRoute.ADMINISTRACION,
              UrlRoute.ADMINSTRACION_PROTECCIONES,
              UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN,
              UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLANES
            ]
          },
          {
            titulo: 'Medio Facturación Plan',
            link:
            [ UrlRoute.PAGES,
              UrlRoute.ADMINISTRACION,
              UrlRoute.ADMINSTRACION_PROTECCIONES,
              UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN,
              UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_MEDIO_FACTURACION_PLAN
            ]
          },
          {
            titulo: 'Canal Venta y Movimientos',
            link:
            [ UrlRoute.PAGES,
              UrlRoute.ADMINISTRACION,
              UrlRoute.ADMINSTRACION_PROTECCIONES,
              UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN,
              UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_CANAL_VENTAS_MOVIMIENTO
            ]
          },
          {
            titulo: 'Frecuencia Facturación Plan',
            link:
            [ UrlRoute.PAGES,
              UrlRoute.ADMINISTRACION,
              UrlRoute.ADMINSTRACION_PROTECCIONES,
              UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN,
              UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_FRECUENCIA_FACTURACION_PLAN
            ]
          },
          {
            titulo: 'Nivel de Riesgo Plan',
            link:
            [ UrlRoute.PAGES,
              UrlRoute.ADMINISTRACION,
              UrlRoute.ADMINSTRACION_PROTECCIONES,
              UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN,
              UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_NIVEL_RIESGO_PLAN
            ]
          }
        ]
      },
      {
        titulo: 'Plan Cobertura',
        iconCss: 'icon-user-check',
        link:
        [ UrlRoute.PAGES,
          UrlRoute.ADMINISTRACION,
          UrlRoute.ADMINSTRACION_PROTECCIONES,
          UrlRoute.ADMINISTRACION_PROTECCIONES_PLAN_COBERTURA
        ]
      }

    ]
  };
}
