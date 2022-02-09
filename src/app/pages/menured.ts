import { AddressesUrlParams } from "../parameters/addresses-url-params";

export let MENURED_ITEM = {
  "Consultar Solicitud": {
    title: "Gestión Solicitudes",
    path: "",
    children: {
      "Crear Solicitud": {
        title: "Crear Solicitudes",
        key: "create",
        path:
          AddressesUrlParams.PAGES_FORM + "/" + AddressesUrlParams.SECTION_VERIFIC_USUARIO
      },
      "Gestión de solicitud": {
        title: "Consultar Solicitudes",
        path: AddressesUrlParams.PAGES_QUERY_REQUEST_MOMENT1
      }
    }
  }
};
