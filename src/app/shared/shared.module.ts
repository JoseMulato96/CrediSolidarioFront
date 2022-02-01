import { CommonModule, CurrencyPipe, PercentPipe } from '@angular/common';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskModule } from 'ngx-mask';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import { AsociadoDetalleComponent } from './components/mim-asociado-detalle/mim-asociado-detalle.component';
import {
  AsociadoProductoDetalleComponent,
} from './components/asociado-producto-detalle/asociado-producto-detalle.component';
import { BeneficiarioDetalleComponent } from './components/beneficiario-detalle/beneficiario-detalle.component';
import { MimDetalleUsuarioCabeceraComponent } from './components/mim-detalle-usuario-cabecera/mim-detalle-usuario-cabecera.component';
import { MimGridComponent } from './components/mim-grid/mim-grid.component';
import { MimAutocompleteComponent } from './components/mim-autocomplete/mim-autocomplete.component';
import { MimButtonComponent } from './components/mim-button/mim-button.component';
import { MimCategoriaDetalleComponent } from './components/mim-categoria-detalle/mim-categoria-detalle.component';
import { MimCategoriaComponent } from './components/mim-categoria/mim-categoria.component';
import { MimDatePickerComponent } from './components/mim-date-picker/mim-date-picker.component';
import { MimInputErrorComponent } from './components/mim-input-error/mim-input-error.component';
import { MimSelectComponent } from './components/mim-select/mim-select.component';
import { MimWindModalComponent } from './components/mim-wind-modal/mim-wind-modal.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PanelRightComponent } from './components/panel-right/panel-right.component';
import { PopupMenuComponent } from './components/popup-menu/popup-menu.component';
import { MimFiltroVerticalComponent } from './components/mim-filtro-vertical/mim-filtro-vertical.component';
import { MimFiltroVerticalItemComponent } from './components/mim-filtro-vertical/mim-filtro-vertical-item/mim-filtro-vertical-item.component';
import { MimInputDirective } from './directives/mim-input.directive';
import { MimLabelDirective } from './directives/mim-label.directive';
import { BirthdayPipe } from './pipes/birthday.pipe';
import { CustomCurrencyPipe } from './pipes/custom-currency.pipe';
import { EmptyPipe } from './pipes/empty.pipe';
import { MimPersonaDetalleComponent } from './components/mim-persona-detalle/mim-persona-detalle.component';
import { AccordionPanelComponent } from './components/accordion-panel/accordion-panel.component';
import { MimAccordionSectionComponent } from './components/mim-accordion-section/mim-accordion-section.component';
import { MimFecNacIconComponent } from './components/mim-fec-nac-icon/mim-fec-nac-icon.component';
import { MimAdDirective } from './directives/mim-ad-directive';
import { MimDeduccionesCardComponent } from './components/mim-deducciones-card/mim-deducciones-card.component';
import { MimSearchAsociadoComponent } from './components/mim-search-asociado/mim-search-asociado.component';
import { MimMultiselectComponent } from './components/mim-multiselect/mim-multiselect.component';
import { MimMenuVerticalComponent } from './components/mim-menu-vertical/mim-menu-vertical.component';
import { ApruebaEliminaComponent } from './components/apueba-elimina/aprueba-elimina.component';
import { LateralReclamacionesComponent } from './components/lateral-reclamaciones/lateral-reclamaciones.component';
import { MimGeneraCartaComponent } from './components/mim-genera-carta/mim-genera-carta.component';
import { RouterModule } from '@angular/router';
import { MimBitacoraComponent } from './components/mim-bitacora/mim-bitacora.component';
import { MimGeneraCartaModalComponent } from './components/mim-genera-carta-modal/mim-genera-carta-modal.component';
import { CustomNumberPipe } from './pipes/custom-numer.pipe';
import { MimObservacionEventoComponent } from './components/mim-observacion-evento/mim-observacion-evento.component';
import { MimValoresEventoComponent } from './components/mim-valores-evento/mim-valores-evento.component';
import { MimCoberturaEventoComponent } from './components/mim-cobertura-evento/mim-cobertura-evento.component';
import { MimDetalleEventoComponent } from './components/mim-detalle-evento/mim-detalle-evento.component';
import { MimFormaPagoComponent } from './components/mim-forma-pago/mim-forma-pago.component';
import { MimInputDecimalDirective } from './directives/mim-input-decimal.directive';
import { NoAplicaPipe } from './pipes/no-aplica.pipe';
import { ValidarDatosComponent } from './components/form/validar-datos/validar-datos.component';
import { CotizarProteccionComponent } from './components/form/cotizar-proteccion/cotizar-proteccion.component';
import { TipoCalculoComponent } from './components/form/tipo-calculo/tipo-calculo.component';
import { SliderModule } from 'primeng/slider';
import { AdminCoberturasComponent } from './components/form/admin-coberturas/admin-coberturas.component';
import { DeclaracionSaludComponent } from './components/form/declaracion-salud/declaracion-salud.component';
import { MimLinksComponent } from './components/mim-links/mim-links.component';
import { MimGridItemsComponent } from './components/mim-grid-items/mim-grid-items.component';
import { MimDevolucionPorErrorComponent } from './components/mim-devolucion-por-error/mim-devolucion-por-error.component';
import { MimInputDecimalesDirective } from './directives/mim-input-decimales.directive';
import { GeneralComponent } from './components/form-parametros-configuracion-operaciones/general/general.component';
import { EspecificaComponent } from './components/form-parametros-configuracion-operaciones/especifica/especifica.component';
import { CantidadCasosGeolocalizacionComponent } from './components/form-parametros-configuracion-operaciones/cantidad-casos-geolocalizacion/cantidad-casos-geolocalizacion.component';
import { ConfiguracionGestionDiariaComponent } from './components/configuracion-asignacion-gestion-diaria/gestion-diaria/gestion-diaria.component';
import { AsociadoDetalleConfigComponent } from './components/mim-asociado-detalle-config/mim-asociado-detalle-config.component';
import { MimGestionPendientePorComponent } from './components/mim-gestion-pendiente-por/mim-gestion-pendiente-por.component';
import { TipoCartasComponent } from './components/generar-cartas/tipo-cartas/tipo-cartas.component';
import { GenerarCartaModalV2Component } from './components/generar-cartas/generar-carta-modal-v2/generar-carta-modal-v2.component';
import { ConfiguracionGestionDiariaAutomaticaComponent } from './components/configuracion-asignacion-gestion-diaria/gestion-diaria-automatica/gestion-diaria-automatica.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { AgregarPlanComponent } from './components/form/agregar-plan/agregar-plan.component';
import { InfoPlanComponent } from './components/form/info-plan/info-plan.component';


