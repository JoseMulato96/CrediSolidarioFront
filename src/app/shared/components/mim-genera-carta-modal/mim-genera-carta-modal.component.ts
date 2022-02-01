import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DataService } from '@core/store/data.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { DatosAsociadoWrapper } from '@core/store/asociado-data.service';
import { Acciones } from '@core/store/acciones';
import { ReportParams } from '@shared/models/report-params.model';
import { environment } from '@environments/environment';
import { DateUtil } from '@shared/util/date.util';
import { TranslateService } from '@ngx-translate/core';
import { FormValidate } from '@shared/util';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-mim-genera-carta-modal',
  templateUrl: './mim-genera-carta-modal.component.html',
})
export class MimGeneraCartaModalComponent extends FormValidate implements OnInit {

  form: FormGroup;
  isForm: Promise<any>;

  mostrarGuardar: boolean;
  cartaExistente: boolean;
  subs: Subscription[] = [];
  datosAsociado: any;
  firmas: any;
  datosUsuario: any;
  datosFirma: any = {};
  cuerpoCarta: any;
  generarPdf: boolean;
  subirPdf: boolean;
  cartas: any = [];
  nombreArchivoCartasFTP: string;
  codigoCartasFTP: string;
  fechaActual = new Date(Date.now());
  tituloTipoCarta: string;

  @Input() asoNumInt: string;
  @Input() esCreacion: boolean;
  @Input() idProceso;
  @Input() tipoCarta: any;
  @Input() datosCarta: any;

