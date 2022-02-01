import { ActionReducerMap } from '@ngrx/store';

import * as AppReducer from './app-reducer';
import * as fromUI from '../../../pages/administracion/administrador.reducer';
import * as menuPrincipalUI from '../../../pages/header/menu-principal.reducer';
import * as PlanCoberturaUI from '../../../pages/administracion/protecciones/plan-cobertura/plan-cobertura.reducer';
import * as parametrosConfiguracionUI from '../../../pages/administracion/parametros-configuracion-operaciones/parametros-configuracion.reducer';
import * as AprobacionFinalUI from 'src/app/pages/administracion/aprobacion-final/aprobacion-final.reducer';
import { IGuardarPlanCobertura } from 'src/app/pages/administracion/protecciones/plan-cobertura/model/guardar-plan-cobertura.model';
import { ConfiguracionActuariaModel } from 'src/app/pages/administracion/actuaria/models/configuracion-actuaria.model';
import { configuracionReducer } from 'src/app/pages/administracion/actuaria/configuracion/configuracion.reducer';
import { ConfiguracionFinancieraModel } from 'src/app/pages/administracion/financiera/models/configuracion-financiera.model';
import { configuracionFinancieraReducer } from 'src/app/pages/administracion/financiera/configuracion/configuracion-financiera.reducer';
import { AprobacionFinalModel } from 'src/app/pages/administracion/aprobacion-final/model/aprobacion-final.model';
import { portafolioReducer } from '../../../pages/consultas/asociado/protecciones-asociados/portafolio-plan-cobertura/portafolio.reducer';
import { PortafolioAsociadoModel } from 'src/app/pages/consultas/asociado/protecciones-asociados/portafolio-plan-cobertura/model/portafolio-asociado.model';
import { IparametrosConfiguracionOperaciones } from 'src/app/pages/administracion/parametros-configuracion-operaciones/model/parametros-configuracion-operaciones';

import * as SimulacionesUI from '../../../pages/simulaciones/simulaciones.reducer';
import { IMimSimulaciones } from '../../../pages/simulaciones/models/mimSimulaciones';

export interface AppState {
  admin: fromUI.State;
  menuPadreActivo: menuPrincipalUI.State;
  appReducer: AppReducer.State;
  planCoberturaUI: IGuardarPlanCobertura;
  acturiaConfiguracion: ConfiguracionActuariaModel;
  financieraConfiguracion: ConfiguracionFinancieraModel;
  aprobacionFinal: AprobacionFinalModel;
  portafolioAsociado: PortafolioAsociadoModel;
  parametrosConfiguracionUI: IparametrosConfiguracionOperaciones;
  simulacionesUI: IMimSimulaciones;
}

export const reducers: ActionReducerMap<AppState> = {
  admin: fromUI.adminReducer,
  menuPadreActivo: menuPrincipalUI.menuPrincipalReducer,
  appReducer: AppReducer.AppReducer,
  planCoberturaUI: PlanCoberturaUI.planCoberturaReducer,
  parametrosConfiguracionUI: parametrosConfiguracionUI.parametrosConfiguracionReducer,
  acturiaConfiguracion: configuracionReducer,
  financieraConfiguracion: configuracionFinancieraReducer,
  aprobacionFinal: AprobacionFinalUI.aprobacionFinalReducer,
  portafolioAsociado: portafolioReducer,
  simulacionesUI: SimulacionesUI.SimulacionesReducer,
};
