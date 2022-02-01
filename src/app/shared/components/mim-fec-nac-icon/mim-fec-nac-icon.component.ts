import { Component, Input, OnInit } from '@angular/core';
import { AdComponent } from '@shared/interfaces/ad-component.interface';

@Component({
  selector: 'app-mim-fec-nac',
  templateUrl: './mim-fec-nac-icon.component.html'
})
export class MimFecNacIconComponent implements AdComponent, OnInit {
  @Input()
  configuracion: any;
  iconClass: string[];

  constructor() {
    // do nothing
  }

  ngOnInit() {
    this.iconClass = this.calcularIndFecNac(this.configuracion.indicador);
  }

  /**
    * @description Retorna la clase para el indicador de fecha de nacimiento correspondiente
    *
    * @param indicador Indicador de fecha de nacimiento.
    */
  calcularIndFecNac(indicador: number) {
    switch (indicador) {
      case 1:
        return ['icon-Valida', 'text--green2'];
      case 2:
        return ['icon-Pendiente', 'text--red1'];
      case 3:
        return ['icon-No-valida', 'text--gray2'];
      default:
        return ['icon-No-valida', 'text--gray2'];
    }
  }

}
