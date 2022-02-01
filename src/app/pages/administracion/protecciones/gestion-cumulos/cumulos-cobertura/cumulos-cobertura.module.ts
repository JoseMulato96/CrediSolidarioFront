import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CumulosCoberturaRoutingModule } from './cumulos-cobertura-routing.module';
import { CumulosCoberturaComponent } from './cumulos-cobertura.component';
import { GuardarCumulosCoberturaComponent } from './guardar-cumulos-cobertura/guardar-cumulos-cobertura.component';
import { ListarCumulosCoberturaComponent } from './listar-cumulos-cobertura/listar-cumulos-cobertura.component';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CumulosCoberturaComponent,
    ListarCumulosCoberturaComponent,
    GuardarCumulosCoberturaComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    CumulosCoberturaRoutingModule
  ]
})
export class CumulosCoberturaModule { }
