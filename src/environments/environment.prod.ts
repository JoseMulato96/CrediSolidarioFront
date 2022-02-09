export const environment = {
  production: true,
  keycaptcha: "6Ld_xowUAAAAAHAoubA4SUdCP_KYx7nc5PUFXVcQ",
  ceropapel: "/CeroPapelWeb/",
  // backend: "http://" + document.location.hostname + ":8081/CeroPapel/",
  backend: "https://secure.coomeva.com.co/pruebas-CeroPapel/",
  blockSubMenu: false
};

export class environmentClass {
  production: boolean = false;
  backend: string = "";
  ceropapel: string;
  keycaptcha: string;
  blockSubMenu: boolean;
}
