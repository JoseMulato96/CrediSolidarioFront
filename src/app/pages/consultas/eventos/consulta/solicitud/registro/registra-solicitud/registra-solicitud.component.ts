import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { SERVICIOS_PARAMETROS } from '@shared/static/constantes/servicios-parametros';
import { GENERALES } from '@shared/static/constantes/constantes';
import { map } from 'rxjs/operators';
import { SIP_PARAMETROS_TIPO } from '@shared/static/constantes/sip-parametros-tipo';
import { DateUtil } from '@shared/util/date.util';
import { DatosEventoService } from '../../services/datos-evento.service';
import { IRegistraSolicitud } from '@shared/models/registra-solicitud.model';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-registra-solicitud',
  templateUrl: './registra-solicitud.component.html',
  styleUrls: ['./registra-solicitud.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RegistraSolicitudComponent implements OnInit {

  @Output() activaSiguient = new EventEmitter<any>();
  @Output() irSiguiente = new EventEmitter<any>();

  datosRegistroSolicitud: IRegistraSolicitud;

  asoNumInt: string;
  idProceso: string;

  form: FormGroup;
  isForm: Promise<any>;

  parametrosBeneficiarios: any;
  solicitudRecibidaPor: any[];
  tipoReclamaciones: any[];
  canales: any;
  reclamosPor: any[];
  beneficiarios: any[];
  origenes: any[];
  oficinas: any[];
  noInscripto = { codigo: null, nombre: this.translate.instant('global.noInscripto') };

  maxDate: Date = new Date();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly datosEventoService: DatosEventoService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    this.beneficiarios = [];
    this.solicitudRecibidaPor = [];
    this.tipoReclamaciones = [];
    this.reclamosPor = [];
    this.origenes = [];

    this.parametrosBeneficiarios = {
      codEstadoBenAso: SERVICIOS_PARAMETROS.beneficiarios.codEstadoBenAso,
      codEstadoBeneficiario: SERVICIOS_PARAMETROS.beneficiarios.codEstadoBeneficiario,
      codEstadoInactivo: SERVICIOS_PARAMETROS.beneficiarios.codEstadoInactivo,
      codEstadosBenAso: SERVICIOS_PARAMETROS.beneficiarios.codEstadosBenAso,
      codTipoBeneficiario: SERVICIOS_PARAMETROS.beneficiarios.codTipoBeneficiario.familiarDirecto
    };
  }

  ngOnInit() {
    this.datosRegistroSolicitud = this.datosEventoService.getRegistraSolicitud();
    this.asoNumInt = this.datosRegistroSolicitud.asoNumInt;
    this.idProceso = this.datosRegistroSolicitud.procesoId;
    this._getData();
  }

  _initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        solicitudRecibidaPor: new FormControl(param && param.solicitudRecibidaPor ? this._setSolicitudRecibidaPor(param.solicitudRecibidaPor) : null, [Validators.required]),
        canal: new FormControl(param && param.canal ? this.getCanales(param.tipoEvento.codigo, param.canal.codigo) : null, [Validators.required]),
        tipoReclamacion: new FormControl(param && param.tipoEvento ? this._setTipoReclamacion(param.tipoEvento.codigo) : null, [Validators.required]),
        reclamoPor: new FormControl(param && param.reclamoPor ? param.reclamoPor : null, [Validators.required]),
        beneficiario: new FormControl(param && param.codigoBeneficiarioAsociado ? this._setBeneficiario(param.codigoBeneficiarioAsociado) : null),
        fechaReclamacion: new FormControl(param && param.fechaReclamacion ? DateUtil.stringToDate(param.fechaReclamacion) : new Date(), [Validators.required]),
        origen: new FormControl(param && param.origen ? param.origen.codigo : null),
        tratamientoEspecial: new FormControl(param && param.tratamientoEspecial ? param.tratamientoEspecial : false),
        declarante: new FormControl(param && param.declarante ? param.declarante : false),
        oficina: new FormControl(param && param.oficinaRegistro ? this._setOficina(param.oficinaRegistro) : null, [Validators.required])
      })
    );

    if (param) {

      if (param.tipoEvento) {
        this._bloquearFormularioReclamoPor(param.tipoEvento.codigo, param.tipoEvento);

        this._bloquearFormularioOrigen(param.tipoEvento.codigo, param.tipoEvento);

        this._bloquearFormularioTratamientoEspecial(param.tratamientoEspecial, param.tipoEvento);
      }

      if (param.reclamoPor) {
        this._bloquearBeneficiario(param.reclamoPor.codigo);
      }

    }

    if (this.form.controls.reclamoPor.value === SIP_PARAMETROS_TIPO.RECLAMO_POR.ASOCIADO ||
      this.form.controls.reclamoPor.value === null) {
      this.form.controls.beneficiario.disable();
    }

    this._change();
  }

  _change() {
    this.form.controls.reclamoPor.valueChanges.subscribe(item => {
      this._bloquearBeneficiario(item);
    });
    this.form.controls.tipoReclamacion.valueChanges.subscribe(value => {
      this.getCanales(value.codigo);
      this._bloquearFormularioReclamoPor(value.codigo, value);
      this._bloquearFormularioOrigen(value.codigo.codigo, value);
      this._bloquearFormularioTratamientoEspecial(value.codigo.codigo, value);
    });

    this.form.statusChanges.subscribe(item => {
      if (item === 'VALID') {
        this.activaSiguient.emit(true);
      } else {
        this.activaSiguient.emit(false);
      }

    });
  }

  _bloquearBeneficiario(codigoReclamoPor: number) {
    if (codigoReclamoPor === SIP_PARAMETROS_TIPO.RECLAMO_POR.ASOCIADO) {
      this.form.controls.beneficiario.setValue(null);
      this.form.controls.beneficiario.disable();
    }
    if (codigoReclamoPor === SIP_PARAMETROS_TIPO.RECLAMO_POR.BENEFICIARIO) {
      this.form.controls.beneficiario.enable();
    }
  }

  _bloquearFormularioReclamoPor(codigoTipoEvento: number, evento: any) {
    if (codigoTipoEvento === evento.codigo && evento.aplicaReclamoPor) {
      this.form.controls.reclamoPor.enable();
      this.form.controls.reclamoPor.setValidators([Validators.required]);
    } else {
      this.form.controls.reclamoPor.disable();
    }
  }

  _bloquearFormularioOrigen(codigoTipoEvento: number, evento: any) {
    if (codigoTipoEvento === evento.codigo && evento.aplicaOrigen) {
      this.form.controls.origen.enable();
      this.form.controls.origen.setValidators([Validators.required]);
    } else {
      this.form.controls.origen.disable();
    }
  }

  _bloquearFormularioTratamientoEspecial(codigoTipoEvento: number, evento: any) {
    if (codigoTipoEvento === evento.codigo && evento.aplicaTratamientoEspacial) {
      this.form.controls.tratamientoEspecial.enable();
      this.form.controls.tratamientoEspecial.setValidators([Validators.required]);
    } else {
      this.form.controls.tratamientoEspecial.disable();
    }
  }

  _setSolicitudRecibidaPor(codigo: string) {
    return this.solicitudRecibidaPor.find(item => item.codigo === codigo);
  }

  _setTipoReclamacion(codigo: string) {
    return this.tipoReclamaciones.find(item => item.codigo === codigo);
  }

  _setBeneficiario(codigo: string) {
    return this.beneficiarios.find(item => item.codBeneficiario === codigo);
  }

  _setOficina(codigo: string) {
    return this.oficinas.find(item => item.agCori === codigo);
  }

  _actualizarRegistroSolicitud() {
    const _form = this.form.getRawValue();
    this.datosRegistroSolicitud.solicitudRecibidaPor = _form.solicitudRecibidaPor.codigo;
    this.datosRegistroSolicitud.canal = _form.canal;
    this.datosRegistroSolicitud.tipoEvento = _form.tipoReclamacion;
    this.datosRegistroSolicitud.codigoBeneficiarioAsociado = _form.beneficiario ? _form.beneficiario.codBeneficiario : null;
    this.datosRegistroSolicitud.reclamoPor = _form.reclamoPor;
    this.datosRegistroSolicitud.fechaReclamacion = DateUtil.dateToString(_form.fechaReclamacion, 'dd-MM-yyyy');
    this.datosRegistroSolicitud.origen = _form.origen ? _form.origen : null;
    this.datosRegistroSolicitud.tratamientoEspecial = _form.tratamientoEspecial;
    this.datosRegistroSolicitud.declarante = _form.declarante;
    this.datosRegistroSolicitud.oficinaRegistro = _form.oficina.agCori;
  }

  _getData() {
    forkJoin({
      _beneficiarios: this.backService.beneficiario.getBeneficiarios(this.asoNumInt, this.parametrosBeneficiarios),
      _tipoEvento: this.backService.evento.obtenerEventos({ asoNumInt: this.asoNumInt }),
      _reclamoPor: this.backService.reclamoPor.getReclamoPor({}),
      _origenCobertura: this.backService.origenCoberturas.obtenerOrigenCoberturas({ estado: true }),
      _recibidaPor: this.backService.sispro.getUsuariosPorRol(GENERALES.ROLES_ID.MM_F5),
      _oficinasExcluidas: this.backService.parametro.getParametros([SIP_PARAMETROS_TIPO.OFICINAS_EXCLUIDAS.PAGO_POR_GIRO, SIP_PARAMETROS_TIPO.OFICINAS_EXCLUIDAS.VALOR_MINIMO]),
    }).pipe(
      map(x => {
        return {
          _beneficiarios: x._beneficiarios.map(t => {
            return {
              ...t,
              nombre: t.nomBeneficiario + ' ' + t.benApellido1 + ' ' + t.benApellido2
            };
          }),
          _tipoEvento: x._tipoEvento,
          _reclamoPor: x._reclamoPor._embedded.mimReclamoPor,
          _origenCobertura: x._origenCobertura,
          _recibidaPor: x._recibidaPor.map(t => {
            return {
              codigo: t.identification,
              nombre: t.name
            };
          }),
          _oficinasExcluidas: x._oficinasExcluidas.map(y => y.valor)
        };
      })
    ).subscribe((listas) => {
      this.origenes = listas._origenCobertura.content;
      this.reclamosPor = listas._reclamoPor;
      this.solicitudRecibidaPor = listas._recibidaPor;
      this.beneficiarios = listas._beneficiarios;
      this.beneficiarios.push(this.noInscripto);
      this.tipoReclamaciones = listas._tipoEvento;

      const codigo: any[] = listas._oficinasExcluidas;
      const params: any = { oficinasExcluidas: codigo, excluirCentroOperaciones: true, excluirTesoreria: true };

      this.backService.oficinas.getOficinas(params).subscribe(item => {
        this.oficinas = item;
        this._initForm(this.datosRegistroSolicitud);
      });

    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });
  }

  _crearFlujo() {
    this._actualizarRegistroSolicitud();
    const datosFlujo = {
      aprobar: true,
      identificacionAsociado: this.datosRegistroSolicitud.datosAsociado.nitCli,
      nombreAsociado: this.datosRegistroSolicitud.datosAsociado.nombreAsociado,
      asoNumInt: this.asoNumInt,
      codigoSolicitud: this.form.controls.tipoReclamacion.value.codigo.toString(),
      nombreSolicitud: this.form.controls.tipoReclamacion.value.nombre,
      codigoTipoSolicitud: GENERALES.TIPO_SOLICITUD.CODIGO_TIPO_SOLICITUD_RECLAMACIONES,
      nombreTipoSolicitud: GENERALES.TIPO_SOLICITUD.NOMBRE_TIPO_SOLICITUD_RECLAMACIONES
    };
    this.backService.proceso.iniciarProceso(GENERALES.PROCESO.MEDICAMENTOS, datosFlujo).subscribe(proceso => {
      this.backService.proceso.getTareasPorIdProceso(proceso).subscribe(_tareas => {
        this.datosRegistroSolicitud.tareaId = _tareas[0].taskId;
        this.datosRegistroSolicitud.procesoId = proceso;
        this.irSiguiente.emit(true);
      });
    }, (err) => {
      this.irSiguiente.emit(false);
      this.frontService.alert.error(err.error.message, err.error.traza);
    });
  }

  _siguiente() {
    if (this.idProceso) {
      this._actualizarRegistroSolicitud();
      this.irSiguiente.emit(true);
    } else {
      // Se crea el flujo
      this._crearFlujo();
    }
  }

  getCanales(codigoEvento: string, selectedCanal?: any) {
    this.backService.canalEvento.getCanalesEvento({ 'mimEvento.codigo': codigoEvento })
      .pipe(
        map((x: any) => {
          return x.content.map(t => t.mimCanal);
        })
      )
      .subscribe(items => {
        this.canales = items;
        if (selectedCanal) {
          this.form.controls.canal.setValue(this.canales.find(item => item.codigo === selectedCanal));
        }
      }, (err) => {
        this.frontService.alert.warning(err.error.message);
      });
  }

}
