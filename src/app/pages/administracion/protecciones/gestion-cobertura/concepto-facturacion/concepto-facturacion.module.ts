import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ConceptoFacturacionComponent } from './concepto-facturacion.component';
import { ConceptoFacturacionRoutingModule } from './concepto-facturacion-routing.module';
import { GuardarConceptosFacturacionComponent } from './guardar-conceptos-facturacion/guardar-conceptos-facturacion.component';
import { ListarConceptosFacturacionComponent } from './listar-conceptos-facturacion/listar-conceptos-facturacion.component';

@NgModule({
    declarations: [
      ConceptoFacturacionComponent,
      GuardarConceptosFacturacionComponent,
      ListarConceptosFacturacionComponent,
    ],
    imports: [
      CommonModule,
      SharedModule,
      ReactiveFormsModule,
      ConceptoFacturacionRoutingModule
    ],
    providers: []
  })
  export class ConceptoFacturacionModule { }
