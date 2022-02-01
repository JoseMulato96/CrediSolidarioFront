import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BackFacadeService, FrontFacadeService } from '@core/services';
import { AppState } from '@core/store/reducers';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { FormValidate } from '@shared/util';
import { Subscription } from 'rxjs';
import * as accion from '../configuracion.actions';
import { ConceptosDistribucionConfig } from './conceptos-distribucion.config';

@Component({
  selector: 'app-conceptos-distribucion',
  templateUrl: './conceptos-distribucion.component.html',
})
export class ConceptosDistribucionComponent extends FormValidate implements OnInit, OnDestroy {

  configuracion: ConceptosDistribucionConfig = new ConceptosDistribucionConfig();
  mostrarModal: boolean;
  isForm: Promise<any>;
  form: FormGroup;
  esCrear: boolean;
  tituloModal: string;
  estado = true;
  pagina: number;

  subscription: Subscription = new Subscription();
  codigoPlan: number;
  listData: any;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly store: Store<AppState>,
    private readonly translateService: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
    this.pagina = 0;
  }

  ngOnInit(): void {
    this.subscription = this.activatedRoute.params.subscribe((params: any) => {
      this.codigoPlan = params.codigoPlan;
    });
  }

  _onToggleStatus($event) {
    this._obtenerDatosConEstados($event, $event.currentTarget.checked);
  }

  nuevoRegistro() {
    this.mostrarModal = true;
    this.esCrear = true;
    this._initForm();
    this.translateService.get('administracion.actuaria.conceptosDistribucion.modal.tituloCrear')
      .subscribe(text => this.tituloModal = text);
  }

  _initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        codigo: new FormControl(param ? param.codigo : null),
        descripcion: new FormControl(param ? param.nombre : null, [Validators.required]),
        nombreCorto: new FormControl(param ? param.nombreCorto : null, [Validators.required]),
        vigente: new FormControl(param ? param.estado : null)
      })
    );

    if (!this.esCrear) {
      this.form.controls.codigo.disable();
      this.form.controls.nombreCorto.disable();
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
      nombre: _form.descripcion,
      nombreCorto: _form.nombreCorto,
      estado: this.esCrear ? true : _form.vigente,
      codigoPlan: this.codigoPlan
    } as any;
    if (this.esCrear) {
      this.backService.distribuciones.postDistribuciones(data).subscribe(resp => {
        this._finGuardarActualizar();
      });
    } else {
      data.codigo = _form.codigo;
      this.backService.distribuciones.putDistribuciones(data.codigo, data).subscribe(resp => {
        this._finGuardarActualizar();
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

    this.backService.distribuciones.getDistribuciones(params)
      .subscribe((resp: any) => {
        this.configuracion.gridListar.component.limpiar();

        if (!resp || !resp.content || resp.content.length === 0) {
          return;
        }
        const _estadoCard = this.backService.actuaria.getEstadosCard();
        this.backService.actuaria.setEstadosCard({ ..._estadoCard, distribuciones: true });
        this.store.dispatch(accion.listarConceptoDistribucion({ datos: this.asignarEstados(resp.content) }));
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
    if (event.col.key === 'editar') {
      this.esCrear = false;
      this.translateService.get('administracion.actuaria.conceptosDistribucion.modal.tituloEditar')
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

  _ordenar(e: any) {
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

}

