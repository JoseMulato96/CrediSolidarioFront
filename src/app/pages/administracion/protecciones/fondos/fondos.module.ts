import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FondosRoutingModule } from './fondos-routing.module';
import { FondosComponent } from './fondos.component';
import { ListarFondosComponent } from './listar-fondos/listar-fondos.component';
import { GuardarFondosComponent } from './guardar-fondos/guardar-fondos.component';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [FondosComponent, ListarFondosComponent, GuardarFondosComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FondosRoutingModule
  ]
})
export class FondosModule { }
