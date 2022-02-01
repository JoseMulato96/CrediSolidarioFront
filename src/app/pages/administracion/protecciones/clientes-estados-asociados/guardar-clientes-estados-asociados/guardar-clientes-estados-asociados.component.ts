import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormValidate, CustomValidators } from '@shared/util';
import { Observable } from 'rxjs/internal/Observable';
import { FormComponent } from '@core/guards';
import { DateUtil } from '@shared/util/date.util';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { BackFacadeService, FrontFacadeService } from '@core/services';

@Component({
  selector: 'app-guardar-clientes-estados-asociados',
  templateUrl: './guardar-clientes-estados-asociados.component.html',
})
export class GuardarClientesEstadosAsociadosComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  form: FormGroup;
  isForm: Promise<any>;

  _esCreacion = true;
  subscription: Subscription = new Subscription();
  codigoEstasoAsociado: any;
  estasoAsociado: any;
  estadoFecha: boolean;
  clientes: any[];

  vigenciaFechasAMantenerSeleccionadas: Date[];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
  }

  ngOnInit() {
    this.subscription = this.activatedRoute.params.subscribe((params: any) => {
      this.codigoEstasoAsociado = params['codigo'];

      forkJoin([
        this.backService.cliente.obtenerClientes({ 'mimEstadoCliente.codigo': MIM_PARAMETROS.MIM_ESTADO_CLIENTE.ACTIVO, isPaged: true, sort: 'nombre,asc', 'size': 1000000  })
      ]).subscribe(([
        _listaClientes
      ]) => {
        this.clientes = _listaClientes['content'];
        if (this.codigoEstasoAsociado) {
          this.backService.estadoAsociado.getEstadosAsociado(this.codigoEstasoAsociado)
            .subscribe((resp: any) => {
              this.estasoAsociado = resp;
              if (!this.itemSelected(resp.mimCliente.codigo)) {
                this.clientes.push(resp.mimCliente);
              }
              this._esCreacion = false;
              this._initForm(this.estasoAsociado);
            }, (err) => {
              this.frontService.alert.warning(err.error.message);
            });
        } else {
          this._esCreacion = true;
          this._initForm();
        }
      }, (err: any) => {
        this.frontService.alert.warning(err.error.message);
        this._irListaEstadosAsociados();
      });

    });
  }

  /**
   * Autor: Cesar Millan
   * Función: Inicializa el formulario
   * @param param
   */
  _initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        cliente: new FormControl(param ? this.itemSelected(param.mimCliente.codigo) : null, [Validators.required]),
        codigoEstadoAsociado: new FormControl(param ? param.codigoEstado : null, [Validators.required, Validators.min(1), Validators.max(99)]),
        nombreEstadoAsociado: new FormControl(param ? param.nombre : null, [Validators.required, CustomValidators.vacio]),
        fechaInicioFechaFin: new FormControl(param ? this.rangoFechaSelected(param.fechaInicio, param.fechaFin) : null, [Validators.required])
      }));

    if (!this._esCreacion) {

      this.vigenciaFechasAMantenerSeleccionadas = [DateUtil.stringToDate(param ? param.fechaInicio : null)];
      this.estadoFecha = param && !param.estado;
      if (param && !param.estado) {
        this.form.disable();
      }

      if (param && !param.estado) {
        this.form.disable();
        this.estadoFecha = !param.estado;
      }

      this.form.controls.cliente.disable();
      this.form.controls.codigoEstadoAsociado.disable();
      this.estadoFecha = param && !param.estado;
      if (param && !param.estado) {
        this.form.disable();
      }
    }
  }

  /**
   * Autor: Cesar Millan
   * Función: Devuelve el item de datos del cliente
   * @param codigo Codigo del cliente
   */
  itemSelected(codigo: string) {
    return this.clientes.find(x => x.codigo === codigo);
  }

  rangoFechaSelected(fechaIni: any, fechaFin: any) {
    return [DateUtil.stringToDate(fechaIni), DateUtil.stringToDate(fechaFin)];
  }
  /**
   * Autor: Cesar Millan
   * Función: Retorna a la pantalla de listar los fondos
   */
  _irListaEstadosAsociados() {
    this.router.navigate([UrlRoute.PAGES, UrlRoute.ADMINISTRACION, UrlRoute.ADMINSTRACION_PROTECCIONES, UrlRoute.ADMINISTRACION_PROTECCIONES_CLIENTE_ESTADO_ASOCIADO]);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Autor: Cesar Millan
   * Función: De acuerdo a la acción disparada ejecuta el proceso de crear o eliminar
   */
  _alGuardar() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((validateForm: string) => {
        this.frontService.alert.warning(validateForm);
      });
      return;
    }
    if (this._esCreacion) {
      this._crearClientesEstadosAsociados();
    } else {
      this._actualizarClientesEstadosAsociados();
    }
  }

  /**
   * Autor: Cesar Millan
   * Función: Crea un item
   */
  _crearClientesEstadosAsociados() {
    const form: any = this.form.value;
    const estadoAsociado = {
      codigoEstado: form.codigoEstadoAsociado,
      nombre: form.nombreEstadoAsociado,
      fechaInicio: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy'),
      fechaFin: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy'),
      estado: true,
      mimCliente: { codigo: form.cliente.codigo }
    };

    this.backService.estadoAsociado.postEstadoAsociado(estadoAsociado).subscribe((resp: any) => {

      this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.form.reset();
          this._initForm();
          // Redireccionamos a la pantalla de listar.
          this._irListaEstadosAsociados();
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  /**
   * Autor: Cesar Millan
   * Función: Modifica la información del item seleccionado
   */
  _actualizarClientesEstadosAsociados() {
    const form: any = this.form.getRawValue();
    const estadoAsociado = {
      codigoEstado: form.codigoEstadoAsociado,
      nombre: form.nombreEstadoAsociado,
      fechaInicio: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy'),
      fechaFin: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy'),
      estado: this.estasoAsociado.estado, // form.vigente,
      mimCliente: { codigo: form.cliente.codigo }
    };

    this.backService.estadoAsociado.putEstadoAsociado(this.codigoEstasoAsociado, estadoAsociado).subscribe((resp: any) => {

      this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.form.reset();
          this._initForm();
          // Redireccionamos a la pantalla de listar.
          this._irListaEstadosAsociados();
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }

}
