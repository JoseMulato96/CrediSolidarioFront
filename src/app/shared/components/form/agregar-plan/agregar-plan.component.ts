import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { AlertService } from '@core/services';

@Component({
  selector: 'app-agregar-plan',
  templateUrl: './agregar-plan.component.html',
  styleUrls: ['./agregar-plan.component.css']
})
export class AgregarPlanComponent implements OnInit {

  planes: any[];

  blnValorEvento = false;

  @Output()
  eventRegistrar: EventEmitter<boolean> = new EventEmitter();

  @Input('dataInit')
  set dataInit(value: any) {
    if (value === null || value === undefined) {
      return;
    }
    this.planes = value.planes;
  }

  constructor(public controlContainer: ControlContainer,
    private readonly alertService: AlertService,) {
  }

  ngOnInit(): void {
  }

  clickRegistrar() {
    let plan = this.controlContainer.control['controls'].plan.value;
    if (plan) {
      this.blnValorEvento = !this.blnValorEvento;
      this.eventRegistrar.emit(this.blnValorEvento);
    } else {
      this.alertService.info("Favor seleccionar un plan antes de continuar");
    }
  }

  clickCancelar() {
    this.blnValorEvento = false;
    this.eventRegistrar.emit(this.blnValorEvento);
  }
}
