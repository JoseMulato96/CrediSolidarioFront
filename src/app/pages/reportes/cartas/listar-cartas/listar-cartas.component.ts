import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BackFacadeService } from '@core/services/back-facade.service';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { TranslateService } from '@ngx-translate/core';
import { MimGeneraCartaModalComponent } from '@shared/components/mim-genera-carta-modal/mim-genera-carta-modal.component';
import { CustomValidators, FormValidate } from '@shared/util';
import { DateUtil } from '@shared/util/date.util';
import { FileUtils } from '@shared/util/file.util';
import { ObjectUtil } from '@shared/util/object.util';
import { Subscription } from 'rxjs';
import { ListarCartasConfig } from './listar-cartas.config';

@Component({
  selector: 'app-listar-cartas',
  templateUrl: './listar-cartas.component.html'
})

export class ListarCartasComponent extends FormValidate implements OnInit {

  static CODIGO_PROCESO_TIPO_FILTRO = 1;
  static NUMERO_IDENTIFICACION_TIPO_FILTRO = 2;
  static FECHA_INICIO_FECHA_FIN_TIPO_FILTRO = 3;


  configuracion: ListarCartasConfig = new ListarCartasConfig();

  form: FormGroup; isForm: Promise<any>;
  botonDisabled = false;
  subs: Subscription[] = [];
  paramsBusqueda: any = {};
  listaCartas: any;
  _maxDate: Date = new Date();
  datosSeleccionados: any;
  cartas: any = [];

  cartaEditada: boolean;

  @ViewChild(MimGeneraCartaModalComponent) modalCarta: MimGeneraCartaModalComponent;

  constructor(public formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly router: Router,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
    this.initFormGroup();
  }

  ngOnInit() {
    // do nothing
  }

