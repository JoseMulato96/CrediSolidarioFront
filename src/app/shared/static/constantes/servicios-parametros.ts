export const SERVICIOS_PARAMETROS = {
  portafolio: {
    codAfirmacion: 2,
    codEstadoFlujos: 6,
    codCanalVentasIncrementos: 40,
    codDisminuirProteccion: 41,
    codEstadoProtecciones: 3,
    codTiposIncrementos: 38,
    codParamEstados: 3
  },
  portafolioAsociados: {
    estados: '3,1,8,9,2,4,6,5,12,0,7'
  },
  beneficiarios: {
    codEstadoBenAso: '1',
    codEstadoBeneficiario: 1,
    codEstadoInactivo: '5 , 6',
    codEstadosBenAso: 93,
    estadoTipo: 1,
    codTipoBeneficiario: {
      solidaridad: 1,
      familiarDirecto: 2,
      adicionalAntiguo: 3,
      adicional: 4,
      vida: 5,
      principalPE: 6,
      secundarioBS: 7,
      todos: '1,2,3,4,5,6,7'
     }
  },
  datosAsociados: {
    radEstado: 1,
    estadoActivo: 1,
    estadoPignorado: 1,
    registroActual: 1,
    tipoTransaccion: 'P'
  }
};

export const SERVICIOS_PARAMETROS_BENEFICIARIO = {
  repetidos: {
    tipBenDirecto: '2',
    estadoRepetido: '3',
    paramEstBen: '5',
    paramTipParen: '101',
    paramTipIden: '20',
    estAsoMinino: '10',
    estAsoMaximo: '25',
    codigoTipoNovedad: '22',
    estadoActivo: '1'
  },
  fallecidos: {
    estAsoMinino: '10',
    estAsoMaximo: '25',
    tiposBeneficiario: '2,4,3',
    tipoBenSolidaridad: '1',
    auxFunFamiliar: '30,31,34',
    estadoRecPagada: '13',
    paramDoc: '20',
    paramEstBen: '5',
    codParamParen: '101'
  },
  informacion: {
    estadoId: '1,2',
    estadoNombre: '1',
    estados: '1,2,3,5,6,9',
    estadoHistorico: '1,2,3,5,6,9'
  }
};
