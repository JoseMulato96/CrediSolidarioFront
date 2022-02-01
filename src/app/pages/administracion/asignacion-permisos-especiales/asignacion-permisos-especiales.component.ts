import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BackFacadeService } from '@core/services/back-facade.service';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { environment } from '@environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { IPulldownCorteFiltro } from '@shared/interfaces/i-pulldown-filtro';
import { FormValidate } from '@shared/util';
import { DateUtil } from '@shared/util/date.util';
import { Subscription } from 'rxjs/internal/Subscription';
import { AsignacionPermisosConfig } from './asignacion-permisos-especiales.config';

@Component({
  selector: 'app-asignacion-permisos',
  templateUrl: './asignacion-permisos-especiales.component.html',
  styleUrls: ['./asignacion-permisos-especiales.component.css']
})
export class AsignacionPermisosComponent extends FormValidate implements OnInit, OnDestroy {

  configuracion: AsignacionPermisosConfig = new AsignacionPermisosConfig();
  _autocompleteTipoDocumentos: IPulldownCorteFiltro[] = [];
  usuarioPermisos: any;

  form: FormGroup; isForm: Promise<any>;
  tipos: any[];
  tiposDocumentos: any[];
  exportarDisabled;
  request: any;
  subs: Subscription[] = [];
  paramsBusqueda: any = {};

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
  }

  ngOnInit() {
    this.getData();
    this.initFormGroup();
  }

  onBuscar() {
    if (!this.validarForm()) {
      return;
    }

    // Limpiamos siempre la data previa, no el formulario.
    this.limpiarResultadosBusqueda();

    const form: any = this.form.value;
    this.backService.sispro.getDatosUser({ tipoIdentificacion: form.tipoDocumento.nombreCorto, numeroIdentificacion: form.identificacion })
      .subscribe(respuesta => {
        this.usuarioPermisos = respuesta.user;
        this.usuarioPermisos._estado = this.usuarioPermisos.active ? 'global.active' : 'global.inactive';
        this.obtenerAsignacionPermisos();
      });
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

  private initFormGroup() {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        tipoDocumento: new FormControl(null, [Validators.required]),
        identificacion: new FormControl(null, [Validators.required]),
      }));
  }

  ngOnDestroy() {
    // do nothing
  }

  _limpiar() {
    if (this.form) {
      this.form.reset();
    }
    this.initFormGroup();
    this.limpiarResultadosBusqueda();
  }

  private limpiarResultadosBusqueda() {
    this.usuarioPermisos = undefined;
    this.request = {};
    if (this.configuracion.gridPermisosEspeciales.component) {
      this.configuracion.gridPermisosEspeciales.component.limpiar();
    } else {
      this.configuracion.gridPermisosEspeciales.datos = [];
    }
  }

  obtenerAsignacionPermisos() {
    const dato: any[] = [];
    this.translate.get('administracion.protecciones.permisosEspecilaes').subscribe((text: any) => {
      dato.push({ codigoRol: text.codigoRol, nombreRol: text.rol });
      this.configuracion.gridPermisosEspeciales.component.cargarDatos(
        dato,
        {
          maxPaginas: 1,
          pagina: 1,
          cantidadRegistros: 1
        });
    });

  }

  getData() {

    this.backService.parametro.getParametrosTipo(20).subscribe(_tiposDocumentos => {
      this.tiposDocumentos = _tiposDocumentos.sipParametrosList;
    }, err => {
      this.frontService.alert.error(err.error.message);
    });

  }

  _onClick(event) {
    const fechaLimiteTem = new Date();
    fechaLimiteTem.setDate(new Date().getDate() + 1);
    const usuario = this.frontService.authentication.getUser();
    const param = {
      username: this.usuarioPermisos.username,
      applicationCode: environment.appName,
      roleCode: event.codigoRol,
      isTemporal: true,
      assignationDate: DateUtil.dateToString(new Date(), 'yyyy-MM-dd'),
      inactivationDate: DateUtil.dateToString(fechaLimiteTem, 'yyyy-MM-dd'),
      assignor: usuario.username
    };
    this.backService.sispro.putPermisos(this.usuarioPermisos.username, param).subscribe((respuesta: any) => {
      if (respuesta.description) {
        this.frontService.alert.success(respuesta.description);
      }
    }, (err: any) => {
      if (err.error.description) {
        this.frontService.alert.error(err.error.description);
      }
    });
  }
}
