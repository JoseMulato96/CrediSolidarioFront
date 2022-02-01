export const APP_PARAMETROS = {
  MIN_SEARCH_CHARACTERS: 3,
  BENEFICIARIO_DETALLES: [
    {
      value: 'BENEFICIARIOS AUXILIO FUNERARIO',
      css: 'bg--green1',
      estadoRepetido: 'R'
    },
    { value: 'PLAN BÁSICO', css: 'bg--orange1' },
    { value: 'ASISTENCIAS', css: 'bg--green1' },
    { value: 'BENEFICIARIOS OTROS PRODUCTOS', css: 'bg--yellow1' },
    { value: 'PLANES ADICIONALES', css: 'bg--green2' }
  ],
  BENEFICIARIO_NUEVO: {
    TIPO_IDENTIFICACION: {
      NIT: 7
    },
    PORCENTAJE: {
      value: 'BENEFICIARIOS SOLIDARIDAD'
    },
    FILTRO_TIPO_BENEFICIARIO: {
      SOLIDARIDAD: ['S'],
      AUXILIO_FUNERARIO: ['D', 'F'],
      OTROS: ['V', 'PE', 'BS']
    },
    PARENTESCO: {
      MADRE: { value: '1' },
      PADRE: { value: '2' },
      HIJO: { value: '3' },
      HIJA: { value: '4' },
      JURIDICO: { value: '23' },
      HIJASTRO: { value: '18' },
      NIETO: { value: '9' },
      HERMANO: { value: '6' },
      SOBRINO: { value: '8' }
    },
    TIPO_BENEFICIARIO: {
      SOLIDARIDAD: '1',
      FAMILIAR_DIRECTO: '2',
      ADICIONAL: '4',
      VIDA: '5',
      PE: '6',
      BS: '7'
    }
  },
  CAPITAL_PAGADO_DETALLES: [
    {
      value: 'PLAN BÁSICO',
      css: 'bg--orange1'
    }
  ],
  PROTECCIONES: {
    PORTAFOLIO_ASOCIADOS: {
      AUXILIO_FUNERARIO: 84
    },
    PORTAFOLIO_ASOCIADOS_DETALLE: {
      AUXILIO_FUNERARIO: 84,
      proTipoPago: 3
    },
    CATEGORIA_PROTECCION: {
      PLANES_ADICIONALES: 119,
      AUXILIO_FUNERARIO: 120,
      ASISTENCIAS: 121,
      PLAN_BASICO: 136
    },
    COLORES_BADGE: [
      { value: 'PLAN BÁSICO', css: 'bg--orange1' },
      { value: 'ASISTENCIAS', css: 'bg--green1' },
      { value: 'AUXILIO FUNERARIO', css: 'bg--yellow1' },
      { value: 'PLANES ADICIONALES', css: 'bg--green2' }
    ]
  }
};
