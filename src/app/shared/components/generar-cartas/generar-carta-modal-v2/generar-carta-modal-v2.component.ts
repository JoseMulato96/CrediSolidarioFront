import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { BackFacadeService } from '@core/services/back-facade.service';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { TranslateService } from '@ngx-translate/core';
import { ReportParams } from '@shared/models/report-params.model';
import { FormValidate } from '@shared/util';
import { masksPatterns } from '@shared/util/masks.util';

@Component({
  selector: 'app-generar-carta-modal-v2',
  templateUrl: './generar-carta-modal-v2.component.html',
})
export class GenerarCartaModalV2Component extends FormValidate implements OnInit {

  mostrarModal: boolean;
  tituloCarta: string;
  cuerpoCarta: any;
  generarCarta: boolean;
  cartaExistente: boolean;
  tiposCartas: any;
  dataInitTipoCarta: any;
  parametrosCarta: any;
  tipoCartaSeleccionada: any;
  observacionCartaGuardada: string;
  patterns = masksPatterns;

  @Input('datosCarta')
  set datosCarta(value: any) {
    if (value) {
      this.tituloCarta = value.tituloCarta || '';
      this.cuerpoCarta = value.cuerpoCarta || [];
      this.generarCarta = value.generarCarta || false;
      this.cartaExistente = value.cartaExistente || false;
      this.parametrosCarta = value.parametrosCarta || null;
      this.tipoCartaSeleccionada = value.tipoCartaSeleccionada || null;
      this.dataInitTipoCarta = {
        cartaExistente: this.cartaExistente,
        tiposCartas: value.tiposCartas || []
      };
      if (value.diligenciarCarta) {
        this.abrirCerrarModal(value.diligenciarCarta);
      }
    }
  }

  constructor(
    public controlContainer: ControlContainer,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
    this.mostrarModal = false;
  }

  ngOnInit() {
    //do nothing
  }

  hasChanges() {
    return (this.controlContainer.control as FormGroup) && (this.controlContainer.control as FormGroup).controls.observacionCarta.dirty;
  }

  abrirCerrarModal(mostrar: boolean) {
    if (!mostrar && this.hasChanges()) {
      this.frontService.alert.confirm(this.translate.instant('global.onDeactivate')).then((respuesta: boolean) => {
        if (respuesta) {
          if (this.observacionCartaGuardada && this.cartaExistente) {
            (this.controlContainer.control as FormGroup).controls.observacionCarta.setValue(this.observacionCartaGuardada);
            (this.controlContainer.control as FormGroup).controls.observacionCarta.markAsPristine({ onlySelf: false });
          } else {
            (this.controlContainer.control as FormGroup).reset();
          }
          this.mostrarModal = false;
        }
      });
    } else {
      if (!this.cartaExistente) {
        (this.controlContainer.control as FormGroup).controls.observacionCarta.reset();
      }
      this.mostrarModal = mostrar ? mostrar : !this.mostrarModal;
    }
  }

  guardarCarta() {
    if (this.controlContainer.invalid) {
      this.validateForm(this.controlContainer.control as FormGroup);
      this.translate.get('global.validateForm').subscribe((validateForm: string) => {
        this.frontService.alert.warning(validateForm);
      });
      return;
    }
    this.cartaExistente = true;
    this.dataInitTipoCarta = {
      ...this.dataInitTipoCarta,
      cartaExistente: this.cartaExistente
    };
    (this.controlContainer.control as FormGroup).controls.observacionCarta.markAsPristine({ onlySelf: false });
    this.observacionCartaGuardada = (this.controlContainer.control as FormGroup).controls.observacionCarta.value;
    this.mostrarModal = false;
  }

  verCartaPDF() {
    const _form = (this.controlContainer.control as FormGroup).getRawValue();
    const _datosCarta: ReportParams = new ReportParams;
    this.parametrosCarta.comment = _form.observacionCarta;
    _datosCarta.nombre = this.tipoCartaSeleccionada.nombre;
    _datosCarta.parameters = this.parametrosCarta;

    this.backService.generarCarta.generarPDF(_datosCarta, this.tipoCartaSeleccionada.codigo).subscribe(item => {
      const blob = new Blob([item.body], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL, '', 'width=' + window.outerWidth + ',height=' + window.outerHeight + ',left=0,top=0');
    });
  }
}
