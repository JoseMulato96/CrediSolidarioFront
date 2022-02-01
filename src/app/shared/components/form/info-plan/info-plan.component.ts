import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ControlContainer, FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AlertService } from '@core/services';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';
import { TranslateService } from '@ngx-translate/core';
import { currencyMaskConfig } from '@shared/static/constantes/currency-mask';
import { SIP_PARAMETROS_TIPO } from '@shared/static/constantes/sip-parametros-tipo';
import { CustomValidators, FormValidate } from '@shared/util';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { ListasCotizacionConfig } from './listas-cotizacion.config';
import { DateUtil } from '@shared/util/date.util';
import { MultiactivaService } from '@core/services/api-back.services/mimutualintegraciones/multiactiva.service';

@Component({
  selector: 'app-info-plan',
  templateUrl: './info-plan.component.html',
  styleUrls: ['./info-plan.component.css']
})
export class InfoPlanComponent extends FormValidate implements OnInit {

  listFrecuenciasFacturacion: any[];
  listMediosFacturacion: any[];
  nombrePlan: string = '';

  blnMostrar: boolean = true;
  blnMostrarTabla: boolean = true;

  @Output()
  eventEliminar: EventEmitter<boolean> = new EventEmitter();

  customCurrencyMaskConfig: any;

  configuracion : ListasCotizacionConfig = new ListasCotizacionConfig();

  mostrarGuardar: boolean;
  listaAsegurado: any;
  _esCreacion: boolean;
  formListaAsegurados: FormGroup;
  isFormListaAsegurados: Promise<any>;
  tiposId: any[];
  parentescos: any[];
  generos: any[];
  ciudades: any[];
  asoNumIntPersona = '';


  @Input('dataInit')
  set dataInit(value: any) {
    console.log('data inicial', value);
    if (value === null || value === undefined) {
      return;
    }
    this.listFrecuenciasFacturacion = value.listFrecuenciasFacturacion;
    this.listMediosFacturacion = value.listMediosFacturacion;
    this.nombrePlan = value.nombrePlan;
  }

  constructor(public controlContainer: ControlContainer,
              private readonly backService: BackFacadeService,
              private readonly translate: TranslateService,
              private readonly alertService: AlertService,
              private readonly formBuilder: FormBuilder,
              private readonly multiactivaService: MultiactivaService,
              private readonly frontService: FrontFacadeService) {
     super();
  }

  ngOnInit(): void {
    this.customCurrencyMaskConfig = {
      align: 'left',
      allowNegative: true,
      allowZero: true,
      decimal: ',',
      precision: 0,
      prefix: '$ ',
      suffix: '',
      thousands: '.',
      nullable: true,
      min: null,
      max: null,
      inputMode: CurrencyMaskInputMode.NATURAL
    };
    this.obtenerDatosListaAsegurado();    
  }

  ocultarMostrar() {
    this.blnMostrar = !this.blnMostrar;
  }

  ocultarMostrarTabla(){
    this.blnMostrarTabla = !this.blnMostrarTabla;
  }

  clickEliminar(){
    this.eventEliminar.emit(false);
  }

  //---------------------------------------------------------------------------------------------
  //Proceso de listar y crear lista de asegurados
  //---------------------------------------------------------------------------------------------

  obtenerDatosListaAsegurado(pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc') {
    const param: any = { page: pagina, size: tamanio, isPaged: true, sort };
    let data: Array<any> = [];

    this.backService.responsablePersonas.getResponsablePersonas(param)
      .subscribe((resp: any) => {
        this.configuracion.gridListar.component.limpiar();

        if (!resp || !resp.content || resp.content.length === 0) {
          return;
        }

        resp.content.forEach((element:any) => {          
          data.push(element.mimPersona);
        });

        this.configuracion.gridListar.component.cargarDatos(
          this.asignarEstados(data), {
          maxPaginas: resp.totalPages,
          pagina: resp.number,
          cantidadRegistros: resp.totalElements
        });
      }, (err) => {
        this.alertService.error(err.error.message);
      });
  }

  private asignarEstados(items: any){
    const listObj = [];
    let item: any;
    for (item of items) {
      listObj.push({
        ...item,
        _estado: item.estado ? 'A' : 'I',
        _edad: DateUtil.calcularEdad(DateUtil.stringToDate(item.fechaNacimiento)),
        _nombres: item.primerNombre +" "+ item.primerApellido
      });
    }
    return listObj;
  }

  _onClickCeldaElement($event: any) {

  }

  _onAtras(e:any) {
    this.obtenerDatosListaAsegurado(e.pagina, e.tamano, e.sort);
  }

  _onSiguiente(e:any) {
    this.obtenerDatosListaAsegurado(e.pagina, e.tamano, e.sort);
  }

  _ordenar(e:any) {
    this.obtenerDatosListaAsegurado(e.pagina, e.tamano, e.sort);
  }

