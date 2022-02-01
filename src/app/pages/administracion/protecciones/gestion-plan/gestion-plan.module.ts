import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionPlanRoutingModule } from './gestion-plan-routing.module';
import { GestionPlanComponent } from './gestion-plan.component';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [GestionPlanComponent],
  imports: [
    CommonModule,
    TableModule,
    SharedModule,
    ReactiveFormsModule,
    GestionPlanRoutingModule
  ]
})
export class GestionPlanModule { }
