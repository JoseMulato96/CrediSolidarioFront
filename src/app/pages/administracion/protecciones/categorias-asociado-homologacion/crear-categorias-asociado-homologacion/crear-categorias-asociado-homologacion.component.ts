import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { FormValidate, CustomValidators } from '@shared/util';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormComponent } from '@core/guards';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { DateUtil } from '@shared/util/date.util';
import { masksPatterns } from '@shared/util/masks.util';
import { SIP_PARAMETROS_TIPO } from '@shared/static/constantes/sip-parametros-tipo';
import { minMaxValidator} from '@shared/directives/min-max-validator.directive';
import { BackFacadeService, FrontFacadeService } from '@core/services';

@Component({
  selector: 'app-crear-categorias-asociado-homologacion',
  templateUrl: './crear-categorias-asociado-homologacion.component.html',
})
export class CrearCategoriasAsociadoHomologacionComponent extends FormValidate implements OnInit, FormComponent {

  _esCreacion: boolean;
  form: FormGroup;
  isForm: Promise<any>;

  tiposClientes: any[];
  tiposDocumentos: any[];
  codigoCategoriaAsociadoHomologado: any;
  _codigoCategoriasAsociadoSubscription: Subscription;
  categoriaAsociadoHomologacion: any;
  clientes: any[];
  categorias: any[];
  unidadesIngresos: any[];
  estadoFecha: boolean;
  patterns = masksPatterns;