  //---------------------------------------------------------------------------------------------
  //Proceso de listar y crear lista de asegurados
  //---------------------------------------------------------------------------------------------
  async _toggleGuardar(toggle: boolean, listaAsegurado?: any) {
    if (!toggle && this.hasChanges()) {
      this.frontService.alert.confirm(this.translate.instant('global.onDeactivate')).then((respuesta: boolean) => {
        if (respuesta) {
          this.mostrarGuardar = false;
          this.limpiarFormulario();
        }
      });
    } else {
      // Intentamos cargar los datos de los desplegables solo cuando se abra el formulario.
      // Ademas, si ya estan inicializados, no lo hacemos de nuevo.
      if (toggle) {
        await this._cargarDatosDesplegables();
      }
      if (listaAsegurado) {
        this.listaAsegurado = JSON.parse(JSON.stringify(listaAsegurado));
        this._esCreacion = false;
        this.initFormAsegurados(this.listaAsegurado);
      } else {
        this.listaAsegurado = undefined;
        this._esCreacion = true;
        this.initFormAsegurados();
      }
      this.mostrarGuardar = toggle;
    }
  }

  limpiarFormulario() {
    this.formListaAsegurados.reset();
  }

  hasChanges() {
    return this.formListaAsegurados && this.formListaAsegurados.dirty;
  }

  private initFormAsegurados(param?: any) {
    this.isFormListaAsegurados = Promise.resolve(
      this.formListaAsegurados = this.formBuilder.group({
        tipoId: new FormControl(param && param.tipoId ? this.obtenerTiposId(param.tipoId) : null, [Validators.required]),
        numeroIdentificacion: new FormControl(param && param.numeroIdentificacion ? param.numeroIdentificacion : null, [Validators.required, Validators.max(1000000000)]),
        primerNombre: new FormControl(param && param.primerNombre ? param.primerNombre : null, [Validators.required]),
        segundoNombre: new FormControl(param && param.segundoNombre ? param.prisegundoNombremerNombre : null),
        primerApellido: new FormControl(param && param.primerApellido ? param.primerApellido : null, [Validators.required]),
        segundoApellido: new FormControl(param && param.segundoApellido ? param.segundoApellido : null),
        parentesco: new FormControl(param && param.parantesco ? this.obtenerParentesco(param.parantesco): null, [Validators.required]),
        fechaNacimiento: new FormControl(param && param.fechaNacimiento ? param.fechaNacimiento : null, [Validators.required]),
        genero: new FormControl(param ? this.obtenerGenero(param.genero) : null, [Validators.required]),
        telefono: new FormControl(param && param.telefono ? param.telefono : null, [Validators.max(1000000000)]),
        correoElectronico: new FormControl(param ? param.correoElectronico : null, [Validators.required, Validators.email, CustomValidators.vacio]),
        celular: new FormControl(param && param.celular ? param.celular : null),
        direccion: new FormControl(param && param.direccion ? param.direccion : null),
        ciudad: new FormControl(param && param.ciudad ? this.obtenerCiudad(param.ciudad) : null, [Validators.required]),
        ingresoMensual: new FormControl(param && param.ingresos ? param.ingresos : null, [Validators.required]),
        nivelRiesgo: new FormControl(param && param.nivelRiesgo ? param.nivelRiesgo : null, [Validators.required, Validators.max(1)]),
        tipoAsegurado: new FormControl(param && param.tipoVinculacion ? param.tipoVinculacion : null),
        autorizoTratamiento: new FormControl(param && param.autorizaDatos ? param.autorizaDatos : false),
        presentaInvalidez: new FormControl(param && param.presentaInvalidez ? param.presentaInvalidez : false),
      })
    );

    this.formListaAsegurados.controls.ingresoMensual.updateValueAndValidity();
    this.formListaAsegurados.controls.ingresoMensual.markAsTouched();

    this.formListaAsegurados.controls.tipoAsegurado.disable();
    this.formListaAsegurados.controls.nivelRiesgo.disable();


    if (param) {
      for (var control in this.formListaAsegurados.controls) {
        if (this.formListaAsegurados.controls[control].value) {
          this.formListaAsegurados.controls[control].disable();
        }
      }
    }

    this.obtenerNivelRiesgo(this.asoNumIntPersona);
  }

  limpiarFormularioDetalle() {
    this.formListaAsegurados.reset();
    this.initFormAsegurados();
  }


