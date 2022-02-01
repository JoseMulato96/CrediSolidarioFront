import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer } from '@angular/forms';

@Component({
  selector: 'app-mim-devolucion-por-error',
  templateUrl: './mim-devolucion-por-error.component.html',
})
export class MimDevolucionPorErrorComponent implements OnInit {
  fases: any;
  razonesDevolucion: any;
  @Input('dataInit')
  set dataInit(value: any) {

    if (value === null || value === undefined) {
      return;
    }

    this.fases = value.fases || [];
    this.razonesDevolucion = value.razonesDevolucion || [];

  }

  constructor(public controlContainer: ControlContainer) {
    this.fases = [];
    this.razonesDevolucion = [];
  }

  ngOnInit() {
    //do nothing
  }

}
