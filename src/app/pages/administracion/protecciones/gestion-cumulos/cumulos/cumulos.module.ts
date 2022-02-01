import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CumulosRoutingModule } from './cumulos-routing.module';
import { CumulosComponent } from './cumulos.component';
import { GuardarCumulosComponent } from './guardar-cumulos/guardar-cumulos.component';
import { ListarCumulosComponent } from './listar-cumulos/listar-cumulos.component';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CumulosComponent, GuardarCumulosComponent, ListarCumulosComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    CumulosRoutingModule
  ]
})
export class CumulosModule { }
