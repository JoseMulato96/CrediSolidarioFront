import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BackFacadeService, FrontFacadeService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { UrlRoute } from '@shared/static/urls/url-route';
import { ListarCoberturasConfig } from './listar-coberturas.config';

@Component({
  selector: 'app-listar-coberturas',
  templateUrl: './listar-coberturas.component.html',
})
export class ListarCoberturasComponent implements OnInit {

  configuracion: ListarCoberturasConfig = new ListarCoberturasConfig();
  estado: any = '2,3';
  mostrarGuardar: boolean;
  form: FormGroup;
  isForm: Promise<any>;
  filtrosGrid: any;

  constructor(
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    this.filtrosGrid = [];
  }

  ngOnInit() {
    // do nothing
  }

  obtenerCoberturas(pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estados = '2,3,4') {
    const param: any = { page: pagina, size: tamanio, isPaged: true, sort: sort };
    if (this.estado) {
      param['mimEstadoCobertura.codigo'] = [2, 3];
    }

    if (this.filtrosGrid.length > 0) {
      this.filtrosGrid.map((x: any) => param[x.columna.keyFiltro] = x.valor);
    }

    this.backService.cobertura.obtenerCoberturas(param)
      .subscribe((_coberturas: any) => {
        this.configuracion.gridListarCoberturas.component.limpiar();

        if (!_coberturas || !_coberturas.content || _coberturas.content.length === 0) {
          return;
        }

        this.configuracion.gridListarCoberturas.component.cargarDatos(
          _coberturas.content, {
          maxPaginas: _coberturas.totalPages,
          pagina: _coberturas.number,
          cantidadRegistros: _coberturas.totalElements
        });
      }, (err) => {
        this.frontService.alert.warning(err.error.message);
      });
  }

  _onAtras(e: any) {
    this._obtenerDatosConEstados(e, this.estado);
  }

  _onSiguiente(e: any) {
    this._obtenerDatosConEstados(e, this.estado);
  }

  _onClickCeldaElement($event: any) {
    if ($event.col.key === 'editar') {
      this._alEditar($event.dato);
    } else {
      this._alEliminar($event.dato);
    }
  }

  _alEditar($event: any) {
    const cobertura = $event;
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_COBERTURAS,
      cobertura.codigo]);
  }

  irACrearCobertura() {
    return [UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_COBERTURAS_NUEVO];
  }

  _ordenar($event) {
    this._obtenerDatosConEstados($event, this.estado);
  }

  _onToggleStatus($event) {
    this._obtenerDatosConEstados($event, $event.currentTarget.checked);
  }

  _obtenerDatosConEstados($event, estado: boolean) {
    this.estado = estado;
    this.obtenerCoberturas($event.pagina, $event.tamano, $event.sort, this.estado ? '2,3' : '');
  }

  _alEliminar($event: any) {
    const cobertura = $event;
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_COBERTURAS,
      cobertura.codigo,
      UrlRoute.SOLICITUD_ELIMINACION
    ]);
  }

  eliminarCobertura(codigo: any) {
    this.backService.cobertura.actualizarEstadoCobertura(codigo, { estado: MIM_PARAMETROS.MIM_ESTADO_COBERTURA.INACTIVO }).subscribe((respuesta: any) => {
      this.translate.get('global.eliminadoExitosoMensaje').subscribe((mensaje: string) => {
        this.frontService.alert.success(mensaje);
      });

      this.obtenerCoberturas();
    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });
  }

  /* _toggleObservaciones(event?: any) {
    if(event){
      this._initForm(event);
    }else{
      this._initForm();
    }
    this.mostrarGuardar = !this.mostrarGuardar;
  } */

  /* _initForm(cobertura?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        codigo: new FormControl(cobertura ? cobertura.codigo : null),
        nombre: new FormControl(cobertura ? cobertura.nombre : null, [Validators.required]),
        observacion: new FormControl(cobertura ? cobertura.observacion : null, [Validators.required, Validators.maxLength(1000)]),
      }));

    this.form.controls.codigo.disable();
    this.form.controls.nombre.disable();

  } */

  _guardarObservacion() {
    const cobertura = {
      codigo: this.form.controls.codigo.value,
      nombre: this.form.controls.nombre.value,
      observacion: this.form.controls.observacion.value,
      estado: MIM_PARAMETROS.MIM_ESTADO_COBERTURA.OBSERVACION
    };

  }

  filtroHeader(event: any) {
    if (event.valor === '') {
      this.filtrosGrid = this.filtrosGrid.filter(x => x.columna !== event.columna);
    } else {
      if (this.filtrosGrid.find(item => item.columna === event.columna)) {
        this.filtrosGrid.find(x => x.columna === event.columna).valor = event.valor;
      } else {
        this.filtrosGrid.push(event);
      }
    }
    this.obtenerCoberturas();
  }

}
