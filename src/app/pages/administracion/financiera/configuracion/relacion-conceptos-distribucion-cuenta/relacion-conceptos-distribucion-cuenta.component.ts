import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BackFacadeService, FrontFacadeService } from '@core/services';
import { AppState } from '@core/store/reducers';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { FormValidate } from '@shared/util';
import { DateUtil } from '@shared/util/date.util';
import { FileUtils } from '@shared/util/file.util';
import { ObjectUtil } from '@shared/util/object.util';
import { forkJoin, Subscription } from 'rxjs';
import * as actions from '../configuracion.actions';
import { RelacionConceptosDistribucionCuentConfig } from './relacion-conceptos-distribucion-cuenta.config';

@Component({
  selector: 'app-relacion-conceptos-distribucion-cuenta',
  templateUrl: './relacion-conceptos-distribucion-cuenta.component.html',
  styleUrls: ['./relacion-conceptos-distribucion-cuenta.component.css']
})
export class RelacionConceptosDistribucionCuentaComponent extends FormValidate implements OnInit {

  configuracion: RelacionConceptosDistribucionCuentConfig = new RelacionConceptosDistribucionCuentConfig();
  mostrarModal: boolean;
  isForm: Promise<any>;
  form: FormGroup;
  esCrear = true;
  tituloModal: string;
  estado = true;
  pagina: number;

  subscription: Subscription[] = [];
  codigoPlan: number;
  plan: any;
  listData: any;

  rowEditar: any;
  conceptoDistribuciones: any;
  usoLocales: any;
  cuentaContables: any;
  cuentaCOLGAAP: string;
  cuentaNIIF: string;
  planCoberturas: any;
  numeroCOLGAAP: string;
  numeroNIIF: string;
  errorCobertura: boolean;

  data: any;
  dataAll: any;

