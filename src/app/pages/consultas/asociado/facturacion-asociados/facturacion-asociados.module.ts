import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { AjusteFacturacionComponent } from './ajuste-facturacion/ajuste-facturacion.component';
import { AjustefacturacionDetalleComponent } from './ajuste-facturacion-detalle/ajuste-facturacion-detalle.component';
import { CapitalPagadoFacturacionAsociadosComponent } from './capital-pagado-facturacion-asociados/capital-pagado-facturacion-asociados.component';
import { FacturacionAsociadosRoutingModule } from './facturacion-asociados-routing.module';
import { FacturacionAsociadosComponent } from './facturacion-asociados.component';
import { RecaudosFacturacionAsociadosComponent } from './recaudos-facturacion-asociados/recaudos-facturacion-asociados.component';
import { RecaudosFacturacionAsociadosDetalleComponent } from './recaudos-facturacion-asociados/recaudos-detalle/recaudos-facturacion-asociados-detalle.component';
import { RecaudosFacturacionAsociadosService } from './recaudos-facturacion-asociados/services/recaudos-facturacion-asociados.service';
import { MultiactivaFacturacionComponent } from './multiactiva-facturacion/multiactiva-facturacion.component';
import { SolidadaridadFacturacionComponent } from './solidaridad-facturacion/solidaridad-facturacion.component';
import { SolidaridadFacturacionDetalleComponent } from './solidaridad-facturacion/solidaridad-facturacion-detalle/solidaridad-facturacion-detalle.component';
import { CuentasContablesFacturacionComponent } from './cuentas-contables-facturacion/cuentas-contables-facturacion.component';
import { CuentasContablesFacturacionDetalleComponent } from './cuentas-contables-facturacion/cuentas-contables-facturacion-detalle/cuentas-contables-facturacion-detalle';
import { SolidaridadFacturacionService } from '../../../../core/services/api-back.services/mimutualasociados/solidaridad-facturacion.service';
import { CapitalPagadoFacturacionAsociadoService } from './capital-pagado-facturacion-asociados/services/capital-pagodo-facturacion-asociado.service';

@NgModule({
  declarations: [
    FacturacionAsociadosComponent,
    AjusteFacturacionComponent,
    AjustefacturacionDetalleComponent,
    CapitalPagadoFacturacionAsociadosComponent,
    MultiactivaFacturacionComponent,
    RecaudosFacturacionAsociadosComponent,
    RecaudosFacturacionAsociadosDetalleComponent,
    SolidadaridadFacturacionComponent,
    SolidaridadFacturacionDetalleComponent,
    CuentasContablesFacturacionComponent,
    CuentasContablesFacturacionDetalleComponent
  ],
  imports: [CommonModule, SharedModule, FacturacionAsociadosRoutingModule],
  providers: [
    SolidaridadFacturacionService,
    CapitalPagadoFacturacionAsociadoService,
    RecaudosFacturacionAsociadosService,
  ]
})
export class FacturacionAsociadosModule { }
