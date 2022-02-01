import * as fromPlanCobertura from './plan-cobertura.actions';
import { GuardarPlanCobertura, IGuardarPlanCobertura } from './model/guardar-plan-cobertura.model';
import { MimPlanCobertura } from './model/mim-plan-cobertura.model';
import { Page } from '@shared/interfaces/page.interface';
import { GuardarPlanCoberturaOrden, Estado } from './model/guardar-plan-cobertura-orden.model';

// tslint:disable-next-line:prefer-const
let estadoInicial: GuardarPlanCobertura;
export let State: IGuardarPlanCobertura;

export function planCoberturaReducer(state = estadoInicial, action: fromPlanCobertura.acciones): IGuardarPlanCobertura {
  switch (action.type) {
    case fromPlanCobertura.POST_DATOS_PRINCIPALES:
      const planCobertura = new MimPlanCobertura(action.object);
      if (state) {
        actualizarEstado(action.id, action.estado, action.stepec);
      }

      return {
        ...state,
        stepsBloqueados: false,
        cardBloqueadas: false,
        planCobertura: planCobertura,
        guardarPlanCoberturaOrden: action.stepec
      };
    case fromPlanCobertura.GET_DATOS_PRINCIPALES:
      return state;
    case fromPlanCobertura.POST_CONDICIONES:
      const condiciones = new Page(action.object);
      if (state) {
        actualizarEstado(action.id, action.estado, state.guardarPlanCoberturaOrden);
      }

      return {
        ...state, condiciones: condiciones,
        guardarPlanCoberturaOrden: state.guardarPlanCoberturaOrden
      };
    case fromPlanCobertura.POST_CONDICIONES_ASISTENCIA:
      const condicionesAsistencia = new Page(action.object);
      if (state) {
        actualizarEstado(action.id, action.estado, state.guardarPlanCoberturaOrden);
      }

      return {
        ...state, condicionesAsistencia: condicionesAsistencia,
        guardarPlanCoberturaOrden: state.guardarPlanCoberturaOrden
      };
    case fromPlanCobertura.POST_PERIODOS_CARENCIA:
      const periodosCarencia = new Page(action.object);
      if (state) {
        actualizarEstado(action.id, action.estado, state.guardarPlanCoberturaOrden);
      }

      return {
        ...state, periodosCarencia: periodosCarencia,
        guardarPlanCoberturaOrden: state.guardarPlanCoberturaOrden
      };
    case fromPlanCobertura.POST_DEDUCIBLES:
      const deducibles = new Page(action.object);
      if (state) {
        actualizarEstado(action.id, action.estado, state.guardarPlanCoberturaOrden);
      }

      return {
        ...state, deducibles: deducibles,
        guardarPlanCoberturaOrden: state.guardarPlanCoberturaOrden
      };
    case fromPlanCobertura.POST_VALOR_RESCATE:
      const valorRescate = new Page(action.object);
      if (state) {
        actualizarEstado(action.id, action.estado, state.guardarPlanCoberturaOrden);
      }

      return {
        ...state, valorRescate: valorRescate,
        guardarPlanCoberturaOrden: state.guardarPlanCoberturaOrden
      };
    case fromPlanCobertura.POST_DESMEMBRACION_ACCIDENTE:
      const desmembracionAccidente = new Page(action.object);
      if (state) {
        actualizarEstado(action.id, action.estado, state.guardarPlanCoberturaOrden);
      }

      return {
        ...state, desmembracionAccidente: desmembracionAccidente,
        guardarPlanCoberturaOrden: state.guardarPlanCoberturaOrden
      };
    case fromPlanCobertura.POST_VALOR_CUOTA:
      const valorCuota = new Page(action.object);
      if (state) {
        actualizarEstado(action.id, action.estado, state.guardarPlanCoberturaOrden);
      }

      return {
        ...state, valorCuota: valorCuota,
        guardarPlanCoberturaOrden: state.guardarPlanCoberturaOrden
      };
    case fromPlanCobertura.POST_VALOR_ASEGURADO:
      const valorAsegurado = action.object;
      if (state) {
        actualizarEstado(action.id, action.estado, state.guardarPlanCoberturaOrden);
      }

      return {
        ...state, valorAsegurado: valorAsegurado,
        guardarPlanCoberturaOrden: state.guardarPlanCoberturaOrden
      };
    case fromPlanCobertura.POST_EXCLUSIONES:
      const exclusiones = new Page(action.exclusion);
      if (state) {
        actualizarEstado(action.id, action.estado, state.guardarPlanCoberturaOrden);
      }

      return {
        ...state, exclusionesPlanCobertura: exclusiones,
        guardarPlanCoberturaOrden: state.guardarPlanCoberturaOrden
      };
    case fromPlanCobertura.POST_LIMITACION_COBERTURA:
      const maximoDiasPagarEvento = action.maximoDiasPagarEvento;
      const excepcionDiagnostico = new Page(action.object1);
      const condicionPagoAntiguedad = new Page(action.object2);
      const sublimitesCobertura = new Page(action.object3);
      const condicionesPagarEventos = new Page(action.object4);
      if (state) {
        actualizarEstado(action.id, action.estado, state.guardarPlanCoberturaOrden);
      }

      return {
        ...state, maximoDiasPagarEvento: maximoDiasPagarEvento, excepcionDiagnostico: excepcionDiagnostico, condicionPagoAntiguedad: condicionPagoAntiguedad,
        sublimiteCobertura: sublimitesCobertura,
        condicionesPagarEvento:condicionesPagarEventos,
        guardarPlanCoberturaOrden: state.guardarPlanCoberturaOrden
      };
    case fromPlanCobertura.POST_COBERTURA_SUBSISTENTES:
      const subsistente = new Page(action.object);
      if (state) {
        actualizarEstado(action.id, action.estado, state.guardarPlanCoberturaOrden);
      }

      return {
        ...state, subsistentePlanCobertura: subsistente,
        guardarPlanCoberturaOrden: state.guardarPlanCoberturaOrden
      };
    case fromPlanCobertura.POST_COBERTURA_ADICIONALES:
      const adicional = new Page(action.object);
      if (state) {
        actualizarEstado(action.id, action.estado, state.guardarPlanCoberturaOrden);
      }

      return {
        ...state, adicionalPlanCobertura: adicional,
        guardarPlanCoberturaOrden: state.guardarPlanCoberturaOrden
      };
    case fromPlanCobertura.POST_BENEFICIO_PREEXISTENCIA:
      const preexistencia = new Page(action.object);
      if (state) {
        actualizarEstado(action.id, action.estado, state.guardarPlanCoberturaOrden);
      }

      return {
        ...state, beneficioPreexistencia: preexistencia,
        guardarPlanCoberturaOrden: state.guardarPlanCoberturaOrden
      };
    case fromPlanCobertura.POST_ENFERMEDAD_GRAVE:
      const enfermedad = new Page(action.object);
      if (state) {
        actualizarEstado(action.id, action.estado, state.guardarPlanCoberturaOrden);
      }

      return {
        ...state, enfermedadGravePlanCobertura: enfermedad,
        guardarPlanCoberturaOrden: state.guardarPlanCoberturaOrden
      };
    case fromPlanCobertura.POST_CONCEPTO_FACTURACION:
      const concepto = new Page(action.object);
      if (state) {
        actualizarEstado(action.id, action.estado, state.guardarPlanCoberturaOrden);
      }

      return {
        ...state, conceptoFacturacionPlanCobertura: concepto,
        guardarPlanCoberturaOrden: state.guardarPlanCoberturaOrden
      };

    case fromPlanCobertura.POST_CONDICIONES_VENTA:
      const condicionesVenta = new Page(action.object);
      if (state) {
        actualizarEstado(action.id, action.estado, state.guardarPlanCoberturaOrden);
      }

      return {
        ...state, condicionVenta: condicionesVenta,
        guardarPlanCoberturaOrden: state.guardarPlanCoberturaOrden
      };

    case fromPlanCobertura.POST_RECONOCIMIENTO_POR_PERMANENCIA:
      const reconocimientoPermanencia = new Page(action.object);
      if (state) {
        actualizarEstado(action.id, action.estado, state.guardarPlanCoberturaOrden);
      }

      return {
        ...state, reconocimientosPermanencia: reconocimientoPermanencia,
        guardarPlanCoberturaOrden: state.guardarPlanCoberturaOrden
      };

    case fromPlanCobertura.POST_REGLAS_EXCEPCIONES:
      const reglasExcepciones = new Page(action.object);
      if (state) {
        actualizarEstado(action.id, action.estado, state.guardarPlanCoberturaOrden);
      }
      return {
        ...state, reglasExcepciones: reglasExcepciones,
        guardarPlanCoberturaOrden: state.guardarPlanCoberturaOrden
      };
    case fromPlanCobertura.POST_POSICION_STEP:
      return {
        ...state,
        guardarPlanCoberturaOrden: { ...state.guardarPlanCoberturaOrden, activeIndex: action.posicion }
      };
    case fromPlanCobertura.CLEAN:
      if (state) {
        limpiarEstados(state.guardarPlanCoberturaOrden);
      }

      return estadoInicial;
    default:
      return state;
  }
}

