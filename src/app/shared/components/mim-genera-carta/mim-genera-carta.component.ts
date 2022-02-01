import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { MimGeneraCartaModalComponent } from '../mim-genera-carta-modal/mim-genera-carta-modal.component';
import { FormValidate } from '@shared/util';
import { TranslateService } from '@ngx-translate/core';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-mim-genera-carta',
  templateUrl: './mim-genera-carta.component.html',
})
export class MimGeneraCartaComponent extends FormValidate implements OnInit {

  form: FormGroup;
  isForm: Promise<any>;

  tituloTipoCarta: string;
  cartaExistente: boolean;
  tiposCartas = [];
  subs: Subscription[] = [];
  datosAsociado: any;
  firmas: any;
  datosUsuario: any;
  datosFirma: any = {};
  cuerpoCarta: any;
  generarPdf: boolean;
  tipoCarta: any;
  parametro: any;
  @Input() asoNumInt: string;
  @Input() idProceso: string;
  @Input() disabled: boolean;
  @Input() faseFlujo: number;
  @Input() conceptoFlujo: number;
  @Output() cartaGenerada = new EventEmitter<any>();
  @ViewChild(MimGeneraCartaModalComponent) modalCarta: MimGeneraCartaModalComponent;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService,
    private readonly translate: TranslateService
  ) {
    super();
  }

  ngOnInit() {
    this.cargarDatos(this.conceptoFlujo);
  }

  cargarDatos(conceptoFlujo?: number) {
    this.parametro = {};
    if (this.faseFlujo) {
      this.parametro['mimFaseFlujo.codigo'] = this.faseFlujo;
    }

    if (conceptoFlujo) {
      this.parametro['mimConceptoFlujo.codigo'] = conceptoFlujo;
    }

    this.backService.cartaFase.getCartaFase(this.parametro).subscribe((items: any) => {
      this.tiposCartas = items.content.map(x =>
        ({
          codigo: x.mimParametroCarta.codigo,
          nombre: x.mimParametroCarta.nombre,
          contenido: atob(x.mimParametroCarta.contenido),
          estado: x.mimParametroCarta.estado,
        }));
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });

    if (!this.form) {
      this.isForm = Promise.resolve(
        this.form = this.formBuilder.group({
          tipoCarta: new FormControl(null, [Validators.required])
        })
      );
    }

    this.form.controls.tipoCarta.valueChanges.subscribe(item => {
      if (item) {
        this.tipoCarta = item;
      }
    });

    if (this.faseFlujo) {
      this.form.controls.tipoCarta.setValue(this.tiposCartas.find(t => t.codigo === this.faseFlujo));
    }
  }

  _diligenciar() {
    const _form = this.form.getRawValue();
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((validateForm: string) => {
        this.frontService.alert.warning(validateForm);
      });
      return;
    }
    this.modalCarta._getDatosDelAsociado();
  }

  verCartaPDF() {
    this.generarPdf = true;
    this.modalCarta.verCartaPDF();
  }

  abrirModal() {
    this.modalCarta._getDatosDelAsociado();
  }

  cartaGuardada(event) {
    this.cartaExistente = true;
    this.cartaGenerada.emit(event);
  }

  public limpiar() {
    this.cartaExistente = false;
  }

}