  getConsultarAsociados() {
    if (this.formListaAsegurados.value.tipoId == undefined || this.formListaAsegurados.value.numeroIdentificacion == undefined) {
      this.alertService.info("Para continuar es necesario seleccionar Tipo Id y Numero Id");
      return;
    }
    this.backService.asociado
      .buscarAsociado({
        tipDoc: this.formListaAsegurados.value.tipoId.codigo,
        nitCli: this.formListaAsegurados.value.numeroIdentificacion
      })
      .subscribe(
        respuesta => {
          if (!respuesta.content && !respuesta.content.length || respuesta.content.length == 0) {
            this.translate
              .get('asociado.noSeEncontraronRegistrosMensaje')
              .subscribe((response: string) => {
                this.alertService.info(response);
              });
            return;
          }

          const dataPersona = respuesta.content[0];
          const persona = {
            tipoId: dataPersona.tipDoc,
            numeroIdentificacion: dataPersona.nitCli,
            primerNombre: dataPersona.primerNombre,
            segundoNombre: dataPersona.segundoNombre,
            primerApellido: dataPersona.primerApellido,
            segundoApellido: dataPersona.segundoApellido,
            fechaNacimiento: dataPersona.fecNac,
            genero: dataPersona.codSex,
            telefono: dataPersona.telFam,
            correoElectronico: dataPersona.mail,
            celular: dataPersona.cel,
            direccion: dataPersona.dirRes,
            autorizaDatos: dataPersona.autorizaDatos,
            presentaInvalidez: dataPersona.presentaInvalidez,
            tipoVinculacion: dataPersona.tipoVinculacion,
            ingresos: dataPersona.ingresos,
            parantesco: dataPersona.parantesco,
            ciudad: dataPersona.ciudad
          };
          this.asoNumIntPersona = dataPersona.numInt;
          this.initFormAsegurados(persona);
        },
        (err: any) => {
          if (err.status === 404) {
            this.translate
              .get('asociado.noSeEncontraronRegistrosMensaje')
              .subscribe((response: string) => {
                this.alertService.info(response);
              });
            return;
          } else {
            this.alertService.error(err.error.message);
          }
        }
      );
  }


  private obtenerTiposId(codigo: any) {
    return this.tiposId.find(res => res.codigo === codigo);
  }


  private obtenerGenero(codigo: any) {
    return this.generos.find(res => res.codigo === codigo);
  }

  private obtenerParentesco(codigo: any) {
    return this.parentescos.find(item => item.codigo === codigo);
  }

  private obtenerCiudad(codigo: any){
    return this.ciudades.find(item => item.codInt === codigo);
  }

  private obtenerNivelRiesgo(asoNumInt:any){
    if(asoNumInt){
      this.backService.asociado.getNivelRiesgo(asoNumInt).subscribe( (resp:any) =>{
        this.formListaAsegurados.controls.nivelRiesgo.setValue(resp.nivelCod);
      }, err => {
          this.frontService.alert.error(err.error.message);
      });
    }
  }


  private async _cargarDatosDesplegables() {
    const _tiposIdentificacion = await this.backService.tipoIdentificacion.obtenerTipoIdentificaciones({ estado: true, sort: 'nombre,asc' }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
    this.tiposId = _tiposIdentificacion._embedded.mimTipoIdentificacion;

    const _parentesco = await this.backService.parentescos.getParentesco({ estado: true, sort: 'nombre,asc' }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
    this.parentescos = _parentesco._embedded.mimParentesco;

    const _genero = await this.backService.genero.getGeneros({ estado: true, sort: 'nombre,asc' }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
    this.generos = _genero._embedded.mimGenero;

    const _ciudades = await this.multiactivaService.getUbicaciones(908).toPromise().catch(err => this.frontService.alert.error(err.error.message));
    this.ciudades = _ciudades;
  }


  /**
   * Autor: Jose Mulato
   * Función: De acuerdo a la acción disparada ejecuta el proceso de crear o eliminar
   */
  _alGuardar() {
    if (this.formListaAsegurados.invalid) {
      this.validateForm(this.formListaAsegurados);
      this.translate.get('global.validateForm').subscribe((validateForm: string) => {
        this.frontService.alert.warning(validateForm);
      });
      return;
    }
    this._crearPersona();
  }

  /**
  * Autor: Jose Mulato
  * Función: Crea una persona
  */
  _crearPersona() {
    const form: any = this.formListaAsegurados.controls;

    if (!form.autorizoTratamiento.value) {
      this.frontService.alert.warning("El campo autorizo tratamiento de datos se debe marcar en SI!");
      return;
    }
    const persona = {
      tipoId: form.tipoId.value.nombreCorto,
      numeroId: parseInt(form.numeroIdentificacion.value),
      primerNombre: form.primerNombre.value,
      segundoNombre: form.segundoNombre.value,
      primerApellido: form.primerApellido.value,
      segundoApellido: form.segundoApellido.value,
      fechaNacimiento: DateUtil.dateToString(form.fechaNacimiento.value, 'dd-MM-yyyy'),
      mimParentesco: form.parentesco.value,
      sexo: form.genero.value.nombreCorto,
      telefono: form.telefono.value,
      correoElectronico: form.correoElectronico.value,
      celular: form.celular.value,
      direccion: form.direccion.value,
      codigoMunicipio: form.ciudad.value.codInt,
      ingresosMensuales: form.ingresoMensual.value,
      autorizoDatos: form.autorizoTratamiento.value,
      presentaInvalidez: form.presentaInvalidez.value,
      tipoVinculacion: form.tipoAsegurado.value != null ? form.tipoAsegurado.value : 'Asegurado Tercero',
      estado: Boolean(SIP_PARAMETROS_TIPO.ESTADO_ACTIVO),
      asoNumInt: this.asoNumIntPersona,
    };

    this.backService.personas.postPersona(persona).subscribe((resp: any) => {
      this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.formListaAsegurados.reset();
          this.procesarCreacion();
        });
      });
    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });
  }

  private procesarCreacion(): void {
    this.mostrarGuardar = false;
    this.obtenerDatosListaAsegurado();    
  }

}
