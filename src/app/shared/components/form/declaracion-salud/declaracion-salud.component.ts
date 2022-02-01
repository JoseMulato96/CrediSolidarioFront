import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { masksPatterns } from '@shared/util/masks.util';

@Component({
  selector: 'app-declaracion-salud',
  templateUrl: './declaracion-salud.component.html',
})
export class DeclaracionSaludComponent implements OnInit {

  patterns = masksPatterns;
  mimPreguntas: any;
  // mostrarIMC: boolean;
  mostrarAmpliarRespuesta1: boolean;
  mostrarAmpliarRespuesta2: boolean;
  maxDateValue: any;
  textoAmpliarRespuesta1: string;
  textoAmpliarRespuesta2: string;
  imc: number;
  deshabilitaFechaDiag: boolean;

  @Input('dataInit')
  set dataInit(value: any) {
    if (value === null || value === undefined) {
      return;
    }

    this.mimPreguntas = value;
    this.mostrarAmpliarRespuesta1 = value.mostrarAmpliarRespuesta1;
    this.mostrarAmpliarRespuesta2 = value.mostrarAmpliarRespuesta2;
    this.maxDateValue = value.maxDateValue;
    this.textoAmpliarRespuesta1 = value.textoAmpliarRespuesta1 || null;
    this.textoAmpliarRespuesta2 = value.textoAmpliarRespuesta2 || null;
    this.imc = value.imc;
    this.deshabilitaFechaDiag = value.deshabilitaFechaDiag;
  }

  constructor(public controlContainer: ControlContainer) { }

  ngOnInit() {
    //do nothing
  }
}
