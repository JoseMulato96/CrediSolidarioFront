import { MimGridConfiguracion } from './../../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class ListarBeneficiarioPagoConfig {

  gridListarBeneficiariosPago: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridListarBeneficiariosPago.scrollHorizontal = true;
    this.gridListarBeneficiariosPago.ordenamientoPersonalizado = true;
    this.gridListarBeneficiariosPago.esFiltra = true;
    this.gridListarBeneficiariosPago.columnas = [
      {
        titulo: 'administracion.protecciones.beneficiarioPago.grid.fondo',
        key: 'mimFondo.nombre',
        configCelda: {
          width: 150,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.protecciones.beneficiarioPago.grid.cobertura',
        key: 'nombre',
        typeFilter: 'multiselect',
        configCelda: {
          width: 150,
          habilitarOrdenamiento: true,
          codeDropdown: 'cobertura'
        }
      },
      {
        titulo: 'administracion.protecciones.beneficiarioPago.grid.estado',
        key: 'estado',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        key: '_fechaModificacion',
        titulo: 'administracion.protecciones.beneficiarioPago.grid.fechaModificacion',
        configCelda: {
          width: 125,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.protecciones.beneficiarioPago.grid.acciones',
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
