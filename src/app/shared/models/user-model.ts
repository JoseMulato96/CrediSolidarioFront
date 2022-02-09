export class UserModel {
  // username: string = "gspm0378";
  // password?: string = "Coomeva20189";
  // username: string = "larc5491";
  // password?: string = "Qwer1234";
  // username: string = "edmu0253";
  // password?: string = "Coomeva2019";
  // username: string = "jlca6912";
  // password?: string = "Julio2151";
  username: string = ""; //Descomentar LFP
  password?: string = ""; //Descomentar LFP
  name: string = "";
  email?: string = "";
  ip?: string = "";
  idPromotor: number;
  rol?: string;
  codOffice?: string;
  numDoc?:number;
}

export class OauthModel {
  grant_type: string = "password";
  username: string = "";
  password?: string = "";
}
