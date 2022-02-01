import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BackFacadeService, FrontFacadeService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { FormValidate } from '@shared/util';
import { ConsultaRelacionMaestrosConfig } from './consulta-relacion-maestros.config';

@Component({
  selector: 'app-consulta-relacion-maestros',
  templateUrl: './consulta-relacion-maestros.component.html',
  styleUrls: ['./consulta-relacion-maestros.component.css']
})
export class ConsultaRelacionMaestrosComponent extends FormValidate implements OnInit {

  // Constantes para definir el maestro de la busqueda
  static CODIGO_FILTRO_CLIENTES = 1;
  static CODIGO_FILTRO_FONDOS = 2;
  static CODIGO_FILTRO_CONERTURAS = 3;
  static CODIGO_FILTRO_EXCLUCIONES = 4;

  static ESTADO_ACTIVO = 2;

  form: FormGroup; isForm: Promise<any>;
  descripciones: any[];
  descripcionesFilter: any[] = [];
  responseBrowser: any;
  responseBrowserFilter: any;
  listaGrid: any;
  estado = true;
  estadoLista: any;
  maestros = [
    {
      codigo: 1,
      nombre: 'Clientes'
    },
    {
      codigo: 3,
      nombre: 'Cobertura/PlanCobertura'
    },
    {
      codigo: 4,
      nombre: 'Exclusiones/PlanCobertura'
    },
    {
      codigo: 2,
      nombre: 'Fondos'
    }

  ];

  // Variables transversales para alimentar la info de la grilla
  fondo: any;
  codigo: any;
  nommbreMaestro: any;
  descripcion: any;
  planRelacionado: any;

  configuracion: ConsultaRelacionMaestrosConfig = new ConsultaRelacionMaestrosConfig();


  constructor(
    public formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super(); this.initFormGroup();
  }


  ngOnInit() {
    // do nothing
  }

