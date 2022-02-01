import { MimGridConfiguracion } from './../../../../shared/components/mim-grid/mim-grid-configuracion';

export class AuditoriaEntidadConfig {
  gridAuditoria: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridAuditoria.selectMode = false;
    this.gridAuditoria.scrollHorizontal = true;
    this.gridAuditoria.pagina = 0;
    this.gridAuditoria.datos = [];
    this.gridAuditoria.columnas = [
      {
        key: 'codigo',
        titulo: 'ID',
        configCelda: { width: 50, cssKey: '' }
      },
      {
        key: 'nombreTabla',
        titulo: 'NOMBRE_TABLA',
        configCelda: { width: 150, cssKey: '' }
      },
      {
        key: 'auditoria',
        titulo: 'AUDITABLE',
        configCelda: {
          tipo: 'icon',
          cssKey: 'auditoria',
          width: 50
          , funCss: this.calcularClaseEstado
        }
      },
      {
        key: 'crear',
        titulo: 'C',
        configCelda: {
          tipo: 'icon',
          width: 50,
          cssKey: 'crear',
          funCss: this.calcularClaseEstado
        }
      },
      {
        key: 'leer',
        titulo: 'R',
        configCelda: {
          tipo: 'icon',
          cssKey: 'leer',
          width: 50,
          funCss: this.calcularClaseEstado
        }
      },
      {
        key: 'actualizar',
        titulo: 'U',
        configCelda: {
          tipo: 'icon',
          cssKey: 'actualizar',
          width: 50,
          funCss: this.calcularClaseEstado
        }
      },
      {
        key: 'eliminar',
        titulo: 'D',
        configCelda: {
          tipo: 'icon',
          cssKey: 'eliminar',
          width: 50,
          funCss: this.calcularClaseEstado
        }
      }


    ];
  }

  calcularClaseEstado(estado: string) {
    let color: string[] = ['bg--gray1'];
    if (estado === '2') {
      color = ['icon-square text--gray1'];
    } else {
      color = ['icon-check-square text--orange1'];
    }
    return color;
  }
}
