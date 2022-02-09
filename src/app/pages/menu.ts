import { AddressesUrlParams } from "../parameters/addresses-url-params";

export let MENU_ITEM = {
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
      "Gestion de solicitud": {
        title: "Consultar Solicitudes",
        path: AddressesUrlParams.PAGES_QUERY_REQUEST_MOMENT1
      }
    }
  },

  "Gestion Agente": {
    title: "Gestión de Agentes",
    path: "",
    children: {
      "Continuar Solicitud": {
        title: "Continuar Solicitudes",
        path: AddressesUrlParams.PAGES_QUERY_REQUEST_MOMENT2
      },
      "Gestion Agente": {
        title: "Consultar Solicitudes",
        path: AddressesUrlParams.PAGES_QUERY_REQUEST_MOMENT2
      },
      "Gestion Incidencias": {
        title: "Gestión Incidencias",
        path: AddressesUrlParams.PAGES_QUERY_AUX
      },
      "Asignar Solicitud": {
        title: "Asignar Solicitudes",
        path: AddressesUrlParams.PAGES_ASSIGN_FORM
      }
    }
  },

  "Gestion Lider": {
    title: "Gestión Lideres",
    path: "",
    children: {
      "Lider Regional": {
        title: "Consultar Solicitudes",
        path: AddressesUrlParams.PAGES_QUERY_LIDER_REGIONAL
      },
      "Lider Nacional": {
        title: "Consultar Solicitudes",
        path: AddressesUrlParams.PAGES_QUERY_LIDER_NACIONAL
      }
    }
  },
};
