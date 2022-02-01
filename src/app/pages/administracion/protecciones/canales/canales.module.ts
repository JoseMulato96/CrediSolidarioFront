import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { CanalesComponent } from './canales.component';
import { GuardarCanalesComponent } from './guardar-canales/guardar-canales.component';
import { ListarCanalesComponent } from './listar-canales/listar-canales.component';
import { CanalesRoutingModule } from './canales-routing.module';


@NgModule({
    declarations: [CanalesComponent, ListarCanalesComponent, GuardarCanalesComponent],
    imports: [
      CommonModule,
      SharedModule,
      ReactiveFormsModule,
      CanalesRoutingModule
    ]
  })
  export class CanalesModule { }
