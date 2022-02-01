import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { FormValidate, CustomValidators } from '@shared/util';
import { Observable } from 'rxjs/internal/Observable';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormComponent } from '@core/guards';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { BackFacadeService, FrontFacadeService } from '@core/services';

@Component({
  selector: 'app-guardar-fondos',
  templateUrl: './guardar-fondos.component.html',
})
export class GuardarFondosComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  form: FormGroup;
  isForm: Promise<any>;

  _esCreacion = true;
  subscription: Subscription = new Subscription();
  codigoFondo: any;
  fondo: any;

  clientes: any[];

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
      this.codigoFondo = params['codigo'];

      forkJoin([
        this.backService.cliente.obtenerClientes({ 'mimEstadoCliente.codigo': MIM_PARAMETROS.MIM_ESTADO_CLIENTE.ACTIVO, isPaged: true, sort: 'nombre,asc', 'size': 1000000  })
      ]).subscribe(([
        _listaClientes
      ]) => {
        this.clientes = _listaClientes['content'];
        if (this.codigoFondo) {
          this.backService.fondo.getFondo(this.codigoFondo)
            .subscribe((resp: any) => {
              this.fondo = resp;
              if (!this.clienteSelected(this.fondo.mimCliente.codigo)) {
                this.clientes.push(this.fondo.mimCliente);
              }
              this._esCreacion = false;
              this._initForm(this.fondo);
            }, (err) => {
              this.frontService.alert.warning(err.error.message);
            });
        } else {
          this._esCreacion = true;
          this._initForm();
        }
      }, (err: any) => {
        this.frontService.alert.warning(err.error.message);
        this._irListaFondos();
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
        codigoFondo: new FormControl(param ? param.codigo : null),
        nombreFondo: new FormControl(param ? param.nombre : null, [Validators.required, CustomValidators.vacio]),
        cliente: new FormControl(param ? this.clienteSelected(param.mimCliente.codigo) : null, [Validators.required])
      }));

    if (!this._esCreacion) {
      if (param && !param.estado) {
        this.form.disable();
      }
      this.form.controls.codigoFondo.disable();
    }

    // Si el estado del fondo es no disponible se inhabilitan los campos
    if (param) {
      if (param.estado === false) {
        this.form.controls.nombreFondo.disable();
        this.form.controls.cliente.disable();
      }
    }
  }

  /**
   * Autor: Cesar Millan
   * Función: Devuelve el item de datos del cliente
   * @param codigo Codigo del cliente
   */
  clienteSelected(codigo: string) {
    return this.clientes.find(cliente => cliente.codigo === codigo);
  }

  /**
   * Autor: Cesar Millan
   * Función: Devuelve el item de datos del estado del fondo
   * @param codigo Codigo del estado del fondo
   */
  /* estadoFondoSelected(codigo: string) {
    return this.estadoFondo.find(estadoFondo => estadoFondo.codigo === codigo);
  } */

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
      this._crearFondo();
    } else {
      this._actualizarFondo();
    }
  }

  /**
   * Autor: Cesar Millan
   * Función: Crea un fondo
   */
  _crearFondo() {
    const form: any = this.form.value;
    const fondo = {
      nombre: form.nombreFondo,
      mimCliente: { codigo: form.cliente.codigo },
      estado: true
    };

    this.backService.fondo.postFondo(fondo).subscribe((resp: any) => {
      this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.form.reset();
          this._initForm();
          // Redireccionamos a la pantalla de listar.
          this._irListaFondos();
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  /**
   * Autor: Cesar Millan
   * Función: Modifica la información del fondo
   */
  _actualizarFondo() {
    const form: any = this.form.value;
    const fondo = {
      codigo: this.codigoFondo,
      nombre: form.nombreFondo,
      mimCliente: { codigo: form.cliente.codigo },
      estado: this.fondo.estado
    };
    this.backService.fondo.putFondo(this.codigoFondo, fondo).subscribe((resp: any) => {
      this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.form.reset();
          this._initForm();
          // Redireccionamos a la pantalla de listar.
          this._irListaFondos();
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  /**
   * Autor: Cesar Millan
   * Función: Retorna a la pantalla de listar los fondos
   */
  _irListaFondos() {
    this.router.navigate([UrlRoute.PAGES, UrlRoute.ADMINISTRACION, UrlRoute.ADMINSTRACION_PROTECCIONES, UrlRoute.ADMINISTRACION_PROTECCIONES_FONDOS]);
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }
}