/**
 * Actualiza un estado en la estructura. Esta funcion NO se debe utilizar fuera de este archivo.
 * @param id ID de la seccion
 * @param estado Estado que se desea configurar a la seccion
 * @param orden Estructura que almacena estados, titulos y ordenes.
 */
function actualizarEstado(id: string, estado: Estado, orden: GuardarPlanCoberturaOrden) {
  // Debemos buscar el id en la estructura orden y modificarle el estado.
  if (orden.id === id) {
    orden.estado = estado;
  } else if (orden.items && orden.items.length !== 0) {
    orden.items.forEach(item => actualizarEstado(id, estado, item));
  }
}

/**
 * Limpia la estructura que almacena los estados.
 * @param orden Estructura que almacena estados, titulos y ordenes.
 */
function limpiarEstados(orden: GuardarPlanCoberturaOrden) {
  orden.estado = Estado.Pendiente;
  if (!orden.items || orden.items.length === 0) {
    return;
  }
  orden.items.forEach(item => limpiarEstados(item));
}

/**
 * Se encarga de obtener una seccion por Id (GuardarPlanCoberturaOrden). Funcion utilitaria, se puede utilizar fuera de este archivo.
 * @param id ID de la seccion.
 * @param orden Estructura que almacena estados, titulos y ordenes.
 */
