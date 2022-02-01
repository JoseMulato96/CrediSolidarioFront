import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

import { GestionCampanasComponent } from './gestion-campanas.component';
import { GestionCampanasRoutingModule } from './gestion-campanas-routing.module';

@NgModule({
  declarations: [
    GestionCampanasComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    GestionCampanasRoutingModule
  ]
})
export class GestionCampanasModule { }
