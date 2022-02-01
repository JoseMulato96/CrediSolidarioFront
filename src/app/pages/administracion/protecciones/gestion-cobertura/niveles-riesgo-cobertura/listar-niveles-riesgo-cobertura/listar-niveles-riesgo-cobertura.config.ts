import { MimGridConfiguracion } from './../../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class ListarNivelesRiesgoCoberturaConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = true;
    this.gridConfig.ordenamientoPersonalizado = true;
    this.gridConfig.columnas = [
      {
        key: 'mimCobertura.mimFondo.nombre',
        titulo: 'administracion.protecciones.nivelesRiesgosCobertura.grid.fondo',
        configCelda: {
          width: 160,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'mimCobertura.codigo',
        titulo: 'administracion.protecciones.nivelesRiesgosCobertura.grid.codigoCobertura',
        configCelda: {
          width: 140,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'mimCobertura.nombre',
        titulo: 'administracion.protecciones.nivelesRiesgosCobertura.grid.cobertura',
        configCelda: {
          width: 170,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'mimNivelRiesgo.nombre',
        titulo: 'administracion.protecciones.nivelesRiesgosCobertura.grid.nivelesRiesgos',
        configCelda: {
          width: 126,
          habilitarOrdenamiento: true
        }
      },
      {
        key: '_estado',
        titulo: 'administracion.protecciones.nivelesRiesgosCobertura.grid.vigente',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true,
          sortKey: 'estado'
        }
      },
      {
        key: 'fechaModificacion',
        titulo: 'administracion.protecciones.nivelesRiesgosCobertura.grid.fechaModificacion',
        configCelda: {
          width: 150,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.protecciones.nivelesRiesgosCobertura.grid.acciones',
        key: 'editar',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 70
        }
      }
    ];
  }
}
