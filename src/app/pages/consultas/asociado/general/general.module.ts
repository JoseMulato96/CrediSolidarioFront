import { NgModule } from '@angular/core';
import { ActFechaNacimientoComponent } from './act-fecha-nacimiento/act-fecha-nacimiento.component';
import { CommonModule } from '@angular/common';
import { GeneralRoutingModule } from './general-routing.module';
import { SharedModule } from '@shared/shared.module';
import { GeneralComponent } from './general.component';
import { TotalesActComponent } from './act-fecha-nacimiento/totales-act/totales-act.component';
import { ActIndFechaNacimientoComponent } from './act-ind-fecha-nacimiento/act-ind-fecha-nacimiento.component';
import { ActAuxFunerarioComponent } from './act-ind-auxilio-funerario/act-auxilio-funerario.component';

@NgModule({
    declarations: [
        GeneralComponent,
        ActFechaNacimientoComponent,
        TotalesActComponent,
        ActIndFechaNacimientoComponent,
        ActAuxFunerarioComponent
    ],
    imports: [
        CommonModule,
        GeneralRoutingModule,
        SharedModule
    ]
  })
export class GeneralModule { }
