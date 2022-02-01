import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { ExclusionesRoutingModule } from './exclusiones-routing.module';
import { ExclusionesComponent } from './exclusiones.component';
import { GuardarExclusionesComponent } from './guardar-exclusiones/guardar-exclusiones.component';
import { ListarExclusionesComponent } from './listar-exclusiones/listar-exclusiones.component';


@NgModule({
  declarations: [
    ExclusionesComponent,
    ListarExclusionesComponent,
    GuardarExclusionesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ExclusionesRoutingModule
  ],
  providers: [
  ]
})
export class ExclusionesModule { }
