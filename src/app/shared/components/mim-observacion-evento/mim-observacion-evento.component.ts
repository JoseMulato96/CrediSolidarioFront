import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-mim-observacion-evento',
  templateUrl: './mim-observacion-evento.component.html',
})
export class MimObservacionEventoComponent implements OnInit {

  formObserva: FormGroup;
  isForm: Promise<any>;
  @Input() descripcionObserva: string;
  @Input() disabled: boolean;
  @Output() datoObservacion = new EventEmitter<any>();

  constructor(
    private readonly formBuilder: FormBuilder
    ) {}

  ngOnInit() {
    this._initForm();
    this.formObserva.controls.observacion.valueChanges.subscribe(item => {
      this.datoObservacion.emit(item);
    });
  }

  _initForm() {
    this.isForm = Promise.resolve(
      this.formObserva = this.formBuilder.group({
        observacion: new FormControl(this.descripcionObserva ? this.descripcionObserva : null, [Validators.required, Validators.maxLength(1000)]),
      })
    );
  }

}
