import { Component, OnInit, OnDestroy, ViewEncapsulation, forwardRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription, forkJoin } from 'rxjs';
import { ObjectUtil } from '@shared/util/object.util';
import { TranslateService } from '@ngx-translate/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import { DataService } from '@core/store/data.service';
import { DatosAsociadoWrapper } from '@core/store/asociado-data.service';
import { Acciones } from '@core/store/acciones';
import { RegistraSolicitudComponent } from './registra-solicitud/registra-solicitud.component';
import { ValidaDocumentosComponent } from './valida-documentos/valida-documentos.component';
import { DatosEventoService } from '../services/datos-evento.service';
import { IRegistraSolicitud, RegistraSolicitud } from '@shared/models/registra-solicitud.model';
import { BackFacadeService, FrontFacadeService } from '@core/services';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RegistroComponent),
      multi: true
    }
  ]
})
export class RegistroComponent implements OnInit, OnDestroy {

  @ViewChild(RegistraSolicitudComponent) registraSolicitudComponent: RegistraSolicitudComponent;
  @ViewChild(ValidaDocumentosComponent) validaDocumentosComponent: ValidaDocumentosComponent;

  datosRegistroSolicitud: IRegistraSolicitud;

  _subs: Subscription[] = [];
  items: MenuItem[];
  activeIndex = 0;

  habilitarSiguiente: boolean;
  habilitarGuardar: boolean;
  irSiguiente: boolean;

  asoNumInt: string;
  idProceso: string;
  idTarea: string;

  solicitudEvento: any;
  datosAsociado: any;

  constructor(
    private readonly translate: TranslateService,
    private readonly route: ActivatedRoute,
    private readonly location: Location,
    private readonly dataService: DataService,
    private readonly datosEventoService: DatosEventoService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
    ) {}

  ngOnInit() {

    this.datosRegistroSolicitud = new RegistraSolicitud();
    this._subs.push(this.route.parent.params.subscribe((params) => {
      this.asoNumInt = params.asoNumInt;
    }));

    // Se agrega nuevo el llamado
    this._subs.push(this.route.params.subscribe((params) => {
      this.idProceso = (params && params.idProceso) || null;
    }));

    this.datosRegistroSolicitud.asoNumInt = this.asoNumInt;

    if (this.idProceso !== null) {
      this._getDatosIniciales();
    } else {
      this._datosAsociado();
      this.datosEventoService.setRegitraSolicitud(this.datosRegistroSolicitud);
      this._asignacionReducer();
    }

  }

  _getDatosIniciales() {

    forkJoin({
      _solicitudEvento: this.backService.solicitudEvento.getSolicitudesEvento({'codigo' : this.idProceso}),
      _tarea: this.backService.proceso.getTareasPorIdProceso(this.idProceso),
    }).subscribe(items => {

      this.idTarea = items._tarea[0].taskId;
      this.datosRegistroSolicitud.procesoId = this.idProceso;
      this.datosRegistroSolicitud.tareaId = this.idTarea;

      if (!items._solicitudEvento || !items._solicitudEvento.content || items._solicitudEvento.content.length === 0) {
        this.solicitudEvento = null;
      } else {
        this.solicitudEvento = items._solicitudEvento.content[0];
      }

      if (this.solicitudEvento) {
        this.datosRegistroSolicitud.solicitudEvento = this.solicitudEvento;
        this.datosRegistroSolicitud.solicitudRecibidaPor = this.solicitudEvento.usuarioRecibePor;
        this.datosRegistroSolicitud.canal = this.solicitudEvento.mimCanal ? this.solicitudEvento.mimCanal : null;
        this.datosRegistroSolicitud.tipoEvento = this.solicitudEvento.mimEvento;
        this.datosRegistroSolicitud.codigoBeneficiarioAsociado = this.solicitudEvento.codigoBeneficiarioAsociado ? this.solicitudEvento.codigoBeneficiarioAsociado : null;
        this.datosRegistroSolicitud.reclamoPor = this.solicitudEvento.mimReclamoPor ? this.solicitudEvento.mimReclamoPor.codigo : null;
        this.datosRegistroSolicitud.fechaReclamacion = this.solicitudEvento.fechaSolicitud;
        this.datosRegistroSolicitud.origen = this.solicitudEvento.mimOrigenCobertura ? this.solicitudEvento.mimOrigenCobertura : null;
        this.datosRegistroSolicitud.tratamientoEspecial = this.solicitudEvento.tratamientoEspacial;
        this.datosRegistroSolicitud.declarante = this.solicitudEvento.declarante;
        this.datosRegistroSolicitud.documentos = this.solicitudEvento.documentos;
        this.datosRegistroSolicitud.oficinaRegistro = this.solicitudEvento.oficinaRegistro;
      }

      this._datosAsociado();
      this.datosEventoService.setRegitraSolicitud(this.datosRegistroSolicitud);
      this._asignacionReducer();

    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });

  }

  _datosAsociado() {
    // Configuramos los datos del asociado.
    if (this.asoNumInt !== null && this.asoNumInt !== undefined) {
      this._subs.push(this.dataService
        .asociados()
        .asociado.subscribe((datosAsociadoWrapper: DatosAsociadoWrapper) => {
          if (
            !datosAsociadoWrapper ||
            datosAsociadoWrapper.datosAsociado.numInt !== this.asoNumInt
          ) {
            this.dataService
              .asociados()
              .accion(Acciones.Publicar, this.asoNumInt, true);
            return;
          }
          this.datosAsociado = datosAsociadoWrapper.datosAsociado;
          this.datosRegistroSolicitud.datosAsociado = this.datosAsociado;

        }));
    }
  }

  _asignacionReducer() {
    this.items = [{
      label: 'eventos.consulta.solicitud.registro.registraSolicitud.titulo',
      command: (event: any) => {
        this.activeIndex = 0;
      }
    },
    {
      label: 'eventos.consulta.solicitud.registro.validaDocumentos.titulo',
      command: async (event: any) => {
        this.activeIndex = 1;
      }
    }
    ];
    ObjectUtil.traducirObjeto(this.items, this.translate);
  }

  _esPasoInicial(): boolean {
    return this.activeIndex === 0;
  }

  _esPasoFinal(): boolean {
    if (this.items) {
      return this.activeIndex === this.items.length - 1;
    }
    return false;
  }

  _atras() {
    if (this._esPasoInicial()) {
      return;
    }

    const anteriorPosicion = this.activeIndex - 1;
    this.items[anteriorPosicion].command();
  }

  async _siguiente() {
    if (this._esPasoFinal()) {
      return;
    }
    this.registraSolicitudComponent._siguiente();
  }

  _siguentePosicion() {
    const siguientePosicion = this.activeIndex + 1;
    this.items[siguientePosicion].command();
  }

  _irSiguienteValidaDocumentos(event) {
    this.irSiguiente = event;
    if (this.irSiguiente) {
      this._siguentePosicion();
    }
  }


  async _finalizar() {
    this.irAtras();
  }

  async _guardar() {
    this.validaDocumentosComponent._guardar();
  }


  irAtras() {
    this.location.back();
  }

  _datosFormRadicar(event) {
    this.habilitarSiguiente = event;
  }

  _datosFormDocumento(event) {
    this.habilitarGuardar = event;
  }

  ngOnDestroy() {
    this._subs.forEach(x => x.unsubscribe());
  }

}
