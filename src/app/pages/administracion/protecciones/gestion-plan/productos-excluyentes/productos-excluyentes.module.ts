import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductosExcluyentesRoutingModule } from './productos-excluyentes-routing.module';
import { ListarProductosExcluyentesComponent } from './listar-productos-excluyentes/listar-productos-excluyentes.component';
import { GuardarProductosExcluyentesComponent } from './guardar-productos-excluyentes/guardar-productos-excluyentes.component';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductosExcluyentesService } from './services/productos-excluyentes.service';
import { ProductosExcluyentesComponent } from './productos-excluyentes.component';


@NgModule({
  declarations: [ListarProductosExcluyentesComponent, GuardarProductosExcluyentesComponent, ProductosExcluyentesComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ProductosExcluyentesRoutingModule
  ],
  providers: [
    ProductosExcluyentesService
  ]
})
export class ProductosExcluyentesModule { }
