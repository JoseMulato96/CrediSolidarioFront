import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer } from '@angular/forms';

@Component({
  selector: 'app-mim-gestion-pendiente-por',
  templateUrl: './mim-gestion-pendiente-por.component.html',
})
export class MimGestionPendientePorComponent implements OnInit {
  subestados: any;
  @Input('dataInit')
  set dataInit(value: any) {
    if (value) {
      this.subestados = value;
    }
  }

  constructor(public controlContainer: ControlContainer) {
    this.subestados = [];
  }

  ngOnInit() {
    //do nothing
  }

}