  tipoTransacciones: any;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly store: Store<AppState>,
    private readonly translateService: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscription.push(this.activatedRoute.params.subscribe((params: any) => {
      this.codigoPlan = params.codigoPlan;
      this.backService.planes.getPlan(this.codigoPlan.toString()).subscribe(item => {
        this.plan = item;
      });
      this.obtener();
    }));
  }

  _onToggleStatus($event) {
    this.configuracion.gridListar.component.limpiar();

    if ($event.currentTarget.checked) {
      this.data = this.dataAll.filter(x => x.codigoEstado === '1');
    } else {
      this.data = this.dataAll.filter(x => x.codigoEstado === '0');
    }

    this.configuracion.gridListar.component.cargarDatos(
      this.asignarEstados(this.data), {
    });
  }

  nuevoRegistro() {
    this.esCrear = true;
    this._getDistribuciones();
  }

  _getDistribuciones(datos?: any) {
    this.mostrarModal = true;
    let _consultas = {
      _distribucion: this.backService.distribuciones.getDistribuciones({ estado: true }),
      _cuentaContable: this.backService.cuentaContable.getCuentasContables({ estado: true }),
      _usoLocal: this.backService.cuentaUsoLocal.getCuentaUsoLocales({ estado: true }),
      _planCoberturas: this.backService.planCobertura.getPlanesCoberturas({ 'mimPlan.codigo': this.codigoPlan, 'estado': true }),
      _tipoTransacciones: this.backService.tipoTransaccionCuentaContable.get({ estado: true })
    } as any;

    forkJoin(_consultas).subscribe((resp: any) => {
      this.conceptoDistribuciones = resp._distribucion.content;
      this.usoLocales = resp._usoLocal.content.map(item => ({ ...item, _nombre: item.codigo + ' - ' + item.nombre }));
      this.cuentaContables = resp._cuentaContable.content.map(item => ({ ...item, _nombre: item.numeroCuenta + ' - ' + item.nombreCuenta }));
      this.planCoberturas = resp._planCoberturas.content;
      this.tipoTransacciones = resp._tipoTransacciones._embedded.mimTransaccionCuentaContable;
      this._initForm(datos);
    });
  }

  _initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        conceptoDistribucion: new FormControl(param ? this._distribucionSelected(param.sipDistribuciones.codigo) : null, [Validators.required]),
        planCobertura: new FormControl(param ? this._planCoberturasSelected(param.codigoPlanCobertura) : null, [Validators.required]),
        usoLocal: new FormControl(param ? this._usoLocalSelected(param.mimCuentaUsoLocal.mimUsosLocal.codigo) : null, [Validators.required]),
        cuentaContable: new FormControl(param ? this._cuentaContableSelected(param.mimCuentaUsoLocal.mimCuenta.numeroCuenta) : null, [Validators.required]),
        cuentaTransaccion: new FormControl(param ? param.mimCuentaUsoLocal.cuentaTransaccion : null, [Validators.required, Validators.max(99999)]),
        partidaContrapartida: new FormControl(param ? param.sistema : null, [Validators.required, Validators.max(99999)]),
        tipoTransaccion: new FormControl(param ? this._tipoTransaccionSelected(param.transaccion) : null, [Validators.required]),
        vigente: new FormControl(param ? param.codigoEstado === '1' ? true : false : null)
      })
    );

    if (!this.esCrear) {
      this.form.controls.conceptoDistribucion.disable();
    }

    this._onchange();
  }

  _planCoberturasSelected(codigo: string) {
    return this.planCoberturas.find(item => item.codigo === parseInt(codigo));
  }

  _distribucionSelected(codigo: string) {
    return this.conceptoDistribuciones.find(item => item.codigo === parseInt(codigo));
  }

  _usoLocalSelected(codigo: string) {
    return this.usoLocales.find(item => item.codigo === parseInt(codigo));
  }

  _tipoTransaccionSelected(codigo: string) {
    return this.tipoTransacciones.find(item => item.codigo === parseInt(codigo));
  }

  _cuentaContableSelected(codigo: string) {
    const _cuentaSeleccionada = this.cuentaContables.find(item => item.numeroCuenta === parseInt(codigo));
    this.numeroCOLGAAP = _cuentaSeleccionada.numeroCOLGAAP;
    this.numeroNIIF = _cuentaSeleccionada.numeroNIIF;
    return _cuentaSeleccionada;
  }

  _onchange() {
    this.form.controls.cuentaContable.valueChanges.subscribe(item => {
      this.numeroCOLGAAP = item?.numeroCOLGAAP;
      this.numeroNIIF = item?.numeroNIIF;
    });
  }

  guardar() {
    if (this.form.invalid || this.errorCobertura) {
      this.validateForm(this.form);
      this.translateService.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });

      return;
    }
    const _form = this.form.getRawValue();
    const data = {
      sipDistribuciones: { codigo: _form.conceptoDistribucion.codigo },
      codigoPlanCobertura: _form.planCobertura.codigo,
      mimCuentaUsoLocal: {
        mimCuenta: { numeroCuenta: _form.cuentaContable.numeroCuenta },
        cuentaTransaccion: _form.cuentaTransaccion,
        mimUsosLocal: { codigo: _form.usoLocal.codigo },
        estado: this.esCrear ? true : _form.vigente
      },
      sistema: _form.partidaContrapartida,
      transaccion: _form.tipoTransaccion.codigo
    } as any;
    if (this.esCrear) {
      this.backService.relacionDistribucionCuenta.postRelacionDistribucionCuenta(data).subscribe(resp => {
        this._finGuardarActualizar();
        this._limpiar();
      }, err => {
        this.frontService.alert.info(err.error.message);
      });
    } else {
      data.codigoSipCuentaContable = this.rowEditar.codigoSipCuentasContables;
      this.backService.relacionDistribucionCuenta.putRelacionDistribucionCuenta(data).subscribe(resp => {
        this._finGuardarActualizar();
        this._limpiar();
      }, err => {
        this.frontService.alert.info(err.error.message);
      });
    }
  }

  _finGuardarActualizar() {
    this.translateService.get(this.esCrear ? 'global.guardadoExitosoMensaje' : 'global.actualizacionExitosaMensaje')
      .subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.form.reset();
          this.mostrarModal = false;
          this.obtener();
        });
      });
  }

  /**
   * Autor: Cesar Millan
   * Función: Obtiene el listado de los registros
   * @param pagina Número de páginas
   * @param tamanio Número de items por páginas
   */
  obtener(pagina = 0, tamanio = 10, sort = 'codigo,desc', estado = true) {

    this.backService.relacionDistribucionCuenta.getRelacionDistribucionCuentas({ page: pagina, size: tamanio, isPaged: true, estado: estado, sort: sort, 'mimPlanCobertura.mimPlan.codigo': this.codigoPlan })
      .subscribe((resp: any) => {
        this.configuracion.gridListar.component.limpiar();

        if (!resp || !resp.content || resp.content.length === 0) {
          return;
        }
        this.store.dispatch(actions.listarRelacionConceptosDistribuciónCuenta({ datos: resp.content }));
        this.dataAll = resp.content;

        this.dataAll = this.dataAll.map(obj => ({ ...obj, codigoEstado: '1' }));

        this.configuracion.gridListar.component.cargarDatos(
          this.asignarEstados(this.dataAll), {
          cantidadRegistros: this.dataAll.length
        });
      }, (err) => {
        this.frontService.alert.warning(err.error.message);
      });
  }

  /**
   * Autor: Cesar Millan
   * Función: Mentodo para formatear la descripcion del estado
   */
  asignarEstados(items: any) {
    const listObj = [];
    let x: any;
    for (x of items) {
      listObj.push({ ...x, _estado: x.codigoEstado === '1' ? 'Si' : 'No' });
    }
    return listObj;
  }

  /**
   * Autor: Cesar Millan
   * Funcion: Captura la accion de la grilla
   */
  _onClickCeldaElement(event) {
    this.rowEditar = event.dato;
    if (event.col.key === 'editar') {
      this.esCrear = false;
      this._getDistribuciones(event.dato);
    }
  }

  /**
   * Autor: Cesar Millan
   * Función: Acción para ir a la siguiente pagina de la grid
   */
  _onSiguiente(e: any) {
    this.pagina = e.pagina;
    this.obtener(this.pagina, e.tamano, 'codigo,desc', this.estado);
  }

  /**
   * Autor: Cesar Millan
   * Función: Acción para regresar a la página anterior de una grid
   */
  _onAtras(e: any) {
    this.pagina = e.pagina;
    this.obtener(this.pagina, e.tamano, 'codigo,desc', this.estado);
  }

  _obtenerDatosConEstados($event, estado: boolean) {
    this.estado = estado;
    this.obtener($event.pagina, $event.tamano, 'codigo,desc', this.estado ? true : false);
  }

  _ordenarRelacion(e: any) {
    this.obtener(e.pagina, e.tamano, 'codigo,desc', this.estado);
  }

  hasChanges() {
    return this.form && this.form.dirty;
  }

  _toggleModal() {
    if (this.hasChanges()) {
      this.frontService.alert.confirm(this.translateService.instant('global.onDeactivate')).then((respuesta: boolean) => {
        if (respuesta) {
          this._limpiar();
          this.mostrarModal = false;
        } else {
          this.mostrarModal = true;
        }
      });
    } else {
      this._limpiar();
      this.mostrarModal = false;
    }
  }

  _limpiar() {
    this.numeroCOLGAAP = null;
    this.numeroNIIF = null;
    this.form.reset();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(x => x.unsubscribe());
  }

  async _onClickExportarExcel() {

    const headers: string[] = [
      'Plan',
      'administracion.financiera.relacionConceptoDistribucionCuenta.grid.codigoConceptoDistribucion',
      'administracion.financiera.relacionConceptoDistribucionCuenta.grid.conceptoDistribucion',
      'administracion.financiera.relacionConceptoDistribucionCuenta.grid.cuentaContable',
      'administracion.financiera.relacionConceptoDistribucionCuenta.grid.nombreCuentaContable',
      'administracion.financiera.relacionConceptoDistribucionCuenta.grid.codigoUsoLocal',
      'administracion.financiera.relacionConceptoDistribucionCuenta.grid.nombreUsoLocal',
      'administracion.financiera.relacionConceptoDistribucionCuenta.cuentaTransaccion',
      'administracion.financiera.relacionConceptoDistribucionCuenta.partidaContrapartida',
      'administracion.financiera.relacionConceptoDistribucionCuenta.cuentaCOLGAAP',
      'administracion.financiera.relacionConceptoDistribucionCuenta.cuentaNIIF'
    ];

    const columnas: string[] = [
      'plan',
      'codigoConceptoDistribucion',
      'nombreConceptoDistribucion',
      'codigoCuenta',
      'nombreCuenta',
      'codigoUsoLocal',
      'nombreUsoLocal',
      'codigoCuentaTransaccion',
      'codigoSistema',
      'codigoColgaap',
      'codigoNiif',
    ];
    ObjectUtil.traducirObjeto(headers, this.translateService);

    this.backService.relacionDistribucionCuenta.getRelacionDistribucionCuentas({ 'mimPlanCobertura.mimPlan.codigo': this.codigoPlan, isPaged: false }).subscribe((resp: any) => {
      const datos: any = resp.content.map(x => {
        return {
          plan: this.plan.nombre,
          codigoConceptoDistribucion: x.sipDistribuciones.codigo,
          nombreConceptoDistribucion: x.sipDistribuciones.nombre,
          codigoCuenta: x.mimCuentaUsoLocal.mimCuenta.numeroCuenta,
          nombreCuenta: x.mimCuentaUsoLocal.mimCuenta.nombreCuenta,
          codigoUsoLocal: x.mimCuentaUsoLocal.mimUsosLocal.codigo,
          nombreUsoLocal: x.mimCuentaUsoLocal.mimUsosLocal.nombre,
          codigoCuentaTransaccion: x.mimCuentaUsoLocal.cuentaTransaccion,
          codigoSistema: x.sistema,
          codigoColgaap: x.mimCuentaUsoLocal.mimCuenta.numeroCOLGAAP,
          codigoNiif: x.mimCuentaUsoLocal.mimCuenta.numeroNIIF,
          ...x
        };
      });

      this.exportarExcel(
        `Relacion-concepto-distribucion-cuenta_${DateUtil.dateToString(new Date())}`, {
        headers,
        columnas,
        datos
      });
    });
  }

  private exportarExcel(nombre, datos: any = {}) {
    this.backService.utilidades.exportarExcel2(nombre, datos).subscribe(respuesta => {
      const body: any = respuesta.body;
      FileUtils.downloadXlsFile(body, nombre);
    });
  }
}
