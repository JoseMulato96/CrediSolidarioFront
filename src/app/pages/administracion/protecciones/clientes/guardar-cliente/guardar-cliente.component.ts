import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UrlRoute } from '@shared/static/urls/url-route';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { FormValidate, CustomValidators } from '@shared/util';
import { masksPatterns } from '@shared/util/masks.util';
import { FormComponent } from '@core/guards';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { GENERALES } from '@shared/static/constantes/constantes';
import { BackFacadeService, FrontFacadeService } from '@core/services';

@Component({
  selector: 'app-guardar-cliente',
  templateUrl: './guardar-cliente.component.html',
})
export class GuardarClienteComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  codigoCliente: any;
  _codigoClienteSubscription: Subscription;
  cliente: any;
  _esCreacion: boolean;

  form: FormGroup;
  isForm: Promise<any>;

  tiposClientes: any[];
  tiposDocumentos: any[];
  estadosClientes: any[];

  mostrarDigitoVerificacion: boolean;
  patterns = masksPatterns;

  solicitud: string;
  idProceso: string;
  showForm: boolean;
  showControlsAprobacion: boolean;
  observaciones: any;
  idTarea: string;
  esDirectorTecnico: boolean;

  actualizar: boolean;

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
    this._codigoClienteSubscription = this.activatedRoute.params.subscribe((params: any) => {
      this.codigoCliente = params.codigo;
      this.solicitud = params.solicitud || null;
      this.idProceso = params.processInstanceId || null;
      this.idTarea = params.taskId || null;
      this.showControlsAprobacion = this.idTarea !== null ? true : false;

      let objDatos = {
        _estadosClientes: this.backService.estadoCliente.obtenerEstadoClientes({ estado: true, sort: 'nombre,asc' }),
        _tiposClientes: this.backService.tipoCliente.obtenerTipoClientes({ estado: true, sort: 'nombre,asc' })
      } as any;

      if (this.idProceso) {
        objDatos = {
          ...objDatos,
          _observaciones: this.backService.proceso.getObservacionesByIdProceso(this.idProceso)
        };
      }

      if (this.idTarea) {
        objDatos = {
          ...objDatos,
          _esDirectorTecnico: this.backService.tarea.obtenerTarea(this.idTarea)
        };
      }
      // Nos aseguramos de cargar los parametros antes de inicializar el formulario.
      forkJoin(objDatos).subscribe((respuesta: any) => {
        this.estadosClientes = respuesta._estadosClientes._embedded.mimEstadoCliente;
        this.estadosClientes = this.estadosClientes.filter(this.filtrarEstado);
        this.tiposClientes = respuesta._tiposClientes._embedded.mimTipoCliente;
        this.observaciones = this.idProceso ? respuesta._observaciones : null;
        this.esDirectorTecnico = respuesta._esDirectorTecnico ? respuesta._esDirectorTecnico.taskDefinitionKey === GENERALES.TIPO_USUARIO_FLUJO.DIRECTOR_TECNICO ? true : false : false;

        if (this.codigoCliente) {
          this.backService.cliente.obtenerCliente(this.codigoCliente).subscribe((cliente: any) => {
            this.cliente = cliente;
            this._esCreacion = false;

            if (!this.obtenerEstadoCliente(cliente.mimEstadoCliente.codigo)) {
              this.estadosClientes.push(this.cliente.mimEstadoCliente);
            }
            if (!this.obtenerTipoCliente(cliente.mimTipoCliente.codigo)) {
              this.tiposClientes.push(this.cliente.mimTipoCliente);
            }

            this._initForm(this.cliente);
            if (this.solicitud !== null && this.solicitud === UrlRoute.SOLICITUD_ELIMINACION) {
              this.form.disable();
              this.showForm = true;
            }
            if (this.solicitud !== null || this.idTarea) {
              this.form.disable();
            }
          }, (err) => {
            this.frontService.alert.error(err.error.message);
          });
        } else {
          this._esCreacion = true;
          this._initForm();
        }
      }, (err: any) => {
        this.frontService.alert.warning(err.error.message);
        this._irAClientes();
      });
    });

  }

  filtrarEstado(obj) {
    if (obj.codigo !== MIM_PARAMETROS.MIM_ESTADO_CLIENTE.OBSERVACION && obj.codigo !== MIM_PARAMETROS.MIM_ESTADO_CLIENTE.INACTIVO) {
      return true;
    }
    return false;
  }

  ngOnDestroy() {
    if (this._codigoClienteSubscription) {
      this._codigoClienteSubscription.unsubscribe();
    }
  }

  _initForm(cliente?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        codigoCliente: new FormControl(cliente ? cliente.codigo : null),
        tipoCliente: new FormControl(cliente ? this.obtenerTipoCliente(cliente.mimTipoCliente.codigo) : null, [Validators.required]),
        tipoDocumento: new FormControl(cliente ? this.obtenerTipoDocumento(cliente.mimTipoIdentificacion.codigo) : null, [Validators.required]),
        numeroIdentificacion: new FormControl(cliente ? cliente.numeroIdentificacion : null, [Validators.required]),
        digitoVerificacion: new FormControl(cliente ? cliente.digitoVerificacion : null),
        nombre: new FormControl(cliente ? cliente.nombre : null, [Validators.required, CustomValidators.vacio]),
        estadoCliente: new FormControl(cliente ? this.obtenerEstadoCliente(cliente.mimEstadoCliente.codigo) : null, [Validators.required])
      }));





    this.onChanges();

    // Debemos cargar el comportamiento de tipo identificacion.
    this.form.controls.tipoCliente.setValue(cliente ? this.obtenerTipoCliente(cliente.mimTipoCliente.codigo) : null);
    // Debemos recargar el comportamiento de digito de verificacion.
    this.form.controls.tipoDocumento.setValue(cliente ? this.obtenerTipoDocumento(cliente.mimTipoIdentificacion.codigo) : null);

    if (this.cliente) {
      this.form.controls.tipoCliente.markAsPristine({ onlySelf: true });
      this.form.controls.tipoDocumento.markAsPristine({ onlySelf: true });
    }

    // Si el estado del cliente es no disponible se inhabilitan los campos
    if (cliente) {
      if (cliente.mimEstadoCliente.codigo === MIM_PARAMETROS.MIM_ESTADO_CLIENTE.INACTIVO) {
        this.form.disable();
        this.form.controls.estadoCliente.enable();
      }
    }

    // El codigo cliente siempre debera estar deshabilitado.
    this.form.controls.codigoCliente.disable();
  }

  onChanges() {
    this.form.controls.tipoCliente.valueChanges.subscribe(tipoCliente => {
      if (tipoCliente) {
        this.backService.tipoIdentificacion.obtenerTipoIdentificaciones( {'mimTipoCliente.codigo': tipoCliente.codigo, sort: 'nombre,asc'}).subscribe(_tiposDocumentos => {
          this.tiposDocumentos = _tiposDocumentos._embedded.mimTipoIdentificacion;
          if (!this._esCreacion && !this.obtenerTipoDocumento(this.cliente.mimTipoIdentificacion.codigo)) {
            this.tiposClientes.push(this.cliente.mimTipoIdentificacion);
          }
          this.form.controls.tipoDocumento.setValue(this.cliente ? this.obtenerTipoDocumento(this.cliente.mimTipoIdentificacion.codigo) : null);

          if (this.cliente) {
            this.form.controls.tipoDocumento.markAsPristine({ onlySelf: true });
          }
        });
      }
    });


    this.form.controls.tipoDocumento.valueChanges.subscribe(tipoDocumento => {
      this.mostrarDigitoVerificacion = tipoDocumento && tipoDocumento.codigo === 7;
      if (this.mostrarDigitoVerificacion) {
        this.form.controls.digitoVerificacion.setValidators([Validators.required, Validators.maxLength(1)]);
        this.form.controls.digitoVerificacion.setValue(this.cliente ? this.cliente.digitoVerificacion : null);
        this.form.controls.digitoVerificacion.enable();


        if (this.cliente) {
          this.form.controls.digitoVerificacion.markAsPristine({ onlySelf: true });
        }
      } else {
        this.form.controls.digitoVerificacion.reset();
        this.form.controls.digitoVerificacion.disable();
      }
    });


  }

  _alGuardarCliente() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }

    if (this._esCreacion) {
      this._crearCliente();
    } else {
      this.actualizar = true;
      this._actualizarCliente();
    }
  }

  _actualizarCliente() {
    this._copiarACliente();

    this.backService.cliente.actualizarCliente(this.codigoCliente, this.cliente).subscribe((_cliente: any) => {
      this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.form.reset();
          this._initForm();
          // Redireccionamos a la pantalla de listar clientes.
          this._irAClientes();
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  _crearCliente() {
    const cliente = {
      mimTipoCliente: this.form.controls.tipoCliente.value,
      mimTipoIdentificacion: this.form.controls.tipoDocumento.value,
      nombre: this.form.controls.nombre.value,
      numeroIdentificacion: this.form.controls.numeroIdentificacion.value,
      digitoVerificacion: this.form.controls.digitoVerificacion.value,
      mimEstadoCliente: this.form.controls.estadoCliente.value
    };

    this.backService.cliente.guardarCliente(cliente).subscribe((_cliente: any) => {
      this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
         this.frontService.alert.success(text).then(() => {
          this.form.reset();
          this._initForm();
          // Redireccionamos a la pantalla de listar clientes.
          this._irAClientes();
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  private _copiarACliente() {
    this.cliente.mimTipoCliente = this.form.controls.tipoCliente.value;
    this.cliente.mimTipoIdentificacion = this.form.controls.tipoDocumento.value;
    this.cliente.nombre = this.form.controls.nombre.value;
    this.cliente.numeroIdentificacion = this.form.controls.numeroIdentificacion.value;
    this.cliente.digitoVerificacion = this.form.controls.digitoVerificacion.value;
    this.cliente.mimEstadoCliente = this.form.controls.estadoCliente.value;
  }

  _irAClientes() {
    this.router.navigate([UrlRoute.PAGES, UrlRoute.ADMINISTRACION, UrlRoute.ADMINSTRACION_PROTECCIONES, UrlRoute.ADMINISTRACION_PROTECCIONES_CLIENTES]);
  }

  private obtenerTipoCliente(codigo: any) {
    return this.tiposClientes ? this.tiposClientes.find(tipoCliente => tipoCliente.codigo === codigo) : null;
  }

  private obtenerTipoDocumento(codigo: any) {
    return this.tiposDocumentos ? this.tiposDocumentos.find(tipoDocumento => tipoDocumento.codigo === codigo) : null;
  }

  private obtenerEstadoCliente(codigo: any) {
    return this.estadosClientes ? this.estadosClientes.find(estadoCliente => estadoCliente.codigo === codigo) : null;
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }

  /* Metodos para el flujo de eliminacion */
  /* Para el flujo de eliminacion */
  _guardarObservacion(datos: any) {
    const _datos = {
      ...datos,
      codigoCliente: this.codigoCliente,
      codigoSolicitudPadre: GENERALES.CODIGO_SOLICITUD_PADRE,
      codigoSolicitud: this.codigoCliente.toString(),
      nombreSolicitud: this.form.controls.nombre.value,
      codigoTipoSolicitud: GENERALES.TIPO_SOLICITUD.CODIGO_TIPO_SOLICITUD_ELIMINAR_CLIENTE,
      nombreTipoSolicitud: GENERALES.TIPO_SOLICITUD.NOMBRE_TIPO_SOLICITUD_ELIMINAR_CLIENTE

    };

    this.backService.proceso.iniciarProceso(GENERALES.PROCESO.ELIMINAR_CLIENTE, _datos).subscribe((resp: any) => {

      this.translate.get('global.solicitudEliminacionEnviada').subscribe((getMensaje: string) => {
        this.translate.get('global.solicitudEliminacionMensaje', { mensaje: getMensaje, numero: resp }).subscribe((mensaje: string) => {
          this.frontService.alert.success(mensaje);
        });
      });

      this.router.navigate([
        UrlRoute.PAGES,
        UrlRoute.ADMINISTRACION,
        UrlRoute.ADMINSTRACION_PROTECCIONES,
        UrlRoute.ADMINISTRACION_PROTECCIONES_CLIENTES
      ]);
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  _apruebaRechazaSolicitud(datos: any) {
    this.backService.tarea.completarTarea(this.idTarea, datos).subscribe((resp: any) => {
      this.translate.get(datos.aprobar ? 'global.finalizaFlujo' : 'global.solicitudRechazadaMensaje').subscribe((mensaje: string) => {
        this.frontService.alert.success(mensaje);
      });

      this.router.navigate([UrlRoute.PAGES, UrlRoute.HOME]);
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  _toggleObservaciones(showModal?: boolean) {
    if (!showModal && this.solicitud === UrlRoute.SOLICITUD_ELIMINACION) {
      this.router.navigate([
        UrlRoute.PAGES,
        UrlRoute.ADMINISTRACION,
        UrlRoute.ADMINSTRACION_PROTECCIONES,
        UrlRoute.ADMINISTRACION_PROTECCIONES_CLIENTES]);
    }
  }

}
