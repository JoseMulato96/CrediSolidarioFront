import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '@core/services';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { FormValidate } from '@shared/util';
import { Subscription } from 'rxjs/internal/Subscription';
import { AppState } from '../../../../core/store/reducers/index';
import { DesativarPanelAction } from '../../administador.accions';
import { AdministracionService } from '../../services/administracion.service';
import { LogNovedadesConfig } from './log-novedades.config';

@Component({
  selector: 'app-log-novedades',
  templateUrl: './log-novedades.component.html',
  styleUrls: ['./log-novedades.component.css']
})
export class LogNovedadesComponent extends FormValidate implements OnInit, OnDestroy {

  // VARIABLES
  configuracion: LogNovedadesConfig = new LogNovedadesConfig();
  form: FormGroup;
  isForm: Promise<any>;
  shownPanel = false;

  dataNovedades: [] = [];
  dataEntidades: [] = [];
  dataNombreEntidades: [] = [];
  subscription: Subscription = new Subscription();
  dataSubscription: Subscription = new Subscription();
  textNovedad: string;
  _cuentaPagoCodprodCodigo: number;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly alertService: AlertService,
    private readonly administracionService: AdministracionService,
    private readonly store: Store<AppState>
  ) {
    super();
  }

  ngOnInit() {
    this.subscription = this.store.select('admin')
      .subscribe(resp => {
        this.shownPanel = resp.activarPanel;
        // this.dataEntidades = resp.entidades
      });
    this.creacionForm();
    this.getData();
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description crea la configuracion de formulario
   */
  private creacionForm() {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        entidad: new FormControl(null, [Validators.required]),
        campoEntidad: new FormControl(null, [Validators.required]),
        novedades: new FormControl(null, [Validators.required])
      })
    );
  }

  formConfiguracionSeguridad() {
    if (!this.validateComponents()) {
      return;
    }
    this.guardar();
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description valida que los datos este completo y dilegenciados
   */
  validateComponents() {
    if (this.form.invalid) {
      this.validateForm(this.form);

      this.translate
        .get('global.validateForm')
        .subscribe(text => this.alertService.warning(text));
      return false;
    }

    return true;
  }

  private async guardar() {
    const form: any = this.form.value;

    const novedad = {
      codigo: form.novedades.codigo,
      descripcionNovedad: form.novedades.descripcionNovedad
    };
    const dato = {
      nombreTabla: form.entidad.nombreTabla,
      columnaTabla: form.campoEntidad.columna,
      codigoDescripcionNovedad: novedad
    };

    this.administracionService.guardarConfiguracion(dato).subscribe((resp: any) => {
      this.getData();
      this._onLimpiar();
      this.translate
        .get('global.actualizacionExitosaMensaje')
        .subscribe((text: string) => {
          this.alertService.success(text);
        });
    });
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Le asigna los datos que llegan al componente grid
   */
  private AsignarDatosGrid(datos: any) {
    return this.configuracion.gridLogNovedades.component.cargarDatos(
      datos.content,
      {
        maxPaginas: datos.totalPages,
        pagina: datos.number,
        cantidadRegistros: datos.totalElements
      }
    );
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description escucha el boton para abrir la consulta
   */
  activePanelRight(status: boolean) {
    this.shownPanel = status;
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description escucha el boton de cerrar y cerrar el modal
   */
  activePanelRightRadicaciones(status: boolean) {
    this.store.dispatch(new DesativarPanelAction());
  }

  agregarNovedad(novedad: string) {
    const datos = {
      descripcionNovedad: novedad
    };
    this.administracionService.guardarNovedad(datos).subscribe((resp: any) => {
      this.getData();
      this.activePanelRight(false);
      this.textNovedad = '';
      this.alertService.success(`La novedad "${resp['descripcionNovedad']}" se agrego correctamente`);
    });
  }


  _onLimpiar() {
    this.form.reset();
    this.creacionForm();
  }

  getData() {
    this._getNovedades();
    this._getEntidades();
    this._getConfiguraciones();
    this.dataNombreEntidades = [];
  }

  _getNovedades() {
    this.administracionService.getNovedades().subscribe((resp: any) => {
      this.dataNovedades = resp;
    });
  }

  _getEntidades() {
    this.administracionService.getEntidades().subscribe((resp: any) => {
      this.dataEntidades = resp.content;
    });
  }

  _changeEntidad() {
    const nombre = this.form.value.entidad.nombreTabla;
    this.administracionService.getNombreEntidas(nombre).subscribe((resp: any) => {
      this.dataNombreEntidades = resp;
    });
  }

  _getConfiguraciones() {
    this.administracionService.obtenerConfiguraciones()
      .subscribe((resp: any) => {
        this.configuracion.gridLogNovedades.component.cargarDatos(
          resp.content,
          {
            maxPaginas: resp.totalPages,
            pagina: resp.number,
            cantidadRegistros: resp.totalElements
          }
        );
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onEliminar($event) {
    const novedad = $event;

    this.translate.get('¿Esta seguro de eliminar el registro?', {
      novedad:
        novedad.columnaTabla + ' - ' + novedad.codigoDescripcionNovedad.codigoDescripcionNovedad
    }).subscribe((mensaje: string) => {
      this.alertService.confirm(mensaje, 'danger').then((desition: any) => {
        if (desition === true) {
          this.eliminarConfiguracion(novedad.codigo);
        }
      });
    });
  }

  eliminarConfiguracion(codigo: string) {
    this.administracionService.eliminarConfiguracion(codigo).subscribe((respuesta: any) => {
      this.translate.get('global.eliminadoExitosoMensaje').subscribe((mensaje: string) => {
        this.alertService.success(mensaje).then(() => {
          this.getData();
        });
      });

      this._getConfiguraciones();
    });
  }

  /**
  * @author Hander Fernando Gutierrez
  * @description escucha el boton atras de la tabla
  */
  _OnAtras(e: any) {
    this.getConfiguraciones(e.pagina, e.tamano);
  }

  /**
   * @author Hander Fernando Gutierrez
   * @description esucha el boton siguiente de la tabla
   */
  _OnSiguiente(e: any) {
    this.getConfiguraciones(e.pagina, e.tamano);
  }

  getConfiguraciones(pagina = 0, tamano = 10) {
    this.administracionService.getConfiguraciones(
      {
        page: pagina,
        size: tamano
      }
    )
      .subscribe((resp: any) => {
        const datos: any = resp;

        if (!datos || !datos['content'].length) {
          return;
        }
        this.configuracion.gridLogNovedades.component.cargarDatos(
          datos.content,
          {
            maxPaginas: datos.totalPages,
            pagina: datos.number,
            cantidadRegistros: datos.totalElements
          }
        );
      });
  }
}
