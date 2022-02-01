import { Component, OnInit, OnDestroy } from '@angular/core';
import { SIP_PARAMETROS_TIPO } from '@shared/static/constantes/sip-parametros-tipo';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '@core/store/data.service';
import { Store } from '@ngrx/store';
import { AppState } from '@core/store/reducers';
import * as acciones from '../portafolio.actions';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Subscription, forkJoin } from 'rxjs';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { DatosAsociadoWrapper } from '@core/store/asociado-data.service';
import { DeclaracionSaludVisualConfig } from './declaracion-salud-visual.config';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-declaracion-salud-visual',
  templateUrl: './declaracion-salud-visual.component.html',
})
export class DeclaracionSaludVisualComponent implements OnInit, OnDestroy {

  configuracion: DeclaracionSaludVisualConfig = new DeclaracionSaludVisualConfig();

  datosAsociado: any;
  subs: Subscription[] = [];
  asoNumInt: string;
  form: FormGroup;
  isForm: Promise<any>;
  idProceso: string;
  venta: any;
  declaracionSalud: any;
  dataInitDeclaracionSalud: any;
  imc: number;
  sipParametros: any;

  mostrarAmpliarRespuesta1 = false;
  mostrarAmpliarRespuesta2 = false;
  textoAmpliarRespuesta1: string = null;
  textoAmpliarRespuesta2: string = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly dataService: DataService,
    private readonly store: Store<AppState>,
    private readonly formBuilde: FormBuilder,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) { this.imc = 0; }

  ngOnInit(): void {
    this.store.dispatch(acciones.mostrarMenuConsultas({ datos: false }));
    this.subs.push(
      this.route.params.subscribe(params => {
        this.idProceso = params.codigo;
      })
    );

    this.subs.push(
      this.route.parent.parent.parent.parent.parent.params.subscribe(params => {
        this.asoNumInt = params.asoNumInt;
        if (!this.asoNumInt) {
          return;
        }
      })
    );

    this.subs.push(this.dataService.asociados().asociado.subscribe((respuesta: DatosAsociadoWrapper) => {
      if (!respuesta) { return; }
      this.datosAsociado = respuesta.datosAsociado;
      this.precargarData();
    })
    );
  }

  ngOnDestroy(): void {
    this.store.dispatch(acciones.mostrarMenuConsultas({ datos: true }));
    this.subs.forEach(x => x.unsubscribe());
  }

  precargarData() {
    forkJoin({
      _sipParametros: this.backService.parametro.getParametrosTipo(SIP_PARAMETROS_TIPO.CONFIGURACION_PROCESO_VENTA_INCREMENTO.TIP_COD),
      _venta: this.backService.venta.getVenta({ idProceso: this.idProceso }),
      _declaracionSalud: this.backService.preguntas.getMimPreguntas({
        'sipPreguntasTipo.pretCodigo': SIP_PARAMETROS_TIPO.TIPO_PREGUNTAS.SIP_PARAMETROS.SIPAS,
        preCodSexo: [MIM_PARAMETROS.MIM_GENERO.TODOS, this.datosAsociado.codSex],
        preEstado: SIP_PARAMETROS_TIPO.ESTADO_ACTIVO
      })

    }).subscribe((resp: any) => {
      this.declaracionSalud = resp._declaracionSalud._embedded.mimPreguntas;
      if (resp._venta.content.length > 0) {
        this.venta = resp._venta.content[0];
        this.configuracion.detalleEvento.title = 'Datos de la solicitud';
        this.configuracion.detalleEvento.component.cargarDatos(this.venta);
        this.initForm(this.venta);
      }
      const _mostrarIMC = this.venta && this.venta.mimVentasPreguntasList &&
      this.venta.mimVentasPreguntasList.find(x => x.respuesta === true)
        ? true : false;

      this.sipParametros = resp._sipParametros.sipParametrosList;
      this.validarRespuestasAmplias();

      this.dataInitDeclaracionSalud = {
        declaracionSalud: this.declaracionSalud,
        mostrarAmpliarRespuesta1: this.mostrarAmpliarRespuesta1,
        mostrarAmpliarRespuesta2: this.mostrarAmpliarRespuesta2,
        textoAmpliarRespuesta1: this.textoAmpliarRespuesta1,
        textoAmpliarRespuesta2: this.textoAmpliarRespuesta2,
        mostrarIMC: _mostrarIMC,
        maxDateValue: new Date(),
        imc: this.venta && this.venta.imc ? this.venta.imc : 0,
        deshabilitaFechaDiag : true
      };
    });
  }

  private initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilde.group({
        declaracionSalud: this.formBuilde.group({
          preguntasControlMedico: new FormArray([]),
          diagnostico: [param ? param.diagnostico : null],
          fechaDiagnostico: [param ? param.fechaDiagnostico : null],
          descripcionSecuela: [param ? param.descripcionSecuela : null],
          peso: [param ? param.peso : null],
          estatura: [param ? param.estatura : null],
          observacionDeclaracionSalud : [param ? param.observacionDeclaracionSalud : null]
        })
      })
    );

    this.declaracionSalud.filter(x => {
      const _respuetas = param.mimVentasPreguntasList.find(y => y.mimPreguntas.codigo === x.codigo);
      x.respuesta = _respuetas ? _respuetas.respuesta : false;
    });
    this.declaracionSalud.forEach(element => { this.addPreguntas(element); });

    this.form.controls.declaracionSalud['controls'].preguntasControlMedico.controls.map(x => x.controls.respuesta).forEach(x => x.disable());
    this.form.controls.declaracionSalud['controls'].diagnostico.disable();
    this.form.controls.declaracionSalud['controls'].fechaDiagnostico.disable();
    this.form.controls.declaracionSalud['controls'].descripcionSecuela.disable();
    this.form.controls.declaracionSalud['controls'].peso.disable();
    this.form.controls.declaracionSalud['controls'].estatura.disable();
    this.form.controls.declaracionSalud['controls'].observacionDeclaracionSalud.disable();
    this.form.controls.declaracionSalud['controls'].preguntasControlMedico.controls.map(x => x.disabled);
  }

  private addPreguntas(pregunta: any) {
    const _declaracionSalud = this.form.controls.declaracionSalud['controls'];
    _declaracionSalud.preguntasControlMedico.push(this.formBuilde.group({
      codigo: [pregunta.codigo],
      pregunta: [pregunta.pregunta],
      orden: [pregunta.orden],
      estado: [pregunta.estado],
      respuesta: pregunta.respuesta ? [pregunta.respuesta] : [false]
    }));
  }

  private validarRespuestasAmplias() {
    if (this.declaracionSalud && this.declaracionSalud.find(mimPreguntas => mimPreguntas.respuesta &&
      (mimPreguntas.codigo === SIP_PARAMETROS_TIPO.SIP_PREGUNTAS.PREGUNTA_1
        || mimPreguntas.codigo === SIP_PARAMETROS_TIPO.SIP_PREGUNTAS.PREGUNTA_2
        || mimPreguntas.codigo === SIP_PARAMETROS_TIPO.SIP_PREGUNTAS.PREGUNTA_3
        || mimPreguntas.codigo === SIP_PARAMETROS_TIPO.SIP_PREGUNTAS.PREGUNTA_4
      ))
    ) {
      this.textoAmpliarRespuesta1 = this.sipParametros.find(x => x.sipParametrosPK.codigo === 4).nombre;
      this.mostrarAmpliarRespuesta1 = true;
    }

    if (this.declaracionSalud && this.declaracionSalud.find(mimPreguntas => mimPreguntas.respuesta &&
      (mimPreguntas.codigo === SIP_PARAMETROS_TIPO.SIP_PREGUNTAS.PREGUNTA_5
        || mimPreguntas.codigo === SIP_PARAMETROS_TIPO.SIP_PREGUNTAS.PREGUNTA_6
        || mimPreguntas.codigo === SIP_PARAMETROS_TIPO.SIP_PREGUNTAS.PREGUNTA_7
      ))
    ) {
      this.textoAmpliarRespuesta2 = this.sipParametros.find(x => x.sipParametrosPK.codigo === 5).nombre;
      this.mostrarAmpliarRespuesta2 = true;
    }
  }
}
