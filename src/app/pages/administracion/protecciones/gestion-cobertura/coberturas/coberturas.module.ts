import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CoberturasComponent } from './coberturas.component';
import { ListarCoberturasComponent } from './listar-coberturas/listar-coberturas.component';
import { CoberturasRoutingModule } from './coberturas.-routing.module';
import { GuardarCoberturasComponent } from './guardar-coberturas/guardar-coberturas.component';

@NgModule({
  declarations: [
    CoberturasComponent,
    ListarCoberturasComponent,
    GuardarCoberturasComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    CoberturasRoutingModule
  ],
  providers: [
  ]
})
export class CoberturasModule { }
