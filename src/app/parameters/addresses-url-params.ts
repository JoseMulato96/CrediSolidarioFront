export class AddressesUrlParams {
  static LOGIN: string = "login";
  static AUTO_LOGIN: string = "autologin";
  static PAGES_HOME: string = "home";
  static PAGES_INDEX: string = `index`;
  static PAGES_REQUEST_AGENT: string = `agent`;
  static PAGES_FORM1: string = `form1`;
  static SECTION_01: string = `section01`;
  static SECTION_02: string = `section02`;
  static SECTION_03: string = `section03`;
  static SECTION_04: string = `section04`;
  static SECTION_05: string = `section05`;
  static SECTION_06: string = `section06`;
  static SECTION_07: string = `section07`;
  static SECTION_08: string = `section08`;
  static SECTION_09: string = `section09`;
  static SECTION_10: string = `section10`;
  static SECTION_ENC: string = `section_enc`;
  static PAGES_FORM2: string = `form2`;
  static SECTION_UPLOAD_FILES: string = `uploadfile`;
  static PAGES_QUERY_REQUEST_MOMENT1: string = "query_moment1";
  static PAGES_QUERY_REQUEST_MOMENT2: string = "query_moment2";
  static PAGES_ASSIGN_FORM: string = "assign";
  static PAGES_QUERY_AUX: string = "query_aux";

  //Nuevas Bandejas
  static PAGES_QUERY_LIDER_REGIONAL: string = "query_liderR";
  static PAGES_QUERY_LIDER_NACIONAL: string = "query_liderN";

  //Unificacion de momentos
  static PAGES_FORM: string = `form`;

  //Section para verificar usuario evidente
  static SECTION_VERIFIC_USUARIO: string = `verificarUsuario`;

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description construye la ruta del momento 1 o 2 y la seccion
   */
  static PathSectionForm(section: string, form: string) {
    return `${AddressesUrlParams.PAGES_HOME}/${form}/${section}`;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description construye la ruta para ir momento uno de la seccion inicial
   */
  static GetPathFormStart() {
    return `${AddressesUrlParams.PAGES_HOME}/${this.PAGES_FORM}/${
      this.SECTION_01
    }`;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description construye la ruta para ir al index
   */
  static PathIndex() {
    return `${AddressesUrlParams.PAGES_HOME}/${AddressesUrlParams.PAGES_INDEX}`;
  }
}
