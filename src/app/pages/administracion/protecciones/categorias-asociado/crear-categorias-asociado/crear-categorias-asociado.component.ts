import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router, ActivatedRoute } from '@angular/router';
import { FormValidate, CustomValidators } from '@shared/util';
import { Observable } from 'rxjs/internal/Observable';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormComponent } from '@core/guards';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { DateUtil } from '@shared/util/date.util';
import { BackFacadeService, FrontFacadeService } from '@core/services';

@Component({
  selector: 'app-crear-categorias-asociado',
  templateUrl: './crear-categorias-asociado.component.html',
})
export class CrearCategoriasAsociadoComponent extends FormValidate implements OnInit, FormComponent {

  _esCreacion: boolean;
  form: FormGroup;
  isForm: Promise<any>;

  codigoCategoriaAsociado: any;
  _codigoCategoriasAsociadoSubscription: Subscription;
  clientes: any[];
  categoriaAsociado: any;

  estadoFecha: boolean;
  vigenciaFechasAMantenerSeleccionadas: Date[];


  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService) {
    super();
  }

  ngOnInit() {

    this._codigoCategoriasAsociadoSubscription = this.activatedRoute.params.subscribe((params: any) => {
      this.codigoCategoriaAsociado = params['codigo'];

      this.backService.cliente.obtenerClientes({ 'mimEstadoCliente.codigo': MIM_PARAMETROS.MIM_ESTADO_CLIENTE.ACTIVO, isSorted: true, sort: 'nombre,asc', isPaged: true, size: 1000000 }).subscribe((_Clientes: any) => {
        this.clientes = _Clientes.content;
        if (this.codigoCategoriaAsociado) {
          this.backService.categoriasAsociado.obtenerCategoriaAsociado(this.codigoCategoriaAsociado)
            .subscribe((categoriaAsociado: any) => {
              this.categoriaAsociado = categoriaAsociado;
              this._esCreacion = false;
              this._initForm(this.categoriaAsociado);
            }, (err) => {
              this.frontService.alert.error(err.error.message);
            });
        } else {
          this._esCreacion = true;
          this._initForm();
        }

      });

    });
  }

  _initForm(categoriaAsociado?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        codigoCategoriaAsociado: new FormControl(categoriaAsociado ? categoriaAsociado.codigo : null, [Validators.required, Validators.min(1)]),
        cliente: new FormControl(categoriaAsociado ? this.clienteSelected(categoriaAsociado.mimCliente.codigo) : null, [Validators.required]),
        nombre: new FormControl(categoriaAsociado ? categoriaAsociado.nombre : null, [Validators. required, Validators.maxLength(30), CustomValidators.vacio]),
        fechaInicioFechaFin: new FormControl(categoriaAsociado ? this.rangoFechaSelected(categoriaAsociado.fechaInicio, categoriaAsociado.fechaFin) : null, [Validators.required])
      }, {
       // validators: [CustomValidators.Vacio]
      }));

    // El codigo cliente siempre debera estar deshabilitado.
    if (!this._esCreacion) {

      this.vigenciaFechasAMantenerSeleccionadas = [DateUtil.stringToDate(categoriaAsociado ? categoriaAsociado.fechaInicio : null)];
      this.estadoFecha = categoriaAsociado && !categoriaAsociado.estado;
      if (categoriaAsociado && !categoriaAsociado.estado) {
        this.form.disable();
      }

      if (categoriaAsociado && !categoriaAsociado.estado) {
        this.form.disable();
        this.estadoFecha = !categoriaAsociado.estado;
      }

      this.form.controls.codigoCategoriaAsociado.disable();
      this.form.controls.cliente.disable();
    }
  }

  _alGuardar() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((validateForm: string) => {
        this.frontService.alert.warning(validateForm);
      });
      return;
    }
    if (this._esCreacion) {
      this._crearCategoriaAsociado();
    } else {
      this._actualizarCategoriaAsociado();
    }
  }

  _crearCategoriaAsociado() {
    const form: any = this.form.value;
    const categoriaAsociado = {
      codigo: form.codigoCategoriaAsociado,
      nombre: form.nombre,
      estado: true,
      mimCliente: { codigo: form.cliente.codigo },
      fechaInicio: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy'),
      fechaFin: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy')
    };

    this.backService.categoriasAsociado.guardarCategoriasAsociado(categoriaAsociado)
      .subscribe((_categoriaAsociado: any) => {
        this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
          this.frontService.alert.success(text).then(() => {
            this.form.reset();
            this._initForm();
            // Redireccionamos a la pantalla de listar.
            this._irCategoriasAsociado();
          });
        });
      }, (err) => {
        this.frontService.alert.error(err.error.message);
      });
  }

  _actualizarCategoriaAsociado() {
    const form: any = this.form.getRawValue();
    const categoriaAsociado = {
      codigo: this.codigoCategoriaAsociado,
      nombre: form.nombre,
      estado: this.categoriaAsociado.estado,
      mimCliente: { codigo: form.cliente.codigo },
      fechaInicio: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy'),
      fechaFin: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy')
    };

    this.backService.categoriasAsociado.actualizarCategoriaAsociado(categoriaAsociado).subscribe((_categoriaAsociado: any) => {
      this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.form.reset();
          this._initForm();
          // Redireccionamos a la pantalla de listar.
          this._irCategoriasAsociado();
        });
      });

    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  rangoFechaSelected(fechaIni: any, fechaFin: any) {
    return [DateUtil.stringToDate(fechaIni), DateUtil.stringToDate(fechaFin)];
  }

  _irCategoriasAsociado() {
    this.router.navigate([UrlRoute.PAGES, UrlRoute.ADMINISTRACION, UrlRoute.ADMINSTRACION_PROTECCIONES, UrlRoute.ADMINISTRACION_PROTECCIONES_CATEGORIAS_ASOCIADO]);
  }

  clienteSelected(codigo) {
    if (!this._esCreacion && !this.clientes.find(cliente => cliente.codigo === codigo)) {
      this.clientes.push(this.categoriaAsociado.mimCliente);
    }
    return this.clientes.find(cliente => cliente.codigo === codigo);
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }
}
