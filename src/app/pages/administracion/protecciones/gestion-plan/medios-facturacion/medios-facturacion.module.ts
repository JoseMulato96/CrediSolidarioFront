import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MediosFacturacionComponent } from './medios-facturacion.component';
import { ListarMediosFacturacionComponent } from './listar-medios-facturacion/listar-medios-facturacion.component';
import { GuardarMediosFacturacionComponent } from './guardar-medios-facturacion/guardar-medios-facturacion.component';
import { MediosFacturacionRoutingModule } from './medios-facturacion-routing.module';
import { PlanMediosFacturacionService } from './services/plan-medios-facturacion.service';
import { MediosFacturacionService } from '../../../../../core/services/api-back.services/mimutualprotecciones/medios-facturacion.service';

@NgModule({
  declarations: [
    MediosFacturacionComponent,
    ListarMediosFacturacionComponent,
    GuardarMediosFacturacionComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    MediosFacturacionRoutingModule
  ],
  providers: [
    PlanMediosFacturacionService,
    MediosFacturacionService,
  ]
})
export class MediosFacturacionModule { }
