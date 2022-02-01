import { Location } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FrontFacadeService, BackFacadeService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { GENERALES } from '@shared/static/constantes/constantes';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { DateUtil } from '@shared/util/date.util';
import { FileUtils } from '@shared/util/file.util';
import { ObjectUtil } from '@shared/util/object.util';

@Component({
  selector: 'app-detalle-cargue-masivo',
  templateUrl: './detalle-cargue-masivo.component.html',
  styleUrls: ['./detalle-cargue-masivo.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DetalleCargueMasivoComponent implements OnInit {
  codigoCargue: string;
  datos: any;
  _datos: any;
  datosAll: any;
  datosModificados: any = [];
  clonedCars: { [s: string]: any; } = {};
  _regVisto: number;
  _paginas = 0;
  _totalRegistros = 0;
  esDistribucion: boolean;
  columnas: any[];
  editing: boolean;
  _edad: string;
  _genero: string;
  _descripcionConcepto: string;
  _cant = 0;
  fechaInicioFinVigencia: string;
  form: FormGroup;
  isForm: Promise<any>;
  enProceso = false;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly location: Location,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(resp => {
      this.codigoCargue = resp && resp.codigoCargue;
      this.esDistribucion = resp && +resp.tipoFactor === GENERALES.TIPO_FACTOR.DISTRIBUCION ? true : false;
      this.obtener();
    });
  }

  onRowEditSave(rowData: any) {
    if (this.form.controls[rowData.codigo].value.toString().trim() !== '') {
      rowData.codigoCargue = this.codigoCargue;
      if (this.esDistribucion) {
        this._modificarRow(rowData);
      } else {
        this._saveRegistro(rowData);
      }
    }
  }

  _saveRegistro(rowData: any) {
    if (!this.esDistribucion) {
      rowData.factor = this.form.controls[rowData.codigo].value;
      this.backService.factoresContribucion.putCargueTipoFactor(rowData.codigo, rowData).subscribe(resp => {
        this.translate.get('global.actualizacionExitosaMensaje').subscribe(text => {
          this.frontService.alert.success(text);
          this.obtener();
        });
      }, err => {
        this.frontService.alert.error(err.error.message);
      });
    }
  }

  onRowEditCancel(rowData: any, index: number) {
    if (this.esDistribucion) {
      const _valor = rowData.factor.toString().includes(',') ? rowData.factor.toString().replace(',', '.') : rowData.factor;
      this.form.controls[rowData.codigo].setValue(_valor);
    } else {
      this.datos[index] = this.clonedCars[rowData.codigo];
      delete this.clonedCars[rowData.codigo];
    }
  }

  obtener() {
    if (this.esDistribucion) {
      this.backService.factoresDistribucion.getCargueTiposFactores({ 'mimPeriodo.codigo': this.codigoCargue, isPage: false }).subscribe(item => {
        this.datosAll = item.content;
        this.datos = item.content;
        this._initForm(this.datosAll);
        this._paginar();
        this.fechaInicioFinVigencia = item.content.length > 0 ? `${item.content[0].mimPeriodo.fechaInicio} a ${item.content[0].mimPeriodo.fechaFin}` : '';
        this.enProceso = item.content.length > 0 && item.content[0].mimPeriodo.mimEstadosPeriodo.codigo === MIM_PARAMETROS.MIM_ESTADO_PERIODO.PROCESO ? true : false
      }, err => {
        this.frontService.alert.error(err.error.message);
      });
    } else {
      this.backService.factoresContribucion.getCargueTiposFactores({ 'mimPeriodo.codigo': this.codigoCargue, isPage: false }).subscribe(item => {
        this.datosAll = item.content;
        this.datos = item.content;
        this._initForm(this.datosAll);
        this._paginar();
        this.fechaInicioFinVigencia = item.content.length > 0 ? `${item.content[0].mimPeriodo.fechaInicio} a ${item.content[0].mimPeriodo.fechaFin}` : '';
        this.enProceso = item.content.length > 0 && item.content[0].mimPeriodo.mimEstadosPeriodo.codigo === MIM_PARAMETROS.MIM_ESTADO_PERIODO.PROCESO ? true : false
      }, err => {
        this.frontService.alert.error(err.error.message);
      });
    }

  }

  _initForm(data: any) {
    this.isForm = Promise.resolve(this.form = this.formBuilder.group({}));
    data.map(item => {
      const _valor = item.factor.toString().includes(',') ? item.factor.toString().replace(',', '.') : item.factor;
      this.form.addControl(item.codigo.toString(), this.formBuilder.control(_valor));
    });
  }

  /**
   * @description Redirige a la pagina inicial de la tabla
   */
  _onClickInicio() {
    if (this._paginas) {
      this._paginas = 0;
      this._paginar();
    }
  }

  /**
   * @description Redirige a la ultima pagina de la tabla.
   */
  _onClickFin() {
    if (
      (this._paginas + 1) * 10 <
      this._totalRegistros
    ) {
      const div: number = this._totalRegistros / 10;

      this._paginas = Math.floor(div);

      const mod: number =
        this._totalRegistros % 10;
      this._paginas += mod === 0 ? -1 : 0;

      this._paginar();
    }
  }

  /**
   * @description Redirige a la siguiente pagina
   */
  _onClickSiguiente() {
    if (
      (this._paginas + 1) * 10 <
      this._totalRegistros
    ) {
      this._paginas++;
      this._paginar();
    }
  }

  /**
  * @description Redirige a la pagina anterior
  */
  _onClickAtras() {
    if (this._paginas) {
      this._paginas--;
      this._paginar();
    }
  }

  irAConfiguracion() {
    this.location.back();
  }

  _filterTable(event: any) {

    this.datos = this.datosAll;
    if (event.target.name === 'edad') {
      this._edad = event.target.value;
    } else if (event.target.name === 'genero') {
      this._genero = event.target.value;
    } else if (event.target.name === 'descripcionConcepto') {
      this._descripcionConcepto = event.target.value;
    }

    if (this._edad && this._edad !== '') {
      this.datos = this.datos.filter(item => !item.edad.toString().search(this._edad));
    }
    if (this._genero && this._genero !== '') {
      this.datos = this.datos.filter(item => !item.mimGenero.nombreCorto.toLowerCase().search(this._genero.toLowerCase()));
    }
    if (this._descripcionConcepto && this._descripcionConcepto !== '') {
      this.datos = this.datos.filter(item => !item.sipDistribuciones.nombre.toLowerCase().search(this._descripcionConcepto.toLowerCase()));
    }

    if (this.datos.length === 0) {
      this.translate.get('No se encontraron registros para los criterios de búsqueda ingresados').subscribe(text => {
        this.frontService.alert.info(text);
      });
    }
    this._paginar();
  }

  async _onClickExportarExcel() {

    let headers: string[] = [];
    if (this.esDistribucion) {
      headers = [
        'administracion.actuaria.cargueMasivoFactores.detalleDistribucion.grid.codigo',
        'administracion.actuaria.cargueMasivoFactores.detalleDistribucion.grid.edad',
        'administracion.actuaria.cargueMasivoFactores.detalleDistribucion.grid.genero',
        'administracion.actuaria.cargueMasivoFactores.detalleDistribucion.grid.factor'
      ];
    } else {
      headers = [
        'administracion.actuaria.cargueMasivoFactores.detalleContribucion.grid.edad',
        'administracion.actuaria.cargueMasivoFactores.detalleContribucion.grid.genero',
        'administracion.actuaria.cargueMasivoFactores.detalleContribucion.grid.factor'
      ];
    }

    let columnas: string[] = [];
    if (this.esDistribucion) {
      columnas = [
        'codigo',
        'edad',
        'genero',
        'factor'
      ];
    } else {
      columnas = [
        'edad',
        'genero',
        'factor'
      ];
    }
    ObjectUtil.traducirObjeto(headers, this.translate);

    // Se mapean solo las columnas que se quieren mostrar en el archivo Excel
    let datos: any;
    if (this.esDistribucion) {
      datos = this.datos.map(x =>
      ({
        codigo: x.sipDistribuciones.codigo,
        edad: x.edad,
        genero: x.mimGenero.nombreCorto,
        factor: x.factor
      }));
    } else {
      datos = this.datos.map(x =>
      ({
        edad: x.edad,
        genero: x.mimGenero.nombreCorto,
        factor: x.factor
      }));
    }

    this.exportarExcel(
      `factores_${DateUtil.dateToString(new Date())}`, {
      headers,
      columnas,
      datos
    });
  }

  private exportarExcel(nombre, datos: any = {}) {
    this.backService.utilidades.exportarExcel2(nombre, datos).subscribe(respuesta => {
      const body: any = respuesta.body;
      FileUtils.downloadXlsFile(body, nombre);
    });
  }

  _paginar() {
    this._totalRegistros = this.datos.length;
    this._regVisto = Math.min(
      (this._paginas + 1) * 10,
      this._totalRegistros
    );
    const _rangoInicial = this._paginas === 0 ? 0 : this._paginas * 10;
    this._datos = this.datos.slice(_rangoInicial, this._regVisto);
  }

  _modificarRow(row: any) {
    this.datosAll.find(item => item.codigo === row.codigo).factor = parseFloat(this.form.controls[row.codigo].value);
    const _total = this.datosAll.filter(item => item.edad === row.edad && item.mimGenero.nombreCorto === row.mimGenero.nombreCorto)
      .map(x => x.factor).reduce((a, b) => a + b, 0).toFixed(3);
    this.datosAll.map(item => {
      if (item.edad === row.edad && item.mimGenero.nombreCorto === row.mimGenero.nombreCorto) {
        item.descripcion = _total === '100.000' ? 'OK' : 'Error';
      }
    });
    if (!this.datosModificados.find(item => item.edad === row.edad && item.mimGenero.nombreCorto === row.mimGenero.nombreCorto)) {
      this.datosAll.map(item => {
        if (item.edad === row.edad && item.mimGenero.nombreCorto === row.mimGenero.nombreCorto) {
          this.datosModificados.push(item);
        }
      });
    }
    this.datos = this.datosAll;
    this._paginar();
  }

  guardarDistribucion() {
    if (this.datosModificados && this.datosModificados.length === 0) {
      this.translate.get('administracion.actuaria.cargueMasivoFactores.detalleDistribucion.alertas.registrosNoModificados').subscribe(texto => {
        this.frontService.alert.info(texto);
      });
      return;
    }
    this.backService.factoresDistribucion.putCargueTipoFactor(this.datosModificados).subscribe(resp => {
      this.translate.get('global.actualizacionExitosaMensaje').subscribe(text => {
        this.frontService.alert.success(text);
        this.obtener();
      });
    }, err => {
      this.frontService.alert.error(err.error.message);
    });
  }

}
