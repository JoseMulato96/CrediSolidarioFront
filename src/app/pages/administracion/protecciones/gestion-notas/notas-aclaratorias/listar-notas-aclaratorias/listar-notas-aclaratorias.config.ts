import { MimGridConfiguracion } from './../../../../../../shared/components/mim-grid/mim-grid-configuracion';
import { MimWindModalConfiguracion } from './../../../../../../shared/components/mim-wind-modal/mim-wind-modal.component';

export class ListarNotasAclaratoriasConfig {

  gridListar: MimGridConfiguracion = new MimGridConfiguracion();
  gridPlanesAsociados: MimGridConfiguracion = new MimGridConfiguracion();
  modalResumen: MimWindModalConfiguracion = new MimWindModalConfiguracion();

  constructor() {
    this.gridListar.scrollHorizontal = true;
    this.gridListar.ordenamientoPersonalizado = true;
    this.gridListar.columnas = [
      {
        titulo: 'administracion.cofiguracionCotizadores.gestionNotas.notasAclaratorias.grid.codigo',
        key: 'codigo',
        configCelda: {
          width: 70,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.cofiguracionCotizadores.gestionNotas.notasAclaratorias.grid.tipoSolicitud',
        key: 'mimTipoMovimiento.nombre',
        configCelda: {
          width: 170,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.cofiguracionCotizadores.gestionNotas.notasAclaratorias.grid.nombreNota',
        key: 'nombre',
        configCelda: {
          width: 330,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.cofiguracionCotizadores.gestionNotas.notasAclaratorias.grid.acciones',
        key: 'detalle',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-external-link text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 35,
          combinarCeldas: {
            omitir: false,
            numeroCombinar: 3
          }
        }
      },
      {
        key: 'editar',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 35,
          combinarCeldas: {
            omitir: true
          }
          // funDisabled: this.bloquearBotonEditar
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
          },
          funDisabled: this.bloquearBoton
        }
      }
    ];

    this.modalResumen.width = '80vw';
    this.modalResumen.titulo = 'administracion.cofiguracionCotizadores.gestionNotas.notasAclaratorias.tituloDetalle';

    this.gridPlanesAsociados.paginarDatos = true;
    this.gridPlanesAsociados.scrollHorizontal = false;
    this.gridPlanesAsociados.columnas = [
      {
        titulo: 'administracion.cofiguracionCotizadores.gestionNotas.notasAclaratorias.grid.codigo',
        key: 'mimNotaAclaratoria.codigo',
        configCelda: {
          width: 70,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.cofiguracionCotizadores.gestionNotas.notasAclaratorias.grid.tipoSolicitud',
        key: 'mimNotaAclaratoria.mimTipoMovimiento.nombre',
        configCelda: {
          width: 150,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.cofiguracionCotizadores.gestionNotas.notasAclaratorias.grid.nombreNota',
        key: 'mimNotaAclaratoria.nombre',
        configCelda: {
          width: 250,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.cofiguracionCotizadores.gestionNotas.notasAclaratorias.grid.planesCoberturaAsociadosNotas',
        key: '_planCobertura',
        configCelda: {
          width: 170,
          habilitarOrdenamiento: true
        }
      }
    ];

  }

  bloquearBoton(item: any) {
    return !item.estado;
  }

}
