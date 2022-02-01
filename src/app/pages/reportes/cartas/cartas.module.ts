import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CartasRoutingModule } from './cartas-routing.module';
import { CartasComponent } from './cartas.component';
import { ListarCartasComponent } from './listar-cartas/listar-cartas.component';

@NgModule({
  declarations: [
    CartasComponent,
    ListarCartasComponent
  ],
  exports: [
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    CartasRoutingModule
  ],
  providers: [
  ]
})
export class CartasModule { }
