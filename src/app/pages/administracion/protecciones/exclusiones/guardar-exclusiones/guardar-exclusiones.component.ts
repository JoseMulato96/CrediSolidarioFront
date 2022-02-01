import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { FormValidate, CustomValidators } from '@shared/util';
import { UrlRoute } from '@shared/static/urls/url-route';
import { Observable } from 'rxjs/internal/Observable';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { FormComponent } from '@core/guards';
import { masksPatterns } from '@shared/util/masks.util';
import { ListarDiagnosticosExlusionesConfig } from './listar-diagnosticos-config';
import { DateUtil } from '@shared/util/date.util';
import { from } from 'rxjs/internal/observable/from';
import { BackFacadeService, FrontFacadeService } from '@core/services';

@Component({
  selector: 'app-guardar-exclusiones',
  templateUrl: './guardar-exclusiones.component.html',
})
export class GuardarExclusionesComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  form: FormGroup;
  isForm: Promise<any>;

  _esCreacion = true;
  subscription: Subscription = new Subscription();
  codigo: string;
  fondo: any;
  exclusionItem: any;

  fondos: any[] = [];
  exclusionesItems: any[] = [];
  patterns = masksPatterns;

  configuracion: ListarDiagnosticosExlusionesConfig = new ListarDiagnosticosExlusionesConfig();

  listDiagnosticosExclusion: any[];

  mostrarDiagnostico = false;

  formDiagnostico: FormGroup;

  isFormDiagnostico: Promise<any>;

  listDiagnosticos: any[];

  esCreacionDiagnostico = true;

  diagnosticosEstado = true;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly router: Router,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
    this.listDiagnosticosExclusion = [];
  }

  ngOnInit() {
    this.subscription = this.activatedRoute.params.subscribe((params: any) => {
      this.codigo = params.codigo;

      forkJoin([
        this.backService.fondo.getFondos({ estado: true, isPaged: true, sort: 'nombre,asc', 'size': 1000000 })
      ]).subscribe(([
        _fondos
      ]) => {
        this.fondos = _fondos['content'];
        if (this.codigo) {
          this.backService.exclusion.getExclusion(this.codigo)
            .subscribe((resp: any) => {
              this.exclusionItem = resp;
              if (!this.fondoSelected(resp.mimFondo.codigo)) {
                this.fondos.push(resp.mimFondo);
              }
              this._esCreacion = false;
              this._initForm(resp);
            }, (err) => {
              this.frontService.alert.warning(err.error.message);
            });
        } else {
          this._esCreacion = true;
          this._initForm();
        }
      }, (err) => {
        this.form.reset();
        this._initForm();
        this.frontService.alert.warning(err.error.message);
      });

    });
  }

  /**
   * Autor: Cesar Millan
   * Función: Inicializa el formulario
   */
  _initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        codigo: new FormControl(param ? param.codigo : null),
        fondo: new FormControl(param ? this.fondoSelected(param.mimFondo.codigo) : null, [Validators.required]),
        exclusion: new FormControl(param ? param.descripcion : null, [Validators.required, CustomValidators.vacio, Validators.pattern('.*\\S.*[a-zA-z0-9-zÀ-ÿ\u00f1\u00d1\,\. ]')]),
        vigente: new FormControl(param ? param.estado : false, [Validators.required])
      }));

    if (this._esCreacion) {
      this.form.controls.vigente.setValue(true);
      this.form.controls.vigente.disable();
    }

    if (!this._esCreacion) {
      if (param && !param.estado) {
        this.form.disable();
      }
      this.form.controls.codigo.disable();
      this.form.controls.fondo.disable();
      if(param){
        this.listDiagnosticosExclusion = param.mimConfiguracionDiagnosticosList ? param.mimConfiguracionDiagnosticosList : [];
      }
      this.cargarDatosGrilla(param);
    }
  }

  /**
   * Autor: Juan Cabuyales
   * Función: Espera un momento, para cargar los registros en la tabla
   * @param param Objeto con los registros a mostrar en la tabla
   */
  cargarDatosGrilla(param: any){
    setTimeout(() => {
      let listAux : any[] = [];
      if(param){
        listAux = this.validarEstadoDiagnosticos(param.mimConfiguracionDiagnosticosList);
      }
      this.configuracion.gridConfig.component.cargarDatos(this.asignarEstados(listAux),{
        maxPaginas: Math.ceil(listAux.length / 5),
        pagina: 0,
        cantidadRegistros: listAux.length
      });
    }, 100);
  }

  /**
   * Autor: Cesar Millan
   * Función: Devuelve el item de datos del fondo
   * @param codigo Codigo del fondo
   */
  fondoSelected(codigo: string) {
    return this.fondos.find(x => x.codigo === codigo);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Autor: Cesar Millan
   * Función: De acuerdo a la acción disparada ejecuta el proceso de crear o eliminar
   */
  _alGuardar() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((validateForm: string) => {
        this.frontService.alert.warning(validateForm);
      });
      return;
    }
    if (this._esCreacion) {
      this._crear();
    } else {
      this._actualizar();
    }
  }

  /**
   * Autor: Cesar Millan
   * Función: Crea un fondo
   */
  _crear() {
    const form: any = this.form.value;
    const param = {
      mimFondo: { codigo: form.fondo.codigo },
      descripcion: form.exclusion,
      estado: true,
    };

    this.backService.exclusion.postExclusion(param).subscribe((resp: any) => {
      this.finalizarCreacionActualizacion(true);
    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });
  }

  /**
   * Autor: Cesar Millan
   * Función: Modifica la información del fondo
   */
  _actualizar() {
    const form: any = this.form.getRawValue();
    const param = {
      codigo: form.codigo,
      mimFondo: { codigo: form.fondo.codigo },
      descripcion: form.exclusion,
      estado: form.vigente,
      mimConfiguracionDiagnosticosList: this.procesarListaDiagnosticos(this.listDiagnosticosExclusion)
    };
    this.backService.exclusion.putExclusion(this.codigo, param).subscribe(() => {
      this.finalizarCreacionActualizacion(false);
    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });
  }

  private finalizarCreacionActualizacion(opcion: boolean){
    this.translate.get(opcion ? 'global.guardadoExitosoMensaje' : 'global.actualizacionExitosaMensaje').subscribe((text: string) => {
      this.frontService.alert.success(text).then(() => {
        this.form.reset();
        this._initForm();
        // Redireccionamos a la pantalla de listar.
        this._irListaListar();
      });
    });
  }

  /**
   * Autor: Cesar Millan
   * Función: Retorna a la pantalla de listar de las frecuencias facturación
   */
  _irListaListar() {
    this.router.navigate([UrlRoute.PAGES, UrlRoute.ADMINISTRACION, UrlRoute.ADMINSTRACION_PROTECCIONES, UrlRoute.ADMINISTRACION_PROTECCIONES_EXCLUSIONES]);
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }

  /********************************************************************************
   * Zona de metodos para manejo de los diagnosticos de exclusion
  ********************************************************************************/
  _onClickCeldaElement(event: any){
    if (event.col.key === 'editar') {
      this.abrirModal(true, event.dato);
    }else {
      this.eliminarRegistro(event.dato);
    }
  }

  async abrirModal(habilita: boolean, diagnostico?: any){
    if(!habilita && this.tieneCambiosFormularioDiagnostico()){
      this.frontService.alert.confirm(this.translate.instant('global.onDeactivate')).then((respuesta: boolean) => {
        if (respuesta) {
          this.mostrarDiagnostico = false;
          this.limpiarFormularioDiagnostico();
        }
      });
    }else{
      if(diagnostico){
        this.esCreacionDiagnostico = false;
        this.initFormValorDiagnostico(diagnostico);
      }else{
        this.esCreacionDiagnostico = true;
        this.initFormValorDiagnostico();
      }
      this.mostrarDiagnostico = habilita;
    }
  }

  private initFormValorDiagnostico(param?: any) {
    this.isFormDiagnostico = Promise.resolve(
      this.formDiagnostico = this.formBuilder.group({
        codigo: new FormControl(param ? param.codigo : null),
        diagnostico : new FormControl(param ? param.sipDiagnosticos.diagCod + ' - ' + param.sipDiagnosticos.diagDesc : null),
        fechaInicioFechaFin: new FormControl(param ? this.rangoFechaSelected(param.fechaInicio, param.fechaFin) : null, [Validators.required,Validators.minLength(2)]),
        diagnosticoVigente: new FormControl(param ? param.estado : false, [Validators.required])
      }));
    if(!this.esCreacionDiagnostico){
      this.formDiagnostico.controls.diagnostico.disable();
    }
  }

  private eliminarRegistro(param: any){
    this.translate.get('administracion.protecciones.exclusiones.diagnosticos.alertas.deseaEliminar', {
      nombre: `${param.nombre}`
    }).subscribe((mensaje: string) => {
      const modalPromise = this.frontService.alert.confirm(mensaje, 'danger');
      const newObservable = from(modalPromise);
      newObservable.subscribe(
        (desition: any) => {
          if (desition === true) {
            this.procesarEliminacion(param);
          }
        });
    });
  }

  private procesarEliminacion(param:any){
    this.form.markAsDirty();
    let posRegistro = this.listDiagnosticosExclusion.findIndex( (item:any) => item.codigo === param.codigo);
    this.listDiagnosticosExclusion[posRegistro].estado = false;
    let listAux: any[] = this.validarEstadoDiagnosticos(this.listDiagnosticosExclusion);
    this.configuracion.gridConfig.component.cargarDatos(
      this.asignarEstados(listAux),{
        maxPaginas: Math.ceil(listAux.length / 5),
        pagina: 0,
        cantidadRegistros: listAux.length
      }
    );
    this._actualizar();
  }

  validarFormularioDiagnostico(){
    if (this.formDiagnostico.invalid) {
      this.validateForm(this.formDiagnostico);
      this.frontService.alert.confirm(this.translate.instant('global.validateForm'));
    } else {
      if(!this.formDiagnostico.value.diagnostico && this.esCreacionDiagnostico){
        this.formDiagnostico.get('diagnostico').setErrors({ 'required': true });
        this.frontService.alert.confirm(this.translate.instant('global.validateForm'));
      }else{
        this.guardarDiagnosticos();
      }
    }
  }

  guardarDiagnosticos(){
    const formValor = this.formDiagnostico.value;
    let diagnosticoExlusion: any;
    const fechaInicio = DateUtil.dateToString(formValor.fechaInicioFechaFin[0], 'dd-MM-yyyy');
    const fechaFin = DateUtil.dateToString(formValor.fechaInicioFechaFin[1], 'dd-MM-yyyy');
    if(this.esCreacionDiagnostico){
      diagnosticoExlusion = {
        codigo: this.listDiagnosticosExclusion.length,
        mimExclusion: {
          codigo: this.codigo
        },
        sipDiagnosticos: {
          diagCod: formValor.diagnostico.diagCod,
          diagDesc: formValor.diagnostico.diagDesc
        },
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        estado : true,
      }
      this.listDiagnosticosExclusion.push(diagnosticoExlusion);
    }else{
      diagnosticoExlusion = {
        codigo: formValor.codigo,
        mimExclusion: {
          codigo: this.codigo
        },
        sipDiagnosticos: null,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        estado: formValor.diagnosticoVigente,
        fechaModificacion: null
      }
      const posicion = this.listDiagnosticosExclusion.findIndex((valor: any) => valor.codigo === diagnosticoExlusion.codigo);
      diagnosticoExlusion.fechaModificacion = this.listDiagnosticosExclusion[posicion].fechaModificacion;
      diagnosticoExlusion.sipDiagnosticos = this.listDiagnosticosExclusion[posicion].sipDiagnosticos;
      this.listDiagnosticosExclusion[posicion] = diagnosticoExlusion;
    }
    let listAux : any[];
    if(!this.diagnosticosEstado){
      listAux = this.listDiagnosticosExclusion;
    }else{
      listAux = this.validarEstadoDiagnosticos(this.listDiagnosticosExclusion);
    }

    this.configuracion.gridConfig.component.cargarDatos(
      this.asignarEstados(listAux),{
        maxPaginas: Math.ceil(listAux.length / 5),
        pagina: 0,
        cantidadRegistros: listAux.length
      }
    );

    //Cerramos el modal
    this.mostrarDiagnostico = false;
    this.limpiarFormularioDiagnostico();
  }

  tieneCambiosFormularioDiagnostico() {
    return this.formDiagnostico && this.formDiagnostico.dirty;
  }

  limpiarFormularioDiagnostico() {
    this.formDiagnostico.reset();
    this.form.markAsDirty();
  }

  rangoFechaSelected(fechaIni: any, fechaFin: any) {
    return [DateUtil.stringToDate(fechaIni), DateUtil.stringToDate(fechaFin)];
  }

  /**
   *
   * @description Obtiene diagnosticos
   * @param event Captura eventos del autocompletar.
   */
   getDiagnosticos(event: any) {
    this.backService.exclusion.getDiagnosticos(event.query).subscribe((response: any) => {
      this.listDiagnosticos = response;
    }, (err: any) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  /**
  * Autor: Juan Cabuyales
  * Función: Metodo para formatear la data a mostar
  * @param items Son los registros obtenidos de la consulta
  */
  asignarEstados(items: any) {
    const listObj = [];
    let item: any;
    for (item of items) {
      listObj.push({
        codigo: item.sipDiagnosticos.diagCod,
        nombre: item.sipDiagnosticos.diagCod + ' - ' + item.sipDiagnosticos.diagDesc,
        fechaInicio: item.fechaInicio,
        fechaFin: item.fechaFin,
        disponible: item.estado ? 'Si' : 'No',
        fechaModificacion: item.fechaModificacion,
        ...item
      });
    }
    return listObj;
  }

  _onToggleStatus(event: any) {
    let listAux = [];
    this.diagnosticosEstado = event.currentTarget.checked;
    if(!event.currentTarget.checked){
      listAux = this.listDiagnosticosExclusion;
    }else{
      listAux = this.validarEstadoDiagnosticos(this.listDiagnosticosExclusion);
    }
    this.configuracion.gridConfig.component.cargarDatos(
      this.asignarEstados(listAux),{
        maxPaginas: Math.ceil(listAux.length / 5),
        pagina: 0,
        cantidadRegistros: listAux.length
      }
    );
  }

  private validarEstadoDiagnosticos(items: any[]){
    if(items && items.length > 0){
       const valores = items.filter((valor:any) => valor.estado === true);
       if(valores){
         return valores;
       }
    }
    return [];
  }

  private procesarListaDiagnosticos(items: any[]){
    const listaFinal = [];
    items.forEach((item: any) => {
      delete item.codigo;
      listaFinal.push(item);
    });
    return listaFinal;
  }
}
