import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';

@Component({
  selector: 'app-beneficiarios-existentes',
  templateUrl: './beneficiarios-existentes.component.html',
  styleUrls: ['./beneficiarios-existentes.component.css']
})
export class BeneficiariosExistentesComponent implements OnInit {
  constructor() {
    // do nothing
  }

  _config: MimGridConfiguracion = new MimGridConfiguracion();
  @Input()
  // tslint:disable-next-line:no-use-before-declare
  configuracion: BeneficiariosExistentesConfiguracion = new BeneficiariosExistentesConfiguracion();

  // tslint:disable-next-line:no-output-rename
  @Output('click-aceptar')
  clickAceptar: EventEmitter<any> = new EventEmitter<any>();

  _datos: any[] = [];

  ngOnInit() {
    this.configuracion.component = this;
    this._updateData();
  }

  cargarDatos(datos) {
    this._datos = [];
    this.configuracion.datos = datos;
    this._config.component.cargarDatos(datos);
    this._updateData();
  }

  _updateData() {
    this._datos = this.configuracion.datos;
    this._config.mostrarPaginador = false;
    this._config.columnas = this.configuracion.columnas;
  }

  _onAceptar() {
    this.clickAceptar.emit();
  }
}

export class BeneficiariosExistentesConfiguracion {
  columnas?: BeneficiariosExistentesColConfig[] = [];
  component?: BeneficiariosExistentesComponent;
  datos?: any[] = [];
  nombre?: string | any = '';
  identificacion?: string | number;
  estado?: string;
  titleNombre?: string;
  titleIdentificacion?: string;
  titleEstado?: string;
  titleAsociado?: string;
  titleBtnAceptar?: string;
}

export class BeneficiariosExistentesColConfig {
  titulo: string;
  key: string;
}
