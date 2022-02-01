import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ajuste-facturacion',
  templateUrl: './ajuste-facturacion.component.html'
})
export class AjusteFacturacionComponent implements OnInit {
  shownPanelCrearFacturacion = false;

  constructor() {
    // do nothing
  }

  ngOnInit() {
    // do nothing
  }
  
  activePanelRightCrearFacturacion(status) {
    if (status) {
      this.shownPanelCrearFacturacion = false;
    } else {
      this.shownPanelCrearFacturacion = true;
    }
  }
}
