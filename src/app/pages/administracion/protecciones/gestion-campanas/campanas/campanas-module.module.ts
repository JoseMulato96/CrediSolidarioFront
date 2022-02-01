import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampanasComponent } from './campanas.component';
import { ListarCampanasComponent } from './listar-campanas/listar-campanas.component';
import { GuardarCampanasComponent } from './guardar-campanas/guardar-campanas.component';
import { CampanasRoutingModule } from './campanas-routing.module';
import { SharedModule } from '@shared/shared.module';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [
    CampanasComponent,
    ListarCampanasComponent,
    GuardarCampanasComponent

  ],
  imports: [
    CommonModule,
    CampanasRoutingModule,
    SharedModule,
    DialogModule
  ]
})
export class CampanasModule { }
