import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-act-fecha-nacimiento',
  templateUrl: './act-fecha-nacimiento.component.html',
})
export class ActFechaNacimientoComponent implements OnInit {

  shownPanelAgregarComentarios = false;

  constructor() {
    // do nothing
  }

  ngOnInit() {
    // do nothing
  }

  activePanelAgregarComentarios(status) {
    if (status === false) {
      this.shownPanelAgregarComentarios = false;
    } else {
      this.shownPanelAgregarComentarios = true;
    }

  }

}
