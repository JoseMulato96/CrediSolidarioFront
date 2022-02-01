import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BackFacadeService, FrontFacadeService } from '@core/services';
import { AppState } from '@core/store/reducers';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { FormValidate } from '@shared/util';
import { DateUtil } from '@shared/util/date.util';
import { FileUtils } from '@shared/util/file.util';
import { ObjectUtil } from '@shared/util/object.util';
import { Subscription } from 'rxjs';
import * as actions from '../configuracion.actions';
import { MaestroUsoLocalConfig } from './maestro-uso-local.config';

@Component({
  selector: 'app-maestro-uso-local',
  templateUrl: './maestro-uso-local.component.html',
})
export class MaestroUsoLocalComponent extends FormValidate implements OnInit {
  configuracion: MaestroUsoLocalConfig = new MaestroUsoLocalConfig();
  mostrarModal: boolean;
  isForm: Promise<any>;
  form: FormGroup;
  esCrear: boolean;
  tituloModal: string;
  estado = true;
  pagina: number;

  subscription: Subscription = new Subscription();
  // codigoPlan: number;
  listData: any;

  rowEditar: any;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly translateService: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService,
    private readonly store: Store<AppState>
  ) {
    super();
  }

  ngOnInit() {
    //do nothing
  }

  _onToggleStatus($event) {
    this._obtenerDatosConEstados($event, $event.currentTarget.checked);
  }

  nuevoRegistro() {
    this.mostrarModal = true;
    this.esCrear = true;
    this._initForm();
    this.translateService.get('administracion.financiera.maestroUsoLocal.modal.tituloCrear')
      .subscribe(text => this.tituloModal = text);
  }

  _initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        codigo: new FormControl(param ? param.codigo : null, [Validators.required, Validators.max(2147483647)]),
        nombreUsoLocal: new FormControl(param ? param.nombre : null, [Validators.required, Validators.maxLength(256)]),
        vigente: new FormControl(param ? param.estado : null)
      })
    );

    if (!this.esCrear) {
      this.form.controls.codigo.disable();
    }
  }

  guardar() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translateService.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });

      return;
    }
    const _form = this.form.getRawValue();
    const data = {
      codigo: _form.codigo,
      nombre: _form.nombreUsoLocal,
      estado: this.esCrear ? true : _form.vigente
    } as any;
    if (this.esCrear) {
      this.backService.cuentaUsoLocal.postCuentaUsoLocal(data).subscribe(resp => {
        this._finGuardarActualizar();
      }, (err) => {
        this.frontService.alert.warning(err.error.message);
      });
    } else {
      data.codigo = this.rowEditar.codigo;
      this.backService.cuentaUsoLocal.putCuentaUsoLocal(data.codigo, data).subscribe(resp => {
        this._finGuardarActualizar();
      }, (err) => {
        this.frontService.alert.warning(err.error.message);
      });
    }
  }

  _finGuardarActualizar() {
    this.translateService.get(this.esCrear ? 'global.guardadoExitosoMensaje' : 'global.actualizacionExitosaMensaje')
      .subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.form.reset();
          this.mostrarModal = false;
          this.obtener(this.pagina, 10, this.estado);
        });
      });
  }

  /**
   * Autor: Cesar Millan
   * Función: Obtiene el listado de los registros
   * @param pagina Número de páginas
   * @param tamanio Número de items por páginas
   */
  obtener(pagina = 0, tamanio = 10, estado = true) {
    const params: any = { page: pagina, size: tamanio, isPaged: true };
    if (estado) {
      params.estado = estado;
    }

    this.backService.cuentaUsoLocal.getCuentaUsoLocales(params)
      .subscribe((resp: any) => {
        this.configuracion.gridListar.component.limpiar();

        if (!resp || !resp.content || resp.content.length === 0) {
          return;
        }
        this.store.dispatch(actions.listarMaestroUsoLocal({ datos: resp.content }));
        this.configuracion.gridListar.component.cargarDatos(
          this.asignarEstados(resp.content), {
          maxPaginas: resp.totalPages,
          pagina: resp.number,
          cantidadRegistros: resp.totalElements
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
      listObj.push({ ...x, _estado: x.estado ? 'Si' : 'No' });
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
      this.translateService.get('administracion.financiera.maestroUsoLocal.modal.tituloEditar')
        .subscribe(text => {
          this.tituloModal = text;
          this._initForm(event.dato);
          this.mostrarModal = true;
        });

    }
  }

  /**
   * Autor: Cesar Millan
   * Función: Acción para ir a la siguiente pagina de la grid
   */
  _onSiguiente(e: any) {
    this.pagina = e.pagina;
    this.obtener(this.pagina, e.tamano, this.estado);
  }

  /**
   * Autor: Cesar Millan
   * Función: Acción para regresar a la página anterior de una grid
   */
  _onAtras(e: any) {
    this.pagina = e.pagina;
    this.obtener(this.pagina, e.tamano, this.estado);
  }

  _obtenerDatosConEstados($event, estado: boolean) {
    this.estado = estado;
    this.obtener($event.pagina, $event.tamano, this.estado ? true : false);
  }

  _ordenarUsoLocal(e: any) {
    this.obtener(e.pagina, e.tamano, this.estado);
  }

  hasChanges() {
    return this.form && this.form.dirty;
  }

  _toggleModal() {
    if (this.hasChanges()) {
      this.frontService.alert.confirm(this.translateService.instant('global.onDeactivate')).then((respuesta: boolean) => {
        if (respuesta) {
          this.mostrarModal = false;
        } else {
          this.mostrarModal = true;
        }
      });
    } else {
      this.mostrarModal = false;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async _onClickExportarExcel() {

    const headers: string[] = [
      'administracion.financiera.maestroUsoLocal.grid.codigo',
      'administracion.financiera.maestroUsoLocal.grid.nombreUsoLocal',
      'administracion.financiera.maestroUsoLocal.grid.vigente'
    ];

    const columnas: string[] = [
      'codigoCuenta',
      'nombre',
      'estado'
    ];
    ObjectUtil.traducirObjeto(headers, this.translateService);

    this.backService.cuentaUsoLocal.getCuentaUsoLocales({ isPaged: false }).subscribe((resp: any) => {
      const datos: any = resp.content.map(x =>
      ({
        codigoCuenta: x.codigo,
        nombre: x.nombre,
        estado: x.estado ? 'Si' : 'No'
      }));

      this.exportarExcel(
        `maestros_uso_local_${DateUtil.dateToString(new Date())}`, {
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
