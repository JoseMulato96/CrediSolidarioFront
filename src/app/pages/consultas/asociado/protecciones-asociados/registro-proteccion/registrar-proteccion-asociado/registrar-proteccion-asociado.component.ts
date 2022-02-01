import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registrar-proteccion-asociado',
  templateUrl: './registrar-proteccion-asociado.component.html'
})
export class RegistrarProteccionAsociadoComponent implements OnInit {
  // VARIABLES
  active: number;
  activeNumberEdit: number;
  activeStatusEdit = false;

  constructor() {
    // do nothing
  }

  ngOnInit() {
    // do nothing
  }

  toogleCollpase(index: number) {
    this.active = index;
  }
  editarRGProteccion(index: number, status) {
    this.activeNumberEdit = index;
    this.activeStatusEdit = status;
  }
}
