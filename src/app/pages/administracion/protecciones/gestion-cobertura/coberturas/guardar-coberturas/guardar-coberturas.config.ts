
export class GuardarCoberturasConfig {

  condicionesVenta: any[];
  condicionesDestinacion: any[];
  condicionesMovimientos: any[];
  condicionesIndemnizacion: any[];

  constructor() {

    this.condicionesVenta = [
      {
        title: 'administracion.protecciones.coberturas.guardar.planFamiliar',
        control: 'planFamiliar',
        value: false
      },
      {
        title: 'administracion.protecciones.coberturas.guardar.renunciarAmparo',
        control: 'renunciarAmparo',
        value: false
      },
      {
        title: 'administracion.protecciones.coberturas.guardar.incremento',
        control: 'incremento',
        value: false
      },
      {
        title: 'administracion.protecciones.coberturas.guardar.disminucionProteccion',
        control: 'disminucionProteccion',
        value: false
      },
      {
        title: 'administracion.protecciones.coberturas.guardar.requisitosMedicos',
        control: 'requisitosMedicos',
        value: false
      },
      {
        title: 'administracion.protecciones.coberturas.guardar.tieneFacturacion',
        control: 'tieneFacturacion',
        value: false
      },
      {
        title: 'administracion.protecciones.coberturas.guardar.tieneProyeccion',
        control: 'tieneProyeccion',
        value: false
      },
      {
        title: 'administracion.protecciones.coberturas.guardar.tieneEstadistica',
        control: 'tieneEstadistica',
        value: false
      }
    ];

    this.condicionesDestinacion = [
      {
        title: 'administracion.protecciones.coberturas.guardar.disponibleGarantia',
        control: 'disponibleGarantia',
        value: false
      }
    ];

    this.condicionesMovimientos = [
      {
        title: 'administracion.protecciones.coberturas.guardar.aplicaReactivacion',
        control: 'aplicaReactivacion',
        value: false
      },
      {
        title: 'administracion.protecciones.coberturas.guardar.aplicaRevocatoria',
        control: 'aplicaRevocatoria',
        value: false
      },
      {
        title: 'administracion.protecciones.coberturas.guardar.aplicaHabilitacion',
        control: 'aplicaHabilitacion',
        value: false
      },
      {
        title: 'administracion.protecciones.coberturas.guardar.aplicaReceso',
        control: 'aplicaReceso',
        value: false
      },
      {
        title: 'administracion.protecciones.coberturas.guardar.aplicaReingreso',
        control: 'aplicaReingreso',
        value: false
      }
    ];

    this.condicionesIndemnizacion = [
      {
        title: 'administracion.protecciones.coberturas.guardar.puedeCancelar',
        control: 'puedeCancelar',
        value: false
      },
      {
        title: 'administracion.protecciones.coberturas.guardar.devolucionRetiro',
        control: 'devolucionRetiro',
        value: false
      },
      {
        title: 'administracion.protecciones.coberturas.guardar.prorroga',
        control: 'prorroga',
        value: false
      },
      {
        title: 'administracion.protecciones.coberturas.guardar.tieneRescate',
        control: 'tieneRescate',
        value: false
      },
      {
        title: 'administracion.protecciones.coberturas.guardar.exoneracionPago',
        control: 'exoneracionPago',
        value: false
      },
      {
        title: 'administracion.protecciones.coberturas.guardar.aplicaSubsistencia',
        control: 'aplicaSubsistencia',
        value: false
      },
      {
        title: 'administracion.protecciones.coberturas.guardar.aplicaDisminucionPorAnticipoPago',
        control: 'aplicaDisminucionPorAnticipoPago',
        value: false
      },
      {
        title: 'administracion.protecciones.coberturas.guardar.beneficiosPorPreexistencia',
        control: 'beneficiosPorPreexistencia',
        value: false
      },
      {
        title: 'administracion.protecciones.coberturas.guardar.reconocimientoPermanencia',
        control: 'reconocimientoPermanencia',
        value: false
      }
    ];

  }

}
