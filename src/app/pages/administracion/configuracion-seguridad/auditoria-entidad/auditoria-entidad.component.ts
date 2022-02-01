import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { CustomValidators, FormValidate } from '@shared/util';
import { AdministracionService } from '../../services/administracion.service';
import { AuditoriaEntidadConfig } from './auditoria-entidad.config';

@Component({
  selector: 'app-auditoria-entidad',
  templateUrl: './auditoria-entidad.component.html',
})
export class AuditoriaEntidadComponent extends FormValidate implements OnInit {

  // VARIABLES
  configuracion: AuditoriaEntidadConfig = new AuditoriaEntidadConfig();
  form: FormGroup;
  isForm: Promise<any>;
  activo = '1';
  inactivo = '2';
  _esCreacion = true;
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly administracionService: AdministracionService,
    private readonly translate: TranslateService,
    private readonly alertService: AlertService
  ) {
    super();
  }

  ngOnInit() {
    this.creacionForm();
    this._getAuditoria();
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description crea la configuracion de formulario
   */
  private creacionForm(valores?: boolean) {
    this.isForm = Promise.resolve(
      (this.form = this.formBuilder.group({
        entidad: new FormControl(
          valores ? this.form.controls.entidad.value : null,
          [Validators.required]
        ),
        descripcionEntidad: new FormControl({ value: null, disabled: true }, [Validators.required])
      }))
    );
  }

  /**Se obtiene el listado de auditoria para la grid */
  _getAuditoria() {
    this.administracionService.getAuditoria().subscribe((resp: any) => {
      resp.content = this.getButonAuditable(resp.content);
      const datos: any = resp;

      if (!datos || !datos['content'].length) {
        return;
      }
      this.configuracion.gridAuditoria.component.cargarDatos(
        datos.content,
        {
          maxPaginas: datos.totalPages,
          pagina: datos.number,
          cantidadRegistros: datos.totalElements
        }
      );
    });
  }

  /**Evento que dispara la accion de actualizar el estado de los permisos */
  onclick(event) {
    const parametros = this.getRowAuditable(event.col.titulo, event.dato);
    this.administracionService.actualizarRowAuditoria(parametros)
      .subscribe((resp: any) => {
        this._getAuditoria();
      });
  }

  /**Agrega a los parametro el campo aunditoria y se asigna el valor */
  getButonAuditable(datos: any) {
    const newArray: any[] = [];
    for (const x of datos) {
      newArray.push({
        ...x,
        auditoria: (x.actualizar === this.activo
          // || x.codigo == this.activo
          || x.crear === this.activo
          || x.eliminar === this.activo
          || x.leer === this.activo
          || x.nombreTabla === this.activo) ? this.activo : this.inactivo
      });
    }
    return newArray;
  }

  /** Formate el malor de los parametros de acuerdo a la accion */
  getRowAuditable(tipo: string, datos: any) {
    switch (tipo) {
      case 'AUDITABLE':
        return {
          ...datos,
          actualizar: datos.auditoria === this.activo ? this.inactivo : this.activo,
          crear: datos.auditoria === this.activo ? this.inactivo : this.activo,
          eliminar: datos.auditoria === this.activo ? this.inactivo : this.activo,
          leer: datos.auditoria === this.activo ? this.inactivo : this.activo
        };
      case 'C':
        return {
          ...datos,
          crear: datos.crear === this.activo ? this.inactivo : this.activo
        };
      case 'R':
        return {
          ...datos,
          leer: datos.leer === this.activo ? this.inactivo : this.activo
        };
      case 'U':
        return {
          ...datos,
          actualizar: datos.actualizar === this.activo ? this.inactivo : this.activo
        };
      case 'D':
        return {
          ...datos,
          eliminar: datos.eliminar === this.activo ? this.inactivo : this.activo
        };
      default:
        return datos;
    }
  }

  buscarNombreTabla() {
    this.administracionService.getNombreTabla(this.form.value.entidad)
      .subscribe(resp => {
        this.form.controls.descripcionEntidad.enable();
        this._esCreacion = false;
      }, error => {
        if (error.status === 404) {
          this.form.controls.descripcionEntidad.disable();
          this.translate.get(error.error.message).subscribe((mensaje: string) => {
            this.alertService.warning(mensaje);
          });
        }
      });
  }

  guardarTabla() {
    const form: any = this.form.getRawValue();
    if (form.entidad !== null && form.entidad !== '' && form.descripcionEntidad !== null && form.descripcionEntidad !== '') {
      const dato = {
        codigo: '',
        actualizar: this.inactivo,
        crear: this.inactivo,
        eliminar: this.inactivo,
        leer: this.inactivo,
        descripcion: form.descripcionEntidad,
        nombreTabla: form.entidad
      };
      this.administracionService.guardarTabla(dato)
        .subscribe(resp => {
          if (resp !== null && resp !== '') {
            this.translate.get('global.guardadoExitosoMensaje').subscribe((mensaje: string) => {
              this.alertService.success(mensaje);
            });
          }
          this._getAuditoria();
          this._onLimpiar();
        },
          error => {
            if (error.status === 400 || error.status === 404) {
              this.translate.get(error.error.message).subscribe((mensaje: string) => {
                this.alertService.warning(mensaje);
              });
            }
          });
    } else if (CustomValidators.CampoVacio(this.form.controls.entidad.value)) {

      this.translate
        .get('global.validateForm')
        .subscribe(async texto => {
          await this.alertService.warning(texto);
        });
      return;
    } else if (CustomValidators.CampoVacio(this.form.controls.descripcionEntidad.value)) {
      this.form.controls.descripcionEntidad.setErrors({ 'required2': true });
      this.form.controls.descripcionEntidad.markAsDirty();

      this.translate
        .get('global.validateForm')
        .subscribe(async texto => {
          await this.alertService.warning(texto);
        });
      return;
    }
  }

  _onLimpiar() {
    this.form.reset();
    this.form.controls.descripcionEntidad.disable();
    this.creacionForm();
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
    this.administracionService.getConfiguracionesAuditoria(
      {
        page: pagina,
        size: tamano
      }
    )
      .subscribe((resp: any) => {
        resp.content = this.getButonAuditable(resp.content);
        const datos: any = resp;

        if (!datos || !datos['content'].length) {
          return;
        }
        this.configuracion.gridAuditoria.component.cargarDatos(
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
