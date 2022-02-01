export class DatosAsociado {
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Nombre
   */
  nomCli = '';
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Id de asociado
   */
  nitCli = '';

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description numero del tipo de documento
   */
  tipDoc: number;
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description  Codigo
   */
  asoCod = '';

  /**
   *
   * @description Identificador unico de asociado
   */
  numInt = '';
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Nivel de riesgo
   */
  nivelRiesgo = ''; /// no esta
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description fecha de nacimiento
   */
  fecNac: string;
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description estado de asociado
   */
  desEstado = '';
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Corte
   */
  desCorte = '';
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Auxilio Funerario
   */
  desAuxFun = '';

  /**
   *
   * @description Indicador fecha de nacimiento
   */
  vinIndFechaNacimiento = '';

  /**
   * @description Categoria del asociado (Se obtiene de SipVinculacionesTipo)
   */
  categoriaAsociado = '';
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Fecha de estado
   */
  fecEstado = '';
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description edad de ingreso
   */
  edadIng = '';
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description salario minimo
   */
  smmlv = 0;
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Fecha de Ingreso
   */
  fecIngreso = '';
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description edad
   */
  edad = 0; // calcular
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description proteccion acumulada
   */
  proAcuAltoCosto = 0; /// eduar
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Id Oficiva de vinculacion
   */
  idOficina = '';
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Descripcion de la oficina de vinculacion
   */
  desOficina = '';
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description tipo de vinculación
   */
  tipoVin: string;
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description prima Nivelada
   */
  primaNivelada: number;

  // informacion de proteccion
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description valor de
   */
  proMaxVida: number;
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description valor de
   */
  proAcuVida: number;
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description valor de
   */
  proMaxPerseverancia: number;
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description valor de
   */
  proAcuPersevenrancia: number;
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description valor de
   */
  proMaxRenta: number;
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description valor de
   */
  proAcuRenta: number;
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description valor de
   */
  proMaxTotal: number;
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description valor de
   */
  proAcuTotal: number;

  /// informacion de contacto
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description direccion del contacto
   * @return
   */
  dirRes = '';
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description barrio del contacto
   * @return
   */
  barRes = '';
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description correo del contacto
   */
  mail = '';

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description ciudad de contacto
   */
  ciuRes: string;
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description telefono de contacto
   */
  telRes = '';
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Numero Celular
   */
  cel = '';
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description correspondecia de contacto
   */
  tipUbiDirCor = '';
  /// informacion laboral
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description direccion laboral
   */
  dirCom = '';
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description barrio laboral
   */
  barCom = '';
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description ciudad laboral
   */
  ciuCom = '';
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description telefono laboral
   */
  telCom: string;
  /// informacion familiar
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description direccion familiar
   */
  dirFam = '';
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description barrio familiar
   */
  barFam = '';
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description ciudad familiar
   */
  ciuFam = '';
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description telefono familiar
   */
  telFam = '';
  // informacion de apartado aéreo
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description apartado aereo
   */
  codCiuAero = '';
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description ciudad Aereo
   */
  ciuAero = '';
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description  casillero aereo
   */
  dirAero = '';
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description  tipoAsociado
   */
   tipoAsociado = "";
/**
   * @author Jorge Luis Caviedes Alvarado
   * @description  cliente
   */
   cliente = "";
}
