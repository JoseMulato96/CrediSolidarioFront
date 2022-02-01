import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';

export class PreexistenciasConfig {
  /**
   *
   * @description Grid de las tablas.
   */
  gridPreexistencias: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridPreexistencias.columnas = [
      {
        key: 'diagCie09 ',
        titulo: 'asociado.preexistencias.codigoDiagnosticoAnterior'
      },
      {
        key: 'diagCod',
        titulo: 'asociado.preexistencias.codigoDiagnostico',
        configCelda: { tipo: 'link' }
      },
      {
        key: 'diagnostico',
        titulo: 'asociado.preexistencias.descripcionDiagnostico'
      },
      {
        key: 'fecIni',
        titulo: 'asociado.preexistencias.fechaInicio'
      },
      {
        key: 'fecReg',
        titulo: 'asociado.preexistencias.fechaRegistro'
      },
      {
        key: 'causaNom',
        titulo: 'asociado.preexistencias.causa'
      },
      {
        key: 'examenNom',
        titulo: 'asociado.preexistencias.examen'
      },
      {
        key: 'calificacion',
        titulo: 'asociado.preexistencias.calificacion',
        configCelda: { tipo: 'numero' }
      }
    ];
  }
}
