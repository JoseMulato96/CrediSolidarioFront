import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlCumulosRoutingModule } from './control-cumulos-routing.module';
import { ControlCumulosComponent } from './control-cumulos.component';
import { SharedModule } from '@shared/shared.module';
import { DialogModule } from 'primeng/dialog';
import { GuardarControlCumulosComponent } from './guardar-control-cumulos/guardar-control-cumulos.component';
import { ListarControlCumuloComponent } from './listar-control-cumulos/listar-control-cumulos.component';


@NgModule({
  declarations: [
    ControlCumulosComponent,
    ListarControlCumuloComponent,
    GuardarControlCumulosComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ControlCumulosRoutingModule,
    DialogModule
  ]

})
export class ControlCumulosModule { }
