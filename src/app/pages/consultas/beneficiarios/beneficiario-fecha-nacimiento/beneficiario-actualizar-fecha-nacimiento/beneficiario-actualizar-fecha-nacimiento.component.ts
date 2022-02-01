import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '@core/store/data.service';
import { Subscription } from 'rxjs';
import { Acciones } from '@core/store/acciones';
import { BeneficiariosActualizarFechaNacimientoConfig } from './beneficiario-actualizar-fecha-nacimiento.config';
import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DateUtil } from '@shared/util/date.util';
import { FormValidate } from '@shared/util';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-beneficiario-actualizar-fecha-nacimiento',
  templateUrl: './beneficiario-actualizar-fecha-nacimiento.component.html',
  styleUrls: ['./beneficiario-actualizar-fecha-nacimiento.component.css']
})
export class BeneficiarioActualizarFechaNacimientoComponent extends FormValidate implements OnInit, OnDestroy {

  subs: Subscription[] = [];
  builded: Promise<MimGridConfiguracion>;
  codBeneficiario: string;
  paramsBusqueda: any;
  redireccion: any;
  configuracion: BeneficiariosActualizarFechaNacimientoConfig = new BeneficiariosActualizarFechaNacimientoConfig();
  datosAsociados: any = {};
  form: FormGroup;
  isForm: Promise<any>;
  objectoPrevisualizar: any = {};
  estadoRegistrar = true;
  errorCambioFechaNacimiento = false;
  estadoLimpiar = false;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly dataService: DataService,
    private readonly formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService) {
    super();
  }

  ngOnInit() {
    this.loadDataBeneficiary();
    this.initForm();
  }

  private initForm() {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        fechaNacimientoActualizar: [null, [Validators.required]]
      }));
    this.changeErrorDinamico();
  }

  changeErrorDinamico() {
    this.form.controls.fechaNacimientoActualizar.valueChanges.subscribe((respuesta) => {
      if (respuesta) {
        this.errorCambioFechaNacimiento = false;
      }
      this.estadoRegistrar = true;
    });
  }

  private loadDataBeneficiary() {
    this.subs = [
      this.route.params.subscribe(params => {
        this.codBeneficiario = params['codBeneficiario'];
      }),

      this.dataService.beneficiarios().beneficiario.subscribe(dato => {
        if (dato && dato.accion === Acciones.Publicar) {
          dato.datosBeneficiario._esAsociado = dato.datosBeneficiario.esAsociado ? 'Si' : 'No';
          this.datosAsociados = dato.datosBeneficiario;
          this.generarObjecto(dato.datosBeneficiario);
        } else if (
          (!dato || dato.accion === Acciones.Borrar) &&
          this.codBeneficiario
        ) {
          this.getBeneficiarioPorCodigo();
        }
      }),
      this.route.queryParams.subscribe(params => {
        this.paramsBusqueda = params;
        this.redireccion = this.paramsBusqueda.vista;

      })
    ];
    this.getBeneficiarioAsociadosRelacion();
  }

  private getBeneficiarioPorCodigo(estadoAccion = false) {
    this.backService.beneficiarios
      .getBenetificiarioPorCodigo(this.codBeneficiario)
      .subscribe(respuesta => {
        if (!respuesta) {
          return;
        }
        const datos: any = respuesta;
        if (estadoAccion) {
          this.datosAsociados.benFecNac = datos.benFecNac;
        }
        this.generarObjecto(datos);
        this.dataService.beneficiarios().accion(Acciones.Publicar, datos);
      });
  }

  generarObjecto(datos: any) {
    this.objectoPrevisualizar.detalleBeneficiario = {
      'fechaNacimiento': datos.benFecNac, 'edadActual': datos.benEdad,
      'esAsociado': this.datosAsociados.esAsociado ? true : false,
      'codigoInvalidez': datos.benInvalidoId,
      'codigoSexo': this.datosAsociados.benSexo
    };
  }

  irAtras() {
    this.router.navigate(
      [this.redireccion],
      { queryParams: this.paramsBusqueda }
    );
  }

  onAtras(e) {
    this.getBeneficiarioAsociadosRelacion(e.pagina, e.tamano);
  }

  onSiguiente(e) {
    this.getBeneficiarioAsociadosRelacion(e.pagina, e.tamano);
  }

  ngOnDestroy() {
    (this.subs || []).forEach(x => x.unsubscribe());
    this.subs = undefined;
  }

  private getBeneficiarioAsociadosRelacion(pagina = 0, tamano = 10) {

    this.builded = null;

    this.backService.beneficiarios
      .getBeneficiariosAsociadoRelacionadoActualizacionFecha(this.codBeneficiario, {
        page: pagina, size: tamano, isPaged: true
      })
      .subscribe((respuesta: any) => {
        if (!respuesta || respuesta.content.length === 0) {
          return;
        }
        this.objectoPrevisualizar.asociadosRelacionados = respuesta.content;
        this.cargarAsociadosRelacionados(respuesta);
      },
        (err: any) => {
          if (err.status !== 404) {
            return;
          }
          this.translate.get('beneficiarios.actualizar.alertas.asociadosRelacionados').subscribe(text => {
            this.frontService.alert.info(text);
          });
        });
  }


  previsualizarActualizarFechaNacimiento(estadoAccion = false) {
    if (this.form.invalid) {
      this.errorCambioFechaNacimiento = true;
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((response: string) => {
        this.frontService.alert.error(response);
      });
      return;
    }
    this.objectoPrevisualizar.actualizarFecha = estadoAccion;
    this.objectoPrevisualizar.confirmarActualizacion = false;
    this.objectoPrevisualizar.detalleBeneficiario.nuevaFechaNacimiento = DateUtil.dateToString(this.form.controls.fechaNacimientoActualizar.value, 'dd-MM-yyyy');
    this.backService.beneficiarios.previsualizarActualizarFechaNacimiento(this.codBeneficiario, this.objectoPrevisualizar).subscribe(response => {
      this.estadoRegistrar = false;
      this.estadoLimpiar = true;
      if (estadoAccion) {
        this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
          this.frontService.alert.success(text).then(() => {
            this.cargarAsociadosRelacionados(response);
            this.getBeneficiarioPorCodigo(estadoAccion);
          });
        });
      } else {
        this.cargarAsociadosRelacionados(response);
      }
    }, (err) => {
      if (err.error.status === 409) {
        this.frontService.alert.confirm(err.error.message, 'info').then((confirma: any) => {
          if (confirma) {
            this.objectoPrevisualizar.confirmarActualizacion = true;
            this.estadoLimpiar = true;
            this.estadoRegistrar = false;
            this.backService.beneficiarios.previsualizarActualizarFechaNacimiento(this.codBeneficiario, this.objectoPrevisualizar).subscribe(response => {
              if (estadoAccion) {
                this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
                  this.frontService.alert.success(text).then(() => {
                    this.cargarAsociadosRelacionados(response);
                    this.getBeneficiarioPorCodigo(estadoAccion);
                  });
                });
              } else {
                this.cargarAsociadosRelacionados(response);
              }
            });
          }
        });
      } else {
        this.frontService.alert.error(err.error.message);
      }
    });
  }

  cargarAsociadosRelacionados(response: any) {
    this.configuracion.gridRelacionado.component.limpiar();
    this.configuracion.gridRelacionado.component.cargarDatos(
      response.content,
      {
        maxPaginas: response.totalPages,
        pagina: response.number,
        cantidadRegistros: response.totalElements
      }
    );
  }

  onLimpiar() {
    this.form.reset();
    if (this.estadoLimpiar) {
      this.getBeneficiarioAsociadosRelacion();
      this.estadoLimpiar = false;
    }
  }

}
