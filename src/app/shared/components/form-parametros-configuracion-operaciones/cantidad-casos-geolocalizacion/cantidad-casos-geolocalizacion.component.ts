import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { masksPatterns } from '@shared/util/masks.util';

@Component({
  selector: 'app-cantidad-casos-geolocalizacion',
  templateUrl: './cantidad-casos-geolocalizacion.component.html',
})
export class CantidadCasosGeolocalizacionComponent implements OnInit {

  geolocalizaciones: any[];
  ubicacion: any[];
  tipoCantidadesCasos: any[];
  showInput: boolean;
  patterns = masksPatterns;

  @Input('dataInitGeolocalizacion')
  set dataInitGeolocalizacion(value: any) {
    if (value) {
      this.geolocalizaciones = value.tipoTipoGelocalizacion;
      this.tipoCantidadesCasos = value.tipoMovimiento;
      this.ubicacion = value.ubicaciones;
      this.showInput = value.showInput;
    }
  }

  constructor(public controlContainer: ControlContainer) { }

  ngOnInit() {
    //do nothing
  }

}
