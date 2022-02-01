import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PromocionesRoutingModule } from './promociones-routing.module';
import { PromocionesComponent } from './promociones.component';
import { ListarPromocionesComponent } from './listar-promociones/listar-promociones.component';
import { GuardarPromocionesComponent } from './guardar-promociones/guardar-promociones.component';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';

@NgModule({
  declarations: [PromocionesComponent, ListarPromocionesComponent, GuardarPromocionesComponent],
  imports: [
    CommonModule,
    TableModule,
    FileUploadModule,
    SharedModule,
    ReactiveFormsModule,
    PromocionesRoutingModule
  ]
})
export class PromocionesModule { }
