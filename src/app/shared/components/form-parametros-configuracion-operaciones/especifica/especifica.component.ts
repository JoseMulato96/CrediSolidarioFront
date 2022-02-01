import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { masksPatterns } from '@shared/util/masks.util';

@Component({
  selector: 'app-especifica',
  templateUrl: './especifica.component.html',
})
export class EspecificaComponent implements OnInit {

  coberturas: any;
  planes: any[];
  tiposMovimientos: any[];
  nivelesRiesgos: any[];
  ciclosFacturacion: any[];
  patterns = masksPatterns;


  @Input('dataInit')
  set dataInit(value: any) {
    if (value) {
      this.coberturas = value.coberturas;
      this.planes = value.planes;
      this.tiposMovimientos = value.tiposMovimientos;
      this.nivelesRiesgos = value.nivelesRiesgos;
      this.ciclosFacturacion = value.ciclosFacturacion;
    }
  }

  constructor(
    public controlContainer: ControlContainer
  ) { }

  ngOnInit() {
    //do nothing
  }

}
