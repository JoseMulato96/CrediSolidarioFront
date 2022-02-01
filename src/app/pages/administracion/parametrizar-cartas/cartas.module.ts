import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartasRoutingModule } from './cartas-routing.module';
import { CartasComponent } from './cartas.component';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ListarCartasComponent } from './listar-cartas/listar-cartas.component';
import { GuardarCartaComponent } from './guardar-carta/guardar-carta.component';
import { NgxTinymceModule } from 'ngx-tinymce';


@NgModule({
  declarations: [
    CartasComponent,
    ListarCartasComponent,
    GuardarCartaComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    CartasRoutingModule,
    NgxTinymceModule
  ]
})
export class CartasModule { }
