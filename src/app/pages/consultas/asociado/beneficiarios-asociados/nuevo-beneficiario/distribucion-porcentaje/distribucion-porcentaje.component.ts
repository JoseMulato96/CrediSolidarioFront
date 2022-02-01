import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '@core/services';
import { masksPatterns } from '@shared/util/masks.util';

@Component({
  selector: 'app-distribucion-porcentaje',
  templateUrl: './distribucion-porcentaje.component.html',
  styleUrls: ['./distribucion-porcentaje.component.css']
})
export class DistribucionPorcentajeComponent implements OnInit {
  constructor(
    private readonly translate: TranslateService,
    private readonly alertService: AlertService
  ) { }
  _titleBorrar: boolean;

  patterns = masksPatterns;

  @Input()
  // tslint:disable-next-line:no-use-before-declare
  configuracion: DistribucionPorcentajeConfiguracion = new DistribucionPorcentajeConfiguracion();

  // tslint:disable-next-line:no-output-rename
  @Output('guardar-datos')
  guardaDatos: EventEmitter<any> = new EventEmitter<any>();

  _datos: any[];
  _sumatoria = 0;
  _diferencialSumatoria = 0;
  _accion = 0;
  _MANUAL = 1;
  _AUTOMATICO = 2;

  ngOnInit() {
    this.configuracion.component = this;
    this._updateDatos();
  }

  cargarDatos(datos) {
    // completo el nombre
    datos.forEach(dato => {
      dato.nomBeneficiario = dato.nomBeneficiario.concat(dato.benApellido1 ? ' ' + dato.benApellido1.trim() : '')
        .concat(dato.benApellido2 ? ' ' + dato.benApellido2.trim() : '')
        ;
    }
    );


    this.configuracion.datos = datos;
    this._accion = this._AUTOMATICO;
    this._updateDatos();
  }

  _updateDatos() {
    this._datos = [];
    this._datos = this.configuracion.datos;
    this._calcularPorcentaje();
    this._mostrarTitleBorrar();
  }

  _clickAutomatico() {
    const len = this._calcularLong();
    const div: number = 100 / len;
    const unidad = parseFloat(div.toFixed(1));
    const dif = parseFloat((100 - unidad * len).toFixed(1));
    let pos = 0;
    this._accion = this._AUTOMATICO;
    this._datos.forEach(dato => {
      if (!dato._desabilitar) {
        dato[this.configuracion.keyPorcentaje] =
          unidad + (pos === len - 1 ? dif : 0);
        pos++;
      }
    });

    this._calcularPorcentaje();
  }

  _clickManual() {
    this._accion = this._MANUAL;
  }

  _calcularPorcentaje() {
    this._sumatoria = 0;
    this._datos.forEach(dato => {
      if (!dato._desabilitar) {
        this._sumatoria += parseFloat(dato[this.configuracion.keyPorcentaje]);
      }
    });
    this._sumatoria = parseFloat(this._sumatoria.toFixed(2));
    this._diferencialSumatoria = 100 - this._sumatoria;
    this._diferencialSumatoria = parseFloat(
      this._diferencialSumatoria.toFixed(2)
    );
  }

  _clickDesactivar(_dato, e) {
    if (e.target.checked) {
      _dato._desabilitar = true;
      _dato[this.configuracion.keyPorcentaje] = 0;
    } else {
      _dato._desabilitar = false;
      _dato[this.configuracion.keyPorcentaje] = 1;
    }

    this._calcularPorcentaje();
  }

  _mostrarTitleBorrar() {
    this._titleBorrar = false;
    this.configuracion.datos.forEach(x => { if (!x._ocultar) { this._titleBorrar = true; } });
  }

  _calcularLong() {
    let len = 0;
    this._datos.forEach(x => {
      if (!x._desabilitar) {
        len++;
      }
    });
    return len;
  }

  _cambioValor(dato, e) {

    const valorString: string = String(e.target.value || '0');
    if (dato._desabilitar) {
      return;
    }

    let valorInt = parseFloat(valorString);

    /// realiza trunque de dos decimales
    if (valorString.includes('.')) {
      valorInt = parseFloat(valorString.substr(0, valorString.indexOf('.') + 3));
    }

    if (valorInt <= 0 || valorInt >= 101) {
      e.target.value = dato[this.configuracion.keyPorcentaje];
      return;
    }
    dato[this.configuracion.keyPorcentaje] = valorString;
    this._calcularPorcentaje();
  }

  _guardar() {
    if (this._diferencialSumatoria !== 0) {
      this.translate
        .get('asociado.beneficiario.nuevoBeneficiario.alertPorsentaje')
        .subscribe(text => this.alertService.warning(text));
      return false;
    }

    this.guardaDatos.emit(this.configuracion.datos);
  }
}
export class DistribucionPorcentajeConfiguracion {
  component: DistribucionPorcentajeComponent;

  titulo?: string;
  keyTitulo?: string;
  keyPorcentaje?: string;
  ocultar?: any[];
  tituloPorcentaje?: string;
  tituloBorrar?: string;
  labelDistribucion?: string;
  labelAutomatico?: string;
  labelManual?: string;
  labelAceptar?: string;
  datos: any[] = [];
}
