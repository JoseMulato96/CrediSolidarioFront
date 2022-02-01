import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FormValidate } from '@shared/util';
import { Observable, forkJoin, Subscription } from 'rxjs';
import { ListarGestionSolicitudSuspendidaConfig } from './listar-gestion-solicitud-suspendida.config';
import { DateUtil } from '@shared/util/date.util';
import { ObjectUtil } from '@shared/util/object.util';
import { FileUtils } from '@shared/util/file.util';
import { GENERALES } from '@shared/static/constantes/constantes';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { MimVentaService } from '@core/services/api-back.services/mimutualasociados/mim-venta.service';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-listar-gestion-solicitud-suspendida',
  templateUrl: './listar-gestion-solicitud-suspendida.component.html',
})
export class ListarGestionSolicitudSuspendidaComponent extends FormValidate implements OnInit, OnDestroy {

  configuracion: ListarGestionSolicitudSuspendidaConfig = new ListarGestionSolicitudSuspendidaConfig();

  mostrarGestionSolicitud: boolean;
  tipoSolicitudes: any[];
  tipoSolicitudesHijas: any[];
  estadosGestion: any[];
  /** Fase a la que tiene acceso el usuario logeado. */
  codigoFase: string;
  codigoTipoSolicitud: any;
  codigoSolicitud: any;
  codigoProceso: any;
  processInstanceId: string;

  form: FormGroup;
  isForm: Promise<any>;

