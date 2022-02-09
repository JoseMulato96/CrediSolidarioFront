// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment: environmentClass = {
  production: false,
  keycaptcha: "6Ld1tY0UAAAAABph2-7lYIcfflQ7SmWdMKdHHsdU", //Para ambiente de produción LFP
  // keycaptcha: "6Ld_xowUAAAAAHAoubA4SUdCP_KYx7nc5PUFXVcQ", // Clave local
  ceropapel: "/pruebas-CeroPapelEvidenteWeb/", //Para ambiente de pruebas LFP
  // ceropapel: "/CeroPapelWeb/", //Para ambiente de produción LFP
  redirect: "https://redcooperamoscoomeva.com.co/iniciar-sesion/",

  // backend: "http://" + document.location.hostname + ":8081/CeroPapel/", //Para ambiente local tener en cuenta el puerto LFP
  backend: "http://eap7-gsisin.pruebas.intracoomeva.com.co/pruebas-CeroPapelEvidente/", //Para ambiente de pruebas LFP
  // backend: "https://secure.coomeva.com.co/CeroPapel/", //Para ambiente de produción LFP
  blockSubMenu: true //poner true para productivo
};

export class environmentClass {
  production: boolean = false;
  backend: string = "";
  ceropapel: string;
  redirect: string;
  keycaptcha: string;
  blockSubMenu: boolean;
}
