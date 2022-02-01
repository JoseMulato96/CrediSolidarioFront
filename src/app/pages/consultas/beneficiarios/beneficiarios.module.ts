import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { BeneficiariosAsociadosRelacionadosComponent } from './beneficiario-informacion/asociados-relacionados/beneficiarios-asociados-relacionados.component';
import { BeneficiarioInformacionComponent } from './beneficiario-informacion/beneficiario-informacion.component';
import { BeneficiariosFallecidosComponent } from './beneficiarios-fallecidos/beneficiarios-fallecidos.component';
import { BeneficiariosRepetidosComponent } from './beneficiarios-repetidos/beneficiarios-repetidos.component';
import { BeneficiariosComponent } from './beneficiarios.component';
import { BeneficiariosRoutingModule } from './beneficiarios.routing';
import { BeneficiariosNovedadesHistoricoComponent } from './beneficiario-informacion/novedades-historico/beneficiarios-novedades-historico.component';
import { BeneficiarioListarFechaNacimientoComponent } from './beneficiario-fecha-nacimiento/beneficiario-lista-fecha-nacimiento.component';
import { BeneficiarioActualizarFechaNacimientoComponent } from './beneficiario-fecha-nacimiento/beneficiario-actualizar-fecha-nacimiento/beneficiario-actualizar-fecha-nacimiento.component';

@NgModule({
  imports: [CommonModule, BeneficiariosRoutingModule, SharedModule],
  declarations: [
    BeneficiariosComponent,
    BeneficiariosRepetidosComponent,
    BeneficiariosFallecidosComponent,
    BeneficiarioInformacionComponent,
    BeneficiariosAsociadosRelacionadosComponent,
    BeneficiariosNovedadesHistoricoComponent,
    BeneficiarioListarFechaNacimientoComponent,
    BeneficiarioActualizarFechaNacimientoComponent

  ]
})
export class BeneficiariosModule { }
