import { UrlRoute } from '@shared/static/urls/url-route';
import { SubmenuConfiguracion } from '@shared/components/mim-menu-vertical/mim-menu-vertical.component';

export class BeneficiarioMenu {
  static submenu: SubmenuConfiguracion = {
    titulo: 'Consultas',
    items: [
      {
        titulo: 'beneficiarios.menu.informacion',
        link: [
          UrlRoute.PAGES,
          UrlRoute.CONSULTAS,
          UrlRoute.BENEFICIARIOS,
          UrlRoute.BENEFICIARIOS_INFORMACION
        ]
      },
      {
        titulo: 'beneficiarios.menu.actualizacionFechaNacimiento',
        link: [
          UrlRoute.PAGES,
          UrlRoute.CONSULTAS,
          UrlRoute.BENEFICIARIOS,
          UrlRoute.BENEFICIARIOS_FECHA_NACIMIENTO
        ]
      },
      {
        titulo: 'beneficiarios.menu.beneficiarios',
        iconCss: 'icon-user-check',
        noClick: true,
        link: [UrlRoute.PAGES, UrlRoute.CONSULTAS, UrlRoute.BENEFICIARIOS],
        items: [
          {
            titulo: 'beneficiarios.menu.repetidos',
            link: [UrlRoute.BENEFICIARIOS_REPETIDOS]
          },
          {
            titulo: 'beneficiarios.menu.fallecidos',
            link: [UrlRoute.BENEFICIARIOS_FALLECIDOS]
          }
        ]
      }
    ]
  };
}
