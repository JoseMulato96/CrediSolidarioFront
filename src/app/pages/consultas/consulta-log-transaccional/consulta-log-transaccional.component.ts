import { Component, OnInit } from '@angular/core';
import { FormValidate } from '@shared/util';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AlertService, AuthenticationService } from '@core/services';
import { ConsultasTransaccionalService } from '../../../core/services/api-back.services/mimutualauditoria/consultas-transaccional.service';
import { DateUtil } from '@shared/util/date.util';
import { FileUtils } from '@shared/util/file.util';
import { BackFacadeService } from '@core/services/back-facade.service';
import { FrontFacadeService } from '@core/services/front-facade.service';

@Component({
  selector: 'app-consulta-log-transaccional',
  templateUrl: './consulta-log-transaccional.component.html',
})
export class ConsultaLogTransaccionalComponent extends FormValidate implements OnInit {

  // VARIABLES
  form: FormGroup;
  isForm: Promise<any>;
  disabled: boolean;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly alertService: AlertService,
    private readonly backService: BackFacadeService,
    private readonly frontService: FrontFacadeService
  ) {
    super();
  }

  configuracion: any;
  dataFuncionalidad: [] = [];
  ngOnInit() {
    this.getNombresFuncionalidades();
    this.initForm();
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description crea la configuracion de formulario
   */
  private initForm(valores?: boolean) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        numeroId: new FormControl(null),
        nombreFuncionalidad: new FormControl(valores ? this.form.controls.nombreFuncionalidad.value : null),
        fechaInicio: new FormControl(null, Validators.required),
        fechaFin: new FormControl(null, Validators.required),
        usuarioSistema: new FormControl(null),
        asociado: new FormControl(null),
        ipMaquina: new FormControl(null)
      })
    );
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description valida que los datos este completo y dilegenciados
   */
  validateComponents() {

    const fechaInicio = this.form.get('fechaInicio').value;
    const fechaFin = this.form.get('fechaFin').value;
    let fechaMaxima = new Date(this.form.get('fechaInicio').value);
    const fechaSistema = new Date();
    fechaMaxima = new Date(fechaMaxima.setDate(fechaMaxima.getDate() + 30));

    if (fechaInicio > fechaSistema) {
      this.form.controls.fechaInicio.setErrors({ 'incorrect': true });
      this.validateForm(this.form);
      this.translate
        .get('consultaTransaccional.consultaLogTransaccional.alertaFechaIniMayorFehcaSistema')
        .subscribe( texto => {
          this.alertService.warning(texto);
        });
      return false;
    } else if (fechaFin > fechaSistema) {
      this.form.controls.fechaFin.setErrors({ 'incorrect': true });
      this.validateForm(this.form);
      this.translate
        .get('consultaTransaccional.consultaLogTransaccional.alertaFechaFinMayorFehcaSistema')
        .subscribe( texto => {
          this.alertService.warning(texto);
        });
      return false;
    } else if (fechaInicio > fechaFin) {
      this.form.controls.fechaInicio.setErrors({ 'incorrect': true });
      this.translate
        .get('consultaTransaccional.consultaLogTransaccional.fechaInicio.fechaInicioMenorFechaFin')
        .subscribe(text => this.alertService.warning(text));
      return false;
    } else if (fechaFin >= fechaMaxima) {
      this.translate
        .get('consultaTransaccional.consultaLogTransaccional.fechaFin.rangofechaFin')
        .subscribe(text => this.alertService.warning(text));
      return false;
    }

    return true;
  }

  guardar() {

    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.alertService.warning(text);
      });
      return;
    }

    if (!this.validateComponents()) {
      return;
    }

    const form: any = this.form.value;
    const dato: any = {
      fechaInicial: DateUtil.dateToString(form.fechaInicio),
      fechaFinal: DateUtil.dateToString(form.fechaFin)
    };

    if (form.numeroId) {
      dato.usuarioNroIdentificacion = form.numeroId;
    }

    if (form.usuarioSistema) {
      dato.usuario = form.usuarioSistema;
    }

    if (form.nombreFuncionalidad && form.nombreFuncionalidad.codigo !== 0) {
      dato.nombreFuncionalidad = form.nombreFuncionalidad.nombreFuncionalidad;
    }

    if (form.asociado) {
      dato.consultaIdentificacion = form.asociado;
    }

    if (form.ipMaquina) {
      dato.ip = form.ipMaquina;
    }

    const email = this.frontService.authentication.getUser().email;
    this.backService.consultasTransaccional.generarExcel(email, dato).subscribe(
      (resp: any) => {
        if (resp.status === 204) {
          this.translate.get('consultaTransaccional.consultaLogTransaccional.alertaNoDatos').subscribe((mensaje: string) => {
            this.alertService.success(mensaje);
          });
        } else if (resp.status === 201) {
          this.translate.get('consultaTransaccional.consultaLogTransaccional.alertaExcelServidor').subscribe((mensaje: string) => {
            this.alertService.success(mensaje);
          });
        } else {
          const body: any = resp.body;
          FileUtils.downloadXlsFile(body, 'LogTransaccional');
        }
        this._onLimpiar();
      },
      err => {
        if (err.status === 201) {
          this.translate.get('consultaTransaccional.consultaLogTransaccional.alertaExcelServidor').subscribe((mensaje: string) => {
            this.alertService.success(mensaje);
          });
        } else {
          this.alertService.error(err.error.message);
        }
      }
    );
  }

  getNombresFuncionalidades() {
    this.backService.consultasTransaccional.getNombreFuncionalidades('').subscribe((respuesta: any) => {
      const itemSeleccion = {
        codigo: 0,
        estado: '',
        nombreCorto: '',
        nombreFuncionalidad: 'Seleccionar'
      };
      respuesta.push(itemSeleccion);
      this.dataFuncionalidad = respuesta.sort((a, b) => a.codigo - b.codigo);

    });
  }

  _onLimpiar() {
    this.form.reset();
    this.form.controls.nombreFuncionalidad.setValue('');
    this.initForm();
  }
}
