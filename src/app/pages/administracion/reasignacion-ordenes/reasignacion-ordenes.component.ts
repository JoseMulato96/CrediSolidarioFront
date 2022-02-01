import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ReasignacionOrdenesConfig } from './reasignacion-ordenes.config';
import { masksPatterns } from '@shared/util/masks.util';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-reasignacion-ordenes',
  templateUrl: './reasignacion-ordenes.component.html',
})
export class ReasignacionOrdenesComponent implements OnInit {
  form: FormGroup;
  isForm: Promise<any>;
  formAsigna: FormGroup;
  isFormAsigna: Promise<any>;
  dataListaOrdenes: any[];
  dataListaAsignadas: any[];
  mostrarGuardar: boolean;
  fases: any[];
  codigosRoles: any[];
  colaboradorAsignado: any[];
  colaborador: any[];
  tipoEventoSelected: any;
  codigoFase: string;
  tipoEventos: any[];
  configuracion: ReasignacionOrdenesConfig = new ReasignacionOrdenesConfig();
  patterns = masksPatterns;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) { }

  ngOnInit(): void {

    const user = this.frontService.authentication.getUser();
    this.codigosRoles = user.roles.map((rol: any) => rol.code);
    this.getUsuarios().then(item => { this.colaborador = item; this.colaboradorAsignado = item; });
    this._initForm();
    this._initFormAsigna();
  }

  _initForm() {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        tipoEvento: new FormControl(null, [Validators.required]),
        fases: new FormControl(null),
        numeroSolicitud: new FormControl(null),
        colaborador: new FormControl(null, [Validators.maxLength(80)])
      })
    );
    this.change();
  }

  change() {
    this.form.controls.colaborador.valueChanges.subscribe(usuario => {
      if (usuario) {
        this.formAsigna.controls.colaboradorAsignado.reset();
        this.colaboradorAsignado = this.colaborador.filter(t => t.username !== usuario.username);
      } else {
        this.colaboradorAsignado = this.colaborador;
      }
    });
  }

  _initFormAsigna() {
    this.isFormAsigna = Promise.resolve(
      this.formAsigna = this.formBuilder.group({
        colaboradorAsignado: new FormControl(null),
        observacion: new FormControl(null, [Validators.required, Validators.maxLength(999), Validators.pattern('.*\\S.*[a-zA-z0-9-zÀ-ÿ\u00f1\u00d1 ]')])
      })
    );
  }

  buscar() {
    const _form = this.form.getRawValue();
    const numeroSolicitud = _form.numeroSolicitud;
    const colaborador = _form.colaborador?.username;

    const data = {
      isPaged: false,
      includeAssigneeInfo: true,
      includeProcessVariables: true,
      includeSuperProcessVariables: true
    } as any;
    if (numeroSolicitud) {
      data['actHiProcinst.processInstanceId'] = numeroSolicitud;
    }
    if (colaborador) {
      data.assignee = colaborador;
    }
    if (!numeroSolicitud && !colaborador) {
      this.translate.get('global.validateForm').subscribe((validateForm: string) => {
        this.frontService.alert.warning(validateForm);
      });
      return;
    }

    this.backService.runtime.getRuntimeTasks(data).subscribe(item => {

      if (item.content.length === 0) {
        this.translate.get('global.noSeEncontraronRegistrosMensaje').subscribe((validateForm: string) => {
          this.frontService.alert.info(validateForm).then(() => {
            this.dataListaAsignadas = [];
          });
        });
      } else {
        this.dataListaOrdenes = this._asignarDatos(item.content);
        this.configuracion.gridReasignacion.component.limpiar();
        if (!this.dataListaOrdenes || this.dataListaOrdenes.length === 0) {
          return;
        }
        this.configuracion.gridReasignacion.component.cargarDatos(
          this.dataListaOrdenes, {
          maxPaginas: item.totalPages,
          pagina: item.number,
          cantidadRegistros: item.totalElements
        });
      }

    });
  }

  asignarColor(items: any) {
    const listObj = [];
    let item: any;
    for (item of items) {
      listObj.push({
        ...item,
        _processInstanceId: item.superProcessInstanceId ? item.superProcessInstanceId : item.processInstanceId

      });
    }
    return listObj;
  }

  limpiar() {
    this.dataListaOrdenes = [];
    this.dataListaAsignadas = [];
    this.form.reset();
    this._initForm();
    this.configuracion.gridReasignacion.component.limpiar();
  }

  guardar() {
    const data = {
      userId: this.formAsigna.controls.colaboradorAsignado.value.username,
      taskSet: this.dataListaAsignadas,
      comment: this.formAsigna.controls.observacion.value
    };

    this.backService.tarea.reasignacionOrden(data).subscribe(item => {
      this.translate.get('administracion.reasignacionOrdenes.asignacionRealizada').subscribe(msn => {
        this.frontService.alert.success(msn).then(() => {
          this.limpiar();
          this._toggle(!this.mostrarGuardar);
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  _toggle(toggle: boolean) {
    this.mostrarGuardar = toggle;
    this.formAsigna.reset();
    this._initFormAsigna();
  }

  private async getUsuarios() {
    const _rolesHijos = await this.backService.fases.getRolesFlujo({}).toPromise();
    const codigoRolesPorFase: any = [... new Set(_rolesHijos._embedded.mimRolesFlujo.map(x => x.codigoRol))];
    const _user = [];
    _user.push({ codigo: null, nombre: 'Seleccionar' });
    let _dataUser: any;
    for (let item = 0; item < codigoRolesPorFase.length; item++) {
      _dataUser = await this.backService.sispro.getUsuariosPorRol(codigoRolesPorFase[item]).toPromise();
      _dataUser.forEach(user => {
        if (!_user.find(t => t.identification === user.identification)) {
          _user.push({ ...user, nombre: user.name });
        }
      });
    }

    return _user;
  }

  activarBotonGuardar() {
    if (this.dataListaAsignadas.length > 0 &&
      this.formAsigna.controls.colaboradorAsignado.value &&
      this.formAsigna.controls.colaboradorAsignado.value.username) {
      return false;
    } else {
      return true;
    }
  }

  _asignarDatos(items: any) {
    const listObj = [];
    let item: any;
    for (item of items) {
      listObj.push({
        ...item,
        _processInstanceId: item.superProcessInstanceId ? item.superProcessInstanceId : item.processInstanceId
      });
    }
    return listObj;
  }

  habilitarAsignar() {
    this.dataListaAsignadas = this.configuracion.gridReasignacion.component.obtenerTodosSeleccionados();
    return this.dataListaAsignadas && this.dataListaAsignadas.length > 0;
  }

}
