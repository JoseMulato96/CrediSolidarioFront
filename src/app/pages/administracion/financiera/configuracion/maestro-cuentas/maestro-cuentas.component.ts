import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { FormValidate } from '@shared/util';
import { FileUtils } from '@shared/util/file.util';
import { DateUtil } from '@shared/util/date.util';
import { ObjectUtil } from '@shared/util/object.util';
import { masksPatterns } from '@shared/util/masks.util';
import { FormComponent } from '@core/guards';
import { AppState } from '@core/store/reducers';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { MaestroCuentasConfig } from './maestro-cuentas.config';
import * as actions from '../configuracion.actions';
import { BackFacadeService, FrontFacadeService } from '@core/services';

@Component({
  selector: 'app-maestro-cuentas',
  templateUrl: './maestro-cuentas.component.html',
})
export class MaestroCuentasComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  _subs: Subscription[] = [];

  patterns = masksPatterns;

  form: FormGroup;
  isForm: Promise<any>;
  _esCreacion: boolean;

  configuracion: MaestroCuentasConfig = new MaestroCuentasConfig();

  dropdown: boolean;
  mostrarGuardar: boolean;
  maestroCuenta: any;

  estado = true;
  exportarDisabled = true;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly store: Store<AppState>,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
  }

  ngOnInit() {
    this._listar();
  }

  ngOnDestroy() {
    this._subs.forEach(sub => sub.unsubscribe());
  }

  hasChanges() {
    return this.form && this.form.dirty;
  }

  private initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        cuentaContable: new FormControl(param ? param.numeroCuenta : null, [Validators.required]),
        nombreCuenta: new FormControl(param ? param.nombreCuenta : null, [Validators.required]),
        cuentaColgaap: new FormControl(param ? param.numeroCOLGAAP : null, [Validators.required]),
        cuentaNiff: new FormControl(param ? param.numeroNIIF : null, [Validators.required]),
        vigente: new FormControl(param ? param.estado : false, [Validators.required]),
      })
    );

    if (!this._esCreacion) {
      this.form.controls.cuentaContable.disable();
      if (param && !param.estado) {
        this.form.disable();
        this.form.controls.vigente.enable();
      }
    }
  }

  _onSiguiente($event) {
    this._obtenerDatosConEstados($event, this.estado);
  }

  _onAtras($event) {
    this._obtenerDatosConEstados($event, this.estado);
  }

  _onClickCelda($event) {
    this._toggleGuardar(true, $event);
  }

  async _toggleGuardar(toggle: boolean, maestroCuenta?: any) {
    if (!toggle && this.hasChanges()) {
      this.frontService.alert.confirm(this.translate.instant('global.onDeactivate')).then((respuesta: boolean) => {
        if (respuesta) {
          this.mostrarGuardar = false;
          this.limpiarFormulario();
        }
      });
    } else {

      if (maestroCuenta) {
        this.maestroCuenta = JSON.parse(JSON.stringify(maestroCuenta));
        this._esCreacion = false;
        this.initForm(this.maestroCuenta);
      } else {
        this.maestroCuenta = undefined;
        this._esCreacion = true;
        this.initForm();
      }

      this.mostrarGuardar = toggle;
    }
  }

  _listar(pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = 'true') {

    this.backService.cuentaContable.getCuentasContables({
      estado: estado,
      page: pagina,
      size: tamanio,
      sort: sort,
      isPaged: true,
    }).subscribe((page: any) => {
      if (!page || !page.content || page.content.length === 0) {
        this.exportarDisabled = true;
        return;
      }
      this.store.dispatch(actions.listarMaestroCuentas({datos: page.content}));
      if (this.configuracion.gridConfig.component) {
        this.exportarDisabled = false;
        this.configuracion.gridConfig.component.limpiar();
        this.configuracion.gridConfig.component.cargarDatos(
          this._asignarEstados(page.content), {
          maxPaginas: page.totalPages,
          pagina: page.number,
          cantidadRegistros: page.totalElements
        });
      }
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  _asignarEstados(items: any) {
    const listObj = [];
    let item: any;
    for (item of items) {
      listObj.push({
        ...item,
        _estado: item.estado ? 'Si' : 'No'
      });
    }

    return listObj;
  }

  _guardar() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }

    if (this._esCreacion) {
      this._crear();
    } else {
      this._actualizar();
    }
  }

  _crear() {
    const maestroCuenta = {
      numeroCuenta: this.form.controls.cuentaContable.value,
      nombreCuenta: this.form.controls.nombreCuenta.value,
      numeroCOLGAAP: this.form.controls.cuentaColgaap.value,
      numeroNIIF: this.form.controls.cuentaNiff.value,
      estado: true
    };

    this.backService.cuentaContable.postCuentaContable(maestroCuenta).subscribe((respuesta: any) => {
      // Limpiamos el formulario.
      this.limpiarFormulario();
      // Cerramos el modal.
      this.maestroCuenta = undefined;
      this.mostrarGuardar = false;

      this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          // Recargamos la informacion de la tabla.
          this._listar();
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  _actualizar() {
    this.maestroCuenta.numeroCuenta = this.form.controls.cuentaContable.value;
    this.maestroCuenta.nombreCuenta = this.form.controls.nombreCuenta.value;
    this.maestroCuenta.numeroCOLGAAP = this.form.controls.cuentaColgaap.value;
    this.maestroCuenta.numeroNIIF = this.form.controls.cuentaNiff.value;
    this.maestroCuenta.estado = this.form.controls.vigente.value;

    this.backService.cuentaContable.putCuentaContable(this.maestroCuenta.codigo, this.maestroCuenta).subscribe((respuesta: any) => {
      // Limpiamos el formulario.
      this.limpiarFormulario();
      // Cerramos el modal.
      this.maestroCuenta = undefined;
      this.mostrarGuardar = false;

      this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          // Recargamos la informacion de la tabla.
          this._listar();
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  limpiarFormulario() {
    this.form.reset();
    this.initForm();
  }

  _onToggleStatus($event) {
    this._obtenerDatosConEstados($event, $event.currentTarget.checked);
  }

  _obtenerDatosConEstados($event, estado: boolean) {
    this.estado = estado;
    this._listar($event.pagina, $event.tamano, $event.sort, this.estado ? 'true' : '');
  }

  _onClickExportarExcel($event) {
    if (this.configuracion.gridConfig.component && this.configuracion.gridConfig.component.hayDatos()) {
      this.backService.cuentaContable.getCuentasContables({ estado: this.estado ? 'true' : '', isPaged: false })
        .subscribe((respuesta) => {
          // Se traen los encabezados
          const columnas: string[] = [
            'administracion.financiera.maestroCuenta.grid.cuentaContable',
            'administracion.financiera.maestroCuenta.grid.nombreCuenta',
            'administracion.financiera.maestroCuenta.grid.cuentaColgaap',
            'administracion.financiera.maestroCuenta.grid.cuentaNiff',
            'administracion.financiera.maestroCuenta.grid.vigente'
          ];
          ObjectUtil.traducirObjeto(columnas, this.translate);

          // Se mapean solo las columnas que se quieren mostrar en el archivo Excel
          const datos = respuesta.content.map(x =>
            ({
              cuentaContable: x.numeroCuenta,
              nombreCuenta: x.nombreCuenta,
              cuentaColgaap: x.numeroCOLGAAP,
              cuentaNiff: x.numeroNIIF,
              vigente: x.estado ? 'Si' : 'No'
            }));

          this.exportarExcel(
            `Reporte_MaestroCuentas_${DateUtil.dateToString(new Date())}`, {
            columnas,
            datos
          });
        });
    }
  }

  private exportarExcel(nombre, datos: any = {}) {
    this.backService.utilidades.exportarExcel(nombre, datos).subscribe(respuesta => {
      const body: any = respuesta.body;
      FileUtils.downloadXlsFile(body, nombre);
    });
  }

}