export function obtenerSeccionPorId(id: string, orden: GuardarPlanCoberturaOrden): GuardarPlanCoberturaOrden {
  if (!orden) {
    return;
  }

  if (orden.id === id) {
    return orden;
  } else if (orden.items && orden.items.length !== 0) {
    for (let i = 0; i < orden.items.length; i++) {
      const _orden = obtenerSeccionPorId(id, orden.items[i]);
      if (_orden) {
        return _orden;
      }
    }
  } else {
    return;
  }
}

/**
 * Obtiene una seccion por oden.
 * @param orden Orden que se desea buscar. Numerico.
 * @param items Items en los que se buscara dicho orden.
 */
export function obtenerSeccionPorOrden(orden: number, items: GuardarPlanCoberturaOrden[]): GuardarPlanCoberturaOrden {
  if (items && items.length !== 0) {
    for (let i = 0; i < items.length; i++) {
      if (items[i].orden === orden) {
        return items[i];
      }
    }
  } else {
    return;
  }
}

export function obtenerSeccionAnteriorPorId(id: string, orden: GuardarPlanCoberturaOrden): GuardarPlanCoberturaOrden {
  // Validamos que la estructura no este indefinida.
  if (!orden) {
    return;
  }

  // Obtenemos el orden de la seccion en que estamos actualmente.
  const seccion = obtenerSeccionPorId(id, orden);
  // Validamos que no haya errores la seccion.
  if (!seccion) {
    return;
  }

  if (seccion.orden === 0) {
    // TODO(alobaton): Validamos el estado del paso anterior.
    // return;

    // Obtenemos la seccion padre.
    const seccionPadre = obtenerSeccionPorId(seccion.parentId, orden);
    // Validamos el orden de la seccion padre.
    if (seccionPadre.orden === 0) {
      return;
    }

    const ordenPadreAnterior = seccionPadre.orden - 1;
    if (ordenPadreAnterior < 0) {
      return;
    }

    const root = obtenerSeccionPorId(seccionPadre.parentId, orden);
    const seccionPadreAnterior = obtenerSeccionPorOrden(ordenPadreAnterior, root.items);

    // Retornamos la ultima seccion del hermano.
    return JSON.parse(JSON.stringify(seccionPadreAnterior.items)).pop();
  }

  const ordenAnterior = seccion.orden - 1;
  if (ordenAnterior < 0) {
    return;
  }

  const _seccionPadre = obtenerSeccionPorId(seccion.parentId, orden);
  return obtenerSeccionPorOrden(ordenAnterior, _seccionPadre.items);
}