  @Output() cartaGuardada = new EventEmitter<any>();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly dataService: DataService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
    this.mostrarGuardar = false;
    this.esCreacion = true;
  }

  ngOnInit() {
    this._initForm();
  }

  _initForm(datosCarta?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        observacion: new FormControl(datosCarta ? datosCarta.contenido : null, [Validators.required, Validators.maxLength(999)])
      })
    );
  }

  _diligenciar() {
    this._getDatosDelAsociado();
  }

  _toggleObservaciones() {
    this.mostrarGuardar = !this.mostrarGuardar;
  }

  _guardarCarta() {
    if (this.form.invalid) {
      return;
    }

    if (this.esCreacion) {
      this._crearCarta();
    } else {
      this._actualizarCarta();
    }

  }

  _crearCarta() {
    this.cartaExistente = true;
    this.subirPdf = true;
    const longFormat = this.fechaActual.getTime();

    this.nombreArchivoCartasFTP = this.idProceso + '-'
      + this.tipoCarta.nombre.replace(/\s/g, '')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') + '-'
      + longFormat + '.pdf';
    this.codigoCartasFTP = null;
    // Se envia la información para contruir la carta
    this._setDataCarta(this.datosAsociado, this.datosFirma);
  }

  _actualizarCarta() {
    this.cartas = [];
    const carta = this.datosCarta;

    const datosCarta = {
      codigo: carta.codigo,
      codigoParametroCarta: carta.codigoParametroCarta,
      codigoProceso: carta.codigoProceso,
      codigoCartasFTP: carta.codigoCartasFTP,
      contenido: this.form.controls.observacion.value,
      validado: carta.validado,
      codigoTipoSolicitud: carta.codigoTipoSolicitud,
      asoNumInt: carta.asoNumInt
    };

    this.cartas.push(datosCarta);

    this.backService.generarCarta.actualizarCarta(this.cartas).subscribe((resp: any) => {
      this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.subirPdf = true;
          this.nombreArchivoCartasFTP = carta.nombreArchivoCartasFTP;
          this.codigoCartasFTP = carta.codigoCartasFTP;
          // Se envia la información para contruir la carta
          this._setDataCarta(this.datosAsociado, this.datosFirma);
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });

  }

  _setDataCarta(datosAsociado: any, datosFirma: any) {
    const _form = this.form.getRawValue();
    const parameters: any = {};
    const asociado: any = {};
    const reclamacion: any = {};
    const _datosCarta: ReportParams = new ReportParams;

    parameters.dia = this.fechaActual.getDate();
    parameters.mes = DateUtil.nombreMes(this.fechaActual.getMonth() + 1);
    parameters.anio = this.fechaActual.getFullYear();
    parameters.comment = _form.observacion;

    // Datos del asociado
    asociado.nombre = datosAsociado.nombreAsociado;
    asociado.tipoDocumento = this.datosAsociado.desTipDoc;
    asociado.nroIdentificacion = this.datosAsociado.nitCli;
    asociado.direccionCorrespondencia = datosAsociado.dirRes || null;
    asociado.barrioCorrespondencia = datosAsociado.barRes || null;
    asociado.ciudadCorrespondencia = datosAsociado.ciuRes || null;

    // Datos de la reclamación
    reclamacion.recCodigo = this.idProceso;

    parameters.asociado = asociado;
    parameters.reclamacion = reclamacion;
    parameters.datosFirma = datosFirma;

    _datosCarta.nombre = this.tipoCarta.nombre;
    _datosCarta.parameters = parameters;

    this.backService.generarCarta.generarPDF(_datosCarta, this.tipoCarta.codigo).subscribe(item => {

      const blob = new Blob([item.body], { type: 'application/pdf' });

      if (this.subirPdf) {

        this.subirPdf = false;

        // Las cartas solo se crean cuando vienen del flujo (Medicamentos)
        if (this.esCreacion) {
          this.cartaGuardada.emit(_form.observacion);
          this._toggleObservaciones();

          // Siempre que viene del módulo de cartas es una edición
        } else {

          const archivo: File = new File([blob], this.nombreArchivoCartasFTP);
          const formData: FormData = new FormData();
          formData.append('file', archivo, archivo.name);
          formData.append('path', this.datosCarta.rutaArchivoCartasFTP );

          if (this.codigoCartasFTP !== null) {
            formData.append('codigoCartasFTP', this.codigoCartasFTP);
          }

          this.backService.generarCarta.cargarCartaFTP(formData).subscribe((cartaFTP: any) => {
            this.nombreArchivoCartasFTP = '';
            this.cartaGuardada.emit(_form.observacion);
            this._toggleObservaciones();
          }, (err) => {
            this.frontService.alert.error(err.error.message);
          });
        }
      } else {
        const fileURL = URL.createObjectURL(blob);
        window.open(fileURL, '', 'width=' + window.outerWidth + ',height=' + window.outerHeight + ',left=0,top=0');
      }

    });
  }

  verCartaPDF() {
    this.generarPdf = true;
    this.subirPdf = false;
    this._getDatosDelAsociado();
  }

  _getDatosDelAsociado() {
    // Configuramos los datos del asociado.
    if (this.asoNumInt !== null && this.asoNumInt !== undefined) {
      this.subs.push(this.dataService
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
          this._getDatosFirma();

        }));
    } else {
      this.translate.get('reportes.cartas.alerts.asociadoNull').subscribe((mensaje: string) => {
        this.frontService.alert.info(mensaje);
      });
    }
  }

  _getDatosFirma() {
    const cargo = 'Jefe';
    // Se consultan los datos de la firma correspondiente a la regional del asociado
    const param: any = { isPaged: false, estado: true, cargo: cargo, regional: this.datosAsociado.regionalAso };

    this.backService.parametroFirma.obtenerFirmas(param)
      .subscribe((firmas: any) => {

        if (!firmas || !firmas.content || firmas.content.length === 0) {
          this.translate.get('global.noHayFirma').subscribe((response: string) => {
            this.frontService.alert.info(response);
          });
          return;
        }

        this.firmas = firmas.content[0];

        // Se consultan los datos de la persona que firma
        this.backService.sispro.getDatosUser({ tipoIdentificacion: 'CC', numeroIdentificacion: this.firmas.numeroIdentificacion })
          .subscribe(respuesta => {
            this.datosUsuario = respuesta.user;

            this.datosFirma.nombre = this.datosUsuario.name;
            this.datosFirma.cargo = this.datosUsuario.title.description + ' ' + this.datosUsuario.regional.description;

            // Ruta de la imagen de la firma
            this.datosFirma.src = `${environment.miMutualUtilidadesUrl}/${this.firmas.firma}`;
            if (this.generarPdf) {
              this.generarPdf = false;
              // Se envia la información para contruir la carta
              this._setDataCarta(this.datosAsociado, this.datosFirma);
            } else {
              this._buildCuerpoCarta();
            }
          });
      });
  }

  _buildCuerpoCarta() {

    if (this.datosCarta) {
      this.form.controls.observacion.setValue(this.datosCarta.contenido);
      this.idProceso = this.datosCarta.codigoProceso;
    }

    this.tituloTipoCarta = this.tipoCarta.nombre;
    let strCarta = this.tipoCarta.contenido;
    strCarta = strCarta && strCarta.replace(/\[/g, '').replace(/\]/g, '')
      .replace(/\$\{dia\}/g, this.fechaActual.getDate().toString())// /[xy]/g
      .replace(/\$\{mes\}/g, DateUtil.nombreMes(this.fechaActual.getMonth() + 1))
      .replace(/\$\{anio\}/g, this.fechaActual.getFullYear().toString())
      .replace(/\$\{asociado\.nombre\}/g, this.datosAsociado.nombreAsociado)
      .replace(/\$\{asociado\.tipoDocumento\}/g, this.datosAsociado.desTipDoc)
      .replace(/\$\{asociado\.nroIdentificacion\}/g, this.datosAsociado.nitCli)
      .replace(/\$\{asociado\.barrioCorrespondencia\}/g, this.datosAsociado.barRes || '')
      .replace(/\$\{asociado\.direccionCorrespondencia\}/g, this.datosAsociado.dirRes || '')
      .replace(/\$\{asociado\.ciudadCorrespondencia\}/g, this.datosAsociado.ciuRes || '')
      .replace(/\$\{reclamacion\.recCodigo\}/g, this.idProceso)
      .replace(/th:src/g, 'src')
      .replace(/@{\${datosFirma\.src}}/g, this.datosFirma.src)
      .replace(/\$\{datosFirma\.nombre\}/g, this.datosFirma.nombre)
      .replace(/\$\{datosFirma\.cargo\}/g, this.datosFirma.cargo);

    this.cuerpoCarta = strCarta.split('\$\{comment\}');
    this._toggleObservaciones();
  }

}
