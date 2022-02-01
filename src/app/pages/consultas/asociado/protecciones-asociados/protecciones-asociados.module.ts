import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProteccionesAsociadosRoutingModule } from './protecciones-asociados-routing.module';
import { ProteccionesAsociadosComponent } from './protecciones-asociados.component';
import { RegistrarPortafolioAsociadosComponent } from './registrar-portafolio-asociados/registrar-portafolio-asociados.component';
import { SharedModule } from '@shared/shared.module';
import { PortafolioAsociadosService } from './portafolio-asociados/services/portafolio-asociados.service';
import { TranslateModule } from '@ngx-translate/core';
import { ValidarDatosRegistroAsociadoComponent } from './registro-proteccion/validar-datos-registro-asociado/validar-datos-registro-asociado.component';
import { RegistrarProteccionAsociadoComponent } from './registro-proteccion/registrar-proteccion-asociado/registrar-proteccion-asociado.component';
import { PortafolioAsociadosComponent } from './portafolio-asociados/portafolio-asociados.component';
import {TabViewModule} from 'primeng/tabview';
import { ReactiveFormsModule } from '@angular/forms';
import { MimEstadoCotizacionService } from './portafolio-plan-cobertura/services/mim-estado-cotizacion.service';

@NgModule({
  declarations: [
    ProteccionesAsociadosComponent,
    PortafolioAsociadosComponent,
    RegistrarPortafolioAsociadosComponent,
    RegistrarProteccionAsociadoComponent,
    ValidarDatosRegistroAsociadoComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule,
    ProteccionesAsociadosRoutingModule,
    ReactiveFormsModule,
    TabViewModule
  ],
  providers: [PortafolioAsociadosService, MimEstadoCotizacionService]
})
export class ProteccionesAsociadosModule {}
