import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormValidate } from '@shared/util';
import { masksPatterns } from '@shared/util/masks.util';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-apueba-elimina',
  templateUrl: './aprueba-elimina.component.html',
  styleUrls: ['./aprueba-elimina.component.css']
})
export class ApruebaEliminaComponent extends FormValidate implements OnInit {

  mostrarGuardar: boolean;
  items: any[];
  rechazar: boolean;
  @Input() showForm: boolean;
  @Input() showControlsAprobacion: boolean;
  @Input() observaciones: any;
  @Input() tituloModal: string;
  @Input() tipoProceso: string;
  @Input() esDirector: boolean;
  @Output() datosForm = new EventEmitter<any>();
  @Output() apruebaRechazaSolicitud = new EventEmitter<any>();
  @Output() mostrarModal = new EventEmitter<boolean>();

  form: FormGroup;
  isForm: Promise<any>;
  _subs: Subscription[] = [];
  solicitud: string;
  codigoCobertura: string;
  idProceso: string;
  patterns = masksPatterns;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly alertService: AlertService,
  ) {
    super();
    this.translate.get('administracion.protecciones.coberturas.observacionesInactivacion').subscribe(texto => {
      this.tituloModal = this.tituloModal || texto;
    });
    this.esDirector = true;
  }

  ngOnInit() {
    this._initForm();
    if (this.showForm) {
      this.mostrarGuardar = !this.mostrarGuardar;
    }
  }

  _rechazarSolicitud() {
    this.rechazar = false;
    this.showForm = true;
    this._toggleObservaciones(true);
  }

  _apruebaSolicitud() {
    let mensaje: any;
    if (this.esDirector) {
      if (this.tipoProceso === UrlRoute.SOLICITUD_APROBACION) {
        mensaje = 'global.confirmacionCreacion';
      } else if (this.tipoProceso === UrlRoute.ADMINISTRACION_ACTUARIA_CONFIGURAR) {
        mensaje = 'global.confirmarConfiguración';
      } else {
        mensaje = 'administracion.protecciones.coberturas.alertas.confirmacionEliminacion';
      }
    } else {
      mensaje = 'global.confirmacionRechazo';
    }
    this.translate.get(mensaje).subscribe((validateForm: string) => {
      this.alertService.confirm(validateForm).then(confirmacion => {
        if (confirmacion) {
          this.rechazar = true;
          this._apruebaRechazaSolicitud(true);
        }
      });
    });
  }

  verObservaciones() {
    this.showForm = false;
    this._toggleObservaciones();
  }

  _apruebaRechazaSolicitud(rechaza: boolean) {
    const datos = {
      aprobar: rechaza,
      comment: rechaza ? '' : this.form.controls.observacion.value
    };
    this.apruebaRechazaSolicitud.emit(datos);
  }

  _toggleObservaciones(showModal?: boolean) {
    this.form.reset();
    if (!showModal) {
      this.rechazar = null;
    }
    this.mostrarGuardar = !this.mostrarGuardar;
    this.mostrarModal.emit(showModal);
  }

  _initForm(cobertura?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        codigo: new FormControl(cobertura ? cobertura.codigo : null),
        nombre: new FormControl(cobertura ? cobertura.nombre : null, [Validators.required]),
        observacion: new FormControl(cobertura ? cobertura.observacion : null, [Validators.required, Validators.maxLength(999), Validators.pattern('.*\\S.*[a-zA-z0-9-zÀ-ÿ\u00f1\u00d1 ]')]),
      }));

    this.form.controls.codigo.disable();
    this.form.controls.nombre.disable();

  }

  _guardarObservacion() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((validateForm: string) => {
        this.alertService.warning(validateForm);
      });
      return;
    }
    if (this.rechazar === undefined || this.rechazar === null) {
      const datos = {
        comment: this.form.controls.observacion.value
      };
      this.datosForm.emit(datos);
    } else {
      this._apruebaRechazaSolicitud(false);
    }
  }
}
