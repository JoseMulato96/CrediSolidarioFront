import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogNovedadesComponent } from './configuracion-seguridad/log-novedades/log-novedades.component';
import { AuditoriaEntidadComponent } from './configuracion-seguridad/auditoria-entidad/auditoria-entidad.component';
import { ConfiguracionSeguridadComponent } from './configuracion-seguridad/configuracion-seguridad.component';
import { AdministracionRoutingModule } from './administracion-routing.module';
import { AsignacionPermisosComponent } from './asignacion-permisos-especiales/asignacion-permisos-especiales.component';
import { AsociadosVIPComponent } from './asociados-vip/asociados-vip.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { AsociadosVipService } from './asociados-vip/services/asociados-vip.service';
import { AdministracionComponent } from './administracion.component';
import { AdministracionService } from './services/administracion.service';
import { CargueMasivoComponent } from './cargue-masivo/cargue-masivo.component';
import { ReasignacionOrdenesComponent } from './reasignacion-ordenes/reasignacion-ordenes.component';
import { PickListModule } from 'primeng/picklist';
import { MimProcesoMasivoService } from './cargue-masivo/services/mim-proceso-masivo.service';
import { MimTipoProcesoMasivoService } from './cargue-masivo/services/mim-tipo-proceso-masivo.service';
import { ConfiguracionAsignacionGestionDiariaComponent } from './configuracion-asignacion-gestion-diaria/configuracion-asignacion-gestion-diaria.component';
import { CarguesMasivosCallCenterComponent } from './cargues-masivos-call-center/cargues-masivos-call-center.component';
import { MimPreventaService } from './services/mim-preventa.service';
import { ConfiguracionAsignacionGestionDiariaAutomaticaComponent } from './configuracion-asignacion-gestion-diaria-automatica/configuracion-asignacion-gestion-diaria-automatica.component';

@NgModule({
  declarations: [
    LogNovedadesComponent,
    ConfiguracionSeguridadComponent,
    AuditoriaEntidadComponent,
    AsociadosVIPComponent,
    AsignacionPermisosComponent,
    AdministracionComponent,
    CargueMasivoComponent,
    ReasignacionOrdenesComponent,
    ConfiguracionAsignacionGestionDiariaComponent,
    ConfiguracionAsignacionGestionDiariaAutomaticaComponent,
    CarguesMasivosCallCenterComponent
  ],
  exports: [
    LogNovedadesComponent,
    ConfiguracionSeguridadComponent,
    AuditoriaEntidadComponent,
    AsignacionPermisosComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    AdministracionRoutingModule,
    PickListModule
  ],
  providers: [
    AsociadosVipService,
    AdministracionService,
    MimProcesoMasivoService,
    MimTipoProcesoMasivoService,
    MimPreventaService
  ]
})
export class AdministracionModule { }
