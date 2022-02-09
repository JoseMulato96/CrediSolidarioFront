export interface IResponseLoginService {
  id: number;
  applications: ILoginRolService[];
  authorized: string;
  mail: string;
  name: string;
  token: string;
  userId: string;
}

export interface IResponseCooperadorService {
  code: number;
  typeId: number;
  typeIdDesc: string;
  participantId: string;
  firstnName: string;
  secondName: string;
  firstSurname: string;
  secondSurname: string;
  codOffice: string;
  email: string;
  creationDate: string;
}

export interface ILoginRolService {
  name: string;
  roles: ILoginRolService;
  sections: ILoginActionService[];
}

export interface ILoginActionService {
  actions: string[];
  name: string;
}
