import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  IPulldownAccionFiltro,
  IPulldownAuxilioFiltro,
  IPulldownCorteFiltro,
  IPulldownSolicitudFiltro
} from '@shared/interfaces/i-pulldown-filtro';
import {
  NumeroSolicitudFiltro,
  TipoAuxilioFiltro,
  TransMonetariaFiltro
} from '@shared/models';
import { SIP_PARAMETROS_TIPO } from '@shared/static/constantes/sip-parametros-tipo';
import { CustomValidators, FormValidate } from '@shared/util';
import { masksPatterns } from '@shared/util/masks.util';
import { ObjectUtil } from '@shared/util/object.util';
import { ACTION_HEADER_STATE } from '@store/actions/app-action';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { HomeConfig } from './home.config';
import { FrontFacadeService, BackFacadeService } from '@core/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends FormValidate implements OnInit {
  shownPanel = 0;
  configuracion: HomeConfig = new HomeConfig();

  /**
   * @description Formulario de filtro por numero de solicitud.
   */
  numeroSolicitudForm: FormGroup;
  isNumeroSolicitudForm: Promise<any>;
  /**
   * @description Formulario de filtro por tipo de auxilio.
   */
  tipoAuxilioForm: FormGroup;
  isTipoAccionForm: Promise<any>;
  /**
   * @description Formulario de filtro por transaccion no monetaria.
   */
  transNoMonetariaForm: FormGroup;
  isTransaccionNoMonetariaForm: Promise<any>;
  patterns = masksPatterns;

  /**
   * Modelos para enviar datos al backend.
   */
  numeroSolicitudFiltro: NumeroSolicitudFiltro = {};
  tipoAuxilioFiltro: TipoAuxilioFiltro = {};
  transMonetariaFiltro: TransMonetariaFiltro = {};

  colores: any[];

  constructor(
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router
  ) {
    super();
  }

  ngOnInit() {
    // Inicializa los form groups.
    this._initNumeroSolicitudFormGroup();
    this._initTipoAuxilioFormGroup();
    this._initTransNoMonetariaFormGroup();

    this.frontService.redux.updateAppState({
      action: ACTION_HEADER_STATE,
      payload: true
    });

    this.backService.colorimetria.getColorimetria().subscribe(item => {
      this.colores = item.content;
      // Ontiene los parametros
      forkJoin([
        this.backService.parametro.getTipoAuxilio([
          SIP_PARAMETROS_TIPO.ESTADO_ACTIVO,
          SIP_PARAMETROS_TIPO.ESTADO_INACTIVO,
        ]),
        this.backService.parametro.getTipoSolicitud(),
        this.backService.parametro.getParametrosTipo(
          SIP_PARAMETROS_TIPO.TIPO_CORTES_FACTURACION.TIP_COD
        ),
        this.backService.parametro.getParametrosTipo(
          SIP_PARAMETROS_TIPO.AUXILIO_TIPO_ACCION.TIP_COD
        ),
        this.backService.parametro.getParametrosTipo(
          SIP_PARAMETROS_TIPO.NO_MONETARIO_TIPO_ACCION.TIP_COD
        ),
        this._obtenerTareas()
      ]).subscribe(
        ([auxilios, solicitudes, cortes, accionesAuxilio, accionesMonetario, tareas]) => {
          if (auxilios) {
            this.configuracion.tiposAuxilios = auxilios as IPulldownAuxilioFiltro[];
            this.configuracion.tiposAuxilios.sort(ObjectUtil.OrdenMenorAMayor('tipDescripcion'));
          }
          if (solicitudes) {
            this.configuracion.tipoSolicitudes = solicitudes as IPulldownSolicitudFiltro[];
            this.configuracion.tipoSolicitudes.sort(ObjectUtil.OrdenMenorAMayor('nombre'));
          }
          if (cortes) {
            this.configuracion.cortes = cortes[
              'sipParametrosList'
            ] as IPulldownCorteFiltro[];
            this.configuracion.cortes.sort(ObjectUtil.OrdenMenorAMayor('valor'));
            this.configuracion.cortes.forEach(x => x.label = 'CORTE ' + x.valor);
          }
          if (accionesAuxilio) {
            this.configuracion.auxilioTiposAcciones = accionesAuxilio[
              'sipParametrosList'
            ] as IPulldownAccionFiltro[];

            this.configuracion.auxilioTiposAcciones.forEach((tipoAccion: any) => {
              tipoAccion.codigo = tipoAccion.sipParametrosPK.codigo;
              tipoAccion.nombre = tipoAccion.nombre.toUpperCase();
            });
            this.configuracion.auxilioTiposAcciones.sort(ObjectUtil.OrdenMenorAMayor('nombre'));
          }

          if (accionesMonetario) {
            this.configuracion.monetarioTiposAcciones = accionesMonetario[
              'sipParametrosList'
            ] as IPulldownAccionFiltro[];

            this.configuracion.monetarioTiposAcciones.forEach(
              (tipoAccion: any) => {
                tipoAccion.codigo = tipoAccion.sipParametrosPK.codigo;
                tipoAccion.nombre = tipoAccion.nombre.toUpperCase();
              }
            );

            this.configuracion.monetarioTiposAcciones.sort(ObjectUtil.OrdenMenorAMayor('nombre'));
          }
        }, err => {
          this.frontService.alert.error(err.error.message);
        }
      );
    }, err => {
      this.frontService.alert.warning(err.error.message);
    });

  }

  goToPanelLeft(numberPanel) {
    this.shownPanel = numberPanel;
  }

  goToPanelLeftClose() {
    this.shownPanel = 0;
  }

  /**
   * @description Inicializa el formulario para el filtro por numero de solicitud.
   *
   */
  _initNumeroSolicitudFormGroup(previous?: boolean) {
    this.isNumeroSolicitudForm = Promise.resolve(
      (this.numeroSolicitudForm = this.formBuilder.group({
        numeroCedula: new FormControl(
          previous ? this.numeroSolicitudForm.controls.numeroCedula : null
        ),
        numeroCaso: new FormControl(
          previous ? this.numeroSolicitudForm.controls.numeroCaso : null
        ),
        corte: new FormControl(
          previous ? this.numeroSolicitudForm.controls.corte : null
        )
      }))
    );
  }

  /**
   * @description Inicializa el formulario para el filtro por tipo de auxilio.
   *
   */
  _initTipoAuxilioFormGroup(previous?: boolean) {
    this.isTipoAccionForm = Promise.resolve(
      (this.tipoAuxilioForm = this.formBuilder.group({
        tipoAuxilio: new FormControl(
          previous ? this.tipoAuxilioForm.controls.tipoAuxilio : null
        ),
        tipoAccion: new FormControl(
          previous ? this.tipoAuxilioForm.controls.tipoAccion : null
        ),
        corte: new FormControl(
          previous ? this.tipoAuxilioForm.controls.corte : null
        )
      }))
    );
  }

  /**
   * @description Inicializa el formulario de filtro de transaccion no monetaria
   *
   */
  _initTransNoMonetariaFormGroup(previous?: boolean) {
    this.isTransaccionNoMonetariaForm = Promise.resolve(
      (this.transNoMonetariaForm = this.formBuilder.group({
        tipoSolicitud: new FormControl(
          previous ? this.transNoMonetariaForm.controls.tipoSolicitud : null
        ),
        tipoAccion: new FormControl(
          previous ? this.transNoMonetariaForm.controls.tipoAccion : null
        )
      }))
    );
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Escucha el click el de buscar el filtro de Numero de Solicitud
   */
  _onBuscarPorNumeroSolicitud() {
    // Usamos los custom validators debido a que no hay manera de hacerlos excluyentes desde
    // los formularios rectivos.
    if (
      CustomValidators.CampoVacio(
        this.numeroSolicitudForm.controls.numeroCedula.value
      ) &&
      CustomValidators.CampoVacio(
        this.numeroSolicitudForm.controls.numeroCaso.value
      ) &&
      CustomValidators.CampoVacio(this.numeroSolicitudForm.controls.corte.value)
    ) {
      this.numeroSolicitudForm.controls.numeroCedula.setErrors({
        incorrect: true
      });
      this.numeroSolicitudForm.controls.numeroCaso.setErrors({
        incorrect: true
      });
      this.numeroSolicitudForm.controls.corte.setErrors({ incorrect: true });
      this.validateForm(this.numeroSolicitudForm);
      this.translate.get('global.validateForm').subscribe(async texto => {
        await this.frontService.alert.warning(texto);
      });
      return;
    } else {
      this._initNumeroSolicitudFormGroup(true);
      this.validateForm(this.numeroSolicitudForm);
    }
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Escucha el click el de buscar el filtro Tipo Auxilio
   */
  _onBuscarPorTipoAuxilio() {
    // Usamos los custom validators debido a que no hay manera de hacerlos excluyentes desde
    // los formularios rectivos.
    if (
      CustomValidators.CampoVacio(
        this.tipoAuxilioForm.controls.tipoAuxilio.value
      ) &&
      CustomValidators.CampoVacio(
        this.tipoAuxilioForm.controls.tipoAccion.value
      ) &&
      CustomValidators.CampoVacio(this.tipoAuxilioForm.controls.corte.value)
    ) {
      this.tipoAuxilioForm.controls.tipoAuxilio.setErrors({ incorrect: true });
      this.tipoAuxilioForm.controls.tipoAccion.setErrors({ incorrect: true });
      this.tipoAuxilioForm.controls.corte.setErrors({ incorrect: true });
      this.validateForm(this.tipoAuxilioForm);
      this.translate.get('global.validateForm').subscribe(async texto => {
        await this.frontService.alert.warning(texto);
      });
      return;
    } else {
      this._initTipoAuxilioFormGroup(true);
      this.validateForm(this.tipoAuxilioForm);
    }
  }

  /**
   * @author: Jorge Luis Caviedes Alvarado
   * @description: escucha el click el de buscar el filtro Transaccion Monetaria
   */
  _onBuscarPorTransMonetaria() {
    // Usamos los custom validators debido a que no hay manera de hacerlos excluyentes desde
    // los formularios rectivos.
    if (
      CustomValidators.CampoVacio(
        this.transNoMonetariaForm.controls.tipoSolicitud.value
      ) &&
      CustomValidators.CampoVacio(
        this.transNoMonetariaForm.controls.tipoAccion.value
      )
    ) {
      this.transNoMonetariaForm.controls.tipoSolicitud.setErrors({
        incorrect: true
      });
      this.transNoMonetariaForm.controls.tipoAccion.setErrors({
        incorrect: true
      });
      this.validateForm(this.transNoMonetariaForm);
      this.translate.get('global.validateForm').subscribe(async texto => {
        await this.frontService.alert.warning(texto);
      });
      return;
    } else {
      this._initTransNoMonetariaFormGroup(true);
      this.validateForm(this.transNoMonetariaForm);
    }
  }

  /**
   * @description AL limpiar el formulario de filtro de numero de solicitud.
   *
   */
  _onLimpiarNumeroSolicitud() {
    this.numeroSolicitudForm.reset();
    this._initNumeroSolicitudFormGroup();
  }

  /**
   * @description Al limpiar el formulario de filtro por tipo de auxilio.
   *
   */
  _onLimpiarTipoAuxilio() {
    this.tipoAuxilioForm.reset();
    this._initTipoAuxilioFormGroup();
  }

  /**
   * @description Al limpiar el fomulario de filtro por transaccion monetaria.
   *
   */
  _onLimpiarTransMonetaria() {
    this.transNoMonetariaForm.reset();
    this._initTransNoMonetariaFormGroup();
  }

  /**
   * @description Al escribir en los autocompletar de cortes de facturacion
   * @param $event Evento de autocompletar por corte
   */
  _onAutocompleteCorte($event: any) {
    this.configuracion._autocompleteCortes = [];
    this.configuracion.cortes.forEach((corte: any) => {
      if (
        String(corte.valor).indexOf(String($event.query)) !== -1 ||
        String(corte.nombre).indexOf(String($event.query)) !== -1
      ) {
        this.configuracion._autocompleteCortes.push(corte);
      }
    });
  }

  /**
   * @description Al escribir en los autocompletar de tipo auxilio.
   * @param $event Evento de autocompletar por tipo auxilio.
   */
  _onAucotompleteTiposAuxilio($event: any) {
    this.configuracion._autocompleteTiposAuxilios = [];
    this.configuracion.tiposAuxilios.forEach((tipoAuxilio: any) => {
      if (
        String(tipoAuxilio.codigoAuxilioXtremo).indexOf(
          String($event.query)
        ) !== -1 ||
        String(tipoAuxilio.tipDescripcion).indexOf(
          String($event.query).toUpperCase()
        ) !== -1
      ) {
        this.configuracion._autocompleteTiposAuxilios.push(tipoAuxilio);
      }
    });
  }

  /**
   * @description Al escribir en los autocompletar de tipo acciones para el filtro de tipos de auxilio.
   * @param $event Evento de autocompletar pot tipos acciones.
   */
  _onAutocompleteAuxilioTiposAcciones($event: any) {
    this.configuracion._autocompleteAuxilioTiposAcciones = [];
    this.configuracion.auxilioTiposAcciones.forEach((tipoAccion: any) => {
      if (
        String(tipoAccion.codigo).indexOf(String($event.query)) !== -1 ||
        String(tipoAccion.nombre)
          .toUpperCase()
          .indexOf(String($event.query).toUpperCase()) !== -1
      ) {
        this.configuracion._autocompleteAuxilioTiposAcciones.push(tipoAccion);
      }
    });
  }

  /**
   * @description Al escribir en los autocompletar de tipo de solicitudes.
   * @param $event Evento de autocompletar pot tipos de solicitudes.
   */
  _onAutocompleteTiposSolicitudes($event: any) {
    this.configuracion._autocompleteTipoSolicitudes = [];
    this.configuracion.tipoSolicitudes.forEach((tipoSolicitud: any) => {
      if (
        String(tipoSolicitud.tipCodigo).indexOf(String($event.query)) !== -1 ||
        String(tipoSolicitud.tipDescripcion)
          .toUpperCase()
          .indexOf(String($event.query).toUpperCase()) !== -1
      ) {
        this.configuracion._autocompleteTipoSolicitudes.push(tipoSolicitud);
      }
    });
  }

  /**
   * @description Al escribir en los autocompletar de tipo acciones para el filtro de transaccion no monetaria.
   * @param $event Evento de autocompletar pot tipos acciones.
   */
  _onAutocompleteMonetarioTiposAcciones($event: any) {
    this.configuracion._autocompleteMonetarioTiposAcciones = [];
    this.configuracion.monetarioTiposAcciones.forEach((tipoAccion: any) => {
      if (
        String(tipoAccion.codigo).indexOf(String($event.query)) !== -1 ||
        String(tipoAccion.nombre)
          .toUpperCase()
          .indexOf(String($event.query).toUpperCase()) !== -1
      ) {
        this.configuracion._autocompleteMonetarioTiposAcciones.push(tipoAccion);
      }
    });
  }

  _obtenerTareas(pagina = 0, tamanio = 7, sort = 'actHiProcinst.startTime,asc') {
    const params: any = {
      assignee: this.frontService.authentication.getUser().username,
      active: true,
      includeProcessVariables: true, includeSuperProcessVariables: true,
      isPaged: false, isSorted: true, sort: sort, size: tamanio, page: pagina
    };

    return this.backService.runtime.getRuntimeTasks(params).pipe(
      map((datos: any) => {
        this.configuracion.gridListar.component.limpiar();
        if (datos || datos.length > 0) {
          this.configuracion.gridListar.component.cargarDatos(
            this.asignarColor(datos.content.sort((a, b) => b.daysManagement - a.daysManagement)), {
            maxPaginas: datos.totalPages,
            pagina: datos.number,
            cantidadRegistros: datos.totalElements
          });
        }
      }));
  }

  _obtenerTareasSiguiente($event) {
    this.configuracion.gridListar.component.limpiar();
    this._obtenerTareas($event.pagina, $event.tamano, $event.sort).subscribe();
  }

  _obtenerTareasAtras($event) {
    this.configuracion.gridListar.component.limpiar();
    this._obtenerTareas($event.pagina, $event.tamano, $event.sort).subscribe();
  }

  _onClickOpciones($event) {
    const key = $event?.col.key;
    if (key === '_processInstanceId') {
      this._onClickCeldaTarea($event?.dato);
    } else if (key === 'docs') {
      this._onClickCeldaDocs($event?.dato);
    } else {
      this.translate.get('global.opcionNoDisponible').subscribe(text => {
        this.frontService.alert.error(text);
      });
    }
  }

  _onClickCeldaTarea($event) {
    let url = $event && $event.formKey;

    if (url) {
      if (url.includes('{asoNumInt}')) {
        url = url.replace('{asoNumInt}', $event.variables.asoNumInt);
      }
      if (url.includes('{processInstanceId}')) {
        url = url.replace('{processInstanceId}', $event.processInstanceId);
      }
      if (url.includes('{codigoPlan}')) {
        url = url.replace('{codigoPlan}', $event.variables.codigoPlan);
      }
      if (url.includes('{codigo}')) {
        url = url.replace('{codigo}', $event.variables.codigoCliente);
      }
      if (url.includes('{codigoCobertura}')) {
        const codigoCobertura = $event.variables.codigoCobertura || $event.variables.codigoPlanCobertura;
        url = url.replace('{codigoCobertura}', codigoCobertura);
      }
      if (url.includes('{processInstanceId}')) {
        url = url.replace('{processInstanceId}', $event.processInstanceId);
      }
      if (url.includes('{taskId}')) {
        url = url.replace('{taskId}', $event.taskId);
      }
    } else {
      if ($event.variables.path && $event.variables.path.includes('#')) {
        url = $event.variables.path.split('#')[1].replace('solicitud', `${$event.processInstanceId}/${$event.taskId}`);
      } else {
        this.translate.get('home.mensajeErrorUrl').subscribe(text => {
          this.frontService.alert.error(text);
        });
      }
    }
    this.router.navigate([url]);
  }

  _onClickCeldaDocs($event) {
    const processInstanceId = $event?.processInstanceId;
    this.backService.documentosDocuware.notificarDigitalizacion(processInstanceId).subscribe((respuesta) => {
      this.translate.get('home.mensajeNotificacionDigitalizacion').subscribe(text => {
        this.frontService.alert.success(text).then(() => {
          this._obtenerTareas().subscribe();
        });
      });
    }, err => {
      this.frontService.alert.error(err.error.message);
    });
  }

  asignarColor(items: any) {
    const listObj = [];
    let item: any;
    for (item of items) {
      listObj.push({
        ...item,
        _processInstanceId: item.superProcessInstanceId ? item.superProcessInstanceId : item.processInstanceId,
        _color: this.colores.find(x =>
          (x.rangoInicial <= item.daysManagement && x.rangoFinal && x.rangoFinal >= item.daysManagement) ||
          (!x.rangoFinal)
        ).color
      });
    }
    return listObj;
  }

}