@NgModule({
  declarations: [
    MimAdDirective,
    MimLabelDirective,
    MimInputDirective,
    MimInputDecimalDirective,
    MimInputDecimalesDirective,
    PanelRightComponent,
    NotFoundComponent,
    BeneficiarioDetalleComponent,
    AsociadoProductoDetalleComponent,
    AsociadoDetalleComponent,
    CustomCurrencyPipe,
    CustomNumberPipe,
    BirthdayPipe,
    EmptyPipe,
    NoAplicaPipe,
    MimPersonaDetalleComponent,
    AccordionPanelComponent,
    PopupMenuComponent,
    MimGridComponent,
    MimInputErrorComponent,
    MimDatePickerComponent,
    MimDetalleUsuarioCabeceraComponent,
    MimCategoriaComponent,
    MimCategoriaDetalleComponent,
    MimSelectComponent,
    MimAutocompleteComponent,
    MimWindModalComponent,
    MimButtonComponent,
    MimFiltroVerticalComponent,
    MimFiltroVerticalItemComponent,
    MimAccordionSectionComponent,
    MimFecNacIconComponent,
    MimDeduccionesCardComponent,
    MimSearchAsociadoComponent,
    MimMultiselectComponent,
    MimMenuVerticalComponent,
    ApruebaEliminaComponent,
    LateralReclamacionesComponent,
    MimGeneraCartaComponent,
    MimBitacoraComponent,
    MimGeneraCartaModalComponent,
    MimObservacionEventoComponent,
    MimValoresEventoComponent,
    MimCoberturaEventoComponent,
    MimDetalleEventoComponent,
    MimFormaPagoComponent,
    ValidarDatosComponent,
    CotizarProteccionComponent,
    TipoCalculoComponent,
    AdminCoberturasComponent,
    DeclaracionSaludComponent,
    MimLinksComponent,
    MimGridItemsComponent,
    GeneralComponent,
    EspecificaComponent,
    CantidadCasosGeolocalizacionComponent,
    MimDevolucionPorErrorComponent,
    ConfiguracionGestionDiariaComponent,
    ConfiguracionGestionDiariaAutomaticaComponent,
    AsociadoDetalleConfigComponent,
    MimGestionPendientePorComponent,
    TipoCartasComponent,
    GenerarCartaModalV2Component,
    AgregarPlanComponent,
    InfoPlanComponent
  ],
  entryComponents: [
    MimFecNacIconComponent
  ],
  imports: [
    TooltipModule,
    TableModule,
    MultiSelectModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule,
    TranslateModule,
    CalendarModule,
    DropdownModule,
    AutoCompleteModule,
    RouterModule,
    SliderModule,
    NgxCurrencyModule
  ],
  /*NO PROVIDERS HERE!*/
  exports: [
    MimAdDirective,
    MimLabelDirective,
    MimInputDirective,
    MimInputDecimalDirective,
    MimInputDecimalesDirective,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule,
    TranslateModule,
    PanelRightComponent,
    NotFoundComponent,
    BeneficiarioDetalleComponent,
    AsociadoProductoDetalleComponent,
    AsociadoDetalleComponent,
    CustomCurrencyPipe,
    CustomNumberPipe,
    EmptyPipe,
    NoAplicaPipe,
    DropdownModule,
    MultiSelectModule,
    CalendarModule,
    AutoCompleteModule,
    PopupMenuComponent,
    MimPersonaDetalleComponent,
    AccordionPanelComponent,
    MimGridComponent,
    MimInputErrorComponent,
    MimDatePickerComponent,
    MimDetalleUsuarioCabeceraComponent,
    MimCategoriaComponent,
    MimCategoriaDetalleComponent,
    MimWindModalComponent,
    MimSelectComponent,
    MimAutocompleteComponent,
    MimButtonComponent,
    MimFiltroVerticalComponent,
    MimFiltroVerticalItemComponent,
    MimAccordionSectionComponent,
    MimFecNacIconComponent,
    MimDeduccionesCardComponent,
    MimSearchAsociadoComponent,
    MimMultiselectComponent,
    MimMenuVerticalComponent,
    ApruebaEliminaComponent,
    LateralReclamacionesComponent,
    MimGeneraCartaComponent,
    MimBitacoraComponent,
    MimGeneraCartaModalComponent,
    MimObservacionEventoComponent,
    MimValoresEventoComponent,
    MimCoberturaEventoComponent,
    MimDetalleEventoComponent,
    MimFormaPagoComponent,
    CotizarProteccionComponent,
    ValidarDatosComponent,
    TipoCalculoComponent,
    CotizarProteccionComponent,
    AdminCoberturasComponent,
    DeclaracionSaludComponent,
    MimLinksComponent,
    MimGridItemsComponent,
    GeneralComponent,
    EspecificaComponent,
    ConfiguracionGestionDiariaComponent,
    ConfiguracionGestionDiariaAutomaticaComponent,
    CantidadCasosGeolocalizacionComponent,
    MimDevolucionPorErrorComponent,
    AsociadoDetalleConfigComponent,
    MimGestionPendientePorComponent,
    TipoCartasComponent,
    GenerarCartaModalV2Component,
    NgxCurrencyModule,
    AgregarPlanComponent,
    InfoPlanComponent
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        /* ALL OF YOUR SERVICES HERE */
        CurrencyPipe,
        EmptyPipe,
        NoAplicaPipe,
        CustomNumberPipe,
        CustomCurrencyPipe,
        PercentPipe
      ]
    };
  }
}
