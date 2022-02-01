import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AsignacionGestionDiariaComponent } from './asignacion-gestion-diaria.component';
import { AsignacionGestionDiariaRoutingModule } from './asignacion-gestion-diaria-routing.module';
import { ListarAsignacionGestionDiariaComponent } from './listar-asignacion-gestion-diaria/listar-asignacion-gestion-diaria.component';
import { MimRolesFlujoService } from './services/mim-roles-flujo.service';

@NgModule({
  declarations: [
    AsignacionGestionDiariaComponent,
    ListarAsignacionGestionDiariaComponent
  ],
  exports: [
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    AsignacionGestionDiariaRoutingModule
  ],
  providers: [
    MimRolesFlujoService
  ]
})
export class AsignacionGestionDiariaModule { }
