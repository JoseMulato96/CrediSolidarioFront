import { GuardarPlanCoberturaOrden } from '../model/guardar-plan-cobertura-orden.model';

export class PlanCoberturaConfig {

  planCoberturaConfig: GuardarPlanCoberturaOrden;
  planCoberturaAsistenciaConfig: GuardarPlanCoberturaOrden;

  constructor() {
    this.planCoberturaConfig = {
      id: 'guardarPlanCoberturaOrdenInicial',
      activeIndex: 0,
      items: [
        {
          id: 'caracteristicasBasicas',
          parentId: 'guardarPlanCoberturaOrdenInicial',
          title: 'administracion.protecciones.planCobertura.guardar.caracteristicasBasicas.titulo',
          label: 'administracion.protecciones.planCobertura.guardar.caracteristicasBasicas.titulo',
          orden: 0,
          items: [
            {
              id: 'condiciones',
              parentId: 'caracteristicasBasicas',
              title: 'administracion.protecciones.planCobertura.guardar.caracteristicasBasicas.condiciones.titulo',
              orden: 0
            }
          ]
        },
        {
          id: 'otrasCaractersiticas',
          parentId: 'guardarPlanCoberturaOrdenInicial',
          title: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.titulo',
          label: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.titulo',
          orden: 1,
          items: [
            {
              id: 'deducibles',
              parentId: 'otrasCaractersiticas',
              title: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.deducibles.titulo',
              orden: 0
            },
            {
              id: 'periodosCarencia',
              parentId: 'otrasCaractersiticas',
              title: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.periodosCarencia.titulo',
              orden: 1
            },
            {
              id: 'exclusionesPlanCobertura',
              parentId: 'otrasCaractersiticas',
              title: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.exclusiones.titulo',
              orden: 2
            },{
              id: 'reglasExcepciones',
              parentId: 'otrasCaractersiticas',
              title: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.reglasExcepciones.titulo',
              orden: 3
            },
            {
              id: 'coberturasSubsistentes',
              parentId: 'otrasCaractersiticas',
              title: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.coberturasSubsistentes.titulo',
              orden: 4
            },
            {
              id: 'valorRescate',
              parentId: 'otrasCaractersiticas',
              title: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.valorRescate.titulo',
              orden: 5
            },
            {
              id: 'valorAsegurado',
              parentId: 'otrasCaractersiticas',
              title: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.valorAsegurado.titulo',
              orden: 6
            },
            {
              id: 'limitacionCobertura',
              parentId: 'otrasCaractersiticas',
              title: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.limitacionCobertura.titulo',
              orden: 7
            },
            {
              id: 'beneficiosPreexistencia',
              parentId: 'otrasCaractersiticas',
              title: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.limitacionCobertura.titulo',
              orden: 8
            },
            {
              id: 'enfermedadesGraves',
              parentId: 'otrasCaractersiticas',
              title: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.enfermedadesGraves.titulo',
              orden: 9
            },
            {
              id: 'conceptosFacturacion',
              parentId: 'otrasCaractersiticas',
              title: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.conceptoFacturacionPlanCobertura.titulo',
              orden: 10
            },
            {
              id: 'desmembracionAccidente',
              parentId: 'otrasCaractersiticas',
              title: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.desmembracionAccidente.titulo',
              orden: 11
            },
            {
              id: 'valorCuota',
              parentId: 'otrasCaractersiticas',
              title: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.valorCuota.titulo',
              orden: 12
            },
            {
              id: 'condicionVenta',
              parentId: 'otrasCaractersiticas',
              title: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.condicionesVenta.titulo',
              orden: 13
            },
            {
              id: 'reconocimientoPermanencia',
              parentId: 'otrasCaractersiticas',
              title: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.reconocimientosPorPermanencia.titulo',
              orden: 14
            }
          ]
        }
      ]
    };

    this.planCoberturaAsistenciaConfig = {
      id: 'guardarPlanCoberturaOrdenInicial',
      activeIndex: 0,
      items: [
        {
          id: 'caracteristicasBasicas',
          parentId: 'guardarPlanCoberturaOrdenInicial',
          title: 'administracion.protecciones.planCobertura.guardar.caracteristicasBasicas.titulo',
          label: 'administracion.protecciones.planCobertura.guardar.caracteristicasBasicas.titulo',
          orden: 0,
          items: [
            {
              id: 'condicionesAsistencia',
              parentId: 'caracteristicasBasicas',
              title: 'administracion.protecciones.planCobertura.guardar.caracteristicasBasicas.condicionesAsistencia.titulo',
              orden: 0
            },
            {
              id: 'condiciones',
              parentId: 'caracteristicasBasicas',
              title: 'administracion.protecciones.planCobertura.guardar.caracteristicasBasicas.condiciones.titulo',
              orden: 1
            }
          ]
        },
        {
          id: 'otrasCaractersiticas',
          parentId: 'guardarPlanCoberturaOrdenInicial',
          title: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.titulo',
          label: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.titulo',
          orden: 1,
          items: [
            {
              id: 'deducibles',
              parentId: 'otrasCaractersiticas',
              title: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.deducibles.titulo',
              orden: 0
            },
            {
              id: 'periodosCarencia',
              parentId: 'otrasCaractersiticas',
              title: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.periodosCarencia.titulo',
              orden: 1
            },
            {
              id: 'exclusionesPlanCobertura',
              parentId: 'otrasCaractersiticas',
              title: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.exclusiones.titulo',
              orden: 2
            },{
              id: 'reglasExcepciones',
              parentId: 'otrasCaractersiticas',
              title: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.reglasExcepciones.titulo',
              orden: 3
            },
            {
              id: 'coberturasSubsistentes',
              parentId: 'otrasCaractersiticas',
              title: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.coberturasSubsistentes.titulo',
              orden: 4
            },
            {
              id: 'valorRescate',
              parentId: 'otrasCaractersiticas',
              title: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.valorRescate.titulo',
              orden: 5
            },
            {
              id: 'valorAsegurado',
              parentId: 'otrasCaractersiticas',
              title: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.valorAsegurado.titulo',
              orden: 6
            },
            {
              id: 'limitacionCobertura',
              parentId: 'otrasCaractersiticas',
              title: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.limitacionCobertura.titulo',
              orden: 7
            },
            {
              id: 'beneficiosPreexistencia',
              parentId: 'otrasCaractersiticas',
              title: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.limitacionCobertura.titulo',
              orden: 8
            },
            {
              id: 'enfermedadesGraves',
              parentId: 'otrasCaractersiticas',
              title: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.enfermedadesGraves.titulo',
              orden: 9
            },
            {
              id: 'conceptosFacturacion',
              parentId: 'otrasCaractersiticas',
              title: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.conceptoFacturacionPlanCobertura.titulo',
              orden: 10
            },
            {
              id: 'desmembracionAccidente',
              parentId: 'otrasCaractersiticas',
              title: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.desmembracionAccidente.titulo',
              orden: 11
            },
            {
              id: 'valorCuota',
              parentId: 'otrasCaractersiticas',
              title: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.valorCuota.titulo',
              orden: 12
            },
            {
              id: 'condicionVenta',
              parentId: 'otrasCaractersiticas',
              title: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.condicionesVenta.titulo',
              orden: 13
            }
          ]
        }
      ]
    };



  }




}