  vigenciaFechasAMantenerSeleccionadas: Date[];

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
  }

  ngOnInit() {
    this._codigoCategoriasAsociadoSubscription = this.activatedRoute.params.subscribe((params: any) => {

      this.codigoCategoriaAsociadoHomologado = params['codigo'];
      forkJoin([
        this.backService.cliente.obtenerClientes({ 'mimEstadoCliente.codigo': MIM_PARAMETROS.MIM_ESTADO_CLIENTE.ACTIVO, isPaged: true, sort: 'nombre,asc' }),
        this.backService.tipoReconocido.getTipoReconocidos({sort: 'nombre,asc'})
      ]).subscribe(([
        _listaCliente,
        _listaTipoReconocidos
      ]) => {
        this.clientes = _listaCliente['content'];
        this.unidadesIngresos = _listaTipoReconocidos._embedded.mimTipoReconocido;
        if (this.codigoCategoriaAsociadoHomologado) {
          this.backService.categoriaAsociadoHomologacion.obtenerHomologacion(this.codigoCategoriaAsociadoHomologado).subscribe((categoriaAsociadoHomologacion: any) => {
            this.categoriaAsociadoHomologacion = categoriaAsociadoHomologacion;
            if (!this.clienteSelected(this.categoriaAsociadoHomologacion.sipCategoriaAsociado.mimCliente.codigo)) {
              this.clientes.push(this.categoriaAsociadoHomologacion.sipCategoriaAsociado.mimCliente);
            }
            this._esCreacion = false;
            this.obtenerCategoriasPorCliente(this.categoriaAsociadoHomologacion.sipCategoriaAsociado.mimCliente.codigo);

          });
        } else {
          this._esCreacion = true;
          this._initForm();
        }
      }, (err: any) => {
        this._irListaHomologacion();
      });

    });
  }

  _initForm(homologacion?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        codigoCategoriaAsociado: new FormControl(homologacion ? homologacion.codigo : null),
        cliente: new FormControl(homologacion ? this.clienteSelected(homologacion.sipCategoriaAsociado.mimCliente.codigo) : null, [Validators.required]),
        categoriaAsociado: new FormControl(homologacion ? this.categoriaSelected(homologacion.sipCategoriaAsociado.codigo) : null, [Validators.required]),
        codigoCategoriaCliente: new FormControl(homologacion ? homologacion.tipoVincuBuc : null, [Validators.required, Validators.max(99999)]),
        nombreCategoriaCliente: new FormControl(homologacion ? homologacion.nombre : null, [Validators.required, Validators.maxLength(256), CustomValidators.vacio]),
        edadMinima: new FormControl(homologacion ? homologacion.edadMinima : null, [Validators.max(100), Validators.min(0)]),
        edadMaxima: new FormControl(homologacion ? homologacion.edadMaxima : null, [Validators.max(100), Validators.min(0)]),
        ingresosMinimos: new FormControl(homologacion ? homologacion.ingresoMinimo : null, [Validators.maxLength(15), CustomValidators.minNumberText(0)]),
        ingresosMaximos: new FormControl(homologacion ? homologacion.ingresoMaximo : null, [Validators.maxLength(15), CustomValidators.minNumberText(0)]),
        unidadIngresos: new FormControl(homologacion ? homologacion.mimTipoReconocido ? this.unidadIngresoSelected(homologacion.mimTipoReconocido.codigo) : null : null),
        tituloAcademico: new FormControl(homologacion ? homologacion.tituloAcademico : false),
        fechaInicioFechaFin: new FormControl(homologacion ? this.rangoFechaSelected(homologacion.fechaInicio, homologacion.fechaFin) : null, [Validators.required])
      }, {
        validators: [
          minMaxValidator('ingresosMinimos', 'ingresosMaximos' ),
          minMaxValidator('edadMinima', 'edadMaxima'),
        ]
      }));

    if (!this._esCreacion) {
      if (homologacion && !homologacion.estado) {
        this.form.disable();
        this.estadoFecha = !homologacion.estado;
      }
      this.form.controls.codigoCategoriaAsociado.disable();
      this.form.controls.categoriaAsociado.disable();
      this.form.controls.cliente.disable();

      this.vigenciaFechasAMantenerSeleccionadas = [DateUtil.stringToDate(homologacion ? homologacion.fechaInicio : null)];
      this.estadoFecha = homologacion && !homologacion.estado;
      if (homologacion && !homologacion.estado) {
        this.form.disable();
      }

    }
  }

  _alGuardar() {
    if (this.validaForm()) {
      return;
    }
    if (this._esCreacion) {
      this._crearCategoriaAsociadoHomologacion();
    } else {
      this._actualizarCategoriaAsociadoHomologacion();
    }
  }

  _irListaHomologacion() {
    this.router.navigate([UrlRoute.PAGES, UrlRoute.ADMINISTRACION, UrlRoute.ADMINSTRACION_PROTECCIONES, UrlRoute.ADMINISTRACION_PROTECCIONES_CATEGORIAS_ASOCIADO_HOMOLOGACION]);
  }

  _crearCategoriaAsociadoHomologacion() {
    const form: any = this.form.value;
    const categoriaAsociado = {
      codigoSistemaCliente: this.form.value.cliente.codigo,
      tipoVincuBuc: form.codigoCategoriaCliente,
      nombre: form.nombreCategoriaCliente,
      estado: SIP_PARAMETROS_TIPO.ESTADO_ACTIVO,
      edadMinima: form.edadMinima,
      edadMaxima: form.edadMaxima,
      ingresoMinimo: form.ingresosMinimos,
      ingresoMaximo: form.ingresosMaximos,
      tituloAcademico: form.tituloAcademico,
      mimTipoReconocido: form.unidadIngresos !== null ? { codigo: form.unidadIngresos.codigo } : form.unidadIngresos,
      sipCategoriaAsociado: { codigo: form.categoriaAsociado.codigo },
      fechaInicio: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy'),
      fechaFin: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy')
    };

    this.backService.categoriaAsociadoHomologacion.guardarHomologacion(categoriaAsociado).subscribe((_categoriaAsociado: any) => {
      this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.form.reset();
          this._initForm();
          // Redireccionamos a la pantalla de listar.
          this._irListaHomologacion();
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message, err.error.traza);
    });
  }

  _actualizarCategoriaAsociadoHomologacion() {
    const categoriaAsociado = {
      codigo: this.codigoCategoriaAsociadoHomologado,
      codigoSistemaCliente: this.form.controls.cliente.value.codigo,
      tipoVincuBuc: this.form.controls.codigoCategoriaCliente.value,
      nombre: this.form.controls.nombreCategoriaCliente.value,
      estado: this.categoriaAsociadoHomologacion.estado,
      edadMinima: this.form.controls.edadMinima.value,
      edadMaxima: this.form.controls.edadMaxima.value,
      ingresoMinimo: this.form.controls.ingresosMinimos.value,
      ingresoMaximo: this.form.controls.ingresosMaximos.value,
      tituloAcademico: this.form.controls.tituloAcademico.value,
      mimTipoReconocido: this.form.controls.unidadIngresos.value !== null ? { codigo: this.form.controls.unidadIngresos.value.codigo } : this.form.controls.unidadIngresos.value,
      sipCategoriaAsociado: { codigo: this.form.controls.categoriaAsociado.value.codigo },
      fechaInicio: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[0]),
      fechaFin: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[1])
    };
    this.backService.categoriaAsociadoHomologacion.actualizarHomologacion(categoriaAsociado).subscribe((_categoriaAsociado: any) => {
      this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.form.reset();
          this._initForm();
          // Redireccionamos a la pantalla de listar.
          this._irListaHomologacion();
        });
      });

    }, (err) => {
      this.frontService.alert.error(err.error.message, err.error.traza);
    });
  }

  rangoFechaSelected(fechaIni: any, fechaFin: any) {
    return [DateUtil.stringToDate(fechaIni), DateUtil.stringToDate(fechaFin)];
  }

  clienteSelected(codigo) {
    return this.clientes.find(cliente => cliente.codigo === codigo);
  }

  categoriaSelected(codigoCategoria: string) {
    return this.categorias.find(categoria => categoria.codigo === codigoCategoria);
  }

  unidadIngresoSelected(codigoUnidadIngreso: string) {
    return this.unidadesIngresos.find(unidadIngreso => unidadIngreso.codigo === codigoUnidadIngreso);
  }

  _changeCliente() {
    const codigo = this.form.value.cliente.codigo;
    this.backService.categoriaAsociadoHomologacion.getCategorias({ 'mimCliente.codigo': codigo, estado: true, esPaginable: true, sort: 'nombre,asc' }).subscribe((resp: any) => {
      this.categorias = resp.content;
    });
  }

  obtenerCategoriasPorCliente(codigoCliente: string) {
    this.backService.categoriaAsociadoHomologacion.getCategorias({ 'mimCliente.codigo': codigoCliente, esPaginable: true, sort: 'nombre,asc' }).subscribe((resp: any) => {
      this.categorias = resp.content;
      this._initForm(this.categoriaAsociadoHomologacion);
    });
  }


  private validaForm() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((validateForm: string) => {
        this.frontService.alert.warning(validateForm);
      });
      return true;
    }
    if ((this.form.value.edadMinima || this.form.value.edadMaxima) && (+this.form.value.edadMinima > +this.form.value.edadMaxima)) {
      this.translate.get('administracion.protecciones.categoriasHomologacion.alertas.edadMinimanMenorEdadMaxima').subscribe((validateForm: string) => {
        this.frontService.alert.warning(validateForm);
      });
      return true;
    }
    if ((this.form.value.ingresosMinimos || this.form.value.ingresosMaximos) && (+this.form.value.ingresosMinimos > +this.form.value.ingresosMaximos)) {
      this.translate.get('administracion.protecciones.categoriasHomologacion.alertas.ingresoMinimanMenorIngresoMaxima').subscribe((validateForm: string) => {
        this.frontService.alert.warning(validateForm);
      });
      return true;
    }
    return false;
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }

}
