import { MimGridConfiguracion } from "@shared/components/mim-grid/mim-grid-configuracion";

export class ListasCotizacionConfig {

  gridListar: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridListar.scrollHorizontal = false;
    this.gridListar.ordenamientoPersonalizado = true;
    this.gridListar.columnas = [
      {
        titulo: 'asociado.protecciones.portafolio.cotizacion.listaAsegurados.estado',
        key: '_estado',
        configCelda: {
          width: 25,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'asociado.protecciones.portafolio.cotizacion.listaAsegurados.tipoId',
        key: 'tipoId',
        configCelda: {
          width: 20,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'asociado.protecciones.portafolio.cotizacion.listaAsegurados.numeroId',
        key: 'numeroId',
        configCelda: {
          width: 30,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'asociado.protecciones.portafolio.cotizacion.listaAsegurados.nombre',
        key: '_nombres',
        configCelda: {
          width: 30,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'asociado.protecciones.portafolio.cotizacion.listaAsegurados.parentesco',
        key: 'mimParentesco.nombre',
        configCelda: {
          width: 30,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'asociado.protecciones.portafolio.cotizacion.listaAsegurados.fechaNacimiento',
        key: 'fechaNacimiento',
        configCelda: {
          width: 40,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'asociado.protecciones.portafolio.cotizacion.listaAsegurados.edad',
        key: '_edad',
        configCelda: {
          width: 20,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'asociado.protecciones.portafolio.cotizacion.listaAsegurados.sexo',
        key: 'sexo',
        configCelda: {
          width: 20,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'asociado.protecciones.portafolio.cotizacion.listaAsegurados.acciones',
        key: 'editar',
        configCelda: {
          tipo: 'button',
          cssIcon: 'mr-3 icon-money text--green1',
          cssButton: 'btn btn--icon bg--red2 mx-auto',
          width: 12,
          combinarCeldas: {
            omitir: false,
            numeroCombinar: 3
          }
          // funDisabled: this.bloquearBotonEditar
        }
      },
      {
        key: 'eliminar',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-chevron-down text--green1',
          cssButton: 'btn btn--icon bg--red2 mx-auto',
          width: 5,
          combinarCeldas: {
            omitir: true
          },
          funDisabled: this.bloquearBoton
        }
      },
      {
        key: 'eliminar',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-x text--red1',
          cssButton: 'btn n--icon bg--red2 mx-auto',
          width: 5,
          combinarCeldas: {
            omitir: true
          },
          funDisabled: this.bloquearBoton
        }
      }
    ];
  }

  bloquearBoton(item: any) {
    return !item.estado;
  }
}
