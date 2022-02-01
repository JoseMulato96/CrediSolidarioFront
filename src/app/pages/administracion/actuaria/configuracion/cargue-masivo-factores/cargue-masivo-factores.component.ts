import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FrontFacadeService, BackFacadeService } from '@core/services';
import { AppState } from '@core/store/reducers';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { GENERALES } from '@shared/static/constantes/constantes';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormValidate } from '@shared/util';
import { DateUtil } from '@shared/util/date.util';
import { masksPatterns } from '@shared/util/masks.util';
import * as FileSaver from 'file-saver';
import { forkJoin } from 'rxjs';
import * as actions from '../configuracion.actions';
import { CargueMasivoFactoresConfig } from './cargue-masivo-factores.config';

@Component({
  selector: 'app-cargue-masivo-factores',
  templateUrl: './cargue-masivo-factores.component.html',
  styleUrls: ['./cargue-masivo-factores.component.css']
})
export class CargueMasivoFactoresComponent extends FormValidate implements OnInit {

  isForm: Promise<any>;
  form: FormGroup;
  configuracion: CargueMasivoFactoresConfig = new CargueMasivoFactoresConfig();
  coberturas: any;
  tiposFactores: any[];
  tiposFactoresAll: any[];
  estructuraCargues: any[];
  archivoCarga: File;
  formData: FormData;
  extencionesPermitidas = ['xlsx', 'xls'];
  nombreDocumento: string;
  patterns = masksPatterns;
  cargarDocumento: boolean;
  codigoPlan: string;
  allCargues: any[];
  users = [];
  valorDefectoTCargue: any = null;
  textoInformativoLabel: string;
  isContribucion: boolean = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly store: Store<AppState>,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
    this.nombreDocumento = 'Selecciones';
    this.cargarDocumento = true;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.codigoPlan = params.codigoPlan;
      forkJoin({
        _coberturas: this.backService.planCobertura.getPlanesCoberturas({
          'mimEstadoPlanCobertura.codigo': [MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.ACTIVO, MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.PROCESO],
          'mimPlan.codigo': this.codigoPlan
        }),
        _tipoFactores: this.backService.tipoFactor.getTipoFactores({}),
        _estructuraCargue: this.backService.estructuraCargue.getEstructuras({})
      }).subscribe(resp => {
        this.coberturas = resp._coberturas.content;
        this.store.dispatch(actions.coberturasCargueMasivo({ datos: this.coberturas }));
        this.tiposFactoresAll = resp._tipoFactores._embedded.mimTipoFactor;
        this.estructuraCargues = resp._estructuraCargue._embedded.mimEstructuraCargue
        this.store.dispatch(actions.factoresCargueMasivo({ datos: this.tiposFactores }));
        this._initForm();
        this.obtener();
      }, (err) => {
        this.frontService.alert.error(err.error.message);
      });
    });
  }

  _initForm(param?: any) {

    for (let dataEstructuraCargue of this.estructuraCargues) {
      if (dataEstructuraCargue.nombre === GENERALES.MIM_ESTRUCTURA_CARGUE.TIPO_ESTRUCTURA_DEFECTO) {
        this.valorDefectoTCargue = this.tipoCargueSelected(dataEstructuraCargue.codigo);
        this.textoInformativoLabel = dataEstructuraCargue.nombreCorto;
      }
    }


    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        codigo: new FormControl(param ? param.codigo : null),
        cobertura: new FormControl(param && param.codigo ? this.getCobertura(param.codigo) : null, [Validators.required]),
        tipoFactor: new FormControl(param && param.mimTipoFactor ? this.getTipoFactor(param.mimTipoFactor.codigo) : null),
        estructuraCargue: new FormControl(param && param.mimTipoFactor ? this.tipoCargueSelected(param.mimEstructuraCargue.codigo) : this.valorDefectoTCargue, [Validators.required]),
        edadMinima: new FormControl(param ? param.edadMinima : null),
        edadMaxima: new FormControl(param ? param.edadMaxima : null),
        descripcion: new FormControl(param ? param.descripcion : null, [Validators.required]),
        archivo: new FormControl(null),
        fechaInicioFin: new FormControl(param ? this.getFechaInicioFin(param.fechaInicio, param.fechaFin) : null, [Validators.required])
      })
    );


    this.form.controls.codigo.disable();
    this.cargarDocumento = true;
    this._change();
  }

  _change() {
    this.form.controls.tipoFactor.valueChanges.subscribe((value) => {
      this.isContribucion = false;
      if (value.codigo == GENERALES.TIPO_FACTOR.CONTRIBUCION) {
        this.form.controls.estructuraCargue.setValidators(Validators.required);
        this.isContribucion = true;
      }

      this.cargarDocumento = false;
    });

    this.form.controls.estructuraCargue.valueChanges.subscribe(r => {
      this.textoInformativoLabel = r.nombreCorto;
    });

    this.form.controls.cobertura.valueChanges.subscribe(resp => {

      this.form.controls.edadMinima.setValue(Math.min.apply(Math, resp.mimPlanCoberturaEdadList.map(j => j.edadMinIngreso)));
      this.form.controls.edadMaxima.setValue(Math.max.apply(Math, resp.mimPlanCoberturaEdadList.map(j => j.edadMaxIngreso)));

      this.tiposFactores = this.tiposFactoresAll.filter(factor => {
        const periodosCargados = this.allCargues?.find(periodo => resp.codigo === periodo.mimPlanCobertura.codigo
          && periodo.mimTipoFactor.codigo === factor.codigo
          && periodo.mimEstadosPeriodo.codigo === MIM_PARAMETROS.MIM_ESTADO_PERIODO.PROCESO
        );

        if (!periodosCargados) {
          return factor;
        }

      });
    });
  }

  getCobertura(codigo: string) {
    return this.coberturas.find(item => item.codigo === codigo);
  }

  getTipoFactor(codigo: string) {
    return this.tiposFactoresAll.find(item => item.codigo === codigo);
  }

  getFechaInicioFin(fechaIni: any, fechaFin: any) {
    return [DateUtil.stringToDate(fechaIni), DateUtil.stringToDate(fechaFin)];
  }

  obtener(pagina = 0, tamanio = 10, sort = 'mimCargue.fechaCreacion,desc') {
    const params: any = { page: pagina, size: tamanio, isPaged: true, sort: sort };

    params['mimPlanCobertura.mimPlan.codigo'] = this.codigoPlan;
    this.configuracion.gridListar.component.limpiar();
    this.backService.periodo.getPeriodosCargueFactores(params).subscribe(async resp => {
      if (!resp || !resp.content || resp.content.length === 0) {
        return;
      }

      const listObj = resp.content;

      for (const x of listObj) {
        await this.obtenerUsuario(x.mimCargue?.usuarioCreacion).then(respuesta => {
          x['_nombreUsuario'] = respuesta.user.name;
        });
      }
      this.allCargues = listObj;
      this.store.dispatch(actions.listarCargueMasivo({ datos: listObj }));
      this.configuracion.gridListar.component.cargarDatos(listObj, {
        maxPaginas: resp.totalPages,
        pagina: resp.number,
        cantidadRegistros: resp.totalElements
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  /**
   * Autor: Bayron Andres Perez M.
   * Función: Mentodo para obtener el usuario
   */
  async obtenerUsuario(identificacion: any): Promise<any> {

    let user = this.users.find(x => x.user.identification === identificacion);

    if (user === undefined) {
      user = await this.backService.sispro.getDatosUser({ tipoIdentificacion: 'CC', numeroIdentificacion: identificacion }).toPromise();
      this.users.push(user);
    }
    return user;
  }

  convertFecha(datos: any) {
    return datos.map(item => {
      return { ...item, _fecha: item.startTime.includes('T') ? item.startTime.replace('T', ' ').split('.')[0] : item.startTime };
    });
  }

  _onSiguiente($event: any) {
    this.obtener($event.pagina, $event.tamano, $event.sort);
  }
  _onAtras($event: any) {
    this.obtener($event.pagina, $event.tamano, $event.sort);
  }

  _ordenar($event: any) {
    this.obtener($event.pagina, $event.tamano, $event.sort);
  }

  _onClickCeldaElement($event) {
    if ($event.col.key === 'Ver detalle') {
      this.router.navigate([
        UrlRoute.PAGES,
        UrlRoute.ADMINISTRACION,
        UrlRoute.ADMINISTRACION_ACTUARIA,
        UrlRoute.ADMINISTRACION_ACTUARIA_CONFIGURAR,
        UrlRoute.ADMINISTRACION_ACTUARIA_CONFIGURAR_DETALLE,
        $event.dato.mimTipoFactor.codigo,
        $event.dato.codigo
      ]);
    } else if ($event.col.key === 'Eliminar') {
      this.translate.get('administracion.actuaria.cargueMasivoFactores.deseaEliminar', {
        archivo: $event.dato.mimCargue.nombreArchivo
      }).subscribe((mensaje: string) => {
        this.frontService.alert.confirm(mensaje, 'danger').then((confirm: any) => {
          if (confirm) {
            this.backService.periodo.eliminar($event.dato.codigo).subscribe((respuesta: any) => {
              this.translate.get('global.eliminadoExitosoMensaje').subscribe((mensajeRes: string) => {
                this.frontService.alert.success(mensajeRes).then(() => {
                  this.obtener();
                });
              });
            }, (err) => {
              this.frontService.alert.error(err.error.message);
            });
          }
        });
      });

    } else if ($event.col.key === 'Aplicar') {
      this.backService.periodo.aprobar($event.dato.codigo).subscribe(text => {
        this.translate.get('administracion.actuaria.cargueMasivoFactores.aplicacionExitosa').subscribe((mensajeRes: string) => {
          this.frontService.alert.success(mensajeRes).then(() => {
            this.obtener();
          });
        });
      }, (err) => {
        this.frontService.alert.error(err.error.message);
      });
    }

  }

  uploadFile(e) {

    this.archivoCarga = e.target.files[0];

    this.formData = new FormData();
    this.formData.append('file', this.archivoCarga);

    // Validaciones
    if (this.archivoCarga.name.includes('.')) {
      const extencion = this.extencionesPermitidas.find(item => item === this.archivoCarga.name.split('.')[1].toLowerCase());
      if (!extencion) {
        this.translate.get('global.alertas.extensionDocumento', { tipoDocumento: '(.xls o .xlsx)' }).subscribe((validateForm: string) => {
          this.frontService.alert.warning(validateForm).then(() => {
            this.nombreDocumento = 'Selecciones';
            this.form.reset();
            return;
          });
        });
      }
      if (this.archivoCarga.size > GENERALES.PESO_MAXIMO_DOCUMENTO) {
        this.translate.get('global.alertas.pesoDocumento', { pesoDocumento: '5' }).subscribe((validateForm: string) => {
          this.frontService.alert.warning(validateForm).then(() => {
            this.nombreDocumento = 'Selecciones';
            this.form.reset();
            return;
          });
        });
      }
      this.nombreDocumento = this.archivoCarga.name;
    }

  }

  descargarDocumento() {
    const nombreDocumento = this.form.controls.tipoFactor.value.nombreArchivoEjemplo;
    this.backService.downloadFile.descargarDocumentoFTP(nombreDocumento).subscribe(item => {
      const blob = new Blob([item.body], { type: 'application/octet-stream' });
      FileSaver.saveAs(blob, nombreDocumento);
    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });
  }

  // Metodo para enviar el archivo
  _cargar() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }
    if (!this.archivoCarga) {
      this.translate.get('global.alertas.elegirDocumento').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }

    const _form = this.form.getRawValue();

    let _tipoFactor;

    if (+_form.tipoFactor.codigo === GENERALES.TIPO_FACTOR.CONTRIBUCION) {
      _tipoFactor = 'factorContribucion';
    } else if (+_form.tipoFactor.codigo === GENERALES.TIPO_FACTOR.DISTRIBUCION) {
      _tipoFactor = 'factorDistribucion';
    } else {
      this.translate.get('global.opcionNoImplementada').subscribe((text: string) => {
        this.frontService.alert.success(text);
      });
      return;
    }

    const fechaInicio = _form.fechaInicioFin && DateUtil.dateToString(_form.fechaInicioFin[0], 'dd-MM-yyyy');
    const fechaFin = _form.fechaInicioFin && DateUtil.dateToString(_form.fechaInicioFin[1], 'dd-MM-yyyy');

    this.formData = new FormData();
    this.formData.append('file', this.archivoCarga);
    this.formData.append('delimiter', ',');
    this.formData.append('quote', '"');
    this.formData.append('isQuoted', 'true');
    const csvFileName = this.archivoCarga.name.replace('.xlsx', '.csv');

    this.backService.downloadFile.postConvertDocument(this.formData).subscribe(item => {
      const blob: any = new Blob([item.body], { type: 'application/octet-stream' });
      blob.name = 'cargueMasivoOk.csv';

      this.formData = new FormData();
      this.formData.append('archivo', <File>blob, csvFileName);
      this.formData.append('mimTipoFactorCodigo', _form.tipoFactor.codigo);
      this.formData.append('descripcion', _form.descripcion);
      this.formData.append('fechaInicio', fechaInicio);
      this.formData.append('mimPlanCoberturaCodigo', _form.cobertura.codigo);
      this.formData.append('edadMinima', _form.edadMinima);
      this.formData.append('edadMaxima', _form.edadMaxima);
      this.formData.append('mimEstructuraCargueCodigo', _form.estructuraCargue.codigo);

      if (fechaFin) {
        this.formData.append('fechaFin', fechaFin);
      }
      if (_tipoFactor == "factorContribucion") {
        _tipoFactor = _tipoFactor + _form.estructuraCargue.codigo;
      }

      this.backService.factores.cargueFactores(_tipoFactor, this.formData).subscribe((respuesta: any) => {
        this.frontService.alert.success(respuesta.message).then(() => {
          this.limpiarFormulario();
          this.obtener();
        });
      }, (err) => {
        if (err.status === 400) {
          this.translate.get('administracion.cargueMasivo.alertas.estrucutraNoCumple').subscribe((text: string) => {
            this.frontService.alert.error(text).then(() => {
              const data = JSON.stringify(err.error.errors);
              const archivo = new Blob([data], { type: 'application/txt' });
              FileSaver.saveAs(archivo, 'log.txt');
              this.limpiarFormulario();
            });
          });
        } else {
          this.frontService.alert.error(err.error.message);
          this.limpiarFormulario();
        }

      });
    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });

  }

  /**
   * Autor: JoseMUlato
   * @param codigo Código del tipo de cargue
   */
  tipoCargueSelected(codigo: string) {
    return this.estructuraCargues.find(x => x.codigo === codigo);
  }

  limpiarFormulario() {
    this.nombreDocumento = 'Selecciones';
    this._initForm();
  }

}
