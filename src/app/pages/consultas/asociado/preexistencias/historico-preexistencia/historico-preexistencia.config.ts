import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';

export class HistoricoPreexistenciaConfig {
  /**
   *
   * @description Grid de las tablas.
   */
  gridHistoricoPreexistencia: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridHistoricoPreexistencia.scrollHorizontal = true;
    this.gridHistoricoPreexistencia.columnas = [
      {
        key: '_diagnostico',
        titulo: 'asociado.preexistencias.descripcionDiagnostico',
        configCelda: { width: 200 }
      },
      {
        key: 'fecIni',
        titulo: 'asociado.preexistencias.ingresar.fechaInicio',
        configCelda: { width: 100 }
      },
      {
        key: 'fecReg',
        titulo: 'asociado.preexistencias.ingresar.fechaRegistro',
        configCelda: { width: 100 }
      },
      {
        key: 'causaNom',
        titulo: 'asociado.preexistencias.causa',
        configCelda: { width: 100 }
      },
      {
        key: 'examenNomCor',
        titulo: 'asociado.preexistencias.examen',
        configCelda: { width: 100 }
      },
      {
        key: 'calificacion',
        titulo: 'asociado.preexistencias.calificacion',
        configCelda: { tipo: 'numero', width: 100 }
      },
      {
        key: 'observacion',
        titulo: 'global.observations',
        configCelda: { width: 300 }
      },
      {
        key: 'preEstadoPreexistenciaNom',
        titulo: 'global.status',
        configCelda: { width: 100 }
      },
      {
        key: 'empleadoNombre',
        titulo: 'asociado.preexistencias.actualizar.auditor',
        configCelda: { width: 200 }
      }
    ];
  }
}
