import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuardarCampanasCoberturaComponent } from './guardar-campanas-cobertura/guardar-campanas-cobertura.component';
import { ListarCampanasCoberturaComponent } from './listar-campanas-cobertura/listar-campanas-cobertura.component';
import { CampanasCoberturaRoutingModule } from './campanas-cobertura-routing.module';
import { CampanasCoberturaComponent } from './campanas-cobertura.component';
import { SharedModule } from '@shared/shared.module';
import { DialogModule } from 'primeng/dialog';


@NgModule({
  declarations: [
    CampanasCoberturaComponent,
    GuardarCampanasCoberturaComponent,
    ListarCampanasCoberturaComponent
  ],
  imports: [
    CommonModule,
    CampanasCoberturaRoutingModule,
    SharedModule,
    DialogModule
  ]
})
export class CampanasCoberturaModule { }
