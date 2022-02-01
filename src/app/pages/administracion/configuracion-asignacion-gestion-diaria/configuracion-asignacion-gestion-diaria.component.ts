import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormComponent } from '@core/guards';
import { BackFacadeService } from '@core/services/back-facade.service';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { TranslateService } from '@ngx-translate/core';
import { GENERALES } from '@shared/static/constantes/constantes';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { FormValidate } from '@shared/util';
import { forkJoin, from, Observable } from 'rxjs';
import { ConfiguracionAsignacionGestionsDiariaConfig } from './configuracion-asignacion-gestion-diaria.config';
import { ConfiguracionAsignacionGestionDiariaService } from './services/configuracion-asignacion-gestion-diaria.service';

@Component({
  selector: 'app-configuracion-asignacion-gestion-diaria',
  templateUrl: './configuracion-asignacion-gestion-diaria.component.html',
})
export class ConfiguracionAsignacionGestionDiariaComponent extends FormValidate implements OnInit, FormComponent {

  configuracionAsignacionGestionsDiariaConfig: ConfiguracionAsignacionGestionsDiariaConfig = new ConfiguracionAsignacionGestionsDiariaConfig();
  mostrarGuardar: boolean;
  isForm: Promise<any>;
  form: FormGroup;
  dataInit: any;
  esCreacion: boolean;
  procesos: any[];
  tiposAsignaciones: any[];
  productos: any[];
  usuarios: any[];
  codigosRoles: any[];
  objectParams: any;
  codigo: any;
  openModal: boolean;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService,
    private readonly configuracionAsignacionGestionDiariaService: ConfiguracionAsignacionGestionDiariaService
  ) {
    super();
    this.mostrarGuardar = false;
    this.esCreacion = true;
    this.openModal = false;
  }

  ngOnInit(): void {
    this.getDataSelectForm();
  }

  private getDataSelectForm() {
    const user = this.frontService.authentication.getUser();
    this.codigosRoles = user.roles.map((rol: any) => rol.code);

    forkJoin({
      productos: this.backService.movimientoPlanCanal.getMimMovimientoPlanCanal(
        {
          mimTipoMovimiento: GENERALES.TIPO_MOVIMIENTO.INCREMENTAR,
          'mimPlanCanalVenta.mimPlan.mimEstadoPlan.codigo': MIM_PARAMETROS.MIM_ESTADO_PLAN.ACTIVO
        }
      ),
      tipoAsignaciones: this.configuracionAsignacionGestionDiariaService.getTipoAsginaciones(),
      fases: this.backService.fases.getFases({ codigoRolLider: this.codigosRoles })
    }).subscribe(resp => {
      this.procesos = resp.fases._embedded.mimRolLiderFlujo;
      const planes = resp.productos.content.map(x => x.mimPlanCanalVenta.mimPlan);
      this.productos = [...new Set(planes.map(JSON.stringify))].map((x: any) => JSON.parse(x));
      this.tiposAsignaciones = resp.tipoAsignaciones._embedded.mimTipoAsignacion;
      this.dataInit = {
        productos: this.productos,
        tiposAsignaciones: resp.tipoAsignaciones._embedded.mimTipoAsignacion,
        procesos: resp.fases._embedded.mimRolLiderFlujo
      };
      this.initForm();
      this.getDataTabla();
      this.openModal = true;
    }, (err) => {
      this.frontService.alert.error(err.error.message);
      this.mostrarGuardar = false;
    });
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.isPristine(this.form.controls.formConfiguracionGestionDiaria as FormGroup) && this.form.controls.formConfiguracionGestionDiaria && this.form.controls.formConfiguracionGestionDiaria.dirty) {
      return true;
    }
  }

  private initForm(params?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        formConfiguracionGestionDiaria: this.formBuilder.group({
          proceso: [params && params.idProceso ? this.obtenerProcesos(params.idProceso) : null, [Validators.required]],
          tipoAsignacion: [params && params.mimTipoAsignacionDto ? this.obtenerTiposAsignaciones(params.mimTipoAsignacionDto.codigo) : null, [Validators.required]],
          producto: [params && params.mimPlanDto ? this.obtenerProductos(params.mimPlanDto.codigo) : null, []],
          usuario: [params && params.idUsuario ? this.findDocuments(params.idUsuario) : null, [Validators.required]]
        })
      })
    );
    if (params && params.idProceso) {
      this.form.controls.formConfiguracionGestionDiaria['controls'].proceso.disable();
    }
    this.eventChangeProcess();
  }

  private eventChangeProcess() {
    this.form.controls.formConfiguracionGestionDiaria['controls'].proceso.valueChanges.subscribe(resp => {
      if (resp) {
        this.getUsuarios(resp.mimFaseFlujo.codigo);
      }
    });
  }


  getDataTabla(pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc') {
    const param: any = { page: pagina, size: tamanio, isPaged: true, sort };
    this.configuracionAsignacionGestionDiariaService.getConfiguracionAsignacionGestionDiaria(param).subscribe(resp => {
      this.configuracionAsignacionGestionsDiariaConfig.gridConfig.component.limpiar();
      this.configuracionAsignacionGestionsDiariaConfig.gridConfig.component.cargarDatos(this.asignarProceso(resp.content), {
        maxPaginas: resp.totalPages,
        pagina: resp.number,
        cantidadRegistros: resp.totalElements
      });
    });
  }

  private asignarProceso(items: any) {
    const listObj = [];
    let item: any;
    for (item of items) {
      listObj.push({
        ...item,
        proceso: this.obtenerProcesos(item.idProceso).mimFaseFlujo.nombre
      });
    }
    return listObj;
  }

  private obtenerProcesos(codigo: any) {
    return this.procesos ? this.procesos.find(procesos => procesos.mimFaseFlujo.codigo === codigo) : null;
  }

  private obtenerProductos(codigo: any) {
    return this.productos ? this.productos.find(productos => productos.codigo === codigo) : null;
  }

  private obtenerTiposAsignaciones(codigo: any) {
    return this.tiposAsignaciones ? this.tiposAsignaciones.find(tiposAsignaciones => tiposAsignaciones.codigo === codigo) : null;
  }

  private obtenerUsuarios(documento: any) {
    return this.usuarios ? this.usuarios.find(usuario => usuario.identification === documento) : null;
  }

  private findDocuments(documents: any) {
    let document = documents.split(',');
    let objectUser = [];
    document.map(resp => {
      if (resp !== '' && this.obtenerUsuarios(resp) !== null) {
        objectUser.push(this.obtenerUsuarios(resp));
      }
    });
    if (objectUser && objectUser.length > 0) {
      this.usuarios = objectUser;
    }
    return this.usuarios;
  }

  async onClickCeldaElement(event: any) {
    if (event.col.key === 'editar') {
      await this.getUsuarios(event.dato.idProceso);
      this.initForm(event.dato);
      this.esCreacion = false;
      this.mostrarGuardar = true;
      this.codigo = event.dato.codigo;
    } else {
      this.irAEliminar(event.dato.codigo);
    }
  }

  private irAEliminar(codigo: any) {
    this.translate.get('administracion.configuracionAsignacionGestionDiaria.alertas.deseaEliminar').subscribe((text: string) => {
      const modalPromise = this.frontService.alert.confirm(text, 'danger');
      const newObservable = from(modalPromise);
      newObservable.subscribe(
        (desition: any) => {
          if (desition === true) {
            this.configuracionAsignacionGestionDiariaService.eliminarConfiguracionAsignacionGestionDiaria(codigo).subscribe(resp => {
              this.translate.get('global.eliminadoExitosoMensaje').subscribe((text: string) => {
                this.frontService.alert.success(text).then(() => {
                  this.getDataTabla();
                });
              });
            }, (err) => {
              this.frontService.alert.error(err.error.message);
            });
          }
        });
    });
  }

  onSiguiente(e: any) {
    this.getDataTabla(e.pagina, e.tamano, e.sort);
  }

  onAtras(e: any) {
    this.getDataTabla(e.pagina, e.tamano, e.sort);
  }

  crearAsignacionGestionDiaria() {
    if (this.openModal) {
      this.mostrarGuardar = true;
      this.form.controls.formConfiguracionGestionDiaria['controls'].proceso.enable();
    }
  }

  cerrarModal() {
    if (this.hasChanges()) {
      this.frontService.alert.confirm(this.translate.instant('global.onDeactivate')).then((respuesta: boolean) => {
        if (respuesta) {
          this.mostrarGuardar = false;
          this.esCreacion = true;
          this.form.reset({ emitEvent: false });
          this.form.controls.formConfiguracionGestionDiaria.markAsPristine();
        }
      });
    } else {
      this.form.reset({ emitEvent: false });
      this.form.controls.formConfiguracionGestionDiaria.markAsPristine();
      this.mostrarGuardar = false;
      this.esCreacion = true;
    }
  }

  generateTramaUsers(listUsers: any) {
    let tramaDocument = '';
    listUsers.map(user => {
      tramaDocument += `${user.identification},`;
    });
    return tramaDocument;
  }

  guardarGestionDiaria() {
    if (this.form.controls.formConfiguracionGestionDiaria.invalid) {
      this.validateForm(this.form.controls.formConfiguracionGestionDiaria as FormGroup);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return false;
    }
    const form = this.form.controls.formConfiguracionGestionDiaria['controls'];
    let object = {
      idProceso: form.proceso.value.mimFaseFlujo.codigo,
      idUsuario: this.generateTramaUsers(form.usuario.value),
      mimPlanDto: { codigo: form.producto.value.codigo },
      mimTipoAsignacionDto: { codigo: form.tipoAsignacion.value.codigo }
    };
    if (this.esCreacion) {
      this.configuracionAsignacionGestionDiariaService.guradarConfiguracionAsignacionGestionDiaria(object).subscribe(resp => {
        this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
          this.frontService.alert.success(text).then(() => {
            this.getDataTabla();
            this.form.controls.formConfiguracionGestionDiaria.reset();
            this.form.controls.formConfiguracionGestionDiaria.markAsPristine();
            this.mostrarGuardar = false;
            this.esCreacion = true;
          });
        });
      }, (err) => {
        this.frontService.alert.error(err.error.message);
      });
    } else {
      this.configuracionAsignacionGestionDiariaService.editarConfiguracionAsignacionGestionDiaria(object, this.codigo).subscribe(resp => {
        this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
          this.frontService.alert.success(text).then(() => {
            this.getDataTabla();
            this.form.controls.formConfiguracionGestionDiaria.reset();
            this.form.controls.formConfiguracionGestionDiaria.markAsPristine();
            this.mostrarGuardar = false;
            this.esCreacion = true;
          });
        });
      }, (err) => {
        this.frontService.alert.error(err.error.message);
      });
    }
  }

  private async getUsuarios(codigoFase?: any, tipoEventoSelected?: any) {
    if (this.form.controls.formConfiguracionGestionDiaria['controls'].usuario.value) {
      this.form.controls.formConfiguracionGestionDiaria['controls'].usuario.reset();
    }
    const _rolesHijos = await this.backService.fases.getRolesFlujo({
      codigoFase: codigoFase,
      codigoProceso: GENERALES.PROCESO.MEDICAMENTOS // tipoEventoSelected.nombreProceso
    }).toPromise();

    const codigoRolesPorFase: any = [... new Set(_rolesHijos._embedded.mimRolesFlujo.map(x => x.codigoRol))];
    const _user = [];
    let _dataUser: any;
    for (let item = 0; item < codigoRolesPorFase.length; item++) {
      _dataUser = await this.backService.sispro.getUsuariosPorRol(codigoRolesPorFase[item]).toPromise();
      _dataUser.forEach(user => {
        if (!_user.find(t => t.username === user.username)) {
          _user.push({ ...user, nombre: user.name });
        }
      });
    }
    this.usuarios = _user;
    this.dataInit = {
      ...this.dataInit,
      usuarios: this.usuarios
    };

  }

}
