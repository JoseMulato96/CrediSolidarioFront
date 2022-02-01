import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '@core/services';
import { UtilidadesService } from '@core/services/api-back.services/mimutualutilidades/utilidades.service';
import { TranslateService } from '@ngx-translate/core';
import { DateUtil } from '@shared/util/date.util';
import { FileUtils } from '@shared/util/file.util';
import { FormValidate } from '@shared/util/form-validate';
import { masksPatterns } from '@shared/util/masks.util';

import { BeneficiariosService } from '../../../../core/services/api-back.services/mimutualasociados/beneficiarios.service';
import { BeneficiariosRepetidosConfig } from './beneficiarios-repetidos.config';
import { ObjectUtil } from '@shared/util/object.util';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-beneficiarios-repetidos',
  templateUrl: './beneficiarios-repetidos.component.html',
  styleUrls: ['./beneficiarios-repetidos.component.css']
})
export class BeneficiariosRepetidosComponent extends FormValidate
  implements OnInit {

  /**
   * @description Formulario de filtro de beneficiarios fallecidos.
   */
  form: FormGroup;
  isForm: Promise<any>;

  /**
   * @description Genera una copia en el componente del estado del tipo de filtro.
   * 1 corresponde a busqueda por rango de fechas, 2 a busqueda por identificacion del beneficiario.
   * Por defecto sera siempre 1.
   */
  tipoFiltro = 1;
  patterns = masksPatterns;
  maxDateValue: Date;

  valorId = '';
  valorFechaInicio = '';
  valorFechaFin = '';
  configuracion: BeneficiariosRepetidosConfig = new BeneficiariosRepetidosConfig();
  exportarDisabled = true;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly router: Router,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
  }

  ngOnInit() {
    this._initFormGroup();
    // Debemos setear el tipo de filtro para que se lance el onChange.
    this.form.controls.tipoFiltro.setValue(this.tipoFiltro);
    this.maxDateValue = new Date();
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @edited Alvaro Jose Lobaton Restrepo
   * @description Inicializa el formulario de filtro por fehas.
   */
  _initFormGroup() {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        tipoFiltro: new FormControl(this.tipoFiltro, [Validators.required]),
        fechaInicio: new FormControl(null, [Validators.required]),
        fechaFin: new FormControl(null, [Validators.required]),
        idBeneficiario: new FormControl(null, [Validators.required])
      }));

    this.onChanges();
  }

  onChanges() {
    this.form.controls.tipoFiltro.valueChanges.subscribe(tipoFiltro => {
      this.tipoFiltro = tipoFiltro || this.tipoFiltro;
      if (this.tipoFiltro === 1) {
        this.form.controls.fechaInicio.enable();
        this.form.controls.fechaFin.enable();
        this.form.controls.idBeneficiario.disable();
      } else {
        this.form.controls.idBeneficiario.enable();
        this.form.controls.fechaInicio.disable();
        this.form.controls.fechaFin.disable();
      }
    });
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @edited Alvaro Jose Lobaton Restrepo
   * @description Limpia el formulario de filtro de fechas.
   */
  _onLimpiarFormGroup() {
    this.form.reset();
    this._initFormGroup();

    // Debemos restaurar nuevamente el tipo de filtro.
    this.form.controls.tipoFiltro.setValue(this.tipoFiltro);

    // Limpiamos el set de datos de la tabla.
    this.exportarDisabled = true;
    this.configuracion.gridRepetidos.component.limpiar();
  }

  seleccionOpcion(router: string[]) {
    const url = router.join('/');
    this.router.navigateByUrl(url);
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @edited Alvaro Jose Lobaton Restrepo
   * @description obtener los valores para hacer la peticion
   */
  _onBuscar(event: any) {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate
        .get('global.validateForm')
        .subscribe(texto => {
          this.frontService.alert.warning(texto);
        });
      return;
    }

    // En un futuro, cuando el tipo de filtros crezca, se debe implementar un switch, en lugar de
    // un else if.
    if (this.tipoFiltro === 1) { // Validando por el rango de fechas
      this.buscarFechas();
    } else if (this.tipoFiltro === 2) { // Validando por numero de identificación
      this.buscarCedula();
    }
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description buscar por cedula
   */
  private buscarCedula() {
    this.valorId = this.form.controls.idBeneficiario.value;
    this.valorFechaInicio = '';
    this.valorFechaFin = '';
    this.getBeneficiarioRepetidos();
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @edited Alvaro Jose Lobaton Restrepo
   * @description buscar por fechas
   */
  private buscarFechas() {
    const fechaInicio = this.form.controls.fechaInicio.value;
    const fechaFin = this.form.controls.fechaFin.value;

    // Valida fecha final con respecto a fecha inicial.
    if (fechaFin < fechaInicio) {
      this.translate
        .get('beneficiarios.fallecidos.fechaInicioSuperior')
        .subscribe(texto => {
          this.frontService.alert.warning(texto);
        });
      return;
    }

    // Validamos el rango de las fechas.
    if (DateUtil.obtenerDiasEntre({ fechaInicio, fechaFin }) > 30) {
      this.frontService.alert.warning('La fecha de inicio y fecha final pueden tener hasta 30 días de diferencia');
      return;
    }

    // Valida fecha inicial con respecto a fecha del sistema (Fecha actual)
    // Aunque esto se controla desde el componente, de igual manera agregamos la validacion.
    if (fechaInicio > this.maxDateValue) {
      this.translate
        .get('beneficiarios.fallecidos.fechaInicioSuperiorSistema')
        .subscribe(texto => {
          this.frontService.alert.warning(texto);
        });
      return;
    }

    // Valida fecha final con respecto a fecha del sistema (Fecha actual)
    // Aunque esto se controla desde el componente, de igual manera agregamos la validacion.
    if (fechaFin > this.maxDateValue) {
      this.translate
        .get('beneficiarios.fallecidos.fechaFinSuperiorSistema')
        .subscribe(texto => {
          this.frontService.alert.warning(texto);
        });
      return;
    }

    this.valorId = '';
    this.valorFechaInicio = DateUtil.dateToString(fechaInicio);
    this.valorFechaFin = DateUtil.dateToString(fechaFin);
    this.getBeneficiarioRepetidos();
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Obtener los beneficiarios fallecdos
   */
  private getBeneficiarioRepetidos() {
    this.configuracion.gridRepetidos.datos = [];
    this.backService.beneficiarios
      .getBeneficiarioRepetidos(
        {
          idBeneficiario: this.valorId,
          fechaIni: this.valorFechaInicio,
          fechaFin: this.valorFechaFin,
          exportar: true
        }
      )
      .subscribe((respuesta: any) => {
        if (!respuesta || respuesta.content.length === 0) {
          this.translate
            .get('beneficiarios.repetidos.noExisteBeneficiariosRepetidos')
            .subscribe((response: any) => {
              this.frontService.alert.info(response);
            });
          this._onLimpiarFormGroup();
          return;
        }
        this.exportarDisabled = false;

        this.configuracion.gridRepetidos.component.cargarDatos(
          respuesta.content,
          {
            maxPaginas: respuesta.totalPages,
            pagina: respuesta.number,
            cantidadRegistros: respuesta.totalElements
          }
        );
      }, error => {
        if (error.status === 404) {
          this.frontService.alert.warning(error.error.message);
        }
      });
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description escucha cuando le hace click al exportar excel
   */
  _onClickExportarExcel($event) {
    if (
      this.configuracion.gridRepetidos.component &&
      this.configuracion.gridRepetidos.component.hayDatos()
    ) {
      this.backService.beneficiarios
        .getBeneficiarioRepetidosExcel(
          {
            idBeneficiario: this.valorId,
            fechaIni: this.valorFechaInicio,
            fechaFin: this.valorFechaFin,
            exportar: true
          }
        )
        .subscribe((respuesta) => {
          const columnas: string[] = [
            'Tipo Identificación Asociado',
            'Número Identificación Asociado',
            'Nombre Asociado',
            'Regional Asociado',
            'Dirección Correspondencia Asociado',
            'Ciudad Correspondencia Asociado',
            'Dirección Residencia Asociado',
            'Ciudad Residencia Asociado',
            'Teléfono Residencia Asociado',
            'Teléfono Comercial Asociado',
            'Teléfono Adicional Asociado',
            'Celular Asociado',
            'E-mail Asociado',
            'Fecha de Registro Beneficiario',
            'Tipo Identificación Beneficiario',
            'Número Identificación Beneficiario',
            'Nombre Beneficiario',
            'Parentesco',
            'Estado Beneficiario',
            'Beneficiario es Asociado',
            'Cedula Asociado Cobertura',
            'Nombre Asociado Cobertura'
          ];

          this.exportarExcel(
            `Reporte_BeneficiariosRepetidos_${DateUtil.dateToString(new Date())}`, {
            columnas,
            datos: ObjectUtil.removerAtributos(respuesta.content, [
              'tipoBeneficiario',
              'tipoIdentificacionBeneficiarioCodigo',
              'benCod'
            ])
          }
          );
        }, (err: any) => {
          this.frontService.alert.error(err.error.message);
        });
    }
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description exporta el excel con recto a los datos
   */
  private exportarExcel(nombre, datos: any = {}) {
    this.backService.utilidades.exportarExcel(nombre, datos).subscribe(respuesta => {
      const body: any = respuesta.body;

      FileUtils.downloadXlsFile(body, nombre);
    }, (err: any) => {
      this.frontService.alert.error(err.error.message);
    });
  }
}