  private initFormGroup() {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        tipoFiltro: new FormControl(null),
        codigoProceso: new FormControl(null, [Validators.required]),
        numeroIdentificacion: new FormControl(null, [Validators.required]),
        fechaInicioFechaFin: new FormControl(null, [Validators.required, CustomValidators.RangoFechaDias(30)]),
      },
        { validators: [CustomValidators.RangoFechaObligatorio] }
      ));

    this.onChanges();
    this.form.controls.tipoFiltro.setValue(1);
  }

  private onChanges() {
    this.form.controls.tipoFiltro.valueChanges.subscribe(tipoFiltro => {
      switch (tipoFiltro) {
        case ListarCartasComponent.FECHA_INICIO_FECHA_FIN_TIPO_FILTRO:
          this.form.controls.codigoProceso.disable();
          this.form.controls.codigoProceso.reset();
          this.form.controls.numeroIdentificacion.disable();
          this.form.controls.numeroIdentificacion.reset();
          this.form.controls.fechaInicioFechaFin.enable();
          break;
        case ListarCartasComponent.NUMERO_IDENTIFICACION_TIPO_FILTRO:
          this.form.controls.codigoProceso.disable();
          this.form.controls.codigoProceso.reset();
          this.form.controls.numeroIdentificacion.enable();
          this.form.controls.fechaInicioFechaFin.disable();
          this.form.controls.fechaInicioFechaFin.reset();
          break;
        case ListarCartasComponent.CODIGO_PROCESO_TIPO_FILTRO:
          this.form.controls.codigoProceso.enable();
          this.form.controls.numeroIdentificacion.disable();
          this.form.controls.numeroIdentificacion.reset();
          this.form.controls.fechaInicioFechaFin.disable();
          this.form.controls.fechaInicioFechaFin.reset();
          break;
      }
    });
  }

  onLimpiar() {
    this.router.navigate([this.router.url.split('?')[0]], {});
    this._limpiar();
  }

  _limpiar() {
    this.form.reset();
    this.initFormGroup();

    // Limpiamos el set de datos de la tabla.
    if (this.configuracion.gridCartas.component) {
      this.configuracion.gridCartas.component.limpiar();
    } else {
      this.configuracion.gridCartas.datos = [];
    }
  }

  private validarForm() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate
        .get('global.validateForm')
        .subscribe(texto => {
          this.frontService.alert.warning(texto);
        });
      return false;
    }

    return true;
  }

  obtenerCartas() {

    if (!this.validarForm()) {
      return;
    }

    const params: any = { isPaged: false };

    if (this.form.controls.tipoFiltro.value === ListarCartasComponent.CODIGO_PROCESO_TIPO_FILTRO) {
      params.codigoProceso = this.form.controls.codigoProceso.value;
    } else if (this.form.controls.tipoFiltro.value === ListarCartasComponent.NUMERO_IDENTIFICACION_TIPO_FILTRO) {
      params.nroIdentificacion = this.form.controls.numeroIdentificacion.value;
    } else if (this.form.controls.tipoFiltro.value === ListarCartasComponent.FECHA_INICIO_FECHA_FIN_TIPO_FILTRO) {
      params.fechaInicio = DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy');
      params.fechaFin = DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy');
    }

    this.backService.generarCarta.obtenerCartas(params).subscribe(respuesta => {

      this.configuracion.gridCartas.component.limpiar();
      if (!respuesta.content || !respuesta.content.length) {
        const msg = 'global.noSeEncontraronRegistrosMensaje';
        this.translate
          .get(msg)
          .subscribe((response: string) => {
            this.frontService.alert.info(response);
          });
        return;
      }
      this.listaCartas = respuesta.content;
      this.configuracion.gridCartas.component.cargarDatos(
        this.transformarDatos(respuesta.content),
        {
          maxPaginas: respuesta.totalPages,
          pagina: respuesta.number,
          cantidadRegistros: respuesta.totalElements
        }
      );

    }, error => {
      this.frontService.alert.warning(error.error.message);
    });

  }

  private transformarDatos(datos: any[]) {
    // NOTA: Debido a que debemos soportar la menra en que se generaban cartas en producción
    // y los cambios realizados al nuevo modelo de clasificación de solicitudes, se genera
    // una estructura de mimSolicitud y mimTipoSolicitud vacia.
    const datosTransformados = [];
    for (let dato of datos) {
      datosTransformados.push({
        ...dato,
        mimSolicitud: dato.mimSolicitud === null || dato.mimSolicitud === undefined ?
          { mimTipoSolicitud: {} } : dato.mimSolicitud
      });
    }
    return datosTransformados;

  }

  _actualizarCarta(cartas: any) {
    this.backService.generarCarta.actualizarCarta(cartas).subscribe((resp: any) => {
      this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          // Redireccionamos a la pantalla de listar
          this.obtenerCartas();
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  _onClickCeldaElement($event: any) {
    if ($event.col.key === 'editar') {
      this._alEditar($event.dato);
    } else if ($event.col.key === 'ver') {
      this._alVer($event.dato);
    } else if ($event.col.key === 'imprimir') {
      this._alImprimir($event.dato);
    } else {
      this._alValidar($event.dato);
    }
  }

  _alEditar($event: any) {
    const carta = $event;
    this.backService.parametroCarta.obtenerCarta(carta.codigoParametroCarta)
      .subscribe((tipoCarta: any) => {
        tipoCarta.contenido = tipoCarta.base64Contenido;
        this.modalCarta.esCreacion = false;
        this.modalCarta.asoNumInt = carta.asoNumInt;
        this.modalCarta.datosCarta = carta;
        this.modalCarta.tipoCarta = tipoCarta;
        this.modalCarta._getDatosDelAsociado();
      }, (err) => {
        this.frontService.alert.warning(err.error.message);
      });

  }

  cartaGuardada(event) {
    this.cartaEditada = true;
    this.obtenerCartas();
  }

  _alVer($event: any) {
    const carta = $event;
    this.backService.generarCarta.descargarCartaFTP(carta.codigoCartasFTP)
      .subscribe(item => {
        const blob = new Blob([item.body], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(blob);
        window.open(fileURL, '', 'width=' + window.outerWidth + ',height=' + window.outerHeight + ',left=0,top=0');
      }, async (err) => {
        const message = JSON.parse(await err.error.text()).message;
        this.frontService.alert.warning(message);
      });
  }

  _alImprimir($event: any) {
    const carta = $event;
    this.backService.generarCarta.descargarCartaFTP(carta.codigoCartasFTP)
      .subscribe(item => {
        const blob = new Blob([item.body], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(blob);
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = fileURL;
        document.body.appendChild(iframe);
        iframe.contentWindow.print();
      }, async (err) => {
        const message = JSON.parse(await err.error.text()).message;
        this.frontService.alert.warning(message);
      });
  }

  _alValidar($event: any) {
    this.translate.get('reportes.cartas.alerts.validar').subscribe((mensaje: string) => {
      this.frontService.alert.confirm(mensaje, 'info').then((desition: any) => {
        if (desition === true) {
          this.cartas = [];
          const carta = $event;
          const datosCarta = {
            codigo: carta.codigo,
            codigoParametroCarta: carta.codigoParametroCarta,
            codigoProceso: carta.codigoProceso,
            codigoCartasFTP: carta.codigoCartasFTP,
            contenido: carta.contenido,
            validado: carta.validado = true,
            codigoTipoSolicitud: carta.codigoTipoSolicitud,
            asoNumInt: carta.asoNumInt
          };

          this.cartas.push(datosCarta);
          this._actualizarCarta(this.cartas);
        }
      });
    });
  }

  _OnDeseleccionar() {
    this.validarBotones();
  }

  _OnSeleccionar() {
    this.validarBotones();
  }

  private validarBotones() {
    this.datosSeleccionados = this.configuracion.gridCartas.component.obtenerTodosSeleccionados();
    this.botonDisabled = this.datosSeleccionados.length > 0;
  }

  _onClickGenerarPDF() {
    if (this.datosSeleccionados.length === 1) {
      const codigoCartasFTP = this.datosSeleccionados[0].codigoCartasFTP;
      const nombreArchivoCartasFTP = this.datosSeleccionados[0].nombreArchivoCartasFTP;

      this.backService.generarCarta.descargarCartaFTP(codigoCartasFTP)
        .subscribe(carta => {
          const body: any = carta.body;
          FileUtils.downloadPdfFile(body, nombreArchivoCartasFTP);
        });
    } else {
      const codigoCartasFTPList = [];
      const nombreZip = 'ConsultaCartas';
      this.datosSeleccionados
        .forEach((carta: any) => {
          codigoCartasFTPList.push(carta.codigoCartasFTP);
        });

      this.backService.generarCarta.descargarZipCartaFTP(nombreZip, codigoCartasFTPList)
        .subscribe(carta => {
          const body: any = carta.body;
          FileUtils.downloadZipFile(body, nombreZip);
        });
    }
  }

  _onClickExportarExcel() {
    const headers: string[] = [
      'reportes.cartas.grid.noCarta',
      'reportes.cartas.grid.noEvento',
      'reportes.cartas.grid.nombreCarta',
      'reportes.cartas.grid.evento',
      'reportes.cartas.grid.asociado',
      'reportes.cartas.grid.cedula',
      'reportes.cartas.grid.fechaCreacion'
    ];

    const columnas: string[] = [
      'noCarta',
      'noEvento',
      'nombreCarta',
      'evento',
      'asociado',
      'cedula',
      'fechaCreacion'
    ];
    ObjectUtil.traducirObjeto(headers, this.translate);

    // Se mapean solo las columnas que se quieren mostrar en el archivo Excel
    const datos = this.datosSeleccionados.map(x =>
    ({
      noCarta: x.codigoCartasFTP,
      noEvento: x.codigoProceso,
      nombreCarta: x.nombreParametroCarta,
      evento: x.nombreTipoSolicitud,
      asociado: x['asociado.nombreAsociado'],
      cedula: x['asociado.nitCli'],
      fechaCreacion: x.fechaCreacion
    }));

    this.exportarExcel(
      `Lista_cartas_${DateUtil.dateToString(new Date())}`, {
      headers,
      columnas,
      datos
    });
  }

  private exportarExcel(nombre, datos: any = {}) {
    this.backService.utilidades.exportarExcel(nombre, datos).subscribe(respuesta => {
      const body: any = respuesta.body;
      FileUtils.downloadXlsFile(body, nombre);
    });
  }

  _onClickValidar() {

    this.translate.get('reportes.cartas.alerts.validarTodos').subscribe((mensaje: string) => {
      this.frontService.alert.confirm(mensaje, 'info').then((desition: any) => {
        if (desition === true) {
          this.cartas = this.datosSeleccionados
            .filter(carta => carta.validado === 'false')
            .map((carta: any) => {
              return {
                codigo: carta.codigo,
                codigoParametroCarta: carta.codigoParametroCarta,
                codigoProceso: carta.codigoProceso,
                codigoCartasFTP: carta.codigoCartasFTP,
                contenido: carta.contenido,
                validado: carta.validado = true,
                codigoTipoSolicitud: carta.codigoTipoSolicitud,
                asoNumInt: carta.asoNumInt
              };
            });

          this._actualizarCarta(this.cartas);
        }
      });
    });
  }

}
