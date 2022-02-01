import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { AlertService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { DateUtil } from '@shared/util/date.util';
import { masksPatterns } from '@shared/util/masks.util';

import { BeneficiariosService } from '../../../../core/services/api-back.services/mimutualasociados/beneficiarios.service';
import { BeneficiariosFallecidosConfig } from './beneficiarios-fallecidos.config';
import { Router } from '@angular/router';
import { UtilidadesService } from '@core/services/api-back.services/mimutualutilidades/utilidades.service';

import { SERVICIOS_PARAMETROS_BENEFICIARIO } from '@shared/static/constantes/servicios-parametros';
import { FileUtils } from '@shared/util/file.util';
import { FormValidate } from '@shared/util';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-beneficiarios-fallecidos',
  templateUrl: './beneficiarios-fallecidos.component.html',
  styleUrls: ['./beneficiarios-fallecidos.component.css']
})
export class BeneficiariosFallecidosComponent extends FormValidate
  implements OnInit {
  valorId = '';
  valorFechaInicio = '';
  valorFechaFin = '';
  exportarDisabled = true;

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

  configuracion: BeneficiariosFallecidosConfig = new BeneficiariosFallecidosConfig();

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
    this.configuracion.gridFallecidos.component.limpiar();
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description seleciona el el sub menu
   */
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
    this.getBeneficiarioFallecidos();
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
    // Aunque esto se controls desde el componente, de igual manera agregamos la validacion.
    if (fechaInicio > this.maxDateValue) {
      this.translate
        .get('beneficiarios.fallecidos.fechaInicioSuperiorSistema')
        .subscribe(texto => {
          this.frontService.alert.warning(texto);
        });
      return;
    }

    // Valida fecha final con respecto a fecha del sistema (Fecha actual)
    // Aunque esto se controls desde el componente, de igual manera agregamos la validacion.
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
    this.getBeneficiarioFallecidos();
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Obtener los beneficiarios fallecdos
   */
  private getBeneficiarioFallecidos() {
    this.configuracion.gridFallecidos.datos = [];
    this.backService.beneficiarios
      .getBeneficiarioFallecidos(
        this.parametrosDefault({
          idBeneficiario: this.valorId,
          fechaIni: this.valorFechaInicio,
          fechaFin: this.valorFechaFin,
          page: this.configuracion.gridFallecidos.pagina,
          size: this.configuracion.gridFallecidos.tamano,
          exportar: true
        })
      )
      .subscribe((respuesta: any) => {
        if (!respuesta || respuesta.content.length === 0) {
          this.translate
            .get('beneficiarios.fallecidos.noExisteBeneficiarioFallecidos')
            .subscribe((response: any) => {
              this.frontService.alert.info(response);
            });
          this._onLimpiarFormGroup();
          return;
        }
        this.exportarDisabled = false;

        this.configuracion.gridFallecidos.component.cargarDatos(
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
      this.configuracion.gridFallecidos.component &&
      this.configuracion.gridFallecidos.component.hayDatos()
    ) {
      this.backService.beneficiarios
        .getBeneficiarioFallecidosExcel(
          this.parametrosDefault({
            idBeneficiario: this.valorId,
            fechaIni: this.valorFechaInicio,
            fechaFin: this.valorFechaFin,
            exportar: true
          })
        )
        .subscribe((respuesta) => {
          const columnas: string[] = [
            'Tipo Identificación Asociado',
            'Número Identificación Asociado',
            'Nombre Asociado',
            'Regional Asociado',
            'Zona Asociado',
            'Dirección Correspondencia Asociado',
            'Ciudad Correspondencia Asociado',
            'Dirección Residencia Asociado',
            'Ciudad Residencia Asociado',
            'Teléfono Residencia Asociado',
            'Teléfono Comercial Asociado',
            'Teléfono Adicional Asociado',
            'Celular Asociado',
            'E-mail Asociado',
            'Tipo Beneficiario',
            'Tipo Identificación Beneficiario',
            'Número Identificación Beneficiario',
            'Nombre Beneficiario',
            'Porcentaje en Solidaridad',
            'Fecha Fallecimiento Beneficiario',
            'Estado Beneficiario',
            'Fecha Generación Carta',
            'Parentesco'
          ];

          this.exportarExcel(
            `Reporte_BeneficiariosFallecidos_${DateUtil.dateToString(new Date())}`, {
            columnas,
            datos: respuesta.content
          }
          );
        }, (err: any) => {
          this.frontService.alert.error(err.error.message);
        });
    }
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Exporta el excel con recto a los datos.
   */
  private exportarExcel(nombre, datos: any = {}) {
    this.backService.utilidades.exportarExcel(nombre, datos).subscribe(respuesta => {
      const body: any = respuesta.body;
      FileUtils.downloadXlsFile(body, nombre);
    }, (err: any) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description se configura los datos basicos
   */
  private parametrosDefault(objAgregar: any = {}) {
    const options: any = {
      auxilios:
        SERVICIOS_PARAMETROS_BENEFICIARIO.fallecidos.auxFunFamiliar
    };

    return Object.assign(options, objAgregar);
  }
}
