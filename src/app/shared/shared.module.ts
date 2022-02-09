import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import { JsonpModule } from "@angular/http";
import { HttpClientModule } from "@angular/common/http";

/* components */
import { SButtonComponent } from "./components/s-button/s-button.component";
import { SInputComponent } from "./components/s-input/s-input.component";
import { SLocationComponent } from "./components/s-location/s-location.component";
import { SCheckComponent } from "./components/s-check/s-check.component";
import { SAddressComponent } from "./components/s-address/s-address.component";
import { ModalModule } from "ngx-modal";
import { SProgressCircleComponent } from "./components/s-progress-circle/s-progress-circle.component";
import { SAttachementComponent } from "./components/s-attachement/s-attachement.component";
import { SAutocompleteComponent } from "./components/s-autocomplete/s-autocomplete.component";

import { Ng2AutoCompleteModule } from "ng2-auto-complete";
import { SSubMenuComponent } from "./components/s-submenu/s-submenu.component";
import { SAreaTextComponent } from "./components/s-area-text/s-area-text.component";
import { SGridComponent } from "./components/s-grid/s-grid.component";

import { DataTablesModule } from "angular-datatables";
import { SButtonIconComponent } from "./components/s-button-icon/s-button-icon.component";
import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
  OWL_DATE_TIME_FORMATS
} from "ng-pick-datetime";

import { SComboboxComponent } from "./components/s-combobox/s-combobox.component";

import { NgxMaskModule } from "ngx-mask";
import { NgxCurrencyModule } from "ngx-currency";
import { CurrencyMaskConfig } from "ngx-currency/src/currency-mask.config";
import { STooltipComponent } from "./components/s-tooltip/s-tooltip.component";
import { SDatepickerComponent } from "./components/s-datepicker/s-datepicker.component";

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: "right",
  allowNegative: false,
  allowZero: true,
  decimal: ",",
  precision: 0,
  prefix: "$ ",
  suffix: "",
  thousands: ".",
  nullable: true
};

export const MY_MOMENT_FORMATS = {
  parseInput: 'DD, L, LT',
  fullPickerInput: 'DD, L, LT',
  datePickerInput: 'DD, L, LT',
  monthYearLabel: 'MMMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY'
};

@NgModule({
  imports: [
    CommonModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ModalModule,
    JsonpModule,
    Ng2AutoCompleteModule,
    DataTablesModule,
    NgxCurrencyModule.forRoot(CustomCurrencyMaskConfig)
    , NgxMaskModule.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  declarations: [
    SButtonComponent,
    SInputComponent,
    SLocationComponent,
    SCheckComponent,
    SAddressComponent,
    SProgressCircleComponent,
    SAttachementComponent,
    SAutocompleteComponent,
    SSubMenuComponent,
    SAreaTextComponent,
    SGridComponent,
    SButtonIconComponent,
    SComboboxComponent,
    STooltipComponent,
    SDatepickerComponent
  ],
  exports: [
    SButtonComponent,
    SInputComponent,
    SLocationComponent,
    SCheckComponent,
    SAddressComponent,
    SProgressCircleComponent,
    SAttachementComponent,
    SAutocompleteComponent,
    SSubMenuComponent,
    SAreaTextComponent,
    SGridComponent,
    SButtonIconComponent,
    SComboboxComponent,
    STooltipComponent,
    SDatepickerComponent
  ],
  providers: [{ provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS }]
})
export class SharedModule { }
