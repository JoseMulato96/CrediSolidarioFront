import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsociadoRoutingModule } from './asociado-routing.module';
import { AsociadoComponent } from './asociado.component';
import { SharedModule } from '@shared/shared.module';
import { BeneficiariosAsociadosComponent } from './beneficiarios-asociados/beneficiarios-asociados.component';
import { NuevoBeneficiarioComponent } from './beneficiarios-asociados/nuevo-beneficiario/nuevo-beneficiario.component';
import { DatosAsociadosComponent } from './datos-asociados/datos-asociados.component';
import { DatosAsociadoDetalleComponent } from './datos-asociados/datos-asociado-detalle/datos-asociado-detalle.component';
import { ProductoDetalleService } from './services/producto-detalle.service';
import { DistribucionPorcentajeComponent } from './beneficiarios-asociados/nuevo-beneficiario/distribucion-porcentaje/distribucion-porcentaje.component';
import { BeneficiariosExistentesComponent } from './beneficiarios-asociados/nuevo-beneficiario/beneficiarios-existentes/beneficiarios-existentes.component';
import { EventoAsociadosService } from './services/evento-asociados.service';
import { CapitalPagadoFacturacionAsociadoService } from './facturacion-asociados/capital-pagado-facturacion-asociados/services/capital-pagodo-facturacion-asociado.service';
import { CalculoProyeccionesService } from './protecciones-asociados/portafolio-plan-cobertura/services/calculo-proyecciones.service';
import { ResponsablePagoComponent } from './responsable-pago/responsable-pago.component';

@NgModule({
  declarations: [
    AsociadoComponent,
    DatosAsociadosComponent,
    DatosAsociadoDetalleComponent,
    BeneficiariosAsociadosComponent,
    NuevoBeneficiarioComponent,
    DistribucionPorcentajeComponent,
    BeneficiariosExistentesComponent,
    ResponsablePagoComponent
  ],
  imports: [CommonModule, AsociadoRoutingModule, SharedModule],
  providers: [
    ProductoDetalleService,
    EventoAsociadosService,
    CapitalPagadoFacturacionAsociadoService,
    CalculoProyeccionesService
  ]
})
export class AsociadoModule { }
