import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';
import { DatosEventoService } from '../../services/datos-evento.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UrlRoute } from '@shared/static/urls/url-route';
import { GENERALES } from '@shared/static/constantes/constantes';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { IRegistraSolicitud } from '@shared/models/registra-solicitud.model';
import { MimGeneraCartaComponent } from '@shared/components/mim-genera-carta/mim-genera-carta.component';
import { forkJoin } from 'rxjs';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-valida-documentos',
  templateUrl: './valida-documentos.component.html'
})
export class ValidaDocumentosComponent implements OnInit {

  @Output() activaGuardar = new EventEmitter<any>();
  datosRegistroSolicitud: IRegistraSolicitud;
  @ViewChild(MimGeneraCartaComponent) mimGeneraCartaComponent: MimGeneraCartaComponent;

  form: FormGroup;
  fb: FormGroup;
  itemsForm: FormArray;
  isForm: Promise<any>;
  items: any;

  envioCarta: boolean;

  asoNumInt: string;
  idProceso: string;
  idTarea: string;

  listaDocumentos: [];
  documentosSelected: any[];
  faseFlujo: number;
  conceptoFlujo: number;
  tipoFaseFlujo: string;
  cartaDiligenciada: boolean;
  contenidoCarta: string;
  _observacion: string;
  _descripcionObserva: string;
  _disabledObservacion: boolean;
  suspenderFlujo: boolean;
  datosFlujo: any;
  guardarComentario: boolean;
  labelRemedy: string;

  dataInitGestionPendientePor: any;

