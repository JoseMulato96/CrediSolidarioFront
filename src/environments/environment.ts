// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `envirnment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const url = 'http://172.16.11.129:8588/';
export const environment = {
  production: false,
  sisproUrl: url + 'sispro-oauth2',
  miMutualUtilidadesUrl: url + 'mimutualutilidades',
  miMutualAsociadosUrl: url + 'mimutualasociados',
  miMutualIntegracionesUrl: url + 'mimutualintegraciones',
  miMutualBpmUrl: url + 'mimutualbpm',
  miMutualReclamacionesUrl: url + 'mimutualreclamaciones',
  miMutualAuditoriaUrl: url + 'mimutualauditoria',
  miMutualProteccionesUrl: url + 'mimutualprotecciones',
  miMutualFlowableUrl: url + 'mimutualflowable',
  miMutualReglasUrl: url + 'mimutualreglas',

  pathFiles: '/home/usersecpro/mimutualQA/files/',
  appName: 'MIMUTUAL',
  clientId: 'api-client',
  clientSecret: 'ap1s3cr3tk3y',
  userSystem: 'SIS_MM'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/dist/zone-error'; // Included with Angular CLI.
