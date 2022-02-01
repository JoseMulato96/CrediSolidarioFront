import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

import { OtrosParametrosComponent } from './otros-parametros.component';
import { ListarOtrosParametrosComponent } from './listar-otros-parametros/listar-otros-parametros.component';
import { GuardarOtrosParametrosComponent } from './guardar-otros-parametros/guardar-otros-parametros.component';
import { OtrosParametrosRoutingModule } from './otros-parametros-routing.module';

@NgModule({
  declarations: [
    OtrosParametrosComponent,
    ListarOtrosParametrosComponent,
    GuardarOtrosParametrosComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    OtrosParametrosRoutingModule
  ]
})
export class OtrosParametrosModule { }