  /**
   * Construccion del formulario
   * Bayron Andres Perez M.
   */
  private initFormGroup() {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        maestro: new FormControl(null, [Validators.required]),
        descripcion: new FormControl(null, [Validators.required]),
      }));
    this.onChangue();
  }

  onChangue() {
    this.form.controls.maestro.valueChanges.subscribe(async maestroSelect => {
      this.form.controls.descripcion.setValue(undefined);
      if (maestroSelect.codigo === ConsultaRelacionMaestrosComponent.CODIGO_FILTRO_CLIENTES) {
        const _condicions = await this.backService.cliente.obtenerClientes({
          'mimEstadoCliente.codigo': MIM_PARAMETROS.MIM_ESTADO_CLIENTE.ACTIVO,
          sort: 'nombre,asc',
          isSorted: true,
        }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
        this.descripciones = _condicions.content;
      }
      if (maestroSelect.codigo === ConsultaRelacionMaestrosComponent.CODIGO_FILTRO_FONDOS) {
        this.form.controls.descripcion.setValue(undefined);
        const _condicions = await this.backService.fondo.getFondos({
          'estado': true,
          sort: 'nombre,asc',
          isSorted: true,
        }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
        this.descripciones = _condicions.content;
      }
      if (maestroSelect.codigo === 100) {
        const _condicions = await this.backService.planCobertura.getPlanesCoberturas({
          'mimEstadoPlanCobertura.codigo': MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.ACTIVO
        }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
        const _descripciones = _condicions.content;
        _descripciones.forEach(element => {
          this.descripcionesFilter.push(element.mimCobertura);
        });
        this.descripciones = this.descripcionesFilter;
      }
      if (maestroSelect.codigo === ConsultaRelacionMaestrosComponent.CODIGO_FILTRO_CONERTURAS) {
        this.form.controls.descripcion.setValue(undefined);
        const _condicions = await this.backService.cobertura.obtenerCoberturas({
          'mimEstadoCobertura.codigo': MIM_PARAMETROS.MIM_ESTADO_COBERTURA.ACTIVO,
          sort: 'nombre,asc',
          isSorted: true,
        }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
        this.descripciones = _condicions.content;
      }
      if (maestroSelect.codigo === ConsultaRelacionMaestrosComponent.CODIGO_FILTRO_EXCLUCIONES) {
        this.form.controls.descripcion.setValue(undefined);
        const _condicions = await this.backService.exclusion.getExclusiones({
          'estado': true,
          sort: 'descripcion,asc',
          isSorted: false,
        }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
        this.descripciones = _condicions.content;
        this.descripciones = this._asignarGridExclucionesNombre(this.descripciones);
      }
    });
  }

  _onLimpiar() {
    this.router.navigate([this.router.url.split('?')[0]], {});
    this._limpiar();
  }

  _limpiar() {
    this.form.reset();
    this.initFormGroup();

    // Limpiamos el set de datos de la tabla.
    if (this.configuracion.gridConfig.component) {
      this.configuracion.gridConfig.component.limpiar();
    } else {
      this.configuracion.gridConfig.datos = [];
    }
  }

  private validarForm() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate
        .get('global.validateForm')
        .subscribe(texto => {
          this.frontService.alert.warning(texto);
        });
      return false;
    }
    return true;
  }

  /**
   * Metodo que genera la busqueda del formulario
   * Bayron Andres Perez
   */
  async _onBuscar(pagina = 0, tamanio = 10, estado = true) {
    if (!this.validarForm()) {
      return;
    }

    if (estado) {
      this.estadoLista = ConsultaRelacionMaestrosComponent.ESTADO_ACTIVO;
    } else {
      this.estadoLista = '';
    }
    if (this.form.controls.maestro.value.codigo === ConsultaRelacionMaestrosComponent.CODIGO_FILTRO_CLIENTES) {
      const _response = await this.backService.planes.getPlanes({
        'mimFondo.mimCliente.codigo': this.form.controls.descripcion.value.codigo,
        'mimEstadoPlan.codigo': this.estadoLista,
        page: pagina,
        size: tamanio,
      }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
      const _responseBrowserFilter = _response.content;
      this.responseBrowser = _response;
      let hash = {};
      const filter = _responseBrowserFilter.filter(o => hash[o.codigo] ? false : hash[o.codigo] = true);
      this.responseBrowserFilter = this._asignarGridCliente(filter);
    }
    if (this.form.controls.maestro.value.codigo === ConsultaRelacionMaestrosComponent.CODIGO_FILTRO_FONDOS) {
      const _response = await this.backService.planes.getPlanes({
        'mimFondo.codigo': this.form.controls.descripcion.value.codigo,
        'mimEstadoPlan.codigo': this.estadoLista,
        page: pagina,
        size: tamanio,
      }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
      const _responseBrowserFilter = _response.content;
      this.responseBrowser = _response;
      let hash = {};
      const filter = _responseBrowserFilter.filter(o => hash[o.codigo] ? false : hash[o.codigo] = true);
      this.responseBrowserFilter = this._asignarGridFondo(filter);
    }
    if (this.form.controls.maestro.value.codigo === ConsultaRelacionMaestrosComponent.CODIGO_FILTRO_CONERTURAS) {
      const _response = await this.backService.planCobertura.getPlanesCoberturas({
        'mimCobertura.codigo': this.form.controls.descripcion.value.codigo,
        'mimEstadoPlanCobertura.codigo': this.estadoLista,
        page: pagina,
        size: tamanio,
      }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
      const _responseBrowserFilter = _response.content;
      this.responseBrowser = _response;
      let hash = {};
      const filter = _responseBrowserFilter.filter(o => hash[o.mimPlan.codigo] ? false : hash[o.mimPlan.codigo] = true);
      this.responseBrowserFilter = this._asignarGridCobertura(filter);
    }
    if (this.form.controls.maestro.value.codigo === ConsultaRelacionMaestrosComponent.CODIGO_FILTRO_EXCLUCIONES) {
      const _response = await this.backService.exclusionPlanCobertura.getExclusionesPlanesCoberturas({
        'mimExclusion.codigo': this.form.controls.descripcion.value.codigo,
        'mimPlanCobertura.mimEstadoPlanCobertura.codigo': this.estadoLista,
        page: pagina,
        size: tamanio,
      }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
      const _responseBrowserFilter = _response.content;
      this.responseBrowser = _response;
      let hash = {};
      const filter = _responseBrowserFilter.filter(o => hash[o.mimPlanCobertura.mimPlan.codigo] ? false : hash[o.mimPlanCobertura.mimPlan.codigo] = true);
      this.responseBrowserFilter = this._asignarGridExcluciones(filter);
    }

    this.configuracion.gridConfig.component.limpiar();
    if (!this.responseBrowserFilter || !this.responseBrowserFilter.length) {
      const msg = 'administracion.protecciones.consultaRelacionMaestros.alertas.registrosNoEncontradosMaestroClientes';
      this.translate.get(msg).subscribe((response: string) => {
        this.frontService.alert.info(response);
      });
      return;
    }
    this.listaGrid = this.responseBrowserFilter;
    this.configuracion.gridConfig.component.cargarDatos(
      this.responseBrowserFilter,
      {
        // maxPaginas: this.responseBrowser.totalPages,
        pagina: 0,
        cantidadRegistros: this.responseBrowserFilter.length
      }
    );
  }

  _asignarGridCliente(items: any) {
    const listObj = [];
    let item: any;
    for (item of items) {
      listObj.push({
        ...item,
        _fondo: item.mimFondo.nombre,
        _codigo: item.mimFondo.mimCliente.codigo,
        _nombreMaestro: 'Clientes',
        _descripcion: item.mimFondo.mimCliente.nombre,
        _planRelacionado: item.nombre,
        _estado: item.mimEstadoPlan.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN.ACTIVO ? 'Si' : 'No'
      });
    }
    return listObj;
  }

  _asignarGridFondo(items: any) {
    const listObj = [];
    let item: any;
    for (item of items) {
      listObj.push({
        ...item,
        _fondo: item.mimFondo.nombre,
        _codigo: item.mimFondo.codigo,
        _nombreMaestro: 'Fondos',
        _descripcion: item.mimFondo.nombre,
        _planRelacionado: item.nombre,
        _estado: item.mimEstadoPlan.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN.ACTIVO ? 'Si' : 'No'
      });
    }
    return listObj;
  }

  _asignarGridCobertura(items: any) {
    const listObj = [];
    let item: any;
    for (item of items) {
      listObj.push({
        ...item,
        _fondo: item.mimPlan.mimFondo.nombre,
        _codigo: item.mimCobertura.codigo,
        _nombreMaestro: 'Cobertura/Plan cob',
        _descripcion: item.mimCobertura.nombre,
        _planRelacionado: item.mimPlan.nombre,
        _estado: item.mimEstadoPlanCobertura.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.ACTIVO ? 'Si' : 'No'
      });
    }
    return listObj;
  }

  _asignarGridExcluciones(items: any) {
    const listObj = [];
    let item: any;
    for (item of items) {
      listObj.push({
        ...item,
        _fondo: item.mimPlanCobertura.mimPlan.mimFondo.nombre,
        _codigo: item.mimExclusion.codigo,
        _nombreMaestro: 'Cobertura/Plan cob',
        _descripcion: item.mimExclusion.descripcion,
        _planRelacionado: item.mimPlanCobertura.mimPlan.nombre,
        _estado: item.mimPlanCobertura.mimEstadoPlanCobertura.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.ACTIVO ? 'Si' : 'No'
      });
    }
    return listObj;
  }

  _asignarGridExclucionesNombre(items: any) {
    const listObj = [];
    let item: any;
    for (item of items) {
      listObj.push({
        ...item,
        nombre: item.descripcion

      });
    }
    return listObj;
  }

  _onToggleStatus($event) {

    if (this.form.controls.maestro.value === null || this.form.controls.descripcion.value === null) {
      const msg = 'administracion.protecciones.consultaRelacionMaestros.alertas.checkSinCampos';
      this.translate.get(msg).subscribe((response: string) => {
        this.frontService.alert.info(response);
      });
      return;
    }
    this._obtenerDatosConEstados($event, $event.currentTarget.checked);
  }

  _obtenerDatosConEstados($event, estado: boolean) {
    this.estado = estado;
    this._onBuscar($event.pagina, $event.tamano, this.estado ? true : false);
  }

  onClickLink($event: any) {
    // do nothing
  }

  onSiguiente(e: any) {
    this._obtenerDatosConEstados(e, this.estado);
  }

  onAtras(e: any) {
    this._obtenerDatosConEstados(e, this.estado);
  }

}