  get documentos() {
    return this.form.get('documentos') as FormArray;
  }

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly registroService: DatosEventoService,
    private readonly datosEventoService: DatosEventoService,
    private readonly translate: TranslateService,
    private readonly router: Router,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    this.documentosSelected = [];
    this.faseFlujo = MIM_PARAMETROS.MIM_FASE_FLUJO.REGISTRO;
    this.conceptoFlujo = MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_MEDICAMENTOS_REGISTRO_SOLICITUD_INFORMACION;
    this.tipoFaseFlujo = GENERALES.TIPO_FASE_FLUJO.REGISTRO;
  }

  ngOnInit() {
    this.datosRegistroSolicitud = this.datosEventoService.getRegistraSolicitud();
    this.asoNumInt = this.datosRegistroSolicitud.asoNumInt;
    this.idProceso = this.datosRegistroSolicitud.procesoId;
    this.idTarea = this.datosRegistroSolicitud.tareaId;

    this._initForm();
    this._getInitDatos();
    this._mostrarBotones();

    this.translate.get('eventos.consulta.solicitud.numeroRemedy').subscribe((text: string) => {
      this.labelRemedy = text;
    });

  }

  _mostrarBotones() {
    this.activaGuardar.emit(false);

    if (this.envioCarta) {
      if (this._observacion && this.cartaDiligenciada) {
        this.activaGuardar.emit(true);
      } else {
        this.activaGuardar.emit(false);
      }

    } else {
      if (this._observacion) {
        const documentos = this.items.filter(item => (item.seleted === true)).map(t => t.docReqCodigo);
        const gestionPendientePor = this.form.controls.gestionPendientePor['controls'];
        if ((gestionPendientePor.subestados.value && gestionPendientePor.numeroRemedy.value) || (documentos && documentos.length > 0)) {
          this.activaGuardar.emit(true);
        } else {
          this.activaGuardar.emit(false);
        }

      } else {
        this.activaGuardar.emit(false);
      }
    }
  }

  _initForm(params?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        aviso: new FormControl(params ? params.aviso : false),
        documentos: this.formBuilder.array([]),
        gestionPendientePor: this.formBuilder.group({
          subestados: [null],
          numeroRemedy: [null]
        }),
      })
    );
    this.form.controls.gestionPendientePor['controls'].numeroRemedy.disable();
    this.datosForm();
    this._change();
    this.changeGestionPendientePor();
  }

  addCheckDocumentos() {
    const gestionPendientePor = this.form.controls.gestionPendientePor['controls'];
    this.documentos.controls = [];
    let bloquear = false;
    if (this.form.controls.aviso.value || (gestionPendientePor.subestados.value && gestionPendientePor.subestados.value.codigo !== null)) {
      bloquear = true;
      this.items.map(item => item.seleted = false);
    }
    if (this.items) {
      this.items.forEach((o: any, i) => {
        this.fb = this.formBuilder.group({
          docReqCodigo: o.docReqCodigo,
          docReqDescripcion: o.docReqDescripcion,
          seleted: false,
          bloqueo: bloquear
        });
        this.documentos.push(this.fb);
      });
    }
  }

  private changeGestionPendientePor() {
    const gestionPendientePor = this.form.controls.gestionPendientePor['controls'];
    gestionPendientePor.subestados.valueChanges.subscribe(item => {
      if (item) {
        const codigoTipoGestion = item.mimTipoGestion && item.mimTipoGestion.codigo ? item.mimTipoGestion.codigo : 0;
        this.guardarComentario = codigoTipoGestion === GENERALES.TIPO_GESTION.GUARDAR_COMENTARIO ? true : false;

        if (item.codigo === GENERALES.MIM_SUBESTADOS.REMEDY) {
          gestionPendientePor.numeroRemedy.setValidators([Validators.required]);
          gestionPendientePor.numeroRemedy.enable();
        } else {
          gestionPendientePor.numeroRemedy.setValidators(null);
          gestionPendientePor.numeroRemedy.setValue(null);
          gestionPendientePor.numeroRemedy.disable();
        }
      }
      this.addCheckDocumentos();
    });
  }

  getControls() {
    return this.form.get('documentos')['controls'].map(x => x.value);
  }

  _change() {
    this.form.controls.aviso.valueChanges.subscribe(item => {

      const gestionPendientePor = this.form.controls.gestionPendientePor['controls'];
      gestionPendientePor.numeroRemedy.setValidators(null);
      gestionPendientePor.numeroRemedy.setValue(null);
      gestionPendientePor.numeroRemedy.disable();

      gestionPendientePor.subestados.setValidators(null);
      gestionPendientePor.subestados.setValue(null);
      gestionPendientePor.subestados.disable();

      if (!item) {
        gestionPendientePor.subestados.enable();
        this.envioCarta = false;
      } else {
        this.form.controls.documentos.disable();
        this._disabledObservacion = true;
        this.envioCarta = true;
        this.mimGeneraCartaComponent.cargarDatos(this.conceptoFlujo);
      }
      this.addCheckDocumentos();
    });

  }

  _getInitDatos() {
    const params = { 'mimEvento.codigo': this.datosRegistroSolicitud.tipoEvento.codigo };

    forkJoin({
      _documentos: this.backService.documentosEvento.getDocumentosEventos(params),
      _subestados: this.backService.faseSubestado.getFasesSubestados({ codigoFaseFlujo: GENERALES.TIPO_FASE_FLUJO.REGISTRO })
    }).subscribe(items => {
      this.items = items._documentos.content && items._documentos.content.map(x => x.sipDocumentosRequeridos);
      this.dataInitGestionPendientePor = [{ codigo: null, nombre: 'Seleccionar' }, ...items._subestados.map(y => y.mimSubestado)];

      this._initForm(this.datosRegistroSolicitud);
      this.addCheckDocumentos();
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  _guardar() {
    this.activaGuardar.emit(false);
    if (this.form.controls.aviso.value) {
      this.suspenderFlujo = true;
    } else {
      this.suspenderFlujo = false;
    }
    this._guardarDatosFlujo();
  }

  _guardarDatosFlujo() {
    const codigoEvento = this.datosRegistroSolicitud.tipoEvento.nombreProceso;
    this.backService.solicitudEvento.postRegistro(this._getDatosFlujo(), codigoEvento).subscribe(respuesta => {
      this.translate.get(respuesta.messages[0]).subscribe((mensaje: string) => {
        this.frontService.alert.success(mensaje).then(() => {
          this.registroService.setRegitraSolicitud(null);
          this.router.navigate([UrlRoute.PAGES]);
        });
      });
    }, (err) => {
      this.activaGuardar.emit(true);
      this.frontService.alert.error(err.error.message);
    });
  }

  _getDatosFlujo() {
    const mimSolicitudEvento = {
      codigo: this.idProceso,
      mimEvento: { codigo: this.datosRegistroSolicitud.tipoEvento.codigo },
      fechaSolicitud: this.datosRegistroSolicitud.fechaReclamacion,
      mimEstadoSolicitudEvento: { codigo: MIM_PARAMETROS.MIM_ESTADOS_SOLICITUD_EVENTO.EN_PROCESO },
      asoNumInt: this.asoNumInt,
      usuarioRecibePor: this.datosRegistroSolicitud.solicitudRecibidaPor,
      tratamientoEspacial: this.datosRegistroSolicitud.tratamientoEspecial,
      migrado: false,
      mimCanal: { codigo: this.datosRegistroSolicitud.canal.codigo },
      mimReclamoPor: this.datosRegistroSolicitud.reclamoPor ? { codigo: this.datosRegistroSolicitud.reclamoPor } : null,
      codigoBeneficiarioAsociado: this.datosRegistroSolicitud.codigoBeneficiarioAsociado,
      pagoManual: false,
      descuentoSaldosVencidos: true, // Por defecto se debe cargar en ON en radicación
      descuentoCuotaMes: false,
      automatica: 0,
      mimOrigenCobertura: this.datosRegistroSolicitud.origen ? this.datosRegistroSolicitud.origen.codigo : null,
      declarante: this.datosRegistroSolicitud.declarante,
      documentos: this.items.filter(item => (item.seleted === true)).map(t => t.docReqCodigo),
      mimSolicitudEventoDetalleList: null,
      oficinaRegistro: this.datosRegistroSolicitud.oficinaRegistro
    };

    this.datosFlujo = {};
    this.datosFlujo['processInstanceId'] = this.idProceso;
    this.datosFlujo['taskId'] = this.idTarea;
    this.datosFlujo['mimSolicitudEvento'] = mimSolicitudEvento;

    let datosRegistroSolicitud = {};
    let comentario = GENERALES.DES_FASES_FLUJO.REGISTRO + this._observacion;
    const gestionPendientePor = this.form.controls.gestionPendientePor['controls'];
    // Si se suspende el flujo
    if (this.suspenderFlujo) {
      datosRegistroSolicitud = {
        type: GENERALES.TIPO_COMENTARIO.SUSPENDIDO,
        message: comentario,
        contenidoCarta: this.contenidoCarta
      };
      // Si se pasa a la fase de radicación
    } else {
      if (this.guardarComentario) {
        if (gestionPendientePor.numeroRemedy.value) {
          const comnentarioRemedy = [this.labelRemedy, gestionPendientePor.numeroRemedy.value, comentario];
          comentario = comnentarioRemedy.join(' ');
        }

        datosRegistroSolicitud = {
          type: GENERALES.TIPO_COMENTARIO.GESTION,
          message: comentario
        };

      } else {
        datosRegistroSolicitud = {
          comment: comentario
        };
      }
    }

    this.datosFlujo['variables'] = datosRegistroSolicitud;

    return this.datosFlujo;
  }

  datosForm() {
    const _form = this.form.getRawValue();
    this.datosRegistroSolicitud.aviso = _form.aviso;
  }

  checkedDocumento(event: any) {
    this.items.map(item => {
      if (item.docReqCodigo === event.docReqCodigo) {
        item.seleted = !item.seleted;
      }
    });
  }

  cartaGenerada(event) {
    this.contenidoCarta = event;
    this._disabledObservacion = false;
    this.cartaDiligenciada = true;
    this._mostrarBotones();
  }

  datoObservacion(event) {
    this._observacion = event;
    this._mostrarBotones();
  }

}
