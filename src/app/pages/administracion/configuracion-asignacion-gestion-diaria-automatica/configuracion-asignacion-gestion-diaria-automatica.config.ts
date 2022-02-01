import { MimGridConfiguracion } from './../../../shared/components/mim-grid/mim-grid-configuracion';

export class ConfiguracionAsignacionGestionDiariaAutomaticaConfig {

    gridListarGestionDiaria: MimGridConfiguracion = new MimGridConfiguracion();

    constructor() {
      this.gridListarGestionDiaria.scrollHorizontal = true;
      this.gridListarGestionDiaria.columnas = [
        {
          key: 'mimSolicitud.mimTipoSolicitud.nombre',
          titulo: 'administracion.gestionDiariaAutomatica.grid.tipoSolicitud',
          configCelda: {
              width: 100
          }
        },
        {
          key: 'mimSolicitud.nombre',
          titulo: 'administracion.gestionDiariaAutomatica.grid.solicitud',
          configCelda: {
              width: 250
          }
        },
        {
          key: 'mimRolesFlujo.nombreFase',
          titulo: 'administracion.gestionDiariaAutomatica.grid.faseSolicitud',
          configCelda: {
              width: 130
          }
        },
        {
          key: 'mimRolesFlujo.nombreTarea',
          titulo: 'administracion.gestionDiariaAutomatica.grid.tarea',
          configCelda: {
              width: 150
          }
        },
        {
          titulo: 'administracion.gestionDiariaAutomatica.grid.acciones',
          key: 'editar',
          configCelda: {
              tipo: 'button',
              cssIcon: 'icon-edit-3 text--blue1',
              cssButton: 'btn btn--icon bg--blue2 mx-auto',
              width: 35,
              combinarCeldas: {
                  omitir: false,
                  numeroCombinar: 2
              }
          }
        },
        {
          key: 'eliminar',
          configCelda: {
              tipo: 'button',
              cssIcon: 'icon-trash-3 text--red1',
              cssButton: 'btn btn--icon bg--red2 mx-auto',
              width: 35,
              combinarCeldas: {
                  omitir: true
              }
          }
        }
      ];
    }

}
