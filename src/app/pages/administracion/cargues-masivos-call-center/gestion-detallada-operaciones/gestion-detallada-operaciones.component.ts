import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BackFacadeService } from '@core/services/back-facade.service';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { TranslateService } from '@ngx-translate/core';
import { GENERALES } from '@shared/static/constantes/constantes';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormValidate } from '@shared/util';
import { DateUtil } from '@shared/util/date.util';
import { FileUtils } from '@shared/util/file.util';
import { masksPatterns } from '@shared/util/masks.util';
import { ObjectUtil } from '@shared/util/object.util';
import { Table } from 'primeng/table';
import { forkJoin } from 'rxjs';
import { MimPreventaService } from '../../services/mim-preventa.service';

@Component({
  selector: 'app-gestion-detallada-operaciones',
  templateUrl: './gestion-detallada-operaciones.component.html',
  styleUrls: ['./gestion-detallada-operaciones.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GestionDetalladaOperacionesComponent extends FormValidate implements OnInit {

  scrollableCols: any[];
  formCheck: FormGroup;
  checkedSelectTodos = new FormControl('');
  seleccionar = new FormControl('');

  form: FormGroup;
  fb: FormGroup;
  formRechazar: FormGroup;
  isForm: Promise<any>;

  codigo: any;
  // registrosModificados: any[];
  registrosSeleccionados: any[];
  today: Date;
  cualProyectoVida: any;
  habilitarBotonRechazar: boolean;
  habilitarBotonAplicar: boolean;
  mostrarModal: boolean;
  causaNegacion: any;
  preventas: any;
  preventasAll: any;
  paginas = 0;
  totalRegistros = 0;
  regVisto: number;
  filtrosActivos: any[];
  causaNegaciones: any;

  patterns = masksPatterns;

  constructor(
    private readonly translateService: TranslateService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService,
    private readonly mimPreventaService: MimPreventaService
  ) {
    super();

    this.registrosSeleccionados = [];
    this.today = new Date();
    this.causaNegacion = [];
    this.preventas = [];
    this.preventasAll = [];
    this.filtrosActivos = [];
    this.causaNegaciones = [];

    this.setColumnHeader();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.codigo = params.codigo;
      this.getDataInit();
    });


    this.checkedSelectTodos.valueChanges.subscribe(item => {
      this.habilitarBotonRechazar = item;
      this.registrosSeleccionados = [];
      if (item) {
        this.preventas.map(x => {
          x.modificado = true;
          this.registrosSeleccionados.push(x);
        });

      } else {
        this.preventas.map(x => x.modificado = null);
      }
      const cantidadSeleccionados = this.preventas.filter(x => x.modificado === true).length;
      this.habilitarBotonAplicar = cantidadSeleccionados > 1 ? true : false;
      this.habilitarBotonRechazar = cantidadSeleccionados > 1 ? true : false;
    });

  }

  private getDataInit() {
    const param: any = {
      'mimCargueSolicitudDetalle.mimCargueSolicitud.jobExecutionId': this.codigo,
      'mimEstadoPreventa.codigo': MIM_PARAMETROS.MIM_ESTADO_PRE_VENTA.DISPONIBLE
    };
    forkJoin({
      _proyectosVida: this.backService.proyectoVida.getProyectosVida({ estado: true }),
      _preventa: this.mimPreventaService.getMimPreventa(param)
    }).subscribe(respuesta => {

      if (respuesta._preventa.content === null || respuesta._preventa.content <= 0) {
        this.atras();
      }

      this.cualProyectoVida = respuesta._proyectosVida.content;
      this.preventas = this.mapearPrecarga(respuesta._preventa.content);
      this.preventasAll = this.mapearPrecarga(respuesta._preventa.content);
      this.initForm();
    }, err => {
      this.frontService.alert.error(err.error.message);
    });
  }

  private initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        seleccionar: this.formBuilder.array([]),
        codigoCargue: new FormControl(param ? param.codigoCargue : null),
        numeroIdentificacion: new FormControl(param ? param.numeroIdentificacion : null),
        fechaSolicitud: new FormControl(param ? param.fechaSolicitud : null),
        correoElectronico: new FormControl(param ? param.correoElectronico : null),
        promotorComercial: new FormControl(param ? param.promotorComercial : null),
        autorizaDatosPersonales: new FormControl(param ? param.autorizaDatosPersonales : null),
        codigoPlan: new FormControl(param ? param.codigoPlan : null),
        proyectoVida: new FormControl(param ? param.proyectoVida : null),
        otroProyectoVida: new FormControl(param ? param.otroProyectoVida : null),
        ingresosMensuales: new FormControl(param ? param.ingresosMensuales : null),
        codigoPlanCobertura: new FormControl(param ? param.codigoPlanCobertura : null),
        valorProteccion: new FormControl(param ? param.valorProteccion : null),
        preguntaUno: new FormControl(param ? param.preguntaUno : false),
        preguntaDos: new FormControl(param ? param.preguntaDos : false),
        preguntaTres: new FormControl(param ? param.preguntaTres : false),
        preguntaCuatro: new FormControl(param ? param.preguntaCuatro : false),
        preguntaCinco: new FormControl(param ? param.preguntaCinco : false),
        preguntaSeis: new FormControl(param ? param.preguntaSeis : false),
        preguntaSiete: new FormControl(param ? param.preguntaSiete : false),
        diagnostico: new FormControl(param ? param.diagnostico : null),
        fechaDiagnostico: new FormControl(param ? param.fechaDiagnostico : null),
        descripcionSecuela: new FormControl(param ? param.descripcionSecuela : null),
        estatura: new FormControl(param ? param.estatura : null),
        peso: new FormControl(param ? param.peso : null),
        observacionSalud: new FormControl(param ? param.observacionSalud : null)
      }));
  }

  rowSeleccionado(row) {
    if (!this.registrosSeleccionados.find(x => x.codigo === row.codigo)) {
      row.modificado = true;
      this.registrosSeleccionados.push(row);
    } else {
      row.modificado = null;
    }
    const cantidadSeleccionados = this.preventas.filter(x => x.modificado === true).length;
    this.habilitarBotonAplicar = cantidadSeleccionados > 1 ? true : false;
    this.habilitarBotonRechazar = cantidadSeleccionados > 1 ? true : false;
  }

  private setColumnHeader() {
    const textos = 'administracion.cargueMasivoCallCenter.bandejaGestionDetalladaOperaciones.grid.';
    this.scrollableCols = [
      { field: 'acciones', header: textos + 'acciones', width: '130' },

      { field: 'identificacionAsociado', header: textos + 'identificacionAsociado', width: '110', typeFilter: 'text' },
      { field: 'fechaSolicitud', header: textos + 'fechaSolicitud', width: '130', typeFilter: 'text' },
      { field: 'correoElectronico', header: textos + 'correoElectronico', width: '180' },
      { field: 'promotorComercial', header: textos + 'promotorComercial', width: '110', typeFilter: 'text' },
      { field: 'autorizaDatosPersonales', header: textos + 'autorizoTratamientoDatosSensibles', width: '100' },
      { field: 'codigoPlan', header: textos + 'codigoPlan', width: '80' },
      { field: 'proyectoVida', header: textos + 'proyectoVida', width: '160' },
      { field: 'otroProyectoVida', header: textos + 'otroProyectoVida', width: '100' },
      { field: 'ingresosMensuales', header: textos + 'ingresosMensuales', width: '100', typeFilter: 'text' },
      { field: 'codigoPlanCobertura', header: textos + 'codigoPlanCobertura', width: '100' },
      { field: 'valorProteccion', header: textos + 'valorProteccion', width: '100', typeFilter: 'text' },
      { field: 'preguntaUno', header: textos + 'pregunta1DeclaracionSalud', width: '100' },
      { field: 'preguntaDos', header: textos + 'pregunta2DeclaracionSalud', width: '100' },
      { field: 'preguntaTres', header: textos + 'pregunta3DeclaracionSalud', width: '100' },
      { field: 'preguntaCuatro', header: textos + 'pregunta4DeclaracionSalud', width: '100' },
      { field: 'preguntaCinco', header: textos + 'pregunta5DeclaracionSalud', width: '100' },
      { field: 'preguntaSeis', header: textos + 'pregunta6DeclaracionSalud', width: '100' },
      { field: 'preguntaSiete', header: textos + 'pregunta7DeclaracionSalud', width: '100' },
      { field: 'diagnostico', header: textos + 'diagnostico', width: '160' },
      { field: 'fechaDiagnostico', header: textos + 'fechaDiagnostico', width: '120' },
      { field: 'descripcionSecuela', header: textos + 'descripcionSecuela', width: '180' },
      { field: 'estatura', header: textos + 'estatura', width: '100' },
      { field: 'peso', header: textos + 'peso', width: '100' },
      { field: 'observacionDeclaracionSalud', header: textos + 'observacionDeclaracionSalud', width: '180' }
    ];
  }

  atras() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINISTRACION_CARGUES_MASIVOS_CALL_CENTER
    ]);
  }

  onEditInit(event): void {
    const valor = (event.field === 'preguntaUno' || event.field === 'preguntaDos' || event.field === 'preguntaTres' || event.field === 'preguntaCuatro'
      || event.field === 'preguntaCinco' || event.field === 'preguntaSeis' || event.field === 'preguntaSiete') ?
      parseInt(event.data[event.field]) : event.data[event.field];
    this.form.controls[event.field].setValue(valor);
  }

  onEditCancel(): void {
    // do nothing
  }

  onEditComplete(dt: Table, event: any): void {

    this.preventas.map(x => {
      if (x.codigo === event.data.codigo) {
        x.modificado = true;
        x[event.field] = this.form.controls[event.field].value;
      }
    });

    if (!this.registrosSeleccionados.find(x => x.codigo === event.data.codigo)) {
      this.registrosSeleccionados.push(event.data);
    }
    const cantidadSeleccionados = this.preventas.filter(x => x.modificado === true).length;
    this.habilitarBotonAplicar = cantidadSeleccionados > 1 ? true : false;
    this.habilitarBotonRechazar = cantidadSeleccionados > 1 ? true : false;
  }

  rechazar(param?: any) {
    if (param) {
      this.registrosSeleccionados = [];
      this.registrosSeleccionados.push(param);
    }

    const paramRechazo = {
      'mimFaseFlujo.codigo': MIM_PARAMETROS.MIM_FASE_FLUJO.PRE_REGISTRO,
      estado: true
    };
    forkJoin({
      razonNegacion: this.backService.razonNegacion.getRazonesNegacion(paramRechazo),
      razonAnulacion: this.backService.razonAnulacion.getRazonesAnulacion(paramRechazo)
    }).subscribe((resp: any) => {
      const negacion = resp.razonNegacion._embedded.mimRazonNegacion.map(x => ({ ...x, tipo: 'negacion' }));
      const anulacion = resp.razonAnulacion._embedded.mimRazonAnulacion.map(x => ({ ...x, tipo: 'anulacion' }));
      this.causaNegaciones = Object.assign(negacion, anulacion);
      this.toggleModal();
    });
  }

  aplicar(producto?: any) {
    if (producto) {
      this.registrosSeleccionados = [];
      this.registrosSeleccionados.push(producto);
    }
    const param = {
      jobExecutionId: this.codigo,
      mimPreventaDtoList: this.registrosSeleccionados
    };
    this.mimPreventaService.postMimPreventaAplicarRegistros(param).subscribe(() => {
      this.translateService.get('administracion.cargueMasivoCallCenter.bandejaGestionDetalladaOperaciones.alertas.registroCompletado').subscribe(mensaje => {
        this.frontService.alert.success(mensaje).then(() => {
          this.getDataInit();
        });
      });
    }, err => this.frontService.alert.error(err.error.message));
  }

  private initformObservacion() {
    this.formRechazar = this.formBuilder.group({
      causaNegacion: new FormControl(null, [Validators.required]),
      observacion: new FormControl(null, [Validators.required, Validators.maxLength(999), Validators.pattern('.*\\S.*[a-zA-z0-9-zÀ-ÿ\u00f1\u00d1 ]')])
    });
  }

  toggleModal() {
    this.initformObservacion();
    this.mostrarModal = !this.mostrarModal;
  }


  paginar() {
    this.totalRegistros = this.preventas.length;
    this.regVisto = Math.min(
      (this.paginas + 1) * 10,
      this.totalRegistros
    );
    const _rangoInicial = this.paginas === 0 ? 0 : this.paginas * 10;
    this.preventas = this.preventas.slice(_rangoInicial, this.regVisto);
  }

  /**
     * @description Redirige a la pagina inicial de la tabla
     */
  clickInicio() {
    if (this.paginas) {
      this.paginas = 0;
      this.paginar();
    }
  }

  /**
   * @description Redirige a la ultima pagina de la tabla.
   */
  clickFin() {
    if (
      (this.paginas + 1) * 10 <
      this.totalRegistros
    ) {
      const div: number = this.totalRegistros / 10;

      this.paginas = Math.floor(div);

      const mod: number =
        this.totalRegistros % 10;
      this.paginas += mod === 0 ? -1 : 0;

      this.paginar();
    }
  }

  /**
   * @description Redirige a la siguiente pagina
   */
  clickSiguiente() {
    if (
      (this.paginas + 1) * 10 <
      this.totalRegistros
    ) {
      this.paginas++;
      this.paginar();
    }
  }

  /**
  * @description Redirige a la pagina anterior
  */
  clickAtras() {
    if (this.paginas) {
      this.paginas--;
      this.paginar();
    }
  }

  private mapearPrecarga(datos: any) {
    return datos.map(row => {
      this.scrollableCols.forEach(x => {
        if (!row.hasOwnProperty(x)) {

          row[x] = row.mimCargueSolicitudDetalleDto.datosEntrada && JSON.parse(row.mimCargueSolicitudDetalleDto.datosEntrada).hasOwnProperty(x)
            ? JSON.parse(row.mimCargueSolicitudDetalleDto.datosEntrada)[x] : null;
        }
      });
      return { ...row };
    });
  }

  /*
  * Filtros
  */
  /**
   * @description extrae los valores sin repetirlos
   */
  filterTable(dt: Table, event: any, col: string) {
    dt.filter(event, col, 'contains');
  }

  guardarRechazar() {
    if (this.formRechazar.invalid) {
      this.validateForm(this.form);
      this.translateService.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }
    const _tipo = this.formRechazar.controls.causaNegacion.value.tipo;
    const _valor = this.formRechazar.controls.causaNegacion.value;
    const param = {
      jobExecutionId: this.codigo,
      observacion: this.formRechazar.controls.observacion.value,
      mimRazonAnulacionCallCenter: _tipo === 'anulacion' ? _valor : null,
      mimRazonNegacionCallCenter: _tipo === 'negacion' ? _valor : null,
      mimPreventaDtoList: this.registrosSeleccionados
    };
    this.mimPreventaService.postMimPreventaRechazarCargueDetalle(param).subscribe(() => {
      this.translateService.get('administracion.cargueMasivoCallCenter.bandejaGestionDetalladaOperaciones.alertas.registroRechazo').subscribe(mensaje => {
        this.frontService.alert.success(mensaje).then(() => {
          this.getDataInit();
        });
        this.toggleModal();
      });
    }, err => this.frontService.alert.error(err.error.message));
  }

  exportarLogErrores(producto: any) {
    // Validamos si hay datos.
    if (null === producto || undefined === producto || producto.mimCargueSolicitudDetalleDto === undefined
      || producto.mimCargueSolicitudDetalleDto === null) {
      return;
    }

    const headers: string[] = [
      'administracion.cargueMasivoCallCenter.bandejaGestionDetalladaOperaciones.excel.nombreCampo',
      'administracion.cargueMasivoCallCenter.bandejaGestionDetalladaOperaciones.excel.categoriaError',
      'administracion.cargueMasivoCallCenter.bandejaGestionDetalladaOperaciones.excel.error'
    ];
    ObjectUtil.traducirObjeto(headers, this.translateService);

    const columnas: string[] = [
      'nombreCampo',
      'categoriaError',
      'error'
    ];

    const _mensaje = producto.mimCargueSolicitudDetalleDto.mensaje || producto.mimCargueSolicitudDetalleDto.mimCargueSolicitudDto.mensajeSalida;
    const items = _mensaje.split('|');
    const datos = items.map(x => {
      const _datos = x.split('&');
      return {
        nombreCampo: _datos.length > 1 ? _datos[0] : null,
        categoriaError: _datos.length > 1 ? _datos[1] : null,
        error: _datos.length > 1 ? _datos[2] : _datos[0],
      };
    });

    this.exportarExcel(
      `log_errores_${DateUtil.dateToString(new Date(), GENERALES.FECHA_HORA_PATTERN_EXCEL)}`,
      {
        headers,
        columnas,
        datos
      }
    );
  }

  private exportarExcel(nombre, datos: any = {}) {
    this.backService.utilidades.exportarExcel2(nombre, datos).subscribe(respuesta => {
      const body: any = respuesta.body;
      FileUtils.downloadXlsFile(body, nombre);
    });
  }
}
