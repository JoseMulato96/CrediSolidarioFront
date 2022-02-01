export class ReportParams {
  nombre: string;
  parameters: any;
  datasource: any[];
  configuration: ReportConfiguration;
}

export class ReportConfiguration {
  isEncrypted: boolean;
  is128BitKey: boolean;
  userPassword: string;
}