  subs: Subscription[] = [];
  colores: any[];
  fases: any[];
  solicitudes: any;
  tareas: any;
  tareasAll: any;
  anularSolicitud: boolean;
  guardarComentario: boolean;
  tieneSolicitudHija: boolean;
  habilitarBotonExportar: boolean;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService,
    private readonly ventaService: MimVentaService
  ) {
    super();
    this.fases = [];
    this.tieneSolicitudHija = false;
    this.habilitarBotonExportar = false;
    this.mostrarGestionSolicitud = false;
  }

  ngOnInit(): void {
    forkJoin({
      _colorimetria: this.backService.colorimetria.getColorimetria(),
      _tipoSolicitudes: this.backService.tipoSolicitud.getMimTipoSolicitud({estado : true}),
      _subestados: this.backService.faseSubestado.getFasesSubestados({ codigoFaseFlujo: GENERALES.TIPO_FASE_FLUJO.GENERAL }),
    }).subscribe(item => {
      this.colores = item._colorimetria.content;
      this.tipoSolicitudes = item._tipoSolicitudes.content;
      this.estadosGestion = item._subestados.map(y => y.mimSubestado);
      this.initForm();
    }, err => this.frontService.alert.error(err.error.message));
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => { sub.unsubscribe(); });
  }

  initForm() {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        tipoSolicitud: new FormControl(null, [Validators.required]),
        tipoSolicitudHija: new FormControl(null, [Validators.required]),
        solicitud: new FormControl(null, [Validators.required]),
        fases: new FormControl(null, [Validators.required]),
        tarea: new FormControl(null, [Validators.required]),
        estadoGestion: new FormControl(null, [Validators.required]),
        observacion: new FormControl(null, [Validators.required, Validators.maxLength(1000)])
      }),
    );

    this.onChanges();
  }

  onChanges() {
    this.form.controls.tipoSolicitud.valueChanges.subscribe(tipoSolicitud => {
      if (tipoSolicitud) {
        this.solicitudes = [];
        this.tipoSolicitudesHijas = [];
        this.fases = [];
        this.tareas = [];
        this.codigoProceso = null;
        this.codigoSolicitud = null;
        this.codigoTipoSolicitud = tipoSolicitud.codigo;
        if (tipoSolicitud.mimTipoSolicitudList && tipoSolicitud.mimTipoSolicitudList.length !== 0) {
          this.form.controls.tipoSolicitudHija.setValue(null);
          this.tieneSolicitudHija = true;
          this.tipoSolicitudesHijas = tipoSolicitud.mimTipoSolicitudList;
          this.form.controls.tipoSolicitudHija.enable();
          this.form.controls.tipoSolicitudHija.setErrors({ 'required': true });
        } else {
          this.tieneSolicitudHija = false;
          this.cargarSolicitudes(this.codigoTipoSolicitud);
          this.form.controls.tipoSolicitudHija.setValue(null);
          this.form.controls.tipoSolicitudHija.disable();
          this.form.controls.tipoSolicitudHija.setErrors(null);
        }
      }
    });

    this.form.controls.tipoSolicitudHija.valueChanges.subscribe(tipoSolicitudHija => {
      if (tipoSolicitudHija) {
        this.solicitudes = [];
        this.fases = [];
        this.tareas = [];
        this.codigoProceso = null;
        this.codigoSolicitud = null;
        this.codigoTipoSolicitud = tipoSolicitudHija.codigo;
        this.cargarSolicitudes(this.codigoTipoSolicitud);
      }
    });

    this.form.controls.solicitud.valueChanges.subscribe(solicitud => {

      if (solicitud) {
        this.codigoProceso = solicitud[0].codigoProceso;
        this.codigoSolicitud = [[...new Set(solicitud.map(x => x.mimSolicitudPK.codigo))]];

        this.form.controls.fases.setValue(null);
        this.backService.fases.getRolesFlujo({ 'codigoProceso': this.codigoProceso}).subscribe(respFases => {
          this.fases = [];
          this.tareas = [];
          this.cargarFasesTareas(respFases._embedded.mimRolesFlujo);
        }, (err) => {
          this.frontService.alert.error(err.error.message);
          this.form.controls.fases.setValue(null);
          this.form.controls.tarea.setValue(null);
        });
      }
    });

    this.form.controls.fases.valueChanges.subscribe((item: any) => {
      this.form.controls.tarea.setValue(null);
      if (!item) {
        this.tareas = null;
        return;
      }
      this.codigoFase = item.codigoFase;
      this.tareas = this.tareasAll.filter(x => x.codigoFase === item.codigoFase);
    });

    this.form.controls.tarea.valueChanges.subscribe((item: any) => {
      if (!item) {
        this.tareas = null;
        this.configuracion.gridConfig.component.limpiar();
        return;
      }
      this.buscarTareas();
    });

    this.form.controls.estadoGestion.valueChanges.subscribe(estadoGestion => {
      if (estadoGestion) {
        const codigoTipoGestion =  estadoGestion.mimTipoGestion.codigo;
        this.anularSolicitud = codigoTipoGestion === GENERALES.TIPO_GESTION.ANULAR_PROCESO ? true : false;
        this.guardarComentario = codigoTipoGestion === GENERALES.TIPO_GESTION.GUARDAR_COMENTARIO ? true : false;
      }
    });
  }

  private cargarFasesTareas(rolesFlujo: any) {
    const _fases = rolesFlujo.filter(x => x.codigoFase && x.nombreFase).map(x => {
      return {
        codigoFase: x.codigoFase,
        nombreFase: x.nombreFase,
        codigoRol: x.codigoRol,
        codigoProceso: x.codigoProceso
      };
    });
    this.fases = this.removerRepetidos(_fases);

    const _tareas = rolesFlujo.filter(x => x.codigoTarea && x.nombreTarea).map(x => {
      return {
        codigoFase: x.codigoFase,
        codigoTarea: x.codigoTarea,
        nombreTarea: x.nombreTarea,
        codigoRol: x.codigoRol,
        codigoProceso: x.codigoProceso
      };
    });
    this.tareasAll = this.removerRepetidos(_tareas);
  }

  private cargarSolicitudes(codigoSolicitud: any) {
    this.form.controls.solicitud.setValue(null);
    this.backService.solicitud.getMimSolicitud({'mimTipoSolicitud.codigo': codigoSolicitud})
    .subscribe(respSolicitudes => {
      this.solicitudes = respSolicitudes.content;
    }, (err) => {
      this.frontService.alert.error(err.error.message);
      this.form.controls.solicitud.setValue(null);
    });

  }

  async buscarTareas(pagina = 0, tamanio = 10) {

    await this.getTareas(true, pagina, tamanio).then((respuesta: any) => {

      this.configuracion.gridConfig.component.limpiar();

      if (!respuesta || !respuesta.content || respuesta.content.length === 0) {
        this.habilitarBotonExportar = false;
        this.translate.get('global.noSeEncontraronRegistrosMensaje').subscribe((msg: string) => {
          this.frontService.alert.info(msg);
        });
        return;
      }

      this.habilitarBotonExportar = true;
      this.configuracion.gridConfig.component.cargarDatos(
        this.asignarColor(respuesta.content.sort((a, b) => b.processDaysManagement - a.processDaysManagement)), {
        maxPaginas: respuesta.totalPages,
        pagina: respuesta.number,
        cantidadRegistros: respuesta.totalElements
      });
    }).catch(err => {
      this.frontService.alert.error(err.error.message, err.error.traza);
    });
  }

  private async getTareas(isPaged?: boolean, pagina?: number, tamanio?: number) {

    const params = {
      includeProcessVariables: true,
      includeSuperProcessVariables: true,
      suspended: true,
      category: this.codigoFase,
      isPaged: isPaged,
      isSorted: true,
      sort: 'processInstanceId,asc',
      codigoTipoSolicitud: this.codigoTipoSolicitud,
      taskDefinitionKey: this.form.controls.tarea.value.codigoTarea
    } as any;

    if (isPaged) {
      params.page = pagina;
      params.size = tamanio;
    }

    if (this.codigoSolicitud === GENERALES.CODIGO_SOLICITUD_PADRE && this.codigoTipoSolicitud !== GENERALES.TIPO_SOLICITUD_FLUJO.RECLAMACIONES) {
      params.codigoSolicitudPadre = this.codigoSolicitud;
    } else {
      params.codigoSolicitud = this.codigoSolicitud;
    }

    const taskObservable = this.backService.tarea.getRuntimeTask(params);
    return await new Promise(function (resolve, reject) {
      let value;
      taskObservable.subscribe((x) => {
        return value = x;
      }, (err) => {
        return reject(err);
      }, () => {
        return resolve(value);
      });
    });
  }

  asignarColor(items: any) {
    const listObj = [];
    let item: any;
    for (item of items) {
      listObj.push({
        ...item,
        _processInstanceId: item.superProcessInstanceId ? item.superProcessInstanceId : item.processInstanceId,
        _color: this.colores.find(x =>
          (x.rangoInicial <= item.processDaysManagement && x.rangoFinal && x.rangoFinal >= item.processDaysManagement) ||
          (!x.rangoFinal)
        ).color
      });
    }
    return listObj;
  }

  _onClickCeldaElement(event) {
    this.processInstanceId = event.dato.processInstanceId;
    this.mostrarGestionSolicitud = true;
  }

  /**
   * Autor: Cesar Millan
   * Función: Acción para ir a la siguiente pagina de la grid
   */
  _onSiguiente(e: any) {
    this.buscarTareas(e.pagina, e.tamano);
  }

  /**
   * Autor: Cesar Millan
   * Función: Acción para regresar a la página anterior de una grid
   */
  _onAtras(e: any) {
    this.buscarTareas(e.pagina, e.tamano);
  }

  private removerRepetidos(listaObj: any) {
    return [...new Set(listaObj.map(JSON.stringify))].map((x: any) => JSON.parse(x));
  }

  private refrescarDatos() {
    this.form.controls.estadoGestion.setValue(null);
    this.form.controls.observacion.setValue(null);
    this.mostrarGestionSolicitud = false;
    this.buscarTareas();
  }

  guardarGestionSolicitud() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }

    if (this.guardarComentario) {

      const mimGestionSolicitud = {
        codigoProceso: this.processInstanceId,
        mimSubestado: {codigo: this.form.controls.estadoGestion.value.codigo },
        observacion: this.form.controls.observacion.value
      };

      this.backService.gestionSolicitud.guardarGestionSolicitud(mimGestionSolicitud).subscribe(respuesta => {
        this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
          this.frontService.alert.success(text).then(() => {
            this.refrescarDatos();
          });
        });
      }, (err) => {
        this.frontService.alert.error(err.error.message);
      });

    } else if (this.anularSolicitud) {
      if (this.codigoProceso === GENERALES.PROCESO.INCREMENTOS) {
        this.anularVenta(this.processInstanceId);
      } else if (this.codigoProceso === GENERALES.PROCESO.MEDICAMENTOS) {
        this.anularSolicitudAmparo(this.processInstanceId);
      }
    }
  }

  anularSolicitudAmparo(idProceso: string) {

    this.backService.solicitudEvento.getSolicitudEvento(idProceso).subscribe(solicitudEvento => {

      const comentario = this.form.controls.observacion.value;
      const nombreProceso = solicitudEvento.mimEvento.nombreProceso;
      solicitudEvento.mimRazonAnulacion = { codigo: MIM_PARAMETROS.MIM_RAZON_ANULACION.ATRIBUIBLE_ASOCIADO };

      const datosAnular = {
        solicitudSuspendida : true,
        codigoSubestado: this.form.controls.estadoGestion.value.codigo,
        type: GENERALES.TIPO_COMENTARIO.ANULA,
        message: GENERALES.DES_FASES_FLUJO.ANULAR + comentario
      };

      const datosFlujo = {};
      // Se envia el mismo id de proceso para que no saque error de obligatoriedad
      datosFlujo['taskId'] = idProceso;
      datosFlujo['processInstanceId'] = idProceso;
      datosFlujo['mimSolicitudEvento'] = solicitudEvento;
      datosFlujo['variables'] = datosAnular;

      this.backService.solicitudEvento.postAnular(datosFlujo, nombreProceso).subscribe(respuesta => {
        this.translate.get(respuesta.messages[0]).subscribe((mensaje: string) => {
          this.frontService.alert.success(mensaje).then(() => {
            this.refrescarDatos();
          });
        });
      }, (err) => {
        this.frontService.alert.error(err.error.message);
      });

    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  anularVenta(idProceso: any) {

    this.ventaService.getVenta({idProceso: idProceso}).subscribe(respuesta => {

      const venta = respuesta.content[0];
      const comentario = this.form.controls.observacion.value;

      const variables = {
        solicitudSuspendida : true,
        codigoSubestado: this.form.controls.estadoGestion.value.codigo,
        comment: comentario
      };

      venta.variables = variables;
      this.ventaService.postAnularVenta(venta).subscribe((mimVenta: any) => {
        this.frontService.alert.success(mimVenta.message).then(() => {
          this.refrescarDatos();
        });
      }, (err) => {
        this.frontService.alert.error(err.error.message);
      });

    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }

  cerrarModal() {
    if (this.hasChanges()) {
      this.frontService.alert.confirm(this.translate.instant('global.onDeactivate')).then((respuesta: boolean) => {
        if (respuesta) {
          this.mostrarGestionSolicitud = false;
          this.form.reset({ emitEvent: false });
          this.form.controls.formGestion.markAsPristine();
        }
      });
    } else {
      this.form.reset({ emitEvent: false });
      this.form.controls.formGestion.markAsPristine();
      this.mostrarGestionSolicitud = false;
    }
  }

  async _onClickExportarExcel() {
    if (this.configuracion.gridConfig.component && this.configuracion.gridConfig.component.hayDatos()) {

      await this.getTareas(false).then((respuesta: any) => {
        // Se traen los encabezados
        const columnas: string[] = [
          'administracion.gestionSolicitudSuspendida.grid.numeroCaso',
          'administracion.gestionSolicitudSuspendida.grid.identificacion',
          'administracion.gestionSolicitudSuspendida.grid.solicitante',
          'administracion.gestionSolicitudSuspendida.grid.tipoSolicitud',
          'administracion.gestionSolicitudSuspendida.grid.solicitud',
          'administracion.gestionSolicitudSuspendida.grid.dias',
          'administracion.gestionSolicitudSuspendida.grid.accion'
        ];
        ObjectUtil.traducirObjeto(columnas, this.translate);

        // Se mapean solo las columnas que se quieren mostrar en el archivo Excel
        const datos = respuesta.content.map(x =>
          ({
            numeroCaso: x.superProcessInstanceId ? x.superProcessInstanceId : x.processInstanceId,
            identificacion: x.variables.identificacionAsociado,
            solicitante: x.variables.nombreAsociado,
            tipoSolicitud: x.variables.tipoSolicitud,
            solicitud: x.variables.nombreSolicitud,
            dias: x.processDaysManagement,
            accion: x.name
          }));

          this.exportarExcel(
            `Gestion_solicitudes_suspendidas_${DateUtil.dateToString(new Date())}`, {
            columnas,
            datos
          });
      }).catch(err => {
        this.frontService.alert.error(err.error.message, err.error.traza);
      });
    }
  }

  private exportarExcel(nombre, datos: any = {}) {
    this.backService.utilidades.exportarExcel(nombre, datos).subscribe(respuesta => {
      const body: any = respuesta.body;
      FileUtils.downloadXlsFile(body, nombre);
    });
  }

}
