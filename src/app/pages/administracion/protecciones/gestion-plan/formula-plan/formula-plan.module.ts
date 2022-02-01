import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormulaPlanRoutingModule } from './formula-plan-routing.module';
import { FormulaPlanComponent } from './formula-plan.component';
import { GuardarFormulaPlanComponent } from './guardar-formula-plan/guardar-formula-plan.component';
import { ListarFormulaPlanComponent } from './listar-formula-plan/listar-formula-plan.component';

@NgModule({
    declarations: [
      FormulaPlanComponent,
      GuardarFormulaPlanComponent,
      ListarFormulaPlanComponent
    ],
    imports: [
      CommonModule,
      SharedModule,
      ReactiveFormsModule,
      FormulaPlanRoutingModule,
    ],
    providers: [
    ]
  })

  export class FormulaPlanModule {}
