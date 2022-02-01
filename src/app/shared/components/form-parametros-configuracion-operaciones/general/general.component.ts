import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { masksPatterns } from '@shared/util/masks.util';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
})
export class GeneralComponent implements OnInit {

  tiposMovimientos: any[];
  nivelesRiesgos: any[];
  ciclosFacturacion: any[];
  patterns = masksPatterns;


  @Input('dataInit')
  set dataInit(value: any) {
    if (value) {
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
